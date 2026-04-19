import { notFound } from "next/navigation";
import KnowledgeGalleryEntryView from "@/components/KnowledgeGalleryEntry";
import {
  KNOWLEDGE_GALLERY_ENTRIES,
  findKnowledgeGalleryEntry,
} from "@/config/knowledge-gallery";

export function generateStaticParams() {
  return KNOWLEDGE_GALLERY_ENTRIES.map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = findKnowledgeGalleryEntry(slug);
  if (!entry) return { title: "Not found | Knowledge Gallery | sci5th" };
  return {
    title: `${entry.title} | Knowledge Gallery | sci5th`,
    description: entry.summary,
  };
}

export default async function KnowledgeGalleryEntryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = findKnowledgeGalleryEntry(slug);
  if (!entry) notFound();

  return (
    <div className="flex flex-1 justify-center px-4 py-8 md:px-8 md:py-12">
      <div className="w-full max-w-3xl">
        <KnowledgeGalleryEntryView entry={entry} />
      </div>
    </div>
  );
}
