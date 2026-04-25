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
 *  • algorithm  — named algorithms / procedures.
 *  • model      — named models of something (scientific, statistical, ML…).
 *  • system     — named systems (natural, engineered, or conceptual).
 *  • modularity — named applications of the modularity principle across
 *                 disciplines (software, biology, cognition, …).
 *  • other      — doesn't cleanly fit above.
 */
export type KnowledgeGalleryKind =
  | "theory"
  | "algorithm"
  | "model"
  | "system"
  | "modularity"
  | "other";

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
   * Optional Unity WebGL build to launch when the user presses Play on the
   * entry's hero. The folder must contain `WebGL_build.loader.js`,
   * `WebGL_build.data[.unityweb]`, `WebGL_build.framework.js[.unityweb]` and
   * `WebGL_build.wasm[.unityweb]`.
   */
  unity?: {
    /** Absolute path under /public, no trailing slash (e.g. "/UnityGames/GOAP_Hospital"). */
    path: string;
    /** Label shown under the canvas. */
    name: string;
    /** Whether the build uses the `.unityweb` (gzipped) suffix. Defaults to true. */
    useUnityWebExtension?: boolean;
  };
  steps: ReadonlyArray<KnowledgeGalleryStep>;
}

import { humanEntries } from "@brain5th/knowledge-human";

/**
 * Legacy still-in-TS entries. As entries are migrated to per-file `.md`
 * under `packages/knowledge-human/entries/`, they're removed from this
 * array and the codegen output picks them up automatically.
 *
 * Pre-order traversal of the System of Human Knowledge tree determines
 * insertion order. New legacy entries should be inserted at the position
 * matching their `systemPath`.
 */
const LEGACY_ENTRIES: KnowledgeGalleryEntry[] = [
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
    steps: [
      {
        title: "1 · Engineering",
        body: "The systematic design of things that work under real-world constraints — mechanical, electrical, civil, chemical, aerospace, biomedical. Engineering turns physics and mathematics into bridges, engines, circuits, aircraft, and implants. Every engineering discipline is a negotiation between what the laws of nature allow and what budgets, materials, and safety margins require.",
      },
      {
        title: "2 · Biotechnology",
        body: "Using living systems (or parts of them) to make useful things — genetic engineering, pharmaceutical biotech, industrial biotech, synthetic biology, nanobiotechnology. Modern biotech (post-CRISPR) is moving from reading biology to writing it, reshaping medicine, agriculture, and materials along the way.",
      },
      {
        title: "3 · Medicine & Health Sciences",
        body: "The applied science of human health — clinical medicine, basic medical sciences, public health, allied health, medical informatics. Medicine blends biology, chemistry, physics, and statistics with an ethics-heavy practice that operates under uncertainty on individual patients. Public health scales the same reasoning up to populations.",
      },
      {
        title: "4 · Agriculture & Food Science",
        body: "The science of feeding billions — crop science, animal science, food science, sustainable agriculture, post-harvest technology. Agriculture is arguably the oldest applied science; modern agronomy combines genetics, ecology, economics, and engineering to manage yield, nutrition, and environmental impact.",
      },
      {
        title: "5 · Environmental Science & Materials Science",
        body: "Two foundational cross-cutting fields. Environmental science studies the interaction between human systems and natural ones — pollution, resource use, climate. Materials science invents the substances (alloys, polymers, semiconductors, composites, nanomaterials) that every other applied field relies on; new materials are usually what make new technology possible.",
      },
      {
        title: "6 · Information Science & Library Science",
        body: "How knowledge itself is organized, stored, retrieved, and preserved — document and file formats, knowledge organization, digital libraries, metadata standards, information retrieval. It's the infrastructure for everything downstream: a society's applied sciences are only as good as the systems that make their knowledge findable.",
      },
    ],
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
    steps: [
      {
        title: "1 · Economics & Psychology",
        body: "Two anchors of the social sciences. Economics studies how people and institutions allocate scarce resources — microeconomics, macroeconomics, behavioral economics, econometrics. Psychology studies mind and behavior at the individual scale — cognitive, developmental, social, and clinical. They converge in behavioral economics, which has been reshaping both fields since the 1980s.",
      },
      {
        title: "2 · Sociology, Political Science, Anthropology",
        body: "The group-level social sciences. Sociology studies the patterns and institutions of societies. Political science studies power, governance, and collective decision-making. Anthropology studies humans in full range — cultures, languages, evolution, archaeology. Together they try to explain why societies look the way they do and what makes them change.",
      },
      {
        title: "3 · Linguistics",
        body: "The scientific study of human language — phonetics and phonology (sound), syntax and semantics (structure and meaning), computational linguistics (language by machine), sociolinguistics (language in society). Linguistics sits on the boundary between the social sciences and the formal ones, and it powers much of modern AI.",
      },
      {
        title: "4 · Geography",
        body: "The study of how place shapes (and is shaped by) human and natural systems. Physical geography overlaps with earth science; human geography overlaps with sociology, economics, and politics. Cartography and GIS gave the discipline a powerful modern toolkit and now feed into everything from urban planning to logistics.",
      },
      {
        title: "5 · Law",
        body: "The formal system of rules a society uses to govern itself. As a field of study it covers how laws are made, interpreted, and enforced; how legal systems differ; and how law interacts with economics, politics, and ethics. It's a peculiar social science — partly empirical, partly normative, partly a profession.",
      },
      {
        title: "6 · Education & Communication Studies",
        body: "The sciences of teaching and of messaging. Education studies how people learn and how institutions can help or hinder it. Communication studies looks at how information moves through societies — media, rhetoric, journalism, digital platforms. Both are increasingly data-rich and increasingly central as modern societies run on information flows.",
      },
    ],
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
    thumbnail: null,
    steps: [
      {
        title: "1 · Philosophy",
        body: "The systematic examination of fundamental questions — metaphysics (what exists), epistemology (what we can know), ethics (how to live), aesthetics (what is beautiful), philosophy of mind, philosophy of science. Philosophy is where every other discipline eventually goes when it asks about its own foundations; it is also the oldest continuous conversation in the humanities.",
      },
      {
        title: "2 · History",
        body: "The disciplined study of the past — ancient, medieval, modern, and specialized threads like history of science. History is evidence-driven but interpretive: it asks not just what happened, but why, and what it meant. A society's self-understanding is largely a matter of which histories it tells.",
      },
      {
        title: "3 · Literature & Literary Studies",
        body: "The study of texts as works of art and of thought — poetry, fiction, drama, essay. Literary studies ranges from close reading through literary history, theory, and criticism to comparative literature across languages and cultures. It's how a civilization thinks about what its own imagination has produced.",
      },
      {
        title: "4 · Religious Studies & Theology",
        body: "The academic study of religion. Religious studies takes an outside, comparative view — anthropology, history, sociology, and philosophy of religion. Theology works from inside a tradition, asking what the tradition claims and how it coheres. Both matter: religion is one of the most persistent forces shaping cultures and individuals.",
      },
      {
        title: "5 · Art History & Visual Arts",
        body: "The study and practice of the visual — painting, sculpture, architecture, photography, and the scholarly history that tracks style, meaning, and influence across time and cultures. Art history turns works of art into evidence about the people who made them; the visual arts produce the evidence.",
      },
      {
        title: "6 · Music, Performing Arts, Digital Humanities",
        body: "The time-based and emerging humanities. Music and musicology study composition, performance, and the theory of sound as expression. Performing arts (theater, dance) extend the same attention to bodies in time. Digital humanities is the newest branch — using computation to analyze texts, artifacts, and cultures at scales humans can't read manually.",
      },
    ],
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
    thumbnail: null,
    steps: [
      {
        title: "1 · Business & Management",
        body: "The applied discipline of running organizations — finance, marketing, operations, strategy. Business studies draw on economics, psychology, and statistics, but the test is pragmatic: does the organization meet its goals under real-world constraints? It's one of the biggest professional fields in modern education.",
      },
      {
        title: "2 · Design",
        body: "The craft of shaping things people use — graphic, industrial, UX/UI, interior, fashion, motion. Design sits between the humanities (form, meaning, aesthetics) and engineering (constraints, materials, function). Modern design practice is deeply user-centered and increasingly relies on research, prototyping, and iteration.",
      },
      {
        title: "3 · Culinary Arts & Gastronomy",
        body: "Cooking as a trained discipline — bakery and pastry, classical and modern techniques, world cuisines, nutrition, flavor chemistry, restaurant management. It's a profession with deep craft, growing scientific depth (molecular gastronomy, fermentation science), and heavy cultural load.",
      },
      {
        title: "4 · Journalism, Media & Military Science",
        body: "Three professions that shape public life. Journalism and media decide what a society pays attention to and how. Military science studies the planning and conduct of armed conflict — strategy, logistics, technology, ethics. All three blend practical skills with serious theoretical frameworks.",
      },
      {
        title: "5 · Skilled Trades & Vocational Arts",
        body: "The foundational hands-on professions — plumbing, welding, electrical work, HVAC, carpentry, masonry. These are knowledge-rich fields that keep the built environment functioning; each has its own codes, materials science, and safety culture. They're often undervalued academically but are indispensable to every modern society.",
      },
      {
        title: "6 · Data Science & Bioinformatics",
        body: "Two of the fastest-growing interdisciplinary professions. Data science combines statistics, computer science, and domain expertise to extract insight from data at scale. Bioinformatics applies the same toolkit to biological data (sequences, structures, expression). Both fields barely existed a generation ago and now power whole industries.",
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
    kind: "theory",
    thumbnail: "/SetTheory.webp",
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
    steps: [
      {
        title: "1 · Syntax vs. semantics",
        body: "A formal language is a set of symbols and grammatical rules — pure syntax, with no meaning attached. A structure (or 'model') is a mathematical object — a set with operations and relations — that the symbols can be interpreted in. Model theory is the study of the relationship between the two: which sentences are true in which structures, and what does the set of a theory's models tell us about the theory? It sits at the meeting point of logic and ordinary mathematics.",
      },
      {
        title: "2 · Theories, models, and satisfaction",
        body: "A theory T is a set of sentences (axioms) in a first-order language. A structure M is a model of T — written M ⊨ T — if every sentence of T is true in M. The theory of groups has many models: the integers under addition, symmetries of a square, permutation groups. The theory of the real numbers as an ordered field has, up to isomorphism, exactly one model. The central question is: given a theory, what do its models look like, and how much do they have in common?",
      },
      {
        title: "3 · Gödel's completeness theorem (1930)",
        body: "Kurt Gödel's first major result (distinct from incompleteness): a sentence is provable from a first-order theory if and only if it is true in every model of that theory. This is the completeness theorem — it says first-order logic exactly captures the notion of 'follows from.' Syntax (proofs) and semantics (truth in all models) match up perfectly. This is why model theory works at all: it connects the formal manipulation of symbols to genuine mathematical content.",
      },
      {
        title: "4 · The compactness theorem",
        body: "A theory has a model if and only if every finite subset of it has a model. This almost sounds too weak to matter, but it's stunningly powerful. Compactness lets you build 'non-standard' models with infinitesimals (Robinson's non-standard analysis), construct models of arithmetic containing infinite natural numbers, and prove existence theorems that would be hopeless by direct construction. Much of model theory's firepower in pure math comes from creative uses of compactness.",
      },
      {
        title: "5 · Löwenheim–Skolem and the multiplicity of models",
        body: "The downward Löwenheim–Skolem theorem says: any theory with an infinite model has a countable model. The upward version: any theory with an infinite model has models of every larger infinite cardinality. Consequence: first-order theories can't pin down the 'size' of their intended structure. Even ZFC set theory, which talks about uncountable sets, has a countable model (Skolem's paradox). First-order logic is expressive, but it can't uniquely characterize most interesting infinite structures.",
      },
      {
        title: "6 · Types, elementary equivalence, and classification",
        body: "Two structures are elementarily equivalent if they satisfy exactly the same first-order sentences. A 'type' over a structure is a maximal consistent set of formulas describing a possible element. Much of modern model theory is about types — counting them, realizing them, classifying theories by how their types behave. Shelah's stability theory (1970s onward) gave a deep classification: stable theories (well-behaved — algebraically closed fields, differentially closed fields), unstable theories (wild — Peano arithmetic, the rationals as an ordered field).",
      },
      {
        title: "7 · Where model theory does real work",
        body: "Algebraic geometry (Ax–Grothendieck theorem: an injective polynomial map from ℂⁿ to itself is surjective — proved most cleanly via model theory). Number theory (Hrushovski's model-theoretic proof of the Mordell–Lang conjecture in positive characteristic). Differential algebra and o-minimality (Wilkie's theorem on the reals with exponentiation, with applications to transcendence theory). Non-standard analysis (Robinson's rigorous infinitesimals). Model theory earns its keep by giving clean proofs of hard results in 'ordinary' mathematics — not just studying logic for its own sake.",
      },
      {
        title: "8 · Philosophical upshot",
        body: "Model theory crystallizes a hard-won insight: mathematical theories don't describe unique structures — they describe families of structures that share formal properties. What we call 'the integers' or 'the reals' is really an isomorphism type picked out by a combination of axioms and intended interpretation; first-order axioms alone are rarely strong enough to do it. Model theory is how mathematicians measure this gap, and how they turn it from a limitation into a source of new mathematics.",
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
    kind: "theory",
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
    slug: "operating-systems",
    title: "Operating Systems",
    summary:
      "The software layer between a computer's hardware and everything that runs on it — managing processes, memory, files, and the illusion that each program has the machine to itself.",
    systemPath:
      "Human Knowledge/Formal Sciences/Computer Science/Systems/Operating Systems",
    breadcrumb: "Formal Sciences · Computer Science",
    category: "formal",
    kind: "system",
    thumbnail: null,
    steps: [
      {
        title: "1 · What an OS actually does",
        body: "An operating system has two jobs that are really the same job: it abstracts the hardware (so programs don't have to know whether a disk is SSD or spinning rust, whether a CPU has 4 cores or 64) and it multiplexes it (so many programs can share one machine safely). Every modern OS — Linux, Windows, macOS, iOS, Android, the real-time kernels running your car and your microwave — is a variation on those two themes.",
      },
      {
        title: "2 · Processes and threads",
        body: "A process is a running program with its own memory space, file handles, and protection boundary. Threads are lighter-weight units of execution that share a process's memory. The OS schedules threads onto CPU cores, switching between them fast enough that they appear to run in parallel. Scheduling is a genuinely hard problem — fairness, throughput, latency, and energy all pull in different directions, and every OS kernel has a long history of scheduler rewrites.",
      },
      {
        title: "3 · Virtual memory",
        body: "One of the great ideas of 20th-century computing: give every process its own enormous virtual address space, and let the OS + hardware (the MMU) translate virtual addresses to physical ones on demand, paging rarely-used memory out to disk. This makes programs simpler (no manual memory management across processes), safer (processes can't read each other's memory by accident), and lets the machine look like it has more RAM than it does. Paging, TLBs, and copy-on-write are all consequences.",
      },
      {
        title: "4 · Filesystems",
        body: "A filesystem turns a linear sequence of blocks on a disk into a tree of named files. That involves metadata (inodes, directory entries), crash safety (journaling, copy-on-write, or log-structured designs), and performance (caching, read-ahead, prefetching). Modern filesystems (ext4, NTFS, APFS, ZFS, Btrfs) add snapshots, checksums, and compression. Network and distributed filesystems (NFS, SMB, Ceph) extend the same abstraction across machines.",
      },
      {
        title: "5 · The kernel / user boundary",
        body: "The kernel is the OS code that runs with full hardware privileges; user programs run in a restricted mode and must ask the kernel (via system calls) to do anything privileged — open a file, allocate memory, send a packet, start a process. This boundary is what makes the whole thing safe: a crashing or malicious user program can't take down the machine or read another process's memory. System-call design is where security, performance, and API ergonomics collide.",
      },
      {
        title: "6 · Major design families",
        body: "Monolithic kernels (Linux, classic Unix) put drivers and most subsystems inside the kernel — fast but large. Microkernels (QNX, L4, seL4) shrink the kernel to a tiny core and run drivers as user-space processes — slower across the boundary but more robust and formally verifiable. Hybrid kernels (Windows NT, XNU in macOS) sit in between. Unikernels and exokernels push the idea further, collapsing the OS into the application when only one workload will ever run.",
      },
      {
        title: "7 · Why operating systems still matter",
        body: "Every abstraction you use — containers, VMs, serverless functions, phone apps — ultimately sits on an OS kernel. Container isolation is built on Linux namespaces and cgroups; virtual machines are built on hardware-assisted virtualization the kernel exposes; browsers are sandboxes enforced by OS syscall filters. The surface has moved up the stack, but the OS is still where the rules of the machine are defined and enforced.",
      },
    ],
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
    thumbnail: null,
    steps: [
      {
        title: "1 · Why we distribute at all",
        body: "One machine has limits: it can only be so large, so fast, and so reliable. Distributed systems scale past those limits horizontally — by pooling many cheap machines — and gain fault tolerance almost for free, since the failure of any single node need not bring the whole service down. The price is complexity: the network is not reliable, clocks do not agree, and machines fail in partial, correlated, and surprising ways.",
      },
      {
        title: "2 · The fallacies of distributed computing",
        body: "Peter Deutsch's famous list, assembled at Sun in the 1990s, names the assumptions newcomers all make and all regret: the network is reliable, latency is zero, bandwidth is infinite, the network is secure, topology doesn't change, there's one administrator, transport cost is zero, the network is homogeneous. Every one of those is false in practice. The art of distributed systems is designing software that behaves correctly when they're violated.",
      },
      {
        title: "3 · Time, order, and consistency",
        body: "Leslie Lamport's 1978 paper 'Time, Clocks, and the Ordering of Events' showed you cannot rely on wall-clock time across machines — but you can define a causal ordering from messages. That insight underwrites logical clocks, vector clocks, and every modern consensus algorithm. Consistency models (linearizable, sequential, causal, eventual) are a menu of promises about what a client can see when multiple replicas exist; stronger promises cost more coordination.",
      },
      {
        title: "4 · The CAP theorem",
        body: "Eric Brewer's CAP theorem (2000, formally proven by Gilbert and Lynch in 2002) says: in the presence of a network partition, a distributed system must choose between consistency (all nodes see the same value) and availability (every request gets a response). You cannot have both. That forces a design decision on every real system — CP databases (Spanner, etcd, ZooKeeper) sacrifice availability during partitions; AP databases (Cassandra, Dynamo) stay up but may return stale data.",
      },
      {
        title: "5 · Consensus: Paxos, Raft, and friends",
        body: "When replicas must agree — on a leader, on a committed log entry, on the next configuration — you need a consensus protocol. Paxos (Lamport, 1998) was the landmark, correct but notoriously hard to understand. Raft (Ongaro and Ousterhout, 2014) is the modern teaching default, provably equivalent but easier to build and verify. These protocols are the heart of every reliable coordination service: Kubernetes, etcd, ZooKeeper, Consul, and the metadata planes of most cloud databases.",
      },
      {
        title: "6 · Replication and partitioning",
        body: "Replication (multiple copies of the same data) gives you fault tolerance and read scale; partitioning (splitting data across nodes) gives you write scale. Combined, they underpin every scalable database. The tricky bits are keeping replicas in sync (synchronous vs. asynchronous, leader vs. leaderless), rebalancing when nodes come and go, and handling failures without data loss. Consistent hashing, sharding, and quorum reads/writes are all answers to facets of this problem.",
      },
      {
        title: "7 · Where the field lives today",
        body: "Every modern web service is a distributed system, whether its authors call it that or not. Cloud storage (S3, GCS), globally replicated databases (Spanner, CockroachDB, DynamoDB), streaming platforms (Kafka), orchestrators (Kubernetes), and service meshes are applied distributed systems. Research continues on stronger consistency at lower cost (CRDTs, causal+ consistency), formal verification of protocols, and the hard problems of Byzantine fault tolerance — which, via blockchains, has finally escaped the lab.",
      },
    ],
  },
  {
    slug: "software-modularity",
    title: "Software Modularity",
    summary:
      "The engineering principle of splitting a program into self-contained pieces that hide their internals and expose narrow interfaces — arguably the single most important idea in software design.",
    systemPath:
      "Human Knowledge/Formal Sciences/Computer Science/Software Engineering/Modularity",
    breadcrumb: "Formal Sciences · Software Engineering",
    category: "formal",
    kind: "modularity",
    thumbnail: null,
    steps: [
      {
        title: "1 · The problem it solves",
        body: "A large program is too big to hold in one head. Change ripples unpredictably, bugs hide in the interactions between distant parts, and onboarding a new engineer becomes an archaeological dig. Modularity is the response: split the system into pieces small enough to reason about locally, with well-defined boundaries so that understanding one piece doesn't require understanding all the others. The unit of reasoning shrinks from 'the whole program' to 'this module and its interfaces' — a difference of orders of magnitude in cognitive load.",
      },
      {
        title: "2 · Parnas and information hiding (1972)",
        body: "David Parnas's paper 'On the Criteria To Be Used in Decomposing Systems into Modules' is the founding document. His key insight: the right decomposition isn't by processing step, it's by secret. Each module hides a design decision that is likely to change — a data structure, an algorithm, a hardware dependency — behind a stable interface. Callers depend on the interface, not the secret; when the secret changes, nothing else has to. Information hiding turns change tolerance from an accident into a property you can design for.",
      },
      {
        title: "3 · Cohesion and coupling",
        body: "Two dials measure module quality. High cohesion means a module's internals all serve one purpose — everything inside belongs together. Low coupling means modules depend on each other only through narrow, explicit interfaces — no shared global state, no reaching into each other's guts. The goal is always 'high cohesion, low coupling'. These ideas were sharpened by Larry Constantine and Edward Yourdon in the 1970s and remain the vocabulary every code review uses today, whether the reviewer names them or not.",
      },
      {
        title: "4 · Interfaces and abstract data types",
        body: "A module's interface is a contract: a list of operations, their signatures, and the invariants they promise. Barbara Liskov's work on abstract data types (CLU, 1974) showed how to make the contract a first-class language construct — the type system enforces that clients only touch the module through its operations, never its representation. Every modern type system, every header file, every language's `public` / `private` keywords, every API spec, is a descendant of this move.",
      },
      {
        title: "5 · Modularity at every scale",
        body: "The same principle recurs at every altitude of software. At the smallest scale: functions. One level up: classes and modules within a file. Higher still: packages and libraries with their own versioned interfaces. Higher still: microservices, each a process with a network API. At the top: whole systems that talk only through well-defined protocols. The Unix philosophy ('do one thing well, communicate through pipes') is modularity at the process level; REST, gRPC, and message queues are modularity at the system level. The pattern is fractal.",
      },
      {
        title: "6 · What modularity buys you",
        body: "Parallel development: teams can work on different modules without blocking each other. Testability: a module with a narrow interface can be tested in isolation, with a fake or mock for its dependencies. Reusability: a well-bounded module can be dropped into a different system. Replaceability: swap an implementation without touching callers. Comprehensibility: new engineers can learn one module at a time. None of these are automatic — they're what careful module boundaries make possible.",
      },
      {
        title: "7 · The costs and failure modes",
        body: "Modularity isn't free. Too-small modules fragment the system into noise (classic 'Java-itis': forty files to do one thing). Wrong boundaries calcify — the interfaces freeze the system's structure, and every change has to route around them. 'Leaky abstractions' (Joel Spolsky) let internals show through and break the information-hiding promise. Distributed modules (microservices) trade in-process simplicity for network complexity — timeouts, partial failures, versioning. The craft is choosing *what* to modularize and *where* to draw the seams, not just splitting things up for its own sake.",
      },
    ],
  },
  {
    slug: "generative-models",
    title: "Generative Models",
    summary:
      "Machine-learning models that learn the distribution of a dataset well enough to produce new samples from it — the technology behind modern image, video, audio, and text synthesis.",
    systemPath:
      "Human Knowledge/Formal Sciences/Computer Science/Artificial Intelligence/Deep Learning/Generative Models (GANs, Diffusion)",
    breadcrumb: "Formal Sciences · Artificial Intelligence",
    category: "formal",
    kind: "model",
    thumbnail: null,
    steps: [
      {
        title: "1 · Discriminative vs. generative",
        body: "A discriminative model learns the boundary between classes — given an image, is it a cat or a dog? A generative model learns the full distribution — given the concept 'cat', it can produce new images of cats that never existed. The difference is the difference between recognizing and imagining. Classical generative models (Gaussian mixtures, HMMs, Naive Bayes) existed for decades; what changed in the 2010s was that deep networks became capable enough to model the distributions of real images, audio, and text.",
      },
      {
        title: "2 · Variational Autoencoders (2013)",
        body: "Kingma and Welling's Variational Autoencoder (VAE) was the first practical deep generative model. It compresses an input into a low-dimensional latent vector and reconstructs it, with a regularization term that forces the latent space to look like a smooth, sample-able distribution (usually Gaussian). You can then sample a new latent vector and decode it to get a new image. VAEs produce slightly blurry results but are well-understood, easy to train, and gave the field its first grip on learned latent spaces.",
      },
      {
        title: "3 · Generative Adversarial Networks (2014)",
        body: "Ian Goodfellow's GAN set up a two-player game: a generator tries to produce samples that fool a discriminator, which tries to tell real samples from fake. Train them against each other and — in principle — the generator converges to the true data distribution. GANs produced the era's sharpest images (StyleGAN's photorealistic faces, 2018–2020) but were notoriously unstable to train, prone to mode collapse, and hard to evaluate. For about six years, they were the frontier of image synthesis.",
      },
      {
        title: "4 · Autoregressive models",
        body: "A simpler recipe: model the probability of the next token given the previous ones, then sample one token at a time. PixelRNN (2016) did this for images pixel-by-pixel; WaveNet (2016) did it for audio sample-by-sample; and GPT did it for text token-by-token. Autoregressive models are conceptually clean and scale beautifully — they're why large language models work — but image and audio variants are slow because you generate one unit at a time.",
      },
      {
        title: "5 · Diffusion models (2020 onward)",
        body: "The current state of the art for images, audio, and video. The trick, due to Ho et al. and Song et al., is to train a network to denoise: take a clean image, progressively add Gaussian noise until it's pure static, and train the network to reverse the process. To generate, start from pure noise and iteratively denoise. Stable Diffusion, DALL·E 2 and 3, Imagen, Midjourney, and Sora are all variants. Diffusion trains stably (unlike GANs), produces sharp samples (unlike VAEs), and conditions cleanly on text via classifier-free guidance.",
      },
      {
        title: "6 · Conditioning: text-to-anything",
        body: "What made generative models feel like magic in the 2020s was conditioning. Pair a diffusion model with a CLIP-style text encoder and suddenly 'a cat riding a bicycle in Van Gogh's style' produces that image. The same recipe generalizes: text-to-image, text-to-video (Sora, Veo), text-to-3D, text-to-music (Suno, MusicLM), image-to-image (editing), and now multimodal foundation models that mix all these in one network. The bottleneck moved from modeling capacity to compute, data curation, and alignment.",
      },
      {
        title: "7 · What's hard, what's next",
        body: "Hard: evaluation (what does 'good' mean?), truthfulness (models hallucinate and confabulate), controllability (getting exactly the right output), copyright and training-data provenance, the energy cost of large-model inference, and detecting synthetic media in a society that relied on media as evidence. Next: faster sampling (consistency models, rectified flows), unified multimodal generation, world models for robotics and agents, and better post-training alignment. The research frontier moves roughly every six months.",
      },
    ],
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
    unity: {
      path: "/UnityGames/GOAP_Hospital",
      name: "GOAP Hospital",
      useUnityWebExtension: true,
    },
    steps: [
      {
        title: "1 · The problem GOAP solves",
        body: "Hand-scripted AI behavior quickly becomes brittle: every new situation needs a new branch, and designers end up maintaining sprawling decision trees that break the moment the world changes. Goal-Oriented Action Planning (GOAP), introduced to game AI by Jeff Orkin for F.E.A.R. (2005), replaces the script with a planner. You describe actions, preconditions, and effects; the AI figures out, at runtime, which sequence of actions gets from its current state to a desired goal. Designers author capabilities; behavior emerges from search.",
      },
      {
        title: "2 · World state, goals, and actions",
        body: "A GOAP agent represents the world as a set of key-value facts (hasWeapon=true, enemyVisible=false, atCover=true). A goal is a target subset of those facts (enemyDead=true). An action is a bundle of three things: preconditions (facts that must hold before the action can run), effects (facts it sets afterward), and a cost (a number used to compare plans). 'Reload' might require hasWeapon and set ammoLoaded; 'AttackEnemy' might require ammoLoaded and enemyVisible and set enemyDead. Everything else is search.",
      },
      {
        title: "3 · Planning as graph search",
        body: "Finding a plan is finding a path through a graph whose nodes are world states and whose edges are applicable actions. GOAP typically runs A* search backward from the goal: 'what action makes enemyDead true?' → AttackEnemy, which needs ammoLoaded → Reload, which needs hasWeapon → PickUpWeapon, etc. The heuristic is usually the count of unsatisfied goal facts. Backward search prunes aggressively because you only expand actions whose effects are actually relevant to the goal. The output is an ordered list of actions the agent then executes.",
      },
      {
        title: "4 · Dynamic replanning",
        body: "A plan is never trusted blindly. Between (or during) steps, the agent re-checks whether the plan is still valid: did the enemy move, did the weapon break, did a new threat appear? If any precondition for the next action fails, the planner runs again from the new state. This is what made F.E.A.R.'s soldiers feel alive — they'd flank, retreat, or regroup not because a designer scripted those behaviors, but because the planner re-solved the problem with new facts.",
      },
      {
        title: "5 · Strengths and limits",
        body: "Strengths: authoring is local (add an action, declare its preconditions and effects, done — no central logic to rewrite); behavior is explicable (you can print the plan); it handles novel situations gracefully. Limits: the search space explodes if you have many actions or facts, so real systems keep both small; costs must be tuned carefully or the planner picks 'clever' but unnatural sequences; GOAP doesn't handle time, uncertainty, or continuous state well without extensions. For long-horizon reasoning, Hierarchical Task Networks (HTN) are usually preferred.",
      },
      {
        title: "6 · Where GOAP shows up",
        body: "F.E.A.R., S.T.A.L.K.E.R., Deus Ex: Human Revolution, Tomb Raider (2013), Middle-earth: Shadow of Mordor, and many others use GOAP or close cousins. Outside games: service robotics (a cleaning robot planning fetch-and-place tasks), autonomous drones, and AI companions in simulations. Conceptually GOAP is a cut-down STRIPS planner (classical AI, 1971) tuned for real-time constraints — which makes it a rare case of 1970s symbolic AI earning its keep in a 21st-century shipping product.",
      },
    ],
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
    unity: {
      path: "/UnityGames/BehaviourTree_Gallery",
      name: "Behaviour Tree Gallery",
      useUnityWebExtension: true,
    },
    steps: [
      {
        title: "1 · Why not finite state machines?",
        body: "For decades, game and robot AI was built on finite state machines (FSMs): a fixed set of states (Patrol, Attack, Flee) with transitions between them. FSMs are easy to start but scale terribly — with N states you get up to N² transitions, and adding a new state means touching many others. Reuse is hard: an 'attack' state in one character rarely drops into another. Behavior Trees (BTs), popularized by Halo 2 (2004) and refined across the 2010s, replace the transition mess with a composable tree of reusable nodes.",
      },
      {
        title: "2 · The core node types",
        body: "A behavior tree has three node kinds. Leaves are Actions (MoveTo, Attack, PlayAnim) or Conditions (IsEnemyVisible?, HasAmmo?). Composites combine children: a Sequence runs children left-to-right until one fails (logical AND), a Selector (or Fallback) runs children left-to-right until one succeeds (logical OR), and a Parallel runs children concurrently. Decorators wrap a single child to modify its result (Invert, Repeat, UntilSuccess, Cooldown). Every node returns one of three statuses: Success, Failure, or Running. That's the whole vocabulary.",
      },
      {
        title: "3 · How a tick works",
        body: "Each game frame (or control loop iteration) the tree is 'ticked' from the root. Control flows down: a Selector tries its first child, which might be a Sequence that checks 'IsEnemyVisible? → HasAmmo? → Attack'. If any check fails, the Sequence fails and the Selector moves to its next child (maybe 'Flee'). If an action returns Running, the tree remembers its position and resumes there next tick. This tick-based model makes behavior reactive — the tree re-evaluates priorities every frame, so a higher-priority branch (e.g., 'take cover when shot') can pre-empt a lower one automatically.",
      },
      {
        title: "4 · The blackboard",
        body: "Nodes don't hardcode data; they read and write a shared key-value store called a blackboard. One node writes targetEnemy; another reads it. This decouples decision logic from world state and makes subtrees reusable across agents — a 'flank and attack' subtree drops into any character whose blackboard exposes targetEnemy and selfPosition. The blackboard is also where designers plug in perception, memory, and squad-level coordination.",
      },
      {
        title: "5 · Why BTs beat FSMs in practice",
        body: "Modularity — any subtree is a self-contained behavior you can copy, paste, parameterize, or swap. Reactivity — because the tree re-ticks from the root, priority changes propagate automatically without explicit transitions. Authorability — visual editors (Unreal's Behavior Tree, Unity's Behavior Designer, Godot) let designers build and debug without code. Scalability — complexity grows linearly with behaviors, not quadratically with states. The trade-off: BTs are less expressive for long-term planning (use GOAP or HTN for that) and the 'tick every frame' model can waste CPU if unoptimized.",
      },
      {
        title: "6 · Beyond games: BTs in robotics",
        body: "Since ~2012, behavior trees have become a standard tool in robotics too. ROS 2's Nav2 navigation stack uses BTs to sequence recovery behaviors (if the path-planner fails, try clearing costmaps, then try spinning in place, then ask a human). Researchers (Colledanchise & Ögren) gave BTs a formal mathematical foundation — showing they subsume both decision trees and FSMs — and built proofs about robustness and safety. The same architecture that drives NPCs in AAA games now directs warehouse robots and service drones.",
      },
      {
        title: "7 · BTs vs. GOAP vs. Utility AI",
        body: "These are the three dominant paradigms for agent decisions, and they solve different problems. Behavior Trees are best for structured, hand-authored behavior with clear priorities. GOAP is best when the action space is combinatorial and plans must adapt to novel states. Utility AI scores every option continuously and picks the best — great for smooth, quantitative preferences (hunger vs. fatigue vs. curiosity). Real systems often combine them: a BT with a GOAP leaf that plans multi-step objectives, or a BT selector driven by utility scores. Knowing which tool fits which problem is the actual craft.",
      },
    ],
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
    thumbnail: null,
    steps: [
      {
        title: "1 · What the phrase names",
        body: "The term 'foundation model', coined by Stanford's CRFM in 2021, names a new species of machine-learning model: one trained once, on very broad data, and then adapted (via fine-tuning, prompting, or tool use) to many tasks downstream. GPT, Claude, Gemini, Llama, and their kin are the best-known examples; image, audio, video, and robotics foundation models also exist. The economics is the point — training is enormous and centralized, deployment is cheap and ubiquitous.",
      },
      {
        title: "2 · The transformer (2017)",
        body: "Foundation models run on transformers, the architecture introduced by Vaswani et al. in 'Attention Is All You Need'. The core idea is self-attention: each token in a sequence computes a weighted combination of every other token, where the weights come from learned query/key/value projections. That replaces the sequential bottleneck of RNNs with something massively parallel, scales smoothly to very long contexts, and transfers across modalities — the same block, with minor tweaks, models text, images (ViT), audio, and protein sequences (AlphaFold 2).",
      },
      {
        title: "3 · Pre-training on everything",
        body: "An LLM's pre-training objective is absurdly simple: given the first N tokens, predict the (N+1)-th. Run that over trillions of tokens — the web, books, code, scientific papers — and the model is forced to acquire grammar, facts, reasoning patterns, and writing styles just to reduce its loss. The same recipe on images (masked-patch prediction) or audio (masked-span prediction) yields vision and speech foundation models. Pre-training is where the capability comes from; everything afterward is adaptation.",
      },
      {
        title: "4 · Scaling laws",
        body: "Kaplan et al. (2020) and then Hoffmann et al. (Chinchilla, 2022) showed that loss decreases as a smooth power law in compute, parameters, and data, and that — for a fixed compute budget — there's an optimal trade-off between model size and training tokens. The implication: bigger isn't automatically better; data-scaled models win. This is why most frontier labs now train models with more tokens per parameter than the 2020-era giants, and why the 'scale is all you need' slogan has become more qualified.",
      },
      {
        title: "5 · Post-training: SFT, RLHF, and tool use",
        body: "A raw pre-trained model is capable but unsteered. Post-training turns it into an assistant: supervised fine-tuning (SFT) on curated instruction-response pairs, then reinforcement learning from human feedback (RLHF, Ouyang et al., 2022) to match preferences, then constitutional or rule-based methods (Bai et al.) to encode specific values. Add tool-use training and the model can call search, code, databases, and other models. The gap between GPT-3 (2020) and ChatGPT (2022) was essentially a gap in post-training, not base capability.",
      },
      {
        title: "6 · Emergent behavior and its limits",
        body: "Capabilities like arithmetic, multi-step reasoning, and in-context learning appear as models cross certain scale thresholds — the so-called emergence phenomena. Some of this is real; some is an artifact of choosing discontinuous metrics (Schaeffer et al., 2023). What's clear is that behavior changes qualitatively with scale in ways the loss curve alone doesn't predict, which is why evaluation is so hard: benchmarks saturate, and frontier models reliably find ways to ace them without the underlying skill the benchmark was meant to measure.",
      },
      {
        title: "7 · What's genuinely hard",
        body: "Truthfulness — models confidently generate plausible falsehoods (hallucinations) and no clean fix exists. Alignment — ensuring models do what users and society actually want, not what the training objective literally rewards. Safety — preventing misuse without crippling usefulness. Interpretability — mechanistic understanding of what the circuits inside a 100B-parameter network are doing. Compute and energy — frontier training runs cost tens of millions of dollars and use city-scale power. And agency — once models can take actions in the world (code, search, buy, send), the stakes of every failure mode rise.",
      },
      {
        title: "8 · Where they're going",
        body: "Multimodal by default (text + image + audio + video in one model), longer and cheaper context, retrieval and tool use baked in, reasoning models that think before answering (o1-style chain-of-thought training), agentic workflows (plan, act, observe, iterate), and on-device variants small enough to run privately. The shape of the field — one big model fine-tuned for many tasks — is unlikely to change; what that big model can do is still expanding faster than the research literature can track.",
      },
    ],
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
    steps: [
      {
        title: "1 · Why a general theory of systems?",
        body: "By the 1940s, scientists in very different fields — biology, engineering, economics, psychology — were noticing that their problems shared structural features: interdependent parts, feedback, self-regulation, growth. Ludwig von Bertalanffy argued this wasn't coincidence. If the same patterns keep appearing, there should be a general science of them — a framework whose concepts cut across disciplines, analogous to how thermodynamics cuts across physics and chemistry. General Systems Theory (GST) was his answer.",
      },
      {
        title: "2 · The core definition",
        body: "A system is a set of elements standing in interrelations. Its behavior is not reducible to the sum of the elements in isolation — the relationships matter as much as the parts. From this minimal definition, GST derives key properties: wholeness (the system behaves as a unit), hierarchy (systems nest inside larger systems and contain subsystems), boundary (what's inside vs. outside), and emergence (behavior at the system level that doesn't live in any one part).",
      },
      {
        title: "3 · Open vs. closed systems",
        body: "Classical physics mostly studied closed systems — isolated from their surroundings, heading toward thermodynamic equilibrium (maximum entropy, 'death'). But living organisms, organizations, and ecosystems are open: they exchange matter, energy, and information with their environment, and they maintain structure far from equilibrium. Bertalanffy's insight: open systems can sustain order by continuously importing energy and exporting entropy. This reframed life itself as a thermodynamically coherent phenomenon, not a mystery.",
      },
      {
        title: "4 · Feedback and self-regulation",
        body: "Systems maintain themselves through feedback loops. Negative (balancing) feedback pushes the system back toward a set point — a thermostat cooling a room, a body regulating temperature, a market clearing prices. Positive (reinforcing) feedback amplifies change — compounding interest, viral spread, runaway climate effects. Homeostasis, adaptation, and learning all reduce, at their core, to patterns of feedback. Cybernetics (Wiener, 1948) developed this math in parallel, and GST absorbed it.",
      },
      {
        title: "5 · Isomorphism across disciplines",
        body: "GST's boldest claim: the same formal models describe wildly different systems. The logistic equation captures bacterial growth and market saturation. Input-process-output diagrams apply to a factory, a digestive tract, a news cycle. Control-theoretic stability analysis applies to an autopilot, a hormone axis, or a monetary policy regime. These isomorphisms aren't metaphor — they're the same equations with different labels. If true, a discovery in one domain can seed progress in another.",
      },
      {
        title: "6 · Critiques and limits",
        body: "GST has been accused of being too abstract to do real work — a vocabulary more than a theory, with concepts so general they fit everything and predict nothing specific. Critics argue the unification is often superficial: the logistic equation describes bacteria and markets, but the mechanisms differ so much that the shared math yields little practical transfer. Defenders reply that frameworks (not just laws) are legitimate scientific tools, and that GST's descendants — cybernetics, complexity science, systems biology, system dynamics — have produced concrete results.",
      },
      {
        title: "7 · Where GST lives today",
        body: "Systems biology (treating cells and organisms as networks, not just molecules), system dynamics (Forrester's stocks-and-flows modeling, still used in policy and sustainability), management cybernetics (Stafford Beer's Viable System Model), ecosystem ecology (energy and nutrient flows through trophic levels), organizational design (Senge's 'fifth discipline'), and the broader complexity sciences at institutions like Santa Fe. GST the grand unifying program faded, but its core moves — look at the whole, watch the feedback, cross the disciplinary boundary — are now default practice wherever systems get messy.",
      },
    ],
  },
  {
    slug: "complex-systems",
    title: "Complex Systems",
    summary:
      "Systems composed of many interacting components whose collective behavior cannot be inferred from the parts alone — a field that cuts across physics, biology, economics, and the social sciences.",
    systemPath: "Human Knowledge/Formal Sciences/Systems Science/Complex Systems",
    breadcrumb: "Formal Sciences · Systems Science",
    category: "formal",
    kind: "system",
    thumbnail: null,
    steps: [
      {
        title: "1 · What makes a system 'complex'",
        body: "Three ingredients roughly do it: many components, strong nonlinear interactions between them, and feedback loops that make the whole depend on its own history. A gas has many components but weak interactions — statistical mechanics handles it. A pendulum has strong nonlinearities but only one component. A brain, an economy, a forest, an ant colony, the power grid, and the climate all have many components, nonlinear coupling, and memory — and that combination breaks the usual reductionist playbook.",
      },
      {
        title: "2 · Emergence",
        body: "The defining phenomenon: the system does something the parts don't do and couldn't do alone. No neuron is conscious; no water molecule is wet; no ant knows how to build a nest. Emergence is not mysticism — it's what happens when local rules, iterated at scale, produce global structure. Conway's Game of Life gives the minimal illustration: four trivial rules produce gliders, guns, and (provably) universal computation. If you want to understand the macro, you cannot only study the micro.",
      },
      {
        title: "3 · Networks and topology",
        body: "Most complex systems are networks: nodes (neurons, people, routers, species) connected by edges (synapses, friendships, cables, trophic links). The topology matters enormously. Barabási and Albert (1999) showed that many real networks are scale-free — a few hubs, many peripheral nodes — which makes them robust to random failure but fragile to targeted attack. Small-world networks (Watts and Strogatz, 1998) explain how six-degrees-of-separation coexists with strong local clustering. The same network statistics keep reappearing across domains.",
      },
      {
        title: "4 · Nonlinearity and tipping points",
        body: "In a linear system, doubling the input doubles the output. Complex systems are nonlinear: small changes can produce no effect for a long time and then a large one, because the system crosses a threshold. Ice sheets melt slowly and then collapse; populations stay stable and then crash; markets drift and then panic. Formalisms like bifurcation theory and catastrophe theory describe when and how these tipping points occur, and early-warning signals (critical slowing down, variance spikes) sometimes precede them.",
      },
      {
        title: "5 · Self-organization",
        body: "Complex systems spontaneously develop structure without an external designer: flocks, markets, traffic jams, cities, life itself. The mechanisms — positive and negative feedback, local interaction rules, energy flow through the system — have been studied across chemistry (Belousov–Zhabotinsky reactions), biology (morphogenesis, Turing patterns), physics (Bénard convection), and social science (Schelling segregation). Self-organization is nature's default when conditions are right; 'order from noise' stops being a paradox and becomes a mechanism.",
      },
      {
        title: "6 · How the field studies them",
        body: "Agent-based models simulate heterogeneous individuals following local rules and look for emergent regularities. Network analysis measures topology and dynamics on real data. Information theory (entropy, mutual information, transfer entropy) quantifies structure and coupling. Statistical physics adapts tools from equilibrium and non-equilibrium thermodynamics. The Santa Fe Institute (founded 1984) has been the field's intellectual home, but complexity science now lives inside every empirical field that produces enough data.",
      },
      {
        title: "7 · Why it matters",
        body: "Most of the systems whose failures would hurt us most — financial markets, infrastructure, ecosystems, pandemics, the climate, social networks — are complex systems, and the standard reductionist toolkit underpredicts their crises. Complex systems thinking doesn't replace reductionism but complements it: it insists that aggregates can have their own laws, that robustness and fragility are system-level properties, and that the right policy question is rarely 'which part is broken?' but 'which interactions are doing the work?'.",
      },
    ],
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
    kind: "theory",
    thumbnail: "/ComplexAdaptiveSystems.webp",
    steps: [
      {
        title: "1 · What makes a system 'complex adaptive'",
        body: "A complex adaptive system (CAS) has three essentials: (1) many interacting components — 'agents' — each following relatively simple local rules, (2) those agents adapt their behavior based on experience or context, and (3) the system as a whole exhibits emergent behavior not designed into any single agent. An ant colony, a stock market, a neural network, a city, an ecosystem, the immune system, and the internet all fit. What they share isn't their substance — it's their structure.",
      },
      {
        title: "2 · Emergence — the whole behaves like something the parts don't",
        body: "Put a single ant on a table: it wanders. Put 10,000 ants together: they build bridges, farm fungus, wage wars, and solve shortest-path problems nobody taught them. The colony 'knows' things no ant knows. This is emergence — system-level properties arising from local interactions, not from central control or from any one agent's intelligence. Emergence is the signature phenomenon of CAS, and it's what makes reductionism (explaining the whole by the parts alone) incomplete for them.",
      },
      {
        title: "3 · Adaptation and the fitness landscape",
        body: "Agents in a CAS don't just interact — they update. Based on what works, they adjust strategies, rewire connections, or get replaced by more successful variants. Stuart Kauffman's metaphor: a fitness landscape where agents hill-climb toward better performance. But the landscape itself changes as other agents adapt, so the peaks move. This is coevolution — the Red Queen's race, where you must keep running just to stay in place. Economies, species in an ecosystem, and AI systems competing in markets all live in shifting landscapes.",
      },
      {
        title: "4 · Nonlinearity, tipping points, and path dependence",
        body: "CAS rarely behave proportionally. Small nudges can trigger outsized responses (a rumor goes viral, a financial panic cascades, an ecosystem flips). They exhibit tipping points where system behavior suddenly shifts regime, and path dependence where early accidents lock in long-term structure (QWERTY keyboards, VHS beating Betamax). Because the dynamics are nonlinear, long-term prediction is often impossible even if the rules are fully known — CAS sit at the intersection of complexity and chaos.",
      },
      {
        title: "5 · Self-organization and the edge of chaos",
        body: "CAS often produce order without a designer. Flocks of birds form coordinated shapes; slime molds solve mazes; cities develop neighborhoods; markets discover prices. This is self-organization — structure emerging from local interaction alone. Systems seem richest when they operate at the 'edge of chaos': ordered enough to remember and transmit information, disordered enough to explore and adapt. Too rigid and nothing changes; too chaotic and nothing persists. Life, intelligence, and innovation seem to cluster in this narrow band.",
      },
      {
        title: "6 · How CAS is studied",
        body: "Agent-based modeling is the workhorse: simulate thousands of simple agents with local rules and watch macro patterns emerge (NetLogo, MASON). Network science analyzes the topology of interactions (scale-free networks, small-world networks). Statistical physics borrows tools from phase transitions and critical phenomena (Per Bak's self-organized criticality — avalanches in a sandpile, extinction events in ecosystems). Reinforcement learning formalizes adaptive agents. The Santa Fe Institute has been the field's intellectual home since 1984.",
      },
      {
        title: "7 · Where CAS thinking shows up",
        body: "Epidemiology (disease spread on contact networks), ecology (food webs and ecosystem resilience), economics (Brian Arthur's increasing returns, agent-based macro models after 2008), immunology (the immune system as a distributed learning network), urban planning (Jane Jacobs read cities as CAS decades before the term existed), AI (multi-agent systems, swarm robotics, emergent behavior in large models), organizational design (teams over hierarchies), and climate science (tipping elements in the Earth system). Wherever central control is impossible and prediction is brittle, CAS is the frame that fits.",
      },
      {
        title: "8 · Why it matters",
        body: "The 20th century built most of its theory on linear, equilibrium, centralized models. Many of the things we most want to understand — economies, ecosystems, minds, societies, technologies — don't fit those assumptions. CAS is the attempt to study these phenomena on their own terms: decentralized, adaptive, emergent, nonlinear. It doesn't give neat closed-form answers; it gives a different posture — humble about prediction, alert to feedback, attentive to structure — that has become indispensable wherever the old tools failed.",
      },
    ],
  },
  {
    slug: "chaos-theory",
    title: "Chaos Theory",
    summary:
      "How simple deterministic rules can produce unpredictable behavior — and why that unpredictability is not randomness.",
    systemPath:
      "Human Knowledge/Formal Sciences/Systems Science/Chaos Theory",
    breadcrumb: "Formal Sciences · Systems Science",
    category: "formal",
    kind: "theory",
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
    slug: "quantum-mechanics",
    title: "Quantum Mechanics",
    summary:
      "The physics of the very small — where particles behave as waves, measurement changes what's measured, and classical intuitions break down.",
    systemPath: "Human Knowledge/Natural Sciences/Physics/Quantum Mechanics",
    breadcrumb: "Natural Sciences · Physics",
    category: "natural",
    kind: "theory",
    thumbnail: "/QuantumMechanics.webp",
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
    slug: "standard-model",
    title: "Standard Model",
    summary:
      "The quantum field theory that classifies every known elementary particle and describes three of the four fundamental forces — arguably the most precisely tested theory in the history of science.",
    systemPath:
      "Human Knowledge/Natural Sciences/Physics/Quantum Mechanics/Quantum Field Theory/Standard Model",
    breadcrumb: "Natural Sciences · Physics",
    category: "natural",
    kind: "model",
    thumbnail: null,
    steps: [
      {
        title: "1 · What the Standard Model is",
        body: "The Standard Model is a quantum field theory that names every known elementary particle and specifies how they interact via three of the four fundamental forces: the electromagnetic, weak, and strong forces. It does not include gravity — that's the great unsolved seam. What it does include has been tested, in some cases to one part in a trillion, and it keeps winning. It is the backbone of particle physics from the 1970s to today.",
      },
      {
        title: "2 · Fermions: the matter particles",
        body: "Matter is built from twelve fermions (spin-½ particles), arranged in three generations that repeat in structure but not in mass. Each generation has two quarks (up/down, charm/strange, top/bottom) and two leptons (electron + electron neutrino, muon + muon neutrino, tau + tau neutrino). Ordinary matter uses only the first generation; the heavier generations exist but decay. Why exactly three generations? We don't know — it's one of the model's deep, unexplained facts.",
      },
      {
        title: "3 · Bosons: the force carriers",
        body: "Forces in the Standard Model are mediated by exchange of bosons (integer-spin particles). The photon carries electromagnetism; the W⁺, W⁻, and Z⁰ carry the weak force (responsible for beta decay and, via it, the Sun burning); eight gluons carry the strong force that binds quarks into protons, neutrons, and the nuclei they form. These interactions are dictated by gauge symmetries — U(1) × SU(2) × SU(3) — and that symmetry structure determines the particle content almost by itself.",
      },
      {
        title: "4 · The Higgs mechanism",
        body: "A pure gauge theory predicts that the W, Z, and all fermions should be massless — which is wildly wrong. Peter Higgs, Robert Brout, and François Englert proposed (1964) that the universe is filled with a scalar field whose vacuum state is not zero; particles acquire mass by interacting with this field. The scalar field's quantum is the Higgs boson. It was the last piece of the Standard Model to be discovered, at the LHC in 2012 — a fifty-year delay that nearly everyone thought would either succeed or upend physics.",
      },
      {
        title: "5 · How it was built",
        body: "The model assembled gradually from the 1960s on: QED (quantum electrodynamics) was unified with the weak force by Glashow, Weinberg, and Salam in the electroweak theory (Nobel 1979); quantum chromodynamics (QCD), the theory of the strong force, was built in the early 1970s on the discovery of asymptotic freedom (Gross, Politzer, Wilczek — Nobel 2004); the charm, bottom, and top quarks were predicted and then found; neutrinos turned out to have mass (not predicted in the original model) thanks to neutrino oscillation. Every time the model made a precise numerical prediction, experiment agreed.",
      },
      {
        title: "6 · What it gets spectacularly right",
        body: "The anomalous magnetic moment of the electron matches theory to about one part in 10¹². The masses and lifetimes of the W and Z bosons, the branching ratios of B-meson decays, the structure of jets at colliders — all agree with predictions at precision levels science rarely achieves anywhere. The LHC has now mapped the Higgs sector, tested symmetry violations, and looked for cracks. Decades of looking, and the model holds.",
      },
      {
        title: "7 · What it doesn't explain",
        body: "Gravity is not in the model. Dark matter and dark energy (about 95% of the universe's energy content) have no Standard Model candidates. The matter-antimatter asymmetry of the early universe isn't explained. The Higgs mass appears unnaturally fine-tuned. Neutrino masses exist but their origin (Majorana? Dirac?) is unknown. Why three generations? Why these particular gauge groups? Why these specific mixing angles and masses? The Standard Model is the most successful theory in physics and, at the same time, obviously incomplete.",
      },
      {
        title: "8 · What comes next",
        body: "Experimental effort is focused on precision measurements (muon g−2, neutrino oscillations, rare meson decays) looking for small deviations that would point beyond the model; and on direct searches at higher energies (LHC, future colliders) for new particles. Theoretical frameworks — supersymmetry, grand unified theories, string theory — each propose extensions, none yet confirmed. The best-kept secret of 21st-century physics is that our most successful model and our most interesting open problems both live at this exact seam.",
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
    kind: "theory",
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
    slug: "atomic-theory",
    title: "Atomic Theory",
    summary:
      "The idea that matter is made of discrete atoms — and the two centuries of experiments that turned a philosophical guess into modern chemistry.",
    systemPath: "Human Knowledge/Natural Sciences/Chemistry/Atomic Theory",
    breadcrumb: "Natural Sciences · Chemistry",
    category: "natural",
    kind: "theory",
    thumbnail: "/AtomicTheory.webp",
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
    slug: "theory-of-evolution",
    title: "Theory of Evolution",
    summary:
      "How heritable variation plus differential survival produces, over deep time, the complexity and diversity of all living things.",
    systemPath:
      "Human Knowledge/Natural Sciences/Biology/Evolutionary Biology",
    breadcrumb: "Natural Sciences · Biology",
    category: "natural",
    kind: "theory",
    thumbnail: "/TheoryOfEvolution.webp",
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
    slug: "biological-modularity",
    title: "Biological Modularity",
    summary:
      "The idea that organisms, genomes, and development are built from semi-independent units that can vary and evolve without breaking the whole — a central concept in evo-devo.",
    systemPath:
      "Human Knowledge/Natural Sciences/Biology/Evolutionary Biology/Modularity",
    breadcrumb: "Natural Sciences · Biology",
    category: "natural",
    kind: "modularity",
    thumbnail: null,
    steps: [
      {
        title: "1 · Why organisms aren't monoliths",
        body: "If every gene and every trait were tightly entangled with every other, evolution would be stuck — any mutation would push the whole phenotype around and almost certainly break something. In practice, organisms evolve. The reason is that biological systems are modular: they're built out of semi-autonomous units (body segments, organs, gene networks, protein domains) that can vary, duplicate, and be rewired without the rest collapsing. Modularity is what makes evolvability possible.",
      },
      {
        title: "2 · What a biological module is",
        body: "A module is a set of parts whose interactions are dense internally and sparse externally. A vertebrate limb is one: its skeleton, muscles, and innervation form a tightly coupled unit, connected to the rest of the body only through a few well-defined attachment and signaling points. The same pattern holds for protein domains, metabolic pathways, gene-regulatory networks, and developmental compartments. Identifying modules rigorously requires measuring which parts co-vary, which co-regulate, and which can be perturbed independently — an active area of quantitative biology.",
      },
      {
        title: "3 · Genetic modularity: toolkits and duplication",
        body: "Hox genes — the famous developmental master regulators — are the textbook example. A shared 'genetic toolkit' specifies body-plan coordinates across virtually all animals; different animals deploy the same modules in different combinations to build wildly different bodies. Gene duplication then lets a module diverge: one copy keeps the old job while the other is free to specialize. The jawed vertebrates owe much of their diversification to two rounds of whole-genome duplication deep in their lineage — a mass-produced supply of modules free to be repurposed.",
      },
      {
        title: "4 · Developmental modularity and evo-devo",
        body: "The evo-devo synthesis (1990s–2000s) made modularity central to evolutionary biology. Embryonic development proceeds through reusable 'modules' — the limb field, the somite, the neural tube — each under the control of a semi-independent gene-regulatory network. Evolution tinkers with the timing, location, or intensity of these modules (heterochrony, heterotopy) rather than inventing wholesale new machinery. Sean Carroll's 'Endless Forms Most Beautiful' (2005) popularized the argument: most evolutionary novelty is recombination and retuning of existing modules, not starting from scratch.",
      },
      {
        title: "5 · The evolution of modularity itself",
        body: "Where does modularity come from? Günter Wagner, Lee Altenberg, and others argued that natural selection favors modular architectures because they make organisms more evolvable — variation in one module doesn't wreck the others, so the population can explore more of phenotype space. Computational work (Kashtan & Alon, 2005) showed that modular networks emerge spontaneously when the selection target itself keeps changing — environments with 'modularly varying goals' push evolution toward modular solutions. Modularity is not a given; it's a product of evolutionary history.",
      },
      {
        title: "6 · Signatures and consequences",
        body: "Modular architectures leave fingerprints. Traits within a module co-vary (limb bones scale together); traits across modules vary more independently (limb vs. jaw). Genes inside a regulatory module are co-expressed; genes across modules often aren't. Mutations tend to produce focused rather than pleiotropic effects. The consequences are deep: cancer exploits modularity (a broken cell-cycle module metastasizes while the rest of the cell keeps running); regeneration relies on it (a lost limb can be regrown because the limb module is self-contained); and convergent evolution is rampant because the same modules get recruited independently in different lineages.",
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
    kind: "theory",
    thumbnail: "/PlateTectonics.webp",
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
    slug: "cognitive-theory",
    title: "Cognitive Theory",
    summary:
      "The framework that treats the mind as an information-processing system — thoughts, memory, attention, and learning studied as computation rather than behavior.",
    systemPath:
      "Human Knowledge/Social Sciences/Psychology/Cognitive Psychology",
    breadcrumb: "Social Sciences · Psychology",
    category: "social",
    kind: "theory",
    thumbnail: "/CognitiveTheory.webp",
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
    slug: "modularity-of-mind",
    title: "Modularity of Mind",
    summary:
      "Jerry Fodor's thesis that much of the mind is built from specialized, domain-specific processors — fast, automatic, encapsulated, and innate — rather than one general-purpose reasoning engine.",
    systemPath:
      "Human Knowledge/Professions & Interdisciplinary/Cognitive Science/Philosophy of Mind/Modularity of Mind",
    breadcrumb: "Professions & Interdisciplinary · Cognitive Science",
    category: "professions",
    kind: "modularity",
    thumbnail: null,
    steps: [
      {
        title: "1 · The question Fodor was asking",
        body: "By the late 1970s cognitive science had a language (computation over representations) but no clear picture of the mind's architecture. Was it a single general-purpose reasoner, a swarm of special-purpose devices, or something in between? Jerry Fodor's 1983 monograph 'The Modularity of Mind' offered a sharp, testable answer: a large portion of the mind is made of modules — specialized processing systems — while a smaller, slower 'central system' does general reasoning across their outputs. The proposal was influential precisely because Fodor committed to specific criteria that would decide whether a given mental system counted as modular.",
      },
      {
        title: "2 · Fodor's nine criteria",
        body: "A Fodorian module is: (1) domain-specific — it only operates on one kind of input (faces, syntax, edges); (2) mandatory — it fires automatically when its input arrives, you can't turn it off; (3) fast — on the order of milliseconds; (4) informationally encapsulated — it can't consult your beliefs or goals while running; (5) neurally localized — it lives in specific brain circuitry; (6) has characteristic breakdown patterns — brain damage produces selective deficits; (7) has a fixed neural architecture; (8) has limited central access — you don't introspect its internals; (9) develops on a characteristic ontogenetic schedule. The criteria cluster: real modules tend to score high on all of them.",
      },
      {
        title: "3 · The canonical example: vision",
        body: "The Müller-Lyer illusion is Fodor's favorite demonstration. Two lines with inward- or outward-pointing arrowheads look different lengths; they aren't. Critically, the illusion persists even after you've measured the lines and know they're equal. Your belief that they're the same can't reach down and fix the perceptual output — the visual system is informationally encapsulated. Low-level vision, face recognition, phoneme perception, and grammatical parsing all show the same pattern: fast, automatic, and stubborn in the face of top-down knowledge.",
      },
      {
        title: "4 · Central cognition is NOT modular",
        body: "Fodor's other, less-cited claim is nearly as important: not everything is a module. Central cognition — belief fixation, analogical reasoning, scientific theorizing, planning a vacation — is precisely the opposite of modular. It's slow, effortful, globally accessible (anything you know can, in principle, bear on anything else), and resists neat localization. Fodor argued this non-modularity is why general intelligence is hard: the central system has to search an unbounded space of relevant information. This pessimism about central cognition ('the first law of the non-existence of cognitive science') is the part most often left out of summaries.",
      },
      {
        title: "5 · Evolutionary psychology's massive modularity",
        body: "In the 1990s, Leda Cosmides, John Tooby, and Steven Pinker pushed Fodor's thesis much further: the whole mind, including 'central' reasoning, is a collection of evolved, domain-specific modules — cheater detection, kin recognition, mate choice, alliance tracking, mind-reading. Evidence came from the Wason selection task (people solve it when it's framed as cheater detection but fail on the abstract version), selective deficits in autism and Williams syndrome, and cross-cultural consistency in social-reasoning patterns. 'Massive modularity' is much stronger than Fodor's original claim — and much more contested.",
      },
      {
        title: "6 · The case against",
        body: "Critics — Jesse Prinz, Kim Sterelny, Fiona Cowie, neural-network theorists — push back on several fronts. Real cognitive systems leak: attention, expectation, and belief demonstrably modulate 'low-level' perception (top-down priors, Bayesian brain, predictive processing). Neuroimaging reveals overlapping, distributed networks rather than clean functional dissociations. And evolutionary arguments for specific modules often rest on 'just-so stories' — plausible but underdetermined by the evidence. The criteria themselves may pick out a gradient, not a natural kind.",
      },
      {
        title: "7 · The concept's afterlife",
        body: "Even where the strong thesis has been rejected, the vocabulary persists. Developmental psychology talks about 'core knowledge systems' (Spelke) — domain-specific early competences in object, number, agent, and space perception. Cognitive neuroscience catalogs 'functional specialization' without committing to full encapsulation. AI borrows the architecture: Transformers are monolithic; 'mixture of experts' models and modular meta-learning explicitly build specialized subnetworks that a gating mechanism routes between. Whether the mind is modular in Fodor's strict sense is still debated — but the question he crystallized is now how every serious theory of cognitive architecture has to define itself.",
      },
    ],
  },
];

export function findKnowledgeGalleryEntry(
  slug: string
): KnowledgeGalleryEntry | undefined {
  return KNOWLEDGE_GALLERY_ENTRIES.find((e) => e.slug === slug);
}


/**
 * Combined gallery entries. The order is `[...packEntries, ...legacyEntries]`
 * — once all entries migrate to `.md`, `LEGACY_ENTRIES` becomes `[]` and the
 * sci5th-side type definitions can be dropped in favor of importing
 * `HumanGalleryEntry` from `@brain5th/knowledge-human`.
 */
export const KNOWLEDGE_GALLERY_ENTRIES: ReadonlyArray<KnowledgeGalleryEntry> = [
  ...humanEntries,
  ...LEGACY_ENTRIES,
];

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
