"""
Top-level pipeline: JSON spec -> validated WebsiteSpec -> component matching
-> generated Next.js project on disk.

This is the single public entrypoint the CLI (and any future API layer) calls.
"""
from __future__ import annotations

import json
import os

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


def generate_from_spec_dict(
    spec_dict: dict,
    output_dir: str,
    library_root: str = _LIBRARY_ROOT,
    overwrite: bool = False,
    validate: bool = True,
) -> dict:
    if validate:
        validate_spec_dict(spec_dict)

    site = WebsiteSpec.from_dict(spec_dict)

    registry = ComponentRegistry(library_root).load()
    if len(registry) == 0:
        raise PipelineError(
            f"Component registry at '{library_root}' has zero components. "
            "Add at least one component (folder with meta.json + entry .tsx) before generating."
        )

    matches = match_all_sections(site.pages, registry, site.design_system, site.animations, site.site_type, site.meta)

    result = scaffold_project(site, matches, registry, output_dir, overwrite=overwrite)
    result["registry_stats"] = registry.stats()
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
