import Link from "next/link";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";
import type { KnowledgeGalleryEntry } from "@/config/knowledge-gallery";
import UnityHero from "./UnityHero";
import BackButton from "./BackButton";

export default function KnowledgeGalleryEntryView({
  entry,
  fromSection,
}: {
  entry: KnowledgeGalleryEntry;
  // When set, the Back button will return to the gallery with that section
  // filter restored (e.g. ?section=theories). Independent of the highlight,
  // which is driven by ?focus=<slug>.
  fromSection?: string;
}) {
  // Build the back URL so it both restores the filter (if any) AND signals
  // the gallery list to highlight the originating card. Mirrors the
  // `?focus=<systemPath>` pattern used by "See in System" on the System side.
  const backParams = new URLSearchParams();
  backParams.set("focus", entry.slug);
  if (fromSection) backParams.set("section", fromSection);
  const backHref = `/knowledge-gallery?${backParams.toString()}`;

  return (
    <article className="w-full">
      <nav className="mb-6 flex items-center justify-between text-sm">
        <BackButton
          fallbackHref="/knowledge-gallery"
          href={backHref}
          label="Back to Knowledge Gallery"
        />
        <Link
          href={{
            pathname: "/human-knowledge",
            query: { focus: entry.systemPath },
          }}
          className="inline-flex items-center gap-1.5 text-text-300 transition-colors hover:text-text-100 focus-visible:text-text-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue"
        >
          <span>See in System</span>
          <ArrowTopRightOnSquareIcon className="h-4 w-4" />
        </Link>
      </nav>

      <header className="mb-8">
        <p className="font-mono text-xs uppercase tracking-wide text-text-500">
          {entry.breadcrumb}
        </p>
        <h1 className="mt-1 text-3xl font-medium tracking-tight text-text-100 md:text-4xl">
          {entry.title}
        </h1>
        <p className="mt-3 text-base text-text-300 md:text-lg">
          {entry.summary}
        </p>
      </header>

      {entry.unity ? (
        <UnityHero
          title={entry.title}
          thumbnail={entry.thumbnail}
          category={entry.category}
          unity={entry.unity}
        />
      ) : entry.thumbnail ? (
        <div
          className="relative mb-8 aspect-video w-full overflow-hidden rounded-lg border border-line-700 bg-ink-800 bg-cover bg-center"
          style={{ backgroundImage: `url(${entry.thumbnail})` }}
          role="img"
          aria-label={`${entry.title} hero`}
        />
      ) : (
        <div
          className={`kg-thumb cat-${entry.category} mb-8 flex aspect-video w-full items-center justify-center rounded-lg border border-line-700 bg-ink-800`}
          aria-hidden="true"
        >
          <span className="font-mono text-3xl text-text-300">
            {entry.title}
          </span>
        </div>
      )}

      <ol className="flex flex-col gap-5">
        {entry.steps.map((step) => (
          <li
            key={step.title}
            className="rounded-lg border border-line-700 bg-ink-900 p-5"
          >
            <h2 className="text-lg font-medium text-text-100">
              {step.title}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-text-300 md:text-base">
              {step.body}
            </p>
          </li>
        ))}
      </ol>
    </article>
  );
}
