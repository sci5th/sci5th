#!/usr/bin/env node
// Per-route JS budget check. Runs after `next build` (in CI and locally)
// and fails non-zero if any user-facing route's First Load JS exceeds the
// cap, unless the route is in EXEMPTIONS.
//
// "First Load JS" mirrors what `next build` prints in its summary table.
// Computed as the gzipped size of the union of chunks the route loads.
// Source: `.next/app-build-manifest.json` (internal-name → chunk list)
// joined with `.next/app-path-routes-manifest.json` (internal-name →
// public route). Internal layouts and route-group wrappers (e.g.
// `/(main)/layout`, `/_not-found/page`'s shared chunks) are not user
// routes and are skipped.
//
// Why a budget: see docs/REVIEW_2026-05-13.md §3 P2 #12. The cap is soft
// — bump CAP_KB or add a route to EXEMPTIONS when shipping intentionally
// heavier content. A bump should be explicit, not silent.

import { readFile, stat } from "node:fs/promises";
import { resolve, join } from "node:path";
import { exit } from "node:process";
import { gzipSync } from "node:zlib";

const ROOT = resolve(import.meta.dirname, "..");
const NEXT_DIR = resolve(ROOT, ".next");

const CAP_KB = 150;
const EXEMPTIONS = {
  // route → { capKb, reason }
  // Both exemptions drop once content moves out of the bundle. See
  // docs/MDX_MIGRATION_PLAN.md — that work removes the inlined
  // `KNOWLEDGE_GALLERY_ENTRIES` array (and similarly for the tree DATA),
  // which is the main contributor here.
  "/human-knowledge": {
    capKb: 175,
    reason:
      "Knowledge tree DATA constant inlined (~33 KB) until MDX migration.",
  },
  "/knowledge-gallery": {
    capKb: 160,
    reason:
      "KNOWLEDGE_GALLERY_ENTRIES (33 entries × ~1,400 lines of prose) is bundled into the client component until MDX migration.",
  },
};

async function exists(p) {
  try {
    await stat(p);
    return true;
  } catch {
    return false;
  }
}

if (!(await exists(NEXT_DIR))) {
  console.error(
    `check-bundle-size: ${NEXT_DIR} not found. Run \`npm run build\` first.`,
  );
  exit(2);
}

const buildManifestPath = resolve(NEXT_DIR, "app-build-manifest.json");
const routesManifestPath = resolve(NEXT_DIR, "app-path-routes-manifest.json");
for (const p of [buildManifestPath, routesManifestPath]) {
  if (!(await exists(p))) {
    console.error(
      `check-bundle-size: ${p} not found. Is this a Next 13+ App Router build?`,
    );
    exit(2);
  }
}

const buildManifest = JSON.parse(await readFile(buildManifestPath, "utf8"));
const routesManifest = JSON.parse(await readFile(routesManifestPath, "utf8"));

const pageChunks = buildManifest.pages || {};

// Cache so identical chunks (the shared baseline every page loads) are
// gzipped once.
const gzipCache = new Map();
async function gzippedBytes(chunkRel) {
  if (gzipCache.has(chunkRel)) return gzipCache.get(chunkRel);
  const abs = join(NEXT_DIR, chunkRel);
  let size = 0;
  try {
    const buf = await readFile(abs);
    size = gzipSync(buf).length;
  } catch {
    /* chunk listed in manifest but absent on disk — skip */
  }
  gzipCache.set(chunkRel, size);
  return size;
}

async function firstLoadKb(chunks) {
  const seen = new Set();
  let bytes = 0;
  for (const c of chunks) {
    if (seen.has(c)) continue;
    seen.add(c);
    bytes += await gzippedBytes(c);
  }
  return bytes / 1024;
}

// Walk every internal-name entry; keep only those that map to a public
// route via `app-path-routes-manifest.json`. Everything else is a
// layout/route-group wrapper or an internal Next file — not a route
// against which we set a budget.
const rows = [];
for (const [internalName, chunks] of Object.entries(pageChunks)) {
  const publicRoute = routesManifest[internalName];
  if (!publicRoute) continue; // skip /(main)/layout, /layout, etc.
  rows.push({ route: publicRoute, kb: await firstLoadKb(chunks) });
}

rows.sort((a, b) => b.kb - a.kb);

const failures = [];
console.log("Route                                   First Load JS    Cap");
console.log("─".repeat(68));
for (const { route, kb } of rows) {
  const exemption = EXEMPTIONS[route];
  const cap = exemption ? exemption.capKb : CAP_KB;
  const over = kb > cap;
  const status = over ? "OVER" : exemption ? "exempt" : "ok";
  const marker = over ? " ✗" : "";
  console.log(
    `${route.padEnd(40)}${kb.toFixed(1).padStart(8)} kB    ${String(cap).padStart(3)} kB ${status}${marker}`,
  );
  if (over) failures.push({ route, kb, cap, exemption });
}

console.log("─".repeat(68));

if (failures.length === 0) {
  console.log(`OK: all ${rows.length} routes within budget.`);
  exit(0);
}

console.error("");
console.error(`FAIL: ${failures.length} route(s) over budget:`);
for (const f of failures) {
  console.error(
    `  ${f.route}: ${f.kb.toFixed(1)} kB > cap ${f.cap} kB${f.exemption ? ` (exempt, raised cap)` : ""}`,
  );
}
console.error("");
console.error(
  "To raise the global cap: edit CAP_KB in scripts/check-bundle-size.mjs.",
);
console.error(
  "To exempt a specific route: add it to EXEMPTIONS with a one-line reason.",
);
exit(1);
