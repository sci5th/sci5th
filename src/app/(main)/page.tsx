import Image from "next/image";
import Link from "next/link";
import { games } from "@/config/games";

export default function HomePage() {
  return (
    <div className="flex flex-1 px-4 py-8 md:px-8 lg:px-8">
      <div className="grid gap-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        {games.map((game) => (
          <div key={game.id} className="flex flex-col">
            <Link
              href={`/games/${game.id}`}
              className="group relative max-w-[555px] overflow-hidden rounded-lg shadow-lg transition-transform hover:scale-105"
            >
              <Image
                src={game.thumbnail}
                alt={game.name}
                width={555}
                height={312}
                className="h-auto max-h-[312px] w-full max-w-[555px] object-cover"
                priority
                unoptimized
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                <span className="rounded-full bg-white/90 px-6 py-3 text-lg font-semibold text-slate-800">
                  ▶ Play
                </span>
              </div>
            </Link>
            <p className="mt-2 text-center text-white">{game.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
