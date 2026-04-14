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
                        { name: "Cryogenic Engineering & Dilution Refrigerators" },
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
                    { name: "Obsidian Vaults / Zettelkasten — MD as knowledge graph" },
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
        .ic { width: 16px; text-align: center; margin-right: 4px; flex-shrink: 0; font-size: 16px; color: var(--text3); }
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
          Interactive Folder Tree — click the triangle sign to expand, use the
          search window to filter
        </p>

        {/* Toolbar */}
        <div className="km-toolbar">
          <input
            className="km-search"
            type="text"
            placeholder="Search..."
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
