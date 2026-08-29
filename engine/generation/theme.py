"""
Translates a DesignSystem spec into concrete, generated files:
  - tailwind.config.ts (extended theme: colors, fonts, radius, shadows)
  - app/globals.css (CSS variables, font-face imports via next/font is handled in layout.tsx generator)

This is what makes the generated output a real, themed site rather than
generic unstyled markup.
"""
from __future__ import annotations

from engine.core.models import DesignSystem

RADIUS_MAP = {
    "none": "0px",
    "sm": "0.25rem",
    "md": "0.5rem",
    "lg": "0.75rem",
    "xl": "1rem",
    "full": "9999px",
}

SHADOW_MAP = {
    "none": "none",
    "subtle": "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    "medium": "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
    "strong": "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
}

# Google Fonts slug mapping for common font names -> next/font/google import names
GOOGLE_FONT_MAP = {
    "Inter": "Inter",
    "Roboto": "Roboto",
    "Poppins": "Poppins",
    "Playfair Display": "Playfair_Display",
    "Space Grotesk": "Space_Grotesk",
    "JetBrains Mono": "JetBrains_Mono",
    "Manrope": "Manrope",
    "Sora": "Sora",
    "DM Sans": "DM_Sans",
    "Outfit": "Outfit",
    "Plus Jakarta Sans": "Plus_Jakarta_Sans",
    "Lora": "Lora",
    "Montserrat": "Montserrat",
    "Work Sans": "Work_Sans",
}


def font_import_name(font: str) -> str:
    return GOOGLE_FONT_MAP.get(font, font.replace(" ", "_"))


def hex_to_hsl_triplet(hex_color: str) -> str:
    """Converts '#3b82f6' -> '217 91% 60%' for CSS var HSL usage (shadcn-style)."""
    hex_color = hex_color.lstrip("#")
    if len(hex_color) == 3:
        hex_color = "".join(c * 2 for c in hex_color)
    try:
        r, g, b = (int(hex_color[i:i + 2], 16) / 255.0 for i in (0, 2, 4))
    except (ValueError, IndexError):
        r, g, b = 0.07, 0.07, 0.07  # fallback near-black

    mx, mn = max(r, g, b), min(r, g, b)
    light = (mx + mn) / 2
    if mx == mn:
        h = s = 0.0
    else:
        d = mx - mn
        s = d / (2 - mx - mn) if light > 0.5 else d / (mx + mn)
        if mx == r:
            h = (g - b) / d + (6 if g < b else 0)
        elif mx == g:
            h = (b - r) / d + 2
        else:
            h = (r - g) / d + 4
        h /= 6
    return f"{round(h * 360)} {round(s * 100)}% {round(light * 100)}%"


def generate_css_variables(design: DesignSystem) -> str:
    c = design.colors
    light_vars = {
        "--background": hex_to_hsl_triplet(c.background),
        "--foreground": hex_to_hsl_triplet(c.primary),
        "--primary": hex_to_hsl_triplet(c.primary),
        "--primary-foreground": hex_to_hsl_triplet(c.background),
        "--secondary": hex_to_hsl_triplet(c.secondary),
        "--secondary-foreground": hex_to_hsl_triplet(c.background),
        "--accent": hex_to_hsl_triplet(c.accent),
        "--accent-foreground": hex_to_hsl_triplet(c.background),
        "--neutral": hex_to_hsl_triplet(c.neutral),
        "--surface": hex_to_hsl_triplet(c.surface),
        "--border": hex_to_hsl_triplet(c.neutral),
        "--radius": RADIUS_MAP.get(design.radius, "0.5rem"),
    }

    dark_c = design.colors
    dark_vars = {
        "--background": "222 47% 6%",
        "--foreground": "210 40% 98%",
        "--primary": hex_to_hsl_triplet(dark_c.primary),
        "--primary-foreground": "210 40% 98%",
        "--secondary": "217 33% 17%",
        "--secondary-foreground": "210 40% 98%",
        "--accent": hex_to_hsl_triplet(dark_c.accent),
        "--accent-foreground": "210 40% 98%",
        "--neutral": "217 33% 17%",
        "--surface": "222 47% 10%",
        "--border": "217 33% 20%",
        "--radius": RADIUS_MAP.get(design.radius, "0.5rem"),
    }

    def block(selector: str, vars_: dict[str, str]) -> str:
        lines = "\n".join(f"    {k}: {v};" for k, v in vars_.items())
        return f"{selector} {{\n{lines}\n  }}"

    root_block = block(":root", light_vars)
    dark_block = block(".dark", dark_vars)

    return f"""@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {{
  {root_block}

  {dark_block}

  * {{
    @apply border-border;
  }}
  body {{
    @apply bg-background text-foreground;
    font-family: var(--font-body), ui-sans-serif, system-ui, sans-serif;
  }}
  h1, h2, h3, h4, h5, h6 {{
    font-family: var(--font-heading), ui-sans-serif, system-ui, sans-serif;
  }}
}}
"""


def generate_tailwind_config(design: DesignSystem) -> str:
    shadow = SHADOW_MAP.get(design.shadow_intensity, SHADOW_MAP["subtle"])
    return f"""import type {{ Config }} from "tailwindcss";

const config: Config = {{
  darkMode: ["class"],
  content: [
    "./app/**/*.{{ts,tsx}}",
    "./components/**/*.{{ts,tsx}}",
  ],
  theme: {{
    container: {{
      center: true,
      padding: "1.5rem",
      screens: {{
        "2xl": "1280px",
      }},
    }},
    extend: {{
      colors: {{
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {{
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        }},
        secondary: {{
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        }},
        accent: {{
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        }},
        neutral: "hsl(var(--neutral))",
        surface: "hsl(var(--surface))",
        border: "hsl(var(--border))",
      }},
      borderRadius: {{
        DEFAULT: "var(--radius)",
        sm: "calc(var(--radius) - 4px)",
        md: "calc(var(--radius) - 2px)",
        lg: "var(--radius)",
        xl: "calc(var(--radius) + 4px)",
      }},
      fontFamily: {{
        heading: ["var(--font-heading)"],
        body: ["var(--font-body)"],
        mono: ["var(--font-mono)"],
      }},
      boxShadow: {{
        DEFAULT: "{shadow}",
      }},
      keyframes: {{
        "fade-up": {{
          "0%": {{ opacity: "0", transform: "translateY(12px)" }},
          "100%": {{ opacity: "1", transform: "translateY(0)" }},
        }},
        "fade-in": {{
          "0%": {{ opacity: "0" }},
          "100%": {{ opacity: "1" }},
        }},
      }},
      animation: {{
        "fade-up": "fade-up 0.6s ease-out forwards",
        "fade-in": "fade-in 0.6s ease-out forwards",
      }},
    }},
  }},
  plugins: [],
}};

export default config;
"""
