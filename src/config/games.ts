export interface GameConfig {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  path: string;
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
}

export const games: GameConfig[] = [
  {
    id: "essentials",
    name: "Essentials",
    description: "Learn the essentials of science",
    thumbnail: "/Essentials.png",
    path: "/UnityGames/Essentials",
    minWidth: 480,
    minHeight: 270,
    maxWidth: 1280,
    maxHeight: 720,
  },
];

export function getGameById(id: string): GameConfig | undefined {
  return games.find((game) => game.id === id);
}
