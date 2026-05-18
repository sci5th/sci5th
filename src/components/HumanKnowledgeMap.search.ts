// Pure tree-flattening + filtering helpers for HumanKnowledgeMap.
// Extracted from the component so the React/ARIA/keyboard code can stay
// focused on rendering. No React imports here — these functions are
// trivially unit-testable in isolation.

import {
  DOMAIN_CATEGORY,
  type KnowledgeNode,
} from "@/config/human-knowledge-tree";

// A row in the flat list the component actually renders. The tree is
// recursive in the data layer but the UI is a virtualized-ish flat list,
// so the component asks for "the rows currently visible" and gets back
// `FlatRow[]`.
export interface FlatRow {
  node: KnowledgeNode;
  depth: number;
  parentPath: string;
  path: string;
  category: string | null; // null only for the root
  hasChildren: boolean;
  isOpen: boolean;
}

// Default (un-filtered) flatten — walks the tree honoring the `openMap`
// override (which the user toggles via clicks) with `node.o` as the
// fallback for paths the user hasn't touched yet.
export function flatten(
  node: KnowledgeNode,
  openMap: Record<string, boolean>,
  depth: number,
  parentPath: string,
  category: string | null,
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

  // First-level children under the root adopt their own category;
  // deeper nodes inherit.
  const rows: FlatRow[] = [row];
  for (const child of node.c!) {
    const childCategory = category ?? DOMAIN_CATEGORY[child.name] ?? null;
    rows.push(...flatten(child, openMap, depth + 1, path, childCategory));
  }
  return rows;
}

// Filtered variant: only includes branches whose subtree matches the
// query. Matching branches are always shown expanded so the user can
// see exactly which descendants matched. Returns `[]` for an empty
// query — the caller decides whether to fall back to `flatten`.
export function flattenFiltered(
  node: KnowledgeNode,
  query: string,
  depth: number,
  parentPath: string,
  category: string | null,
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
        ...flattenFiltered(child, query, depth + 1, path, childCategory),
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
    // Filtered view always shows matching branches expanded.
    isOpen: hasChildren && childResults.length > 0,
  };

  return [row, ...childResults];
}
