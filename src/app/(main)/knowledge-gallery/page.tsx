import { Suspense } from "react";
import KnowledgeGallery from "@/components/KnowledgeGallery";
import KnowledgeGalleryFocusHandler from "@/components/KnowledgeGalleryFocusHandler";

// Title template in src/app/layout.tsx appends " | sci5th".
export const metadata = {
  title: "Knowledge Gallery",
  description:
    "Knowledge Gallery — step-by-step explorations of topics from the System of Human Knowledge. Curated interactive entries on science, math, and ideas.",
};

// Note: this page is fully static (`output: "export"` in `next.config.ts`).
// The `?section=…` filter and the `?focus=<slug>` highlight are both read
// on the client via `useSearchParams()` inside the components below. Both
// need a Suspense boundary or Next will refuse to prerender.
export default function KnowledgeGalleryPage() {
  return (
    <div className="flex flex-1 justify-center px-4 py-8 md:px-8 md:py-12">
      <div className="w-full max-w-5xl">
        <Suspense fallback={null}>
          <KnowledgeGallery />
        </Suspense>
        {/* Client-only effect: scroll + highlight the card named by
            `?focus=<slug>` (set by the entry page's Back button). */}
        <Suspense fallback={null}>
          <KnowledgeGalleryFocusHandler />
        </Suspense>
      </div>
    </div>
  );
}
