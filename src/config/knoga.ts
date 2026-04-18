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
    thumbnail: "/ChaosTheory.webp",
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
  {
    slug: "game-theory",
    title: "Game Theory",
    summary:
      "The mathematics of strategic decisions — what rational players should do when their best move depends on what everyone else does.",
    systemPath:
      "Human Knowledge/Formal Sciences/Mathematics/Applied Mathematics/Game Theory",
    breadcrumb: "Formal Sciences · Applied Mathematics",
    category: "formal",
    thumbnail: "/GameTheory.webp",
    steps: [
      {
        title: "1 · What is a game?",
        body: "A game in this sense is any situation with players, a set of possible actions for each, and payoffs that depend on the combination of everyone's choices. Chess is a game; so is an auction, a price war between two firms, or two countries deciding whether to disarm. The formalism strips away the surface differences so the same tools apply to all of them.",
      },
      {
        title: "2 · Strategies and payoffs",
        body: "A strategy is a complete plan for how a player will act in every situation they might face. Payoffs express preferences as numbers — higher is better. The central object is the payoff matrix (for two players) or payoff function, which maps every combination of strategies to a number for each player. Everything else is built on this.",
      },
      {
        title: "3 · Nash equilibrium",
        body: "A Nash equilibrium is a set of strategies where no player can improve their payoff by unilaterally switching. It's the game-theoretic answer to 'what will rational players actually do?' John Nash proved that every finite game has at least one (possibly in mixed strategies — probabilistic play). Equilibria don't have to be fair or efficient; they just have to be stable.",
      },
      {
        title: "4 · The classic examples",
        body: "The Prisoner's Dilemma: two suspects do worse if they both defect, but defection is each one's best response — a stable bad outcome. The Stag Hunt: cooperating has the highest payoff but requires trust. Matching Pennies: no pure-strategy equilibrium exists, so players must randomize. These three games capture most of the recurring patterns in strategic life.",
      },
      {
        title: "5 · Cooperative vs. non-cooperative, zero-sum vs. general",
        body: "Non-cooperative games model individual choice under no binding agreements (most real-world strategic settings). Cooperative game theory asks how a group should split a jointly-won payoff (Shapley values, the core). Zero-sum games have a winner and a loser in strict proportion (poker, chess); general-sum games allow mutual gain or mutual loss (business, diplomacy). Different branches, different tools.",
      },
      {
        title: "6 · Where it shows up",
        body: "Auction design (spectrum auctions, ad markets), mechanism design (voting systems, matching algorithms like the Gale–Shapley deferred-acceptance procedure behind kidney exchanges and school admissions), evolutionary biology (replicator dynamics, hawk–dove), economics (oligopoly models), cryptography (incentive-compatible protocols), and AI (multi-agent reinforcement learning). It's one of the most portable frameworks in formal thought.",
      },
    ],
  },
];

export function findKnoGaEntry(slug: string): KnoGaEntry | undefined {
  return KNOGA_ENTRIES.find((e) => e.slug === slug);
}

/**
 * Lookup by systemPath — used by the System tree to badge nodes that
 * have a matching KnoGa entry. O(1) per row.
 */
export const KNOGA_BY_SYSTEM_PATH: Record<string, KnoGaEntry> = Object.freeze(
  Object.fromEntries(KNOGA_ENTRIES.map((e) => [e.systemPath, e]))
);
