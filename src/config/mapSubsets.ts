import type { Edge, Node } from "@xyflow/react";

export interface SubsetConfig {
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  nodes: Node[];
  edges: Edge[];
}

const seed = (
  slug: string,
  root: string,
  children: readonly string[],
): { nodes: Node[]; edges: Edge[] } => {
  const rootId = `${slug}-root`;
  const nodes: Node[] = [
    {
      id: rootId,
      position: { x: 0, y: 0 },
      data: { label: root },
      type: "default",
    },
    ...children.map<Node>((label, i) => {
      const angle = (i / children.length) * 2 * Math.PI - Math.PI / 2;
      const radius = 260;
      return {
        id: `${slug}-${i}`,
        position: {
          x: Math.cos(angle) * radius,
          y: Math.sin(angle) * radius,
        },
        data: { label },
        type: "default",
      };
    }),
  ];

  const edges: Edge[] = children.map((_, i) => ({
    id: `${slug}-e-${i}`,
    source: rootId,
    target: `${slug}-${i}`,
  }));

  return { nodes, edges };
};

export const mapSubsets: SubsetConfig[] = [
  {
    slug: "theories",
    title: "Map of Theories",
    shortTitle: "Theories",
    description:
      "Foundational theories across the sciences, humanities, and formal disciplines.",
    ...seed("theories", "Theories", [
      "Scientific",
      "Mathematical",
      "Philosophical",
      "Economic",
      "Social",
      "Computational",
    ]),
  },
  {
    slug: "algorithms",
    title: "Map of Algorithms",
    shortTitle: "Algorithms",
    description:
      "Classes of algorithms organized by purpose, paradigm, and domain.",
    ...seed("algorithms", "Algorithms", [
      "Search",
      "Sort",
      "Graph",
      "Optimization",
      "Cryptographic",
      "Machine Learning",
    ]),
  },
  {
    slug: "models",
    title: "Map of Models",
    shortTitle: "Models",
    description:
      "Mental, mathematical, and computational models used to reason about the world.",
    ...seed("models", "Models", [
      "Mathematical",
      "Statistical",
      "Physical",
      "Cognitive",
      "Economic",
      "Simulation",
    ]),
  },
  {
    slug: "systems",
    title: "Map of Systems",
    shortTitle: "Systems",
    description:
      "Systems thinking across natural, engineered, and social domains.",
    ...seed("systems", "Systems", [
      "Natural",
      "Engineered",
      "Social",
      "Economic",
      "Control",
      "Complex Adaptive",
    ]),
  },
  {
    slug: "data-science",
    title: "Map of Data Science",
    shortTitle: "Data Science",
    description:
      "The pipeline and practices of turning raw data into understanding and decisions.",
    ...seed("data-science", "Data Science", [
      "Collection",
      "Cleaning",
      "Exploration",
      "Modeling",
      "Visualization",
      "Deployment",
    ]),
  },
  {
    slug: "ai",
    title: "Map of Artificial Intelligence",
    shortTitle: "Artificial Intelligence",
    description:
      "Branches of artificial intelligence, from classical symbolic methods to modern learning systems.",
    ...seed("ai", "Artificial Intelligence", [
      "Machine Learning",
      "Deep Learning",
      "Reinforcement Learning",
      "Natural Language",
      "Computer Vision",
      "Symbolic AI",
    ]),
  },
  {
    slug: "robots",
    title: "Map of Robots",
    shortTitle: "Robots",
    description:
      "Robotics across perception, planning, actuation, and application domains.",
    ...seed("robots", "Robots", [
      "Perception",
      "Planning",
      "Control",
      "Manipulation",
      "Locomotion",
      "Human-Robot Interaction",
    ]),
  },
  {
    slug: "biotechnology",
    title: "Map of Biotechnology",
    shortTitle: "Biotechnology",
    description:
      "Biotechnology across medical, agricultural, industrial, and environmental frontiers.",
    ...seed("biotechnology", "Biotechnology", [
      "Genetic Engineering",
      "Synthetic Biology",
      "Bioinformatics",
      "Medical",
      "Agricultural",
      "Industrial",
    ]),
  },
];

export const getSubset = (slug: string): SubsetConfig | undefined =>
  mapSubsets.find((s) => s.slug === slug);
