# webmake — Component Library Expansion Brief

## Context

`webmake` is a component-driven Next.js/TypeScript/Tailwind website generator.
A JSON spec (validated against `spec/website_spec.schema.json`) describes a
site's pages/sections/design tokens; the Python engine in `engine/` matches
each section to the best-fit component in `library/components/<sectionType>/<variant>/`
and writes a real, buildable Next.js App Router project to disk.

Read `README.md` and `engine/pipeline.py` first to understand the full flow
before making changes.

## Goal

Generated sites currently look competent but generic and repetitive — because
most section types have only 1–2 component variants, so two different sites of
the same `siteType` end up visually near-identical. The objective is to make
every generation feel professional, distinctive, and non-repetitive by:

1. **Filling missing section types** — `spec/website_spec.schema.json`'s
   `pages[].sections[].type` enum lists 24 possible section types; check
   `python cli.py stats` for which currently have zero components. Priority
   order for what's still missing: `gallery`, `comparison-table`, `about`,
   `content-split`, `timeline`, `newsletter`, `video-showcase`, `blog-list`,
   `blog-post`.
2. **Adding layout variety to existing types** — most section types (hero,
   pricing, features, cta, testimonials, etc.) should have 3–6 meaningfully
   different variants (not just color/spacing tweaks — different structural
   layouts), so the matcher (`engine/matching/matcher.py`) has real choices
   to make per `style`/`tone`/`industry` combination in the spec.
3. **Raising per-component polish** — micro-interactions beyond simple
   fade-in-on-scroll (hover states with scale/shadow, animated stat counters,
   smooth anchor scrolling), consistent use of the `designSystem.radius`/
   `shadowIntensity` tokens instead of hardcoded Tailwind classes, and
   `next/image` (never raw `<img>`) with real `alt` text everywhere.

## Constraints — every new/changed component MUST

- Live at `library/components/<sectionType>/<variant-name>/`, containing a
  `.tsx` entry file and a sibling `meta.json` conforming to
  `spec/component_metadata.schema.json`.
- Use `next/image` (not `<img>`), Tailwind utility classes matching the
  design-token conventions already used elsewhere in the library (check 2–3
  existing components in the same section family first for the pattern), and
  `framer-motion` only where declared in `requires` in `meta.json`.
- Ship sensible default prop values so the component renders reasonably with
  zero props (matches the existing convention — check any current component).
- Be added to the registry automatically (no engine code changes needed for
  a new component — only `spec/website_spec.schema.json`'s `sections[].type`
  enum needs a new entry if the section type itself is new, not for a new
  variant of an existing type).

## Required validation after every batch of new components

Run all of these, in order, and do not report the work done until they pass:

```bash
python cli.py stats                                   # confirm new components registered
python cli.py validate examples/<some-spec>.json       # spec still valid
python cli.py generate examples/<some-spec>.json --out output/<name> --overwrite
cd output/<name> && npm install && npm run build        # REAL production build, zero errors required
```

If you add a new `sectionType`, also add or extend an example spec under
`examples/` that exercises it, and generate+build that too.

## Out of scope for this pass

- Do not touch the JSON-generation ("AI layer") side yet — that's the next
  phase, tracked separately. Focus only on the component library and
  generation engine's structural/visual quality.
- Do not modify SEO/metadata generation (`scaffold.py`'s layout/sitemap/robots
  logic) — that was completed in a prior pass and is out of scope here unless
  you find an actual bug.

## Report back with

- A table of section types and how many variants each now has (before/after).
- Any inconsistencies you found in the existing library while working (e.g.
  hardcoded radius/shadow instead of design tokens) and whether you fixed them.
- Confirmation that all builds above passed cleanly.
