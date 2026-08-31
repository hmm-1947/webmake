"""
Project scaffolder: writes a complete, buildable Next.js App Router project
to disk from a WebsiteSpec + matched components. This is the final stage
of the pipeline — everything before this is planning; this stage performs
real file I/O to produce a working repository.
"""
from __future__ import annotations

import json
import os
import shutil

from engine.core.models import MatchResult, WebsiteSpec
from engine.core.registry import ComponentRegistry
from engine.generation.composer import compose_page
from engine.generation.dependencies import (
    collect_component_dependency_closure,
    resolve_dependencies,
    resolve_dev_dependencies,
)
from engine.generation.theme import (
    font_import_name,
    generate_css_variables,
    generate_tailwind_config,
)


def _write(path: str, content: str) -> None:
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8", newline="\n") as f:
        f.write(content)


def _page_dir_from_path(app_root: str, page_path: str) -> str:
    """'/'-> app/, '/pricing' -> app/pricing/, '/blog/[slug]' -> app/blog/[slug]/"""
    clean = page_path.strip("/")
    return os.path.join(app_root, clean) if clean else app_root


def _package_json(site: WebsiteSpec, deps: dict[str, str], dev_deps: dict[str, str]) -> str:
    slug = "".join(c.lower() if c.isalnum() else "-" for c in site.meta.name).strip("-") or "webforge-site"
    pkg = {
        "name": slug,
        "version": "0.1.0",
        "private": True,
        "scripts": {
            "dev": "next dev",
            "build": "next build",
            "start": "next start",
            "lint": "next lint",
        },
        "dependencies": deps,
        "devDependencies": dev_deps,
    }
    return json.dumps(pkg, indent=2) + "\n"


def _tsconfig() -> str:
    cfg = {
        "compilerOptions": {
            "target": "ES2017",
            "lib": ["dom", "dom.iterable", "esnext"],
            "allowJs": True,
            "skipLibCheck": True,
            "strict": True,
            "noEmit": True,
            "esModuleInterop": True,
            "module": "esnext",
            "moduleResolution": "bundler",
            "resolveJsonModule": True,
            "isolatedModules": True,
            "jsx": "preserve",
            "incremental": True,
            "plugins": [{"name": "next"}],
            "paths": {"@/*": ["./*"]},
        },
        "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
        "exclude": ["node_modules"],
    }
    return json.dumps(cfg, indent=2) + "\n"


def _next_config() -> str:
    return """/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
    ],
  },
};

module.exports = nextConfig;
"""


def _postcss_config() -> str:
    return """module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
"""


def _gitignore() -> str:
    return """node_modules
.next
out
.env*.local
.DS_Store
*.log
"""


def _root_layout(site: WebsiteSpec) -> str:
    ds = site.design_system
    heading = font_import_name(ds.typography.heading_font)
    body = font_import_name(ds.typography.body_font)
    mono = font_import_name(ds.typography.mono_font)

    same_font = heading == body
    if same_font:
        font_imports = f'import {{ {body} }} from "next/font/google";'
        font_inits = f"""const bodyFont = {body}({{ subsets: ["latin"], variable: "--font-body" }});
const headingFont = bodyFont;"""
        font_vars = "`${bodyFont.variable} ${monoFont.variable}`"
    else:
        font_imports = f'import {{ {heading}, {body} }} from "next/font/google";'
        font_inits = f"""const headingFont = {heading}({{ subsets: ["latin"], weight: ["400", "600", "700"], variable: "--font-heading" }});
const bodyFont = {body}({{ subsets: ["latin"], variable: "--font-body" }});"""
        font_vars = "`${headingFont.variable} ${bodyFont.variable} ${monoFont.variable}`"

    dark_class = ' className="dark"' if ds.colors.mode == "dark" else ""

    site_url = site.meta.site_url
    og_image = site.meta.og_image
    twitter_meta = (
        f'\n    site: "{site.meta.twitter_handle}",' if site.meta.twitter_handle else ""
    )

    json_ld = json.dumps(
        {
            "@context": "https://schema.org",
            "@graph": [
                {
                    "@type": "Organization",
                    "@id": f"{site_url}/#organization",
                    "name": site.meta.name,
                    "url": site_url,
                    "logo": f"{site_url}{og_image}",
                },
                {
                    "@type": "WebSite",
                    "@id": f"{site_url}/#website",
                    "url": site_url,
                    "name": site.meta.name,
                    "description": site.meta.description,
                    "publisher": {"@id": f"{site_url}/#organization"},
                },
            ],
        },
        indent=2,
    )

    return f"""import type {{ Metadata, Viewport }} from "next";
import {{ JetBrains_Mono }} from "next/font/google";
{font_imports}
import "./globals.css";

{font_inits}
const monoFont = JetBrains_Mono({{ subsets: ["latin"], variable: "--font-mono" }});

export const metadata: Metadata = {{
  metadataBase: new URL("{site_url}"),
  title: {{
    default: "{site.meta.name}",
    template: "%s | {site.meta.name}",
  }},
  description: "{site.meta.description}",
  alternates: {{
    canonical: "/",
  }},
  openGraph: {{
    type: "website",
    url: "{site_url}",
    siteName: "{site.meta.name}",
    title: "{site.meta.name}",
    description: "{site.meta.description}",
    images: [
      {{
        url: "{og_image}",
        width: 1200,
        height: 630,
        alt: "{site.meta.name}",
      }},
    ],
  }},
  twitter: {{
    card: "summary_large_image",
    title: "{site.meta.name}",
    description: "{site.meta.description}",
    images: ["{og_image}"],{twitter_meta}
  }},
  robots: {{
    index: true,
    follow: true,
  }},
}};

export const viewport: Viewport = {{
  width: "device-width",
  initialScale: 1,
  themeColor: "{site.design_system.colors.background}",
}};

const jsonLd = {json_ld};

export default function RootLayout({{
  children,
}}: Readonly<{{
  children: React.ReactNode;
}}>) {{
  return (
    <html lang="en"{dark_class} suppressHydrationWarning>
      <body className={{{font_vars}}}>
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{{{ __html: JSON.stringify(jsonLd) }}}}
        />
        {{children}}
      </body>
    </html>
  );
}}
"""


def _not_found_tsx(site: WebsiteSpec) -> str:
    return f"""import Link from "next/link";

export const metadata = {{
  title: "Page not found",
  robots: {{ index: false, follow: false }},
}};

export default function NotFound() {{
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <p className="text-sm font-medium uppercase tracking-widest text-foreground/50">404</p>
      <h1 className="mt-4 font-heading text-3xl font-bold tracking-tight sm:text-4xl">
        Page not found
      </h1>
      <p className="mt-4 max-w-md text-foreground/70">
        The page you&apos;re looking for doesn&apos;t exist or may have been moved.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90"
      >
        Back to {_escape_field(site.meta.name)}
      </Link>
    </main>
  );
}}
"""


def _error_tsx() -> str:
    return """"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to your error reporting service (e.g. Sentry) here.
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <p className="text-sm font-medium uppercase tracking-widest text-foreground/50">Error</p>
      <h1 className="mt-4 font-heading text-3xl font-bold tracking-tight sm:text-4xl">
        Something went wrong
      </h1>
      <p className="mt-4 max-w-md text-foreground/70">
        An unexpected error occurred while rendering this page.
      </p>
      <button
        onClick={() => reset()}
        className="mt-8 inline-flex items-center rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90"
      >
        Try again
      </button>
    </main>
  );
}
"""


def _escape_field(s: str) -> str:
    return s.replace("\\", "\\\\").replace('"', '\\"')


def _cn_util() -> str:
    return """import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
"""


def _readme(site: WebsiteSpec, registry_stats: dict) -> str:
    return f"""# {site.meta.name}

{site.meta.description}

Generated by **WebForge** — an AI-directed, component-driven Next.js site generator.

## Stack

- Next.js 15 (App Router) + TypeScript
- Tailwind CSS with a generated design-token theme
- {site.animations.library if site.animations.level != "none" else "No animation library (animations disabled in spec)"}

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Design system

- Style: `{site.design_system.style}`
- Color mode: `{site.design_system.colors.mode}`
- Headings: `{site.design_system.typography.heading_font}` / Body: `{site.design_system.typography.body_font}`

## Generation details

Matched against a component library of {registry_stats.get('total_components', 0)} components
across {len(registry_stats.get('section_types', {}))} section types.
"""


class ScaffoldError(Exception):
    pass


def _sitemap_ts(site: WebsiteSpec) -> str:
    """Generates app/sitemap.ts using Next's built-in MetadataRoute.Sitemap API,
    one entry per page in the spec. Home page gets the highest priority/most
    frequent change frequency; static/utility-feeling pages get lower priority."""
    site_url = site.meta.site_url
    entries: list[str] = []
    for page in site.pages:
        route = page.path if page.path.startswith("/") else f"/{page.path}"
        route = "" if route == "/" else route
        priority = "1.0" if page.is_home else "0.7"
        change_freq = "weekly" if page.is_home else "monthly"
        entries.append(
            f"""    {{
      url: `${{baseUrl}}{route}`,
      lastModified: new Date(),
      changeFrequency: "{change_freq}",
      priority: {priority},
    }},"""
        )
    entries_joined = "\n".join(entries)

    return f"""import type {{ MetadataRoute }} from "next";

const baseUrl = "{site_url}";

export default function sitemap(): MetadataRoute.Sitemap {{
  return [
{entries_joined}
  ];
}}
"""


def _robots_ts(site: WebsiteSpec) -> str:
    """Generates app/robots.ts allowing all crawlers and pointing at the sitemap."""
    site_url = site.meta.site_url
    return f"""import type {{ MetadataRoute }} from "next";

export default function robots(): MetadataRoute.Robots {{
  return {{
    rules: [
      {{
        userAgent: "*",
        allow: "/",
      }},
    ],
    sitemap: "{site_url}/sitemap.xml",
  }};
}}
"""


def scaffold_project(
    site: WebsiteSpec,
    matches: dict[str, list[MatchResult]],
    registry: ComponentRegistry,
    output_dir: str,
    overwrite: bool = False,
) -> dict:
    """Writes a full Next.js project to output_dir. Returns a summary dict."""
    if os.path.isdir(output_dir) and os.listdir(output_dir):
        if not overwrite:
            raise ScaffoldError(
                f"Output directory '{output_dir}' is not empty. Pass overwrite=True to replace it."
            )
        shutil.rmtree(output_dir)
    os.makedirs(output_dir, exist_ok=True)

    app_root = os.path.join(output_dir, "app")
    components_root = os.path.join(output_dir, "components", "generated")
    lib_root = os.path.join(output_dir, "lib")

    deps = resolve_dependencies(matches, registry, site.animations)
    dev_deps = resolve_dev_dependencies()

    _write(os.path.join(output_dir, "package.json"), _package_json(site, deps, dev_deps))
    _write(os.path.join(output_dir, "tsconfig.json"), _tsconfig())
    _write(os.path.join(output_dir, "next.config.js"), _next_config())
    _write(os.path.join(output_dir, "tailwind.config.ts"), generate_tailwind_config(site.design_system))
    _write(os.path.join(output_dir, "postcss.config.js"), _postcss_config())
    _write(os.path.join(output_dir, ".gitignore"), _gitignore())
    _write(os.path.join(app_root, "globals.css"), generate_css_variables(site.design_system))
    _write(os.path.join(app_root, "layout.tsx"), _root_layout(site))
    _write(os.path.join(app_root, "sitemap.ts"), _sitemap_ts(site))
    _write(os.path.join(app_root, "robots.ts"), _robots_ts(site))
    _write(os.path.join(app_root, "not-found.tsx"), _not_found_tsx(site))
    _write(os.path.join(app_root, "error.tsx"), _error_tsx())
    _write(os.path.join(lib_root, "utils.ts"), _cn_util())

    # Copy every uniquely-needed component (including dependency closure) into
    # components/generated/<dotted.id>/ preserving its internal file(s), plus
    # an index.ts barrel so the folder itself is a valid import target.
    closure = collect_component_dependency_closure(matches, registry)
    copied: list[str] = []
    for comp_id in sorted(closure):
        comp = registry.get(comp_id)
        if comp is None:
            continue
        dest_dir = os.path.join(components_root, comp_id.replace(".", os.sep))
        if os.path.isdir(dest_dir):
            continue
        shutil.copytree(comp.source_dir, dest_dir, ignore=shutil.ignore_patterns("meta.json"))

        entry_module = os.path.splitext(comp.entry)[0]
        barrel = f'export {{ default }} from "./{entry_module}";\nexport * from "./{entry_module}";\n'
        _write(os.path.join(dest_dir, "index.ts"), barrel)

        copied.append(comp_id)

    pages_written: list[str] = []

    for page in site.pages:
        page_matches = matches.get(page.path, [])
        source, _composed = compose_page(page, page_matches, site)
        page_dir = _page_dir_from_path(app_root, page.path)
        _write(os.path.join(page_dir, "page.tsx"), source)
        pages_written.append(page.path)

    _write(os.path.join(output_dir, "README.md"), _readme(site, registry.stats()))

    return {
        "output_dir": output_dir,
        "pages_written": pages_written,
        "components_copied": copied,
        "dependencies": deps,
        "dev_dependencies": dev_deps,
    }
