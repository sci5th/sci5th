// Knowledge Gallery entries.
//
// Each entry is a curated, step-by-step expansion of a node from the
// System of Human Knowledge. Keep this list small and hand-curated.
//
// `systemPath` is the slash-joined path of the matching tree node in
// `HumanKnowledgeMap.DATA`. It is used for the "See in System" back-link
// and for tree-side badges pointing into the Gallery.
//
// Ordering convention: entries are listed in the order they appear as
// a pre-order traversal of the System of Human Knowledge tree (i.e.
// top-to-bottom as the tree renders). When adding a new entry, insert
// it at the position matching its systemPath's tree location.

export interface KnowledgeGalleryStep {
  title: string;
  body: string;
}

/**
 * What kind of entry this is — used by the Gallery sub-navbar to split cards
 * into filterable groups. `other` covers anything that isn't cleanly one of
 * the named kinds (methods, frameworks, tools, people, etc.).
 *
 *  • theory     — scientific theories and foundational frameworks.
 *  • law        — named scientific laws: concise (often mathematical)
 *                 statements of what regularly happens, as distinct from
 *                 the theories that explain why (Newton's laws, the laws of
 *                 thermodynamics, the periodic law).
 *  • algorithm  — named algorithms / procedures.
 *  • model      — named models of something (scientific, statistical, ML…).
 *  • system     — named systems (natural, engineered, or conceptual).
 *  • modularity — named applications of the modularity principle across
 *                 disciplines (software, biology, cognition, …).
 *  • other      — doesn't cleanly fit above.
 */
export type KnowledgeGalleryKind =
  | "theory"
  | "law"
  | "algorithm"
  | "model"
  | "system"
  | "modularity"
  | "other";

/**
 * Provenance of an entry's hero image / interactive media. Drives the
 * per-card and per-entry credit caption; replaces the old implicit
 * "does it have a `unity` field?" check.
 *
 *  • openai          — AI-generated thumbnail (OpenAI Images 2.0). Default.
 *  • unity           — original Unity WebGL build, fully first-party.
 *  • unity-tutorial  — Unity WebGL build implemented by following a
 *                      third-party tutorial / course. Author of this site
 *                      built the project from instructor materials. The
 *                      entry's `attribution` field MUST be set for this
 *                      source so the credit caption can name the
 *                      instructor + course.
 *  • first-party     — original artwork or photo by the site author.
 *  • stock           — properly licensed third-party image; the entry's
 *                      caption should also disclose source + license inline.
 *
 * Required on every entry. If you add a new provenance type, extend the
 * `switch` in `imageCreditFor()` so the credit caption gets the right copy.
 */
export type ImageSource =
  | "openai"
  | "unity"
  | "unity-tutorial"
  | "first-party"
  | "stock";

/**
 * Per-entry attribution metadata. Required when `imageSource` names a
 * provenance that needs author + source naming (e.g. `unity-tutorial`).
 * Optional for sources where the credit is generic (e.g. `openai`).
 */
export interface EntryAttribution {
  /** Who created the source material the entry was built from. */
  author: string;
  /** What the source material is called (course title, book name, etc.). */
  workTitle: string;
  /** Stable landing URL for the source material. */
  url: string;
}

export interface KnowledgeGalleryEntry {
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
  /** Which sub-navbar group in the Gallery this entry belongs to. */
  kind: KnowledgeGalleryKind;
  /** Path to a thumbnail image or short video poster in /public, or null for a placeholder. */
  thumbnail: string | null;
  /**
   * Provenance of the thumbnail/hero. Drives the credit caption. See
   * `ImageSource` for the menu. Suppress the caption entirely by setting
   * `thumbnail: null` (placeholder cards have no image to credit).
   */
  imageSource: ImageSource;
  /**
   * Optional per-entry attribution. Required when `imageSource` is
   * `"unity-tutorial"` (or any future source that names a specific author
   * + work). When set, `imageCreditFor()` includes the author and links
   * to `attribution.url`.
   */
  attribution?: EntryAttribution;
  /**
   * Optional Unity WebGL build to launch when the user presses Play on the
   * entry's hero. The folder must contain `WebGL_build.loader.js`,
   * `WebGL_build.data[.unityweb]`, `WebGL_build.framework.js[.unityweb]` and
   * `WebGL_build.wasm[.unityweb]`. Setting `unity` implies (but does not
   * require) `imageSource: "unity"`.
   */
  unity?: {
    /** Absolute path under /public, no trailing slash (e.g. "/UnityGames/GOAP_Hospital"). */
    path: string;
    /** Label shown under the canvas. */
    name: string;
    /** Whether the build uses the `.unityweb` (gzipped) suffix. Defaults to true. */
    useUnityWebExtension?: boolean;
  };
  /**
   * Optional first-party interactive hero. When set, the entry's detail page
   * renders a self-contained interactive widget instead of the static image
   * (the grid-card thumbnail still uses `thumbnail`). Currently supported:
   *  • "periodic-table" — an interactive periodic table (Periodic Law).
   */
  interactive?: "periodic-table";
}

/**
 * Plain-text credit caption for a given `imageSource`. Returned as a
 * string (no markup) so it can be used wherever a single string is
 * needed — the per-card overlay on the Gallery index uses this form.
 *
 * For sources that need a clickable link in the credit (e.g.
 * `unity-tutorial` linking to the course), prefer `imageCreditPartsFor()`
 * below — it returns the credit as labeled segments so the renderer can
 * wrap the relevant ones in an `<a>`.
 */
export function imageCreditFor(
  source: ImageSource,
  attribution?: EntryAttribution
): string {
  switch (source) {
    case "openai":
      return "Image: Images 2.0 by OpenAI";
    case "unity":
      return "Hero: original Unity WebGL build";
    case "unity-tutorial": {
      if (!attribution) return "Hero: Unity WebGL build (tutorial-derived)";
      return `Hero: Unity WebGL build, built following ${attribution.workTitle} by ${attribution.author}`;
    }
    case "first-party":
      return "Image: original work";
    case "stock":
      return "Image: licensed stock";
  }
}

/**
 * Structured credit for renderers that want to wrap the attribution
 * portion in a link. The renderer joins the `prefix`, optional
 * `authorLink` (rendered as `<a href={url}>{label}</a>`), and `suffix`
 * to produce the final credit. Pure functions over `ImageSource` +
 * optional `attribution` — never throws.
 */
export type CreditParts = {
  prefix: string;
  authorLink?: { label: string; url: string };
  suffix?: string;
};

export function imageCreditPartsFor(
  source: ImageSource,
  attribution?: EntryAttribution
): CreditParts {
  if (source === "unity-tutorial" && attribution) {
    return {
      prefix: "Hero: Unity WebGL build, built following ",
      authorLink: {
        label: `${attribution.workTitle} by ${attribution.author}`,
        url: attribution.url,
      },
    };
  }
  return { prefix: imageCreditFor(source, attribution) };
}

export const KNOWLEDGE_GALLERY_ENTRIES: KnowledgeGalleryEntry[] = [
  {
    slug: "human-knowledge",
    title: "Human Knowledge",
    summary:
      "A map of what humans have figured out — organized into six great branches that together cover the formal, the natural, the made, the social, the interpretive, and the practical.",
    systemPath: "Human Knowledge",
    breadcrumb: "System of Human Knowledge",
    category: "formal",
    kind: "other",
    thumbnail: "/HumanKnowledge.webp",
    imageSource: "openai",
  },
  {
    slug: "formal-sciences",
    title: "Formal Sciences",
    summary:
      "The study of form, structure, and valid inference — the branch of knowledge whose results are established by proof rather than experiment.",
    systemPath: "Human Knowledge/Formal Sciences",
    breadcrumb: "Human Knowledge · Formal Sciences",
    category: "formal",
    kind: "other",
    thumbnail: "/FormalSciences.webp",
    imageSource: "openai",
  },
  {
    slug: "natural-sciences",
    title: "Natural Sciences",
    summary:
      "The empirical study of the physical world and the life within it — from subatomic particles to galaxies, from molecules to ecosystems.",
    systemPath: "Human Knowledge/Natural Sciences",
    breadcrumb: "Human Knowledge · Natural Sciences",
    category: "natural",
    kind: "other",
    thumbnail: "/NaturalSciences.webp",
    imageSource: "openai",
  },
  {
    slug: "applied-sciences",
    title: "Applied Sciences & Technology",
    summary:
      "The branches where knowledge becomes things that work — engineering, medicine, biotech, agriculture, materials, and information technology.",
    systemPath: "Human Knowledge/Applied Sciences & Technology",
    breadcrumb: "Human Knowledge · Applied Sciences & Technology",
    category: "applied",
    kind: "other",
    thumbnail: "/AppliedSciences.webp",
    imageSource: "openai",
  },
  {
    slug: "social-sciences",
    title: "Social Sciences",
    summary:
      "The study of humans as individuals and in groups — the disciplines that try to turn something as messy as human behavior into something scientifically tractable.",
    systemPath: "Human Knowledge/Social Sciences",
    breadcrumb: "Human Knowledge · Social Sciences",
    category: "social",
    kind: "other",
    thumbnail: "/SocialSciences.webp",
    imageSource: "openai",
  },
  {
    slug: "humanities",
    title: "Humanities",
    summary:
      "The interpretive disciplines — the branches of knowledge that ask not what the world is made of but what it means.",
    systemPath: "Human Knowledge/Humanities",
    breadcrumb: "Human Knowledge · Humanities",
    category: "humanities",
    kind: "other",
    thumbnail: "/Humanities.webp",
    imageSource: "openai",
  },
  {
    slug: "professions",
    title: "Professions & Interdisciplinary",
    summary:
      "The branches organized around practice — fields that cut across theory and are judged by whether the work actually works.",
    systemPath: "Human Knowledge/Professions & Interdisciplinary",
    breadcrumb: "Human Knowledge · Professions & Interdisciplinary",
    category: "professions",
    kind: "other",
    thumbnail: "/Professions.webp",
    imageSource: "openai",
  },
  {
    slug: "set-theory",
    title: "Set Theory",
    summary:
      "The mathematics of collections — the language and foundation on which almost all modern mathematics is built.",
    systemPath:
      "Human Knowledge/Formal Sciences/Mathematics/Pure Mathematics/Logic & Foundations/Set Theory",
    breadcrumb: "Formal Sciences · Logic & Foundations",
    category: "formal",
    kind: "theory",
    thumbnail: "/SetTheory.webp",
    imageSource: "openai",
  },
  {
    slug: "model-theory",
    title: "Model Theory",
    summary:
      "The branch of mathematical logic that studies the relationship between formal languages and the mathematical structures that satisfy them — the bridge between syntax and semantics.",
    systemPath:
      "Human Knowledge/Formal Sciences/Mathematics/Pure Mathematics/Logic & Foundations/Model Theory",
    breadcrumb: "Formal Sciences · Logic & Foundations",
    category: "formal",
    kind: "theory",
    thumbnail: "/ModelTheory.webp",
    imageSource: "openai",
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
    kind: "theory",
    thumbnail: "/GameTheory.webp",
    imageSource: "openai",
  },
  {
    slug: "quicksort",
    title: "Quicksort",
    summary:
      "Sort by repeatedly partitioning around a pivot — the divide-and-conquer algorithm that is, in practice, the fastest general-purpose sort.",
    systemPath:
      "Human Knowledge/Formal Sciences/Computer Science/Theoretical CS/Algorithms & Data Structures/Sorting & Searching/Quicksort",
    breadcrumb: "Formal Sciences · Computer Science",
    category: "formal",
    kind: "algorithm",
    thumbnail: "/Quicksort.webp",
    imageSource: "first-party",
  },
  {
    slug: "binary-search",
    title: "Binary Search",
    summary:
      "Find an item in a sorted list by repeatedly halving the search range — turning a million-item lookup into about twenty comparisons.",
    systemPath:
      "Human Knowledge/Formal Sciences/Computer Science/Theoretical CS/Algorithms & Data Structures/Sorting & Searching/Binary Search",
    breadcrumb: "Formal Sciences · Computer Science",
    category: "formal",
    kind: "algorithm",
    thumbnail: "/BinarySearch.webp",
    imageSource: "first-party",
  },
  {
    slug: "dijkstras-algorithm",
    title: "Dijkstra's Algorithm",
    summary:
      "Find the shortest path from a source to every other node in a weighted graph, greedily settling the closest unvisited node each step.",
    systemPath:
      "Human Knowledge/Formal Sciences/Computer Science/Theoretical CS/Algorithms & Data Structures/Graph Algorithms/Dijkstra's Algorithm",
    breadcrumb: "Formal Sciences · Computer Science",
    category: "formal",
    kind: "algorithm",
    thumbnail: "/DijkstrasAlgorithm.webp",
    imageSource: "first-party",
  },
  {
    slug: "information-theory",
    title: "Information Theory",
    summary:
      "Claude Shannon's 1948 theory that made information a measurable quantity — bits, entropy, and the hard limits on compression and communication.",
    systemPath:
      "Human Knowledge/Formal Sciences/Computer Science/Theoretical CS/Information Theory",
    breadcrumb: "Formal Sciences · Computer Science",
    category: "formal",
    kind: "theory",
    thumbnail: "/InformationTheory.webp",
    imageSource: "first-party",
  },
  {
    slug: "operating-systems",
    title: "Operating Systems",
    summary:
      "The software layer between a computer's hardware and everything that runs on it — managing processes, memory, files, and the illusion that each program has the machine to itself.",
    systemPath:
      "Human Knowledge/Formal Sciences/Computer Science/Systems/Operating Systems",
    breadcrumb: "Formal Sciences · Computer Science",
    category: "formal",
    kind: "system",
    thumbnail: "/OperatingSystems.webp",
    imageSource: "openai",
  },
  {
    slug: "distributed-systems",
    title: "Distributed Systems",
    summary:
      "A collection of independent computers that appears to users as a single coherent system — and the decades of theory and trade-offs required to make that illusion hold.",
    systemPath:
      "Human Knowledge/Formal Sciences/Computer Science/Systems/Distributed Systems",
    breadcrumb: "Formal Sciences · Computer Science",
    category: "formal",
    kind: "system",
    thumbnail: "/DistributedSystems.webp",
    imageSource: "openai",
  },
  {
    slug: "software-modularity",
    title: "Software Modularity",
    summary:
      "The engineering principle of splitting a program into self-contained pieces that hide their internals and expose narrow interfaces — arguably the single most important idea in software design.",
    systemPath:
      "Human Knowledge/Formal Sciences/Computer Science/Software Engineering/Software Modularity",
    breadcrumb: "Formal Sciences · Software Engineering",
    category: "formal",
    kind: "modularity",
    thumbnail: "/SoftwareModularity.webp",
    imageSource: "openai",
  },
  {
    slug: "generative-models",
    title: "Generative Models",
    summary:
      "Machine-learning models that learn the distribution of a dataset well enough to produce new samples from it — the technology behind modern image, video, audio, and text synthesis.",
    systemPath:
      "Human Knowledge/Formal Sciences/Computer Science/Artificial Intelligence/Deep Learning/Generative Models",
    breadcrumb: "Formal Sciences · Artificial Intelligence",
    category: "formal",
    kind: "model",
    thumbnail: "/GenerativeModels.webp",
    imageSource: "openai",
  },
  {
    slug: "goal-oriented-action-planning",
    title: "Goal-Oriented Action Planning",
    summary:
      "A classical-AI planning technique where agents choose what to do by searching backward from a goal through a library of actions — a staple of game AI and autonomous behavior.",
    systemPath:
      "Human Knowledge/Formal Sciences/Computer Science/Artificial Intelligence/Robotics & Embodied AI/Goal-Oriented Action Planning",
    breadcrumb: "Formal Sciences · Artificial Intelligence",
    category: "formal",
    kind: "algorithm",
    thumbnail: "/GOAP.webp",
    imageSource: "unity-tutorial",
    attribution: {
      author: "Penny de Byl",
      workTitle: "Goal-Oriented Action Planning",
      url: "https://www.udemy.com/course/ai_with_goap/",
    },
    unity: {
      path: "/UnityGames/GOAP_Hospital",
      name: "GOAP Hospital",
      useUnityWebExtension: true,
    },
  },
  {
    slug: "behavior-trees",
    title: "Behavior Trees",
    summary:
      "A hierarchical, modular way to structure agent decision-making — the dominant AI architecture in modern games and a growing standard in robotics.",
    systemPath:
      "Human Knowledge/Formal Sciences/Computer Science/Artificial Intelligence/Robotics & Embodied AI/Behavior Trees",
    breadcrumb: "Formal Sciences · Artificial Intelligence",
    category: "formal",
    kind: "algorithm",
    thumbnail: "/BehaviourTrees.webp",
    imageSource: "unity-tutorial",
    attribution: {
      author: "Penny de Byl",
      workTitle: "Behaviour Trees",
      url: "https://www.udemy.com/course/behaviour-trees/",
    },
    unity: {
      path: "/UnityGames/BehaviourTree_Gallery",
      name: "Behaviour Tree Gallery",
      useUnityWebExtension: true,
    },
  },
  {
    slug: "foundation-models",
    title: "Foundation Models & LLMs",
    summary:
      "Enormous neural networks trained on broad data at scale, adaptable to a wide range of downstream tasks with minimal further training — the architectural core of the 2020s AI wave.",
    systemPath:
      "Human Knowledge/Formal Sciences/Computer Science/Artificial Intelligence/Foundation Models & LLMs",
    breadcrumb: "Formal Sciences · Artificial Intelligence",
    category: "formal",
    kind: "model",
    thumbnail: "/FoundationModels.webp",
    imageSource: "openai",
  },
  {
    slug: "general-systems-theory",
    title: "General Systems Theory",
    summary:
      "A unifying framework proposing that the same structural principles — wholeness, feedback, openness, hierarchy — govern systems across biology, engineering, and the social sciences.",
    systemPath:
      "Human Knowledge/Formal Sciences/Systems Science/General Systems Theory",
    breadcrumb: "Formal Sciences · Systems Science",
    category: "formal",
    kind: "theory",
    thumbnail: "/GeneralSystemsTheory.webp",
    imageSource: "openai",
  },
  {
    slug: "complex-systems",
    title: "Complex Systems",
    summary:
      "Systems composed of many interacting components whose collective behavior cannot be inferred from the parts alone — a field that cuts across physics, biology, economics, and the social sciences.",
    systemPath:
      "Human Knowledge/Formal Sciences/Systems Science/Complex Systems",
    breadcrumb: "Formal Sciences · Systems Science",
    category: "formal",
    kind: "system",
    thumbnail: "/ComplexSystems.webp",
    imageSource: "openai",
  },
  {
    slug: "complex-adaptive-systems",
    title: "Complex Adaptive Systems",
    summary:
      "Systems of many interacting agents that learn, adapt, and produce emergent behavior at the group level — from ant colonies and immune systems to economies and the internet.",
    systemPath:
      "Human Knowledge/Formal Sciences/Systems Science/Complex Adaptive Systems",
    breadcrumb: "Formal Sciences · Systems Science",
    category: "formal",
    kind: "system",
    thumbnail: "/ComplexAdaptiveSystems.webp",
    imageSource: "openai",
  },
  {
    slug: "chaos-theory",
    title: "Chaos Theory",
    summary:
      "How simple deterministic rules can produce unpredictable behavior — and why that unpredictability is not randomness.",
    systemPath: "Human Knowledge/Formal Sciences/Systems Science/Chaos Theory",
    breadcrumb: "Formal Sciences · Systems Science",
    category: "formal",
    kind: "theory",
    thumbnail: "/ChaosTheory.webp",
    imageSource: "openai",
  },
  {
    slug: "newtons-laws-of-motion",
    title: "Newton's Laws of Motion",
    summary:
      "Three short rules, published in 1687, that turned motion from philosophy into prediction — the foundation of classical mechanics and engineering for three centuries.",
    systemPath:
      "Human Knowledge/Natural Sciences/Physics/Classical Mechanics/Newtonian Mechanics/Newton's Laws of Motion",
    breadcrumb: "Natural Sciences · Physics",
    category: "natural",
    kind: "law",
    thumbnail: "/NewtonsLaws.webp",
    imageSource: "first-party",
  },
  {
    slug: "law-of-universal-gravitation",
    title: "Law of Universal Gravitation",
    summary:
      "Every mass attracts every other with a force that falls off as the square of the distance — the law that unified falling apples and orbiting planets.",
    systemPath:
      "Human Knowledge/Natural Sciences/Physics/Classical Mechanics/Newtonian Mechanics/Law of Universal Gravitation",
    breadcrumb: "Natural Sciences · Physics",
    category: "natural",
    kind: "law",
    thumbnail: "/UniversalGravitation.webp",
    imageSource: "first-party",
  },
  {
    slug: "conservation-laws",
    title: "Conservation Laws",
    summary:
      "Certain quantities — energy, momentum, angular momentum, charge — never change in a closed system. Among the deepest and most useful principles in all of physics.",
    systemPath:
      "Human Knowledge/Natural Sciences/Physics/Classical Mechanics/Newtonian Mechanics/Conservation Laws (Energy, Momentum, Angular Momentum)",
    breadcrumb: "Natural Sciences · Physics",
    category: "natural",
    kind: "law",
    thumbnail: "/ConservationLaws.webp",
    imageSource: "first-party",
  },
  {
    slug: "quantum-mechanics",
    title: "Quantum Mechanics",
    summary:
      "The physics of the very small — where particles behave as waves, measurement changes what's measured, and classical intuitions break down.",
    systemPath: "Human Knowledge/Natural Sciences/Physics/Quantum Mechanics",
    breadcrumb: "Natural Sciences · Physics",
    category: "natural",
    kind: "theory",
    thumbnail: "/QuantumMechanics.webp",
    imageSource: "openai",
  },
  {
    slug: "standard-model",
    title: "Standard Model",
    summary:
      "The quantum field theory that classifies every known elementary particle and describes three of the four fundamental forces — arguably the most precisely tested theory in the history of science.",
    systemPath:
      "Human Knowledge/Natural Sciences/Physics/Quantum Mechanics/Quantum Field Theory/Standard Model",
    breadcrumb: "Natural Sciences · Physics",
    category: "natural",
    kind: "model",
    thumbnail: "/StandardModel.webp",
    imageSource: "openai",
  },
  {
    slug: "laws-of-thermodynamics",
    title: "Laws of Thermodynamics",
    summary:
      "Four laws governing energy, heat, and entropy — they set the hard limits on every engine, refrigerator, and living cell, and point time in one direction.",
    systemPath: "Human Knowledge/Natural Sciences/Physics/Thermodynamics",
    breadcrumb: "Natural Sciences · Physics",
    category: "natural",
    kind: "law",
    thumbnail: "/LawsOfThermodynamics.webp",
    imageSource: "first-party",
  },
  {
    slug: "maxwells-equations",
    title: "Maxwell's Equations",
    summary:
      "Four equations that unified electricity, magnetism, and light into a single theory — and predicted electromagnetic waves before anyone had made one.",
    systemPath:
      "Human Knowledge/Natural Sciences/Physics/Electromagnetism/Maxwell's Equations",
    breadcrumb: "Natural Sciences · Physics",
    category: "natural",
    kind: "law",
    thumbnail: "/MaxwellsEquations.webp",
    imageSource: "first-party",
  },
  {
    slug: "special-relativity",
    title: "Special Relativity",
    summary:
      "Einstein's 1905 theory: the speed of light is the same for everyone, so space and time themselves stretch and bend to keep it that way.",
    systemPath:
      "Human Knowledge/Natural Sciences/Physics/Relativity/Special Relativity",
    breadcrumb: "Natural Sciences · Physics",
    category: "natural",
    kind: "theory",
    thumbnail: "/SpecialRelativity.webp",
    imageSource: "first-party",
  },
  {
    slug: "general-relativity",
    title: "General Relativity",
    summary:
      "Einstein's theory of gravity — not a force pulling on things, but the geometry of spacetime curved by mass and energy.",
    systemPath:
      "Human Knowledge/Natural Sciences/Physics/Relativity/General Relativity",
    breadcrumb: "Natural Sciences · Physics",
    category: "natural",
    kind: "theory",
    thumbnail: "/GeneralRelativity.webp",
    imageSource: "openai",
  },
  {
    slug: "big-bang-theory",
    title: "Big Bang Theory",
    summary:
      "The universe began in a hot, dense state ~13.8 billion years ago and has been expanding and cooling ever since — with the fossil light and element ratios to prove it.",
    systemPath:
      "Human Knowledge/Natural Sciences/Physics/Astrophysics & Cosmology/Big Bang Theory",
    breadcrumb: "Natural Sciences · Astrophysics & Cosmology",
    category: "natural",
    kind: "theory",
    thumbnail: "/BigBangTheory.webp",
    imageSource: "openai",
  },
  {
    slug: "standard-model-of-cosmology",
    title: "Standard Model of Cosmology (ΛCDM)",
    summary:
      "The reigning model of the universe: a Big Bang followed by expansion driven by dark energy (Λ) and structured by cold dark matter — fit to the data with just six numbers.",
    systemPath:
      "Human Knowledge/Natural Sciences/Physics/Astrophysics & Cosmology/Standard Model of Cosmology (ΛCDM)",
    breadcrumb: "Natural Sciences · Astrophysics & Cosmology",
    category: "natural",
    kind: "model",
    thumbnail: "/StandardModelCosmology.webp",
    imageSource: "first-party",
  },
  {
    slug: "atomic-theory",
    title: "Atomic Theory",
    summary:
      "The idea that matter is made of discrete atoms — and the two centuries of experiments that turned a philosophical guess into modern chemistry.",
    systemPath: "Human Knowledge/Natural Sciences/Chemistry/Atomic Theory",
    breadcrumb: "Natural Sciences · Chemistry",
    category: "natural",
    kind: "theory",
    thumbnail: "/AtomicTheory.webp",
    imageSource: "openai",
  },
  {
    slug: "bohr-model",
    title: "Bohr Model of the Atom",
    summary:
      "Electrons orbit the nucleus only in fixed energy levels, jumping between them by emitting or absorbing light — the model that explained atomic spectra and seeded quantum theory.",
    systemPath:
      "Human Knowledge/Natural Sciences/Chemistry/Atomic Theory/Bohr Model of the Atom",
    breadcrumb: "Natural Sciences · Chemistry",
    category: "natural",
    kind: "model",
    thumbnail: "/BohrModel.webp",
    imageSource: "first-party",
  },
  {
    slug: "law-of-conservation-of-mass",
    title: "Law of Conservation of Mass",
    summary:
      "Matter is neither created nor destroyed in a chemical reaction — the insight that turned alchemy into quantitative chemistry.",
    systemPath:
      "Human Knowledge/Natural Sciences/Chemistry/Law of Conservation of Mass",
    breadcrumb: "Natural Sciences · Chemistry",
    category: "natural",
    kind: "law",
    thumbnail: "/ConservationOfMass.webp",
    imageSource: "first-party",
  },
  {
    slug: "periodic-law",
    title: "Periodic Law",
    summary:
      "Arrange the elements by atomic number and their properties repeat in regular cycles — the principle behind the periodic table and the predictive power of modern chemistry.",
    systemPath: "Human Knowledge/Natural Sciences/Chemistry/Periodic Law",
    breadcrumb: "Natural Sciences · Chemistry",
    category: "natural",
    kind: "law",
    thumbnail: "/PeriodicLaw.webp",
    imageSource: "first-party",
    interactive: "periodic-table",
  },
  {
    slug: "dna-double-helix",
    title: "DNA Double Helix",
    summary:
      "Two strands twisted around each other, paired by complementary bases — the 1953 structural model that revealed how life stores and copies its information.",
    systemPath:
      "Human Knowledge/Natural Sciences/Biology/Molecular Biology/DNA Double Helix",
    breadcrumb: "Natural Sciences · Biology",
    category: "natural",
    kind: "model",
    thumbnail: "/DNADoubleHelix.webp",
    imageSource: "first-party",
  },
  {
    slug: "cell-theory",
    title: "Cell Theory",
    summary:
      "All living things are made of cells, cells are the basic unit of life, and every cell comes from a pre-existing cell — the organizing principle of biology.",
    systemPath:
      "Human Knowledge/Natural Sciences/Biology/Cell Biology/Cell Theory",
    breadcrumb: "Natural Sciences · Biology",
    category: "natural",
    kind: "theory",
    thumbnail: "/CellTheory.webp",
    imageSource: "first-party",
  },
  {
    slug: "laws-of-inheritance",
    title: "Laws of Inheritance",
    summary:
      "Mendel's three rules of heredity — discovered in a monastery pea garden, ignored for 35 years, then made the foundation of genetics.",
    systemPath:
      "Human Knowledge/Natural Sciences/Biology/Genetics & Genomics/Laws of Inheritance (Mendelian Genetics)",
    breadcrumb: "Natural Sciences · Biology",
    category: "natural",
    kind: "law",
    thumbnail: "/LawsOfInheritance.webp",
    imageSource: "first-party",
  },
  {
    slug: "theory-of-evolution",
    title: "Theory of Evolution",
    summary:
      "How heritable variation plus differential survival produces, over deep time, the complexity and diversity of all living things.",
    systemPath:
      "Human Knowledge/Natural Sciences/Biology/Evolutionary Biology/Theory of Evolution",
    breadcrumb: "Natural Sciences · Biology",
    category: "natural",
    kind: "theory",
    thumbnail: "/TheoryOfEvolution.webp",
    imageSource: "openai",
  },
  {
    slug: "biological-modularity",
    title: "Biological Modularity",
    summary:
      "The idea that organisms, genomes, and development are built from semi-independent units that can vary and evolve without breaking the whole — a central concept in evo-devo.",
    systemPath:
      "Human Knowledge/Natural Sciences/Biology/Evolutionary Biology/Biological Modularity",
    breadcrumb: "Natural Sciences · Biology",
    category: "natural",
    kind: "modularity",
    thumbnail: "/BiologicalModularity.webp",
    imageSource: "openai",
  },
  {
    slug: "ecosystems",
    title: "Ecosystems",
    summary:
      "A community of living things plus their physical environment, linked by flows of energy and cycles of matter — the fundamental unit of ecology.",
    systemPath: "Human Knowledge/Natural Sciences/Biology/Ecology/Ecosystems",
    breadcrumb: "Natural Sciences · Biology",
    category: "natural",
    kind: "system",
    thumbnail: "/Ecosystems.webp",
    imageSource: "first-party",
  },
  {
    slug: "germ-theory-of-disease",
    title: "Germ Theory of Disease",
    summary:
      "Many diseases are caused by microscopic organisms — the theory that overturned centuries of 'bad air' and created modern medicine.",
    systemPath:
      "Human Knowledge/Natural Sciences/Biology/Microbiology/Germ Theory of Disease",
    breadcrumb: "Natural Sciences · Biology",
    category: "natural",
    kind: "theory",
    thumbnail: "/GermTheory.webp",
    imageSource: "first-party",
  },
  {
    slug: "nervous-system",
    title: "Nervous System",
    summary:
      "The body's communication network — billions of neurons signaling electrically and chemically to sense, decide, and act in milliseconds.",
    systemPath:
      "Human Knowledge/Natural Sciences/Biology/Neuroscience/Nervous System",
    breadcrumb: "Natural Sciences · Biology",
    category: "natural",
    kind: "system",
    thumbnail: "/NervousSystem.webp",
    imageSource: "first-party",
  },
  {
    slug: "plate-tectonics",
    title: "Plate Tectonics",
    summary:
      "Earth's outer shell is broken into rigid plates drifting on a ductile mantle — the unifying theory of how continents, oceans, mountains, and earthquakes all fit together.",
    systemPath:
      "Human Knowledge/Natural Sciences/Earth Sciences/Geology/Plate Tectonics",
    breadcrumb: "Natural Sciences · Earth Sciences",
    category: "natural",
    kind: "theory",
    thumbnail: "/PlateTectonics.webp",
    imageSource: "openai",
  },
  {
    slug: "solar-system",
    title: "Solar System",
    summary:
      "The Sun and everything gravitationally bound to it — eight planets, moons, asteroids, and comets — formed from one collapsing cloud 4.6 billion years ago.",
    systemPath:
      "Human Knowledge/Natural Sciences/Astronomy/Planetary Science/Solar System",
    breadcrumb: "Natural Sciences · Astronomy",
    category: "natural",
    kind: "system",
    thumbnail: "/SolarSystem.webp",
    imageSource: "first-party",
  },
  {
    slug: "obsidian-zettelkasten",
    title: "Obsidian Vaults & Zettelkasten",
    summary:
      "A folder of plain Markdown files, linked by `[[wikilinks]]`, treated as a personal knowledge graph — the modern incarnation of Niklas Luhmann's index-card method.",
    systemPath:
      "Human Knowledge/Applied Sciences & Technology/Information Science & Library Science/Document & File Formats as Data Structures/Office & Document Databases/Obsidian Vaults & Zettelkasten",
    breadcrumb: "Applied Sciences · Information Science",
    category: "applied",
    kind: "system",
    thumbnail: "/ObsidianVaults.webp",
    imageSource: "openai",
  },
  {
    slug: "cognitive-theory",
    title: "Cognitive Theory",
    summary:
      "The framework that treats the mind as an information-processing system — thoughts, memory, attention, and learning studied as computation rather than behavior.",
    systemPath:
      "Human Knowledge/Social Sciences/Psychology/Cognitive Psychology/Cognitive Theory",
    breadcrumb: "Social Sciences · Psychology",
    category: "social",
    kind: "theory",
    thumbnail: "/CognitiveTheory.webp",
    imageSource: "openai",
  },
  {
    slug: "modularity-of-mind",
    title: "Modularity of Mind",
    summary:
      "Jerry Fodor's thesis that much of the mind is built from specialized, domain-specific processors — fast, automatic, encapsulated, and innate — rather than one general-purpose reasoning engine.",
    systemPath:
      "Human Knowledge/Professions & Interdisciplinary/Cognitive Science/Philosophy of Mind/Modularity of Mind",
    breadcrumb: "Professions & Interdisciplinary · Cognitive Science",
    category: "professions",
    kind: "modularity",
    thumbnail: "/ModularityOfMind.webp",
    imageSource: "openai",
  },
];

export function findKnowledgeGalleryEntry(
  slug: string
): KnowledgeGalleryEntry | undefined {
  return KNOWLEDGE_GALLERY_ENTRIES.find((e) => e.slug === slug);
}

/**
 * Lookup by systemPath — used by the System tree to badge nodes that
 * have a matching Knowledge Gallery entry. O(1) per row.
 */
export const KNOWLEDGE_GALLERY_BY_SYSTEM_PATH: Record<
  string,
  KnowledgeGalleryEntry
> = Object.freeze(
  Object.fromEntries(KNOWLEDGE_GALLERY_ENTRIES.map((e) => [e.systemPath, e]))
);
