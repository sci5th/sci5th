import { Suspense } from "react";
import HumanKnowledgeMap from "@/components/HumanKnowledgeMap";

export const metadata = {
  title: "Human Knowledge | sci5th",
  description:
    "Interactive system of human knowledge — a visual representation of the interconnectedness of various fields of study and disciplines. Explore the vast landscape of human knowledge and discover how different areas of expertise are related to one another.",
};

export default function HumanKnowledgePage() {
  return (
    <div className="flex flex-1 justify-center px-4 py-8 md:px-8 md:py-12">
      <div className="w-full max-w-3xl">
        {/* Suspense boundary required because HumanKnowledgeMap uses
            useSearchParams() for deep-link focus support. */}
        <Suspense fallback={null}>
          <HumanKnowledgeMap />
        </Suspense>
      </div>
    </div>
  );
}
