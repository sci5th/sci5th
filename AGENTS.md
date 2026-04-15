# AGENTS.md — Coding Agent Instructions

## Project Overview

This is the sci5th website: a Next.js 15 (App Router) project in TypeScript with Tailwind CSS. sci5th explores science, technology, and the structure of knowledge. The site currently hosts one flagship project — the **Map of Human Knowledge**, an interactive graph-style visualization organized into 8 subsets.

The site is a deep working prototype intended to scale into a larger application. Keep architecture production-shaped: dynamic routes, config-driven data, shared components.

## Conventions

- **Language:** TypeScript (strict mode). No `any` types unless unavoidable.
- **Styling:** Tailwind CSS utility classes only. No CSS modules or inline `style` objects unless necessary for dynamic positioning (e.g., xyflow canvas sizing).
- **Components:** React functional components with hooks. No class components.
- **Imports:** Use `@/` path alias for `src/` imports (e.g., `@/config/mapSubsets`).
- **Formatting:** Prettier with `prettier-plugin-tailwindcss`. Run `npm run format` before committing.
- **Linting:** ESLint with `eslint-config-next`. Run `npm run lint` to check.

## File Organization

- **Pages** go in `src/app/(main)/` using Next.js App Router conventions.
- **Shared components** go in `src/components/`.
- **Configuration / data** goes in `src/config/`.
- **Static assets** (logos, images) go in `public/`.

## Key Patterns

- The `(main)` route group provides a shared shell (logo, nav, footer).
- Map subsets live at `/map/[subsetId]` via a single dynamic route.
- Subset definitions live in `src/config/mapSubsets.ts` as a typed `SubsetConfig[]` array (slug, title, description, nodes, edges).
- Adding a subset = adding an array entry. No new page file needed.
- All subsets render through the shared `MapVisualization` component for unified visual style and interaction.
- sci5th is the site/brand; the Map is a *project of* sci5th. Future sci5th projects live at sibling top-level routes (e.g., `/[future-project]`), not nested inside `/map`.

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
- Do not bypass the shared `MapVisualization` component — per-subset one-off visualizations break the unified-style requirement.

## Standing Rules

- **Use stable tools and libraries only.** Prefer stable, mature, widely-adopted dependencies. Avoid experimental, alpha, or beta packages unless explicitly approved. If only an experimental option exists for a requirement, flag it before adding.
- **Respect copyright and licensing.** When handling images, videos, text, fonts, code snippets, or any third-party asset, verify it is properly licensed or in the public domain. If you spot a potential copyright or legal violation anywhere in the project, surface it with a concrete recommendation to either resolve it (add attribution, replace with a properly licensed alternative) or remove it.
- **Check the security of everything that enters the project, and also everything that leaves the project.** Vet inbound dependencies, assets, code snippets, data, and user input for known vulnerabilities, malicious content, secrets, or supply-chain risk before they land. Review outbound content, commits, build artifacts, deployments, network calls, and exported data for leaked credentials, PII, internal details, or unsafe destinations before anything ships. Surface concerns with a concrete mitigation.
