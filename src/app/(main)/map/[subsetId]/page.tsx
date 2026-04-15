import Link from "next/link";
import { notFound } from "next/navigation";
import MapVisualization from "@/components/MapVisualization";
import { getSubset, mapSubsets } from "@/config/mapSubsets";

export function generateStaticParams() {
  return mapSubsets.map((s) => ({ subsetId: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ subsetId: string }>;
}) {
  const { subsetId } = await params;
  const subset = getSubset(subsetId);
  if (!subset) {
    return { title: "Not found | sci5th" };
  }
  return {
    title: `${subset.title} | sci5th`,
    description: subset.description,
  };
}

export default async function SubsetPage({
  params,
}: {
  params: Promise<{ subsetId: string }>;
}) {
  const { subsetId } = await params;
  const subset = getSubset(subsetId);
  if (!subset) {
    notFound();
  }

  return (
    <div className="flex flex-1 flex-col px-4 py-8 md:px-8 md:py-12">
      <div className="mx-auto w-full max-w-6xl">
        <nav className="mb-4 text-xs text-slate-400 md:text-sm">
          <Link href="/map" className="hover:text-slate-200">
            Map of Human Knowledge
          </Link>
          <span className="mx-2">/</span>
          <span className="text-slate-200">{subset.shortTitle}</span>
        </nav>

        <header className="mb-6">
          <h2 className="text-2xl text-white md:text-4xl">{subset.title}</h2>
          <p className="mt-2 max-w-3xl text-sm text-slate-300 md:text-base">
            {subset.description}
          </p>
        </header>

        <MapVisualization nodes={subset.nodes} edges={subset.edges} />
      </div>
    </div>
  );
}
