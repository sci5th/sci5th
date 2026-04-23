import KnowledgeGallery from "@/components/KnowledgeGallery";

export const metadata = {
  title: "Knowledge Gallery | sci5th",
  description:
    "Knowledge Gallery — step-by-step explorations of topics from the System of Human Knowledge. Curated interactive entries on science, math, and ideas.",
};

// Next 15: `searchParams` is async. We only care about `?section=…`, which
// drives the sub-navbar filter (All / Algorithms / Modularity / Models /
// Systems / Theories — kind-scoped tabs are sorted alphabetically; All
// stays pinned as the default landing tab).
type SearchParams = { section?: string | string[] };

export default async function KnowledgeGalleryPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { section } = await searchParams;
  const sectionParam = Array.isArray(section) ? section[0] : section;

  return (
    <div className="flex flex-1 justify-center px-4 py-8 md:px-8 md:py-12">
      <div className="w-full max-w-5xl">
        <KnowledgeGallery section={sectionParam} />
      </div>
    </div>
  );
}
