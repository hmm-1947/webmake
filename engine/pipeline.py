"""
Top-level pipeline: JSON spec -> validated WebsiteSpec -> component matching
-> generated Next.js project on disk.

This is the single public entrypoint the CLI (and any future API layer) calls.
"""
from __future__ import annotations

import json
import os
import re

import jsonschema

from engine.core.models import WebsiteSpec
from engine.core.registry import ComponentRegistry
from engine.matching.matcher import match_all_sections
from engine.generation.scaffold import scaffold_project

_THIS_DIR = os.path.dirname(os.path.abspath(__file__))
_REPO_ROOT = os.path.dirname(_THIS_DIR)
_SCHEMA_PATH = os.path.join(_REPO_ROOT, "spec", "website_spec.schema.json")
_LIBRARY_ROOT = os.path.join(_REPO_ROOT, "library")

class PipelineError(Exception):
    pass


def load_schema() -> dict:
    with open(_SCHEMA_PATH, "r", encoding="utf-8") as f:
        return json.load(f)


def validate_spec_dict(spec_dict: dict) -> None:
    schema = load_schema()
    validator = jsonschema.Draft7Validator(schema)
    errors = sorted(validator.iter_errors(spec_dict), key=lambda e: e.path)
    if errors:
        messages = [f"  - {'/'.join(str(p) for p in e.path)}: {e.message}" for e in errors]
        raise PipelineError("Website spec failed schema validation:\n" + "\n".join(messages))


def _collect_internal_links(value):
    """Find internal route hrefs anywhere inside section content."""
    found = set()
    if isinstance(value, dict):
        for key, item in value.items():
            if key.lower() in {"href", "ctahref", "url", "link"} and isinstance(item, str):
                if item.startswith("/") and not item.startswith("//") and item != "/":
                    found.add(item.split("#", 1)[0].split("?", 1)[0].rstrip("/") or "/")
            else:
                found.update(_collect_internal_links(item))
    elif isinstance(value, list):
        for item in value:
            found.update(_collect_internal_links(item))
    return found



def _apply_default_media(spec_dict: dict) -> None:
    """Resolve empty media fields to bundled assets so generated sites never show broken media."""
    default_image = "/assets/images/default-hero.svg"
    default_card = "/assets/images/default-card.svg"
    default_video = "/assets/videos/default-hero.mp4"

    def walk(value):
        if isinstance(value, dict):
            for key, item in list(value.items()):
                k = key.lower()
                if k in {"imageurl", "image", "src"} and isinstance(item, str) and not item.strip():
                    value[key] = default_card
                elif k == "posterurl" and isinstance(item, str) and not item.strip():
                    value[key] = default_card
                elif k in {"videourl", "video", "video_src"} and isinstance(item, str) and not item.strip():
                    value[key] = default_video
                else:
                    walk(item)
        elif isinstance(value, list):
            for item in value:
                walk(item)

    meta = spec_dict.setdefault("meta", {})
    if not meta.get("ogImage"):
        meta["ogImage"] = default_image
    walk(spec_dict.get("pages", []))
def _ensure_linked_pages(spec_dict: dict) -> list[str]:
    """Create simple pages for internal links that have no explicit PageSpec."""
    if spec_dict.get("autoGenerateLinkedPages", True) is False:
        return []
    pages = spec_dict.setdefault("pages", [])
    existing = {str(p.get("path", "/")).rstrip("/") or "/" for p in pages}
    links = _collect_internal_links(spec_dict.get("pages", []))
    created = []
    for path in sorted(links):
        normalized = path.rstrip("/") or "/"
        if normalized in existing:
            continue
        slug = normalized.strip("/").split("/")[-1].replace("-", " ").replace("_", " ")
        name = " ".join(word.capitalize() for word in slug.split()) or "Page"
        pages.append({
            "path": normalized,
            "name": name,
            "description": f"{name} page for {spec_dict.get('meta', {}).get('name', 'the website')}.",
            "sections": [
                {"type": "navbar", "layout": "top-simple", "content": {"logoText": spec_dict.get("meta", {}).get("name", "Brand"), "links": []}},
                {"type": "hero", "layout": "centered", "content": {"heading": name, "subheading": f"Explore {name.lower()} and discover more."}},
                {"type": "cta", "layout": "centered-banner", "content": {"heading": "Ready to continue?", "ctaLabel": "Back home", "ctaHref": "/"}},
                {"type": "footer", "layout": "multi-column", "content": {"logoText": spec_dict.get("meta", {}).get("name", "Brand")}}
            ]
        })
        existing.add(normalized)
        created.append(normalized)
    return created



def generate_from_spec_dict(
    spec_dict: dict,
    output_dir: str,
    library_root: str = _LIBRARY_ROOT,
    overwrite: bool = False,
    validate: bool = True,
    preserve_node_modules: bool = False,
) -> dict:
    auto_pages = _ensure_linked_pages(spec_dict)
    _apply_default_media(spec_dict)
    if validate:
        validate_spec_dict(spec_dict)
    # Keep the latest editable source available to the local dashboard.
    dashboard_dir = os.path.join(_REPO_ROOT, "dashboard")
    os.makedirs(dashboard_dir, exist_ok=True)
    with open(os.path.join(dashboard_dir, "site.json"), "w", encoding="utf-8") as f:
        json.dump(spec_dict, f, indent=2, ensure_ascii=False)

    site = WebsiteSpec.from_dict(spec_dict)
    registry = ComponentRegistry(library_root).load()
    if len(registry) == 0:
        raise PipelineError(
            f"Component registry at '{library_root}' has zero components. "
            "Add at least one component (folder with meta.json + entry .tsx) before generating."
        )

    matches = match_all_sections(site.pages, registry, site.design_system, site.animations, site.site_type, site.meta)

    result = scaffold_project(
        site, matches, registry, output_dir, overwrite=overwrite, preserve_node_modules=preserve_node_modules
    )
    result["registry_stats"] = registry.stats()
    result["auto_generated_pages"] = auto_pages
    result["match_report"] = {
        page_path: [
            {"section": m.section.type, "component": m.component.id, "score": round(m.score, 2)}
            for m in page_matches
        ]
        for page_path, page_matches in matches.items()
    }
    return result



def generate_from_spec_file(
    spec_path: str,
    output_dir: str,
    library_root: str = _LIBRARY_ROOT,
    overwrite: bool = False,
) -> dict:
    with open(spec_path, "r", encoding="utf-8") as f:
        spec_dict = json.load(f)
    return generate_from_spec_dict(spec_dict, output_dir, library_root=library_root, overwrite=overwrite)
