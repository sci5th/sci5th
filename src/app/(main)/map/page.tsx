import Link from "next/link";
import { mapSubsets } from "@/config/mapSubsets";

export const metadata = {
  title: "Map of Human Knowledge | sci5th",
  description:
    "An interactive map of human knowledge — explore 8 subsets spanning theories, algorithms, models, systems, data science, artificial intelligence, robots, and biotechnology.",
};

export default function MapHubPage() {
  return (
    <div className="flex flex-1 flex-col items-center px-4 py-10 md:px-8 md:py-16">
      <div className="w-full max-w-5xl">
        <header className="mb-10 text-center">
          <h2 className="text-2xl text-white md:text-4xl">
            Map of Human Knowledge
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-slate-300 md:text-base">
            A visual guide to how knowledge is organized. Pick a subset to
            explore.
          </p>
        </header>

        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {mapSubsets.map((subset) => (
            <li key={subset.slug}>
              <Link
                href={`/map/${subset.slug}`}
                className="flex h-full flex-col rounded-md border border-slate-800 bg-slate-900 p-5 transition-colors hover:border-slate-600 hover:bg-slate-800"
              >
                <h3 className="text-lg text-white md:text-xl">
                  {subset.shortTitle}
                </h3>
                <p className="mt-2 text-sm text-slate-400">
                  {subset.description}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
