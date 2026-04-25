"use client";

/**
 * sci5th's Human Knowledge surface — thin shim over the engine renderer.
 *
 * The engine's `KnowledgeMap` is fed the human pack and two host-supplied
 * bits sci5th owns:
 *   - `initialFocusPath` — read from `useSearchParams()` so deep-links
 *     like `/human-knowledge?focus=<systemPath>` still work.
 *   - `renderNodeAccessory` — emits the Pink "gallery →" badge for any
 *     row whose path matches an entry in `KNOWLEDGE_GALLERY_BY_SYSTEM_PATH`,
 *     using `next/link` for client-side routing into the gallery.
 *
 * No tree, icon, or category logic lives here anymore — that's all the
 * pack's job. To replace this surface with a Finance map, swap
 * `humanPack` for `financePack` and the gallery accessory for whatever
 * cross-link makes sense there.
 */

import { KnowledgeMap } from "@brain5th/engine";
import { humanPack } from "@brain5th/knowledge-human";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { KNOWLEDGE_GALLERY_BY_SYSTEM_PATH } from "@/config/knowledge-gallery";

export default function HumanKnowledgeMap() {
  const focusParam = useSearchParams().get("focus") ?? undefined;

  return (
    <KnowledgeMap
      pack={humanPack}
      initialFocusPath={focusParam}
      renderNodeAccessory={({ path }) => {
        const gallery = KNOWLEDGE_GALLERY_BY_SYSTEM_PATH[path];
        if (!gallery) return null;
        return (
          <Link
            href={`/knowledge-gallery/${gallery.slug}`}
            className="km-gallery-badge"
            onClick={(e) => e.stopPropagation()}
            aria-label={`Open ${gallery.title} in Knowledge Gallery`}
          >
            gallery →
          </Link>
        );
      }}
    />
  );
}
