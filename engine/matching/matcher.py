"""
Component matching engine.

Given a SectionSpec (from the AI-generated website spec) and the DesignSystem/
AnimationSettings context, scores every candidate ComponentMeta of the right
sectionType and returns the best match. Pure, deterministic, explainable
(reasons are attached for debugging/logging) and has no dependency on any
specific component count — scales to a registry of thousands.
"""
from __future__ import annotations

from typing import Optional

from engine.core.models import (
    AnimationSettings,
    ComponentMeta,
    DesignSystem,
    MatchResult,
    SectionSpec,
    SiteMeta,
)
from engine.core.registry import ComponentRegistry

# Weights for each scoring dimension. Tuned so style/industry dominate but
# layout and animation compatibility still meaningfully break ties.
WEIGHT_EXPLICIT_HINT = 1000.0
WEIGHT_STYLE_MATCH = 12.0
WEIGHT_INDUSTRY_MATCH = 8.0
WEIGHT_TONE_MATCH = 5.0
WEIGHT_LAYOUT_MATCH = 6.0
WEIGHT_VARIANT_MATCH = 3.0
WEIGHT_ANIMATION_COMPATIBLE = 2.0
WEIGHT_UNIVERSAL_FALLBACK = 1.0  # components tagged industry=['*'] or [] still score something


class NoMatchError(Exception):
    def __init__(self, section: SectionSpec):
        self.section = section
        super().__init__(
            f"No component available for sectionType='{section.type}'. "
            f"The library has no registered component of this type."
        )


def score_component(
    section: SectionSpec,
    component: ComponentMeta,
    design: DesignSystem,
    animations: AnimationSettings,
    site_type: str,
    tone: str,
) -> tuple[float, list[str]]:
    score = 0.0
    reasons: list[str] = []

    if section.component_hint and section.component_hint == component.id:
        score += WEIGHT_EXPLICIT_HINT
        reasons.append("explicit componentHint match")

    if design.style in component.style:
        score += WEIGHT_STYLE_MATCH
        reasons.append(f"style '{design.style}' supported")
    elif not component.style:
        score += WEIGHT_STYLE_MATCH * 0.3
        reasons.append("style-agnostic component")

    if not component.industry or "*" in component.industry:
        score += WEIGHT_UNIVERSAL_FALLBACK
        reasons.append("universal industry fit")
    elif site_type in component.industry:
        score += WEIGHT_INDUSTRY_MATCH
        reasons.append(f"industry '{site_type}' match")

    if not component.tone or tone in component.tone:
        score += WEIGHT_TONE_MATCH * (0.4 if not component.tone else 1.0)
        if component.tone:
            reasons.append(f"tone '{tone}' match")

    if section.layout and section.layout != "default":
        if component.layout == section.layout:
            score += WEIGHT_LAYOUT_MATCH
            reasons.append(f"layout '{section.layout}' exact match")
        else:
            reasons.append(f"layout mismatch (wanted {section.layout}, got {component.layout})")
    else:
        score += WEIGHT_LAYOUT_MATCH * 0.5

    if section.variant and component.id.endswith(section.variant):
        score += WEIGHT_VARIANT_MATCH
        reasons.append(f"variant '{section.variant}' match")

    if animations.level in component.animation_level:
        score += WEIGHT_ANIMATION_COMPATIBLE
        reasons.append(f"animation level '{animations.level}' supported")
    elif animations.level == "none":
        score += WEIGHT_ANIMATION_COMPATIBLE  # anything is fine with no animation

    score += component.weight * 0.5

    return score, reasons


def match_section(
    section: SectionSpec,
    registry: ComponentRegistry,
    design: DesignSystem,
    animations: AnimationSettings,
    site_type: str,
    tone: str,
) -> MatchResult:
    candidates = registry.by_section_type(section.type)
    if not candidates:
        raise NoMatchError(section)

    if section.component_hint:
        hinted = registry.get(section.component_hint)
        if hinted is not None and hinted.section_type == section.type:
            candidates = [hinted]

    best: Optional[ComponentMeta] = None
    best_score = -1.0
    best_reasons: list[str] = []

    for comp in candidates:
        s, reasons = score_component(section, comp, design, animations, site_type, tone)
        if s > best_score:
            best_score = s
            best = comp
            best_reasons = reasons

    assert best is not None
    return MatchResult(section=section, component=best, score=best_score, reasons=best_reasons)


def match_all_sections(
    pages,
    registry: ComponentRegistry,
    design: DesignSystem,
    animations: AnimationSettings,
    site_type: str,
    meta: SiteMeta,
) -> dict[str, list[MatchResult]]:
    """Returns {page.path: [MatchResult, ...]} preserving section order."""
    results: dict[str, list[MatchResult]] = {}
    for page in pages:
        page_results = []
        for section in page.sections:
            match = match_section(section, registry, design, animations, site_type, meta.tone)
            page_results.append(match)
        results[page.path] = page_results
    return results
