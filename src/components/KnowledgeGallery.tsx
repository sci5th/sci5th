"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { assetUrl } from "@/config/asset-manifest";
import {
  KNOWLEDGE_GALLERY_ENTRIES,
  imageCreditFor,
  type KnowledgeGalleryEntry,
  type KnowledgeGalleryKind,
} from "@/config/knowledge-gallery";

// ── Sub-navbar sections ──────────────────────────────────────────────────────
//
// The Gallery is split into filterable groups. The tree-driven classification
// lives on each entry's `kind` field; this file only decides how to present
// the tabs.
//
//  • all        — default landing tab. Shows every entry regardless of kind.
//  • theories   — scientific theories and foundational frameworks.
//  • laws       — named scientific laws (what happens, vs. theories' why).
//  • algorithms — named algorithms / procedures.
//  • models     — named models of something (scientific, statistical, ML…).
//  • systems    — named systems (natural, engineered, or conceptual).
//
// `kind` on a SECTIONS row is the filter applied to entries when that section
// is active. `null` means "no filter" — show everything.

type GallerySection =
  | "all"
  | "theories"
  | "laws"
  | "algorithms"
  | "models"
  | "systems"
  | "modularity"
  | "others";

const SECTIONS: ReadonlyArray<{
  id: GallerySection;
  label: string;
  kind: KnowledgeGalleryKind | null;
  empty: string;
}> = [
  {
    id: "all",
    label: "All",
    kind: null,
    empty: "No entries here yet.",
  },
  {
    id: "laws",
    label: "1. Laws",
    kind: "law",
    empty: "No laws yet.",
  },
  {
    id: "theories",
    label: "2. Theories",
    kind: "theory",
    empty: "No theories yet.",
  },
  {
    id: "models",
    label: "3. Models",
    kind: "model",
    empty: "No models yet.",
  },
  {
    id: "systems",
    label: "4. Systems",
    kind: "system",
    empty: "No systems yet.",
  },
  {
    id: "algorithms",
    label: "5. Algorithms",
    kind: "algorithm",
    empty: "No algorithms yet.",
  },
  {
    id: "modularity",
    label: "6. Modularity",
    kind: "modularity",
    empty: "No modularity entries yet.",
  },
  {
    id: "others",
    label: "7. Others",
    kind: "other",
    empty: "No other entries yet.",
  },
];

function resolveSection(raw: string | undefined): GallerySection {
  return SECTIONS.find((s) => s.id === raw)?.id ?? "all";
}

// ── Card thumbnail ───────────────────────────────────────────────────────────

function Thumbnail({ entry }: { entry: KnowledgeGalleryEntry }) {
  if (entry.thumbnail) {
    // Use a plain <img> rather than next/image because the project uses
    // `unoptimized` on local assets (see AGENTS.md). A background div keeps
    // the layout simple and avoids pulling in next/image's config surface.
    // The credit caption is overlaid on the bottom-right corner of the
    // thumbnail with a soft right-side gradient — Instagram/Vimeo style —
    // so it sits next to the image without claiming a separate row.
    const credit = imageCreditFor(entry.imageSource, entry.attribution);
    return (
      <div
        className="relative aspect-video w-full overflow-hidden rounded-md bg-ink-800 bg-cover bg-center"
        style={{ backgroundImage: `url(${assetUrl(entry.thumbnail)})` }}
        role="img"
        aria-label={`${entry.title} thumbnail`}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 flex w-2/3 items-end justify-end bg-gradient-to-l from-black/60 via-black/30 to-transparent px-2 pb-1"
        >
          <span className="font-mono text-[0.625rem] uppercase tracking-wide text-white/90">
            {credit}
          </span>
        </div>
      </div>
    );
  }
  // Placeholder — a quiet category-tinted tile with the entry initials.
  // No credit overlay here: we didn't ship an image to credit.
  const initials = entry.title
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("");
  return (
    <div
      className={`kg-thumb cat-${entry.category} flex aspect-video w-full items-center justify-center rounded-md border border-line-700 bg-ink-800`}
      aria-hidden="true"
    >
      <span className="font-mono text-2xl text-text-300">{initials}</span>
    </div>
  );
}

// ── Sub-navbar ──────────────────────────────────────────────────────────────

function SectionTabs({
  active,
  counts,
}: {
  active: GallerySection;
  counts: Record<GallerySection, number>;
}) {
  return (
    <nav
      aria-label="Knowledge Gallery sections"
      className="mb-6 flex justify-center md:mb-8"
    >
      <ul className="flex flex-wrap items-center justify-center gap-1 rounded-lg border border-line-700 bg-ink-900 p-1">
        {SECTIONS.map((section) => {
          const isActive = section.id === active;
          // Keep the URL clean for the default landing tab.
          const href =
            section.id === "all"
              ? "/knowledge-gallery"
              : `/knowledge-gallery?section=${section.id}`;
          return (
            <li key={section.id}>
              <Link
                href={href}
                scroll={false}
                aria-current={isActive ? "page" : undefined}
                className={[
                  "inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue",
                  isActive
                    ? "bg-ink-800 text-brand-pink"
                    : "text-text-300 hover:text-text-100",
                ].join(" ")}
              >
                {section.label}
                <span
                  className={[
                    "rounded-full px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wide",
                    // Count badges read inline with the tab label for screen
                    // readers ("All 33") and need to clear WCAG AA on their
                    // own background even when the tab is inactive — bumped
                    // from text-text-500 (~3.4:1) to text-text-300 (~7.8:1).
                    isActive
                      ? "bg-ink-900 text-text-300"
                      : "bg-ink-800 text-text-300",
                  ].join(" ")}
                >
                  {counts[section.id]}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

// ── Page component ───────────────────────────────────────────────────────────

export default function KnowledgeGallery() {
  // `?section=` is read on the client so the page can be statically
  // exported (`output: "export"` in `next.config.ts`). On the very first
  // client render before hydration `searchParams` is empty, which is
  // exactly what we want — the static HTML reflects the "all" view, and
  // the filter narrows it down once the URL is consulted.
  const searchParams = useSearchParams();
  const rawSection = searchParams?.get("section") ?? undefined;
  const active = resolveSection(rawSection);
  const activeMeta = SECTIONS.find((s) => s.id === active)!;

  // "All" counts every entry; kind-scoped tabs count only their matches.
  const counts: Record<GallerySection, number> = {
    all: KNOWLEDGE_GALLERY_ENTRIES.length,
    theories: 0,
    laws: 0,
    algorithms: 0,
    models: 0,
    systems: 0,
    modularity: 0,
    others: 0,
  };
  for (const entry of KNOWLEDGE_GALLERY_ENTRIES) {
    const match = SECTIONS.find(
      (s) => s.kind !== null && s.kind === entry.kind
    );
    if (match) counts[match.id] += 1;
  }

  // Display ordering, applied at render time so the data file keeps its
  // authored tree-order. Every view is sorted A–Z by title: "All" across
  // all entries, and each tab (including "Others") within its own kind.
  const byTitle = (a: KnowledgeGalleryEntry, b: KnowledgeGalleryEntry) =>
    a.title.localeCompare(b.title);

  const visible: KnowledgeGalleryEntry[] = (
    activeMeta.kind !== null
      ? KNOWLEDGE_GALLERY_ENTRIES.filter((e) => e.kind === activeMeta.kind)
      : [...KNOWLEDGE_GALLERY_ENTRIES]
  ).sort(byTitle);

  return (
    <section className="w-full">
      <header className="mb-6 text-center md:mb-8">
        <h2 className="text-2xl font-medium tracking-tight text-text-100 md:text-3xl">
          Knowledge Gallery
        </h2>
        <aside
          role="note"
          aria-label="AI content notice"
          className="mt-3 px-4 text-center text-xs leading-snug text-text-300 md:text-sm"
        >
          AI-drafted, not expert-reviewed &mdash; a starting point, not a
          citation.{" "}
          <Link
            href="/about"
            className="decoration-text-700 underline underline-offset-2 transition-colors hover:text-text-100 focus-visible:text-text-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue"
          >
            About
          </Link>
          .
        </aside>
      </header>

      <SectionTabs active={active} counts={counts} />

      {visible.length === 0 ? (
        <p className="text-center text-sm text-text-500">{activeMeta.empty}</p>
      ) : active === "theories" ? (
        <TheoriesView entries={visible} active={active} />
      ) : (
        <EntryGrid entries={visible} active={active} />
      )}
    </section>
  );
}

// ── Entry grid (shared between the flat tabs and the split Theories view) ───

function EntryGrid({
  entries,
  active,
}: {
  entries: ReadonlyArray<KnowledgeGalleryEntry>;
  active: GallerySection;
}) {
  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
      {entries.map((entry) => (
        <li
          key={entry.slug}
          className="kg-card h-full"
          data-card-slug={entry.slug}
        >
          <Link
            href={
              active === "all"
                ? `/knowledge-gallery/${entry.slug}`
                : `/knowledge-gallery/${entry.slug}?from=${active}`
            }
            className="group flex h-full flex-col overflow-hidden rounded-lg border border-line-700 bg-ink-900 p-4 transition-colors hover:border-brand-pink focus-visible:border-brand-pink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue"
          >
            <Thumbnail entry={entry} />
            {/* Credit moved onto the thumbnail itself (see Thumbnail). */}
            <div className="mt-3 flex flex-1 flex-col">
              <p className="line-clamp-1 font-mono text-xs uppercase tracking-wide text-text-500">
                {entry.breadcrumb}
              </p>
              <h3 className="mt-1 line-clamp-1 text-lg font-medium text-text-100 group-hover:text-brand-pink">
                {entry.title}
              </h3>
              <p className="mt-1 line-clamp-2 text-sm text-text-300">
                {entry.summary}
              </p>
              <div className="mt-3 flex justify-end">
                <span
                  aria-hidden="true"
                  className="font-mono text-xs uppercase tracking-wide text-text-500 transition-colors group-hover:text-brand-pink"
                >
                  Open →
                </span>
              </div>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}

// ── Theories sub-grouping ───────────────────────────────────────────────────
//
// Within the Theories tab, two kinds of entries get bundled together under the
// same `kind: "theory"`:
//
//  • Foundational frameworks — formal/conceptual scaffolds (set theory, game
//    theory, chaos theory). These all have `category: "formal"`.
//  • Scientific theories — empirical theories about the natural or social
//    world (evolution, GR, atomic theory, cognitive theory). These have
//    `category: "natural"` or `"social"`.
//
// The distinction is meaningful enough to surface in the UI, but it tracks
// `category` perfectly today — so we don't add another `kind`. We just split
// the visible entries into two sub-grids with labelled headers.

function TheoriesView({
  entries,
  active,
}: {
  entries: ReadonlyArray<KnowledgeGalleryEntry>;
  active: GallerySection;
}) {
  const foundational = entries.filter((e) => e.category === "formal");
  const empirical = entries.filter((e) => e.category !== "formal");

  return (
    <div className="space-y-8 md:space-y-10">
      {foundational.length > 0 && (
        <section aria-labelledby="theories-foundational-heading">
          <header className="mb-4">
            <h3
              id="theories-foundational-heading"
              className="text-xl font-medium tracking-tight text-text-100"
            >
              Foundational Frameworks
            </h3>
            <p className="mt-1 text-sm text-text-300">
              Formal and conceptual scaffolds — built by construction, not by
              experiment.
            </p>
          </header>
          <EntryGrid entries={foundational} active={active} />
        </section>
      )}
      {empirical.length > 0 && (
        <section aria-labelledby="theories-empirical-heading">
          <header className="mb-4">
            <h3
              id="theories-empirical-heading"
              className="text-xl font-medium tracking-tight text-text-100"
            >
              Scientific Theories
            </h3>
            <p className="mt-1 text-sm text-text-300">
              Empirical theories about the natural or social world — accountable
              to observation.
            </p>
          </header>
          <EntryGrid entries={empirical} active={active} />
        </section>
      )}
    </div>
  );
}
