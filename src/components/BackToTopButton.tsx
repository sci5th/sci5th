"use client";

import { useEffect, useState } from "react";
import { ChevronUpIcon } from "@heroicons/react/24/outline";

// A small floating "back to top" button. Fades in once the user has
// scrolled past `revealAt` pixels and smooth-scrolls to the top on click.
// Isolated into its own client component so the parent page can stay a
// server component. Honors `prefers-reduced-motion`: skips the smooth
// scroll for users who've asked for less motion.
//
// Used by the Knowledge Gallery page (long, scrollable card grid) but
// reusable on any page where vertical scroll exceeds a viewport or two.
export default function BackToTopButton({
  revealAt = 400,
}: {
  /** Scroll distance in px before the button becomes visible. */
  revealAt?: number;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > revealAt);
    };
    // Initialize on mount in case the page loads pre-scrolled (deep link,
    // browser-restored scroll position, focus handler that jumps to a card).
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [revealAt]);

  const handleClick = () => {
    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="Back to top"
      // `aria-hidden` + `tabIndex={-1}` keep the button out of the tab
      // order and the accessibility tree until it's actually visible —
      // otherwise screen readers and keyboard users would land on an
      // invisible control.
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      className={[
        "fixed bottom-6 right-6 z-40 inline-flex h-11 w-11 items-center justify-center rounded-full border border-line-700 bg-ink-900 text-text-300 shadow-lg transition-all",
        "hover:border-brand-pink hover:text-brand-pink",
        "focus-visible:border-brand-pink focus-visible:text-brand-pink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue",
        visible
          ? "pointer-events-auto translate-y-0 opacity-100"
          : "pointer-events-none translate-y-2 opacity-0",
      ].join(" ")}
    >
      <ChevronUpIcon className="h-5 w-5" />
    </button>
  );
}
