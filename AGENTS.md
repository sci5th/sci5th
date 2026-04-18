# AGENTS.md — Coding Agent Instructions

## Project Overview

This is the sci5th website: a Next.js 15 (App Router) project in TypeScript with Tailwind CSS. sci5th — exploring the structure of human knowledge, with a focus on science and technology

The site is a deep working prototype intended to scale into a larger application. Keep architecture production-shaped: dynamic routes, config-driven data, shared components.

## Conventions

- **Language:** TypeScript (strict mode). No `any` types unless unavoidable.
- **Styling:** Tailwind CSS utility classes only. No CSS modules or inline `style` objects unless necessary for dynamic positioning.
- **Design tokens:** All colors go through the `ink.*`, `text.*`, `brand.*`, `accent.*`, `feedback.*` tokens defined in `tailwind.config.ts` and mirrored as `:root` CSS variables in `globals.css`. Do not introduce hex literals or raw `slate-*` / `gray-*` classes. See `DESIGN_SYSTEM.md`.
- **Theme:** Dark-only. No light mode, no theme toggle.
- **Fonts:** DM Sans (`font-sans`) for body/shell; JetBrains Mono (`font-mono`) only for the knowledge tree. Loaded via `next/font/google` in `src/app/layout.tsx`.
- **Icons:** `@heroicons/react/24/outline`. When adding a new field to the knowledge tree, extend `FIELD_ICONS` in `HumanKnowledgeMap.tsx` if an appropriate glyph exists.
- **Components:** React functional components with hooks. No class components.
- **Imports:** Use `@/` path alias for `src/` imports (e.g., `@/components/HumanKnowledgeMap`).
- **Formatting:** Prettier with `prettier-plugin-tailwindcss`. Run `npm run format` before committing.
- **Linting:** ESLint with `eslint-config-next`. Run `npm run lint` to check.

## File Organization

- **Pages** go in `src/app/(main)/` using Next.js App Router conventions.
- **Shared components** go in `src/components/`.
- **Configuration / data** goes in `src/config/` (e.g. `knoga.ts`).
- **Static assets** (logos, images) go in `public/`.

## Key Patterns

- The `(main)` route group provides a shared shell (logo, nav, footer). The logo strip's right-hand accent is `sci5th_Logo_Blue.svg` on `/` and `sci5th_Logo_Pink.svg` on the knowledge surfaces (`/human-knowledge` and `/knoga`).
- The `HumanKnowledgeMap` component uses a scoped `km-*` CSS block (intentional Tailwind exception). The block lives at the bottom of `src/app/globals.css` and consumes the shared `:root` tokens — do not reintroduce local hex values. Category colors are applied via `cat-formal`, `cat-natural`, `cat-applied`, `cat-social`, `cat-humanities`, `cat-professions` classes at the top level, inherited by descendants.
- The tree supports full ARIA `tree` / `treeitem` semantics with keyboard navigation (↑/↓ move, →/← expand/collapse, Enter/Space toggle, Home/End jump). Preserve these when editing.
- sci5th is the site/brand; future sci5th projects live at sibling top-level routes (e.g., `/[future-project]`).

## Do

- Keep pages simple — data imported from `@/config/*` at the top, single default export component.
- Use `unoptimized` on `<Image>` for local assets (no Next.js image optimization pipeline).
- Maintain responsive design: mobile-first with Tailwind breakpoints (`md:`, `lg:`).
- Use semantic HTML where appropriate (`<nav>`, `<main>`, `<footer>`).
- Update `README.md` and this `AGENTS.md` when making significant structural changes (per project instructions).

## Do Not

- Do not install additional CSS frameworks or UI libraries beyond what's already listed.
- Do not add server-side API routes — this is a static site.
- Do not add comments or docstrings to code unless they explain non-obvious logic.
- Do not refactor or rename existing files without being asked.

## Standing Rules

- **Use stable tools and libraries only.** Prefer stable, mature, widely-adopted dependencies. Avoid experimental, alpha, or beta packages unless explicitly approved. If only an experimental option exists for a requirement, flag it before adding.
- **Respect copyright and licensing.** When handling images, videos, text, fonts, code snippets, or any third-party asset, verify it is properly licensed or in the public domain. If you spot a potential copyright or legal violation anywhere in the project, surface it with a concrete recommendation to either resolve it (add attribution, replace with a properly licensed alternative) or remove it.
- **Check the security of everything that enters the project, and also everything that leaves the project.** Vet inbound dependencies, assets, code snippets, data, and user input for known vulnerabilities, malicious content, secrets, or supply-chain risk before they land. Review outbound content, commits, build artifacts, deployments, network calls, and exported data for leaked credentials, PII, internal details, or unsafe destinations before anything ships. Surface concerns with a concrete mitigation.

## History

- 2026-04-16 — Removed the Map of Human Knowledge feature (xyflow-based): deleted `/map` routes, `MapVisualization` component, `mapSubsets` config, home-page CTA button, nav link, and the `@xyflow/react` dependency.
- 2026-04-16 — Added a new **Human Knowledge** page at `/human-knowledge` by porting the legacy `HumanKnowledgeMap.tsx` tree component verbatim from `sci5th_website_copy_2026_04_15`. The Home page remains the minimal tagline landing; the knowledge tree is now a separate nav entry.
- 2026-04-16 — Added `AI_Opal.mp4` (1.3 MB, 16:9) to `public/` and embedded it on the Home page beneath the tagline. Video is served directly from `/AI_Opal.mp4` using a native HTML `<video>` with `controls` — no external player dependency.
- 2026-04-17 — Consolidated the site onto one dark design system (see `DESIGN_SYSTEM.md`): added `ink.*` / `text.*` / `brand.*` / `accent.*` tokens in `tailwind.config.ts` and mirrored as `:root` CSS variables in `globals.css`; migrated shell from `slate-*` literals to the new tokens; wired `DM Sans` + `JetBrains Mono` via `next/font`; moved the tree's scoped CSS into `globals.css`; added ARIA treeview semantics + keyboard navigation + No-matches empty state + label wrapping + ≥40px touch rows; retired the depth-based One-Dark rainbow in favor of six pastel category colors (mint/sky/sand/rose/lilac/peach) inherited from the top-level domain; replaced 📁/📄 emoji with a two-tier Heroicons system (domain + field icons; `·` marker on leaves); wired `sci5th_Logo_Pink.svg` into the logo strip on `/human-knowledge`.
- 2026-04-18 — Reorganized the `HumanKnowledgeMap` toolbar: the subtitle under the title is now just "Interactive Folder Tree" (centered). The toolbar splits into two rows — row 1 holds the full-width search input, row 2 holds a native `<details>` "How to use this tree" dropdown (left) with usage + keyboard instructions inside, and the "Expand all" / "Collapse all" buttons (right). New CSS classes in `globals.css`: `.km-toolbar-secondary`, `.km-toolbar-spacer`, `.km-help`, `.km-help-summary`, `.km-help-chevron`, `.km-help-content`. Rationale: keeps the header minimal, makes the search the focal UI element, and hides the wall-of-text instructions behind a disclosure while keeping them one click away. Chose native `<details>`/`<summary>` over a custom popover — simpler, accessible by default, no new deps.
- 2026-04-18 — Retuned the category palette: the "professions" color (Professions & Interdisciplinary) was too close to "sand" (Applied Sciences & Technology) — both warm-orange pastels. Renamed the accent token `peach #e8bfa0` → `aqua #a8d5d2` (cool pastel teal) and updated `--cat-professions` accordingly. The six category hues now occupy distinct zones: green (mint), blue (sky), yellow-orange (sand), pink (rose), purple (lilac), teal (aqua) — no two categories share a hue neighborhood. `DESIGN_SYSTEM.md` palette and icon tables updated.
- 2026-04-18 — Full category-palette redesign. The previous palette still had visible collisions: formal (mint 142°) ↔ professions (aqua 175°) both read as pale teal, and social (rose 342°) ↔ humanities (lilac 274°) both read as warm pinks. Redesigned the six pastels on a 60°-spaced hue wheel, pinning `cat-natural`/`accent.sky` and `cat-social`/`accent.rose` (those double as brand tokens) and moving the others into vacant slots. Final hues: **leaf** `#c9dca5` ~75° (formal), **sky** `#a7c5e8` ~212° (natural), **sand** `#e3cf9b` ~44° (applied), **rose** `#e7b9c7` ~342° (social), **lilac** `#c4b0e3` ~262° (humanities), **sage** `#a3d4bd` ~152° (professions). Renamed accent tokens `mint` → `leaf` and `aqua` → `sage` so names match the new hues. Every adjacent pair is now ≥30° apart on the wheel with differentiated saturation/lightness; all six still pass AA against `ink.900`. `DESIGN_SYSTEM.md` palette and icon tables updated.
- 2026-04-18 — Swapped Humanities ↔ Professions category colors and split labels from icons. `cat-humanities` is now **sage** `#a3d4bd` (was lilac); `cat-professions` is now **lilac** `#c4b0e3` (was sage). Also introduced a darker `*-dim` variant of every category pastel (~17% darker in HSL lightness) — the tree label uses the base pastel, and the category icon (`.km-glyph`) uses the dim variant, so every icon reads as a quieter lead-in to its label. New CSS tokens: `--cat-formal-dim` `#a4c467`, `--cat-natural-dim` `#6298d6`, `--cat-applied-dim` `#d0ae57`, `--cat-social-dim` `#d17893`, `--cat-humanities-dim` `#68b893`, `--cat-professions-dim` `#9470cc`. Mirrored in `tailwind.config.ts` as `accent.*-dim`. All icon colors still pass WCAG AA (≥ 4.5 : 1) against `ink.900`, and label-vs-icon contrast is 1.34–1.96× (visibly distinct, not just nominally different). The CSS rule that previously grouped `.cat-* .km-label` and `.cat-* .km-glyph` into one selector was split into two per category.
- 2026-04-18 — Reordered the secondary toolbar row on `/human-knowledge` into a three-column grid: **Expand all** (left) · **How to use this tree** disclosure (center) · **Collapse all** (right). Implemented with CSS grid `1fr auto 1fr` (rather than flex+spacer) so the center slot is geometrically centered regardless of the side-slot widths. New classes: `.km-toolbar-tri`, `.km-toolbar-slot`, `.km-toolbar-slot-left`/`-center`/`-right`. Below 640 px the grid collapses to a single column so each slot stacks and the help dropdown is free to grow.
- 2026-04-18 — Added **KnoGa — Knowledge Gallery** at `/knoga` (index) and `/knoga/[slug]` (entries). KnoGa is a sibling surface to `/human-knowledge`: the System (`/human-knowledge`) is the structural map; KnoGa is curated, step-by-step explorations of selected nodes. First entry: Chaos Theory. New files: `src/config/knoga.ts` (typed entry list, one entry for now), `src/components/KnoGaGallery.tsx` (index card grid), `src/components/KnoGaEntry.tsx` (step-by-step view with Back-to-KnoGa and See-in-System nav). Nav updated in `(main)/layout.tsx` to include `/knoga`. Logo accent rotation extended: Pink is now used on both knowledge surfaces (`/human-knowledge` and `/knoga`), Blue stays on Home. Tree-side cross-links (badges on matching tree nodes) intentionally deferred to a follow-up. Used built-in components + Tailwind only — no new dependencies, no new scoped CSS block.
