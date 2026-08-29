"""End-to-end pipeline tests: full spec -> generated project on disk."""
import json
import os

import pytest

from engine.pipeline import PipelineError, generate_from_spec_dict, validate_spec_dict

EXAMPLES_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "examples")


def _load_example(name: str) -> dict:
    with open(os.path.join(EXAMPLES_DIR, name), "r", encoding="utf-8") as f:
        return json.load(f)


def test_saas_landing_example_validates():
    spec = _load_example("saas-landing.json")
    validate_spec_dict(spec)  # should not raise


def test_portfolio_example_validates():
    spec = _load_example("portfolio-dark.json")
    validate_spec_dict(spec)  # should not raise


def test_invalid_spec_raises_pipeline_error():
    with pytest.raises(PipelineError):
        validate_spec_dict({"meta": {"name": "X"}})  # missing required fields


def test_generate_saas_landing_writes_expected_files(tmp_path):
    spec = _load_example("saas-landing.json")
    out_dir = str(tmp_path / "generated-site")
    result = generate_from_spec_dict(spec, out_dir, overwrite=True)

    assert os.path.isfile(os.path.join(out_dir, "package.json"))
    assert os.path.isfile(os.path.join(out_dir, "tailwind.config.ts"))
    assert os.path.isfile(os.path.join(out_dir, "app", "layout.tsx"))
    assert os.path.isfile(os.path.join(out_dir, "app", "page.tsx"))
    assert "/" in result["pages_written"]
    assert len(result["components_copied"]) > 0


def test_generate_creates_index_barrel_for_each_component(tmp_path):
    spec = _load_example("saas-landing.json")
    out_dir = str(tmp_path / "generated-site")
    generate_from_spec_dict(spec, out_dir, overwrite=True)

    components_root = os.path.join(out_dir, "components", "generated")
    found_index = False
    for root, _dirs, files in os.walk(components_root):
        if "index.ts" in files:
            found_index = True
            break
    assert found_index, "expected at least one component index.ts barrel file"


def test_generate_refuses_nonempty_dir_without_overwrite(tmp_path):
    spec = _load_example("saas-landing.json")
    out_dir = str(tmp_path / "generated-site")
    generate_from_spec_dict(spec, out_dir, overwrite=True)

    with pytest.raises(Exception):
        generate_from_spec_dict(spec, out_dir, overwrite=False)


def test_generate_portfolio_dark_site(tmp_path):
    spec = _load_example("portfolio-dark.json")
    out_dir = str(tmp_path / "nocturne-site")
    result = generate_from_spec_dict(spec, out_dir, overwrite=True)
    assert os.path.isfile(os.path.join(out_dir, "app", "page.tsx"))
    assert result["registry_stats"]["total_components"] > 0
