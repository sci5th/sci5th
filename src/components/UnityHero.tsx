"use client";

import { useState } from "react";
import { PlayIcon } from "@heroicons/react/24/solid";
import { assetUrl } from "@/config/asset-manifest";
import UnityPlayer from "./UnityPlayer";

interface UnityHeroProps {
  title: string;
  thumbnail: string | null;
  category: string;
  unity: {
    path: string;
    name: string;
    useUnityWebExtension?: boolean;
  };
}

export default function UnityHero({
  title,
  thumbnail,
  category,
  unity,
}: UnityHeroProps) {
  const [playing, setPlaying] = useState(false);

  if (playing) {
    return (
      <div className="mb-8">
        <UnityPlayer
          gamePath={unity.path}
          gameName={unity.name}
          useUnityWebExtension={unity.useUnityWebExtension ?? true}
          onStop={() => setPlaying(false)}
        />
      </div>
    );
  }

  if (thumbnail) {
    return (
      <button
        type="button"
        onClick={() => setPlaying(true)}
        aria-label={`Play ${unity.name}`}
        className="group relative mb-8 block aspect-video w-full overflow-hidden rounded-lg border border-line-700 bg-ink-800 bg-cover bg-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue"
        style={{ backgroundImage: `url(${assetUrl(thumbnail)})` }}
      >
        <span
          className="pointer-events-none absolute inset-0 flex items-center justify-center"
          aria-hidden="true"
        >
          <span className="flex h-16 w-16 items-center justify-center rounded-full border border-white/25 bg-black/45 backdrop-blur-sm transition-colors group-hover:border-brand-pink group-hover:bg-black/60 md:h-20 md:w-20">
            <PlayIcon className="h-7 w-7 translate-x-[2px] text-white/90 transition-colors group-hover:text-brand-pink md:h-9 md:w-9" />
          </span>
        </span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      aria-label={`Play ${unity.name}`}
      className={`kg-thumb cat-${category} group relative mb-8 flex aspect-video w-full items-center justify-center rounded-lg border border-line-700 bg-ink-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue`}
    >
      <span className="font-mono text-3xl text-text-300">{title}</span>
      <span
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
        aria-hidden="true"
      >
        <span className="flex h-16 w-16 items-center justify-center rounded-full border border-white/25 bg-black/45 backdrop-blur-sm transition-colors group-hover:border-brand-pink group-hover:bg-black/60 md:h-20 md:w-20">
          <PlayIcon className="h-7 w-7 translate-x-[2px] text-white/90 transition-colors group-hover:text-brand-pink md:h-9 md:w-9" />
        </span>
      </span>
    </button>
  );
}
