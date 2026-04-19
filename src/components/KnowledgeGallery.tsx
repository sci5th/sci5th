import Link from "next/link";
import {
  KNOWLEDGE_GALLERY_ENTRIES,
  type KnowledgeGalleryEntry,
} from "@/config/knowledge-gallery";

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

export default function KnowledgeGallery() {
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

      {KNOWLEDGE_GALLERY_ENTRIES.length === 0 ? (
        <p className="text-center text-sm text-text-500">
          No entries yet.
        </p>
      ) : (
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
          {KNOWLEDGE_GALLERY_ENTRIES.map((entry) => (
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
