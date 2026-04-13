import Image from "next/image";

const pictures = [
  { src: "/picturesGallery/IMG_4960.JPG" },
  { src: "/picturesGallery/IMG_5159.jpeg" },
  { src: "/picturesGallery/IMG_5171.jpeg" },
  { src: "/picturesGallery/IMG_6515.JPG" },
  { src: "/picturesGallery/komarik.jpeg", horizontal: true },
  { src: "/picturesGallery/Point.jpg", horizontal: true },
  { src: "/picturesGallery/fuguInquisition.PNG" },
  { src: "/picturesGallery/crow.jpeg" },
];

export default function PicturesPage() {
  const horizontalPics = pictures.filter((p) => p.horizontal);
  const verticalPics = pictures.filter((p) => !p.horizontal);

  return (
    <div className="flex flex-1 flex-col items-center gap-12 px-4 py-8 md:px-8 md:py-16">
      {horizontalPics.length > 0 && (
        <section className="w-full">
          <div
            className="grid w-full gap-4 md:gap-6"
            style={{
              gridTemplateColumns:
                "repeat(auto-fit, minmax(min(100%, 370px), 560px))",
              justifyContent: "center",
            }}
          >
            {horizontalPics.map((pic) => (
              <div
                key={pic.src}
                className="aspect-video overflow-hidden rounded-lg bg-slate-800 shadow-lg"
              >
                <Image
                  src={pic.src}
                  alt={pic.src.split("/").pop()?.split(".")[0] ?? ""}
                  width={560}
                  height={315}
                  className="h-full w-full object-cover"
                  unoptimized
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {verticalPics.length > 0 && (
        <section className="w-full">
          <div
            className="grid w-full gap-4 md:gap-6"
            style={{
              gridTemplateColumns:
                "repeat(auto-fit, minmax(min(100%, 270px), 360px))",
              justifyContent: "center",
            }}
          >
            {verticalPics.map((pic) => (
              <div
                key={pic.src}
                className="aspect-[9/14] overflow-hidden rounded-lg bg-slate-800 shadow-lg"
              >
                <Image
                  src={pic.src}
                  alt={pic.src.split("/").pop()?.split(".")[0] ?? ""}
                  width={360}
                  height={640}
                  className="h-full w-full object-cover"
                  unoptimized
                />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
