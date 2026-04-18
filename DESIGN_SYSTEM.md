# sci5th — Design System Summary

> Scope: design-system record for `sci5th_website` (Next.js 15 + Tailwind).
> Captures the direction established on 2026-04-17 — *modest style, dark-only, pastel
> accents, keep the existing visual direction* — and the implementation that landed
> the same day. Edit this file when tokens or patterns change; it is the single source
> of truth.

## Summary

**Components reviewed:** 4 (RootLayout, MainLayout shell = Navigation + Logo + Footer,
HomePage, HumanKnowledgeMap) · **Consolidation needed:** two parallel color systems
(Tailwind `slate-*` literals vs. the tree's `km-*` CSS vars) · **Score:** 64 / 100.

The existing look — slate-700 chrome with a near-black IDE card and a One-Dark
rainbow tree — is already dark and already modest in structure. It's a good starting
point. What it is **not** is *one system*: the shell uses Tailwind `slate-600/700/800`
tokens and the knowledge tree uses its own scoped `#1a1a1a / #2a2a2a / ...` CSS
variables, and the two palettes don't quite meet. The goal of this revision is to
keep the current visual direction, **unify both surfaces onto a single dark token
set**, and fold in just enough pastel accent (the existing `Logo_Blue` + `Logo_Pink`
SVGs already point at the right hues) to soften the palette without lightening the
background.

Everything else in the earlier critique — keyboard/ARIA gaps, red subtitle, emoji
icons, label overflow, empty state — still applies because those are structural, not
palette-dependent.

## Design Tokens

### Colors — current (two disconnected systems)

| Where | Values in use | Issue |
|---|---|---|
| Shell (`(main)/layout.tsx`, `page.tsx`) | `bg-slate-600` (logo strip), `bg-slate-700` (nav + main), `bg-slate-800` (footer + video frame), `text-slate-950`, `text-slate-400/500`, `text-white` | Tailwind literals, no shared name. |
| Knowledge tree (`km-root`) | `--bg #1a1a1a`, `--bg2 #2a2a2a`, `--bg3 #3a3a3a`, `--text #e8e7e3`, `--text2 #9c9a92`, `--text3 #6b6a65`, `--text4 #E06C75`, `--accent #85B7EB`, depth palette `#5DCAA5 #61AFEF #C678DD #E06C75 #56B6C2 #98C379 #D19A66` | Scoped vars; none of these exist in Tailwind config. Red `--text4` is mis-used as the subtitle color. |

Slate-700 (`#334155`) and the tree's `#1a1a1a` don't share a hue or a tonal ramp — the
card looks transplanted onto the shell rather than part of it.

### Colors — proposed unified dark token set (keeps the current vibe)

A single dark ramp plus two pastel brand accents. Put these in `tailwind.config.ts`
under `theme.extend.colors` **and** mirror as `:root` CSS variables in `globals.css` so
the `km-*` block can consume the same values without a second source of truth.

| Token | Hex | Replaces today's… | Role |
|---|---|---|---|
| `ink.950` | `#0f1218` | — | Deepest background (footer, optional) |
| `ink.900` | `#161a22` | `--bg #1a1a1a` | Card / panel background |
| `ink.800` | `#1e2430` | `slate-800` | Secondary surface (video frame, toolbar inputs) |
| `ink.700` | `#2a3140` | `slate-700`, `--bg2 #2a2a2a` | Main page background, hover bg |
| `ink.600` | `#3a4254` | `slate-600`, `--bg3 #3a3a3a` | Logo strip, pressed states |
| `ink.500` | `#55607a` | — | Dividers, inactive chrome |
| `line.700` | `rgba(255,255,255,.08)` | `--border` | Borders, indent guides |
| `text.100` | `#e9e8e2` | `--text #e8e7e3` | Primary text |
| `text.300` | `#a5a79f` | `--text2`, `text-slate-400` | Secondary text |
| `text.500` | `#6d6e68` | `--text3`, `text-slate-500` | Tertiary / placeholder |
| `brand.blue` | `#A7C5E8` | `--accent #85B7EB` (slightly softened) | Primary pastel accent — focus rings, active nav, "open" triangle |
| `brand.pink` | `#E7B9C7` | — (currently unused) | Secondary pastel accent — hover highlights, search-match underline |
| `accent.mint` | `#B9D8C6` | pick from depth palette | Category color — Formal |
| `accent.sand` | `#E3CF9B` | pick from depth palette | Category color — Applied |
| `accent.lilac` | `#CFB8E0` | pick from depth palette | Category color — Humanities |
| `accent.sky` | `#A7C5E8` | = `brand.blue` | Category color — Natural |
| `accent.rose` | `#E7B9C7` | = `brand.pink` | Category color — Social |
| `accent.peach` | `#E8BFA0` | pick from depth palette | Category color — Professions |
| `feedback.error` | `#D98B8B` | was `--text4` used for the subtitle | **Only** real errors |

Why the ink ramp sits between slate and `#1a1a1a`: it reads as the same "dev-console"
temperature users have now, but one consistent ramp replaces three disconnected ones,
and the slight warmth (`#161a22` vs. `#1a1a1a`) prevents the card from looking like a
black cutout on the page.

All pastel accents pass WCAG AA (contrast ≥ 4.8 : 1) against `ink.900`.

### Typography

Currently: body inherits the browser default; the tree component references `DM Sans`
and `JetBrains Mono` with no loader, so most users see fallbacks. Wire both via
`next/font/google` in `app/layout.tsx` and expose as Tailwind `fontFamily` tokens.

| Token | Family | Use |
|---|---|---|
| `font-sans` | `DM Sans` (already referenced by the tree title) | Shell, body, wordmark |
| `font-mono` | `JetBrains Mono` (already referenced by tree labels) | Tree labels, code |

Type scale (rem): `xs 0.75` · `sm 0.875` · `base 1` · `lg 1.125` · `xl 1.375` ·
`2xl 1.75` · `3xl 2.25`. Line-heights: body `1.6`, tree `1.75` (down from `1.9`, which
made rows small enough to miss the 40 px touch target flagged in the prior critique).

### Spacing, radius, shadow, motion

- **Spacing** — keep Tailwind's default scale. Standardize page padding at
  `px-4 md:px-8`, vertical rhythm at `py-6 md:py-10` (matches both pages already).
- **Radius** — `sm 6px` (inputs, chips), `md 10px` (buttons), `lg 12px` (card — matches
  the tree's current `border-radius: 12px`). The shell's implicit square corners stay
  square, which is fine; radius only lives on inset elements.
- **Shadow** — in dark mode, rely on background contrast rather than drop shadows.
  Replace the Home video's `shadow-lg` with a 1 px `line.700` border; it reads cleaner
  on a dark surface. One optional elevation token for future lifted elements:
  `0 1px 0 rgba(255,255,255,.04) inset, 0 8px 24px rgba(0,0,0,.35)`.
- **Motion** — keep the current `120–200 ms` transitions; wrap non-essential motion in
  `@media (prefers-reduced-motion: reduce)`.

## Component Completeness

| Component | States | Variants | Docs | Score |
|---|---|---|---|---|
| Navigation (inside `(main)/layout.tsx`) | default, active, hover | 1 (horizontal) | none | 5 / 10 |
| Logo strip | default, hover | 1 | none | 6 / 10 |
| Footer | default | 1 | none | 7 / 10 |
| Home tagline + video | default | 1 | none | 6 / 10 |
| Tree — search input | default, focus, has-value (×), empty | 1 | none | 6 / 10 |
| Tree — `.km-btn` | default, hover, active (`scale .97`) | 1 | none | 6 / 10 |
| Tree — `.node` | default, hover, has-children, leaf | depth-0 … depth-6 | none | 4 / 10 (no `:focus-visible`, no keyboard handler) |
| Empty state | — | — | missing | 0 / 10 |

### Naming consistency

| Issue | Where | Recommendation |
|---|---|---|
| Two parallel naming systems: Tailwind `slate-*` utilities in the shell, `km-*` + bare `.node .ic .lb .ch` inside the tree. | Shell vs. `HumanKnowledgeMap.tsx` | Keep the `km-*` scope (AGENTS.md pins it as an intentional exception), but rename the bare class names to `km-node / km-icon / km-label / km-children` so they can't collide with a future component. |
| `--text4` is used for the subtitle but its name implies "4th-tier text." | Tree | Rename to `--feedback-error`, and stop using it for instructional copy — switch the subtitle to `text.300`. |
| `--accent` is defined once and only used on input `:focus`. | Tree | Use it for the `:focus-visible` ring on nodes, buttons, *and* the input; use it on the expand triangle when open. Leftover tokens rot. |
| Depth colors `depth-0`…`depth-6` encode **nesting level**, not **category**. | Tree | Repurpose as `cat-formal / cat-natural / cat-applied / cat-social / cat-humanities / cat-professions`, applied at top level and inherited. Depth is then conveyed by indentation + left border alone. This was a priority in the earlier critique and still holds. |
| Active nav link renders at `opacity-50` with `pointer-events-none`. | Shell | Dimming the active link inverts the convention — keep it full-opacity with `brand.blue` color (or an underline) plus `pointer-events-none`. |

### Token coverage

| Category | Defined as tokens | Hardcoded found | Action |
|---|---|---|---|
| Colors | 0 in Tailwind; ~14 scoped in `km-*` | ~20 hex values + ~10 `slate-*` literals | Move to `tailwind.config.ts` + `:root` CSS vars; the `km-*` block consumes the same vars. |
| Spacing | Tailwind defaults only | A few bare `px` values inside `km-*` (`padding: 8px 32px 8px 12px`, etc.) | Leave `km-*` intact per AGENTS.md; swap bare values outside it for Tailwind scale. |
| Typography | 0 | `DM Sans`, `JetBrains Mono`, `1.75rem`, `13px`, `16px` | Define scale + load via `next/font`. |
| Radius | 0 | `rounded-lg`, `12px`, `8px`, `6px` | 3-step scale above. |
| Shadow | 0 | `shadow-lg` | Swap for a `line.700` border in dark mode; one optional elevation token. |

## Iconography

A two-tier, name-matching system. Icons identify the *kind of thing* a node is — they
don't try to depict every one of the ~900 entries. All icons are monochrome line
strokes that inherit `currentColor` (they tint with the category palette).

**Library:** `@heroicons/react/24/outline` (already a dependency). Single source for
both tree glyphs and shell chrome (chevrons, search `×`). Everything inherits
`currentColor`, tree-shakable per-icon import.

**Tier 1 — Top-level domains (depth 0).** One icon each, always shown:

| Domain | Heroicons icon | Category token |
|---|---|---|
| Formal Sciences | `VariableIcon` | `accent.mint` |
| Natural Sciences | `BeakerIcon` | `accent.sky` (= `brand.blue`) |
| Applied Sciences & Technology | `CogIcon` | `accent.sand` |
| Social Sciences | `UserGroupIcon` | `accent.rose` (= `brand.pink`) |
| Humanities | `BookOpenIcon` | `accent.lilac` |
| Professions & Interdisciplinary | `BriefcaseIcon` | `accent.peach` |

**Tier 2 — Mid-level fields (depth 1–2).** Semantic icon where one exists; otherwise
the label carries its own meaning (no fallback icon shown). Current mapping — extend
in `FIELD_ICONS` in `HumanKnowledgeMap.tsx` as the tree grows:

| Field | Heroicons icon |
|---|---|
| Mathematics | `CalculatorIcon` |
| Computer Science / Bioinformatics | `CpuChipIcon` |
| Logic | `PuzzlePieceIcon` |
| Systems Science / Physics / Biology / Biotech / Culinary | `SparklesIcon` |
| Chemistry | `BeakerIcon` |
| Earth Sciences / Agriculture | `GlobeAltIcon` |
| Astronomy | `RocketLaunchIcon` |
| Engineering / Skilled Trades | `WrenchScrewdriverIcon` |
| Medicine & Health | `HeartIcon` |
| Library Science / History | `BuildingLibraryIcon` |
| Data Science / Economics | `ChartBarIcon` |
| Linguistics | `LanguageIcon` |
| Cognitive Science / Philosophy | `LightBulbIcon` |
| Business & Management | `BriefcaseIcon` |
| Design | `PaintBrushIcon` |

**Tier 3 — Leaves & deeper nodes.** Neutral marker, not a semantic icon. Options:

- A small centered `·` (what the tree uses today) — **keep this**, at `text.500`.
- Or a tiny `ChevronRight` at 10 px in `text.500` for a hair more formality.

Why not icon-every-leaf: with ~900 nodes (e.g. "Knot Theory," "Cryogenic Engineering
& Dilution Refrigerators") no canonical icon exists, and inventing one per leaf
would create visual noise instead of reducing it. Semantic icons at Tier 1 + 2 give
every row a meaningful landmark; Tier 3 keeps the rhythm clean.

**Rules of use:**

- Icon size: 14 px at depth 0–1, 12 px at depth 2+, always vertically centered.
- Icon color inherits from the row's category class (`cat-formal`, `cat-natural`, …),
  not from depth. Opens the tree to category-based color per the Priority Actions.
- `stroke-width: 1.75` (Lucide default) matches the modest direction. Do not thicken.
- Emoji (`📁` / `📄`) are retired from the tree. Decorative emoji may still appear in
  prose elsewhere on the site if the user adds them, but not in UI chrome.
- `aria-hidden="true"` on every icon — the row label is the accessible name. (The
  screen-reader experience stays clean, which matters especially with ARIA treeview.)

## Patterns (minimum set worth pinning)

- **Page container** — `mx-auto w-full max-w-3xl px-4 md:px-8 py-6 md:py-10`.
- **Panel / card** — `ink.900` background, `radius-lg (12px)`, no shadow, `line.700`
  1 px border (or borderless if nested inside `ink.700`).
- **Toolbar row** — input left (`flex-1`), ghost buttons right; `gap-2`; wraps below
  480 px. Matches the tree's existing toolbar.
- **Empty state** — centered helper text at `text.500`, one short sentence
  (*"No matches for '{query}'."*). Missing today in `FilteredNode`.
- **Focus ring** — `outline: 2px solid brand.blue; outline-offset: 2px` applied via
  `:focus-visible`. Single ring treatment site-wide.
- **Active nav link** — full opacity, `brand.blue` color, `pointer-events-none`.

## Priority Actions

Ordered so each step leaves the site in a shippable state; each is small on its own.
All within the standing rule in AGENTS.md (stable tooling only — no new UI libraries).

1. **Define the dark token set in `tailwind.config.ts` + mirror as `:root` CSS vars in `globals.css`.**
   No behavior change yet. Adds `colors`, `fontFamily`, `borderRadius` to
   `theme.extend`; the `km-*` block in `HumanKnowledgeMap.tsx` now consumes the same
   CSS variables instead of defining its own.

2. **Fold the shell onto the new tokens.**
   Replace `bg-slate-700/800/600` with `bg-ink-700/800/600` (or the `ink.*` class
   names), `text-slate-400` → `text-text-300`. `(main)/layout.tsx` + `page.tsx` is
   ~120 lines combined — one pass. Also: fix the Nav active state (full opacity,
   `brand.blue`). Wire `next/font` (`DM Sans` + `JetBrains Mono`) in `app/layout.tsx`.

3. **Fix the tree's accessibility gaps (non-cosmetic).**
   Priority block from the prior critique that still applies regardless of palette:
   - Keyboard handlers: Enter/Space to toggle; ↑/↓ to move focus; →/← to
     expand/collapse. ARIA treeview pattern.
   - `:focus-visible` ring using `brand.blue`.
   - `role="tree"` on the container, `role="treeitem"` + `aria-level` +
     `aria-setsize` / `aria-posinset` on rows.
   - Allow long labels to wrap (`white-space: normal; word-break: break-word`).
   - Raise row height to ≥ 40 px on touch (adjust `.km-node` padding).
   - Show a **No matches** empty state in `FilteredNode`.
   - Change the subtitle color from `--text4` (red) to `text.300`.

4. **Recolor the tree *within* the dark theme.**
   Keep the dark card; swap its local vars to the unified ink ramp (see table above).
   Retire the One-Dark depth rainbow in favor of the six pastel **category** colors
   (mint / sky / sand / rose / lilac / peach) applied at top level and inherited down.
   Depth is then conveyed by indentation + a single `line.700` left border. This
   converts a decorative pattern into a navigational one — color finally carries
   meaning instead of just texture.

5. **Commit to a semantic icon system and retire the emoji mix.**
   Monochrome line icons that inherit `currentColor` — they tint with the category
   palette and render identically across OSes. Two-tier rule (see next section):
   semantic icon per **top-level domain** and per common **mid-level field**, neutral
   `·` marker on leaves. `@heroicons/react` is already a dependency and covers every
   glyph in the mapping (`Variable`, `Beaker`, `Cog`, `UserGroup`, `BookOpen`,
   `Briefcase` for the six domains; `Calculator`, `CpuChip`, `GlobeAlt`, `Language`,
   `Scale`, `LightBulb`, `RocketLaunch`, `Heart`, `ChartBar`, `Sparkles`, `PaintBrush`,
   `WrenchScrewdriver`, `PuzzlePiece`, `BuildingLibrary` for fields) — no new library
   needed.

6. **Wire `sci5th_Logo_Pink.svg`.**
   It's sitting unused in `public/`. Rotate Black + Pink in the logo strip on
   `/human-knowledge`, Black + Blue on `/` — small brand flourish, zero code cost,
   and it naturally introduces the second pastel accent.

7. **Keep `DESIGN_SYSTEM.md` as the single component index.**
   Tokens + 4 components is small enough that a single file is the right tool; no
   Storybook, no extra dependencies.

## What Works Well (keep)

- The existing dark direction is already on-brief — this is consolidation, not a
  repaint.
- The `(main)` route group for a shared shell is the right call and scales cleanly
  when future sci5th projects are added as sibling top-level routes (AGENTS.md).
- The `km-*` scoped-CSS escape hatch is clearly documented and its prefix keeps it
  from leaking — good pattern to preserve even after the token unification.
- Search UX (live filter, clear `×`, focus border) is already polished.
- `aria-expanded` is already on tree rows — half the ARIA work is done.
- The SVG logo trio (Black / Blue / Pink) is a ready-made pastel-accent pair; no new
  assets needed to hit the new direction.

## Settled Decisions

- **Tree typography — keep monospace.** `JetBrains Mono` stays on tree labels
  (`DM Sans` everywhere else). Indent guides line up visually, and one monospace
  accent inside an otherwise sans UI reinforces the existing "IDE / code editor"
  feel.
- **Theme — dark-only.** No light mode and no theme toggle. The token set is built
  for dark; a second theme is not a goal.

## Open Questions

- When a second sci5th project is added, does the nav become a dropdown or stay a
  flat list? **Deferred** — revisit before the third route is added.
