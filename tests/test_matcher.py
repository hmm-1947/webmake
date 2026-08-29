"""Tests for component matching logic."""
import os

import pytest

from engine.core.models import (
    AnimationSettings,
    ColorScheme,
    DesignSystem,
    SectionSpec,
    SiteMeta,
    Typography,
)
from engine.core.registry import ComponentRegistry
from engine.matching.matcher import NoMatchError, match_section

LIBRARY_ROOT = os.path.join(os.path.dirname(os.path.dirname(__file__)), "library")


@pytest.fixture(scope="module")
def registry():
    return ComponentRegistry(LIBRARY_ROOT).load()


@pytest.fixture
def default_design():
    return DesignSystem(style="modern-minimal", colors=ColorScheme(), typography=Typography())


@pytest.fixture
def default_animations():
    return AnimationSettings(level="moderate")


def test_match_section_raises_for_unknown_section_type(registry, default_design, default_animations):
    section = SectionSpec(type="totally-unknown-section")
    with pytest.raises(NoMatchError):
        match_section(section, registry, default_design, default_animations, "saas-landing", "professional")


def test_match_section_returns_component_of_correct_type(registry, default_design, default_animations):
    section = SectionSpec(type="hero", layout="split")
    result = match_section(section, registry, default_design, default_animations, "saas-landing", "professional")
    assert result.component.section_type == "hero"


def test_explicit_component_hint_is_honored(registry, default_design, default_animations):
    section = SectionSpec(type="hero", component_hint="hero.centered")
    result = match_section(section, registry, default_design, default_animations, "portfolio", "minimal")
    assert result.component.id == "hero.centered"


def test_style_match_outscores_style_mismatch(registry, default_animations):
    monochrome_design = DesignSystem(style="monochrome", colors=ColorScheme(), typography=Typography())
    section = SectionSpec(type="hero")
    result = match_section(section, registry, monochrome_design, default_animations, "portfolio", "minimal")
    assert "monochrome" in result.component.style


def test_layout_hint_prefers_exact_layout_match(registry, default_design, default_animations):
    section = SectionSpec(type="hero", layout="centered")
    result = match_section(section, registry, default_design, default_animations, "portfolio", "minimal")
    assert result.component.layout == "centered"


def test_match_result_score_is_positive(registry, default_design, default_animations):
    section = SectionSpec(type="features", layout="grid-3")
    result = match_section(section, registry, default_design, default_animations, "saas-landing", "professional")
    assert result.score > 0
