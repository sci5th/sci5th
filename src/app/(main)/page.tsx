import FiveDimensionsHero from "@/components/FiveDimensionsHero";

export const metadata = {
  title: "sci5th",
  description:
    "sci5th — exploring the structure of human knowledge, with a focus on science and technology",
};

export default function HomePage() {
  return (
    <div className="relative flex flex-1 flex-col">
      {/* Animated background — fills the whole main area (edge-to-edge,
          logo-strip to footer). */}
      <div className="absolute inset-0 overflow-hidden bg-ink-700">
        <FiveDimensionsHero fit="cover" />
      </div>

      {/* Foreground content — sits on top of the animation. */}
      <div className="relative flex flex-1 flex-col items-center gap-6 px-4 pb-16 pt-6 md:gap-8 md:px-8 md:pb-24 md:pt-10">
        <div className="flex max-w-lg flex-col items-center text-center">
          <p className="text-sm text-text-300 md:text-base">
            knowledge -{">"} projects -{">"} knowledge
          </p>
        </div>
      </div>
    </div>
  );
}
