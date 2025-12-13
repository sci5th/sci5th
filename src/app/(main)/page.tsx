import Image from "next/image";
import Link from "next/link";
import { games } from "@/config/games";

export default function HomePage() {
  return (
    <div className="flex flex-1 justify-center px-4 py-16 md:px-8 lg:px-8">
      <div className="grid w-full gap-8" style={{ gridTemplateColumns: "repeat(auto-fit, 360px)", justifyContent: "center" }}>
        {games.map((game) => (
          <div key={game.id} className="flex flex-col">
            <Link
              href={`/games/${game.id}`}
              className="group relative aspect-video w-[360px] overflow-hidden rounded-lg shadow-lg transition-transform hover:scale-105"
            >
              <Image
                src={game.thumbnail}
                alt={game.name}
                fill
                className="object-cover"
                priority
                unoptimized
                sizes="480px"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                <span className="rounded-full bg-white/90 px-4 text-lg text-slate-800">
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
