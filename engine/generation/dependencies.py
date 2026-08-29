"""
Resolves the full set of npm dependencies and component-to-component
dependencies needed for a generated site, from the matched components.
"""
from __future__ import annotations

from engine.core.models import AnimationSettings, MatchResult
from engine.core.registry import ComponentRegistry

BASE_DEPENDENCIES: dict[str, str] = {
    "next": "^15.0.0",
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
}

BASE_DEV_DEPENDENCIES: dict[str, str] = {
    "typescript": "^5.5.0",
    "@types/node": "^20.14.0",
    "@types/react": "^18.3.0",
    "@types/react-dom": "^18.3.0",
    "tailwindcss": "^3.4.0",
    "postcss": "^8.4.0",
    "autoprefixer": "^10.4.0",
    "eslint": "^8.57.0",
    "eslint-config-next": "^15.0.0",
}

# Known-version pins for common component requirements so generated
# package.json is deterministic rather than "latest".
KNOWN_VERSIONS: dict[str, str] = {
    "framer-motion": "^11.3.0",
    "lucide-react": "^0.400.0",
    "clsx": "^2.1.1",
    "tailwind-merge": "^2.4.0",
    "class-variance-authority": "^0.7.0",
    "embla-carousel-react": "^8.1.6",
    "react-hook-form": "^7.52.0",
    "zod": "^3.23.0",
    "@hookform/resolvers": "^3.9.0",
    "recharts": "^2.12.0",
    "date-fns": "^3.6.0",
}


def resolve_dependencies(
    matches: dict[str, list[MatchResult]],
    registry: ComponentRegistry,
    animations: AnimationSettings,
) -> dict[str, str]:
    deps = dict(BASE_DEPENDENCIES)

    all_matched: list[MatchResult] = [m for page_matches in matches.values() for m in page_matches]

    needs_animation = any(
        m.component.supports_animation and animations.level != "none" for m in all_matched
    )
    if needs_animation and animations.library == "framer-motion":
        deps["framer-motion"] = KNOWN_VERSIONS["framer-motion"]

    deps["clsx"] = KNOWN_VERSIONS["clsx"]
    deps["tailwind-merge"] = KNOWN_VERSIONS["tailwind-merge"]
    deps["lucide-react"] = KNOWN_VERSIONS["lucide-react"]

    seen_component_ids: set[str] = set()

    def collect(comp_id: str) -> None:
        if comp_id in seen_component_ids:
            return
        seen_component_ids.add(comp_id)
        comp = registry.get(comp_id)
        if comp is None:
            return
        for pkg in comp.requires:
            deps[pkg] = KNOWN_VERSIONS.get(pkg, "latest")
        for dep_id in comp.depends_on_components:
            collect(dep_id)

    for m in all_matched:
        collect(m.component.id)

    return dict(sorted(deps.items()))


def resolve_dev_dependencies() -> dict[str, str]:
    return dict(BASE_DEV_DEPENDENCIES)


def collect_component_dependency_closure(
    matches: dict[str, list[MatchResult]],
    registry: ComponentRegistry,
) -> set[str]:
    """All component ids needed, including transitively depended-on ones
    (e.g. a pricing section that composes a shared Badge atom)."""
    closure: set[str] = set()

    def visit(comp_id: str) -> None:
        if comp_id in closure:
            return
        closure.add(comp_id)
        comp = registry.get(comp_id)
        if comp is None:
            return
        for dep_id in comp.depends_on_components:
            visit(dep_id)

    for page_matches in matches.values():
        for m in page_matches:
            visit(m.component.id)

    return closure
