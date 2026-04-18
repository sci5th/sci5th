"use client";

import { useCallback, useRef, useState } from "react";
import {
  BeakerIcon,
  BookOpenIcon,
  BriefcaseIcon,
  BuildingLibraryIcon,
  CalculatorIcon,
  ChartBarIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  CogIcon,
  CpuChipIcon,
  GlobeAltIcon,
  HeartIcon,
  LanguageIcon,
  LightBulbIcon,
  MusicalNoteIcon,
  PaintBrushIcon,
  PuzzlePieceIcon,
  RocketLaunchIcon,
  ScaleIcon,
  SparklesIcon,
  UserGroupIcon,
  VariableIcon,
  WrenchScrewdriverIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import type { ComponentType, SVGProps } from "react";

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
                {
                  name: "Algorithms & Data Structures",
                  c: [
                    { name: "Sorting & Searching" },
                    { name: "Graph Algorithms" },
                    { name: "Dynamic Programming" },
                    { name: "Trees & Heaps" },
                    { name: "Hash Tables" },
                    { name: "String Algorithms" },
                    { name: "Greedy Algorithms" },
                    { name: "Randomized Algorithms" },
                  ],
                },
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
                {
                  name: "Databases",
                  c: [
                    { name: "Relational Databases (SQL)" },
                    { name: "NoSQL Databases" },
                    { name: "Query Optimization" },
                    { name: "Transactions & ACID" },
                    { name: "Data Warehousing" },
                    { name: "Distributed Databases" },
                  ],
                },
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
            {
              name: "Classical Mechanics",
              c: [
                {
                  name: "Newtonian Mechanics",
                  c: [
                    { name: "Newton's Laws of Motion" },
                    { name: "Forces, Work & Energy" },
                    { name: "Momentum & Collisions" },
                    { name: "Circular Motion & Gravitation" },
                  ],
                },
                {
                  name: "Analytical Mechanics",
                  c: [
                    { name: "Lagrangian Mechanics" },
                    { name: "Hamiltonian Mechanics" },
                    { name: "Variational Principles" },
                    { name: "Constraints & Generalized Coordinates" },
                  ],
                },
                {
                  name: "Rigid Body Dynamics",
                  c: [
                    { name: "Rotational Motion & Torque" },
                    { name: "Moment of Inertia" },
                    { name: "Gyroscopes & Precession" },
                  ],
                },
                { name: "Oscillations & Waves" },
                { name: "Fluid Mechanics (Classical)" },
                { name: "Chaos & Nonlinear Dynamics" },
              ],
            },
            {
              name: "Quantum Mechanics",
              c: [
                {
                  name: "Foundations",
                  c: [
                    { name: "Wave-Particle Duality" },
                    { name: "Schrödinger Equation" },
                    { name: "Uncertainty Principle" },
                    { name: "Quantum States & Superposition" },
                    { name: "Measurement & Collapse" },
                  ],
                },
                {
                  name: "Quantum Field Theory",
                  c: [
                    { name: "Second Quantization" },
                    { name: "Feynman Diagrams" },
                    { name: "Renormalization" },
                    { name: "Standard Model" },
                  ],
                },
                {
                  name: "Quantum Information & Computing",
                  c: [
                    {
                      name: "Quantum Hardware",
                      c: [
                        { name: "Superconducting Qubits (IBM, Google)" },
                        { name: "Trapped Ion Qubits" },
                        { name: "Photonic Quantum Computing" },
                        { name: "Topological Qubits" },
                        { name: "Quantum Annealing (D-Wave)" },
                        {
                          name: "Cryogenic Engineering & Dilution Refrigerators",
                        },
                      ],
                    },
                    {
                      name: "Quantum Programming",
                      c: [
                        { name: "Qiskit (IBM)" },
                        { name: "Cirq (Google)" },
                        { name: "PennyLane (Xanadu)" },
                        { name: "Q# (Microsoft)" },
                        { name: "Quantum Circuit Design" },
                        { name: "Hybrid Classical-Quantum Programs" },
                        { name: "Quantum Assembly (QASM)" },
                      ],
                    },
                    {
                      name: "Quantum Algorithms",
                      c: [
                        { name: "Shor's Algorithm (Factoring)" },
                        { name: "Grover's Algorithm (Search)" },
                        { name: "Quantum Fourier Transform" },
                        { name: "Variational Quantum Eigensolver (VQE)" },
                        { name: "Quantum Approximate Optimization (QAOA)" },
                        { name: "Quantum Machine Learning Algorithms" },
                      ],
                    },
                    {
                      name: "Quantum Error Correction",
                      c: [
                        { name: "Decoherence & Noise Models" },
                        { name: "Stabilizer Codes" },
                        { name: "Surface Codes" },
                        { name: "Fault-Tolerant Quantum Computation" },
                      ],
                    },
                    { name: "Quantum Entanglement & Teleportation" },
                    { name: "Quantum Cryptography & QKD" },
                    { name: "Quantum Complexity Theory" },
                    { name: "Quantum Simulation" },
                  ],
                },
                { name: "Quantum Optics" },
                { name: "Many-Body Quantum Systems" },
                { name: "Interpretations of Quantum Mechanics" },
              ],
            },
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
            {
              name: "Mechanical Engineering",
              c: [
                { name: "Thermodynamics & Heat Transfer" },
                { name: "Fluid Mechanics" },
                { name: "Solid Mechanics & Materials" },
                { name: "Machine Design & Manufacturing" },
                {
                  name: "Robotics & Control Systems",
                  c: [
                    { name: "Kinematics & Dynamics" },
                    { name: "Sensors & Actuators" },
                    { name: "PID & Classical Control Theory" },
                    { name: "Robot Operating System (ROS)" },
                    { name: "Motion Planning & Path Finding" },
                    { name: "Computer Vision for Robotics" },
                    { name: "Human-Robot Interaction" },
                    { name: "Autonomous & Mobile Robotics" },
                  ],
                },
                { name: "CAD/CAM" },
              ],
            },
            {
              name: "Electrical Engineering",
              c: [
                { name: "Circuit Theory" },
                { name: "Electronics & Semiconductors" },
                { name: "Signal Processing" },
                { name: "Power Systems & Energy" },
                { name: "Electromagnetics" },
                { name: "Control Engineering" },
              ],
            },
            {
              name: "Civil Engineering",
              c: [
                { name: "Structural Engineering" },
                { name: "Geotechnical Engineering" },
                { name: "Transportation Engineering" },
                { name: "Hydraulics & Water Resources" },
                { name: "Environmental Engineering" },
                { name: "Construction Management" },
              ],
            },
            {
              name: "Chemical Engineering",
              c: [
                { name: "Reaction Engineering" },
                { name: "Separation Processes" },
                { name: "Transport Phenomena" },
                { name: "Process Design & Control" },
                { name: "Polymer Engineering" },
                { name: "Catalysis" },
              ],
            },
            {
              name: "Aerospace Engineering",
              c: [
                { name: "Aerodynamics" },
                { name: "Propulsion Systems" },
                { name: "Structural Analysis" },
                { name: "Flight Mechanics & Control" },
                { name: "Spacecraft Systems" },
                { name: "Avionics" },
              ],
            },
            {
              name: "Biomedical Engineering",
              c: [
                { name: "Biomechanics" },
                { name: "Medical Imaging & Instrumentation" },
                { name: "Biomaterials & Implants" },
                { name: "Neural Engineering" },
                { name: "Tissue Engineering" },
                { name: "Clinical Engineering" },
              ],
            },
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
            {
              name: "Nanobiotechnology",
              c: [
                { name: "Nanoparticle Drug Delivery" },
                { name: "DNA Nanotechnology" },
                { name: "Nanoscale Biosensors" },
                { name: "Quantum Dots in Biology" },
                { name: "Nanostructured Biomaterials" },
                { name: "Nano-imaging & Diagnostics" },
              ],
            },
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
        {
          name: "Agriculture & Food Science",
          c: [
            {
              name: "Crop Science & Agronomy",
              c: [
                { name: "Plant Breeding & Genetics" },
                { name: "Soil Science & Fertility" },
                { name: "Irrigation & Water Management" },
                { name: "Pest & Disease Management" },
              ],
            },
            {
              name: "Animal Science & Livestock",
              c: [
                { name: "Animal Nutrition" },
                { name: "Animal Breeding & Genetics" },
                { name: "Veterinary Medicine" },
                { name: "Aquaculture" },
              ],
            },
            {
              name: "Food Science & Technology",
              c: [
                { name: "Food Chemistry" },
                { name: "Food Microbiology & Safety" },
                { name: "Food Processing & Preservation" },
                { name: "Sensory Science & Quality" },
              ],
            },
            {
              name: "Sustainable Agriculture",
              c: [
                { name: "Organic Farming" },
                { name: "Agroecology" },
                { name: "Precision Agriculture" },
                { name: "Vertical & Urban Farming" },
              ],
            },
            { name: "Agricultural Economics & Policy" },
            { name: "Post-Harvest Technology" },
          ],
        },
        { name: "Environmental Science" },
        { name: "Materials Science" },
        {
          name: "Information Science & Library Science",
          c: [
            {
              name: "Document & File Formats as Data Structures",
              c: [
                {
                  name: "Plain-Text & Markup Formats",
                  c: [
                    { name: "Markdown (.md) — structured prose & notes" },
                    { name: "HTML — hypertext document model" },
                    { name: "reStructuredText & AsciiDoc" },
                    { name: "LaTeX — typeset document as data" },
                  ],
                },
                {
                  name: "Structured Data Formats",
                  c: [
                    { name: "JSON — key-value & nested objects" },
                    { name: "YAML — human-readable config trees" },
                    { name: "XML — hierarchical tag-based data" },
                    { name: "CSV/TSV — tabular flat-file databases" },
                    { name: "TOML — typed config format" },
                  ],
                },
                {
                  name: "Binary & Columnar Formats",
                  c: [
                    { name: "Parquet — columnar analytics store" },
                    { name: "Avro — schema-based row store" },
                    { name: "Protocol Buffers & FlatBuffers" },
                    { name: "SQLite — file-as-relational-database" },
                  ],
                },
                {
                  name: "Office & Document Databases",
                  c: [
                    { name: "XLSX — spreadsheet as structured grid" },
                    { name: "DOCX/ODT — document as XML archive" },
                    { name: "PDF — portable document container" },
                    {
                      name: "Obsidian Vaults / Zettelkasten — MD as knowledge graph",
                    },
                  ],
                },
                { name: "Schema Design & Validation (JSON Schema, XSD)" },
                { name: "Semantic Web & Linked Data (RDF, OWL)" },
              ],
            },
            { name: "Knowledge Organization & Classification" },
            { name: "Digital Libraries & Archiving" },
            { name: "Metadata Standards" },
            { name: "Information Retrieval" },
          ],
        },
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
            {
              name: "Interior Design",
              c: [
                { name: "Space Planning & Layout" },
                { name: "Lighting Design" },
                { name: "Color Theory & Material Selection" },
                { name: "Furniture & Ergonomics" },
                { name: "Sustainable & Biophilic Design" },
                { name: "Architectural Detailing" },
              ],
            },
            { name: "Fashion Design" },
            { name: "Motion & Experience Design" },
          ],
        },
        {
          name: "Culinary Arts & Gastronomy",
          c: [
            {
              name: "Bakery & Pastry Arts",
              c: [
                { name: "Bread & Fermentation Science" },
                { name: "Pastry & Confectionery" },
                { name: "Cake Design & Decoration" },
                { name: "Gluten-Free & Alternative Baking" },
                { name: "Chocolate & Sugar Work" },
              ],
            },
            {
              name: "Culinary Techniques",
              c: [
                { name: "Classic & Modern Cooking Methods" },
                { name: "Knife Skills & Mise en Place" },
                { name: "Sauces & Stocks" },
                { name: "Molecular Gastronomy" },
              ],
            },
            { name: "World Cuisines & Food Culture" },
            { name: "Nutrition & Dietary Science" },
            { name: "Food Pairing & Flavor Chemistry" },
            { name: "Restaurant Management & Hospitality" },
          ],
        },
        { name: "Journalism & Media" },
        { name: "Military Science" },
        {
          name: "Skilled Trades & Vocational Arts",
          c: [
            {
              name: "Plumbing",
              c: [
                { name: "Pipe Systems & Materials" },
                { name: "Water Supply & Distribution" },
                { name: "Drainage, Waste & Vent Systems" },
                { name: "Fixture Installation & Repair" },
                { name: "Gas Piping & Safety" },
                { name: "Heating Systems (Boilers, Radiant)" },
                { name: "Codes, Permits & Inspections" },
              ],
            },
            {
              name: "Welding",
              c: [
                { name: "MIG Welding (GMAW)" },
                { name: "TIG Welding (GTAW)" },
                { name: "Stick Welding (SMAW)" },
                { name: "Flux-Core Arc Welding (FCAW)" },
                { name: "Metallurgy & Joint Design" },
                { name: "Welding Safety & PPE" },
                { name: "Inspection & Quality Control" },
              ],
            },
            {
              name: "Electrical Work & Wiring",
              c: [
                { name: "Electrical Theory & Fundamentals" },
                { name: "Wiring Methods & Cable Types" },
                { name: "Panels, Breakers & Load Calculation" },
                { name: "Residential Wiring" },
                { name: "Commercial & Industrial Wiring" },
                { name: "Conduit Installation & Raceway Systems" },
                { name: "Low-Voltage & Smart Home Systems" },
                { name: "NEC Codes & Safety Standards" },
              ],
            },
            { name: "HVAC & Refrigeration" },
            { name: "Carpentry & Joinery" },
            { name: "Masonry & Concrete Work" },
          ],
        },
        {
          name: "Data Science",
          c: [
            {
              name: "Data Engineering",
              c: [
                { name: "Data Pipelines & ETL" },
                { name: "Data Lakes & Warehouses" },
                { name: "Stream Processing" },
                { name: "Data Quality & Governance" },
              ],
            },
            {
              name: "Statistical Analysis",
              c: [
                { name: "Descriptive Statistics" },
                { name: "Inferential Statistics" },
                { name: "Bayesian Analysis" },
                { name: "Experimental Design & A/B Testing" },
              ],
            },
            {
              name: "Machine Learning & Modeling",
              c: [
                { name: "Feature Engineering" },
                { name: "Supervised & Unsupervised Learning" },
                { name: "Model Evaluation & Selection" },
                { name: "MLOps & Model Deployment" },
              ],
            },
            {
              name: "Data Visualization",
              c: [
                { name: "Exploratory Data Analysis" },
                { name: "Dashboard Design" },
                {
                  name: "Storytelling with Data",
                  c: [
                    { name: "Narrative Structure & Flow" },
                    { name: "Choosing the Right Chart" },
                    { name: "Visual Hierarchy & Design Principles" },
                    { name: "Audience & Context Framing" },
                    { name: "Annotation & Highlighting Insights" },
                    { name: "Presentation & Communication Skills" },
                  ],
                },
              ],
            },
            {
              name: "Big Data Technologies",
              c: [
                { name: "Hadoop & MapReduce" },
                { name: "Apache Spark" },
                { name: "Kafka & Event Streaming" },
                { name: "Cloud Data Platforms (AWS, GCP, Azure)" },
                { name: "Distributed File Systems (HDFS)" },
                { name: "NoSQL at Scale (Cassandra, HBase)" },
              ],
            },
            { name: "Ethics & Fairness in Data Science" },
          ],
        },
        {
          name: "Bioinformatics",
          c: [
            {
              name: "Sequence Analysis",
              c: [
                { name: "DNA/RNA Sequence Alignment" },
                { name: "Genome Assembly" },
                { name: "Variant Calling & SNP Analysis" },
                { name: "Phylogenetics & Evolution" },
              ],
            },
            {
              name: "Structural Bioinformatics",
              c: [
                { name: "Protein Structure Prediction" },
                { name: "Molecular Docking" },
                { name: "Molecular Dynamics Simulation" },
              ],
            },
            {
              name: "Functional Genomics",
              c: [
                { name: "Transcriptomics & RNA-seq" },
                { name: "Proteomics" },
                { name: "Metabolomics" },
                { name: "Epigenomics" },
              ],
            },
            {
              name: "Computational Drug Discovery",
              c: [
                { name: "Virtual Screening" },
                { name: "QSAR Modeling" },
                { name: "Target Identification" },
              ],
            },
            { name: "Biological Databases & Ontologies" },
            { name: "Single-Cell Analysis" },
            { name: "Systems Biology" },
          ],
        },
        {
          name: "Cognitive Science",
          c: [
            { name: "Philosophy of Mind" },
            {
              name: "AI & Cognition",
              c: [
                { name: "Cognitive Architectures" },
                { name: "Computational Models of Mind" },
                { name: "Memory & Learning Models" },
                { name: "Attention & Perception" },
                { name: "Language & Thought" },
                { name: "Human-AI Interaction" },
              ],
            },
            {
              name: "Neuroscience",
              c: [
                { name: "Cellular & Molecular Neuroscience" },
                { name: "Systems Neuroscience" },
                { name: "Cognitive Neuroscience" },
                { name: "Computational Neuroscience" },
                { name: "Neuroimaging (fMRI, EEG)" },
                { name: "Neurological Disorders" },
              ],
            },
            { name: "Linguistics" },
          ],
        },
      ],
    },
  ],
};

// ── Icon mapping (two-tier semantic system) ───────────────────────────────────

type IconComponent = ComponentType<
  SVGProps<SVGSVGElement> & { title?: string }
>;

const DOMAIN_ICONS: Record<string, IconComponent> = {
  "Formal Sciences": VariableIcon,
  "Natural Sciences": BeakerIcon,
  "Applied Sciences & Technology": CogIcon,
  "Social Sciences": UserGroupIcon,
  Humanities: BookOpenIcon,
  "Professions & Interdisciplinary": BriefcaseIcon,
};

const FIELD_ICONS: Record<string, IconComponent> = {
  // Formal
  Mathematics: CalculatorIcon,
  "Computer Science": CpuChipIcon,
  Logic: PuzzlePieceIcon,
  "Systems Science": SparklesIcon,
  // Natural
  Physics: SparklesIcon,
  Chemistry: BeakerIcon,
  Biology: SparklesIcon,
  "Earth Sciences": GlobeAltIcon,
  Astronomy: RocketLaunchIcon,
  // Applied
  Engineering: WrenchScrewdriverIcon,
  Biotechnology: SparklesIcon,
  "Medicine & Health Sciences": HeartIcon,
  "Agriculture & Food Science": GlobeAltIcon,
  "Information Science & Library Science": BuildingLibraryIcon,
  "Data Science": ChartBarIcon,
  Bioinformatics: CpuChipIcon,
  // Social
  Economics: ChartBarIcon,
  Psychology: SparklesIcon,
  Linguistics: LanguageIcon,
  "Cognitive Science": LightBulbIcon,
  // Humanities
  Philosophy: LightBulbIcon,
  History: BuildingLibraryIcon,
  // Professions
  "Business & Management": BriefcaseIcon,
  Design: PaintBrushIcon,
  "Culinary Arts & Gastronomy": SparklesIcon,
  "Skilled Trades & Vocational Arts": WrenchScrewdriverIcon,
};

// Slug mapping used for the top-level `cat-*` class that propagates color + icon.
const DOMAIN_CATEGORY: Record<string, string> = {
  "Formal Sciences": "formal",
  "Natural Sciences": "natural",
  "Applied Sciences & Technology": "applied",
  "Social Sciences": "social",
  Humanities: "humanities",
  "Professions & Interdisciplinary": "professions",
};

function iconFor(name: string): IconComponent | null {
  return DOMAIN_ICONS[name] ?? FIELD_ICONS[name] ?? null;
}

// ── Flattening: translates the tree into a flat list of visible rows ──────────

interface FlatRow {
  node: KnowledgeNode;
  depth: number;
  parentPath: string;
  path: string;
  category: string | null; // null only for the root
  hasChildren: boolean;
  isOpen: boolean;
}

function flatten(
  node: KnowledgeNode,
  openMap: Record<string, boolean>,
  depth: number,
  parentPath: string,
  category: string | null
): FlatRow[] {
  const path = parentPath ? `${parentPath}/${node.name}` : node.name;
  const hasChildren = !!node.c?.length;
  const isOpen = openMap[path] ?? !!node.o;

  const row: FlatRow = {
    node,
    depth,
    parentPath,
    path,
    category,
    hasChildren,
    isOpen,
  };

  if (!hasChildren || !isOpen) return [row];

  // First-level children under the root adopt their own category; deeper nodes inherit.
  const rows: FlatRow[] = [row];
  for (const child of node.c!) {
    const childCategory = category ?? DOMAIN_CATEGORY[child.name] ?? null;
    rows.push(...flatten(child, openMap, depth + 1, path, childCategory));
  }
  return rows;
}

// Filtered variant: only includes branches whose subtree matches the query.
function flattenFiltered(
  node: KnowledgeNode,
  query: string,
  depth: number,
  parentPath: string,
  category: string | null
): FlatRow[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];

  const path = parentPath ? `${parentPath}/${node.name}` : node.name;
  const hasChildren = !!node.c?.length;
  const selfMatches = node.name.toLowerCase().includes(q);

  const childResults: FlatRow[] = [];
  if (hasChildren) {
    for (const child of node.c!) {
      const childCategory = category ?? DOMAIN_CATEGORY[child.name] ?? null;
      childResults.push(
        ...flattenFiltered(child, query, depth + 1, path, childCategory)
      );
    }
  }

  if (!selfMatches && childResults.length === 0) return [];

  const row: FlatRow = {
    node,
    depth,
    parentPath,
    path,
    category,
    hasChildren,
    // Filtered view always shows matching branches expanded
    isOpen: hasChildren && childResults.length > 0,
  };

  return [row, ...childResults];
}

// ── Row component ─────────────────────────────────────────────────────────────

interface TreeRowProps {
  row: FlatRow;
  index: number;
  focusIndex: number;
  size: number;
  onToggle: (path: string) => void;
  onFocus: (index: number) => void;
  registerRef: (index: number, el: HTMLDivElement | null) => void;
}

function TreeRow({
  row,
  index,
  focusIndex,
  size,
  onToggle,
  onFocus,
  registerRef,
}: TreeRowProps) {
  const { node, depth, hasChildren, isOpen, path, category } = row;
  const Glyph = iconFor(node.name);
  const categoryClass = category ? `cat-${category}` : "";

  return (
    <div
      ref={(el) => registerRef(index, el)}
      className={`km-node ${categoryClass}`.trim()}
      role="treeitem"
      aria-level={depth + 1}
      aria-expanded={hasChildren ? isOpen : undefined}
      aria-posinset={index + 1}
      aria-setsize={size}
      aria-selected={index === focusIndex}
      tabIndex={index === focusIndex ? 0 : -1}
      data-has-children={hasChildren ? "true" : "false"}
      data-path={path}
      onClick={() => {
        onFocus(index);
        if (hasChildren) onToggle(path);
      }}
      onFocus={() => onFocus(index)}
    >
      <span className="km-icon" aria-hidden="true">
        {hasChildren ? (
          isOpen ? (
            <ChevronDownIcon />
          ) : (
            <ChevronRightIcon />
          )
        ) : (
          <span style={{ fontSize: "14px", lineHeight: 1 }}>·</span>
        )}
      </span>
      {Glyph && (
        <span className="km-glyph" aria-hidden="true">
          <Glyph />
        </span>
      )}
      <span className="km-label">{node.name}</span>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function HumanKnowledgeMap() {
  const [query, setQuery] = useState("");
  const [openMap, setOpenMap] = useState<Record<string, boolean>>({});
  const [focusIndex, setFocusIndex] = useState(0);
  const rowRefs = useRef<Array<HTMLDivElement | null>>([]);

  const registerRef = useCallback(
    (index: number, el: HTMLDivElement | null) => {
      rowRefs.current[index] = el;
    },
    []
  );

  const toggle = useCallback((path: string) => {
    setOpenMap((prev) => {
      // If absent, fall back to the node's `o`; here we just flip the explicit entry.
      const current = prev[path];
      const explicit = current !== undefined;
      const defaultOpen = path === "Human Knowledge" ? true : false; // only the root is open by default
      const next = explicit ? !current : !defaultOpen;
      return { ...prev, [path]: next };
    });
  }, []);

  const expandAll = useCallback(() => {
    const all: Record<string, boolean> = {};
    function walk(node: KnowledgeNode, parentPath: string) {
      const path = parentPath ? `${parentPath}/${node.name}` : node.name;
      if (node.c?.length) {
        all[path] = true;
        for (const child of node.c) walk(child, path);
      }
    }
    walk(DATA, "");
    setOpenMap(all);
  }, []);

  const collapseAll = useCallback(() => {
    // Keep only the root open; collapse everything else.
    setOpenMap({ "Human Knowledge": true });
  }, []);

  const isFiltering = query.trim().length > 0;
  const rows: FlatRow[] = isFiltering
    ? flattenFiltered(DATA, query, 0, "", null)
    : flatten(DATA, openMap, 0, "", null);

  // Keep focus index in range when the flat list changes.
  if (focusIndex >= rows.length && rows.length > 0) {
    // Defer; doing it during render is fine since setState is queued.
    queueMicrotask(() => setFocusIndex(Math.max(0, rows.length - 1)));
  }

  const moveFocus = useCallback(
    (delta: number) => {
      setFocusIndex((i) => {
        const next = Math.min(Math.max(i + delta, 0), rows.length - 1);
        rowRefs.current[next]?.focus();
        return next;
      });
    },
    [rows.length]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const row = rows[focusIndex];
      if (!row) return;
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          moveFocus(1);
          break;
        case "ArrowUp":
          e.preventDefault();
          moveFocus(-1);
          break;
        case "ArrowRight":
          e.preventDefault();
          if (row.hasChildren && !row.isOpen && !isFiltering) {
            toggle(row.path);
          } else if (row.hasChildren && row.isOpen) {
            moveFocus(1);
          }
          break;
        case "ArrowLeft":
          e.preventDefault();
          if (row.hasChildren && row.isOpen && !isFiltering) {
            toggle(row.path);
          } else if (row.depth > 0) {
            // Focus parent
            const parentIndex = rows.findIndex(
              (r) => r.path === row.parentPath
            );
            if (parentIndex >= 0) {
              setFocusIndex(parentIndex);
              rowRefs.current[parentIndex]?.focus();
            }
          }
          break;
        case "Enter":
        case " ":
          if (row.hasChildren && !isFiltering) {
            e.preventDefault();
            toggle(row.path);
          }
          break;
        case "Home":
          e.preventDefault();
          setFocusIndex(0);
          rowRefs.current[0]?.focus();
          break;
        case "End":
          e.preventDefault();
          setFocusIndex(rows.length - 1);
          rowRefs.current[rows.length - 1]?.focus();
          break;
      }
    },
    [rows, focusIndex, moveFocus, toggle, isFiltering]
  );

  return (
    <div className="km-root">
      <h2 className="km-title">System of Human Knowledge</h2>
      <p className="km-subtitle">
        Interactive Folder Tree — click the triangle to expand, or use the
        search field to filter. Keyboard: ↑/↓ to move, →/← to expand/collapse,
        Enter or Space to toggle.
      </p>

      {/* Toolbar */}
      <div className="km-toolbar">
        <div className="km-search-wrap">
          <input
            className="km-search"
            type="text"
            placeholder="Search..."
            aria-label="Search the knowledge tree"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <button
              className="km-search-clear"
              onClick={() => setQuery("")}
              aria-label="Clear search"
              type="button"
            >
              <XMarkIcon width={16} height={16} />
            </button>
          )}
        </div>
        <button
          className="km-btn"
          onClick={expandAll}
          type="button"
          disabled={isFiltering}
          aria-disabled={isFiltering}
        >
          Expand all
        </button>
        <button
          className="km-btn"
          onClick={collapseAll}
          type="button"
          disabled={isFiltering}
          aria-disabled={isFiltering}
        >
          Collapse all
        </button>
      </div>

      {/* Tree */}
      {rows.length === 0 ? (
        <p className="km-empty">No matches for &ldquo;{query.trim()}&rdquo;.</p>
      ) : (
        <div
          className="km-tree"
          role="tree"
          aria-label="System of Human Knowledge"
          onKeyDown={handleKeyDown}
        >
          {rows.map((row, i) => (
            <div
              key={row.path}
              style={{
                paddingLeft: row.depth > 0 ? `${row.depth * 18}px` : undefined,
                position: "relative",
              }}
            >
              <TreeRow
                row={row}
                index={i}
                focusIndex={focusIndex}
                size={rows.length}
                onToggle={toggle}
                onFocus={setFocusIndex}
                registerRef={registerRef}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
