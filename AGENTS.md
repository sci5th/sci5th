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
- **Configuration / data** goes in `src/config/` (e.g. `knowledge-gallery.ts`).
- **Static assets** (logos, images) go in `public/`.
- **Long-form documentation** (the triple-lens review, archived history) goes in `docs/`. Only `README.md`, `AGENTS.md`, and `DESIGN_SYSTEM.md` live at the repo root.

## Key Patterns

- The `(main)` route group provides a shared shell (logo, nav, footer). The logo strip's right-hand accent is `sci5th_Logo_Blue.svg` across all surfaces (`/`, `/human-knowledge`, `/knowledge-gallery`).
- The `HumanKnowledgeMap` component uses a scoped `km-*` CSS block (intentional Tailwind exception). The block lives at the bottom of `src/app/globals.css` and consumes the shared `:root` tokens — do not reintroduce local hex values. Category colors are applied via `cat-formal`, `cat-natural`, `cat-applied`, `cat-social`, `cat-humanities`, `cat-professions` classes at the top level, inherited by descendants.
- The tree supports full ARIA `tree` / `treeitem` semantics with keyboard navigation (↑/↓ move, →/← expand/collapse, Enter/Space toggle, Home/End jump). Preserve these when editing.
- sci5th is the site/brand; future sci5th projects live at sibling top-level routes (e.g., `/[future-project]`).

## Deployment

- **Target: static export.** `next.config.ts` sets `output: "export"`. The build produces a fully static site under `out/` that can be served from any static host (Cloudflare Pages, Netlify, GitHub Pages, S3+CloudFront). Do not introduce server-only features (Route Handlers, Server Actions, middleware that requires a Node runtime, `next/image` with the default loader, ISR, `revalidate`, dynamic `cookies()`/`headers()` reads) — they will break the export. `images.unoptimized = true` is set for the same reason; keep using `unoptimized` on `<Image>`.

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
- **Disclose AI-generated content.** All Knowledge Gallery prose is AI-drafted and not independently fact-checked; all Knowledge Gallery thumbnails are generated with OpenAI's image model (Images 2.0). The only carve-outs are the Unity WebGL builds under `/public/UnityGames/` (first-party work) and the sci5th logo/site chrome. The site exposes this through four disclosure surfaces, each with a single responsibility:
  1. **Global footer** (`src/app/(main)/layout.tsx` → `Footer`) — one line about AI-drafted content and a "Learn more" link to `/about`. Does NOT mention images (the per-card credit does that).
  2. **Knowledge Gallery index banner** (`src/components/KnowledgeGallery.tsx`) — `<aside role="note">` above the sub-navbar, reiterates the AI-drafted/not-expert-reviewed caveat. Does NOT mention images or Unity (the per-card credit does that).
  3. **Per-card image credit** (`src/components/KnowledgeGallery.tsx` → inside the card list, gated on `entry.thumbnail`) — small caption directly under each thumbnail: `Image: Images 2.0 by OpenAI` by default, `Hero: Unity WebGL build` when `entry.unity` is set, suppressed entirely when there is no thumbnail (placeholder initials card).
  4. **Per-entry hero credit** (`src/components/KnowledgeGalleryEntry.tsx`) — same wording as the card credit, rendered under the entry's hero on the detail page.
  Plus a dedicated `/about` route (`src/app/(main)/about/page.tsx`) with two sections: "How content is produced" and "What this site is not". Intro paragraph uses the same `text-text-300 / text-center / leading-snug` treatment as the Gallery banner, minus the border/background. When adding new entries: if the entry uses an AI-generated thumbnail, no change is needed (the default credit covers it); if it uses a non-AI hero, set `entry.unity` (or extend the entry schema with an `imageSource` field) so the credit line says the right thing. Keep image attribution near the image, not in the footer or banner — that separation is intentional.

## History

> Only the most recent ~10 entries live here. Everything older has been
> archived to [`docs/HISTORY.md`](./docs/HISTORY.md). Move entries into
> the archive when this list grows past ~15 items.

- 2026-05-18 — **Moved `?section=` and `?from=` reads to the client** so `/knowledge-gallery` and `/knowledge-gallery/[slug]` are statically exportable. Three changes: (a) `src/components/KnowledgeGallery.tsx` is now a Client Component that reads `?section=` via `useSearchParams()`; `src/app/(main)/knowledge-gallery/page.tsx` lost its `async`/`searchParams` props and wraps `<KnowledgeGallery />` in a `<Suspense>` boundary. (b) `src/app/(main)/knowledge-gallery/[slug]/page.tsx` lost its `searchParams` prop; the `?from=<section>` filter-restore carrier is read inside `BackButton` via `useSearchParams()` when the new `appendFromSection` prop is set, and `KnowledgeGalleryEntry.tsx` wraps the button in `<Suspense>` for the same reason. (c) `BackButton.tsx` gained an `appendFromSection?: boolean` prop that, when true, appends `&section=<from>` to the `href` before navigating. URLs unchanged, behavior unchanged, both routes now prerender under `output: "export"`.
- 2026-05-18 — **Hardening pass from the triple-lens review (items 1–5 of `docs/REVIEW_2026-05-13.md`).** (1) Declared **static export** as the deployment target: `next.config.ts` now sets `output: "export"` and `images.unoptimized = true`; added a new `## Deployment` section in `AGENTS.md` documenting the constraint and listing the server-only features that will break the export. (2) Added `src/app/(main)/error.tsx` — Next App-Router error boundary, dark-themed with `ink.*` / `text.*` tokens, "Try again" calls `reset()`, "Go home" links to `/`. (3) Added `src/app/(main)/not-found.tsx` — dark-themed 404 styled to match, with links to `/` and `/knowledge-gallery`. Replaces the default light-mode Next pages that hit when `/knowledge-gallery/[slug]` calls `notFound()`. (4) Generated real favicons from `sci5th_Logo_Blue.svg`: `public/favicon.ico` (multi-size: 16/32/48/64), `public/favicon-32x32.png`, `public/apple-touch-icon.png` (180×180). Wired them into `src/app/layout.tsx` `metadata.icons` alongside the existing SVG. (5) Per-card image credit on the Knowledge Gallery index now uses `text-text-300` instead of `text-text-500` to clear WCAG AA on `ink-900` (`#a5a79f` on `#161a22` ≈ 7.8:1). The entry-detail credit at `0.65rem`/`text-xs` was left untouched — already larger.
- 2026-05-13 — **Docs cleanup.** Created `docs/` folder. Moved ~40 older History entries from `AGENTS.md` into `docs/HISTORY.md` (this file shrank from ~52 KB to ~12 KB). Moved the triple-lens review out of the repo root into `docs/REVIEW_2026-05-13.md`. Added a one-line "docs" entry to `File Organization` above so future contributors know where long-form docs go. README's Project Structure diagram updated to show `docs/`. No code changes; `tsc --noEmit` not relevant.
- 2026-05-13 — **Refined the AI-content disclosure** based on the principle "attribute the image next to the image; keep global notices about prose." Three changes: (a) **moved image attribution onto every Knowledge Gallery card** as a small right-aligned caption directly under the thumbnail (`src/components/KnowledgeGallery.tsx`) — wording is `Image: Images 2.0 by OpenAI` by default, `Hero: Unity WebGL build` when `entry.unity` is set, suppressed entirely when there is no thumbnail (placeholder initials card) so we don't credit an image we didn't ship; (b) **simplified the entry detail page credit** in `KnowledgeGalleryEntry.tsx` to the same two-line set so card and detail page agree; (c) **dropped redundant image text** from the global footer (`src/app/(main)/layout.tsx` — now just the AI-drafted prose line + "Learn more"), from the Gallery banner (`src/components/KnowledgeGallery.tsx` — now just the AI-drafted/not-reviewed caveat), and from `/about` (removed the standalone "Images and other assets" section and the "Report an error" section; intro paragraph rewritten to match the page's actual contents and restyled as a small centered caption matching the Gallery banner typography, but without the border/background per design call). Net effect: every image disclosure now lives next to its image; every prose disclosure is a single short line at the bottom of every page; `/about` has just two sections ("How content is produced", "What this site is not"). README.md and the AGENTS.md Standing Rule were rewritten to reflect this final shape. `tsc --noEmit` passes.
- 2026-05-13 — Added **AI-content disclosure** across the site. The Knowledge Gallery prose is AI-drafted and the thumbnails are OpenAI Images 2.0; the two Unity WebGL demos remain first-party. Four surfaces now carry this: (1) the global `Footer` in `src/app/(main)/layout.tsx` gained a small notice line + "Learn more" link to `/about`; (2) the Knowledge Gallery index (`src/components/KnowledgeGallery.tsx`) renders an `<aside role="note">` banner above the sub-navbar with the AI-drafted caveat and the Unity-demo carve-out; (3) `src/components/KnowledgeGalleryEntry.tsx` renders a per-hero credit line — "Image generated with OpenAI (Images 2.0)" by default, "Interactive demo: original Unity WebGL build" when `entry.unity` is set; (4) a new `/about` route (`src/app/(main)/about/page.tsx`) covering how content is produced, image attribution, scope/limitations, and an error-report invitation. The nav in `MainLayout` gained an "About" link. Also added a **Standing Rule** ("Disclose AI-generated content") to AGENTS.md so future entries and surfaces inherit the convention. No new dependencies, no scoped CSS — all Tailwind utilities + existing tokens (`ink.*`, `text.*`, `line-*`, `brand-*`).
- 2026-04-23 — Knowledge Gallery sub-navbar: added a new kind-scoped tab **Modularity** alongside the existing All/Theories/Algorithms/Models/Systems, and seeded it with three hand-curated entries (Software Modularity, Biological Modularity, Modularity of Mind). Type extension in `src/config/knowledge-gallery.ts`: `KnowledgeGalleryKind` now includes `"modularity"`. Tree edits in lockstep so each entry's `systemPath` is an exact tree match — existing Gallery-badge wiring on `/human-knowledge` picks them up automatically.
- 2026-04-23 — Knowledge Gallery sub-navbar: sorted the kind-scoped tabs alphabetically. Old order `All · Theories · Algorithms · Models · Systems · Modularity` → new order `All · Algorithms · Modularity · Models · Systems · Theories`. `All` stays pinned as the first tab (it's the default landing view and the "show everything" escape hatch). Reordered the `SECTIONS` array in `src/components/KnowledgeGallery.tsx`; no other logic changes (the `GallerySection` union, `resolveSection` default, `counts` record keys, and URL scheme all stay intact).
- 2026-04-23 — Knowledge Gallery cards: added a persistent **Open →** affordance in the lower-right of every card. Implementation in `src/components/KnowledgeGallery.tsx`: the inner content wrapper now has `flex-1` so it absorbs the card's remaining vertical space and pushes the Open row to the bottom. The `<span>` carries `aria-hidden="true"` since the surrounding `<Link>` already has the semantic. Styled with the breadcrumb treatment in the resting state; picks up `brand-pink` on hover via `group-hover`.
- 2026-04-23 — Knowledge Gallery thumbnails: wired five branch cards to newly-supplied 1280×720 WebPs (`HumanKnowledge`, `FormalSciences`, `NaturalSciences`, `AppliedSciences`, `SocialSciences`). Renamed `AppliedSciences&Technology.webp` → `AppliedSciences.webp` on the way in to avoid URL-encoding and shell-metacharacter trouble. Two of seven branch-overview cards (`humanities`, `professions`) still placeholder until art is supplied.
- 2026-04-22 — Renamed the Knowledge Gallery entry page's **"Back to Knowledge Gallery"** link to a simple **"Back"** button that steps browser history back one entry. Extracted into a new reusable client component `src/components/BackButton.tsx` (`"use client"`, calls `router.back()` from `next/navigation`) so the parent `KnowledgeGalleryEntry.tsx` stays a server component. Guards direct-landing edge cases: if `window.history.length <= 1`, falls back to `router.push(fallbackHref)`.
- 2026-04-22 — System of Human Knowledge: shortened the row-hover tint so it stops at the end of the label, leaving the Gallery badge outside the highlight. Introduced a new inner wrapper `.km-row` that holds the icon + glyph + label; moved `display: flex`, padding, `border-radius`, and the `background` transition off `.km-node` and onto `.km-row`. Hover is now scoped to `.km-row:hover` — pointing at the badge never tints the label region, and pointing at the label never tints the badge. `focus-visible` outline stays on `.km-node` so keyboard focus still rings the full row.
