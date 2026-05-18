"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { KNOWLEDGE_GALLERY_BY_SYSTEM_PATH } from "@/config/knowledge-gallery";
import {
  ChevronDownIcon,
  ChevronRightIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import {
  DATA,
  iconFor,
  type KnowledgeNode,
} from "@/config/human-knowledge-tree";
import {
  flatten,
  flattenFiltered,
  type FlatRow,
} from "./HumanKnowledgeMap.search";

// ── Row component ─────────────────────────────────────────────────────────────

interface TreeRowProps {
  row: FlatRow;
  index: number;
  focusIndex: number;
  size: number;
  onToggle: (path: string) => void;
  onFocus: (index: number) => void;
  registerRef: (index: number, el: HTMLDivElement | null) => void;
  highlighted: boolean;
}

function TreeRow({
  row,
  index,
  focusIndex,
  size,
  onToggle,
  onFocus,
  registerRef,
  highlighted,
}: TreeRowProps) {
  const { node, depth, hasChildren, isOpen, path, category } = row;
  const Glyph = iconFor(node.name);
  const categoryClass = category ? `cat-${category}` : "";
  const gallery = KNOWLEDGE_GALLERY_BY_SYSTEM_PATH[path];

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
      data-highlight={highlighted ? "true" : undefined}
      onClick={() => {
        onFocus(index);
        if (hasChildren) onToggle(path);
      }}
      onFocus={() => onFocus(index)}
    >
      <span className="km-row">
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
      </span>
      {gallery && (
        <Link
          href={`/knowledge-gallery/${gallery.slug}`}
          className="km-gallery-badge"
          onClick={(e) => e.stopPropagation()}
          aria-label={`Open ${gallery.title} in Knowledge Gallery`}
        >
          gallery →
        </Link>
      )}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function HumanKnowledgeMap() {
  const [query, setQuery] = useState("");
  const [openMap, setOpenMap] = useState<Record<string, boolean>>({});
  const [focusIndex, setFocusIndex] = useState(0);
  const [highlightPath, setHighlightPath] = useState<string | null>(null);
  const rowRefs = useRef<Array<HTMLDivElement | null>>([]);
  const searchParams = useSearchParams();
  const focusParam = searchParams.get("focus");
  const handledFocusRef = useRef<string | null>(null);
  // Timer that clears the deep-link highlight. Held in a ref so it isn't
  // torn down by unrelated re-renders of the focus effect (rows is recreated
  // each render, so the effect's cleanup would otherwise cancel the timer
  // before it fires).
  const clearHighlightTimerRef = useRef<number | null>(null);

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

  // Deep-link support — when arriving with `?focus=<systemPath>`:
  //   1. Expand every ancestor so the target row is present in `rows`.
  //   2. After the re-render, find the row, scroll it into view, focus
  //      it (keyboard + roving focus), and pulse a brief highlight.
  // Guarded by handledFocusRef so it runs once per distinct focus param.
  useEffect(() => {
    if (!focusParam) return;
    if (handledFocusRef.current === focusParam) return;

    // Step 1 — expand ancestors of focusParam so the node becomes visible.
    // Example: "Human Knowledge/Formal Sciences/Systems Science/Chaos Theory"
    // → open "Human Knowledge", ".../Formal Sciences", ".../Systems Science".
    const segments = focusParam.split("/");
    const ancestors: Record<string, boolean> = {};
    for (let i = 1; i < segments.length; i += 1) {
      ancestors[segments.slice(0, i).join("/")] = true;
    }
    // Also clear any active search — deep-link lands on the un-filtered tree.
    if (query) setQuery("");
    setOpenMap((prev) => ({ ...prev, ...ancestors }));
  }, [focusParam, query]);

  useEffect(() => {
    if (!focusParam) return;
    if (handledFocusRef.current === focusParam) return;

    const idx = rows.findIndex((r) => r.path === focusParam);
    if (idx === -1) {
      // Ancestors not yet expanded — wait for next render. If the path
      // is invalid (typo, renamed node), mark it handled after a grace
      // window so the effect doesn't re-run on unrelated rows changes.
      const giveUp = window.setTimeout(() => {
        handledFocusRef.current = focusParam;
      }, 1000);
      return () => window.clearTimeout(giveUp);
    }

    handledFocusRef.current = focusParam;
    setFocusIndex(idx);
    setHighlightPath(focusParam);

    // Defer DOM access until after this render paints the row ref.
    const t = window.setTimeout(() => {
      const el = rowRefs.current[idx];
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        el.focus({ preventScroll: true });
      }
    }, 0);

    // Clear highlight flag shortly after the CSS animation (4.5s) finishes.
    // The animation ends on `background: transparent` with no `forwards`
    // fill, so even if this timer were somehow cancelled the row would
    // still return to its natural look — belt and braces. Stored in a ref
    // (outside the effect's cleanup) so unrelated re-renders — which change
    // `rows` on every render and thus re-run this effect — don't cancel it.
    if (clearHighlightTimerRef.current !== null) {
      window.clearTimeout(clearHighlightTimerRef.current);
    }
    clearHighlightTimerRef.current = window.setTimeout(() => {
      setHighlightPath(null);
      clearHighlightTimerRef.current = null;
    }, 5000);

    return () => {
      window.clearTimeout(t);
    };
  }, [focusParam, rows]);

  // Clear the highlight timer on unmount so it can't fire on a gone component.
  useEffect(() => {
    return () => {
      if (clearHighlightTimerRef.current !== null) {
        window.clearTimeout(clearHighlightTimerRef.current);
        clearHighlightTimerRef.current = null;
      }
    };
  }, []);

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
      <p className="km-subtitle">Interactive Folder Tree</p>

      {/* Toolbar — row 1: search */}
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
      </div>

      {/* Toolbar — row 2: Expand (left) · Help (center) · Collapse (right) */}
      <div className="km-toolbar km-toolbar-secondary km-toolbar-tri">
        <div className="km-toolbar-slot km-toolbar-slot-left">
          <button
            className="km-btn"
            onClick={expandAll}
            type="button"
            disabled={isFiltering}
            aria-disabled={isFiltering}
          >
            Expand
          </button>
        </div>
        <div className="km-toolbar-slot km-toolbar-slot-center">
          <details className="km-help">
            <summary className="km-help-summary">
              <span>Help</span>
              <ChevronDownIcon className="km-help-chevron" />
            </summary>
            <div className="km-help-content">
              <ul>
                <li>Click a row with a triangle to expand or collapse it.</li>
                <li>Use the search field above to filter by name.</li>
                <li>
                  Keyboard: <kbd>↑</kbd>/<kbd>↓</kbd> to move,{" "}
                  <kbd>→</kbd>/<kbd>←</kbd> to expand/collapse,{" "}
                  <kbd>Enter</kbd> or <kbd>Space</kbd> to toggle,{" "}
                  <kbd>Home</kbd>/<kbd>End</kbd> to jump to first/last.
                </li>
                <li>Use the buttons on the sides to expand or collapse the whole tree.</li>
              </ul>
            </div>
          </details>
        </div>
        <div className="km-toolbar-slot km-toolbar-slot-right">
          <button
            className="km-btn"
            onClick={collapseAll}
            type="button"
            disabled={isFiltering}
            aria-disabled={isFiltering}
          >
            Collapse
          </button>
        </div>
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
                highlighted={highlightPath === row.path}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
