const videos = [
  { src: "/videosGallery/AI_Opal.mp4", horizontal: true },
  { src: "/videosGallery/Hoe&Rale_Opal.mp4", horizontal: true },
];

export default function VideosPage() {
  const horizontalVids = videos.filter((v) => v.horizontal);
  const verticalVids = videos.filter((v) => !v.horizontal);

  return (
    <div className="flex flex-1 flex-col items-center gap-12 px-4 py-8 md:px-8 md:py-16">
      {horizontalVids.length > 0 && (
        <section className="w-full">
          <div
            className="grid w-full gap-4 md:gap-6"
            style={{
              gridTemplateColumns:
                "repeat(auto-fit, minmax(min(100%, 370px), 560px))",
              justifyContent: "center",
            }}
          >
            {horizontalVids.map((vid) => (
              <div
                key={vid.src}
                className="aspect-video overflow-hidden rounded-lg bg-slate-800 shadow-lg"
              >
                <video
                  src={vid.src}
                  controls
                  className="h-full w-full object-contain"
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {verticalVids.length > 0 && (
        <section className="w-full">
          <div
            className="grid w-full gap-4 md:gap-6"
            style={{
              gridTemplateColumns:
                "repeat(auto-fit, minmax(min(100%, 270px), 360px))",
              justifyContent: "center",
            }}
          >
            {verticalVids.map((vid) => (
              <div
                key={vid.src}
                className="aspect-[9/14] overflow-hidden rounded-lg bg-slate-800 shadow-lg"
              >
                <video
                  src={vid.src}
                  controls
                  className="h-full w-full object-contain"
                />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
