# sci5th

sci5th — exploring the structure of human knowledge, with a focus on science and technology

This website is the home of sci5th and its projects.

## Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
- **Language:** TypeScript (strict)
- **Styling:** Tailwind CSS with a custom dark token set (`ink.*`, `text.*`, `brand.*`, `accent.*`)
- **Fonts:** DM Sans + JetBrains Mono via `next/font/google`
- **Icons:** `@heroicons/react` (outline, 24px)
- **Linting:** ESLint, Prettier
- **Runtime:** Node.js 18+

## Design System

See [`DESIGN_SYSTEM.md`](./DESIGN_SYSTEM.md) for the token set, icon mapping, and
component conventions. The site is dark-only with modest pastel accents.

## Project Structure

```
src/
├── app/
│   ├── globals.css                     # Global styles
│   ├── layout.tsx                      # Root layout (metadata, viewport)
│   └── (main)/
│       ├── layout.tsx                  # Shared shell: nav, logo, footer
│       ├── page.tsx                    # sci5th landing (tagline + AI_Opal video)
│       └── human-knowledge/
│           └── page.tsx                # Human Knowledge — interactive tree
├── components/
│   └── HumanKnowledgeMap.tsx           # Interactive knowledge tree component
└── types/
    └── css.d.ts

public/
├── AI_Opal.mp4                         # Landing-page video (horizontal 16:9)
├── sci5th_Logo_Black.svg
├── sci5th_Logo_Blue.svg
└── sci5th_Logo_Pink.svg
```

## Pages

| Route              | Description                                         |
| ------------------ | --------------------------------------------------- |
| `/`                | sci5th landing — tagline + AI_Opal video            |
| `/human-knowledge` | Human Knowledge — interactive folder tree of fields |

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

## License

Private — all rights reserved.
