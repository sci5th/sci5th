# MDX Migration Plan — `knowledge-gallery.ts` → `content/*.mdx`

> Status: **planned, not executed.** Trigger conditions in §5. This doc
> exists so the migration is a couple of evenings of work — not a
> standing-start research project — when the trigger fires.

---

## 1. Problem

`src/config/knowledge-gallery.ts` is the single source of every Knowledge
Gallery entry's prose. As of this writing it is **33 entries, ~1,400
lines**. Adding an entry means editing a TypeScript module, which:

- Forces the editor to be comfortable with TS syntax (quote escaping,
  trailing commas, type errors blocking the build).
- Conflates content with structure — the `KnowledgeGalleryStep[]` array
  reads as code, not prose.
- Doesn't scale: at ~100 lines per entry, 100 entries is ~10,000 lines
  in one file. The file already trips editors that don't fold well.
- Loses cheap wins available in MDX: syntax-highlighted code blocks
  inside step bodies, inline images without `import`s, hot reload
  scoped to a single file.

## 2. Goals & non-goals

**Goals.**
- One MDX file per entry under `content/knowledge-gallery/<slug>.mdx`.
- Frontmatter that schema-validates at build time — a missing field or
  bad enum value fails the build the same way TS would today.
- The shape consumed by `KnowledgeGalleryEntry` (the React component)
  is **unchanged** — the migration is a content-layer swap, not a UI
  rewrite.
- The four indices the gallery already uses (`KNOWLEDGE_GALLERY_ENTRIES`,
  `KNOWLEDGE_GALLERY_BY_SYSTEM_PATH`, `findKnowledgeGalleryEntry`,
  `KNOWLEDGE_GALLERY_BY_KIND`) keep their current shape.
- Cross-linking between the System tree and the Gallery still works
  (the `?focus=<slug>` round-trip).

**Non-goals.**
- Moving content out of the repo (CMS). That's a different decision; if
  the editor pool grows to 3+ non-engineers, revisit. Until then,
  keeping content in git buys you free version control, blame, and PRs.
- Rewriting `KnowledgeGalleryEntry.tsx`. The component will keep
  receiving a typed `KnowledgeGalleryEntry`; the loader changes, not
  the renderer.
- Adding React components inside MDX bodies. Plain MDX (paragraphs +
  inline elements) is enough for everything in the current entries.
  If a future entry needs an embedded interactive widget, MDX can host
  it — but don't enable arbitrary component imports until you actually
  need them.

## 3. Tool comparison — `content-collections` vs Contentlayer

| | content-collections | Contentlayer (`next-contentlayer`) |
|---|---|---|
| **Maintenance** | Active. Created in 2023 as a Contentlayer alternative; releases roughly monthly through 2025. | Original Contentlayer was unmaintained as of early 2024; Contentlayer2 fork picked it up but is still smaller-effort. |
| **Next compat** | Next 15 + App Router: first-class. | Next 15: works via Contentlayer2 with peer-dep overrides. Friction reported. |
| **Schema validation** | Zod. | Zod-via-`defineDocumentType`. |
| **Build integration** | Auto-runs on `next dev`/`next build`; no manual step. | Same. |
| **Static export compat** | Yes — emits a build-time generated module. | Yes, same approach. |
| **Bundle size at runtime** | Zero — content is pre-compiled into a typed JS module. | Zero — same. |
| **Schema feedback** | Errors at build time with field-level locations. | Same. |
| **MDX features** | Built-in remark/rehype plugin pipeline, GFM, code highlighting. | Same. |
| **Setup complexity** | One config file (`content-collections.ts`), one folder per collection. | Two: `contentlayer.config.ts` + `next.config.js` wrapper. |
| **Ecosystem familiarity** | Smaller community; clearer docs. | More tutorials online but most are for the unmaintained v1. |

**Recommendation: `content-collections`.** Active maintenance, simpler
setup, no peer-dep friction with Next 15. The migration story is
identical to Contentlayer (Zod schema → typed exports), so if it ever
stagnates, switching is a few hours of work.

## 4. Frontmatter schema

The schema mirrors `KnowledgeGalleryEntry` minus the `steps` array
(which becomes the MDX body). Drafted as a Zod schema for
content-collections:

```ts
// content-collections.ts
import { defineCollection, defineConfig } from "@content-collections/core";
import { z } from "zod";

const knowledgeGalleryEntry = defineCollection({
  name: "knowledgeGallery",
  directory: "content/knowledge-gallery",
  include: "*.mdx",
  schema: (z) => ({
    // Required identifiers
    slug: z.string().regex(/^[a-z0-9-]+$/, "kebab-case slug"),
    title: z.string().min(1),
    summary: z.string().min(20).max(220),
    systemPath: z
      .string()
      .startsWith("Human Knowledge/", "must root at the tree"),
    breadcrumb: z.string().min(1),

    // Enums match the existing TS literal unions
    category: z.enum([
      "formal",
      "natural",
      "applied",
      "social",
      "humanities",
      "professions",
    ]),
    kind: z.enum([
      "theory",
      "algorithm",
      "model",
      "system",
      "modularity",
      "other",
    ]),
    imageSource: z.enum(["openai", "unity", "first-party", "stock"]),

    // Optional fields
    thumbnail: z.string().nullable().default(null),
    unity: z
      .object({
        path: z.string().startsWith("/"),
        name: z.string().min(1),
        useUnityWebExtension: z.boolean().default(true),
      })
      .optional(),
  }),

  // The body becomes `steps`. Each H2 in the MDX is a step title; the
  // paragraphs between H2s are the body. This keeps the editor experience
  // pure prose — no array literal.
  transform: async (entry, ctx) => {
    const steps = await splitMdxByH2(entry.content);
    return { ...entry, steps };
  },
});

export default defineConfig({ collections: [knowledgeGalleryEntry] });
```

### File layout

```
content/
  knowledge-gallery/
    chaos-theory.mdx
    compound-interest.mdx
    ...
```

### Sample entry

```mdx
---
slug: chaos-theory
title: Chaos Theory
summary: How tiny initial differences can grow into wildly different futures in deterministic systems.
systemPath: Human Knowledge/Formal Sciences/Systems Science/Chaos Theory
breadcrumb: Systems Science · Chaos Theory
category: formal
kind: theory
imageSource: openai
thumbnail: /ChaosTheory.webp
---

## The premise

Some systems obey rules you can write down in a line, and yet…

## Sensitivity to initial conditions

A 0.001% change at t=0 doesn't stay small…

## Why this isn't the same as randomness

Chaotic systems are deterministic…
```

H2s become step titles; the prose under each H2 becomes the step body.
An editor adds an entry by dropping in one Markdown file.

## 5. Trigger conditions

Migrate **when any of these holds:**

1. **Entry count reaches 60.** At ~100 lines per entry, 60 entries is
   ~6,000 lines in `knowledge-gallery.ts`. Past that, the file becomes
   actively painful to edit.
2. **A non-engineer asks to add an entry.** The TS module is a
   contributor barrier; MDX with a few-line schema-validated
   frontmatter is roughly "fill in the form."
3. **A step body needs anything richer than plain text.** Inline code
   blocks, multiple paragraphs of formatted prose, embedded images,
   inline links — all easy in MDX, all awkward in a TS string literal.
4. **`knowledge-gallery.ts` reaches 3,000 lines.** Approximate
   editor-comfort threshold.

If none of the above holds and you're tempted to migrate "for cleanliness,"
**don't**. The current setup works.

## 6. Migration steps (when the trigger fires)

Plan for one focused day:

1. `npm install -D @content-collections/core @content-collections/next @content-collections/mdx`.
2. Write `content-collections.ts` with the schema in §4.
3. Wrap `next.config.ts` with `withContentCollections` (5 lines).
4. Write `scripts/convert-knowledge-gallery.mjs` — reads
   `KNOWLEDGE_GALLERY_ENTRIES`, emits one `content/knowledge-gallery/<slug>.mdx`
   per entry by translating each step into an H2 + paragraph. The
   sketch is ~80 lines; the script runs once.
5. Spot-check the output: open three entries side-by-side with the
   originals, confirm the rendered Gallery is identical.
6. Replace `src/config/knowledge-gallery.ts` with a thin wrapper that
   re-exports `KNOWLEDGE_GALLERY_ENTRIES` from
   `content-collections`/the generated module. Keep the indices
   (`KNOWLEDGE_GALLERY_BY_SYSTEM_PATH`, `findKnowledgeGalleryEntry`,
   etc.) co-located so consumers don't change.
7. Delete the now-dead inline entries from `knowledge-gallery.ts`.
8. Update `AGENTS.md` to point editors at `content/knowledge-gallery/`.
9. Run the full check: `npm run test && npm run build && npm run check-bundle-size`.

Expect zero behavior change. The diff that ships should be: the new
`content/` folder, the new config, a much shorter
`knowledge-gallery.ts`, and the corresponding AGENTS.md update.

## 7. Open questions to resolve before starting

- **Image asset references inside MDX.** The current setup pipes
  thumbnails through `assetUrl()` for cache-busting. The MDX `thumbnail`
  field will be a raw path; the loader needs to apply `assetUrl()` at
  the same point the TS module does today. Decide: rewrite at content
  build time (in the `transform` step) or at component render time
  (the current pattern). Render-time is the lower-risk default.
- **Ordering convention.** Today entries are listed in tree pre-order.
  MDX files are alphabetical by filename. Either prefix each file with
  `01-`, `02-`, … (verbose) or compute pre-order at build time from
  `systemPath` against the tree (clean — recommended).
- **Authoring DX.** Confirm that Next dev mode hot-reloads on MDX
  edits with content-collections wired in. If not, the editor
  experience regresses; adjust before sign-off.

---

*Reviewed against the recommendations in
`docs/REVIEW_2026-05-13.md` §3 P0 #2 and §2.3D. Revisit annually or
when a trigger fires, whichever comes first.*
