import HumanKnowledgeMap from "@/components/HumanKnowledgeMap";

export const metadata = {
  title: "Home — Map of Human Knowledge | sci5th",
  description:
    "Interactive map of human knowledge — explore science, CS, AI, medicine, biotechnology and bioprogramming.",
};

export default function HomPage() {
  return (
    <div className="flex flex-1 justify-center px-4 py-8 md:px-8 md:py-12">
      <div className="w-full max-w-3xl">
        <HumanKnowledgeMap />
      </div>
    </div>
  );
}
