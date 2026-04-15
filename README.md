# sci5th

sci5th — exploring science, technology, and the structure of knowledge.

This website is the home of sci5th and its projects. Its current flagship project is the **Map of Human Knowledge**, an interactive visualization that organizes knowledge into navigable subsets.

## Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
- **Language:** TypeScript (strict)
- **Styling:** Tailwind CSS
- **Visualization:** [`@xyflow/react`](https://reactflow.dev/) (to be added in Phase 2)
- **Linting:** ESLint, Prettier
- **Runtime:** Node.js 18+

## Project Structure

```
src/
├── app/
│   ├── globals.css            # Global styles
│   ├── layout.tsx             # Root layout (metadata, viewport)
│   └── (main)/
│       ├── layout.tsx         # Shared shell: nav, logo, footer
│       ├── page.tsx           # sci5th landing (tagline + CTA to Map)
│       └── map/               # (Phase 2) Map of Human Knowledge
│           ├── page.tsx       # Hub — card grid of subsets
│           └── [subsetId]/
│               └── page.tsx   # Dynamic subset page (shared visualization)
├── components/
│   └── MapVisualization.tsx   # (Phase 2) Shared xyflow-based visualization
├── config/
│   └── mapSubsets.ts          # (Phase 2) Typed SubsetConfig array
└── types/
    └── css.d.ts

public/
├── sci5th_Logo_Black.svg
├── sci5th_Logo_Blue.svg
└── sci5th_Logo_Pink.svg
```

## Pages

| Route              | Description                                           |
| ------------------ | ----------------------------------------------------- |
| `/`                | sci5th landing — tagline and entry into the Map       |
| `/map`             | Map of Human Knowledge hub — grid of all 8 subsets    |
| `/map/[subsetId]`  | Individual subset page (shared unified visualization) |

### Map Subsets

The Map of Human Knowledge is divided into 8 subsets, each at its own route:

| Slug             | Title                   |
| ---------------- | ----------------------- |
| `theories`       | Theories                |
| `algorithms`     | Algorithms              |
| `models`         | Models                  |
| `systems`        | Systems                 |
| `data-science`   | Data Science            |
| `ai`             | Artificial Intelligence |
| `robots`         | Robots                  |
| `biotechnology`  | Biotechnology           |

All subsets share a single `MapVisualization` component for unified style and interaction.

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Install

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Build

```bash
npm run build
```

### Lint & Format

```bash
npm run lint
npm run format
```

## Adding a New Subset

1. Add an entry to `src/config/mapSubsets.ts` with the subset's slug, title, description, and node/edge data.
2. The dynamic route `src/app/(main)/map/[subsetId]/page.tsx` picks it up automatically.
3. Link it from the `/map` hub — done by iterating `mapSubsets` in the hub page.

No new page file is needed per subset. Visualization style is shared across all subsets via `MapVisualization`.

## License

Private — all rights reserved.
