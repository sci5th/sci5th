import HumanKnowledgeMap from "@/components/HumanKnowledgeMap";

export const metadata = {
  title: "Home — Map of Human Knowledge | sci5th",
  description:
    "Interactive map of human knowledge — a visual representation of the interconnectedness of various fields of study and disciplines. Explore the vast landscape of human knowledge and discover how different areas of expertise are related to one another.",
};

export default function HomePage() {
  return (
    <div className="flex flex-1 justify-center px-4 py-8 md:px-8 md:py-12">
      <div className="w-full max-w-3xl">
        <HumanKnowledgeMap />
      </div>
    </div>
  );
}
