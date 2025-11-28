export interface GameConfig {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  path: string;
  width?: number;
  height?: number;
}

export const games: GameConfig[] = [
  {
    id: "essentials",
    name: "Essentials",
    description: "Learn the essentials of science",
    thumbnail: "/Essentials.png",
    path: "/UnityGames/Essentials",
  },
  // Add more games here in the future:
  // {
  //   id: "physics",
  //   name: "Physics Lab",
  //   description: "Explore physics concepts",
  //   thumbnail: "/Physics.png",
  //   path: "/UnityGames/Physics",
  // },
];

export function getGameById(id: string): GameConfig | undefined {
  return games.find((game) => game.id === id);
}
