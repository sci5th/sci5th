import Link from "next/link";

export const metadata = {
  title: "sci5th",
  description:
    "sci5th — exploring science, technology, and the structure of knowledge.",
};

export default function HomePage() {
  return (
    <div className="flex flex-1 items-center justify-center px-4 py-16 md:px-8 md:py-24">
      <div className="flex max-w-2xl flex-col items-center text-center">
        <p className="text-lg text-slate-200 md:text-2xl">
          sci5th — exploring science, technology, and the structure of
          knowledge.
        </p>
        <Link
          href="/map"
          className="mt-10 rounded-md bg-slate-900 px-6 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90 md:mt-14 md:px-8 md:py-4 md:text-base"
        >
          Enter the Map of Human Knowledge
        </Link>
      </div>
    </div>
  );
}
