# AGENTS.md — Coding Agent Instructions

## Project Overview

This is the sci5th website: a Next.js 15 (App Router) project in TypeScript with Tailwind CSS. sci5th — exploring the structure of human knowledge, with a focus on science and technology

The site is a deep working prototype intended to scale into a larger application. Keep architecture production-shaped: dynamic routes, config-driven data, shared components.

## Conventions

- **Language:** TypeScript (strict mode). No `any` types unless unavoidable.
- **Styling:** Tailwind CSS utility classes only. No CSS modules or inline `style` objects unless necessary for dynamic positioning.
- **Components:** React functional components with hooks. No class components.
- **Imports:** Use `@/` path alias for `src/` imports (e.g., `@/components/HumanKnowledgeMap`).
- **Formatting:** Prettier with `prettier-plugin-tailwindcss`. Run `npm run format` before committing.
- **Linting:** ESLint with `eslint-config-next`. Run `npm run lint` to check.

## File Organization

- **Pages** go in `src/app/(main)/` using Next.js App Router conventions.
- **Shared components** go in `src/components/`.
- **Configuration / data** goes in `src/config/` (create if needed).
- **Static assets** (logos, images) go in `public/`.

## Key Patterns

- The `(main)` route group provides a shared shell (logo, nav, footer).
- The `HumanKnowledgeMap` component uses scoped `<style>` (CSS custom properties + class prefix `km-`). This is an intentional exception to the "Tailwind only" rule: it predates the current codebase and was ported verbatim from the earlier sci5th iteration. Leave its inline CSS as-is unless the user explicitly asks to rewrite it.
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
