import Image from "next/image";
import Link from "next/link";
import { games } from "@/config/games";

export default function HomePage() {
  return (
    <div className="flex flex-1 justify-center px-4 py-8 md:px-8 md:py-16">
      <div
        className="grid w-full gap-4 md:gap-6"
        style={{
          gridTemplateColumns:
            "repeat(auto-fit, minmax(min(100%, 370px), 560px))",
          justifyContent: "center",
        }}
      >
        {games.map((game) => (
          <div key={game.id} className="flex flex-col">
            <Link
              href={`/games/${game.id}`}
              className="group relative aspect-video w-full overflow-hidden rounded-lg shadow-lg transition-transform hover:scale-105"
            >
              <Image
                src={game.thumbnail}
                alt={game.name}
                fill
                className="object-cover"
                priority
                unoptimized
                sizes="(max-width: 768px) 100vw, 560px"
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
