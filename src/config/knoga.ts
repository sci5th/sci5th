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
  {
    slug: "set-theory",
    title: "Set Theory",
    summary:
      "The mathematics of collections — the language and foundation on which almost all modern mathematics is built.",
    systemPath:
      "Human Knowledge/Formal Sciences/Mathematics/Pure Mathematics/Logic & Foundations/Set Theory",
    breadcrumb: "Formal Sciences · Logic & Foundations",
    category: "formal",
    thumbnail: null,
    steps: [
      {
        title: "1 · What a set is",
        body: "A set is just a collection of distinct objects. Order doesn't matter, and no element appears more than once. You can describe a set by listing its elements ({1, 2, 3}) or by stating a property ({x : x is an even integer}). The objects themselves can be anything — numbers, symbols, even other sets. From this single, almost-too-simple idea, most of modern mathematics is built.",
      },
      {
        title: "2 · The basic operations",
        body: "Given two sets A and B, you can form: the union (A ∪ B — everything in either), the intersection (A ∩ B — everything in both), the difference (A \\ B — in A but not B), the complement (everything not in A, relative to some universe), and the Cartesian product (A × B — all ordered pairs). These five operations, together with the notion of subset (A ⊆ B), are enough to express surprisingly deep mathematics.",
      },
      {
        title: "3 · Infinite sets and sizes of infinity",
        body: "Two sets have the same 'size' (cardinality) if you can pair up their elements one-to-one. Cantor's astonishing 1874 result: there are different sizes of infinity. The natural numbers ℕ are 'countably infinite' (ℵ₀). The real numbers ℝ are strictly larger — there's no one-to-one pairing, proved by the famous diagonal argument. So infinity comes in a hierarchy of sizes, and that hierarchy has mathematical structure of its own.",
      },
      {
        title: "4 · Russell's paradox and the need for axioms",
        body: "Naive set theory (any property defines a set) collapses under Russell's paradox (1901): consider the set R of all sets that don't contain themselves. Does R contain itself? Either answer leads to contradiction. The fix: restrict what counts as a set via axioms. The most widely used system is Zermelo-Fraenkel set theory with the Axiom of Choice (ZFC), nine axioms that together carefully avoid self-reference paradoxes while still letting you build everything mathematicians need.",
      },
      {
        title: "5 · Why it's the foundation of mathematics",
        body: "Inside ZFC you can build: the natural numbers (0 = ∅, 1 = {∅}, 2 = {∅, {∅}}, …), integers, rationals, real numbers, functions (as sets of ordered pairs), relations, and every structure in analysis, algebra, and topology. Any mathematical statement can, in principle, be translated into pure set-theoretic notation. It's not that mathematicians *use* set theory every day — most don't — but knowing that everything *could* be reduced to it gives the rest of math a common floor.",
      },
      {
        title: "6 · The limits (Gödel and independence)",
        body: "Gödel's incompleteness theorems (1931) showed that any axiom system strong enough to describe arithmetic must contain true statements it cannot prove. For ZFC specifically, some natural questions — like the Continuum Hypothesis (is there a size of infinity strictly between ℕ and ℝ?) — are independent: neither provable nor disprovable from the axioms. Set theory gave mathematics a foundation, and then showed that foundation has permanent, irreducible gaps.",
      },
    ],
  },
  {
    slug: "cognitive-theory",
    title: "Cognitive Theory",
    summary:
      "The framework that treats the mind as an information-processing system — thoughts, memory, attention, and learning studied as computation rather than behavior.",
    systemPath:
      "Human Knowledge/Social Sciences/Psychology/Cognitive Psychology",
    breadcrumb: "Social Sciences · Psychology",
    category: "social",
    thumbnail: null,
    steps: [
      {
        title: "1 · The shift from behaviorism",
        body: "For the first half of the 20th century, psychology in the English-speaking world was dominated by behaviorism: only observable behavior counts as scientific data; the mind is a 'black box' we don't talk about. The cognitive revolution of the 1950s–60s pushed back, arguing that internal mental processes — perception, memory, attention, reasoning, language — are not only real but measurable. The mind is a system that takes in information, processes it, and produces behavior.",
      },
      {
        title: "2 · The core analogy: mind as computer",
        body: "The computer was the defining metaphor. Inputs (sensory data) are encoded, stored in memory, manipulated by rules, and produce outputs (actions, speech, decisions). Ulric Neisser's 1967 book Cognitive Psychology made this explicit, and the parallel with information theory (Shannon, 1948) and early AI (Newell, Simon, McCarthy) was deliberate. The analogy isn't that brains are literally computers — it's that mental processes can be modeled as computation over representations.",
      },
      {
        title: "3 · Memory — short-term, long-term, working",
        body: "Atkinson and Shiffrin's 1968 modal model split memory into three stores: sensory (milliseconds), short-term (seconds, ~7 items — Miller's famous 'magical number seven'), and long-term (unbounded). Baddeley and Hitch refined 'short-term' into 'working memory' — an active workspace with specialized subsystems (phonological loop for sound, visuospatial sketchpad for images, a central executive coordinating them). Working memory capacity predicts performance on virtually every higher-order cognitive task.",
      },
      {
        title: "4 · Attention as a limited resource",
        body: "You cannot process everything at once. Attention is the mechanism that selects what to engage with. Broadbent's filter theory (1958) proposed an early bottleneck; later work showed attention is more flexible — sometimes filtering early, sometimes late. Two major modes: selective attention (focusing on one stream among many, the 'cocktail party effect') and divided attention (splitting across tasks, usually with cost). Attention is finite, effortful, and leaks badly under load.",
      },
      {
        title: "5 · Schemas and reconstructive memory",
        body: "Memory isn't a recording — it's a reconstruction. Bartlett (1932) showed people distort stories toward culturally familiar patterns over retelling. Schemas (organized mental frameworks) shape what we notice, encode, and recall. Loftus's misinformation research demonstrated that memories are editable after the fact. This has deep consequences: eyewitness testimony is much less reliable than jurors assume, and learning works best when new information hooks into existing schemas.",
      },
      {
        title: "6 · Modern extensions",
        body: "Cognitive theory never stood still. It absorbed neuroimaging (cognitive neuroscience — tying specific processes to brain regions), probabilistic models (the Bayesian brain — perception and learning as statistical inference under uncertainty), embodied cognition (the mind is shaped by the body and its interaction with the world), and predictive processing (the brain as a prediction machine that updates from error). The 1960s framework is still recognizable, but its toolkit has expanded enormously.",
      },
      {
        title: "7 · Applications that reshaped the world",
        body: "Cognitive theory underwrites cognitive behavioral therapy (the most empirically supported psychotherapy — change thoughts, change emotions), human-computer interaction (designing interfaces that respect attention and working-memory limits), evidence-based education (spaced repetition, retrieval practice, dual coding), usability testing, and large parts of modern AI (the representation/computation framing came straight out of this era). It's one of the most practically consequential theoretical shifts in 20th-century science.",
      },
    ],
  },
  {
    slug: "quantum-mechanics",
    title: "Quantum Mechanics",
    summary:
      "The physics of the very small — where particles behave as waves, measurement changes what's measured, and classical intuitions break down.",
    systemPath: "Human Knowledge/Natural Sciences/Physics/Quantum Mechanics",
    breadcrumb: "Natural Sciences · Physics",
    category: "natural",
    thumbnail: null,
    steps: [
      {
        title: "1 · Why classical physics failed",
        body: "By 1900, classical physics — Newtonian mechanics plus Maxwell's electromagnetism — had explained almost everything. Then a handful of experiments refused to cooperate: blackbody radiation produced nonsensical infinities (the ultraviolet catastrophe), the photoelectric effect worked as if light came in discrete chunks, and atomic spectra showed sharp lines instead of continuous smears. Quantum mechanics grew out of patching these holes, one by one, starting with Planck's 1900 guess that energy comes in packets (quanta).",
      },
      {
        title: "2 · Wave-particle duality",
        body: "Einstein (1905) showed light behaves as particles (photons) in the photoelectric effect. De Broglie (1924) flipped the idea: matter behaves as waves. Experiment confirmed it — electrons diffract like waves in the double-slit experiment. A quantum object isn't sometimes-particle and sometimes-wave; it is something with wave-like and particle-like properties simultaneously, and which property you see depends on what you measure. This dissolves the classical particle/wave distinction.",
      },
      {
        title: "3 · The wavefunction and superposition",
        body: "The central object in quantum mechanics is the wavefunction ψ — a complex-valued function encoding everything knowable about a system. ψ evolves in time according to the Schrödinger equation, a linear PDE. Linearity means solutions add: if ψ₁ and ψ₂ are valid states, so is aψ₁ + bψ₂. That's superposition — a quantum system can be in a weighted combination of classically-incompatible states (Schrödinger's cat alive and dead, an electron spinning up and down). The wavefunction is not the system; it encodes the probabilities of what you'll see if you measure.",
      },
      {
        title: "4 · Measurement and the Born rule",
        body: "When you measure, you don't see a superposition — you see one outcome. The Born rule (1926) says the probability of each outcome is |ψ|² for that outcome's coefficient. After the measurement, the wavefunction 'collapses' into the state corresponding to what you saw. Exactly what collapse *is* — whether it's a physical process, a bookkeeping update, or a sign the theory is incomplete — is the measurement problem, and it drives the main interpretational disputes in QM.",
      },
      {
        title: "5 · The uncertainty principle",
        body: "Heisenberg (1927) proved that certain pairs of properties — position and momentum, energy and time — cannot both be known precisely at once. The more sharply you pin down one, the fuzzier the other. This isn't a limitation of your instruments; it's a mathematical consequence of the wave picture. A wavefunction localized in space (definite position) must be made of many wavelengths (indefinite momentum), and vice versa. The universe has built-in fuzziness at small scales.",
      },
      {
        title: "6 · Entanglement",
        body: "Combine two quantum systems and you can prepare a joint state that is not the product of individual states — the parts have no separate existence. Measure one particle and the other's state instantly reflects the result, no matter how far away. Einstein called this 'spooky action at a distance' and thought it showed QM was incomplete. Bell's theorem (1964) made the disagreement testable; experiments from 1972 to 2015 confirmed QM's predictions and ruled out any theory where distant correlations come from hidden local variables. Entanglement is real, and it's the resource behind quantum computing and quantum cryptography.",
      },
      {
        title: "7 · Interpretations — what does it all mean?",
        body: "QM's math is extraordinarily well-tested, but what it tells us about reality is still debated. The Copenhagen interpretation treats the wavefunction as knowledge, collapse as measurement updating. Many-worlds (Everett) denies collapse entirely — every outcome happens in a branching multiverse. Bohmian mechanics restores hidden deterministic trajectories. Decoherence explains why classical behavior emerges for large systems without choosing sides. These are empirically indistinguishable today; the disagreement is philosophical, not scientific — but it may become testable as quantum experiments scale up.",
      },
      {
        title: "8 · Where QM shows up",
        body: "Lasers, transistors (and therefore every computer), LEDs, MRI machines, atomic clocks (and therefore GPS), nuclear reactors, solar cells, electron microscopes, chemistry itself (bonding is a quantum phenomenon), superconductors, and quantum computing. Roughly 30% of GDP in developed economies depends on technology whose design requires quantum mechanics. The theory that started as a fix for blackbody radiation became the operating system of modern technology.",
      },
    ],
  },
  {
    slug: "atomic-theory",
    title: "Atomic Theory",
    summary:
      "The idea that matter is made of discrete atoms — and the two centuries of experiments that turned a philosophical guess into modern chemistry.",
    systemPath: "Human Knowledge/Natural Sciences/Chemistry/Atomic Theory",
    breadcrumb: "Natural Sciences · Chemistry",
    category: "natural",
    thumbnail: null,
    steps: [
      {
        title: "1 · The ancient guess",
        body: "Around 400 BCE, the Greek philosopher Democritus argued that matter, cut finely enough, must eventually reach an indivisible unit — atomos, 'uncuttable.' It was a pure thought experiment with no evidence, and for most of the next 2,000 years it remained a minority view. Aristotle's rival idea — that matter is continuous and composed of four elements (earth, water, air, fire) — dominated instead. Atomism stayed speculative until chemistry gave it something to explain.",
      },
      {
        title: "2 · Dalton turns it into a theory (1803)",
        body: "John Dalton, a schoolteacher doing careful chemistry, noticed that elements combine in fixed, simple whole-number ratios by weight. Hydrogen and oxygen always make water in a ratio of ~1:8; if you swap in more hydrogen, you get unreacted hydrogen left over. Dalton proposed: each element is made of atoms, all atoms of a given element are identical (same mass), and compounds form when atoms of different elements combine in whole-number ratios. This was the first version of atomic theory as quantitative chemistry — testable, not philosophical.",
      },
      {
        title: "3 · Atoms aren't indivisible (Thomson, 1897)",
        body: "J.J. Thomson studied cathode rays — streams of particles emitted by charged electrodes — and showed they were negatively charged particles far lighter than the lightest atom (hydrogen). He'd discovered the electron, and it existed *inside* atoms. The atom, supposedly indivisible, had parts. Thomson proposed the 'plum pudding' model: electrons embedded in a positively-charged uniform cloud. Democritus's name was now misleading, but the word stuck.",
      },
      {
        title: "4 · Rutherford finds the nucleus (1911)",
        body: "Ernest Rutherford fired alpha particles at a thin gold foil. Plum pudding predicted they'd pass through with minor deflections. Instead, a tiny fraction bounced nearly straight back. 'As if you had fired a fifteen-inch shell at a piece of tissue paper and it came back and hit you.' The only explanation: almost all the atom's mass and all its positive charge are concentrated in a tiny dense core — the nucleus — with electrons orbiting far out in mostly empty space. The atom was suddenly mostly nothing.",
      },
      {
        title: "5 · Bohr quantizes the orbits (1913)",
        body: "Rutherford's orbiting electrons should, by classical physics, radiate energy and spiral into the nucleus in a fraction of a second. Atoms clearly don't do this. Niels Bohr proposed electrons can only occupy specific, discrete orbits (quantized energy levels) and jump between them by emitting or absorbing photons of exact energy. The Bohr model explained the sharp spectral lines of hydrogen with stunning precision. It was wrong in detail (more complex atoms needed more machinery) but right in spirit: atomic structure is quantized.",
      },
      {
        title: "6 · Quantum mechanics takes over (1925–30)",
        body: "Schrödinger and Heisenberg replaced Bohr's orbits with wavefunctions — probability clouds (orbitals) describing where electrons are likely to be found. The modern picture: a nucleus of protons and neutrons, surrounded by electrons in orbitals whose shapes (s, p, d, f) determine chemical bonding. This is where atomic theory becomes atomic physics, and where 'chemistry' and 'quantum mechanics' merge into a single story of matter.",
      },
      {
        title: "7 · Inside the nucleus",
        body: "Protons and neutrons aren't fundamental either — they're made of quarks held together by the strong force. The Standard Model of particle physics is the modern heir to atomic theory at the deepest level: 17 fundamental particles, four forces (three in the Standard Model plus gravity), and a zoo of composite objects built from them. What Democritus called 'uncuttable' has been cut many times over, but the project — asking what matter is made of, and checking — is continuous from him to LHC physicists today.",
      },
      {
        title: "8 · Why the theory mattered",
        body: "Atomic theory underwrites the entire periodic table, all of chemistry, most of materials science, nuclear energy (and weapons), medical imaging, radiocarbon dating, and our ability to design drugs, alloys, semiconductors, and fertilizers from first principles. It is also arguably the clearest example in science of a speculative idea surviving, growing in precision, and eventually becoming the bedrock framework of multiple disciplines.",
      },
    ],
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
    thumbnail: "/GeneralRelativity.webp",
    steps: [
      {
        title: "1 · From special to general",
        body: "Special relativity (1905) handled observers moving at constant velocity and uncovered that space and time are a single four-dimensional fabric — spacetime. But it ignored gravity and accelerated frames. Einstein spent the next decade trying to extend the principle of relativity to those cases. The result, published in 1915, was general relativity: a theory of gravitation built on the insight that acceleration and gravity are locally indistinguishable.",
      },
      {
        title: "2 · The equivalence principle",
        body: "Stand in a sealed elevator. If it's accelerating upward at 9.8 m/s², you feel 'gravity' pulling you down. If it's sitting on Earth's surface, you feel the same thing. No experiment inside the elevator can tell the two situations apart. Einstein elevated this observation (which he called 'the happiest thought of my life') to a principle: gravitational and inertial mass are exactly the same thing, and free-fall is the natural state of motion. Gravity is not a force — it's what you feel when something prevents you from following spacetime's natural paths.",
      },
      {
        title: "3 · Spacetime as a curved manifold",
        body: "If free-fall is natural motion, what determines its trajectory? Einstein's answer: the geometry of spacetime itself. Mass and energy curve the four-dimensional manifold of spacetime; free-falling objects follow the straightest possible paths (geodesics) through that curved geometry. A planet orbits the Sun not because it's pulled, but because the Sun's mass warps the spacetime around it, and the planet is moving in a spacetime 'straight line' that happens to loop. The math is differential geometry — specifically, Riemannian geometry extended to the Lorentzian signature of spacetime.",
      },
      {
        title: "4 · The field equations",
        body: "The central equation — Einstein's field equation — says: Gμν + Λgμν = 8πG/c⁴ · Tμν. The left side encodes the curvature of spacetime; the right side encodes the distribution of matter and energy. John Wheeler's summary: 'spacetime tells matter how to move; matter tells spacetime how to curve.' It's ten coupled non-linear partial differential equations, and solving them in realistic cases is genuinely hard — exact solutions (Schwarzschild, Kerr, FLRW) are rare and celebrated.",
      },
      {
        title: "5 · The classic predictions",
        body: "Gravitational time dilation: clocks run slower deeper in a gravitational well (GPS satellites must correct for this or they'd be useless). Light bending: starlight curving around the Sun, confirmed in the 1919 eclipse that made Einstein famous. Perihelion precession of Mercury: a 43-arcsecond-per-century residual that Newtonian gravity couldn't explain, resolved exactly by GR. Gravitational redshift: light climbing out of a gravity well shifts to lower frequencies, measured in the lab by the Pound–Rebka experiment.",
      },
      {
        title: "6 · Black holes and gravitational waves",
        body: "GR predicts that enough mass in a small enough region produces a region of spacetime from which nothing — not even light — can escape: a black hole. First confirmed indirectly (Cygnus X-1, 1970s), then imaged directly by the Event Horizon Telescope (M87* in 2019, Sagittarius A* in 2022). GR also predicts that accelerating masses radiate ripples in spacetime itself — gravitational waves. LIGO detected the first direct signal from merging black holes in 2015, a century after the prediction. Both were among the most spectacular experimental confirmations of any physical theory.",
      },
      {
        title: "7 · Cosmology and the open questions",
        body: "Applied to the universe as a whole, GR gives the FLRW metric, which predicts an expanding (or contracting) universe — Friedmann derived this from Einstein's equations before Hubble measured expansion in 1929. Modern cosmology — Big Bang, inflation, dark matter, dark energy, the age and fate of the universe — is all built in GR's language. But GR and quantum mechanics don't yet fit together: at singularities (the Big Bang, black hole centers) the theory breaks down. Finding a quantum theory of gravity (string theory, loop quantum gravity, others) is arguably the biggest open problem in fundamental physics.",
      },
    ],
  },
  {
    slug: "theory-of-evolution",
    title: "Theory of Evolution",
    summary:
      "How heritable variation plus differential survival produces, over deep time, the complexity and diversity of all living things.",
    systemPath:
      "Human Knowledge/Natural Sciences/Biology/Evolutionary Biology",
    breadcrumb: "Natural Sciences · Biology",
    category: "natural",
    thumbnail: null,
    steps: [
      {
        title: "1 · The problem Darwin was trying to solve",
        body: "By the early 19th century, naturalists had catalogued enough species, fossils, and geographic patterns to make a creation-by-species explanation hard to sustain. Species clearly varied by region, extinct forms differed from living ones, and embryos of very different animals looked oddly similar. Lamarck proposed inheritance of acquired traits (a giraffe stretches its neck, its offspring inherit the longer neck) — an answer that was wrong in mechanism but correct in spirit: species change over time.",
      },
      {
        title: "2 · The Darwin–Wallace insight (1858–59)",
        body: "Charles Darwin and Alfred Russel Wallace independently arrived at the same mechanism: natural selection. The argument is almost syllogistic. 1) Organisms produce more offspring than can survive. 2) Individuals vary, and some variation is heritable. 3) Variants that happen to survive and reproduce better pass their traits on disproportionately. Over generations, the population shifts. Given deep time and isolation, shifts accumulate into new species. Darwin's 1859 On the Origin of Species laid out the evidence: fossils, biogeography, comparative anatomy, embryology, artificial selection (pigeons, dogs, crops).",
      },
      {
        title: "3 · What Darwin was missing: inheritance",
        body: "Darwin had no mechanism for how traits are passed on. Gregor Mendel's pea experiments (1866) showed traits are inherited as discrete units (what we now call genes), but his work was ignored until rediscovered around 1900. Early geneticists initially thought Mendelism contradicted Darwinism — it took until the 1930s–40s to work out that discrete inheritance and gradual selection are fully compatible. The resulting Modern Synthesis (Fisher, Haldane, Wright, Dobzhansky, Mayr) remains the backbone of evolutionary theory.",
      },
      {
        title: "4 · Mutation, drift, selection, flow",
        body: "Four forces change allele frequencies in a population. Mutation creates new variants (rare but relentless — every human is born with ~60 new mutations). Natural selection biases which variants propagate. Genetic drift is random change from sampling noise, dominant in small populations. Gene flow is migration between populations, which homogenizes them. Evolution is whatever changes these four forces produce in combination. Selection is the only force that systematically builds adaptation; the others produce change without necessarily producing fit.",
      },
      {
        title: "5 · DNA and the molecular view (1953 onward)",
        body: "Watson and Crick's double helix turned inheritance from an abstract bookkeeping problem into a chemical one. Mutations are changes in DNA sequence; natural selection acts on phenotypes, but those phenotypes are built from genotypes; speciation involves reproductive isolation of gene pools. Molecular clocks (the roughly-constant rate of neutral mutation) let us time evolutionary splits from sequence data alone. Modern phylogenomics can reconstruct the tree of life — including extinct branches — from sequence comparisons. Darwin guessed there was a tree; genomics draws it.",
      },
      {
        title: "6 · What the theory explains",
        body: "The fit between organisms and environments (adaptation). The nested similarity of species (common descent — why bats, whales, and humans have the same forelimb bones). The fossil record (forms appear in time in orders consistent with descent). Biogeography (why Australian mammals are mostly marsupial — isolation). Vestigial structures, atavisms, developmental oddities (the recurrent laryngeal nerve's absurd detour in giraffes). Antibiotic resistance (evolution observed in real time, in hospitals). Artificial selection producing everything from teosinte into corn to wolves into Chihuahuas. It is not one explanation among many — it is the unifying framework of all biology.",
      },
      {
        title: "7 · Modern extensions and frontiers",
        body: "Evolutionary developmental biology ('evo-devo') shows how small changes in regulatory genes produce large morphological shifts. Neutral theory (Kimura) emphasizes that most molecular variation is selectively invisible. Kin selection and inclusive fitness (Hamilton) explain altruism in social species. Niche construction notices that organisms modify their own selection environments (beavers, humans). Horizontal gene transfer complicates the tree of life for microbes. Cultural evolution applies selection-like dynamics to ideas and behaviors. The theory keeps growing — but the Darwinian core (variation plus differential reproduction) remains intact after 165 years of scrutiny.",
      },
    ],
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
    thumbnail: null,
    steps: [
      {
        title: "1 · The suspicious puzzle of the continents",
        body: "Look at a world map and the eastern bulge of South America fits neatly into the western curve of Africa, like torn pieces of paper. This was noticed almost as soon as accurate maps existed (Francis Bacon, 1620). By the early 20th century, similar rock formations, fossils, and mountain ranges had been found on matching coasts across the Atlantic. The pattern begged for an explanation — but 'continents moving' sounded absurd, because they obviously sit on solid rock.",
      },
      {
        title: "2 · Wegener and continental drift (1912)",
        body: "Alfred Wegener, a German meteorologist, proposed that all continents had once been joined in a supercontinent he called Pangaea, which later broke apart. He assembled an impressive evidence dossier: fit of coasts, identical fossils (Mesosaurus on both sides of the Atlantic), matching rock ages, ancient climate patterns (glacial scars in tropical Africa, coal in Antarctica). But he couldn't explain *how* continents moved. Geophysicists calculated that the forces he proposed couldn't plow continents through solid oceanic crust. For 50 years the theory was mostly rejected.",
      },
      {
        title: "3 · The ocean floor reveals itself (1950s–60s)",
        body: "World War II left a legacy of sonar, magnetometers, and oceanographers with ships. Mid-ocean ridges (a 65,000 km submerged mountain chain) were mapped. Heat flow out of ridges was unexpectedly high. Harry Hess proposed (1962) that ocean floor is being created at ridges and destroyed at trenches — 'seafloor spreading.' Then came the magnetic smoking gun: Vine, Matthews, and Morley (1963) showed that rocks on either side of a mid-ocean ridge record Earth's magnetic field reversals in symmetric striped patterns, exactly what you'd expect if new crust were forming and spreading outward.",
      },
      {
        title: "4 · The synthesis: plate tectonics (1967–68)",
        body: "Jason Morgan, Dan McKenzie, Robert Parker, and Xavier Le Pichon pulled it together. Earth's rigid outer layer (lithosphere) is broken into about a dozen plates that float on a ductile layer below (asthenosphere). Plates move relative to each other at centimeters per year. Three kinds of boundaries: divergent (plates pulling apart, making new crust — mid-ocean ridges, East African Rift), convergent (plates colliding — subduction zones, mountain ranges like the Himalayas), and transform (plates sliding past each other — San Andreas Fault). This was continental drift with a mechanism at last.",
      },
      {
        title: "5 · What drives the plates",
        body: "Convection in the mantle, driven by Earth's internal heat (primordial, plus radioactive decay of uranium, thorium, and potassium). Hot material rises, cold material sinks. The primary forces on plates are 'slab pull' (subducting cold plates dragging the rest down with them — the dominant force for most plates) and 'ridge push' (gravitational sliding off the elevated ridges). Mantle plumes — narrow columns of hot material rising from deep in the mantle — produce hotspot volcanism like Hawaii, independent of plate boundaries.",
      },
      {
        title: "6 · What plate tectonics explains",
        body: "Why earthquakes and volcanoes cluster where they do (mostly along plate boundaries — the Ring of Fire outlines the Pacific Plate). Why mountain ranges run in long chains (continental collisions — India into Asia makes the Himalayas). How oceans open and close (the Wilson cycle — Atlantic currently opening, Pacific shrinking). Why the oldest ocean crust is only ~200 million years old (it's constantly being recycled, unlike continental crust which can be 4 billion years old). The global distribution of fossils, climate zones, and mineral deposits through geological time. It unified geology the way evolution unified biology.",
      },
      {
        title: "7 · Consequences beyond geology",
        body: "Evolutionary biology: continental breakup isolated populations and drove speciation (Australia's marsupials, Madagascar's lemurs). Climate: mountain-building weathers silicate rock, draws down atmospheric CO₂ over millions of years, regulating long-term climate. Habitability: plate tectonics recycles carbon and water between surface and interior — without it, Earth might be dead like Venus or Mars. Hazard mapping: knowing where plates grind predicts where earthquakes, tsunamis, and volcanoes will strike. The theory arrived late (settled only in the 1970s) and reshaped everything earth-scientists do.",
      },
    ],
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
    thumbnail: null,
    steps: [
      {
        title: "1 · A static universe (until it wasn't)",
        body: "Until the 1920s, nearly every physicist — Einstein included — assumed the universe was eternal and roughly static. Einstein added a 'cosmological constant' to his general relativity field equations specifically to allow a static solution, calling it later his 'greatest blunder.' Alexander Friedmann (1922) and Georges Lemaître (1927) independently derived solutions to Einstein's equations describing an expanding universe — but their math was initially dismissed as formal curiosity.",
      },
      {
        title: "2 · Hubble's measurement (1929)",
        body: "Edwin Hubble, using the 100-inch Mount Wilson telescope, measured the distances and spectra of dozens of galaxies. He found that nearly all of them are redshifted — their light stretched to longer wavelengths — and that the redshift is proportional to distance. The simplest interpretation: the universe is expanding. Everywhere, galaxies are receding from us (and from each other) at a rate proportional to their separation. This is Hubble's law, v = H₀d, where H₀ is now measured at ~70 km/s per megaparsec. Run the film backward and everything converges.",
      },
      {
        title: "3 · The 'primeval atom' idea",
        body: "Lemaître (1931) proposed that if the universe is expanding, it must have started from a dense initial state — a 'primeval atom' or 'cosmic egg.' The name 'Big Bang' was coined later, and derisively, by steady-state theorist Fred Hoyle in a 1949 BBC broadcast; it stuck. The core claim was modest: project the expansion backward and the observable universe was once hot, dense, and small. The theory doesn't say why it started, only what happens from there.",
      },
      {
        title: "4 · The cosmic microwave background (1965)",
        body: "Gamow, Alpher, and Herman predicted in the late 1940s that an early hot universe should have filled space with radiation. As the universe expanded and cooled, that radiation would stretch to microwave wavelengths — a faint bath of cold photons permeating all of space. Arno Penzias and Robert Wilson accidentally discovered it in 1965 while trying to eliminate noise in a radio antenna. The cosmic microwave background (CMB) fills the sky at 2.725 K, looks the same in every direction to one part in 100,000, and is the single most decisive evidence for the Big Bang. It's the light of the universe at age 380,000 years.",
      },
      {
        title: "5 · Primordial nucleosynthesis",
        body: "Work out the physics of a hot expanding plasma and you can predict how much of each light element the universe should have made in its first three minutes, when temperatures were right for fusion. Prediction: about 75% hydrogen, 25% helium by mass, with trace lithium and deuterium — before any stars ever lit up. Observation: exactly that, everywhere astronomers look. Heavier elements all come later, from stellar fusion and supernovae. Big Bang nucleosynthesis (BBN) is an independent test that the early universe was a hot, dense plasma, and it succeeds with stunning precision.",
      },
      {
        title: "6 · Inflation and the CMB anisotropies",
        body: "The basic Big Bang has two puzzles. Why is the universe so uniform across regions that were never in causal contact (the horizon problem)? Why is it so geometrically flat (the flatness problem)? Alan Guth (1980) proposed inflation: a tiny fraction of a second after t=0, the universe underwent a burst of exponential expansion, smoothing out irregularities and flattening geometry. Quantum fluctuations during inflation were stretched to macroscopic scales, seeding the tiny temperature variations in the CMB. Those variations — mapped by COBE, WMAP, and Planck — match inflation's predictions to within experimental error and now set most cosmological parameters.",
      },
      {
        title: "7 · The standard model of cosmology (ΛCDM)",
        body: "Modern cosmology converges on a six-parameter model called ΛCDM: the universe is ~13.8 billion years old, spatially flat, expanding, and made of ~5% ordinary matter, ~27% cold dark matter (something that gravitates but doesn't otherwise interact), and ~68% dark energy (represented by Einstein's resurrected cosmological constant Λ, driving accelerated expansion). This model fits the CMB, BBN, galaxy surveys, supernovae, and large-scale structure formation with remarkable consistency. It also leaves three enormous questions: what is dark matter, what is dark energy, and what (if anything) came before inflation.",
      },
      {
        title: "8 · What the Big Bang is and isn't",
        body: "It is not an explosion in space — it is space itself expanding. There is no 'center' and no 'outside.' The theory describes the evolution of the universe from ~10⁻³² seconds onward (after inflation), not its ultimate origin. It doesn't say whether time began at t=0 or continued from something earlier — that's the domain of quantum gravity, which we don't yet have. What the Big Bang theory does is explain, with a minimum of ingredients, why the universe looks the way it does today: expanding, cooling, filled with a specific mix of elements, and bathed in ancient microwave light.",
      },
    ],
  },
  {
    slug: "systems-theory",
    title: "Systems Theory",
    summary:
      "People and problems understood as parts of interconnected systems — where the patterns between members matter more than any one member's traits.",
    systemPath: "Human Knowledge/Social Sciences/Psychology/Systems Theory",
    breadcrumb: "Social Sciences · Psychology",
    category: "social",
    thumbnail: null,
    steps: [
      {
        title: "1 · From the individual to the system",
        body: "Classical psychology — psychoanalysis, behaviorism, early cognitive work — locates the unit of study in the individual. You explain a person's suffering or behavior by what's inside them. Systems theory shifts the frame: a person's patterns are inseparable from the networks they live in (family, workplace, community, culture). Symptoms that look like one person's pathology often turn out to be the system's way of maintaining itself. You can't understand the part without understanding the whole.",
      },
      {
        title: "2 · The general-systems roots",
        body: "The move began outside psychology. Ludwig von Bertalanffy's General Systems Theory (1940s–60s) argued that the same structural principles govern biological organisms, machines, organizations, and ecosystems. Cybernetics (Wiener, 1948) added feedback loops: systems adjust behavior based on outputs, maintaining stability (homeostasis) or driving change. These ideas gave psychology a new vocabulary — feedback, boundary, subsystem, equilibrium — for describing how relationships work.",
      },
      {
        title: "3 · Bowen family systems theory",
        body: "Murray Bowen (1950s–70s) applied systems thinking to families. His core claim: the family is the emotional unit, and an individual's functioning reflects their position in it. Key concepts include differentiation of self (the capacity to maintain your own perspective while remaining connected — the central developmental task), triangles (two-person tension gets stabilized by pulling in a third), family projection (parents' anxiety focused onto a child), and the multigenerational transmission of emotional patterns. Therapy aims not to fix a 'problem person' but to raise the differentiation of whoever is most willing to work.",
      },
      {
        title: "4 · Structural and strategic family therapy",
        body: "Salvador Minuchin's structural model (1960s–70s) maps families as organizations with subsystems (parental, sibling, spousal) separated by boundaries that can be rigid, clear, or diffuse. Dysfunction lives in boundary patterns — an enmeshed parent-child subsystem that excludes the other parent, a rigid boundary that cuts off support. The strategic school (Haley, Madanes) focused on interactional sequences: symptoms are solutions a family has found to a relational problem, and therapy changes the sequence, not the insight.",
      },
      {
        title: "5 · Ecological systems (Bronfenbrenner)",
        body: "Urie Bronfenbrenner (1979) zoomed out further. Development happens inside nested systems: the microsystem (immediate settings — family, classroom), the mesosystem (connections between microsystems), the exosystem (settings that affect you but don't contain you — a parent's workplace), the macrosystem (cultural values, economic conditions), and the chronosystem (change over time). You can't evaluate a child without the school, or a school without the neighborhood, or a neighborhood without the economy. The model reshaped developmental psychology and public policy research.",
      },
      {
        title: "6 · Feedback loops and circular causality",
        body: "A defining systems idea: causality is rarely linear. A withdraws → B pursues → A withdraws more → B pursues more. Who caused what? The system itself is doing the causing; each person's behavior is both cause and effect. Reinforcing loops amplify change; balancing loops resist it. Seeing an interaction as a loop rather than a chain is often the single most useful move for a therapist, manager, or coach — it dissolves the blame question into a design question.",
      },
      {
        title: "7 · Where systems thinking reaches today",
        body: "Family therapy (still its clinical home), organizational development (Peter Senge's learning organizations), public health (ecological models of health behavior), social work, trauma theory (family-of-origin patterns and intergenerational transmission), couple therapy (Gottman's sound relationship house is systems-flavored), and policy analysis (systems dynamics modeling, from Forrester onward). Whenever someone says 'the problem isn't one person, it's a pattern,' they're speaking this dialect — even when they don't know it has a name.",
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
