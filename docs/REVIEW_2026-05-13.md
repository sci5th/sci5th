# sci5th — Architecture, Tech Debt & Design Review (+ fin5th Prototype Notes)

> Audience: project owner.
> Scope: a triple-lens review of the `sci5th` Next.js codebase — system
> design, tech debt, and visual/UX — followed by concrete recommendations
> for what to keep, what to fix, and what to refactor *before* cloning
> the project into `fin5th` (finance).
> Read order: skim §1 (what to know in 60 seconds), then dive into §2–§4
> by lens. §5 is the fin5th conversion plan.

---

## 1. TL;DR

**sci5th is in good shape as a prototype.** It is a small, conventional
Next.js 15 + Tailwind app with three real surfaces (`/`, `/human-knowledge`,
`/knowledge-gallery`, `/about`), a clean design-token system, a single
config-driven content file, and only three runtime dependencies. The
architecture is intentional and well-documented. Most of the issues are
the predictable consequences of a prototype that grew quickly: two very
large files, content baked into source code, and some duplication that
will hurt if you clone naively.

**As-is grade per lens:**

| Lens | Grade | One-line takeaway |
|---|---|---|
| Architecture | B+ | Sound shape; needs a clean split between *shell* and *project-specific* content before forking. |
| Tech debt | B− | Two oversized files; content-in-TypeScript; no tests; no error boundary; no `/api` story yet. |
| Design | A− | Cohesive, tasteful, well-documented; small polish items around contrast, density, and motion. |

**The single most important decision for fin5th** is whether to **fork
the repo** or **extract a shared shell package** first. Recommendation:
extract first (§5). The cost is ~1–2 days. The benefit is that bug fixes
and design polish flow between projects instead of diverging.

---

## 2. Architecture Review

### 2.1 What the system actually is

A statically-renderable Next.js 15 App Router site. Three real surfaces
plus `/about`. No backend, no API routes, no database — content lives in
TypeScript modules under `src/config/`. Interactivity is two
client-component islands (the knowledge tree, the Unity player) inside an
otherwise server-rendered shell. The Unity demos are first-party assets
served from `/public/UnityGames/`.

```
                ┌─────────────────────────────────────────┐
                │            RootLayout (RSC)             │  fonts, metadata
                └────────────────┬────────────────────────┘
                                 ▼
                ┌─────────────────────────────────────────┐
                │          MainLayout (Client)            │  nav, logo, footer
                │                                         │  ──> usePathname()
                └────┬──────────┬──────────┬──────────┬───┘
                     ▼          ▼          ▼          ▼
                    /     /human-      /knowledge-   /about
                          knowledge    gallery
                                                      \
                                                       \_ [slug] entry view
                          Client                       (RSC, gallery card →
                          (rAF, tree)                   client UnityHero on
                                                        Algorithm cards)
```

### 2.2 What's good (keep this in fin5th)

- **One shared shell.** `(main)/layout.tsx` is the single source of nav,
  logo, footer. Route-dependent logo accent is a tiny convention but it
  works. Don't fragment this when you clone.
- **Config-driven content.** `src/config/knowledge-gallery.ts` is the
  one place an editor changes to add a card. The schema (`slug`, `kind`,
  `category`, `systemPath`, `thumbnail`, optional `unity`, `steps`) is
  the right shape — a non-engineer can read it.
- **Co-linked navigation between surfaces.** Gallery ⇄ Tree via
  `?focus=<path>` / `?focus=<slug>`. This pattern (one source of truth +
  deep-link both directions) is worth keeping for fin5th.
- **No premature backend.** Static export is plausible. You haven't paid
  the complexity tax of an API surface you don't need yet.
- **Three dependencies.** `next`, `react`, `@heroicons/react`. That's
  it. Maintenance load is near zero.

### 2.3 What needs to change before forking to fin5th

#### A. Split *shell* from *content* — the most important change

Right now "sci5th-the-shell" (layout, nav, design tokens, scoped CSS) is
co-resident with "sci5th-the-content" (the human-knowledge tree, the
gallery entries, the Unity demos). For fin5th you'll want to keep the
shell and replace the content. Three viable strategies, in increasing
order of effort and payoff:

1. **Fork** — copy the whole repo into `fin5th`, delete `human-knowledge`
   and `knowledge-gallery` routes, replace category palette, rebuild.
   Fastest. Bugs and polish won't flow back. Don't do this if you plan
   to maintain both.
2. **Extract `@sci5th/shell` as a workspace package** in a small monorepo
   (`pnpm` or `npm` workspaces; `Turborepo` optional). Move
   `MainLayout`, the design tokens, the global CSS, and the icon
   conventions out. Each site (`sci5th-web`, `fin5th-web`) imports the
   shell and supplies its own content. **Recommended.**
3. **Full design-system package + theme tokens** — the shell ships a
   `Theme` provider that takes a token bundle and a category palette;
   `sci5th` and `fin5th` differ only in the bundle they pass. Highest
   payoff if you expect *more* projects (`bio5th`, `art5th`, …) but
   over-engineered for two.

If you can spend one to two days, option (2). The work fits in five
moves: (a) `pnpm init` the monorepo; (b) move
`(main)/layout.tsx`, `globals.css`, `tailwind.config.ts`, and the `ink/text/brand`
tokens into `packages/shell/`; (c) parameterize the nav links and the
logo accent map; (d) move `sci5th`-specific code into `apps/sci5th/`;
(e) leave the gallery config in the app, not the package. Day two:
create `apps/fin5th/` from a template, swap the category palette
(`accent.leaf` → `finance-green`, etc.), and write fin5th's first three
gallery entries.

#### B. Parameterize *everything sci5th-named* in the shell

The shell still calls the brand "sci5th" by name in places it shouldn't
need to: hardcoded in `MainLayout`'s logo wordmark, in `<title>` strings,
in metadata, in the icon import. Make these props with sensible defaults:

```ts
// packages/shell/src/MainLayout.tsx
export interface ShellConfig {
  brand: { name: string; logoBlack: string; accentByRoute: Record<string, string> };
  nav: Array<{ href: string; label: string }>;
  metadata: { title: string; description: string };
}
```

`sci5th` keeps `brand.name = "sci5th"` and the current nav. `fin5th`
passes its own. No code changes in the shell.

#### C. Move the knowledge tree into the content layer

`HumanKnowledgeMap.tsx` is 1,590 lines because the `DATA` tree is inlined
alongside the rendering, ARIA, search, and CSS. Split it:

- `src/config/human-knowledge-tree.ts` — just the `DATA` constant and
  the `FIELD_ICONS` map.
- `src/components/HumanKnowledgeMap.tsx` — pure presentation: takes a
  tree + an icon map as props.

fin5th will reuse the presentation, replace the data. Today it has to
fork the component.

#### D. Decide the content-source story now, not later

The gallery and tree are TypeScript modules today (~1,400 + ~1,600
lines). That's fine for ~30 entries. It will not be fine at 200. Three
realistic next steps when you grow:

| Option | When it pays off | What changes |
|---|---|---|
| Stay in TS | < 100 entries, single editor | Nothing. Keep it. |
| MDX + frontmatter (`content-collections` or Contentlayer) | 100–500 entries, want to write prose more easily | Each entry becomes one `.mdx` file under `content/`. Schema-validated at build. |
| Headless CMS (Sanity, Tina, Payload) | Non-engineer editing, multi-project shared content | Content moves out of the repo; build pulls at deploy. |

For fin5th specifically, finance content gets revised more often than
science content (rates change, regulations change, market structure
changes). **MDX is the right next step.** Plan for it.

#### E. Static export, edge, or Node?

You haven't declared this anywhere. Right now `next.config.ts` is
near-empty (`{}`). Three options, pick one:

- `output: "export"` — full static export to `out/`. Cheapest hosting.
  Forces you to drop any future server-only features.
- Default (Node + edge) — keeps doors open; current state.
- Hybrid (RSC + selective static pages) — the Next 15 default.

For sci5th-as-it-stands, **`output: "export"` is the honest answer** —
you don't have an API, an auth flow, or per-user content. Declaring it
explicitly will (a) catch any code that drifts toward server-only by
mistake, (b) make hosting trivial (any static host: Cloudflare Pages,
Netlify, GitHub Pages, S3+CloudFront). For fin5th, *probably the same*
at first, but the moment you add "live rate widget" or "portfolio
calculator backed by user data" you'll want the full Next runtime —
declare your default explicitly in the AGENTS.md so future-you doesn't
forget which lane you're in.

#### F. Missing infrastructure pieces

- **No error boundary.** `UnityPlayer` and `FiveDimensionsHero` are
  client components that could throw; today a thrown error replaces the
  whole route. Add a Next App-Router `error.tsx` at `(main)/error.tsx`.
- **No `not-found.tsx`** — `/knowledge-gallery/[slug]` calls `notFound()`
  but the default Next page is ugly and uses light mode by default. Add
  `(main)/not-found.tsx` styled in your dark tokens.
- **No tests.** Not a P0 for a prototype, but if fin5th ships numeric
  calculations (interest, returns, taxes) you will want at least
  Vitest + a few unit tests around any calculator before launch.
- **No CI.** No workflow file present. A 30-line GitHub Action that
  runs `tsc --noEmit`, `next lint`, and `next build` on every push
  prevents most regressions for free.
- **No image pipeline.** Convention is "1280×720 WebP, ~60–120 KB". A
  pre-commit hook or a `scripts/optimize-image.mjs` would automate it;
  today it's tribal knowledge in `AGENTS.md`.

### 2.4 Data flow (current, no changes needed for sci5th)

```
build time:
  KNOWLEDGE_GALLERY_ENTRIES (TS) ──┐
  KNOWLEDGE_GALLERY_BY_SYSTEM_PATH ┼──> generateStaticParams() ──> /knowledge-gallery/[slug]
                                   │
  HumanKnowledgeMap.DATA (TS)      └──> tree page (RSC shell + client tree)
                                                                            ▲
runtime (client):                                                           │
  Tree row click ──> /knowledge-gallery/{slug}                              │
  Gallery card click ──> /knowledge-gallery/{slug}                          │
  "See in System" link ──> /human-knowledge?focus=...  ─────────────────────┘
  ?focus=<slug> ──> KnowledgeGalleryFocusHandler scrolls + highlights
```

Both directions of cross-linking are O(1) via the
`KNOWLEDGE_GALLERY_BY_SYSTEM_PATH` index. Keep this pattern for fin5th's
equivalent ("see this in the taxonomy" / "see related instrument").

---

## 3. Tech Debt Audit

Listed in rough order of *cost to address × benefit*. **P0** = address
before fin5th fork. **P1** = before public launch. **P2** = nice to
have.

### P0 — address before forking to fin5th

1. **`HumanKnowledgeMap.tsx` is 1,590 lines** mixing data, rendering,
   ARIA, search, focus-handling, and per-row badges. Split into three
   files: `config/human-knowledge-tree.ts` (data + icons),
   `components/HumanKnowledgeMap.tsx` (presentation), and
   `components/HumanKnowledgeMap.search.ts` (the filter logic). You will
   thank yourself when you do the same surgery on fin5th's "instruments
   taxonomy" component.

2. **`knowledge-gallery.ts` is 1,408 lines of inline prose.** This is
   currently the only file an editor changes — but at one entry every
   ~100 lines, growth is painful. Plan the MDX migration now (see §2.3D)
   even if you don't execute it for sci5th.

3. **Hardcoded brand strings in the shell.** "sci5th", logo SVGs, and
   metadata are baked into `(main)/layout.tsx` and `app/layout.tsx`.
   Forking will spread these around fin5th and you'll miss some.
   Parameterize before the fork (see §2.3B).

4. **No `output: "export"` declaration**, no CI, no image-optimization
   hook. Each is small; together they're "your prototype isn't
   reproducible from a fresh checkout in 5 minutes."

### P1 — before the next public moment

5. **No `error.tsx` / `not-found.tsx`** at the `(main)` route group.
   Default Next pages render in light mode by default and look broken
   against your dark site.

6. **`(main)/layout.tsx` is a Client Component** because of the
   `usePathname()` call. The footer, the logo strip, and the brand
   wordmark don't need to be client-rendered. Split into a small
   `<Navigation />` client component and let the rest be RSC. Saves a
   bit of JS on every page.

7. **Heroicons "outline" tree-shaking.** Importing 24 named icons
   from `@heroicons/react/24/outline` is fine; just confirm the build
   output isn't dragging in unused ones (`next build` + look at the
   chunk for `/human-knowledge`). Heroicons supports per-icon imports
   if needed.

8. **No `prefers-reduced-motion` audit for `FiveDimensionsHero`.** The
   AGENTS history mentions a reduced-motion branch but the
   knowledge-tree CSS is also full of transitions. Quick audit pass.

9. **Public assets aren't fingerprinted.** WebP and Unity build files
   are served from `/public/*` with default Next caching. That's fine
   until you ship a v2 image with the same filename and users see the
   cached v1 for a day. Worth a quick `?v=2` convention or a build-time
   hash.

10. **The `unity` carve-out is a boolean-by-proxy.** Today
    "is this entry AI-image or first-party?" is encoded as
    "does it have a `unity` field?". That's fine for two entries.
    For fin5th you may want a non-Unity first-party hero (an SVG chart,
    a real photo). Replace with an explicit
    `entry.imageSource: "openai" | "unity" | "first-party" | "stock"`
    field; the credit logic becomes a `switch`, not a ternary.

### P2 — quality of life

11. **No Storybook / Ladle.** Probably overkill for a project this size,
    but if fin5th ships interactive calculators each one is worth a
    sandbox.
12. **No bundle-size budget.** `next build` reports per-route bundles.
    Set a soft cap (e.g., "no route over 150 KB JS"), and add a CI
    check.
13. **Animation lives in a 200+ line `FiveDimensionsHero.tsx`** with
    inline rAF. If it stays this large, extract the
    "ParticleSystem" abstraction into a small library; if it shrinks,
    leave it.
14. **`AGENTS.md` has grown to 51 KB of history** — useful, but starting
    to dwarf the actual rules. Move entries older than ~3 months into
    `docs/HISTORY.md` and keep `AGENTS.md` as the live spec.
15. **No favicon set besides the SVG logo.** Add `apple-touch-icon.png`
    and a real `favicon.ico` before launch.

---

## 4. Design Critique

The site is genuinely well-designed — coherent, restrained, dark-mode-
first, with a thoughtful pastel category system. Most of this critique
is "small things that would compound into a more refined feel," not
"problems."

### 4.1 What's working

- **One palette, used consistently.** `ink.*` / `text.*` / `brand.*` /
  `accent.*` cover every surface. The DESIGN_SYSTEM doc is concrete
  enough that an outside designer could be productive in 30 minutes.
- **Six category pastels on a 60°-spaced hue wheel.** This is genuinely
  good color thinking and the contrast ratios are documented.
- **Pastel-on-dark, no drop shadows.** Avoids the AI-default "glassy
  card" aesthetic.
- **Type pairing is restrained.** DM Sans for the shell, JetBrains Mono
  scoped to the tree only. The mono usage feels intentional.
- **Active link visualization.** `pointer-events-none` + brand color is
  a clean trick to mark "you are here."

### 4.2 What to refine

#### A. Information density vs. air

The Knowledge Gallery cards are roomy (`p-4`, `gap-4 md:gap-6`,
`aspect-video` thumbnails) and the steps view stacks rounded panels
generously. That's fine for 13 cards. With 30+ entries the index page
becomes a long scroll. Consider: (a) a denser card variant for the index
(thumbnail on the left, title + summary on the right, 100px tall — like
GitHub repo cards); (b) a list view toggle. For fin5th, where users may
be scanning many instruments quickly, plan a list view from day one.

#### B. The home page is austere by choice — make sure it's a choice

`/` is just the animated hero + a single tagline. It's a stylistic move
but for a "deep working prototype intended to scale" it gives a new
visitor very little to do. Three options, in increasing order of
disruption:

1. Add a small "Explore" affordance — e.g., two pastel cards under the
   tagline linking to the two real surfaces.
2. A 3-card layout: Tagline + animation as the centerpiece, three
   "what's inside" cards underneath linking to Tree, Gallery, About.
3. Leave it as-is and trust the nav. (This is the current bet.)

For fin5th, **the home page is your one chance to communicate what the
site is about**; an austere hero will read as "unfinished" to a finance
audience that expects density. Plan for option (2) there.

#### C. Contrast pass on small text

The 0.625rem (`10px`) uppercase image credit (e.g., `Image: Images 2.0
by OpenAI`) is at the floor of legibility. Tested mentally against the
contrast ratio for `text-text-500` (`#6d6e68`) on `ink-900` (`#161a22`):
that's around 3.4:1, which is below WCAG AA for body text. It passes
"non-essential" decoration but technically these credits are
informational. Two fixes: bump to `0.75rem` (`12px`) or bump the color
to `text-text-300` (`#a5a79f`, ~7.8:1). Either is fine.

#### D. Footer typography rhythm

The new footer has two text rows (disclosure + copyright) at the same
size and color. Visually they read as one block. Consider increasing the
disclosure line's contrast (`text-text-300`) and keeping the copyright
quieter — or moving the copyright into the disclosure line as a comma-
separated suffix.

#### E. Per-card image credit position

Currently the credit sits between the thumbnail and the breadcrumb/title
block. It's right-aligned and uppercase, which keeps it quiet, but on
narrow viewports (one-column grid) it competes with the breadcrumb. Try
overlaying it on the thumbnail's bottom-right corner with a 60% black
gradient (Instagram/Vimeo convention). Saves 16px of vertical space per
card and reads more like an attribution and less like a status.

#### F. The Knowledge Gallery sub-navbar can grow ungracefully

Today there are five filter tabs (All, Algorithms, Modularity, Models,
Systems, Theories) in a horizontal row inside a single pill. Add a
sixth or seventh and it wraps onto a second row (acceptable) or starts
crowding (less so). For fin5th's likely categories — "Instruments,"
"Strategies," "Regulations," "Concepts," "Calculators," "Glossary" — six
to eight categories is plausible. Plan a vertical sidebar variant for
md+ now.

#### G. Reduced motion

The hero respects `prefers-reduced-motion`, per the history log. The
knowledge tree's smooth scroll + pulse animation on `?focus=` does too
(again per history). Confirm both still hold; add the same treatment to
any new fin5th animation by default — write it into the standing rules.

#### H. Empty / loading / error states

- Empty: Gallery `empty` strings exist per filter ("No algorithms yet.")
  — good.
- Loading: no perceptible loading state on `/knowledge-gallery/[slug]`
  because it's statically generated; the Unity demo has its own loader.
  Fine.
- Error: no styled error or 404. See §3 P1.

#### I. Mobile

I didn't test on a real device but the Tailwind breakpoints are correct
(`md:`, `lg:`). Two specific worries: the knowledge tree at 320px width
(deep nesting + label wrapping), and the Unity canvas's `minWidth: 480`
which will exceed many mobile viewports. Confirm with a real-device pass
before launch.

#### J. Accessibility

The tree's ARIA pattern is genuinely well-done. Two checks worth doing
formally:

- Run `axe-core` against each route. Most likely findings: missing
  `<main>` landmark on `/about`; the per-card image credit text contrast
  (§4.2C); the focus order through the Gallery sub-navbar with many tabs.
- Confirm Unity canvas focusability and a keyboard-accessible "Stop"
  button (the StopIcon button is good — verify it's tab-reachable when
  the game is playing).

---

## 5. fin5th — Conversion & Setup Plan

fin5th's domain (finance) and sci5th's domain (science/knowledge) overlap
structurally: both have a deep taxonomy, both have curated "explainers,"
both benefit from cross-linking from the taxonomy node to the explainer.
That's the conceptual reuse. Below is the concrete plan.

### 5.1 What you keep verbatim

- Design tokens (`ink.*`, `text.*`, `brand.*`). The pastel category
  palette: keep the *system*, swap the *hues* (see §5.3).
- The shell: `MainLayout`, `Footer`, `Logo`, `Navigation`,
  font loading via `next/font`.
- The Knowledge Gallery surface pattern: card index → entry view with
  hero + steps. Rename to fit fin5th's domain (e.g., "Concept Gallery,"
  "Playbook," "Field Guide") but keep the shape.
- The cross-linking pattern (taxonomy ⇄ gallery, both directions, via
  query params).
- The AI-disclosure conventions (per-image credit, footer line, About
  page). Critically: review the AI-content disclosure for finance.
  **Finance content has stricter "this is not advice" obligations than
  science content** — see §5.5.

### 5.2 What you swap

- The data. `human-knowledge-tree.ts` → `instruments-tree.ts` or
  `finance-taxonomy.ts`. `knowledge-gallery.ts` → `concept-gallery.ts`.
- The brand. Logo SVGs, wordmark, the route-accent map.
- The category palette hues (next subsection).
- The home page hero. The "five dimensions" animation is science-
  flavored; fin5th wants something more grounded — a quiet
  cash-flow chart, an interest-rate ribbon, or just a clean wordmark
  with a slow color shift.
- The Unity demos are sci5th-only. fin5th's interactive elements are
  almost certainly **financial calculators** (compound interest,
  amortization, FX, options Black-Scholes, etc.) — these become small
  React components, not WebGL builds. Plan the architecture for them
  now (§5.4).

### 5.3 Category palette — concrete suggestion for fin5th

Keep the six-category, ≥30°-hue-apart, ≥AA-contrast system. Swap the
hue choices to feel financial without being a stereotype (no "money
green" overload):

| sci5th token | sci5th hue | sci5th meaning | fin5th token | fin5th hue | Suggested fin5th meaning |
|---|---|---|---|---|---|
| `accent.leaf` | ~75° pastel | Formal Sciences | `accent.mint` | ~145° pastel | Yields & income (still a green nod, but cooler) |
| `accent.sky` | ~212° pastel | Natural Sciences | `accent.steel` | ~210° pastel | Equities & markets |
| `accent.sand` | ~44° pastel | Applied Sciences | `accent.gold` | ~38° pastel | Commodities & store-of-value |
| `accent.rose` | ~342° pastel | Social Sciences | `accent.coral` | ~10° pastel | Risk & volatility (warm but not red-alarm) |
| `accent.sage` | ~152° pastel | Humanities | `accent.violet` | ~285° pastel | Regulation & policy |
| `accent.lilac` | ~262° pastel | Professions | `accent.slate` | ~225° pastel | Practitioners & operations |

Six categories, all pastel, all ≥AA contrast on `ink.900`. Avoid red
for *negative numbers* and green for *positive numbers* in the
palette tokens themselves — those should be `feedback.up` /
`feedback.down` and live separately from the category system, or you'll
re-collide them.

### 5.4 Calculators are the new Unity demos

In sci5th, the "interactive payoff" on an Algorithm card is a Unity
WebGL build. In fin5th it's a calculator. They occupy the same UX slot
(hero of the entry page) but are wildly different to build. Suggested
architecture:

```
src/
├── components/calculators/
│   ├── CalculatorHero.tsx          # The slot wrapper (mirrors UnityHero)
│   ├── CompoundInterest.tsx        # One file per calculator
│   ├── Amortization.tsx
│   └── ...
└── config/calculators.ts            # Registry: slug → { Component, label, params }
```

`KnowledgeGalleryEntry.tsx` (or its fin5th equivalent) gets a third
branch in the hero conditional:

```ts
entry.calculator   // → <CalculatorHero key={entry.calculator}>...</CalculatorHero>
entry.unity        // → <UnityHero …/>           (still possible if you want it)
entry.thumbnail    // → static image hero
```

Each calculator is its own component, no shared state, no global store
needed. Per-calculator unit tests in Vitest. Numeric correctness is the
**only** thing that matters here — write the tests before the UI.

### 5.5 Disclosure & compliance — the one place fin5th is *not* like sci5th

sci5th's disclosure is generous ("AI-drafted, not expert-reviewed").
That works because the cost of a wrong science explainer is "user
learns a wrong fact." The cost of a wrong finance claim is real money
and, in many jurisdictions, regulatory exposure. Three concrete
implications:

1. **The "not advice" disclaimer is mandatory**, not nice-to-have. Put
   it in the footer line *and* the gallery banner *and* the About page.
   Something like: "fin5th is educational content. It is not financial,
   legal, or tax advice. Do not make investment decisions based on this
   site without consulting a qualified professional."
2. **Calculator outputs need a disclaimer too** — adjacent to every
   numeric result, not just on the page once. "Illustrative only. Real
   results vary by tax jurisdiction, fees, and inflation." For US users,
   if you reference rates, dates, or fund products, you cross into FINRA
   territory; for EU users, MiFID II disclosures.
3. **Be specific about sources for numerical claims.** "The current
   federal funds rate is X" without a date and source is worse than no
   claim. For any data-driven content (rates, returns, ratios), the
   entry should display a "Last reviewed: YYYY-MM-DD" stamp.

This is also the right time to **add a `/legal` route** (terms of use +
risk disclosure) in fin5th from day one. sci5th can live without it;
fin5th can't.

### 5.6 Minimum-viable fin5th week 1

| Day | Goal | Done when |
|---|---|---|
| 1 | Monorepo + shell extraction | `apps/sci5th` builds from `packages/shell`, no regressions; `tsc --noEmit` clean. |
| 2 | `apps/fin5th` scaffold | Empty fin5th renders the shell with its own wordmark and palette, on `/`, `/about`, and an empty `/concept-gallery`. |
| 3 | First three gallery entries (e.g., "Compound Interest," "Inflation," "Asset Class") + their static thumbnails | Three cards render; entry pages render; cross-linking works. |
| 4 | First calculator: Compound Interest, in `CalculatorHero` slot, with unit tests | `npm test` passes; calculator handles edge cases (negative rate, zero principal, monthly vs annual). |
| 5 | Disclosure + `/legal` route, "Last reviewed" stamps on all data-driven content | Footer + banner + calculator-adjacent disclaimers all live; About page has been rewritten for finance audience. |

### 5.7 What to NOT clone

- The Unity infrastructure (`UnityHero`, `UnityPlayer`, the
  `public/UnityGames/` tree). fin5th doesn't need it. If you keep the
  components in the shell "just in case," they're 700+ lines of dead
  code for fin5th. Move them to `apps/sci5th/components/` not the
  shared shell.
- The OpenAI Images 2.0 thumbnail convention *as the default*. For
  finance, AI-generated hero images often feel weirdly off-tone
  (synthetic charts, made-up logos). Plan to commission real
  illustrations or use restrained typographic heroes for fin5th — and
  treat the AI image option as the fallback, not the default.

---

## 6. Recommended Next Actions

In strict order, smallest-first so you can stop at any point and still
have value:

1. **Today (30 min)** — Add `output: "export"` to `next.config.ts`,
   declare it in `AGENTS.md` as the deployment target, add a
   `not-found.tsx` and `error.tsx` in `(main)/`. Verify
   `next build` still passes.
2. **This week (1 day)** — Split `HumanKnowledgeMap.tsx` into
   data + presentation (§3 P0 #1). Split the `(main)/layout.tsx` so the
   footer and logo are RSC (§3 P1 #6). Bump the per-card image credit
   contrast (§4.2C).
3. **This week (1 day)** — Parameterize brand strings in the shell
   (§2.3B). At this point sci5th still works; the shell is now reusable
   without forking.
4. **Next week (1–2 days)** — Set up `pnpm` workspaces; move shell into
   `packages/shell`; move sci5th into `apps/sci5th`. Add a minimal CI
   workflow that runs `tsc`, `lint`, `build` on every push.
5. **Following week** — Scaffold `apps/fin5th` (§5.6). At this point you
   have the prototype for the next project, with a clean separation
   between what's shared and what's not.

---

## 7. Open Questions

- **Who is fin5th for?** Retail investors / advanced retail /
  professionals? This determines the disclosure floor and the calculator
  complexity ceiling.
- **Will fin5th have user accounts** (saved portfolios, watchlists)? If
  yes, the static-export plan changes. Worth deciding before §5.6 day 1.
- **Are there geographies you're explicitly targeting?** Disclosure
  language is jurisdiction-specific (US: SEC/FINRA, EU: MiFID II/ESMA,
  UK: FCA, etc.). Defaulting to "US/EU general educational content with
  a 'consult a professional' disclaimer" is reasonable but should be a
  decision, not a default.
- **Does the existing sci5th repo stay private or go public?** Affects
  the licensing posture and whether you can/should ship an
  `npm publish`-able shell package vs. a private workspace package.

---

*Last reviewed: 2026-05-13. Reviewer: triple-lens pass on the
`sci5th` codebase at commit-current as of this date. Recommendations
reflect a snapshot of the project; revisit after the monorepo
extraction lands.*
