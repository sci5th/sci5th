// Smoke tests for the pure tree-flattening helpers. These functions
// have no React dependency, so they're tested directly against a
// small synthetic tree (not the full DATA constant — keep tests fast
// and independent of content edits).

import { describe, it, expect } from "vitest";
import type { KnowledgeNode } from "@/config/human-knowledge-tree";
import { flatten, flattenFiltered } from "./HumanKnowledgeMap.search";

// A small fixture tree: 3 top-level domains, mix of leaves and branches.
// Keep this in sync with `KnowledgeNode` shape — schema drift here will
// caught by tsc, not the tests.
const TREE: KnowledgeNode = {
  name: "Human Knowledge",
  o: true,
  c: [
    {
      name: "Formal Sciences",
      c: [
        { name: "Mathematics", c: [{ name: "Algebra" }, { name: "Geometry" }] },
        { name: "Logic" },
      ],
    },
    {
      name: "Natural Sciences",
      c: [{ name: "Physics" }, { name: "Chemistry" }],
    },
    { name: "Humanities" },
  ],
};

describe("flatten", () => {
  it("returns just the root when nothing is open and the root has children", () => {
    // Root is `o: true` so it's open by default; with openMap empty,
    // children use their own `o` (none set → closed). So we get:
    // root, then each direct child (closed), with no grandchildren.
    const rows = flatten(TREE, {}, 0, "", null);
    expect(rows.map((r) => r.path)).toEqual([
      "Human Knowledge",
      "Human Knowledge/Formal Sciences",
      "Human Knowledge/Natural Sciences",
      "Human Knowledge/Humanities",
    ]);
  });

  it("honors openMap overrides", () => {
    const rows = flatten(
      TREE,
      {
        "Human Knowledge/Formal Sciences": true,
        "Human Knowledge/Formal Sciences/Mathematics": true,
      },
      0,
      "",
      null
    );
    expect(rows.map((r) => r.path)).toEqual([
      "Human Knowledge",
      "Human Knowledge/Formal Sciences",
      "Human Knowledge/Formal Sciences/Mathematics",
      "Human Knowledge/Formal Sciences/Mathematics/Algebra",
      "Human Knowledge/Formal Sciences/Mathematics/Geometry",
      "Human Knowledge/Formal Sciences/Logic",
      "Human Knowledge/Natural Sciences",
      "Human Knowledge/Humanities",
    ]);
  });

  it("propagates category from depth-1 children to descendants", () => {
    const rows = flatten(
      TREE,
      {
        "Human Knowledge/Formal Sciences": true,
        "Human Knowledge/Formal Sciences/Mathematics": true,
      },
      0,
      "",
      null
    );
    const algebra = rows.find((r) => r.path.endsWith("/Algebra"))!;
    expect(algebra.category).toBe("formal");
  });

  it("marks rows with the right `depth` and `hasChildren`", () => {
    const rows = flatten(
      TREE,
      { "Human Knowledge/Natural Sciences": true },
      0,
      "",
      null
    );
    const physics = rows.find((r) => r.path.endsWith("/Physics"))!;
    expect(physics.depth).toBe(2);
    expect(physics.hasChildren).toBe(false);
  });
});

describe("flattenFiltered", () => {
  it("returns nothing for an empty/whitespace query", () => {
    expect(flattenFiltered(TREE, "", 0, "", null)).toEqual([]);
    expect(flattenFiltered(TREE, "   ", 0, "", null)).toEqual([]);
  });

  it("matches case-insensitively in node names", () => {
    const rows = flattenFiltered(TREE, "algebra", 0, "", null);
    const paths = rows.map((r) => r.path);
    expect(paths).toContain(
      "Human Knowledge/Formal Sciences/Mathematics/Algebra"
    );
  });

  it("returns the full ancestor chain for every match", () => {
    const rows = flattenFiltered(TREE, "physics", 0, "", null);
    expect(rows.map((r) => r.path)).toEqual([
      "Human Knowledge",
      "Human Knowledge/Natural Sciences",
      "Human Knowledge/Natural Sciences/Physics",
    ]);
  });

  it("marks matching branches as open in the filtered view", () => {
    const rows = flattenFiltered(TREE, "logic", 0, "", null);
    const formal = rows.find((r) => r.path.endsWith("/Formal Sciences"))!;
    expect(formal.isOpen).toBe(true);
  });

  it("excludes branches whose subtree has no match", () => {
    const rows = flattenFiltered(TREE, "algebra", 0, "", null);
    const paths = rows.map((r) => r.path);
    // Natural Sciences and Humanities should be filtered out entirely.
    expect(paths).not.toContain("Human Knowledge/Natural Sciences");
    expect(paths).not.toContain("Human Knowledge/Humanities");
  });

  it("returns nothing when the query matches nothing", () => {
    expect(flattenFiltered(TREE, "kgkgkgkgkgkg", 0, "", null)).toEqual([]);
  });
});
