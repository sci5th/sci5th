import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#0f1218",
          900: "#161a22",
          800: "#1e2430",
          700: "#2a3140",
          600: "#3a4254",
          500: "#55607a",
        },
        line: {
          700: "rgba(255,255,255,0.08)",
        },
        text: {
          100: "#e9e8e2",
          300: "#a5a79f",
          500: "#6d6e68",
        },
        brand: {
          blue: "#a7c5e8",
          pink: "#e7b9c7",
        },
        accent: {
          leaf: "#c9dca5",
          "leaf-dim": "#a4c467",
          sky: "#a7c5e8",
          "sky-dim": "#6298d6",
          sand: "#e3cf9b",
          "sand-dim": "#d0ae57",
          rose: "#e7b9c7",
          "rose-dim": "#d17893",
          lilac: "#c4b0e3",
          "lilac-dim": "#9470cc",
          sage: "#a3d4bd",
          "sage-dim": "#68b893",
        },
        feedback: {
          error: "#d98b8b",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      borderRadius: {
        sm: "6px",
        md: "10px",
        lg: "12px",
      },
      boxShadow: {
        elevated:
          "0 1px 0 rgba(255,255,255,0.04) inset, 0 8px 24px rgba(0,0,0,0.35)",
      },
    },
  },
  plugins: [],
};

export default config;
