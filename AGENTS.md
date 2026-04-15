# AGENTS.md — Coding Agent Instructions

## Project Overview

This is a Next.js 15 (App Router) website built with TypeScript and Tailwind CSS. It explores ontology and science, featuring Unity WebGL algorithm demos, pictures, and videos.

## Conventions

- **Language:** TypeScript (strict mode). No `any` types unless unavoidable.
- **Styling:** Tailwind CSS utility classes only. No CSS modules or inline `style` objects unless necessary for dynamic grid layouts.
- **Components:** React functional components with hooks. No class components.
- **Imports:** Use `@/` path alias for `src/` imports (e.g., `@/config/games`).
- **Formatting:** Prettier with `prettier-plugin-tailwindcss`. Run `npm run format` before committing.
- **Linting:** ESLint with `eslint-config-next`. Run `npm run lint` to check.

## File Organization

- **Pages** go in `src/app/(main)/` using Next.js App Router conventions.
- **Shared components** go in `src/components/`.
- **Configuration/data** goes in `src/config/`.
- **Static assets** (images, videos, Unity builds) go in `public/`.

## Key Patterns

- The `(main)` route group provides a shared layout with navigation (Algorithms, Pictures, Videos), logo, and footer.
- Algorithm/game definitions live in `src/config/games.ts` as a typed array of `GameConfig` objects.
- Gallery pages (pictures, videos) use a CSS Grid with `repeat(auto-fit, minmax(...))` for responsive layouts.
- Horizontal/landscape items use `col-span-2` to span two grid columns.
- Unity WebGL games are loaded via the `UnityPlayer` component which handles script loading, canvas sizing, and fullscreen.

## Do

- Keep pages simple — data arrays at the top, a single default export component.
- Use `unoptimized` on `<Image>` components (assets are local, not using Next.js image optimization).
- Maintain responsive design: mobile-first with Tailwind breakpoints (`md:`, `lg:`).
- Use semantic HTML where appropriate (`<nav>`, `<main>`, `<footer>`).

## Do Not

- Do not install additional CSS frameworks or UI libraries.
- Do not add server-side API routes — this is a static portfolio site.
- Do not modify Unity WebGL build files in `public/UnityGames/`.
- Do not add comments or docstrings to code unless they explain non-obvious logic.
- Do not refactor or rename existing files without being asked.

## Standing Rules

- **Use stable tools and libraries only.** Prefer stable, mature, widely-adopted dependencies. Avoid experimental, alpha, or beta packages unless explicitly approved. If only an experimental option exists for a requirement, flag it before adding.
- **Respect copyright and licensing.** When handling images, videos, text, fonts, code snippets, or any third-party asset, verify it is properly licensed or in the public domain. If you spot a potential copyright or legal violation anywhere in the project, surface it with a concrete recommendation to either resolve it (add attribution, replace with a properly licensed alternative) or remove it.
- **Check the security of everything that enters the project, and also everything that leaves the project.** Vet inbound dependencies, assets, code snippets, data, and user input for known vulnerabilities, malicious content, secrets, or supply-chain risk before they land. Review outbound content, commits, build artifacts, deployments, network calls, and exported data for leaked credentials, PII, internal details, or unsafe destinations before anything ships. Surface concerns with a concrete mitigation.
