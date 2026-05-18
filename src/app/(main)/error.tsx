"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex grow flex-col items-center justify-center bg-ink-700 px-6 py-16">
      <div className="w-full max-w-xl rounded-lg border border-line-700 bg-ink-900 p-8 text-center md:p-12">
        <p className="font-mono text-xs uppercase tracking-wide text-text-300">
          Error
        </p>
        <h1 className="mt-3 text-2xl font-medium tracking-tight text-text-100 md:text-3xl">
          Something went wrong
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-text-300 md:text-base">
          An unexpected error occurred while rendering this page. You can try
          again, or head back to the home page.
        </p>
        {error?.digest ? (
          <p className="mt-4 font-mono text-[0.65rem] uppercase tracking-wide text-text-500">
            Reference: {error.digest}
          </p>
        ) : null}
        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => reset()}
            className="rounded-md border border-line-700 bg-ink-800 px-4 py-2 font-mono text-xs uppercase tracking-wide text-text-100 transition-colors hover:border-brand-blue hover:text-brand-blue focus-visible:border-brand-blue focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue"
          >
            Try again
          </button>
          <Link
            href="/"
            className="rounded-md border border-line-700 bg-ink-800 px-4 py-2 font-mono text-xs uppercase tracking-wide text-text-100 transition-colors hover:border-brand-blue hover:text-brand-blue focus-visible:border-brand-blue focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}
