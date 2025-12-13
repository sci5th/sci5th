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
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
  useUnityWebExtension?: boolean;
}

export default function UnityPlayer({
  gamePath,
  gameName,
  minWidth = 480,
  minHeight = 270,
  maxWidth = 1280,
  maxHeight = 720,
  useUnityWebExtension = true,
}: UnityPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [dimensions, setDimensions] = useState({
    width: maxWidth,
    height: maxHeight,
  });

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

      const aspectRatio = 16 / 9;
      const padding = 32;

      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;

      // Reserve space for header/footer/controls/page-padding
      // Mobile (<768): nav(32) + logo(60) + footer(32) + controls(28) + page-py(16) + buffer(32) = 200
      // Tablet (768-1023): nav(64) + logo(104) + footer(64) + controls(32) + page-py(32) + buffer(32) = 328
      // Desktop (1024+): nav(64) + logo(136) + footer(64) + controls(32) + page-py(32) + buffer(32) = 360
      const isMobile = viewportWidth < 768;
      const isLarge = viewportWidth >= 1024;

      let headerFooterSpace: number;
      if (isMobile) {
        headerFooterSpace = 200;
      } else if (isLarge) {
        headerFooterSpace = 360;
      } else {
        headerFooterSpace = 328;
      }

      const availableWidth = viewportWidth - padding;
      const availableHeight = viewportHeight - headerFooterSpace;

      let newWidth = Math.min(availableWidth, maxWidth);
      let newHeight = newWidth / aspectRatio;

      if (newHeight > availableHeight) {
        newHeight = availableHeight;
        newWidth = newHeight * aspectRatio;
      }

      newWidth = Math.max(minWidth, newWidth);
      newHeight = Math.max(minHeight, newHeight);

      setDimensions({
        width: Math.floor(newWidth),
        height: Math.floor(newHeight),
      });
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, [minWidth, minHeight, maxWidth, maxHeight, isFullscreen]);

  useEffect(() => {
    if (!canvasRef.current) return;

    const script = document.createElement("script");
    script.src = `${gamePath}/WebGL_build.loader.js`;
    script.async = true;

        const extension = useUnityWebExtension ? ".unityweb" : "";

    script.onload = async () => {
      try {
        await createUnityInstance(
          canvasRef.current!,
          {
            dataUrl: `${gamePath}/WebGL_build.data${extension}`,
            frameworkUrl: `${gamePath}/WebGL_build.framework.js${extension}`,
            codeUrl: `${gamePath}/WebGL_build.wasm${extension}`,
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
        className={`relative overflow-hidden ${isFullscreen ? "flex items-center justify-center bg-black" : ""}`}
        style={isFullscreen ? { width: "100vw", height: "100vh" } : {width: dimensions.width, height: dimensions.height}}
      >
        {loading && (
          <div
            className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-800"
          >
            <p className="mb-2 text-sm text-white md:text-base">
              Loading {gameName}... {progress}%
            </p>
            <div className="h-2 w-32 overflow-hidden rounded-full bg-slate-600 md:w-48">
              <div
                className="h-full bg-blue-500 transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {error && (
          <div
            className="absolute inset-0 z-10 flex items-center justify-center bg-slate-800"
          >
            <p className="text-red-400">{error}</p>
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
            backgroundColor: '#000',
            marginTop: isFullscreen ? -8 : -2,
          }}
        />
      </div>

      <div className="relative mt-1 flex items-center justify-center">
        <p className="text-sm text-white md:text-lg">{gameName}</p>
        <button
          onClick={toggleFullscreen}
          className="absolute right-0 text-white transition-opacity hover:opacity-80"
          title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
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
