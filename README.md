# sci5th Website

A portfolio website showcasing science and technology through interactive Unity WebGL games, a picture gallery, and a video gallery.

## Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Linting:** ESLint, Prettier
- **Runtime:** Node.js

## Project Structure

```
src/
├── app/
│   ├── globals.css            # Global styles
│   ├── layout.tsx             # Root layout (metadata, viewport)
│   └── (main)/
│       ├── layout.tsx         # Main layout (nav, logo, footer)
│       ├── page.tsx           # Home — game cards grid
│       ├── games/
│       │   └── [gameId]/
│       │       └── page.tsx   # Dynamic game page (Unity player)
│       ├── pictures/
│       │   └── page.tsx       # Picture gallery
│       └── videos/
│           └── page.tsx       # Video gallery
├── components/
│   └── UnityPlayer.tsx        # Unity WebGL loader component
└── config/
    └── games.ts               # Game definitions and metadata
public/
├── picturesGallery/           # Gallery images
├── videosGallery/             # Gallery videos
└── UnityGames/                # Unity WebGL builds
    ├── BehaviourTree_Gallery/
    └── GOAP_Hospital/
```

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
npm build
```

### Lint & Format

```bash
npm run lint
npm run format
```

## Pages

| Route             | Description                                     |
| ----------------- | ----------------------------------------------- |
| `/`               | Home — grid of playable Unity WebGL games       |
| `/games/[gameId]` | Individual game page with embedded Unity player |
| `/pictures`       | Responsive image gallery                        |
| `/videos`         | Responsive video gallery                        |

## Adding Content

### Games

1. Place the Unity WebGL build in `public/UnityGames/<GameName>/`.
2. Add a thumbnail image to `public/`.
3. Add a `GameConfig` entry in `src/config/games.ts`.

### Pictures

Add image files to `public/picturesGallery/` and add an entry to the `pictures` array in `src/app/(main)/pictures/page.tsx`. Set `horizontal: true` for landscape images that should span two columns.

### Videos

Add video files to `public/videosGallery/` and add an entry to the `videos` array in `src/app/(main)/videos/page.tsx`. Set `horizontal: true` for landscape videos that should span two columns.

## License

Private — all rights reserved.
