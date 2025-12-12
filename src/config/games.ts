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
  useUnityWebExtension?: boolean;
}

export const games: GameConfig[] = [
  {
    id: "essentials",
    name: "Essentials",
    description: "Learn the essentials of Unity development.",
    thumbnail: "/Essentials.png",
    path: "/UnityGames/Essentials",
    minWidth: 480,
    minHeight: 270,
    maxWidth: 1280,
    maxHeight: 720,
    useUnityWebExtension: true,
  },
  {
    id: "clickyCrates",
    name: "Clicky Crates",
    description: "Clicky Game  - Test your reflexes!",
    thumbnail: "/ClickyCrates.png",
    path: "/UnityGames/Clicky Crates",
    minWidth: 480,
    minHeight: 270,
    maxWidth: 1280,
    maxHeight: 720,
    useUnityWebExtension: false,
  },
];

export function getGameById(id: string): GameConfig | undefined {
  return games.find((game) => game.id === id);
}
