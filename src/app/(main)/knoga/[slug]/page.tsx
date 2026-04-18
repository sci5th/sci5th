import { notFound } from "next/navigation";
import KnoGaEntryView from "@/components/KnoGaEntry";
import { KNOGA_ENTRIES, findKnoGaEntry } from "@/config/knoga";

export function generateStaticParams() {
  return KNOGA_ENTRIES.map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = findKnoGaEntry(slug);
  if (!entry) return { title: "Not found | KnoGa | sci5th" };
  return {
    title: `${entry.title} | KnoGa | sci5th`,
    description: entry.summary,
  };
}

export default async function KnoGaEntryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = findKnoGaEntry(slug);
  if (!entry) notFound();

  return (
    <div className="flex flex-1 justify-center px-4 py-8 md:px-8 md:py-12">
      <div className="w-full max-w-3xl">
        <KnoGaEntryView entry={entry} />
      </div>
    </div>
  );
}
