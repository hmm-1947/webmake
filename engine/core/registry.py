"""
Component registry: discovers and indexes every component in /library/components
by scanning for meta.json sidecar files. No hardcoded component list anywhere —
dropping a new folder with a valid meta.json + .tsx is enough to register it.
"""
from __future__ import annotations

import json
import os
from collections import defaultdict
from typing import Iterable, Optional

from engine.core.models import ComponentMeta


class ComponentRegistry:
    def __init__(self, library_root: str):
        self.library_root = library_root
        self._by_id: dict[str, ComponentMeta] = {}
        self._by_section_type: dict[str, list[ComponentMeta]] = defaultdict(list)
        self._loaded = False

    def load(self) -> "ComponentRegistry":
        self._by_id.clear()
        self._by_section_type.clear()

        components_dir = os.path.join(self.library_root, "components")
        if not os.path.isdir(components_dir):
            raise FileNotFoundError(f"Component library not found at {components_dir}")

        for root, _dirs, files in os.walk(components_dir):
            if "meta.json" not in files:
                continue
            meta_path = os.path.join(root, "meta.json")
            try:
                with open(meta_path, "r", encoding="utf-8") as f:
                    raw = json.load(f)
            except (json.JSONDecodeError, OSError) as e:
                raise ValueError(f"Invalid component metadata at {meta_path}: {e}") from e

            self._validate_raw(raw, meta_path)
            comp = ComponentMeta.from_dict(raw, source_dir=root)

            entry_path = os.path.join(root, comp.entry)
            if not os.path.isfile(entry_path):
                raise FileNotFoundError(
                    f"Component '{comp.id}' declares entry '{comp.entry}' "
                    f"but no such file exists at {entry_path}"
                )

            if comp.id in self._by_id:
                raise ValueError(f"Duplicate component id '{comp.id}' found at {meta_path}")

            self._by_id[comp.id] = comp
            self._by_section_type[comp.section_type].append(comp)

        self._loaded = True
        return self

    @staticmethod
    def _validate_raw(raw: dict, path: str) -> None:
        required = ["id", "sectionType", "entry", "props"]
        missing = [k for k in required if k not in raw]
        if missing:
            raise ValueError(f"{path}: missing required fields {missing}")

    def get(self, component_id: str) -> Optional[ComponentMeta]:
        return self._by_id.get(component_id)

    def by_section_type(self, section_type: str) -> list[ComponentMeta]:
        return list(self._by_section_type.get(section_type, []))

    def all(self) -> Iterable[ComponentMeta]:
        return self._by_id.values()

    def section_types_available(self) -> list[str]:
        return sorted(self._by_section_type.keys())

    def __len__(self) -> int:
        return len(self._by_id)

    def stats(self) -> dict:
        return {
            "total_components": len(self._by_id),
            "section_types": {k: len(v) for k, v in sorted(self._by_section_type.items())},
        }
