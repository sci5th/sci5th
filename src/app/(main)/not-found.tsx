import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex grow flex-col items-center justify-center bg-ink-700 px-6 py-16">
      <div className="w-full max-w-xl rounded-lg border border-line-700 bg-ink-900 p-8 text-center md:p-12">
        <p className="font-mono text-xs uppercase tracking-wide text-text-300">
          404
        </p>
        <h1 className="mt-3 text-2xl font-medium tracking-tight text-text-100 md:text-3xl">
          Page not found
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-text-300 md:text-base">
          The page you are looking for does not exist or may have moved.
        </p>
        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="rounded-md border border-line-700 bg-ink-800 px-4 py-2 font-mono text-xs uppercase tracking-wide text-text-100 transition-colors hover:border-brand-blue hover:text-brand-blue focus-visible:border-brand-blue focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue"
          >
            Go home
          </Link>
          <Link
            href="/knowledge-gallery"
            className="rounded-md border border-line-700 bg-ink-800 px-4 py-2 font-mono text-xs uppercase tracking-wide text-text-100 transition-colors hover:border-brand-blue hover:text-brand-blue focus-visible:border-brand-blue focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue"
          >
            Knowledge Gallery
          </Link>
        </div>
      </div>
    </div>
  );
}
