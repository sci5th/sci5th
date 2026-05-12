"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

// Mirrors the System-side `?focus=<systemPath>` mechanism:
//   1. Read `?focus=<slug>` from the URL.
//   2. Find the matching gallery card (tagged with `data-card-slug`).
//   3. Scroll it into view, smoothly, centered.
//   4. Toggle `data-highlight="true"` for ~5s so the CSS pulse animation runs.
//
// Lives as a client component so the gallery list itself can stay on the
// server (faster initial paint of the 30+ static cards). This component
// renders nothing — it only runs the side-effect.
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
    const t1 = window.setTimeout(() => {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      el.setAttribute("data-highlight", "true");
    }, 0);

    // Clear the highlight flag shortly after the CSS animation (4.5s) ends.
    const t2 = window.setTimeout(() => {
      el.removeAttribute("data-highlight");
    }, 5000);

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      // Belt-and-braces — if the user navigates away mid-animation, leave
      // the DOM clean.
      el.removeAttribute("data-highlight");
    };
  }, [focusSlug]);

  return null;
}
