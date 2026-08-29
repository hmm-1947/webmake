"""Tests for theme generation (design tokens -> Tailwind/CSS)."""
from engine.core.models import ColorScheme, DesignSystem, Typography
from engine.generation.theme import (
    font_import_name,
    generate_css_variables,
    generate_tailwind_config,
    hex_to_hsl_triplet,
)


def test_hex_to_hsl_triplet_black():
    assert hex_to_hsl_triplet("#000000") == "0 0% 0%"


def test_hex_to_hsl_triplet_white():
    assert hex_to_hsl_triplet("#ffffff") == "0 0% 100%"


def test_hex_to_hsl_triplet_handles_short_hex():
    long_form = hex_to_hsl_triplet("#3b82f6")
    short_form = hex_to_hsl_triplet("#36f")
    assert isinstance(long_form, str) and isinstance(short_form, str)


def test_hex_to_hsl_triplet_invalid_input_falls_back():
    result = hex_to_hsl_triplet("not-a-color")
    assert result  # doesn't raise, returns a fallback triplet string


def test_font_import_name_known_font():
    assert font_import_name("Playfair Display") == "Playfair_Display"


def test_font_import_name_unknown_font_still_underscored():
    assert font_import_name("Some Unknown Font") == "Some_Unknown_Font"


def test_generate_css_variables_contains_root_and_dark_blocks():
    design = DesignSystem(colors=ColorScheme(), typography=Typography())
    css = generate_css_variables(design)
    assert ":root" in css
    assert ".dark" in css
    assert "--primary" in css


def test_generate_tailwind_config_references_css_variables():
    design = DesignSystem(colors=ColorScheme(), typography=Typography())
    config = generate_tailwind_config(design)
    assert "hsl(var(--primary))" in config
    assert "darkMode" in config
