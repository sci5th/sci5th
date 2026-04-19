import KnowledgeGallery from "@/components/KnowledgeGallery";

export const metadata = {
  title: "Knowledge Gallery | sci5th",
  description:
    "Knowledge Gallery — step-by-step explorations of topics from the System of Human Knowledge. Curated interactive entries on science, math, and ideas.",
};

export default function KnowledgeGalleryPage() {
  return (
    <div className="flex flex-1 justify-center px-4 py-8 md:px-8 md:py-12">
      <div className="w-full max-w-5xl">
        <KnowledgeGallery />
      </div>
    </div>
  );
}
