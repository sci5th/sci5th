# MDX as a Content Storage Option

> Status: **considered, parked.** Knowledge Gallery entries currently
> live in `src/config/knowledge-gallery.ts` (a TypeScript module). MDX
> is the obvious next step *if* the file ever outgrows that format —
> but it hasn't yet. This doc exists so the decision is research-ready
> rather than research-required when (or if) a trigger fires.

---

## When to revisit

Move to MDX **if any of these holds:**

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

If none of the above holds and you're tempted to switch "for
cleanliness," **don't.** The current setup works.

## Tool comparison — `content-collections` vs Contentlayer

If a trigger fires, these are the two realistic choices. This
comparison is the part of the doc most expensive to reconstruct later,
so it stays.

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

**If we ever do this: `content-collections`.** Active maintenance,
simpler setup, no peer-dep friction with Next 15.

## Schema draft

The hard part of any migration would be designing the frontmatter
schema. Drafting it now means a future implementation starts from a
known shape rather than from scratch. Mirrors `KnowledgeGalleryEntry`
minus the `steps` array (which becomes the MDX body):

```ts
// content-collections.ts (sketch)
import { defineCollection, defineConfig } from "@content-collections/core";

const knowledgeGalleryEntry = defineCollection({
  name: "knowledgeGallery",
  directory: "content/knowledge-gallery",
  include: "*.mdx",
  schema: (z) => ({
    slug: z.string().regex(/^[a-z0-9-]+$/, "kebab-case slug"),
    title: z.string().min(1),
    summary: z.string().min(20).max(220),
    systemPath: z
      .string()
      .startsWith("Human Knowledge/", "must root at the tree"),
    breadcrumb: z.string().min(1),
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
    thumbnail: z.string().nullable().default(null),
    unity: z
      .object({
        path: z.string().startsWith("/"),
        name: z.string().min(1),
        useUnityWebExtension: z.boolean().default(true),
      })
      .optional(),
  }),
});

export default defineConfig({ collections: [knowledgeGalleryEntry] });
```

### Sample MDX entry

H2s become step titles; the prose under each H2 becomes the step body.
An editor adds an entry by dropping in one Markdown file.

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

## Things to figure out if/when this happens

Not gotchas exactly — just the questions worth a few minutes of
thought before the first line of migration code:

- **Image asset references.** Today, thumbnails go through `assetUrl()`
  for cache-busting. The MDX `thumbnail` field would be a raw path; the
  loader would need to apply `assetUrl()` at the same point the TS
  module does today. Render-time application (current pattern) is the
  lower-risk default.
- **Ordering convention.** Today entries are listed in tree pre-order.
  MDX files are alphabetical by filename. Either prefix each file with
  `01-`, `02-`, … (verbose) or compute pre-order at build time from
  `systemPath` against the tree (clean).
- **Hot reload.** Confirm Next dev mode hot-reloads on MDX edits with
  content-collections wired in. If not, the editor experience
  regresses; adjust before sign-off.

---

*Background: this was item 21 of the triple-lens review
(`docs/REVIEW_2026-05-13.md` §3 P0 #2). Revisit annually or when a
trigger fires, whichever comes first.*
