"use client";

import { useRouter } from "next/navigation";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

// A small client-side "Back" button that steps the browser history back
// one entry. Isolated into its own file so parent pages can remain server
// components. Used by Knowledge Gallery entry pages; safe to reuse on any
// page where a one-step history pop is the desired behavior.
export default function BackButton({
  fallbackHref = "/",
  label = "Back",
}: {
  // Where to send the user if there's no prior history (e.g. they landed
  // on this page via a direct link or a new tab). Sessions with no
  // `referrer` skip `router.back()` and push to `fallbackHref` instead.
  fallbackHref?: string;
  label?: string;
}) {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => {
        // When the user landed here directly (new tab, shared link),
        // there is no previous history entry to pop — `router.back()`
        // would either do nothing or leave the tab. Fall through to a
        // sensible default route instead.
        if (typeof window !== "undefined" && window.history.length > 1) {
          router.back();
        } else {
          router.push(fallbackHref);
        }
      }}
      className="inline-flex items-center gap-1.5 text-sm text-text-300 transition-colors hover:text-text-100 focus-visible:text-text-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue"
    >
      <ArrowLeftIcon className="h-4 w-4" />
      <span>{label}</span>
    </button>
  );
}
