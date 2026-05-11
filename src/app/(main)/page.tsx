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
          logo-strip to footer). The hero's PAGE_BG paints the full surface,
          and the 1920×1080 scene auto-scales (contain semantics) so nothing
          is ever cropped or stretched on smaller / taller viewports. */}
      <div className="absolute inset-0 overflow-hidden bg-ink-700">
        <FiveDimensionsHero />
      </div>
    </div>
  );
}
