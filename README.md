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
│       ├── page.tsx                    # sci5th landing (tagline + animated hero)
│       ├── about/
│       │   └── page.tsx                # About — how content is produced, scope
│       ├── human-knowledge/
│       │   └── page.tsx                # Human Knowledge — interactive tree
│       └── knowledge-gallery/
│           ├── page.tsx                # Knowledge Gallery — card index
│           └── [slug]/
│               └── page.tsx            # Knowledge Gallery entry
├── components/
│   ├── BackButton.tsx                  # Shared back-link with history fallback
│   ├── FiveDimensionsHero.tsx          # Animated landing-page hero (React, rAF)
│   ├── HumanKnowledgeMap.tsx           # Interactive knowledge tree component
│   ├── KnowledgeGallery.tsx            # Gallery index (cards + sub-navbar)
│   ├── KnowledgeGalleryEntry.tsx      # Gallery entry view (hero + steps)
│   ├── KnowledgeGalleryFocusHandler.tsx # Scroll/highlight via ?focus=<slug>
│   ├── UnityHero.tsx                   # Click-to-play wrapper for Unity demos
│   └── UnityPlayer.tsx                 # Unity WebGL loader (client-only)
├── config/
│   └── knowledge-gallery.ts            # Gallery entry list (typed)
└── types/
    └── css.d.ts

public/
├── sci5th_Logo_Black.svg
├── sci5th_Logo_Blue.svg
├── sci5th_Logo_Pink.svg
├── *.webp                              # Gallery thumbnails (AI-generated)
└── UnityGames/                         # First-party Unity WebGL builds
    ├── BehaviourTree_Gallery/
    └── GOAP_Hospital/
```

## Pages

| Route                       | Description                                                       |
| --------------------------- | ----------------------------------------------------------------- |
| `/`                         | sci5th landing — tagline + animated hero                          |
| `/human-knowledge`          | Human Knowledge — interactive folder tree of fields               |
| `/knowledge-gallery`        | Knowledge Gallery — curated step-by-step explorations             |
| `/knowledge-gallery/[slug]` | Knowledge Gallery entry — hero (image or Unity demo) + step cards |
| `/about`                    | About — how content is produced, scope, what this site isn't      |

## AI Disclosure

Knowledge Gallery prose is AI-drafted and not independently fact-checked.
Thumbnails are generated with OpenAI's image model (Images 2.0); the two
interactive demos under `/public/UnityGames/` are first-party Unity WebGL
builds. The site surfaces this through three disclosure points: a footer line
on every page, a banner on the Gallery index, and a per-thumbnail / per-hero
credit on each gallery card and entry. See [`/about`](./src/app/(main)/about/page.tsx)
for the user-facing version.

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
