// Brand-level strings, asset paths, and metadata. Lift any user-visible
// "sci5th"-the-name string here so the shell never hardcodes it inline.
// Consumed by: src/app/layout.tsx (root metadata), src/app/(main)/layout.tsx
// (logo + footer), and any future surface that needs the wordmark.
//
// When the brand identity changes (rename, new logo, new tagline), this
// is the only file that should need to change. If you find yourself
// hardcoding "sci5th" anywhere in the shell, pull it through here instead.

export const BRAND = {
  // Short, human-visible name. Used in the logo wordmark, the metadata
  // title, the copyright line, and the authors field.
  name: "sci5th",

  // Long-form tagline / metadata description. Used as the default site
  // description and as a fallback when a page doesn't supply its own.
  description:
    "sci5th — exploring the structure of human knowledge, with a focus on science and technology",

  // Site-level metadata keywords. Pages may extend or override.
  keywords: [
    "sci5th",
    "science",
    "technology",
    "human knowledge",
    "artificial intelligence",
    "computer science",
    "data science",
    "md files",
  ],

  // Asset paths under /public. Both logo halves are rendered side-by-side
  // in the Logo strip; the accent is also wired into favicon metadata.
  logos: {
    primary: "/sci5th_Logo_Black.svg",
    primaryAlt: "sci5th Logo Black",
    accent: "/sci5th_Logo_Blue.svg",
    accentAlt: "sci5th Logo Blue",
  },

  // Favicon set generated from logos.accent. See AGENTS.md History
  // (2026-05-18) for how these were produced.
  icons: {
    favicon: "/favicon.ico",
    faviconPng32: "/favicon-32x32.png",
    faviconSvg: "/sci5th_Logo_Blue.svg",
    appleTouch: "/apple-touch-icon.png",
  },
} as const;

export type Brand = typeof BRAND;
