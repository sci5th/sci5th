import { notFound } from "next/navigation";
import { games, getGameById } from "@/config/games";
import UnityPlayer from "@/components/UnityPlayer";

interface GamePageProps {
  params: Promise<{ gameId: string }>;
}

export function generateStaticParams() {
  return games.map((game) => ({
    gameId: game.id,
  }));
}

export async function generateMetadata({ params }: GamePageProps) {
  const { gameId } = await params;
  const game = getGameById(gameId);

  if (!game) {
    return { title: "Game Not Found" };
  }

  return {
    title: `sci5th | ${game.name}`,
    description: game.description,
  };
}

export default async function GamePage({ params }: GamePageProps) {
  const { gameId } = await params;
  const game = getGameById(gameId);

  if (!game) {
    notFound();
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-2 md:py-4">
      <UnityPlayer
        gamePath={game.path}
        gameName={game.name}
        minWidth={game.minWidth}
        minHeight={game.minHeight}
        maxWidth={game.maxWidth}
        maxHeight={game.maxHeight}
        useUnityWebExtension={game.useUnityWebExtension}
      />
    </div>
  );
}
