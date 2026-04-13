"use client";

import { useState, useCallback } from "react";

// ── Types ────────────────────────────────────────────────────────────────────

interface KnowledgeNode {
  name: string;
  o?: boolean; // open by default
  c?: KnowledgeNode[];
}

// ── Data ─────────────────────────────────────────────────────────────────────

const DATA: KnowledgeNode = {
  name: "Human Knowledge",
  o: true,
  c: [
    {
      name: "Formal Sciences",
      c: [
        {
          name: "Mathematics",
          c: [
            {
              name: "Pure Mathematics",
              c: [
                {
                  name: "Algebra",
                  c: [
                    { name: "Linear Algebra" },
                    { name: "Abstract Algebra" },
                    { name: "Number Theory" },
                  ],
                },
                {
                  name: "Analysis",
                  c: [
                    { name: "Real Analysis" },
                    { name: "Complex Analysis" },
                    { name: "Functional Analysis" },
                  ],
                },
                {
                  name: "Geometry & Topology",
                  c: [
                    { name: "Differential Geometry" },
                    { name: "Algebraic Topology" },
                    { name: "Knot Theory" },
                  ],
                },
                {
                  name: "Logic & Foundations",
                  c: [
                    { name: "Set Theory" },
                    { name: "Model Theory" },
                    { name: "Proof Theory" },
                  ],
                },
              ],
            },
            {
              name: "Applied Mathematics",
              c: [
                { name: "Statistics & Probability" },
                { name: "Numerical Methods" },
                { name: "Optimization" },
                { name: "Dynamical Systems" },
                { name: "Game Theory" },
              ],
            },
          ],
        },
        {
          name: "Computer Science",
          c: [
            {
              name: "Theoretical CS",
              c: [
                { name: "Algorithms & Data Structures" },
                { name: "Computational Complexity" },
                { name: "Automata & Formal Languages" },
                { name: "Information Theory" },
                { name: "Cryptography" },
              ],
            },
            {
              name: "Systems",
              c: [
                { name: "Operating Systems" },
                { name: "Distributed Systems" },
                { name: "Databases" },
                { name: "Computer Networks" },
                { name: "Computer Architecture" },
              ],
            },
            {
              name: "Software Engineering",
              c: [
                { name: "Programming Languages" },
                { name: "Compilers" },
                { name: "Software Design Patterns" },
                { name: "DevOps & CI/CD" },
                { name: "Testing & Verification" },
              ],
            },
            {
              name: "Artificial Intelligence",
              c: [
                {
                  name: "Machine Learning",
                  c: [
                    { name: "Supervised Learning" },
                    { name: "Unsupervised Learning" },
                    { name: "Reinforcement Learning" },
                  ],
                },
                {
                  name: "Deep Learning",
                  c: [
                    { name: "Neural Network Architectures" },
                    { name: "Transformers & Attention" },
                    { name: "Generative Models (GANs, Diffusion)" },
                  ],
                },
                { name: "Natural Language Processing" },
                { name: "Computer Vision" },
                { name: "Robotics & Embodied AI" },
                { name: "Knowledge Representation" },
                { name: "AI Safety & Alignment" },
                { name: "Foundation Models & LLMs" },
              ],
            },
            { name: "Human-Computer Interaction" },
            { name: "Computer Graphics" },
            { name: "Cybersecurity" },
          ],
        },
        {
          name: "Logic",
          c: [
            { name: "Formal Logic" },
            { name: "Mathematical Logic" },
            { name: "Philosophical Logic" },
          ],
        },
        {
          name: "Systems Science",
          c: [
            { name: "Cybernetics" },
            { name: "Complex Systems" },
            { name: "Chaos Theory" },
          ],
        },
      ],
    },
    {
      name: "Natural Sciences",
      c: [
        {
          name: "Physics",
          c: [
            { name: "Classical Mechanics" },
            { name: "Quantum Mechanics" },
            { name: "Thermodynamics" },
            { name: "Electromagnetism" },
            { name: "Relativity" },
            { name: "Particle Physics" },
            { name: "Condensed Matter" },
            { name: "Astrophysics & Cosmology" },
          ],
        },
        {
          name: "Chemistry",
          c: [
            { name: "Organic Chemistry" },
            { name: "Inorganic Chemistry" },
            { name: "Physical Chemistry" },
            { name: "Analytical Chemistry" },
            { name: "Biochemistry" },
          ],
        },
        {
          name: "Biology",
          c: [
            { name: "Molecular Biology" },
            { name: "Cell Biology" },
            { name: "Genetics & Genomics" },
            { name: "Evolutionary Biology" },
            { name: "Ecology" },
            { name: "Microbiology" },
            { name: "Neuroscience" },
            { name: "Botany" },
            { name: "Zoology" },
          ],
        },
        {
          name: "Earth Sciences",
          c: [
            { name: "Geology" },
            { name: "Meteorology & Climatology" },
            { name: "Oceanography" },
            { name: "Paleontology" },
          ],
        },
        {
          name: "Astronomy",
          c: [
            { name: "Observational Astronomy" },
            { name: "Planetary Science" },
            { name: "Stellar Astrophysics" },
          ],
        },
      ],
    },
    {
      name: "Applied Sciences & Technology",
      c: [
        {
          name: "Engineering",
          c: [
            { name: "Mechanical Engineering" },
            { name: "Electrical Engineering" },
            { name: "Civil Engineering" },
            { name: "Chemical Engineering" },
            { name: "Aerospace Engineering" },
            { name: "Biomedical Engineering" },
          ],
        },
        {
          name: "Biotechnology",
          c: [
            {
              name: "Genetic Engineering & Gene Editing",
              c: [
                { name: "CRISPR-Cas Systems" },
                { name: "Recombinant DNA Technology" },
                { name: "Gene Therapy" },
              ],
            },
            {
              name: "Pharmaceutical Biotechnology",
              c: [
                { name: "Drug Development & Biologics" },
                { name: "Vaccine Technology" },
                { name: "Monoclonal Antibodies" },
              ],
            },
            {
              name: "Industrial Biotechnology",
              c: [
                { name: "Biofuels & Bioenergy" },
                { name: "Fermentation Technology" },
                { name: "Biomaterials" },
              ],
            },
            {
              name: "Agricultural Biotechnology",
              c: [
                { name: "GMOs & Crop Science" },
                { name: "Biopesticides" },
                { name: "Plant Tissue Culture" },
              ],
            },
            {
              name: "Environmental Biotechnology",
              c: [
                { name: "Bioremediation" },
                { name: "Waste Treatment" },
                { name: "Biosensors" },
              ],
            },
            {
              name: "Synthetic Biology",
              c: [
                {
                  name: "Bioprogramming",
                  c: [
                    { name: "Genetic Circuit Design" },
                    { name: "Biological Logic Gates" },
                    { name: "DNA-based Programming Languages" },
                    { name: "Cell-as-Computer Paradigms" },
                    { name: "Biocompilation & Genetic Compilers" },
                    { name: "Metabolic Pathway Programming" },
                  ],
                },
                { name: "Minimal Genomes" },
                { name: "Xenobiology" },
                { name: "Protocell Engineering" },
              ],
            },
            { name: "Nanobiotechnology" },
            { name: "Bioprocess Engineering" },
          ],
        },
        {
          name: "Medicine & Health Sciences",
          c: [
            {
              name: "Clinical Medicine",
              c: [
                { name: "Internal Medicine" },
                { name: "Surgery" },
                { name: "Pediatrics" },
                { name: "Psychiatry" },
                { name: "Obstetrics & Gynecology" },
                { name: "Emergency Medicine" },
                { name: "Radiology" },
                { name: "Oncology" },
              ],
            },
            {
              name: "Basic Medical Sciences",
              c: [
                { name: "Anatomy" },
                { name: "Physiology" },
                { name: "Pathology" },
                { name: "Pharmacology" },
                { name: "Immunology" },
                { name: "Medical Genetics" },
              ],
            },
            {
              name: "Public Health",
              c: [
                { name: "Epidemiology" },
                { name: "Biostatistics" },
                { name: "Health Policy" },
                { name: "Global Health" },
              ],
            },
            {
              name: "Allied Health",
              c: [
                { name: "Nursing" },
                { name: "Physical Therapy" },
                { name: "Nutrition Science" },
                { name: "Dentistry" },
              ],
            },
            { name: "Biomedical Informatics" },
            { name: "Medical AI & Diagnostics" },
          ],
        },
        { name: "Agriculture & Food Science" },
        { name: "Environmental Science" },
        { name: "Materials Science" },
        { name: "Information Science & Library Science" },
      ],
    },
    {
      name: "Social Sciences",
      c: [
        {
          name: "Economics",
          c: [
            { name: "Microeconomics" },
            { name: "Macroeconomics" },
            { name: "Behavioral Economics" },
            { name: "Econometrics" },
          ],
        },
        {
          name: "Psychology",
          c: [
            { name: "Cognitive Psychology" },
            { name: "Developmental Psychology" },
            { name: "Social Psychology" },
            { name: "Clinical Psychology" },
          ],
        },
        { name: "Sociology" },
        { name: "Political Science" },
        { name: "Anthropology" },
        {
          name: "Linguistics",
          c: [
            { name: "Phonetics & Phonology" },
            { name: "Syntax & Semantics" },
            { name: "Computational Linguistics" },
            { name: "Sociolinguistics" },
          ],
        },
        { name: "Geography" },
        { name: "Law" },
        { name: "Education" },
        { name: "Communication Studies" },
      ],
    },
    {
      name: "Humanities",
      c: [
        {
          name: "Philosophy",
          c: [
            { name: "Metaphysics" },
            { name: "Epistemology" },
            { name: "Ethics" },
            { name: "Aesthetics" },
            { name: "Philosophy of Mind" },
            { name: "Philosophy of Science" },
          ],
        },
        {
          name: "History",
          c: [
            { name: "Ancient History" },
            { name: "Medieval History" },
            { name: "Modern History" },
            { name: "History of Science" },
          ],
        },
        { name: "Literature & Literary Studies" },
        { name: "Religious Studies & Theology" },
        { name: "Art History & Visual Arts" },
        { name: "Music & Musicology" },
        { name: "Performing Arts" },
        { name: "Digital Humanities" },
      ],
    },
    {
      name: "Professions & Interdisciplinary",
      c: [
        {
          name: "Business & Management",
          c: [
            { name: "Finance" },
            { name: "Marketing" },
            { name: "Operations" },
            { name: "Strategy" },
          ],
        },
        {
          name: "Design",
          c: [
            { name: "Graphic Design" },
            { name: "Industrial Design" },
            { name: "UX/UI Design" },
          ],
        },
        { name: "Journalism & Media" },
        { name: "Military Science" },
        { name: "Data Science" },
        { name: "Bioinformatics" },
        {
          name: "Cognitive Science",
          c: [
            { name: "Philosophy of Mind" },
            { name: "AI & Cognition" },
            { name: "Neuroscience" },
            { name: "Linguistics" },
          ],
        },
      ],
    },
  ],
};

// ── Tree node component ───────────────────────────────────────────────────────

function TreeNode({
  node,
  query,
  depth = 0,
}: {
  node: KnowledgeNode;
  query: string;
  depth?: number;
}) {
  const [open, setOpen] = useState(node.o ?? false);
  const hasChildren = !!node.c?.length;

  const toggle = useCallback(() => {
    if (hasChildren) setOpen((v) => !v);
  }, [hasChildren]);

  return (
    <div>
      <div
        className={`node depth-${Math.min(depth, 6)}`}
        onClick={toggle}
        role={hasChildren ? "button" : undefined}
        aria-expanded={hasChildren ? open : undefined}
      >
        <span className="ic">{hasChildren ? (open ? "▾" : "▸") : "·"}</span>
        <span className="lb">
          {hasChildren ? "📁" : "📄"} {node.name}
        </span>
      </div>
      {hasChildren && (
        <div className="ch" style={{ display: open ? "block" : "none" }}>
          {node.c!.map((child) => (
            <TreeNode
              key={child.name}
              node={child}
              query={query}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Filtered tree (search) ────────────────────────────────────────────────────

function FilteredNode({
  node,
  query,
  depth = 0,
}: {
  node: KnowledgeNode;
  query: string;
  depth?: number;
}) {
  const q = query.toLowerCase().trim();

  // Does this node or any descendant match?
  function matches(n: KnowledgeNode): boolean {
    if (n.name.toLowerCase().includes(q)) return true;
    return n.c?.some(matches) ?? false;
  }

  if (!matches(node)) return null;

  const hasChildren = !!node.c?.length;

  return (
    <div>
      <div className={`node depth-${Math.min(depth, 6)}`}>
        <span className="ic">{hasChildren ? "▾" : "·"}</span>
        <span className="lb">
          {hasChildren ? "📁" : "📄"} {node.name}
        </span>
      </div>
      {hasChildren && (
        <div className="ch">
          {node.c!.filter(matches).map((child) => (
            <FilteredNode
              key={child.name}
              node={child}
              query={query}
              depth={depth + 1}
            />
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
          --bg: #1a1a1a; --bg2: #2a2a2a; --bg3: #3a3a3a;
          --text: #e8e7e3; --text2: #9c9a92; --text3: #6b6a65; --text4:#E06C75;
          --border: rgba(255,255,255,0.1);
          --accent: #85B7EB;
          font-family: 'DM Sans', 'DM Sans fallback', sans-serif;
        }

        /* ── Layout ── */
        .km-root { background: var(--bg); color: var(--text); padding: 2rem; border-radius: 12px; }
        .km-title { font-size: 1.75rem; font-weight: 400; letter-spacing: -0.02em; margin-bottom: 0.2rem; text-align: center; }
        .km-subtitle { color: var(--text4); font-size: 0.875rem; margin-bottom: 1.25rem; text-align: center; }

        /* ── Toolbar ── */
        .km-toolbar { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; margin-bottom: 1rem; }
        .km-search {
          flex: 1; min-width: 200px; padding: 8px 12px; font-size: 13px;
          border: 1px solid var(--border); border-radius: 8px;
          background: var(--bg2); color: var(--text); outline: none; transition: border-color 0.2s;
        }
        .km-search:focus { border-color: var(--accent); }
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
        .ic { width: 16px; text-align: center; margin-right: 4px; flex-shrink: 0; font-size: 14px; color: var(--text3); }
        .lb { flex: 1; }
        .ch { padding-left: 20px; border-left: 1px solid var(--border); margin-left: 9px; }

        /* ── Depth colors ── */
        .depth-0 .lb { color: #5DCAA5; }
        .depth-1 .lb { color: #61AFEF; }
        .depth-2 .lb { color: #C678DD; }
        .depth-3 .lb { color: #E06C75; }
        .depth-4 .lb { color: #56B6C2; }
        .depth-5 .lb { color: #98C379; }
        .depth-6 .lb { color: #D19A66; }
      `}</style>

      <div className="km-root">
        <h2 className="km-title">Map Of Human Knowledge</h2>
        <p className="km-subtitle">
          [ Interactive folder tree — click to expand, search to filter ]
        </p>

        {/* Toolbar */}
        <div className="km-toolbar">
          <input
            className="km-search"
            type="text"
            placeholder="Search domains..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button className="km-btn" onClick={expandAll}>
            Expand all
          </button>
          <button className="km-btn" onClick={collapseAll}>
            Collapse all
          </button>
        </div>

        {/* Tree */}
        <div className="km-tree">
          {isFiltering ? (
            <FilteredNode key={`filter-${query}`} node={DATA} query={query} />
          ) : (
            <ExpandableTree
              key={`tree-${expandKey}-${collapseKey}`}
              node={DATA}
              forceOpen={
                expandKey > collapseKey
                  ? true
                  : collapseKey > expandKey
                    ? false
                    : undefined
              }
              depth={0}
            />
          )}
        </div>
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

  return (
    <div>
      <div
        className={`node depth-${Math.min(depth, 6)}`}
        onClick={() => hasChildren && setOpen((v) => !v)}
        role={hasChildren ? "button" : undefined}
        aria-expanded={hasChildren ? open : undefined}
      >
        <span className="ic">{hasChildren ? (open ? "▾" : "▸") : "·"}</span>
        <span className="lb">
          {hasChildren ? "📁" : "📄"} {node.name}
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
