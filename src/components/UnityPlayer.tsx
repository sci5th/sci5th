"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowsPointingInIcon,
  ArrowsPointingOutIcon,
} from "@heroicons/react/24/outline";
import { StopIcon } from "@heroicons/react/24/solid";

// The Unity WebGL loader attaches `createUnityInstance` to the global scope
// after `WebGL_build.loader.js` executes. We declare it here so TypeScript
// doesn't complain at the call site.
declare global {
  // eslint-disable-next-line no-var
  var createUnityInstance: (
    canvas: HTMLCanvasElement,
    config: {
      dataUrl: string;
      frameworkUrl: string;
      codeUrl: string;
      streamingAssetsUrl?: string;
      companyName?: string;
      productName?: string;
      productVersion?: string;
    },
    onProgress?: (progress: number) => void,
  ) => Promise<{ Quit?: () => Promise<void> }>;
}

interface UnityPlayerProps {
  /** Absolute URL path to the folder with the WebGL build (no trailing slash). */
  gamePath: string;
  /** Human-readable game name, used for aria labels and the loading indicator. */
  gameName: string;
  /** If true, asset filenames carry the `.unityweb` suffix (gzipped). */
  useUnityWebExtension?: boolean;
  /** If provided, a Stop button is shown next to the fullscreen toggle. */
  onStop?: () => void;
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
}

export default function UnityPlayer({
  gamePath,
  gameName,
  useUnityWebExtension = true,
  onStop,
  minWidth = 480,
  minHeight = 270,
  maxWidth = 1280,
  maxHeight = 720,
}: UnityPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [unityReady, setUnityReady] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [dimensions, setDimensions] = useState({
    width: maxWidth,
    height: maxHeight,
  });

  useEffect(() => {
    const updateDimensions = () => {
      if (isFullscreen) {
        setDimensions({
          width: window.innerWidth,
          height: window.innerHeight,
        });
        return;
      }

      const aspectRatio = 16 / 9;
      const padding = 32;

      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      const availableWidth = viewportWidth - padding;
      // The player lives inside the entry page, so we leave generous chrome
      // space for header/nav/footer and the controls row below.
      const headerFooterSpace = viewportWidth < 768 ? 260 : 360;
      const availableHeight = viewportHeight - headerFooterSpace;

      let width = Math.min(availableWidth, maxWidth);
      let height = width / aspectRatio;

      if (height > availableHeight) {
        height = Math.max(minHeight, availableHeight);
        width = height * aspectRatio;
      }

      width = Math.max(minWidth, Math.min(width, maxWidth));
      height = Math.max(minHeight, Math.min(height, maxHeight));

      setDimensions({
        width: Math.floor(width),
        height: Math.floor(height),
      });
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, [minWidth, minHeight, maxWidth, maxHeight, isFullscreen]);

  useEffect(() => {
    if (!canvasRef.current) return;

    let cancelled = false;
    let instance: { Quit?: () => Promise<void> } | null = null;

    const script = document.createElement("script");
    script.src = `${gamePath}/WebGL_build.loader.js`;
    script.async = true;

    const ext = useUnityWebExtension ? ".unityweb" : "";

    // Keep our "loading…" overlay visible for at least a short, perceptible
    // window so the user sees immediate feedback after clicking Play even
    // when the loader script is served from cache/same-origin in milliseconds.
    // Unity's own progress UI takes over the canvas as soon as our overlay
    // steps aside.
    const startedAt = Date.now();
    const MIN_OVERLAY_MS = 600;

    const revealUnityUI = () => {
      if (cancelled) return;
      const elapsed = Date.now() - startedAt;
      const wait = Math.max(0, MIN_OVERLAY_MS - elapsed);
      window.setTimeout(() => {
        if (!cancelled) setUnityReady(true);
      }, wait);
    };

    script.onload = async () => {
      if (cancelled || !canvasRef.current) return;
      revealUnityUI();
      try {
        instance = await createUnityInstance(canvasRef.current, {
          dataUrl: `${gamePath}/WebGL_build.data${ext}`,
          frameworkUrl: `${gamePath}/WebGL_build.framework.js${ext}`,
          codeUrl: `${gamePath}/WebGL_build.wasm${ext}`,
          streamingAssetsUrl: "StreamingAssets",
          companyName: "sci5th",
          productName: gameName,
          productVersion: "1.0",
        });
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load game");
        }
      }
    };

    script.onerror = () => {
      if (!cancelled) {
        setError("Failed to load Unity loader");
      }
    };

    document.body.appendChild(script);

    return () => {
      cancelled = true;
      if (instance?.Quit) {
        // Best-effort shutdown; ignore rejections.
        instance.Quit().catch(() => undefined);
      }
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [gamePath, gameName, useUnityWebExtension]);

  useEffect(() => {
    const onChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  const toggleFullscreen = async () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      await containerRef.current.requestFullscreen();
    } else {
      await document.exitFullscreen();
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div
        ref={containerRef}
        className={
          isFullscreen
            ? "fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-black"
            : "relative overflow-hidden rounded-lg border border-line-700 bg-black"
        }
        style={
          isFullscreen
            ? undefined
            : { width: dimensions.width, height: dimensions.height }
        }
      >
        {!unityReady && !error && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-black">
            <p className="font-mono text-xs uppercase tracking-wide text-text-300 md:text-sm">
              loading…
            </p>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-ink-900/90 px-4 text-center">
            <p className="text-sm text-feedback-error md:text-base">{error}</p>
          </div>
        )}

        <canvas
          ref={canvasRef}
          id="unity-canvas"
          width={dimensions.width}
          height={dimensions.height}
          className="block"
          style={{
            width: dimensions.width,
            height: dimensions.height,
            backgroundColor: "#000",
          }}
        />
      </div>

      <div className="mt-2 flex w-full items-center justify-between gap-3">
        {onStop ? (
          <button
            type="button"
            onClick={onStop}
            className="inline-flex items-center gap-1.5 rounded-md border border-line-700 bg-ink-800 px-3 py-1.5 text-sm text-text-300 transition-colors hover:border-brand-pink hover:text-text-100 focus-visible:border-brand-pink focus-visible:text-text-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue"
            aria-label={`Stop ${gameName}`}
            title="Stop"
          >
            <StopIcon className="h-4 w-4" aria-hidden="true" />
            <span>Stop</span>
          </button>
        ) : (
          <span aria-hidden="true" />
        )}
        <button
          type="button"
          onClick={toggleFullscreen}
          className="text-text-300 transition-colors hover:text-text-100 focus-visible:text-text-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue"
          title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
          aria-label={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
        >
          {isFullscreen ? (
            <ArrowsPointingInIcon className="h-5 w-5 md:h-6 md:w-6" />
          ) : (
            <ArrowsPointingOutIcon className="h-5 w-5 md:h-6 md:w-6" />
          )}
        </button>
      </div>
    </div>
  );
}
