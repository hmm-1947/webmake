"""
Composes matched components into real Next.js App Router page files.

For each PageSpec, emits a page.tsx that imports each matched component
and renders it with props derived from the section's `content` payload,
validated/coerced against the component's declared `props` schema.
"""
from __future__ import annotations

import json
import re
from dataclasses import dataclass
from typing import Any

from engine.core.models import MatchResult, PageSpec, WebsiteSpec

_IDENTIFIER_RE = re.compile(r"[^a-zA-Z0-9_$]")


def _to_pascal_case(component_id: str) -> str:
    """'hero.split-image-01' -> 'HeroSplitImage01' — used as the local import symbol."""
    parts = re.split(r"[.\-_]", component_id)
    return "".join(p[:1].upper() + p[1:] for p in parts if p)


def component_import_path(component_id: str, base: str = "@/components/generated") -> str:
    """Canonical import path convention shared by the composer and by components
    that import each other (e.g. a section importing the shared ui.button atom)."""
    return f"{base}/{component_id.replace('.', '/')}"


def _import_symbol(component_id: str, occurrence_index: int) -> str:
    base = _to_pascal_case(component_id)
    return base if occurrence_index == 0 else f"{base}_{occurrence_index}"


def _coerce_prop_value(value: Any, prop_schema: dict) -> Any:
    """Light coercion so content authored loosely (e.g. numbers as strings)
    still lines up with the component's declared prop types where declared."""
    expected_type = prop_schema.get("type") if isinstance(prop_schema, dict) else None
    if expected_type == "string" and not isinstance(value, str):
        return json.dumps(value) if isinstance(value, (dict, list)) else str(value)
    if expected_type == "number" and isinstance(value, str):
        try:
            return float(value) if "." in value else int(value)
        except ValueError:
            return value
    return value


def _jsx_literal(value: Any) -> str:
    """Serializes a Python value into a JSX expression container, e.g. {"..."} / {[...]} / {{...}}."""
    if isinstance(value, bool):
        return "{" + ("true" if value else "false") + "}"
    if isinstance(value, (int, float)):
        return "{" + json.dumps(value) + "}"
    if isinstance(value, str):
        # Use a JS string literal, JSON-escaped (safe superset for our purposes)
        return "{" + json.dumps(value) + "}"
    # dict / list / None -> JSON expression
    return "{" + json.dumps(value) + "}"


@dataclass
class ComposedSection:
    import_symbol: str
    component_id: str
    import_path: str
    props_jsx: str


def build_props_jsx(match: MatchResult) -> str:
    """Builds the JSX attribute string for one matched component, e.g.
    `heading={"Ship faster"} items={[...]}`."""
    content = match.section.content or {}
    prop_defs: dict[str, Any] = match.component.props or {}

    attrs: list[str] = []
    for key, value in content.items():
        prop_schema = prop_defs.get(key, {})
        coerced = _coerce_prop_value(value, prop_schema if isinstance(prop_schema, dict) else {})
        attrs.append(f"{key}={_jsx_literal(coerced)}")

    return " ".join(attrs)


def compose_page(
    page: PageSpec,
    matches: list[MatchResult],
    site: WebsiteSpec,
    components_import_base: str = "@/components/generated",
) -> tuple[str, list[ComposedSection]]:
    """Returns (page.tsx source, [ComposedSection,...]) for one page."""
    id_occurrence: dict[str, int] = {}
    composed: list[ComposedSection] = []

    for match in matches:
        comp_id = match.component.id
        occ = id_occurrence.get(comp_id, 0)
        id_occurrence[comp_id] = occ + 1

        symbol = _import_symbol(comp_id, occ)
        import_path = component_import_path(comp_id, components_import_base)
        props_jsx = build_props_jsx(match)

        composed.append(ComposedSection(
            import_symbol=symbol,
            component_id=comp_id,
            import_path=import_path,
            props_jsx=props_jsx,
        ))

    imports = "\n".join(
        f'import {{ default as {c.import_symbol} }} from "{c.import_path}";' for c in composed
    )

    elements = "\n      ".join(
        f"<{c.import_symbol} {c.props_jsx} />" if c.props_jsx else f"<{c.import_symbol} />"
        for c in composed
    )

    is_home = page.is_home
    metadata_block = f"""export const metadata = {{
  title: "{_escape_js_string(page.name)} | {_escape_js_string(site.meta.name)}",
  description: "{_escape_js_string(site.meta.description)}",
}};
"""

    source = f"""{imports}

{metadata_block}
export default function Page() {{
  return (
    <main className="flex min-h-screen flex-col">
      {elements}
    </main>
  );
}}
"""
    return source, composed


def _escape_js_string(s: str) -> str:
    return s.replace("\\", "\\\\").replace('"', '\\"').replace("\n", " ")
