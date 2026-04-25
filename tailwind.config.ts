import type { Config } from "tailwindcss";
import enginePreset from "@brain5th/engine/tailwind.preset";

/**
 * Tailwind config for sci5th.
 *
 * The shared design tokens (colors, fonts, radius, shadow) come from the
 * engine preset. Anything sci5th-only would go in `theme.extend` here —
 * currently empty.
 */
const config: Config = {
  presets: [enginePreset],
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
