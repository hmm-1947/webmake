#!/usr/bin/env python3
"""
WebForge CLI.

Usage:
    python cli.py generate <spec.json> --out ./output/my-site [--overwrite]
    python cli.py validate <spec.json>
    python cli.py stats
"""
from __future__ import annotations

import argparse
import json
import sys

from engine.pipeline import (
    PipelineError,
    generate_from_spec_file,
    validate_spec_dict,
    _LIBRARY_ROOT,
)
from engine.core.registry import ComponentRegistry


def cmd_generate(args: argparse.Namespace) -> int:
    try:
        result = generate_from_spec_file(args.spec, args.out, overwrite=args.overwrite)
    except PipelineError as e:
        print(f"ERROR: {e}", file=sys.stderr)
        return 1
    except FileNotFoundError as e:
        print(f"ERROR: {e}", file=sys.stderr)
        return 1

    print(f"Generated site at: {result['output_dir']}")
    print(f"Pages written: {len(result['pages_written'])}")
    for page_path in result["pages_written"]:
        sections = result["match_report"].get(page_path, [])
        print(f"  {page_path}")
        for s in sections:
            print(f"    [{s['section']}] -> {s['component']}  (score {s['score']})")
    print(f"Components copied: {len(result['components_copied'])}")
    print(f"npm dependencies: {len(result['dependencies'])}")
    print()
    print("Next steps:")
    print(f"  cd {result['output_dir']}")
    print("  npm install")
    print("  npm run dev")
    return 0


def cmd_validate(args: argparse.Namespace) -> int:
    with open(args.spec, "r", encoding="utf-8") as f:
        spec_dict = json.load(f)
    try:
        validate_spec_dict(spec_dict)
    except PipelineError as e:
        print(f"INVALID:\n{e}", file=sys.stderr)
        return 1
    print("Spec is valid.")
    return 0


def cmd_stats(args: argparse.Namespace) -> int:
    registry = ComponentRegistry(_LIBRARY_ROOT).load()
    stats = registry.stats()
    print(f"Total components: {stats['total_components']}")
    print("By section type:")
    for section_type, count in stats["section_types"].items():
        print(f"  {section_type}: {count}")
    return 0


def main() -> int:
    parser = argparse.ArgumentParser(prog="webforge")
    sub = parser.add_subparsers(dest="command", required=True)

    p_gen = sub.add_parser("generate", help="Generate a Next.js site from a spec JSON file")
    p_gen.add_argument("spec", help="Path to website spec JSON")
    p_gen.add_argument("--out", required=True, help="Output directory for the generated project")
    p_gen.add_argument("--overwrite", action="store_true", help="Overwrite output dir if non-empty")
    p_gen.set_defaults(func=cmd_generate)

    p_val = sub.add_parser("validate", help="Validate a spec JSON file against the schema")
    p_val.add_argument("spec", help="Path to website spec JSON")
    p_val.set_defaults(func=cmd_validate)

    p_stats = sub.add_parser("stats", help="Show component library statistics")
    p_stats.set_defaults(func=cmd_stats)

    args = parser.parse_args()
    return args.func(args)


if __name__ == "__main__":
    sys.exit(main())
