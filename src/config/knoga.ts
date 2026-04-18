// KnoGa — Knowledge Gallery entries.
//
// Each entry is a curated, step-by-step expansion of a node from the
// System of Human Knowledge. Keep this list small and hand-curated.
//
// `systemPath` is the slash-joined path of the matching tree node in
// `HumanKnowledgeMap.DATA`. It is used for the "See in System" back-link
// and (in a follow-up) for tree-side badges pointing into KnoGa.

export interface KnoGaStep {
  title: string;
  body: string;
}

export interface KnoGaEntry {
  slug: string;
  title: string;
  summary: string;
  /** Path within System of Human Knowledge, e.g. "Human Knowledge/Formal Sciences/Systems Science/Chaos Theory". */
  systemPath: string;
  /** Visible breadcrumb shown on cards, derived from systemPath tail. */
  breadcrumb: string;
  /** Category slug used for the category accent ring (cat-*). */
  category:
    | "formal"
    | "natural"
    | "applied"
    | "social"
    | "humanities"
    | "professions";
  /** Path to a thumbnail image or short video poster in /public, or null for a placeholder. */
  thumbnail: string | null;
  steps: KnoGaStep[];
}

export const KNOGA_ENTRIES: KnoGaEntry[] = [
  {
    slug: "chaos-theory",
    title: "Chaos Theory",
    summary:
      "How simple deterministic rules can produce unpredictable behavior — and why that unpredictability is not randomness.",
    systemPath:
      "Human Knowledge/Formal Sciences/Systems Science/Chaos Theory",
    breadcrumb: "Formal Sciences · Systems Science",
    category: "formal",
    thumbnail: null,
    steps: [
      {
        title: "1 · Determinism without predictability",
        body: "A system is deterministic when its future is fully fixed by its present state and a set of rules. Chaos theory studies deterministic systems whose behavior is nevertheless practically impossible to predict over long timescales — not because the rules are random, but because tiny differences in the starting state grow very quickly.",
      },
      {
        title: "2 · Sensitivity to initial conditions",
        body: "The signature of chaos is sensitive dependence: two nearly-identical starting states diverge exponentially. Lorenz popularized this as the 'butterfly effect' — a minute perturbation in a weather model produces entirely different forecasts a week later. The rate of divergence is measured by the Lyapunov exponent.",
      },
      {
        title: "3 · Attractors and phase space",
        body: "Plot the state of a system over time in 'phase space' (one axis per variable). Many chaotic systems don't fly off to infinity — they trace out a bounded, infinitely-detailed shape called a strange attractor. The Lorenz attractor's two-lobed butterfly shape is the canonical example.",
      },
      {
        title: "4 · Where chaos shows up",
        body: "Weather and climate, double pendulums, cardiac arrhythmias, turbulent fluid flow, population dynamics (the logistic map), planetary orbits on long timescales, and some chemical reactions. Chaos is common — what's rare is a system simple enough to analyze cleanly.",
      },
      {
        title: "5 · Chaos vs. randomness vs. complexity",
        body: "Random systems have no underlying rule — outcomes are genuinely unpredictable in principle. Chaotic systems are fully rule-governed but practically unpredictable. Complex systems (many interacting parts, emergent behavior) often contain chaos but aren't the same thing. Keeping these three apart is the hardest part for newcomers.",
      },
    ],
  },
];

export function findKnoGaEntry(slug: string): KnoGaEntry | undefined {
  return KNOGA_ENTRIES.find((e) => e.slug === slug);
}
