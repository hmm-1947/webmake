"""
Core data models for WebForge.

These mirror the JSON schemas in /spec but as typed Python dataclasses,
used throughout the matching and generation pipeline.
"""
from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any, Optional


# --------------------------------------------------------------------------
# Website specification (AI output)
# --------------------------------------------------------------------------

@dataclass
class ColorScheme:
    mode: str = "light"
    primary: str = "#111111"
    secondary: str = "#6b7280"
    accent: str = "#3b82f6"
    neutral: str = "#f5f5f5"
    background: str = "#ffffff"
    surface: str = "#fafafa"

    @staticmethod
    def from_dict(d: dict) -> "ColorScheme":
        return ColorScheme(
            mode=d.get("mode", "light"),
            primary=d.get("primary", "#111111"),
            secondary=d.get("secondary", "#6b7280"),
            accent=d.get("accent", "#3b82f6"),
            neutral=d.get("neutral", "#f5f5f5"),
            background=d.get("background", "#ffffff"),
            surface=d.get("surface", "#fafafa"),
        )


@dataclass
class Typography:
    heading_font: str = "Inter"
    body_font: str = "Inter"
    mono_font: str = "JetBrains Mono"
    scale: str = "comfortable"

    @staticmethod
    def from_dict(d: dict) -> "Typography":
        return Typography(
            heading_font=d.get("headingFont", "Inter"),
            body_font=d.get("bodyFont", "Inter"),
            mono_font=d.get("monoFont", "JetBrains Mono"),
            scale=d.get("scale", "comfortable"),
        )


@dataclass
class DesignSystem:
    style: str = "modern-minimal"
    colors: ColorScheme = field(default_factory=ColorScheme)
    typography: Typography = field(default_factory=Typography)
    radius: str = "md"
    density: str = "regular"
    shadow_intensity: str = "subtle"

    @staticmethod
    def from_dict(d: dict) -> "DesignSystem":
        return DesignSystem(
            style=d.get("style", "modern-minimal"),
            colors=ColorScheme.from_dict(d.get("colors", {})),
            typography=Typography.from_dict(d.get("typography", {})),
            radius=d.get("radius", "md"),
            density=d.get("density", "regular"),
            shadow_intensity=d.get("shadowIntensity", "subtle"),
        )


@dataclass
class AnimationSettings:
    level: str = "subtle"
    scroll_reveal: bool = True
    page_transitions: bool = False
    hover_effects: bool = True
    library: str = "framer-motion"

    @staticmethod
    def from_dict(d: dict) -> "AnimationSettings":
        return AnimationSettings(
            level=d.get("level", "subtle"),
            scroll_reveal=d.get("scrollReveal", True),
            page_transitions=d.get("pageTransitions", False),
            hover_effects=d.get("hoverEffects", True),
            library=d.get("library", "framer-motion"),
        )


@dataclass
class SectionSpec:
    type: str
    layout: str = "default"
    variant: Optional[str] = None
    content: dict[str, Any] = field(default_factory=dict)
    component_hint: Optional[str] = None

    @staticmethod
    def from_dict(d: dict) -> "SectionSpec":
        return SectionSpec(
            type=d["type"],
            layout=d.get("layout", "default"),
            variant=d.get("variant"),
            content=d.get("content", {}) or {},
            component_hint=d.get("componentHint"),
        )


@dataclass
class PageSpec:
    path: str
    name: str
    is_home: bool = False
    description: Optional[str] = None
    sections: list[SectionSpec] = field(default_factory=list)

    @staticmethod
    def from_dict(d: dict) -> "PageSpec":
        return PageSpec(
            path=d["path"],
            name=d["name"],
            is_home=d.get("isHome", False),
            description=d.get("description"),
            sections=[SectionSpec.from_dict(s) for s in d.get("sections", [])],
        )


@dataclass
class LayoutSpec:
    max_width: str = "standard"
    nav_style: str = "top-simple"
    footer_style: str = "multi-column"

    @staticmethod
    def from_dict(d: dict) -> "LayoutSpec":
        return LayoutSpec(
            max_width=d.get("maxWidth", "standard"),
            nav_style=d.get("navStyle", "top-simple"),
            footer_style=d.get("footerStyle", "multi-column"),
        )


@dataclass
class SiteMeta:
    name: str
    description: str
    industry: Optional[str] = None
    target_audience: Optional[str] = None
    tone: str = "professional"
    site_url: str = "https://example.com"
    og_image: str = "/og-image.png"
    twitter_handle: Optional[str] = None

    @staticmethod
    def from_dict(d: dict) -> "SiteMeta":
        return SiteMeta(
            name=d["name"],
            description=d["description"],
            industry=d.get("industry"),
            target_audience=d.get("targetAudience"),
            tone=d.get("tone", "professional"),
            site_url=(d.get("siteUrl") or "https://example.com").rstrip("/"),
            og_image=d.get("ogImage", "/og-image.png"),
            twitter_handle=d.get("twitterHandle"),
        )


@dataclass
class WebsiteSpec:
    meta: SiteMeta
    site_type: str
    design_system: DesignSystem
    pages: list[PageSpec]
    animations: AnimationSettings = field(default_factory=AnimationSettings)
    features: list[str] = field(default_factory=list)
    layout: LayoutSpec = field(default_factory=LayoutSpec)

    @staticmethod
    def from_dict(d: dict) -> "WebsiteSpec":
        return WebsiteSpec(
            meta=SiteMeta.from_dict(d["meta"]),
            site_type=d["siteType"],
            design_system=DesignSystem.from_dict(d["designSystem"]),
            pages=[PageSpec.from_dict(p) for p in d.get("pages", [])],
            animations=AnimationSettings.from_dict(d.get("animations", {})),
            features=d.get("features", []),
            layout=LayoutSpec.from_dict(d.get("layout", {})),
        )


# --------------------------------------------------------------------------
# Component library
# --------------------------------------------------------------------------

@dataclass
class ComponentMeta:
    id: str
    section_type: str
    layout: str
    style: list[str]
    entry: str
    props: dict[str, Any]
    industry: list[str] = field(default_factory=list)
    tone: list[str] = field(default_factory=list)
    requires: list[str] = field(default_factory=list)
    depends_on_components: list[str] = field(default_factory=list)
    supports_animation: bool = True
    animation_level: list[str] = field(default_factory=lambda: ["none", "subtle", "moderate", "expressive"])
    dark_mode_aware: bool = True
    responsiveness: str = "mobile-first"
    complexity: str = "section"
    weight: float = 1.0
    preview_description: str = ""
    # populated by the loader, not from JSON:
    source_dir: str = ""

    @staticmethod
    def from_dict(d: dict, source_dir: str = "") -> "ComponentMeta":
        return ComponentMeta(
            id=d["id"],
            section_type=d["sectionType"],
            layout=d.get("layout", "default"),
            style=d.get("style", []),
            entry=d["entry"],
            props=d.get("props", {}),
            industry=d.get("industry", []),
            tone=d.get("tone", []),
            requires=d.get("requires", []),
            depends_on_components=d.get("dependsOnComponents", []),
            supports_animation=d.get("supportsAnimation", True),
            animation_level=d.get("animationLevel", ["none", "subtle", "moderate", "expressive"]),
            dark_mode_aware=d.get("darkModeAware", True),
            responsiveness=d.get("responsiveness", "mobile-first"),
            complexity=d.get("complexity", "section"),
            weight=d.get("weight", 1.0),
            preview_description=d.get("previewDescription", ""),
            source_dir=source_dir,
        )


@dataclass
class MatchResult:
    section: SectionSpec
    component: ComponentMeta
    score: float
    reasons: list[str] = field(default_factory=list)
