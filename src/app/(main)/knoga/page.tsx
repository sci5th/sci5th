import KnoGaGallery from "@/components/KnoGaGallery";

export const metadata = {
  title: "KnoGa — Knowledge Gallery | sci5th",
  description:
    "KnoGa — a gallery of step-by-step explorations of topics from the System of Human Knowledge. Curated interactive entries on science, math, and ideas.",
};

export default function KnoGaPage() {
  return (
    <div className="flex flex-1 justify-center px-4 py-8 md:px-8 md:py-12">
      <div className="w-full max-w-5xl">
        <KnoGaGallery />
      </div>
    </div>
  );
}
