import Link from "next/link";
import { Suspense } from "react";
import {
  ArrowLeftIcon,
  ArrowTopRightOnSquareIcon,
} from "@heroicons/react/24/outline";
import { assetUrl } from "@/config/asset-manifest";
import {
  imageCreditPartsFor,
  type KnowledgeGalleryEntry,
} from "@/config/knowledge-gallery";
import UnityHero from "./UnityHero";
import InteractivePeriodicTable from "./InteractivePeriodicTable";
import BackButton from "./BackButton";

export default function KnowledgeGalleryEntryView({
  entry,
}: {
  entry: KnowledgeGalleryEntry;
}) {
  // Build the static portion of the back URL: always highlight the
  // originating card via `?focus=<slug>` (mirrors the `?focus=<systemPath>`
  // pattern used by "See in System" on the System side). The optional
  // `&section=<active>` filter-restore segment is appended on the client
  // inside `BackButton` from the current page's `?from=` query carrier —
  // reading searchParams here would force the route to be dynamic, which
  // is incompatible with `output: "export"`.
  const backHref = `/knowledge-gallery?focus=${encodeURIComponent(entry.slug)}`;

  return (
    <article className="w-full">
      <nav className="mb-6 flex items-center justify-between text-sm">
        {/* Suspense boundary required because BackButton calls
            useSearchParams() to read the optional `?from=<section>`
            carrier; without it, Next refuses to prerender the page under
            `output: "export"`. The fallback must NOT itself call
            useSearchParams() (or any client-only hook) — otherwise it
            triggers the same CSR-bailout it's supposed to absorb. A plain
            anchor with the static back URL is good enough during the
            prerender + hydration window; the real button swaps in
            immediately after. */}
        <Suspense
          fallback={
            <a
              href={backHref}
              className="inline-flex items-center gap-1.5 text-sm text-text-300 transition-colors hover:text-text-100 focus-visible:text-text-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue"
            >
              <ArrowLeftIcon className="h-4 w-4" />
              <span>Back to Knowledge Gallery</span>
            </a>
          }
        >
          <BackButton
            fallbackHref="/knowledge-gallery"
            href={backHref}
            appendFromSection
            label="Back to Knowledge Gallery"
          />
        </Suspense>
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

      {entry.interactive === "periodic-table" ? (
        <InteractivePeriodicTable />
      ) : entry.unity ? (
        <UnityHero
          title={entry.title}
          thumbnail={entry.thumbnail}
          category={entry.category}
          unity={entry.unity}
        />
      ) : entry.thumbnail ? (
        <div
          className="relative mb-8 aspect-video w-full overflow-hidden rounded-lg border border-line-700 bg-ink-800 bg-cover bg-center"
          style={{ backgroundImage: `url(${assetUrl(entry.thumbnail)})` }}
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

      {!entry.interactive &&
        (() => {
          // Render the credit with a real link when the entry has
          // attribution. Non-attributed sources render the plain prefix.
          const parts = imageCreditPartsFor(
            entry.imageSource,
            entry.attribution
          );
          return (
            <p className="-mt-6 mb-8 text-right text-[0.65rem] uppercase tracking-wide text-text-500 md:text-xs">
              {parts.prefix}
              {parts.authorLink ? (
                <a
                  href={parts.authorLink.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="decoration-text-700 underline underline-offset-2 transition-colors hover:text-text-300 focus-visible:text-text-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue"
                >
                  {parts.authorLink.label}
                </a>
              ) : null}
              {parts.suffix ?? ""}
            </p>
          );
        })()}

      <ol className="flex flex-col gap-5">
        {entry.steps.map((step) => (
          <li
            key={step.title}
            className="rounded-lg border border-line-700 bg-ink-900 p-5"
          >
            <h2 className="text-lg font-medium text-text-100">{step.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-text-300 md:text-base">
              {step.body}
            </p>
          </li>
        ))}
      </ol>
    </article>
  );
}
