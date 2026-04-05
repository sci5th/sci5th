import Image from "next/image";

const pictures = [
  { src: "/picturesGallery/IMG_4960.JPG" },
  { src: "/picturesGallery/IMG_5159.jpeg" },
  { src: "/picturesGallery/IMG_5171.jpeg" },
  { src: "/picturesGallery/IMG_5172.jpeg", horizontal: true },
  { src: "/picturesGallery/LPG_Unity4.jpeg", horizontal: true },
  { src: "/picturesGallery/IMG_6515.JPG" },
  { src: "/picturesGallery/IMG_7285.JPG" },
  { src: "/picturesGallery/Point.jpg", horizontal: true },
  { src: "/picturesGallery/Science.jpg", horizontal: true },
  { src: "/picturesGallery/Space-Object.jpg" },
  { src: "/picturesGallery/L_1.png", horizontal: true },
  { src: "/picturesGallery/komarik.jpeg", horizontal: true },
  { src: "/picturesGallery/1april2026.jpg" },
  { src: "/picturesGallery/2april2026.jpeg" },
];

export default function PicturesPage() {
  return (
    <div className="flex flex-1 justify-center px-4 py-16 md:px-8 lg:px-8">
      <div
        className="grid w-full gap-8"
        style={{
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 360px))", // 280px is the minimum width for a picture, and 360px is the maximum width
          justifyContent: "center",
        }}
      >
        {pictures.map((pic) => (
          <div
            key={pic.src}
            className={`flex items-center justify-center overflow-hidden rounded-lg bg-slate-800 shadow-lg ${pic.horizontal ? "col-span-2" : ""}`}
          >
            <Image
              src={pic.src}
              alt={pic.src.split("/").pop()?.split(".")[0] ?? ""}
              width={360} // 360px is the maximum width for a picture
              height={270} // 270px is the maximum height for a picture (16:9 aspect ratio)
              className="h-auto max-h-full max-w-full object-contain"
              unoptimized
            />
          </div>
        ))}
      </div>
    </div>
  );
}
