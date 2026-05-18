import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";

const root = fileURLToPath(new URL(".", import.meta.url));

// Minimal Vitest setup mirroring tsconfig's `@/` alias so tests can
// import from `@/config/...` the same way the app code does.
export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.test.{ts,tsx}"],
    // No globals; tests import { describe, it, expect } explicitly.
  },
  resolve: {
    alias: {
      "@": resolve(root, "src"),
    },
  },
});
