"""Tests for the component registry loader."""
import os

import pytest

from engine.core.registry import ComponentRegistry

LIBRARY_ROOT = os.path.join(os.path.dirname(os.path.dirname(__file__)), "library")


def test_registry_loads_without_error():
    registry = ComponentRegistry(LIBRARY_ROOT).load()
    assert len(registry) > 0


def test_registry_finds_expected_section_types():
    registry = ComponentRegistry(LIBRARY_ROOT).load()
    section_types = set(registry.section_types_available())
    for expected in ["hero", "navbar", "features", "pricing", "testimonials", "faq", "cta", "footer"]:
        assert expected in section_types, f"missing section type: {expected}"


def test_registry_no_duplicate_ids():
    registry = ComponentRegistry(LIBRARY_ROOT).load()
    ids = [c.id for c in registry.all()]
    assert len(ids) == len(set(ids))


def test_every_component_entry_file_exists():
    registry = ComponentRegistry(LIBRARY_ROOT).load()
    for comp in registry.all():
        entry_path = os.path.join(comp.source_dir, comp.entry)
        assert os.path.isfile(entry_path), f"{comp.id}: entry file missing at {entry_path}"


def test_registry_rejects_missing_library_dir(tmp_path):
    with pytest.raises(FileNotFoundError):
        ComponentRegistry(str(tmp_path / "nope")).load()


def test_get_returns_none_for_unknown_id():
    registry = ComponentRegistry(LIBRARY_ROOT).load()
    assert registry.get("nonexistent.component.id") is None


def test_by_section_type_returns_empty_list_for_unknown_type():
    registry = ComponentRegistry(LIBRARY_ROOT).load()
    assert registry.by_section_type("nonexistent-type") == []
