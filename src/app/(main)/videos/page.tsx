const videos = [
  { src: "/videosGallery/AI_Opal.mp4", horizontal: true },
  { src: "/videosGallery/Hoe&Rale_Opal.mp4", horizontal: true },
];

export default function VideosPage() {
  return (
    <div className="flex flex-1 justify-center px-4 py-16 md:px-8 lg:px-8">
      <div
        className="grid w-full gap-8"
        style={{
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 360px))",
          gridAutoRows: "minmax(200px, 360px)",
          justifyContent: "center",
        }}
      >
        {videos.map((vid) => (
          <div
            key={vid.src}
            className={`flex items-center justify-center overflow-hidden rounded-lg bg-slate-800 shadow-lg ${vid.horizontal ? "col-span-2" : ""}`}
          >
            <video
              src={vid.src}
              controls
              className="h-full w-full object-contain"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
