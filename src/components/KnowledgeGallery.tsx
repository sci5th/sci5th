import Link from "next/link";
import {
  KNOWLEDGE_GALLERY_ENTRIES,
  type KnowledgeGalleryEntry,
  type KnowledgeGalleryKind,
} from "@/config/knowledge-gallery";

// ── Sub-navbar sections ──────────────────────────────────────────────────────
//
// The Gallery is split into three groups. The tree-driven classification lives
// on each entry's `kind` field; this file only decides how to present the tabs.
//
//  • other      — default landing tab. Everything that isn't a theory or an
//                 algorithm (methods, frameworks, tools, people…).
//  • theories   — scientific theories and foundational frameworks.
//  • algorithms — named algorithms / procedures.

type GallerySection = "other" | "theories" | "algorithms";

const SECTIONS: ReadonlyArray<{
  id: GallerySection;
  label: string;
  kind: KnowledgeGalleryKind;
  empty: string;
}> = [
  {
    id: "other",
    label: "Other",
    kind: "other",
    empty: "No entries here yet.",
  },
  {
    id: "theories",
    label: "Theories",
    kind: "theory",
    empty: "No theories yet.",
  },
  {
    id: "algorithms",
    label: "Algorithms",
    kind: "algorithm",
    empty: "No algorithms yet.",
  },
];

function resolveSection(raw: string | undefined): GallerySection {
  return SECTIONS.find((s) => s.id === raw)?.id ?? "other";
}

// ── Card thumbnail ───────────────────────────────────────────────────────────

function Thumbnail({ entry }: { entry: KnowledgeGalleryEntry }) {
  if (entry.thumbnail) {
    // Use a plain <img> rather than next/image because the project uses
    // `unoptimized` on local assets (see AGENTS.md). A background div keeps
    // the layout simple and avoids pulling in next/image's config surface.
    return (
      <div
        className="aspect-video w-full rounded-md bg-ink-800 bg-cover bg-center"
        style={{ backgroundImage: `url(${entry.thumbnail})` }}
        role="img"
        aria-label={`${entry.title} thumbnail`}
      />
    );
  }
  // Placeholder — a quiet category-tinted tile with the entry initials.
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
            section.id === "other"
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

export default function KnowledgeGallery({
  section: rawSection,
}: {
  section?: string;
}) {
  const active = resolveSection(rawSection);
  const activeMeta = SECTIONS.find((s) => s.id === active)!;

  const counts: Record<GallerySection, number> = {
    other: 0,
    theories: 0,
    algorithms: 0,
  };
  for (const entry of KNOWLEDGE_GALLERY_ENTRIES) {
    const match = SECTIONS.find((s) => s.kind === entry.kind);
    if (match) counts[match.id] += 1;
  }

  const visible = KNOWLEDGE_GALLERY_ENTRIES.filter(
    (e) => e.kind === activeMeta.kind,
  );

  return (
    <section className="w-full">
      <header className="mb-6 text-center md:mb-8">
        <h2 className="text-2xl font-medium tracking-tight text-text-100 md:text-3xl">
          Knowledge Gallery
        </h2>
        <p className="mt-2 text-sm text-text-300 md:text-base">
          Step-by-step explorations of topics from the{" "}
          <Link
            href="/human-knowledge"
            className="text-brand-blue underline-offset-4 hover:underline focus-visible:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue"
          >
            System of Human Knowledge
          </Link>
          .
        </p>
      </header>

      <SectionTabs active={active} counts={counts} />

      {visible.length === 0 ? (
        <p className="text-center text-sm text-text-500">{activeMeta.empty}</p>
      ) : (
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
          {visible.map((entry) => (
            <li key={entry.slug} className="h-full">
              <Link
                href={`/knowledge-gallery/${entry.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-lg border border-line-700 bg-ink-900 p-4 transition-colors hover:border-brand-pink focus-visible:border-brand-pink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue"
              >
                <Thumbnail entry={entry} />
                <div className="mt-3 flex flex-col">
                  <p className="line-clamp-1 font-mono text-xs uppercase tracking-wide text-text-500">
                    {entry.breadcrumb}
                  </p>
                  <h3 className="mt-1 line-clamp-1 text-lg font-medium text-text-100 group-hover:text-brand-pink">
                    {entry.title}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-sm text-text-300">
                    {entry.summary}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
