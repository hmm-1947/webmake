# webmake

An AI-directed, component-driven website generator. Natural language → a structured
JSON specification → a real, production-ready Next.js/TypeScript/Tailwind project on disk.

webmake is split into two strict layers:

1. **The AI layer** (not part of this repo's runtime) turns a natural-language request
   into a JSON document conforming to `spec/website_spec.schema.json`. It never writes
   code — only structured intent: site type, pages, sections, layout, design system,
   colors, typography, animations, and features.
2. **The Python engine** (`engine/`) takes that JSON, matches every section against the
   best-fit component in `library/components/`, resolves dependencies, generates a
   themed Tailwind config from the design tokens, and writes a complete, buildable
   Next.js App Router project.

## Quickstart

```bash
pip install -r requirements.txt

python cli.py stats
python cli.py validate examples/saas-landing.json
python cli.py generate examples/saas-landing.json --out output/flowbase --overwrite

cd output/flowbase
npm install
npm run build   # or: npm run dev
```

## Repository layout

```
spec/                          JSON Schemas: the AI<->engine contract
  website_spec.schema.json     what the AI must produce
  component_metadata.schema.json  what every library component must declare

engine/
  core/models.py               typed dataclasses mirroring the schemas
  core/registry.py             scans library/components/**/meta.json, builds an index
  matching/matcher.py          scores & selects the best component per section
  generation/theme.py          design tokens -> Tailwind config + CSS variables
  generation/dependencies.py   npm dependency + component dependency resolution
  generation/composer.py       spec content -> real JSX props on matched components
  generation/scaffold.py       writes the full Next.js project to disk
  pipeline.py                  orchestrates validate -> match -> generate

library/
  components/<section>/<variant>/
    meta.json                  component metadata (style, industry, tone, props, deps)
    *.tsx                      the real, production React/TypeScript implementation

cli.py                         command-line entrypoint (generate / validate / stats)
examples/                      example specs demonstrating different site types/styles
tests/                         pytest suite covering registry, matcher, theme, pipeline
```

## Growing the component library

Adding a component never requires touching the engine. Create a folder anywhere under
`library/components/`, add a `meta.json` (see `spec/component_metadata.schema.json`)
and the `.tsx` file(s) it points to via `entry`. The registry auto-discovers it on the
next run. This is what lets the library scale to thousands of components.

Each component:
- declares which `sectionType` it fills (`hero`, `pricing`, `navbar`, ...)
- declares which design `style`s, `industry`s, and `tone`s it suits
- declares its own npm `requires` and any `dependsOnComponents` (e.g. a shared Button atom)
- declares its `props` so the composer can map spec `content` onto real props safely

## Design system → real theme

`designSystem.colors` (hex) is converted to HSL CSS variables consumed by Tailwind's
`hsl(var(--x))` pattern, so `dark` mode, radius, and shadow intensity all flow through
to a real, generated `tailwind.config.ts` and `app/globals.css` — not a static template.

## Status

Verified end-to-end: two example specs (a light SaaS landing page and a dark-mode
monochrome portfolio) each generate, `npm install`, and `npm run build` successfully
with zero TypeScript or webpack errors.
