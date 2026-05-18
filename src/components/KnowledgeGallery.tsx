"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  KNOWLEDGE_GALLERY_ENTRIES,
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
//  • algorithms — named algorithms / procedures.
//  • models     — named models of something (scientific, statistical, ML…).
//  • systems    — named systems (natural, engineered, or conceptual).
//
// `kind` on a SECTIONS row is the filter applied to entries when that section
// is active. `null` means "no filter" — show everything.

type GallerySection =
  | "all"
  | "theories"
  | "algorithms"
  | "models"
  | "systems"
  | "modularity";

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
    id: "algorithms",
    label: "Algorithms",
    kind: "algorithm",
    empty: "No algorithms yet.",
  },
  {
    id: "modularity",
    label: "Modularity",
    kind: "modularity",
    empty: "No modularity entries yet.",
  },
  {
    id: "models",
    label: "Models",
    kind: "model",
    empty: "No models yet.",
  },
  {
    id: "systems",
    label: "Systems",
    kind: "system",
    empty: "No systems yet.",
  },
  {
    id: "theories",
    label: "Theories",
    kind: "theory",
    empty: "No theories yet.",
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
    const credit = entry.unity
      ? "Hero: Unity WebGL build"
      : "Image: Images 2.0 by OpenAI";
    return (
      <div
        className="relative aspect-video w-full overflow-hidden rounded-md bg-ink-800 bg-cover bg-center"
        style={{ backgroundImage: `url(${entry.thumbnail})` }}
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
                    isActive
                      ? "bg-ink-900 text-text-300"
                      : "bg-ink-800 text-text-500",
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
    algorithms: 0,
    models: 0,
    systems: 0,
    modularity: 0,
  };
  for (const entry of KNOWLEDGE_GALLERY_ENTRIES) {
    const match = SECTIONS.find(
      (s) => s.kind !== null && s.kind === entry.kind,
    );
    if (match) counts[match.id] += 1;
  }

  const visible =
    activeMeta.kind === null
      ? KNOWLEDGE_GALLERY_ENTRIES
      : KNOWLEDGE_GALLERY_ENTRIES.filter((e) => e.kind === activeMeta.kind);

  return (
    <section className="w-full">
      <header className="mb-6 text-center md:mb-8">
        <h2 className="text-2xl font-medium tracking-tight text-text-100 md:text-3xl">
          Knowledge Gallery
        </h2>
      </header>

      <aside
        role="note"
        aria-label="AI content notice"
        className="mb-6 rounded-md border border-line-700 bg-ink-800/60 px-4 py-3 text-center text-xs leading-snug text-text-300 md:text-sm"
      >
        Knowledge Gallery entries are AI-drafted explainers. They aim to follow
        the consensus view in each field but have not been reviewed by
        subject-matter experts &mdash; treat them as a starting point, not a
        citation.{" "}
        <Link
          href="/about"
          className="underline decoration-text-700 underline-offset-2 transition-colors hover:text-text-100 focus-visible:text-text-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue"
        >
          About this site
        </Link>
        .
      </aside>

      <SectionTabs active={active} counts={counts} />

      {visible.length === 0 ? (
        <p className="text-center text-sm text-text-500">{activeMeta.empty}</p>
      ) : (
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
          {visible.map((entry) => (
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
      )}
    </section>
  );
}
