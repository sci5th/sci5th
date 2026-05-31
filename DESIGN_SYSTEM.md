# sci5th — Design System

> Scope: design-system record for `sci5th_website` (Next.js 15 + Tailwind).
> This is the single source of truth — tokens, components, and usage rules.
> Edit alongside any change to `tailwind.config.ts`, `globals.css`, or the
> `(main)` shell / `HumanKnowledgeMap` component.

## Summary

**Theme:** dark-only, modest style, pastel accents — no light mode, no theme
toggle. The shell and the knowledge tree share one dark token ramp (`ink.*` /
`text.*` / `brand.*` / `accent.*` / `feedback.*`) defined in
`tailwind.config.ts` and mirrored as `:root` CSS variables in `globals.css`.
Hex literals and `slate-*` / `gray-*` classes are disallowed in app code.

**Shape of the system:** tokens + one shared shell + one scoped component
block (`km-*`) + `@heroicons/react` for glyphs. No Storybook, no runtime CSS-in-JS,
no component library beyond Heroicons.

## Design Tokens

### Colors

One dark ramp, two brand accents, six category accents, one feedback color.
Defined once in `tailwind.config.ts` under `theme.extend.colors` and mirrored
as `:root` CSS variables in `globals.css` so the scoped `km-*` block consumes
the same values.

| Token | Hex | Role |
|---|---|---|
| `ink.950` | `#0f1218` | Deepest surface (footer) |
| `ink.900` | `#161a22` | Card / panel (`.km-root`) |
| `ink.800` | `#1e2430` | Secondary surface (nav bar, toolbar inputs) |
| `ink.700` | `#2a3140` | Page background, hover bg |
| `ink.600` | `#3a4254` | Logo strip, pressed states |
| `ink.500` | `#55607a` | Dividers, inactive chrome |
| `line.700` | `rgba(255,255,255,.08)` | Borders, focus rings where low-contrast is desired |
| `text.100` | `#e9e8e2` | Primary text |
| `text.300` | `#a5a79f` | Secondary text (subtitle, inactive nav) |
| `text.500` | `#6d6e68` | Tertiary / placeholder / leaf marker |
| `brand.blue` | `#a7c5e8` | Primary pastel — focus rings, active nav, `/` logo accent |
| `brand.pink` | `#e7b9c7` | Secondary pastel — `/human-knowledge` logo accent |
| `accent.leaf` / `accent.leaf-dim` | `#c9dca5` / `#a4c467` | Category — Formal Sciences (`cat-formal`), hue ~75°. Label uses `leaf`; icon uses `leaf-dim`. |
| `accent.sky` / `accent.sky-dim` | `#a7c5e8` / `#6298d6` | Category — Natural Sciences (`cat-natural`), `sky` = `brand.blue`, hue ~212°. Icon uses `sky-dim`. |
| `accent.sand` / `accent.sand-dim` | `#e3cf9b` / `#d0ae57` | Category — Applied Sciences & Technology (`cat-applied`), hue ~44°. Icon uses `sand-dim`. |
| `accent.rose` / `accent.rose-dim` | `#e7b9c7` / `#d17893` | Category — Social Sciences (`cat-social`), `rose` = `brand.pink`, hue ~342°. Icon uses `rose-dim`. |
| `accent.sage` / `accent.sage-dim` | `#a3d4bd` / `#68b893` | Category — Humanities (`cat-humanities`), hue ~152°. Icon uses `sage-dim`. |
| `accent.lilac` / `accent.lilac-dim` | `#c4b0e3` / `#9470cc` | Category — Professions & Interdisciplinary (`cat-professions`), hue ~262°. Icon uses `lilac-dim`. |
| `feedback.error` | `#d98b8b` | Only real errors — never instructional copy |

All pastel accents pass WCAG AA (contrast ≥ 4.8 : 1) against `ink.900`.

### Typography

Loaded via `next/font/google` in `src/app/layout.tsx` and exposed as Tailwind
font families.

| Token | Family | Use |
|---|---|---|
| `font-sans` | `DM Sans` (CSS var `--font-sans`) | Shell, body, wordmark, tree title + subtitle |
| `font-mono` | `JetBrains Mono` (CSS var `--font-mono`) | Knowledge tree labels and buttons only |

Type scale (rem): `xs 0.75` · `sm 0.875` · `base 1` · `lg 1.125` · `xl 1.375` ·
`2xl 1.75` · `3xl 2.25`. Line-height: shell `1.5–1.6`, tree `1.75`.

### Spacing, radius, shadow, motion

- **Spacing** — Tailwind defaults. Page padding `px-4 md:px-8`, vertical
  rhythm `py-6 md:py-10`.
- **Radius** — `sm 6px` (inputs, chips, buttons), `md 10px`, `lg 12px`
  (card / `.km-root`). Chrome (nav, logo strip, footer) stays square.
- **Shadow** — dark mode relies on background contrast, not drop shadows.
  Panels use a 1 px `line-700` border (see the home video frame). One
  elevation token exists for future use: `boxShadow.elevated` =
  `0 1px 0 rgba(255,255,255,.04) inset, 0 8px 24px rgba(0,0,0,.35)`.
- **Motion** — transitions `120–200 ms`. Non-essential motion is wrapped in
  `@media (prefers-reduced-motion: reduce)` inside the `km-*` block.

## Components

| Component | File | States | Notes |
|---|---|---|---|
| `RootLayout` | `src/app/layout.tsx` | — | Loads fonts, sets `color-scheme: dark`, applies `bg-ink-700 font-sans text-text-100`. |
| `MainLayout` shell | `src/app/(main)/layout.tsx` | — | Wraps `Navigation` + `Logo` + `Footer`. Route-dependent accent logo (`/` → Blue, `/human-knowledge` → Pink). |
| Navigation | `(main)/layout.tsx` | default, hover, focus-visible, active | Active link: full opacity, `text-brand-blue`, `pointer-events-none`. Focus ring: `brand.blue`, 2 px offset. |
| Logo strip | `(main)/layout.tsx` | default, hover, focus-visible | `bg-ink-600` with Black wordmark + Black/Blue/Pink SVG pair. |
| Footer | `(main)/layout.tsx` | default | `bg-ink-900`, `text-text-500`. |
| Home tagline + hero | `(main)/page.tsx` + `FiveDimensionsHero.tsx` | default, reduced-motion | Frameless 16:9 container (`bg-ink-700`, no border, no radius) so the hero blends seamlessly into the page background. Hosts the animated five-dimensions hero (autoplay + loop, no controls); honors `prefers-reduced-motion` by holding a static near-end composition. |
| `HumanKnowledgeMap` | `src/components/HumanKnowledgeMap.tsx` | see below | Scoped `km-*` CSS, category colors, full ARIA treeview. |
| `KnowledgeGallery` | `src/components/KnowledgeGallery.tsx` | default, hover, focus-visible | Card grid on `/knowledge-gallery`. Cards are `bg-ink-900` on `border-line-700`; hover/focus switches border to `brand.pink`. Thumbnails use an `aspect-video` placeholder with the entry's category class when no image is set. |
| `KnowledgeGalleryEntry` | `src/components/KnowledgeGalleryEntry.tsx` | default | Step-by-step view on `/knowledge-gallery/[slug]`. Top nav: "Back to Knowledge Gallery" (left) and "See in System" → `/human-knowledge` (right). Steps render as `bg-ink-900` cards on `border-line-700`. Hero is the static thumbnail, a click-to-play Unity build (`entry.unity`), or a first-party interactive widget (`entry.interactive`); the image-credit caption is suppressed for the interactive case. |
| `InteractivePeriodicTable` | `src/components/InteractivePeriodicTable.tsx` | default, hover, focus-visible | Interactive Periodic Law hero. 118-element CSS grid on `bg-ink-900`/`border-line-700`; each cell is bordered by its category accent. Hover/focus an element to fill its tint and show a readout (Z, symbol, name, category, period/group) while its whole category stays lit and others dim. Legend doubles as a category filter. |

### Knowledge tree states

| Sub-element | States | Class / selector |
|---|---|---|
| Search input | default, focus-visible, placeholder, has-value (×) | `.km-search`, `.km-search-clear` |
| Help dropdown | closed, open, hover, focus-visible (chevron rotates 180°) | `.km-help`, `.km-help-summary`, `.km-help-chevron`, `.km-help-content` |
| Toolbar button | default, hover, active, focus-visible, disabled | `.km-btn` |
| Tree row | default, hover, focus-visible, open/closed, leaf/has-children | `.km-node[data-has-children]` |
| Row label | wraps long text (`word-break: break-word`, `overflow-wrap: anywhere`) | `.km-label` |
| Empty state | shown when filtered result set is empty | `.km-empty` (*"No matches for '{query}'."*) |
| Focus ring | 2 px `brand-blue`, `outline-offset: -2px` on rows, `+2px` elsewhere | `:focus-visible` |
| Category color | applied at depth 0, inherited by descendants | `.cat-formal` · `.cat-natural` · `.cat-applied` · `.cat-social` · `.cat-humanities` · `.cat-professions` |
| Gallery badge | default, hover, focus-visible; shown only on rows whose path matches a `KnowledgeGalleryEntry.systemPath` | `.km-gallery-badge` (Pink outline pill, `font-mono`, right-aligned; `stopPropagation` on click so it doesn't toggle the row) |
| Deep-link target | pulse (2s Pink ring + fading pink tint) when the row is the target of `?focus=<systemPath>`; static Pink ring under `prefers-reduced-motion` | `.km-node[data-highlight="true"]` (`@keyframes km-pulse`) |

## Iconography

Two-tier semantic system. All glyphs are monochrome line icons from
`@heroicons/react/24/outline`, inherit `currentColor`, and carry
`aria-hidden="true"` (the row label is the accessible name).

**Tier 1 — Top-level domains (depth 0).** `DOMAIN_ICONS` in
`HumanKnowledgeMap.tsx`:

| Domain | Icon | Category token |
|---|---|---|
| Formal Sciences | `VariableIcon` | `accent.leaf` (label) · `accent.leaf-dim` (icon) |
| Natural Sciences | `BeakerIcon` | `accent.sky` (= `brand.blue`) · `accent.sky-dim` (icon) |
| Applied Sciences & Technology | `CogIcon` | `accent.sand` · `accent.sand-dim` (icon) |
| Social Sciences | `UserGroupIcon` | `accent.rose` (= `brand.pink`) · `accent.rose-dim` (icon) |
| Humanities | `BookOpenIcon` | `accent.sage` · `accent.sage-dim` (icon) |
| Professions & Interdisciplinary | `BriefcaseIcon` | `accent.lilac` · `accent.lilac-dim` (icon) |

**Tier 2 — Mid-level fields.** `FIELD_ICONS` in `HumanKnowledgeMap.tsx`.
Extend this map when adding a new field where a semantic Heroicons glyph
exists; when none fits, omit — the label carries its meaning.

**Tier 3 — Leaves.** Neutral `·` marker at `text.500`. No per-leaf icon.

**Rules**

- Icon size: 14 px, vertically centered (see `.km-icon`, `.km-glyph`).
- Color: inherits from the row's category class — never from depth.
- `stroke-width: 1.75` (Heroicons default). Do not thicken.
- No emoji in UI chrome.

## Patterns

- **Page container** — `mx-auto w-full max-w-3xl px-4 md:px-8 py-6 md:py-10`.
- **Panel / card** — `bg-ink-900`, `rounded-lg`, no shadow, `border
  border-line-700` when on a matching `ink-700/800` surface.
- **Toolbar row** — input left (`flex-1`), ghost buttons right, `gap-2`,
  wraps below 480 px.
- **Empty state** — centered `.km-empty` helper text at `text.500`, one short
  sentence.
- **Focus ring** — `outline: 2px solid var(--brand-blue); outline-offset: 2px`
  via `:focus-visible`. Applied site-wide.
- **Active nav link** — full opacity, `text-brand-blue`, `pointer-events-none`.
- **Logo accent rotation** — Blue on `/`, Pink on the knowledge surfaces
  (`/human-knowledge` and `/knowledge-gallery`). Pick by route in `MainLayout`.

## Accessibility

- Dark-only UI passes WCAG AA for all token pairings used in-product.
- Knowledge tree implements the WAI-ARIA tree pattern:
  `role="tree"` on the container, `role="treeitem"` + `aria-level` +
  `aria-posinset` + `aria-setsize` + `aria-expanded` on rows, roving
  `tabIndex` tied to `focusIndex`.
- Keyboard: ↑/↓ move focus, →/← expand/collapse (or move to parent),
  Enter/Space toggle, Home/End jump to first/last visible row.
- Touch targets: `.km-node` raised to `min-height: 40px` below 768 px.
- Long labels wrap; no horizontal scroll.
- `prefers-reduced-motion` disables transitions inside `km-*`.

## Conventions (binding)

- All colors flow through the token set. No hex literals, no `slate-*` or
  `gray-*` classes in app code.
- Tailwind utility classes only, except for the documented `km-*` scoped
  block in `globals.css`.
- `km-*` consumes `:root` CSS variables — do not reintroduce local hex
  values inside it.
- No inline `style` objects except for dynamic positioning (e.g., the tree's
  per-row `paddingLeft`).
- Category colors apply at depth 0 via `cat-*` classes and inherit down; depth
  is conveyed by indentation alone.

## Settled Decisions

- **Theme** — dark-only. No light mode, no toggle. The token set is built for
  dark; a second theme is not a goal.
- **Tree typography** — `JetBrains Mono` stays on tree labels (`DM Sans`
  everywhere else). The monospace accent reinforces the "IDE / code editor"
  feel and keeps indent guides visually aligned.
- **Single design-system file** — tokens + a handful of components is small
  enough that one document is the right tool. No Storybook.

## Open Questions

- When a second sci5th project is added, does the nav become a dropdown or
  stay a flat list? **Deferred** — revisit before the third route is added.
