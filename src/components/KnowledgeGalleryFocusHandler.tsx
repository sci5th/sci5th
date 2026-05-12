"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

// Reads `?focus=<slug>` from the URL and scrolls the matching gallery
// card into view. Used by the entry page's "Back to Knowledge Gallery"
// button so the user returns to exactly the card they came from.
//
// No visual highlight — the scroll alone is enough to orient the user.
// Lives as a client component so the gallery list itself can stay on
// the server (faster initial paint of the 30+ static cards).
export default function KnowledgeGalleryFocusHandler() {
  const searchParams = useSearchParams();
  const focusSlug = searchParams.get("focus");

  useEffect(() => {
    if (!focusSlug) return;

    const el = document.querySelector<HTMLElement>(
      `[data-card-slug="${CSS.escape(focusSlug)}"]`,
    );
    if (!el) return;

    // Defer to next frame so layout is stable before scrolling.
    // `behavior: "instant"` jumps directly to the card with no smooth
    // animation — feels like the user lands right on it.
    const t = window.setTimeout(() => {
      el.scrollIntoView({ behavior: "instant", block: "center" });
    }, 0);

    return () => window.clearTimeout(t);
  }, [focusSlug]);

  return null;
}
