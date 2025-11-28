"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowsPointingOutIcon,
  ArrowsPointingInIcon,
} from "@heroicons/react/24/outline";

declare global {
  function createUnityInstance(
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
    onProgress?: (progress: number) => void
  ): Promise<unknown>;
}

interface UnityPlayerProps {
  gamePath: string;
  gameName: string;
  width?: number;
  height?: number;
}

export default function UnityPlayer({
  gamePath,
  gameName,
  width = 960,
  height = 540,
}: UnityPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [dimensions, setDimensions] = useState({ width, height });

  // Calculate responsive dimensions
  useEffect(() => {
    const updateDimensions = () => {
      if (isFullscreen) {
        setDimensions({
          width: window.innerWidth,
          height: window.innerHeight,
        });
        return;
      }

      const aspectRatio = width / height;
      const maxWidth = Math.min(window.innerWidth - 32, width); // 32px for padding
      const maxHeight = window.innerHeight - 200; // Space for nav, logo, footer, controls

      let newWidth = maxWidth;
      let newHeight = maxWidth / aspectRatio;

      if (newHeight > maxHeight) {
        newHeight = maxHeight;
        newWidth = maxHeight * aspectRatio;
      }

      setDimensions({
        width: Math.floor(newWidth),
        height: Math.floor(newHeight),
      });
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, [width, height, isFullscreen]);

  useEffect(() => {
    if (!canvasRef.current) return;

    const script = document.createElement("script");
    script.src = `${gamePath}/WebGL_build.loader.js`;
    script.async = true;

    script.onload = async () => {
      try {
        await createUnityInstance(
          canvasRef.current!,
          {
            dataUrl: `${gamePath}/WebGL_build.data.unityweb`,
            frameworkUrl: `${gamePath}/WebGL_build.framework.js.unityweb`,
            codeUrl: `${gamePath}/WebGL_build.wasm.unityweb`,
            streamingAssetsUrl: "StreamingAssets",
            companyName: "sci5th",
            productName: gameName,
            productVersion: "1.0",
          },
          (p) => setProgress(Math.round(p * 100))
        );
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load game");
        setLoading(false);
      }
    };

    script.onerror = () => {
      setError("Failed to load Unity loader");
      setLoading(false);
    };

    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [gamePath, gameName]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
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
    <div className="flex flex-col">
      <div
        ref={containerRef}
        className={`relative ${isFullscreen ? "flex items-center justify-center bg-black" : ""}`}
        style={isFullscreen ? { width: "100vw", height: "100vh" } : {}}
      >
        {loading && (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center rounded-lg bg-slate-800"
            style={{ width: dimensions.width, height: dimensions.height }}
          >
            <p className="mb-2 text-white">
              Loading {gameName}... {progress}%
            </p>
            <div className="h-2 w-48 overflow-hidden rounded-full bg-slate-600">
              <div
                className="h-full bg-blue-500 transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {error && (
          <div
            className="absolute inset-0 flex items-center justify-center rounded-lg bg-slate-800"
            style={{ width: dimensions.width, height: dimensions.height }}
          >
            <p className="text-red-400">{error}</p>
          </div>
        )}

        <canvas
          ref={canvasRef}
          id="unity-canvas"
          width={dimensions.width}
          height={dimensions.height}
          className="rounded-lg"
          style={{
            width: dimensions.width,
            height: dimensions.height,
          }}
        />
      </div>

      <div className="relative mt-2 flex items-center justify-center">
        <p className="text-lg text-white">{gameName}</p>
        <button
          onClick={toggleFullscreen}
          className="absolute right-0 text-white transition-opacity hover:opacity-80"
          title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
        >
          {isFullscreen ? (
            <ArrowsPointingInIcon className="h-6 w-6" />
          ) : (
            <ArrowsPointingOutIcon className="h-6 w-6" />
          )}
        </button>
      </div>
    </div>
  );
}
