"use client";

import { useEffect, useRef, useState } from "react";

// Interactive hero for the "Nervous System" entry. Set a stimulus and fire:
// if it clears the threshold, an all-or-nothing action potential travels the
// axon (saltatory jumps between myelin segments), releases neurotransmitter
// across the synapse, and charges the downstream neuron. Below threshold, the
// soma depolarizes briefly and fizzles — no spike. Respects
// prefers-reduced-motion (skips the travelling animation, snaps to the result).

const VW = 960;
const VH = 540;
const AXON_Y = 270;
const SOMA = { x: 235, y: AXON_Y, r: 58 };
const AXON_X0 = 295;
const AXON_X1 = 700;
const TERMINAL_X = 700;
const DOWN = { x: 852, y: AXON_Y, r: 46 };
const CLEFT_X0 = 745;
const CLEFT_X1 = 805;
const NODES = [330, 410, 490, 570, 650]; // myelin segment centers
const THRESHOLD = 50;
const DURATION = 1700; // ms

const LILAC = "#c4b0e3";
const LILAC_DIM = "#9470cc";
const SKY = "#a7c5e8";
const SKY_DIM = "#6298d6";
const SAGE = "#a3d4bd";
const SAND = "#e3cf9b";
const INK500 = "#55607a";

type Status = "resting" | "firing" | "received" | "subthreshold";

const STATUS_TEXT: Record<Status, string> = {
  resting: "Resting potential — set a stimulus and fire.",
  firing: "Action potential firing — travelling down the axon…",
  received: "Signal received — the downstream neuron is depolarized.",
  subthreshold: "Below threshold — the soma depolarizes, but no spike fires.",
};

function hexA(hex: string, a: number) {
  const h = hex.replace("#", "");
  return `rgba(${parseInt(h.slice(0, 2), 16)}, ${parseInt(h.slice(2, 4), 16)}, ${parseInt(h.slice(4, 6), 16)}, ${a})`;
}

export default function InteractiveNeuron() {
  const [stimulus, setStimulus] = useState(70);
  const [t, setT] = useState(0); // 0..1 animation progress
  const [firing, setFiring] = useState(false);
  const [charged, setCharged] = useState(false);
  const [bump, setBump] = useState(false); // subthreshold soma flash
  const [status, setStatus] = useState<Status>("resting");
  const reduced = useRef(false);
  const raf = useRef<number | null>(null);
  const start = useRef(0);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    reduced.current = mq.matches;
    const on = () => (reduced.current = mq.matches);
    mq.addEventListener("change", on);
    return () => {
      mq.removeEventListener("change", on);
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, []);

  const fire = () => {
    if (firing) return;
    setCharged(false);
    if (stimulus < THRESHOLD) {
      setStatus("subthreshold");
      setBump(true);
      window.setTimeout(() => setBump(false), 550);
      return;
    }
    if (reduced.current) {
      setT(1);
      setCharged(true);
      setStatus("received");
      return;
    }
    setStatus("firing");
    setFiring(true);
    setT(0);
    start.current = performance.now();
    const loop = (now: number) => {
      const p = Math.min((now - start.current) / DURATION, 1);
      setT(p);
      if (p < 1) {
        raf.current = requestAnimationFrame(loop);
      } else {
        setFiring(false);
        setCharged(true);
        setStatus("received");
      }
    };
    raf.current = requestAnimationFrame(loop);
  };

  // Phase math
  const travel = Math.min(t / 0.6, 1); // 0..1 spike along axon
  const release = t > 0.6 ? Math.min((t - 0.6) / 0.22, 1) : 0;
  const receive = t > 0.82 ? Math.min((t - 0.82) / 0.18, 1) : 0;
  const spikeX = AXON_X0 + (AXON_X1 - AXON_X0) * travel;
  const spikeActive = firing && t < 0.62;
  const downGlow = charged ? 1 : receive;

  // dendrites for a soma
  const dendrites = (cx: number, cy: number, r: number, dir: number) =>
    Array.from({ length: 7 }, (_, i) => {
      const a =
        Math.PI * (0.55 + (i / 6) * 0.9) * dir + (dir < 0 ? Math.PI : 0);
      const x1 = cx + Math.cos(a) * r;
      const y1 = cy + Math.sin(a) * r;
      const x2 = cx + Math.cos(a) * (r + 70);
      const y2 = cy + Math.sin(a) * (r + 70);
      return { x1, y1, x2, y2, a };
    });

  return (
    <div className="mb-8">
      <div className="w-full overflow-hidden rounded-lg border border-line-700 bg-ink-900">
        <svg
          viewBox={`0 0 ${VW} ${VH}`}
          className="block w-full"
          role="img"
          aria-label="Interactive neuron: stimulate to fire an action potential"
        >
          {/* dendrites (input side) */}
          {dendrites(SOMA.x, SOMA.y, SOMA.r, -1).map((d, i) => (
            <g key={i}>
              <line
                x1={d.x1}
                y1={d.y1}
                x2={d.x2}
                y2={d.y2}
                stroke={LILAC}
                strokeWidth={2}
                strokeLinecap="round"
                opacity={0.8}
              />
              <line
                x1={d.x2}
                y1={d.y2}
                x2={d.x2 + Math.cos(d.a + 0.3) * 26}
                y2={d.y2 + Math.sin(d.a + 0.3) * 26}
                stroke={LILAC}
                strokeWidth={1.4}
                strokeLinecap="round"
                opacity={0.55}
              />
            </g>
          ))}

          {/* axon */}
          <line
            x1={AXON_X0}
            y1={AXON_Y}
            x2={TERMINAL_X}
            y2={AXON_Y}
            stroke={SKY_DIM}
            strokeWidth={3}
            opacity={0.7}
          />
          {/* myelin segments */}
          {NODES.map((nx, i) => (
            <ellipse
              key={i}
              cx={nx}
              cy={AXON_Y}
              rx={28}
              ry={15}
              fill={hexA(SKY, 0.28)}
              stroke={SKY}
              strokeWidth={1.6}
            />
          ))}

          {/* axon terminals */}
          {[-38, 0, 38].map((dy, i) => (
            <line
              key={i}
              x1={TERMINAL_X}
              y1={AXON_Y}
              x2={CLEFT_X0}
              y2={AXON_Y + dy}
              stroke={SKY_DIM}
              strokeWidth={2}
              strokeLinecap="round"
              opacity={0.8}
            />
          ))}

          {/* downstream neuron dendrites + soma */}
          {dendrites(DOWN.x, DOWN.y, DOWN.r, 1)
            .slice(0, 4)
            .map((d, i) => (
              <line
                key={i}
                x1={d.x1}
                y1={d.y1}
                x2={d.x2}
                y2={d.y2}
                stroke={SAGE}
                strokeWidth={1.6}
                strokeLinecap="round"
                opacity={0.6}
              />
            ))}
          {downGlow > 0 && (
            <circle
              cx={DOWN.x}
              cy={DOWN.y}
              r={DOWN.r + 14 * downGlow}
              fill={hexA(SAGE, 0.18 * downGlow)}
            />
          )}
          <circle
            cx={DOWN.x}
            cy={DOWN.y}
            r={DOWN.r}
            fill={hexA(SAGE, 0.35 + 0.4 * downGlow)}
            stroke={SAGE}
            strokeWidth={2.4}
          />

          {/* neurotransmitter dots crossing the cleft */}
          {release > 0 &&
            release < 1.02 &&
            [0, 1, 2, 3, 4].map((i) => {
              const off = (i - 2) * 16;
              const x = CLEFT_X0 + (CLEFT_X1 - CLEFT_X0) * release;
              return (
                <circle
                  key={i}
                  cx={x}
                  cy={AXON_Y + off}
                  r={5}
                  fill={SAND}
                  opacity={0.9}
                />
              );
            })}

          {/* soma (input neuron) */}
          <circle
            cx={SOMA.x}
            cy={SOMA.y}
            r={SOMA.r + (bump ? 8 : 0)}
            fill={hexA(LILAC, bump ? 0.55 : 0.4)}
            stroke={LILAC}
            strokeWidth={2.6}
            style={{ transition: "all 180ms ease-out" }}
          />
          <circle cx={SOMA.x} cy={SOMA.y} r={18} fill={LILAC_DIM} />

          {/* travelling action potential */}
          {spikeActive && (
            <g>
              <circle cx={spikeX} cy={AXON_Y} r={26} fill={hexA(SAND, 0.18)} />
              <circle cx={spikeX} cy={AXON_Y} r={16} fill={hexA(SAND, 0.4)} />
              <circle cx={spikeX} cy={AXON_Y} r={9} fill={SAND} />
            </g>
          )}
        </svg>
      </div>

      {/* Controls */}
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex-1">
          <div className="flex items-center justify-between text-[0.7rem] text-text-300 sm:text-xs">
            <span>Stimulus strength</span>
            <span
              className="font-mono"
              style={{ color: stimulus >= THRESHOLD ? SAGE : INK500 }}
            >
              {stimulus} {stimulus >= THRESHOLD ? "≥" : "<"} threshold{" "}
              {THRESHOLD}
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={stimulus}
            onChange={(e) => setStimulus(Number(e.target.value))}
            className="mt-1 w-full accent-[#a7c5e8]"
            aria-label="Stimulus strength"
          />
        </div>
        <button
          type="button"
          onClick={fire}
          disabled={firing}
          className="shrink-0 rounded-md border border-line-700 bg-ink-800 px-4 py-2 text-sm font-medium text-text-100 transition-colors hover:border-brand-pink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue disabled:opacity-50"
        >
          {firing ? "Firing…" : "Stimulate ⚡"}
        </button>
      </div>
      <p
        className="mt-2 text-[0.7rem] sm:text-xs"
        style={{
          color:
            status === "received"
              ? SAGE
              : status === "subthreshold"
                ? "#a5a79f"
                : status === "firing"
                  ? SAND
                  : "#a5a79f",
        }}
        aria-live="polite"
      >
        {STATUS_TEXT[status]}
      </p>
    </div>
  );
}
