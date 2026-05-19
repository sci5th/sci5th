"use client";

import { useEffect, useMemo, useRef, useState } from "react";

// ────────────────────────────────────────────────────────────────────────────
// FiveDimensionsHero — autoplay + loop, no controls.
// Ported from fiveDimensions/project/{animations,scenes}.jsx.
// Renders a 1920×1080 stage into any container; auto-scales to fit via
// ResizeObserver. Reduced-motion users see a static final-frame composition.
// ────────────────────────────────────────────────────────────────────────────

const STAGE_W = 1920;
const STAGE_H = 1080;
const DURATION = 18; // seconds — one pass, Cloud appears near-instantly

// ── Easing ──────────────────────────────────────────────────────────────────
const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
const easeOutCubic = (t: number) => {
  const u = t - 1;
  return u * u * u + 1;
};
const easeInOutSine = (t: number) => -(Math.cos(Math.PI * t) - 1) / 2;

const clamp = (v: number, min: number, max: number) =>
  Math.max(min, Math.min(max, v));

// Popmotion-style piecewise interpolation
function interpolate(
  input: number[],
  output: number[],
  ease: (t: number) => number = (t) => t
) {
  return (t: number) => {
    if (t <= input[0]) return output[0];
    if (t >= input[input.length - 1]) return output[output.length - 1];
    for (let i = 0; i < input.length - 1; i++) {
      if (t >= input[i] && t <= input[i + 1]) {
        const span = input[i + 1] - input[i];
        const local = span === 0 ? 0 : (t - input[i]) / span;
        return output[i] + (output[i + 1] - output[i]) * ease(local);
      }
    }
    return output[output.length - 1];
  };
}

// ── Palette ─────────────────────────────────────────────────────────────────
// Matches `ink.700` in tailwind.config.ts — the site's main page background.
const PAGE_BG = "#2a3140";
const TEXT = "rgba(232, 236, 245, 0.80)";
const TEXT_DIM = "rgba(232, 236, 245, 0.55)";

interface Orb {
  key: string;
  label: string;
  color: string;
}
const ORBS: readonly Orb[] = [
  { key: "1st", label: "1st DIMENSION", color: "#C9B8FF" },
  { key: "2nd", label: "2nd DIMENSION", color: "#B8E6D2" },
  { key: "3rd", label: "3rd DIMENSION", color: "#FFD4B8" },
  { key: "4th", label: "4th DIMENSION", color: "#F5C2D4" },
];

interface OrbPos {
  x: number;
  y: number;
  depth: number;
}
const ORB_POS: readonly OrbPos[] = [
  { x: 640, y: 440, depth: 0.95 }, // lavender — upper left (returned to original Y)
  { x: 1210, y: 380, depth: 1.05 }, // mint — upper right (returned to original Y)
  { x: 720, y: 700, depth: 1.1 }, // peach — lower left (returned to original Y)
  { x: 1280, y: 680, depth: 0.9 }, // rose — lower right (returned to original Y)
];

// ── Sub-components take `t` (seconds) directly to avoid Context churn ─────

// Background intentionally omitted — the hero is transparent so the host
// frame's own background shows through. Kept the function as a no-op in case
// we want to reintroduce a subtle gradient or vignette later.
function Background(_: { t: number }) {
  return null;
}

function Grain({ t }: { t: number }) {
  const seed = Math.floor(t * 3) % 8;
  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        opacity: 0.08,
        mixBlendMode: "overlay",
        pointerEvents: "none",
      }}
    >
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <filter id={`grain-${seed}`}>
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.9"
            numOctaves={2}
            seed={seed}
          />
          <feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.6 0" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#grain-${seed})`} />
      </svg>
    </div>
  );
}

interface Particle {
  baseX: number;
  baseY: number;
  speed: number;
  phase: number;
  size: number;
  opacity: number;
  hue: number;
}

function Particles({ t, count = 70 }: { t: number; count?: number }) {
  const particles = useMemo<Particle[]>(() => {
    const arr: Particle[] = [];
    for (let i = 0; i < count; i++) {
      const r1 = Math.sin(i * 12.9898) * 43758.5453;
      const r2 = Math.sin(i * 78.233) * 12345.6789;
      const r3 = Math.sin(i * 45.164) * 98765.4321;
      const r4 = Math.sin(i * 33.77) * 55555.5;
      arr.push({
        baseX: 300 + (r1 - Math.floor(r1)) * 1320,
        baseY: 180 + (r2 - Math.floor(r2)) * 720,
        speed: 0.05 + (r3 - Math.floor(r3)) * 0.15,
        phase: (r4 - Math.floor(r4)) * Math.PI * 2,
        size: 1 + (r1 - Math.floor(r1)) * 1.8,
        opacity: 0.2 + (r2 - Math.floor(r2)) * 0.5,
        hue: Math.floor((r3 - Math.floor(r3)) * 5),
      });
    }
    return arr;
  }, [count]);

  const fadeIn = easeOutCubic(clamp((t - 0.2) / 2.5, 0, 1));
  const colors = ["#C9B8FF", "#B8E6D2", "#FFD4B8", "#F5C2D4", "#B8D4FF"];

  return (
    <div
      aria-hidden
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
    >
      {particles.map((p, i) => {
        const drift = Math.sin(t * p.speed + p.phase) * 14;
        const driftY = Math.cos(t * p.speed * 0.7 + p.phase) * 10;
        const pulse = 0.5 + 0.5 * Math.sin(t * 0.8 + p.phase);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: p.baseX + drift,
              top: p.baseY + driftY,
              width: p.size,
              height: p.size,
              borderRadius: "50%",
              background: colors[p.hue],
              opacity: p.opacity * fadeIn * (0.6 + 0.4 * pulse),
              boxShadow: `0 0 ${p.size * 4}px ${colors[p.hue]}`,
              willChange: "transform, opacity",
            }}
          />
        );
      })}
    </div>
  );
}

function Cloud({ t }: { t: number }) {
  // Cloud grows slowly from t=0 until the 1st-Dimension orb appears (t=4.0).
  const reveal = easeInOutCubic(clamp(t / 4.0, 0, 1));
  const breathe = 1 + Math.sin(t * 0.35) * 0.015;
  const rot = Math.sin(t * 0.08) * 1.2;
  const exhale = interpolate([12, 13.5, 15], [0, 0.02, 0], easeInOutSine)(t);
  // End scale nudged up from 1.0 → 1.15 so the settled cloud reads a bit larger.
  const scale = (0.65 + reveal * 0.5) * breathe * (1 + exhale);
  const opacity = reveal;
  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        width: 1800,
        height: 1100,
        transform: `translate(-50%, -50%) scale(${scale}) rotate(${rot}deg)`,
        transformOrigin: "center",
        opacity,
        willChange: "transform, opacity",
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 55% 45% at 48% 52%, rgba(184, 212, 255, 0.22) 0%, rgba(201, 184, 255, 0.14) 30%, transparent 65%)",
          filter: "blur(60px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 35% 30% at 62% 45%, rgba(255, 212, 184, 0.12) 0%, transparent 60%)",
          filter: "blur(50px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 30% 28% at 38% 48%, rgba(184, 230, 210, 0.14) 0%, transparent 55%)",
          filter: "blur(55px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 28% 25% at 55% 60%, rgba(245, 194, 212, 0.10) 0%, transparent 55%)",
          filter: "blur(55px)",
        }}
      />
      {/* Outer dark halo intentionally omitted — it used to blend the cloud
          into the original `#0B0D12` backdrop; with the hero now transparent
          against the page `ink.700`, the halo would just darken the frame. */}
    </div>
  );
}

function Threads({ t }: { t: number }) {
  if (t < 5.9) return null;
  const threads = [
    { from: 0, to: 1, appear: 6.0 },
    { from: 0, to: 2, appear: 8.0 },
    { from: 1, to: 2, appear: 8.3 },
    { from: 0, to: 3, appear: 10.0 },
    { from: 1, to: 3, appear: 10.3 },
    { from: 2, to: 3, appear: 10.6 },
  ];
  return (
    <svg
      aria-hidden
      width={STAGE_W}
      height={STAGE_H}
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
    >
      <defs>
        <filter id="thread-blur">
          <feGaussianBlur stdDeviation="1.2" />
        </filter>
      </defs>
      {threads.map((th, i) => {
        const op = easeInOutCubic(clamp((t - th.appear) / 1.5, 0, 1));
        if (op <= 0.01) return null;
        const a = ORB_POS[th.from];
        const b = ORB_POS[th.to];
        const sway = Math.sin(t * 0.3 + i) * 8;
        const midX = (a.x + b.x) / 2 + sway;
        const midY = (a.y + b.y) / 2 - Math.abs(a.x - b.x) * 0.08 + sway * 0.5;
        const gradId = `thread-grad-${i}`;
        const cA = ORBS[th.from].color;
        const cB = ORBS[th.to].color;
        return (
          <g key={i} opacity={op * 0.45}>
            <defs>
              <linearGradient
                id={gradId}
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0%" stopColor={cA} stopOpacity="0.8" />
                <stop offset="50%" stopColor="#B8D4FF" stopOpacity="0.5" />
                <stop offset="100%" stopColor={cB} stopOpacity="0.8" />
              </linearGradient>
            </defs>
            <path
              d={`M ${a.x} ${a.y} Q ${midX} ${midY} ${b.x} ${b.y}`}
              stroke={`url(#${gradId})`}
              strokeWidth={1.2}
              fill="none"
              filter="url(#thread-blur)"
            />
          </g>
        );
      })}
    </svg>
  );
}

function OrbitalRing({
  index,
  size,
  t,
  appear,
  reveal,
  color,
}: {
  index: number;
  size: number;
  t: number;
  appear: number;
  reveal: number;
  color: string;
}) {
  const rot = (t - appear) * (10 + index * 4);
  const ringOp = easeOutCubic(clamp((t - appear - 0.3) / 1.2, 0, 1));
  const tilt = 60 + index * 8;
  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        width: size,
        height: size,
        transform: `translate(-50%, -50%) rotateX(${tilt}deg) rotate(${rot}deg) scale(${reveal})`,
        transformStyle: "preserve-3d",
        pointerEvents: "none",
        opacity: ringOp * 0.55,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          border: `1px solid ${color}`,
          opacity: 0.5,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: 0,
          width: 6,
          height: 6,
          transform: "translate(-50%, -50%)",
          borderRadius: "50%",
          background: color,
          boxShadow: `0 0 6px ${color}88, 0 0 12px ${color}33`,
          opacity: 0.7,
        }}
      />
    </div>
  );
}

function OrbLabel({
  label,
  index,
  appear,
  t,
  orbSize,
}: {
  label: string;
  index: number;
  appear: number;
  t: number;
  orbSize: number;
}) {
  const op = easeOutCubic(clamp((t - appear) / 1.0, 0, 1));
  if (op <= 0) return null;
  const offsets: { dx: number; dy: number; align: "left" | "right" }[] = [
    { dx: -orbSize * 1.1, dy: orbSize * 0.7, align: "right" },
    { dx: orbSize * 1.1, dy: orbSize * 0.7, align: "left" },
    { dx: -orbSize * 1.1, dy: -orbSize * 0.7, align: "right" },
    { dx: orbSize * 1.1, dy: -orbSize * 0.7, align: "left" },
  ];
  const off = offsets[index];
  const textAlign = off.align === "right" ? "right" : "left";
  const edgeStyle: React.CSSProperties =
    off.align === "right" ? { right: 0 } : { left: 0 };
  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: `translate(${off.dx - (off.align === "right" ? 320 : 0)}px, ${off.dy}px)`,
        width: 320,
        textAlign,
        opacity: op,
        willChange: "opacity, transform",
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: -orbSize * 0.35,
          ...edgeStyle,
          width: 32,
          height: 1,
          background: `linear-gradient(${off.align === "right" ? "to left" : "to right"}, rgba(232,236,245,0.35), transparent)`,
          opacity: op,
        }}
      />
      <div
        style={{
          fontSize: 22,
          fontWeight: 400,
          letterSpacing: "0.28em",
          color: TEXT,
          lineHeight: 1.3,
        }}
      >
        {label}
      </div>
    </div>
  );
}

function OrbNode({ index, t }: { index: number; t: number }) {
  const orb = ORBS[index];
  const pos = ORB_POS[index];
  const appear = 4.0 + index * 2.0;
  const reveal = easeInOutCubic(clamp((t - appear) / 1.8, 0, 1));
  if (reveal <= 0) return null;

  const pulseFreq = 0.8 + index * 0.07;
  const pulsePhase = index * 1.1;
  const pulse = 1 + Math.sin(t * pulseFreq + pulsePhase) * 0.05;

  const syncBoost = interpolate(
    [12, 13, 14.5, 15.5],
    [0, 0.06, 0.06, 0],
    easeInOutSine
  )(t);
  const syncPulse = 1 + Math.sin(t * 1.3) * syncBoost;

  const drift = Math.sin(t * 0.2 + index) * 6;
  const driftY = Math.cos(t * 0.18 + index * 1.3) * 4;

  const depthScale = pos.depth;
  const orbScale = reveal * pulse * syncPulse * depthScale;
  // Orbital ring + label offsets stay on the original 120px reference so
  // the ring radius and label anchor match the earlier geometry exactly.
  const orbSize = 120;
  // The colored sphere (and its glow/specular halo) renders 28% smaller than
  // the orbital-ring reference — a quiet, tight core inside the ring envelope.
  // (Previously 0.9 → now 0.72: a further 20% reduction on top of the prior 10%.)
  const sphereSize = orbSize * 0.72;

  const bloomPulse = 1 + Math.sin(t * pulseFreq + pulsePhase) * 0.08;

  return (
    <div
      style={{
        position: "absolute",
        left: pos.x + drift,
        top: pos.y + driftY,
        transform: "translate(-50%, -50%)",
        willChange: "transform",
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: sphereSize * 3,
          height: sphereSize * 3,
          transform: `translate(-50%, -50%) scale(${orbScale * bloomPulse})`,
          background: `radial-gradient(circle at 50% 50%, ${orb.color}14 0%, ${orb.color}08 30%, transparent 65%)`,
          filter: "blur(24px)",
          opacity: reveal * 0.35,
          pointerEvents: "none",
        }}
      />
      <div
        aria-hidden
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: sphereSize * 1.5,
          height: sphereSize * 1.5,
          transform: `translate(-50%, -50%) scale(${orbScale * bloomPulse})`,
          background: `radial-gradient(circle at 50% 50%, ${orb.color}55 0%, ${orb.color}22 25%, transparent 60%)`,
          filter: "blur(10px)",
          opacity: reveal * 0.5,
        }}
      />
      <OrbitalRing
        index={index}
        size={orbSize * 1.6}
        t={t}
        appear={appear}
        reveal={reveal}
        color={orb.color}
      />
      <div
        aria-hidden
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: sphereSize,
          height: sphereSize,
          transform: `translate(-50%, -50%) scale(${orbScale})`,
          borderRadius: "50%",
          background: `radial-gradient(circle at 38% 32%, #ffffff 0%, ${orb.color} 18%, ${orb.color}dd 50%, ${orb.color}66 90%)`,
          boxShadow: `0 0 12px ${orb.color}33, inset -8px -12px 30px ${orb.color}44`,
          opacity: reveal,
        }}
      />
      <div
        aria-hidden
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: sphereSize * 0.35,
          height: sphereSize * 0.35,
          transform: `translate(calc(-50% - ${sphereSize * 0.18}px), calc(-50% - ${sphereSize * 0.2}px)) scale(${orbScale})`,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(255,255,255,0.28) 0%, transparent 70%)",
          filter: "blur(4px)",
          opacity: reveal * 0.6,
        }}
      />
      <OrbLabel
        label={orb.label}
        index={index}
        appear={appear + 0.4}
        t={t}
        orbSize={orbSize * depthScale}
      />
    </div>
  );
}

function InformationLabel({ t }: { t: number }) {
  // "Information" wordmark appears 2.0s before the 1st-Dimension orb (t=4.0),
  // so it starts fading in at t=2.0. The eyebrow ("The fifth dimension") and
  // the "?" glyph — the 5th-dimension reveal — begin fading in at t=12.0.
  const infoOp = easeInOutCubic(clamp((t - 2.0) / 1.8, 0, 1));
  const chromeOp = easeInOutCubic(clamp((t - 12.0) / 2.0, 0, 1));
  if (infoOp <= 0 && chromeOp <= 0) return null;
  const dy = (1 - infoOp) * 10;
  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: `translate(-50%, calc(-50% + ${dy}px))`,
        pointerEvents: "none",
        textAlign: "center",
        willChange: "opacity, transform",
      }}
    >
      {/* Eyebrow — absolute so its own fade-in doesn't shift the wordmark.
          Positioned just above the "Information" baseline. */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          bottom: "calc(100% + 14px)",
          transform: "translateX(-50%)",
          whiteSpace: "nowrap",
          fontSize: 20,
          fontWeight: 400,
          letterSpacing: "0.45em",
          color: TEXT_DIM,
          opacity: chromeOp,
        }}
      >
        THE 5th DIMENSION
      </div>
      <div
        style={{
          fontSize: 49,
          fontWeight: 300,
          letterSpacing: "0.38em",
          color: TEXT,
          textTransform: "uppercase",
          textShadow: "0 0 40px rgba(184, 212, 255, 0.3)",
          opacity: infoOp,
        }}
      >
        Information
      </div>
      {/* "?" — absolute so its own fade-in doesn't shift anything. */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          left: "50%",
          top: "calc(100% + 14px)",
          transform: "translateX(-50%)",
          fontFamily:
            'Futura, "Futura PT", "Century Gothic", "Avenir Next", Avenir, "ITC Avant Garde Gothic", "Nunito Sans", "Trebuchet MS", sans-serif',
          fontSize: 52,
          fontWeight: 300,
          letterSpacing: "0.02em",
          color: TEXT_DIM,
          lineHeight: 1,
          textShadow: "0 0 30px rgba(184, 212, 255, 0.25)",
          opacity: chromeOp,
        }}
      >
        ?
      </div>
    </div>
  );
}

// ── Stage ────────────────────────────────────────────────────────────────
interface FiveDimensionsHeroProps {
  /**
   * Reserved for future use. The hero now always scales its content with
   * `contain` semantics (so nothing is ever cropped or stretched, regardless
   * of viewport shape) while the surrounding `PAGE_BG` fill covers the full
   * container — giving a "responsive: background fills, content scales down"
   * behavior without any cropping or distortion.
   */
  fit?: "contain" | "cover";
}

export default function FiveDimensionsHero(_: FiveDimensionsHeroProps = {}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);

  // `mounted` gates the entire animated scene so SSR emits only the outer
  // container — avoiding hydration mismatch on dynamic transforms/opacities.
  const [mounted, setMounted] = useState(false);
  const [time, setTime] = useState(0);
  const [scale, setScale] = useState(1);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Mark mounted on first client render
  useEffect(() => {
    setMounted(true);
  }, []);

  // Detect prefers-reduced-motion
  useEffect(() => {
    if (!mounted) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, [mounted]);

  // Auto-scale to fit container — always `contain` semantics so nothing on
  // the 1920×1080 stage (orbs, labels, threads) is ever cropped or
  // stretched. The container's `PAGE_BG` background fills any leftover area
  // on whichever axis the contain-fit doesn't exhaust, so the visual reads
  // as "background fills full screen, content scales down to fit".
  useEffect(() => {
    if (!mounted) return;
    const el = containerRef.current;
    if (!el) return;
    const measure = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      const sx = w / STAGE_W;
      const sy = h / STAGE_H;
      const s = Math.min(sx, sy);
      setScale(Math.max(0.05, s));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [mounted]);

  // Animation loop — autoplay once, then hold the final frame. Reduced-motion
  // users skip the animation and see the final composition immediately.
  useEffect(() => {
    if (!mounted) return;
    if (reducedMotion) {
      setTime(DURATION); // snap to the final frame
      return;
    }
    const step = (ts: number) => {
      if (startRef.current == null) startRef.current = ts;
      const elapsed = (ts - startRef.current) / 1000;
      if (elapsed >= DURATION) {
        setTime(DURATION); // hold the final frame
        rafRef.current = null;
        return;
      }
      setTime(elapsed);
      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      startRef.current = null;
    };
  }, [mounted, reducedMotion]);

  return (
    <div
      ref={containerRef}
      role="img"
      aria-label="sci5th — animated five-dimensions hero"
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        background: PAGE_BG,
      }}
    >
      {mounted && (
        <div
          style={{
            position: "relative",
            width: STAGE_W,
            height: STAGE_H,
            transform: `scale(${scale})`,
            transformOrigin: "center",
            flexShrink: 0,
            overflow: "hidden",
          }}
        >
          <Background t={time} />
          <Cloud t={time} />
          {!reducedMotion && <Particles t={time} count={70} />}
          <Threads t={time} />
          <OrbNode index={0} t={time} />
          <OrbNode index={1} t={time} />
          <OrbNode index={2} t={time} />
          <OrbNode index={3} t={time} />
          <InformationLabel t={time} />
          {!reducedMotion && <Grain t={time} />}
        </div>
      )}
    </div>
  );
}
