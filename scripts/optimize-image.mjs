#!/usr/bin/env node
// Optimize a thumbnail image to the project convention:
//   • 1280×720 (16:9), `fit: cover` so we never stretch
//   • WebP at quality 75; auto-bumps to ≤80 if the file lands under the
//     target band, auto-drops to ≥70 if it lands over
//   • Target size band: 60 KB – 120 KB
//   • Output: same directory, same basename, `.webp` extension
//   • Leaves the original PNG/JPG in place — delete by hand once you've
//     verified the WebP looks right
//
// Usage:
//   node scripts/optimize-image.mjs <path-to-image> [<path>...]
//   node scripts/optimize-image.mjs public/Foo.png public/Bar.jpg
//
// Wired into lefthook (.lefthook.yml) so it runs automatically on any
// staged PNG/JPG/JPEG under /public/ — the hook stages the resulting
// .webp alongside the original.

import { argv, exit } from "node:process";
import { stat, writeFile } from "node:fs/promises";
import { basename, dirname, extname, join } from "node:path";
import sharp from "sharp";

const W = 1280;
const H = 720;
const TARGET_MIN = 60 * 1024;
const TARGET_MAX = 120 * 1024;
const QUALITY_FLOOR = 70;
const QUALITY_CEILING = 80;
const START_QUALITY = 75;

const args = argv.slice(2).filter((a) => !a.startsWith("-"));
if (args.length === 0) {
  console.error("Usage: optimize-image.mjs <image> [<image>...]");
  exit(2);
}

const ACCEPTED = new Set([".png", ".jpg", ".jpeg"]);

async function optimize(input) {
  const ext = extname(input).toLowerCase();
  if (!ACCEPTED.has(ext)) {
    console.warn(`skip: ${input} (${ext} not in .png/.jpg/.jpeg)`);
    return;
  }
  const out = join(dirname(input), basename(input, ext) + ".webp");

  // Start at quality 75; if under-band, retry up to 80; if over-band, down to 70.
  let quality = START_QUALITY;
  let buf;
  for (let attempt = 0; attempt < 4; attempt += 1) {
    buf = await sharp(input)
      .resize(W, H, { fit: "cover", position: "centre" })
      .webp({ quality, effort: 4 })
      .toBuffer();

    if (buf.length < TARGET_MIN && quality < QUALITY_CEILING) {
      quality = Math.min(QUALITY_CEILING, quality + 5);
      continue;
    }
    if (buf.length > TARGET_MAX && quality > QUALITY_FLOOR) {
      quality = Math.max(QUALITY_FLOOR, quality - 5);
      continue;
    }
    break;
  }

  await writeFile(out, buf);
  const kb = (buf.length / 1024).toFixed(1);
  const band =
    buf.length < TARGET_MIN
      ? " (under band)"
      : buf.length > TARGET_MAX
        ? " (over band)"
        : "";
  console.log(`${input} → ${out}  q=${quality}  ${kb} KB${band}`);
}

let failed = 0;
for (const f of args) {
  try {
    await stat(f);
    await optimize(f);
  } catch (e) {
    console.error(`fail: ${f}: ${e instanceof Error ? e.message : e}`);
    failed += 1;
  }
}
exit(failed > 0 ? 1 : 0);
