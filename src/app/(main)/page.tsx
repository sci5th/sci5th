export const metadata = {
  title: "sci5th",
  description:
    "sci5th — exploring the structure of human knowledge, with a focus on science and technology",
};

export default function HomePage() {
  return (
    <div className="flex flex-1 flex-col items-center gap-6 px-4 pb-16 pt-6 md:gap-8 md:px-8 md:pb-24 md:pt-10">
      <div className="flex max-w-lg flex-col items-center text-center">
        <p className="text-sm text-text-300 md:text-base">
          knowledge -{">"} projects -{">"} knowledge
        </p>
      </div>

      <div className="aspect-video w-full max-w-3xl overflow-hidden rounded-lg border border-line-700 bg-ink-800">
        <video
          src="/AI_Opal.mp4"
          controls
          playsInline
          preload="metadata"
          className="h-full w-full object-contain"
        />
      </div>
    </div>
  );
}
