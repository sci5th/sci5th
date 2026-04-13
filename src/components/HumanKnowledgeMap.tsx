"use client";

import { useState, useCallback } from "react";

// ── Types ────────────────────────────────────────────────────────────────────

type Tag = "sci" | "cs" | "ai" | "med" | "bio" | "bp";

interface KnowledgeNode {
  name: string;
  h?: string;  // highlight category
  t?: Tag;     // tag category
  o?: boolean; // open by default
  nw?: boolean; // new badge
  c?: KnowledgeNode[];
}

// ── Data ─────────────────────────────────────────────────────────────────────

const DATA: KnowledgeNode = {
  name: "Human knowledge",
  o: true,
  c: [
    {
      name: "Formal sciences", t: "sci", c: [
        {
          name: "Mathematics", c: [
            {
              name: "Pure mathematics", c: [
                { name: "Algebra", c: [{ name: "Linear algebra" }, { name: "Abstract algebra" }, { name: "Number theory" }] },
                { name: "Analysis", c: [{ name: "Real analysis" }, { name: "Complex analysis" }, { name: "Functional analysis" }] },
                { name: "Geometry & topology", c: [{ name: "Differential geometry" }, { name: "Algebraic topology" }, { name: "Knot theory" }] },
                { name: "Logic & foundations", c: [{ name: "Set theory" }, { name: "Model theory" }, { name: "Proof theory" }] },
              ],
            },
            {
              name: "Applied mathematics", c: [
                { name: "Statistics & probability" }, { name: "Numerical methods" }, { name: "Optimization" },
                { name: "Dynamical systems" }, { name: "Game theory" },
              ],
            },
          ],
        },
        {
          name: "Computer science", h: "cs", t: "cs", c: [
            {
              name: "Theoretical CS", c: [
                { name: "Algorithms & data structures" }, { name: "Computational complexity" },
                { name: "Automata & formal languages" }, { name: "Information theory" }, { name: "Cryptography" },
              ],
            },
            {
              name: "Systems", c: [
                { name: "Operating systems" }, { name: "Distributed systems" }, { name: "Databases" },
                { name: "Computer networks" }, { name: "Computer architecture" },
              ],
            },
            {
              name: "Software engineering", c: [
                { name: "Programming languages" }, { name: "Compilers" }, { name: "Software design patterns" },
                { name: "DevOps & CI/CD" }, { name: "Testing & verification" },
              ],
            },
            {
              name: "Artificial intelligence", h: "ai", t: "ai", c: [
                { name: "Machine learning", c: [{ name: "Supervised learning" }, { name: "Unsupervised learning" }, { name: "Reinforcement learning" }] },
                { name: "Deep learning", c: [{ name: "Neural network architectures" }, { name: "Transformers & attention" }, { name: "Generative models (GANs, diffusion)" }] },
                { name: "Natural language processing" }, { name: "Computer vision" }, { name: "Robotics & embodied AI" },
                { name: "Knowledge representation" }, { name: "AI safety & alignment" }, { name: "Foundation models & LLMs" },
              ],
            },
            { name: "Human-computer interaction" }, { name: "Computer graphics" }, { name: "Cybersecurity" },
          ],
        },
        { name: "Logic", c: [{ name: "Formal logic" }, { name: "Mathematical logic" }, { name: "Philosophical logic" }] },
        { name: "Systems science", c: [{ name: "Cybernetics" }, { name: "Complex systems" }, { name: "Chaos theory" }] },
      ],
    },
    {
      name: "Natural sciences", t: "sci", c: [
        {
          name: "Physics", c: [
            { name: "Classical mechanics" }, { name: "Quantum mechanics" }, { name: "Thermodynamics" },
            { name: "Electromagnetism" }, { name: "Relativity" }, { name: "Particle physics" },
            { name: "Condensed matter" }, { name: "Astrophysics & cosmology" },
          ],
        },
        {
          name: "Chemistry", c: [
            { name: "Organic chemistry" }, { name: "Inorganic chemistry" }, { name: "Physical chemistry" },
            { name: "Analytical chemistry" }, { name: "Biochemistry" },
          ],
        },
        {
          name: "Biology", c: [
            { name: "Molecular biology" }, { name: "Cell biology" }, { name: "Genetics & genomics" },
            { name: "Evolutionary biology" }, { name: "Ecology" }, { name: "Microbiology" },
            { name: "Neuroscience" }, { name: "Botany" }, { name: "Zoology" },
          ],
        },
        { name: "Earth sciences", c: [{ name: "Geology" }, { name: "Meteorology & climatology" }, { name: "Oceanography" }, { name: "Paleontology" }] },
        { name: "Astronomy", c: [{ name: "Observational astronomy" }, { name: "Planetary science" }, { name: "Stellar astrophysics" }] },
      ],
    },
    {
      name: "Applied sciences & technology", c: [
        {
          name: "Engineering", c: [
            { name: "Mechanical engineering" }, { name: "Electrical engineering" }, { name: "Civil engineering" },
            { name: "Chemical engineering" }, { name: "Aerospace engineering" }, { name: "Biomedical engineering" },
          ],
        },
        {
          name: "Biotechnology", h: "bio", t: "bio", c: [
            {
              name: "Genetic engineering & gene editing", c: [
                { name: "CRISPR-Cas systems" }, { name: "Recombinant DNA technology" }, { name: "Gene therapy" },
              ],
            },
            {
              name: "Pharmaceutical biotechnology", c: [
                { name: "Drug development & biologics" }, { name: "Vaccine technology" }, { name: "Monoclonal antibodies" },
              ],
            },
            {
              name: "Industrial biotechnology", c: [
                { name: "Biofuels & bioenergy" }, { name: "Fermentation technology" }, { name: "Biomaterials" },
              ],
            },
            {
              name: "Agricultural biotechnology", c: [
                { name: "GMOs & crop science" }, { name: "Biopesticides" }, { name: "Plant tissue culture" },
              ],
            },
            {
              name: "Environmental biotechnology", c: [
                { name: "Bioremediation" }, { name: "Waste treatment" }, { name: "Biosensors" },
              ],
            },
            {
              name: "Synthetic biology", c: [
                {
                  name: "Bioprogramming", h: "bp", t: "bp", nw: true, c: [
                    { name: "Genetic circuit design", nw: true },
                    { name: "Biological logic gates", nw: true },
                    { name: "DNA-based programming languages", nw: true },
                    { name: "Cell-as-computer paradigms", nw: true },
                    { name: "Biocompilation & genetic compilers", nw: true },
                    { name: "Metabolic pathway programming", nw: true },
                  ],
                },
                { name: "Minimal genomes" }, { name: "Xenobiology" }, { name: "Protocell engineering" },
              ],
            },
            { name: "Nanobiotechnology" }, { name: "Bioprocess engineering" },
          ],
        },
        {
          name: "Medicine & health sciences", h: "med", t: "med", c: [
            {
              name: "Clinical medicine", c: [
                { name: "Internal medicine" }, { name: "Surgery" }, { name: "Pediatrics" }, { name: "Psychiatry" },
                { name: "Obstetrics & gynecology" }, { name: "Emergency medicine" }, { name: "Radiology" }, { name: "Oncology" },
              ],
            },
            {
              name: "Basic medical sciences", c: [
                { name: "Anatomy" }, { name: "Physiology" }, { name: "Pathology" },
                { name: "Pharmacology" }, { name: "Immunology" }, { name: "Medical genetics" },
              ],
            },
            {
              name: "Public health", c: [
                { name: "Epidemiology" }, { name: "Biostatistics" }, { name: "Health policy" }, { name: "Global health" },
              ],
            },
            {
              name: "Allied health", c: [
                { name: "Nursing" }, { name: "Physical therapy" }, { name: "Nutrition science" }, { name: "Dentistry" },
              ],
            },
            { name: "Biomedical informatics" },
            { name: "Medical AI & diagnostics", h: "ai", t: "ai" },
          ],
        },
        { name: "Agriculture & food science" }, { name: "Environmental science" },
        { name: "Materials science" }, { name: "Information science & library science" },
      ],
    },
    {
      name: "Social sciences", c: [
        { name: "Economics", c: [{ name: "Microeconomics" }, { name: "Macroeconomics" }, { name: "Behavioral economics" }, { name: "Econometrics" }] },
        { name: "Psychology", c: [{ name: "Cognitive psychology" }, { name: "Developmental psychology" }, { name: "Social psychology" }, { name: "Clinical psychology" }] },
        { name: "Sociology" }, { name: "Political science" }, { name: "Anthropology" },
        {
          name: "Linguistics", c: [
            { name: "Phonetics & phonology" }, { name: "Syntax & semantics" },
            { name: "Computational linguistics", h: "ai", t: "ai" }, { name: "Sociolinguistics" },
          ],
        },
        { name: "Geography" }, { name: "Law" }, { name: "Education" }, { name: "Communication studies" },
      ],
    },
    {
      name: "Humanities", c: [
        {
          name: "Philosophy", c: [
            { name: "Metaphysics" }, { name: "Epistemology" }, { name: "Ethics" },
            { name: "Aesthetics" }, { name: "Philosophy of mind" }, { name: "Philosophy of science" },
          ],
        },
        {
          name: "History", c: [
            { name: "Ancient history" }, { name: "Medieval history" }, { name: "Modern history" }, { name: "History of science" },
          ],
        },
        { name: "Literature & literary studies" }, { name: "Religious studies & theology" },
        { name: "Art history & visual arts" }, { name: "Music & musicology" }, { name: "Performing arts" },
        { name: "Digital humanities", h: "cs", t: "cs" },
      ],
    },
    {
      name: "Professions & interdisciplinary", c: [
        {
          name: "Business & management", c: [
            { name: "Finance" }, { name: "Marketing" }, { name: "Operations" }, { name: "Strategy" },
          ],
        },
        {
          name: "Design", c: [
            { name: "Graphic design" }, { name: "Industrial design" }, { name: "UX/UI design" },
          ],
        },
        { name: "Journalism & media" }, { name: "Military science" },
        { name: "Data science", h: "cs", t: "cs" }, { name: "Bioinformatics", h: "cs", t: "cs" },
        {
          name: "Cognitive science", c: [
            { name: "Philosophy of mind" }, { name: "AI & cognition", h: "ai", t: "ai" },
            { name: "Neuroscience" }, { name: "Linguistics" },
          ],
        },
      ],
    },
  ],
};

// ── Tag labels ────────────────────────────────────────────────────────────────

const TAG_LABELS: Record<Tag, string> = {
  sci: "SCI",
  cs: "CS",
  ai: "AI",
  med: "MED",
  bio: "BIO",
  bp: "BIOPROG",
};

// ── Tree node component ───────────────────────────────────────────────────────

function TreeNode({ node, query }: { node: KnowledgeNode; query: string }) {
  const [open, setOpen] = useState(node.o ?? false);
  const hasChildren = !!node.c?.length;

  const toggle = useCallback(() => {
    if (hasChildren) setOpen((v) => !v);
  }, [hasChildren]);

  // colour highlight class
  const hlClass = node.h ? `hl-${node.h}` : "";

  return (
    <div>
      <div
        className={`node ${hlClass}`}
        onClick={toggle}
        role={hasChildren ? "button" : undefined}
        aria-expanded={hasChildren ? open : undefined}
      >
        <span className="ic">{hasChildren ? (open ? "▾" : "▸") : "·"}</span>
        <span className="lb">
          {hasChildren ? "📁" : "📄"} {node.name}
          {node.t && (
            <span className={`tg tg-${node.t}`}>{TAG_LABELS[node.t]}</span>
          )}
          {node.nw && <span className="new-badge">NEW</span>}
        </span>
      </div>
      {hasChildren && (
        <div className="ch" style={{ display: open ? "block" : "none" }}>
          {node.c!.map((child) => (
            <TreeNode key={child.name} node={child} query={query} />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Build path list for export ────────────────────────────────────────────────

function buildPaths(node: KnowledgeNode, prefix = ""): string[] {
  const path = prefix ? `${prefix}/${node.name}` : node.name;
  const result: string[] = [path];
  if (node.c) {
    for (const child of node.c) result.push(...buildPaths(child, path));
  }
  return result;
}

// ── Filtered tree (search) ────────────────────────────────────────────────────

function FilteredNode({ node, query }: { node: KnowledgeNode; query: string }) {
  const q = query.toLowerCase().trim();

  // Does this node or any descendant match?
  function matches(n: KnowledgeNode): boolean {
    if (n.name.toLowerCase().includes(q)) return true;
    return n.c?.some(matches) ?? false;
  }

  if (!matches(node)) return null;

  const hasChildren = !!node.c?.length;
  const hlClass = node.h ? `hl-${node.h}` : "";

  return (
    <div>
      <div className={`node ${hlClass}`}>
        <span className="ic">{hasChildren ? "▾" : "·"}</span>
        <span className="lb">
          {hasChildren ? "📁" : "📄"} {node.name}
          {node.t && (
            <span className={`tg tg-${node.t}`}>{TAG_LABELS[node.t]}</span>
          )}
          {node.nw && <span className="new-badge">NEW</span>}
        </span>
      </div>
      {hasChildren && (
        <div className="ch">
          {node.c!.filter(matches).map((child) => (
            <FilteredNode key={child.name} node={child} query={query} />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function HumanKnowledgeMap() {
  const [query, setQuery] = useState("");
  const [expandKey, setExpandKey] = useState(0);
  const [collapseKey, setCollapseKey] = useState(0);
  const [showCode, setShowCode] = useState(false);
  const [copied, setCopied] = useState(false);

  const codeContent =
    "KNOWLEDGE_MAP = [\n" +
    buildPaths(DATA)
      .map((p) => `  "${p.replace(/"/g, '\\"')}"`)
      .join(",\n") +
    "\n]";

  function handleExport() {
    setShowCode((v) => !v);
    if (!showCode && navigator.clipboard) {
      navigator.clipboard.writeText(codeContent).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  }

  // expand/collapse all: re-mount tree with forced open/close state via key
  function expandAll() {
    setExpandKey((k) => k + 1);
  }
  function collapseAll() {
    setCollapseKey((k) => k + 1);
  }

  const isFiltering = query.trim().length > 0;

  return (
    <>
      <style>{`
        /* ── CSS variables (light / dark) ── */
        .km-root {
          --bg:  #fafaf8; --bg2: #f2f1ed; --bg3: #e8e7e3;
          --text: #1a1a18; --text2: #6b6a65; --text3: #9c9a92;
          --border: rgba(0,0,0,0.1);
          --sci: #1D9E75; --sci-bg: #E1F5EE; --sci-tx: #0F6E56;
          --cs:  #378ADD; --cs-bg:  #E6F1FB; --cs-tx:  #185FA5;
          --ai:  #7F77DD; --ai-bg:  #EEEDFE; --ai-tx:  #534AB7;
          --med: #D85A30; --med-bg: #FAECE7; --med-tx: #993C1D;
          --bio: #639922; --bio-bg: #EAF3DE; --bio-tx: #3B6D11;
          --bp:  #D4537E; --bp-bg:  #FBEAF0; --bp-tx:  #993556;
          font-family: 'DM Sans', 'DM Sans fallback', sans-serif;
        }
        @media (prefers-color-scheme: dark) {
          .km-root {
            --bg: #1a1a18; --bg2: #2c2c2a; --bg3: #3d3d3a;
            --text: #e8e7e3; --text2: #9c9a92; --text3: #6b6a65;
            --border: rgba(255,255,255,0.1);
            --sci: #5DCAA5; --sci-bg: #085041; --sci-tx: #9FE1CB;
            --cs:  #85B7EB; --cs-bg:  #0C447C; --cs-tx:  #B5D4F4;
            --ai:  #AFA9EC; --ai-bg:  #3C3489; --ai-tx:  #CECBF6;
            --med: #F0997B; --med-bg: #712B13; --med-tx: #F5C4B3;
            --bio: #97C459; --bio-bg: #27500A; --bio-tx: #C0DD97;
            --bp:  #ED93B1; --bp-bg:  #72243E; --bp-tx:  #F4C0D1;
          }
        }

        /* ── Layout ── */
        .km-root { background: var(--bg); color: var(--text); padding: 2rem; border-radius: 12px; }
        .km-title { font-size: 1.5rem; font-weight: 600; letter-spacing: -0.02em; margin-bottom: 0.2rem; }
        .km-subtitle { color: var(--text2); font-size: 0.875rem; margin-bottom: 1.25rem; }

        /* ── Legend ── */
        .km-legend { display: flex; gap: 14px; flex-wrap: wrap; margin-bottom: 1.25rem; font-size: 12px; color: var(--text2); }
        .km-legend-item { display: flex; align-items: center; gap: 5px; }
        .km-dot { width: 8px; height: 8px; border-radius: 50%; display: inline-block; }

        /* ── Toolbar ── */
        .km-toolbar { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; margin-bottom: 1rem; }
        .km-search {
          flex: 1; min-width: 200px; padding: 8px 12px; font-size: 13px;
          border: 1px solid var(--border); border-radius: 8px;
          background: var(--bg2); color: var(--text); outline: none; transition: border-color 0.2s;
        }
        .km-search:focus { border-color: var(--cs); }
        .km-btn {
          padding: 6px 14px; font-size: 12px; font-weight: 500;
          border: 1px solid var(--border); border-radius: 8px;
          background: var(--bg2); color: var(--text2);
          cursor: pointer; transition: all 0.15s; user-select: none;
        }
        .km-btn:hover { background: var(--bg3); color: var(--text); }
        .km-btn:active { transform: scale(0.97); }

        /* ── Tree ── */
        .km-tree { font-family: 'JetBrains Mono', monospace; font-size: 13px; line-height: 1.9; }
        .node {
          cursor: pointer; user-select: none; white-space: nowrap;
          display: flex; align-items: center; padding: 1px 6px; border-radius: 6px; transition: background 0.12s;
        }
        .node:hover { background: var(--bg2); }
        .ic { width: 16px; text-align: center; margin-right: 4px; flex-shrink: 0; font-size: 11px; color: var(--text3); }
        .lb { flex: 1; }
        .ch { padding-left: 20px; border-left: 1px solid var(--border); margin-left: 9px; }

        /* ── Highlights ── */
        .hl-sci .lb { color: var(--sci); font-weight: 500; }
        .hl-cs  .lb { color: var(--cs);  font-weight: 500; }
        .hl-ai  .lb { color: var(--ai);  font-weight: 500; }
        .hl-med .lb { color: var(--med); font-weight: 500; }
        .hl-bio .lb { color: var(--bio); font-weight: 500; }
        .hl-bp  .lb { color: var(--bp);  font-weight: 500; }

        /* ── Tags ── */
        .tg {
          font-size: 9px; font-weight: 600; letter-spacing: 0.04em;
          padding: 1px 7px; border-radius: 10px; margin-left: 8px; vertical-align: middle;
          font-family: 'DM Sans', sans-serif;
        }
        .tg-sci { background: var(--sci-bg); color: var(--sci-tx); }
        .tg-cs  { background: var(--cs-bg);  color: var(--cs-tx);  }
        .tg-ai  { background: var(--ai-bg);  color: var(--ai-tx);  }
        .tg-med { background: var(--med-bg); color: var(--med-tx); }
        .tg-bio { background: var(--bio-bg); color: var(--bio-tx); }
        .tg-bp  { background: var(--bp-bg);  color: var(--bp-tx);  }

        /* ── New badge ── */
        .new-badge {
          font-size: 9px; font-weight: 600; font-family: 'DM Sans', sans-serif;
          padding: 1px 5px; border-radius: 9px; margin-left: 4px;
          background: #FCEBEB; color: #A32D2D;
        }
        @media (prefers-color-scheme: dark) {
          .new-badge { background: #501313; color: #F09595; }
        }

        /* ── Code export ── */
        .km-code {
          font-size: 12px; font-family: 'JetBrains Mono', monospace;
          background: var(--bg2); color: var(--text);
          padding: 16px; border-radius: 10px;
          margin-top: 14px; overflow-x: auto; white-space: pre;
          border: 1px solid var(--border); max-height: 400px; overflow-y: auto;
        }
      `}</style>

      <div className="km-root">
        <h2 className="km-title">Map of human knowledge</h2>
        <p className="km-subtitle">Interactive folder tree — click to expand, search to filter, export as code</p>

        {/* Legend */}
        <div className="km-legend">
          {(
            [
              ["--sci", "Science"],
              ["--cs", "Computer science"],
              ["--ai", "AI"],
              ["--med", "Medicine"],
              ["--bio", "Biotechnology"],
              ["--bp", "Bioprogramming"],
            ] as [string, string][]
          ).map(([varName, label]) => (
            <span key={label} className="km-legend-item">
              <span className="km-dot" style={{ background: `var(${varName})` }} />
              {label}
            </span>
          ))}
        </div>

        {/* Toolbar */}
        <div className="km-toolbar">
          <input
            className="km-search"
            type="text"
            placeholder="Search domains..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button className="km-btn" onClick={expandAll}>Expand all</button>
          <button className="km-btn" onClick={collapseAll}>Collapse all</button>
          <button className="km-btn" onClick={handleExport}>
            {showCode ? "Hide code" : "Export as code"}
            {copied && " ✓"}
          </button>
        </div>

        {/* Tree */}
        <div className="km-tree">
          {isFiltering ? (
            <FilteredNode key={`filter-${query}`} node={DATA} query={query} />
          ) : (
            <ExpandableTree key={`tree-${expandKey}-${collapseKey}`} node={DATA} forceOpen={expandKey > collapseKey ? true : collapseKey > expandKey ? false : undefined} depth={0} />
          )}
        </div>

        {/* Code export */}
        {showCode && (
          <pre className="km-code">{codeContent}</pre>
        )}
      </div>
    </>
  );
}

// ── Expandable tree with forced open/close ────────────────────────────────────

function ExpandableTree({
  node,
  forceOpen,
  depth,
}: {
  node: KnowledgeNode;
  forceOpen: boolean | undefined;
  depth: number;
}) {
  const defaultOpen = forceOpen !== undefined ? forceOpen : (node.o ?? false);
  const [open, setOpen] = useState(defaultOpen);
  const hasChildren = !!node.c?.length;
  const hlClass = node.h ? `hl-${node.h}` : "";

  return (
    <div>
      <div
        className={`node ${hlClass}`}
        onClick={() => hasChildren && setOpen((v) => !v)}
        role={hasChildren ? "button" : undefined}
        aria-expanded={hasChildren ? open : undefined}
      >
        <span className="ic">{hasChildren ? (open ? "▾" : "▸") : "·"}</span>
        <span className="lb">
          {hasChildren ? "📁" : "📄"} {node.name}
          {node.t && (
            <span className={`tg tg-${node.t}`}>{TAG_LABELS[node.t]}</span>
          )}
          {node.nw && <span className="new-badge">NEW</span>}
        </span>
      </div>
      {hasChildren && open && (
        <div className="ch">
          {node.c!.map((child) => (
            <ExpandableTree
              key={child.name}
              node={child}
              forceOpen={forceOpen}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}
