"use client";

import { useEffect, useMemo, useRef, useState } from "react";

// Interactive hero + mini-game for the "Law of Universal Gravitation" entry.
//
// Newton's cannonball: a projectile is fired sideways from a mountain top and
// then moves under F = GMm/r² alone. The three possible outcomes are the
// whole lesson:
//
//  • too slow → the path bends into the ground: it falls, like the apple.
//  • fast enough → it still falls continuously, but moves sideways fast
//    enough to keep missing the surface — a closed orbit, like the Moon.
//  • ≥ √2 × circular speed → kinetic energy beats the potential well and the
//    projectile escapes for good.
//
// The planet-mass slider scales GM (the masses in the numerator), and the
// live readout shows the pull weakening with 1/r² as the projectile climbs.
//
// Pure React + SVG, no external libs, no storage. Respects
// prefers-reduced-motion: Launch computes the entire trajectory instantly and
// renders the final path + outcome with no travelling animation.

const VW = 960;
const VH = 540;

const CX = VW / 2;
const CY = VH / 2 + 30;
const PLANET_R = 64;
const LAUNCH_R = 94; // mountain-top radius — the cannon's altitude
const BASE_GM = 940_000; // circular speed at LAUNCH_R = 100 when mass = 1×

const ESCAPE_R = 1500; // beyond this it is gone regardless
const MAX_SIM_TIME = 600; // seconds of simulated time before we call it
const H = 0.003; // physics substep (simulated seconds)

// Palette (mirrors the dark ink tokens; SVG needs literal colors).
const SKY = "#a7c5e8";
const SKY_DIM = "#6298d6";
const SAND = "#e3cf9b";
const SAGE = "#a3d4bd";
const ROSE = "#e7b9c7";
const TEXT300 = "#a5a79f";

type Phase = "ready" | "flying" | "orbit" | "crashed" | "escaped";

type Body = { x: number; y: number; vx: number; vy: number };

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}

// A fixed starfield, generated once (module scope) so it never re-seeds.
const STARS = Array.from({ length: 46 }, () => ({
  x: rand(0, VW),
  y: rand(0, VH),
  r: rand(0.4, 1.5),
  o: rand(0.2, 0.7),
}));

// Semi-implicit Euler step under a single inverse-square attractor at (CX, CY).
function stepBody(b: Body, gm: number, h: number) {
  const dx = b.x - CX;
  const dy = b.y - CY;
  const r2 = dx * dx + dy * dy;
  const r = Math.sqrt(r2);
  const a = -gm / (r2 * r);
  b.vx += dx * a * h;
  b.vy += dy * a * h;
  b.x += b.vx * h;
  b.y += b.vy * h;
  return r;
}

function outcomeAt(b: Body, r: number, gm: number): Phase | null {
  if (r <= PLANET_R + 2.5) return "crashed";
  // Specific orbital energy ≥ 0 means an unbound (escape) trajectory; only
  // call it once the projectile is well clear of the play area.
  if (r > 700 && (b.vx * b.vx + b.vy * b.vy) / 2 - gm / r >= 0)
    return "escaped";
  if (r > ESCAPE_R) return "escaped";
  return null;
}

export default function InteractiveGravity() {
  const [speed, setSpeed] = useState(80);
  const [mass, setMass] = useState(1);
  const [phase, setPhase] = useState<Phase>("ready");
  const [orbits, setOrbits] = useState(0);
  const [, setTick] = useState(0); // forces a re-render each animation frame

  // Physics state lives in refs so the rAF loop mutates without re-subscribing.
  const body = useRef<Body>({ x: CX, y: CY - LAUNCH_R, vx: 0, vy: 0 });
  const trail = useRef<{ x: number; y: number }[]>([]);
  const ghost = useRef<{ x: number; y: number }[]>([]);
  const sweep = useRef(0); // total angle swept around the planet this attempt
  const lastAngle = useRef(0);
  const simTime = useRef(0);
  const phaseRef = useRef<Phase>("ready");
  const massRef = useRef(mass);
  const reduced = useRef(false);
  const raf = useRef<number | null>(null);
  const last = useRef(0);
  const starPhase = useRef(0);

  useEffect(() => {
    massRef.current = mass;
  }, [mass]);

  // Advance the simulation by dtSim seconds in fixed substeps. Returns the
  // terminal phase if one was reached, else null.
  const advance = (dtSim: number): Phase | null => {
    const gm = BASE_GM * massRef.current;
    const n = Math.min(Math.ceil(dtSim / H), 4000);
    for (let i = 0; i < n; i++) {
      const r = stepBody(body.current, gm, H);
      simTime.current += H;

      const ang = Math.atan2(body.current.y - CY, body.current.x - CX);
      let d = ang - lastAngle.current;
      if (d > Math.PI) d -= 2 * Math.PI;
      else if (d < -Math.PI) d += 2 * Math.PI;
      sweep.current += Math.abs(d);
      lastAngle.current = ang;

      const t = trail.current;
      const lastP = t[t.length - 1];
      if (
        !lastP ||
        Math.hypot(body.current.x - lastP.x, body.current.y - lastP.y) > 4
      ) {
        t.push({ x: body.current.x, y: body.current.y });
        if (t.length > 1400) t.shift();
      }

      const out = outcomeAt(body.current, r, gm);
      if (out) return out;
      if (sweep.current >= Math.PI * 2) return "orbit";
      if (simTime.current > MAX_SIM_TIME) return "escaped";
    }
    return null;
  };

  const finish = (out: Phase) => {
    phaseRef.current = out;
    setPhase(out);
    if (out === "orbit") setOrbits((n) => n + 1);
  };

  const launch = () => {
    if (trail.current.length > 1) ghost.current = trail.current;
    trail.current = [];
    body.current = { x: CX, y: CY - LAUNCH_R, vx: speed, vy: 0 };
    sweep.current = 0;
    lastAngle.current = -Math.PI / 2;
    simTime.current = 0;

    if (reduced.current) {
      // No travelling animation: integrate to the outcome in one go and show
      // the completed path.
      let out: Phase | null = null;
      for (let g = 0; g < 3000 && !out; g++) out = advance(0.25);
      finish(out ?? "escaped");
    } else {
      phaseRef.current = "flying";
      setPhase("flying");
    }
  };

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    reduced.current = mq.matches;
    const onMq = () => (reduced.current = mq.matches);
    mq.addEventListener("change", onMq);

    const loop = (now: number) => {
      if (!last.current) last.current = now;
      const dt = Math.min((now - last.current) / 1000, 0.032);
      last.current = now;

      if (phaseRef.current === "flying") {
        // Time-warp far from the planet, where motion is slow and the arc is
        // gentle, so long ellipses don't take minutes of wall clock.
        const r = Math.hypot(body.current.x - CX, body.current.y - CY);
        const warp = Math.min(Math.max(Math.pow(r / LAUNCH_R, 1.5), 1), 24);
        const out = advance(dt * 1.1 * warp);
        if (out) finish(out);
      }

      if (!reduced.current) starPhase.current += dt * 10;
      setTick((t) => (t + 1) % 1000000);
      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);

    return () => {
      mq.removeEventListener("change", onMq);
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, []);

  // Short aiming hint: the first ~1.7 simulated seconds of the trajectory,
  // recomputed as the sliders move. Deliberately short — it shows how the
  // path starts to bend without giving away the outcome.
  const preview = useMemo(() => {
    const gm = BASE_GM * mass;
    const b: Body = { x: CX, y: CY - LAUNCH_R, vx: speed, vy: 0 };
    const pts: string[] = [`${b.x},${b.y}`];
    for (let i = 0; i < 140; i++) {
      let r = LAUNCH_R;
      for (let k = 0; k < 3; k++) r = stepBody(b, gm, 0.004);
      pts.push(`${b.x.toFixed(1)},${b.y.toFixed(1)}`);
      if (r <= PLANET_R) break;
    }
    return pts.join(" ");
  }, [speed, mass]);

  const vCirc = Math.sqrt((BASE_GM * mass) / LAUNCH_R);
  const vEsc = vCirc * Math.SQRT2;

  const p = body.current;
  const rNow = Math.hypot(p.x - CX, p.y - CY);
  const vNow = Math.hypot(p.vx, p.vy);
  const flying = phase === "flying";
  const done = phase === "orbit" || phase === "crashed" || phase === "escaped";
  // Inverse-square readout, relative to the pull at the launch altitude.
  const fRatio = (LAUNCH_R / Math.max(rNow, PLANET_R)) ** 2;

  const trailPts = trail.current
    .map((q) => `${q.x.toFixed(1)},${q.y.toFixed(1)}`)
    .join(" ");
  const ghostPts = ghost.current
    .map((q) => `${q.x.toFixed(1)},${q.y.toFixed(1)}`)
    .join(" ");

  const gravLen = Math.min(14 + 34 * fRatio, 70);
  const gx = (CX - p.x) / Math.max(rNow, 1);
  const gy = (CY - p.y) / Math.max(rNow, 1);

  const statusColor =
    phase === "orbit"
      ? SAGE
      : phase === "crashed"
        ? ROSE
        : phase === "escaped"
          ? SAND
          : TEXT300;
  const statusText =
    phase === "orbit"
      ? "Orbit! It never stopped falling — it just moves sideways fast enough to keep missing the planet. The Moon's trick."
      : phase === "crashed"
        ? "Fell back — the apple. Too little sideways speed, so the curve of the fall met the ground."
        : phase === "escaped"
          ? "Escaped — at √2 × circular speed and beyond, kinetic energy beats gravity's grip and the pull (∝ 1/r²) fades too fast to win."
          : phase === "flying"
            ? "Falling the whole time — the pull always points at the planet's centre and weakens with 1/r²."
            : "Set a launch speed and fire. Gravity does the rest: F = GMm/r².";

  return (
    <div className="mb-8">
      <div
        className="relative w-full overflow-hidden rounded-lg border border-line-700 bg-ink-950"
        role="group"
        aria-label="Orbit launcher: fire a projectile from a mountain and find the speed that makes it orbit"
      >
        <svg viewBox={`0 0 ${VW} ${VH}`} className="block w-full">
          {/* starfield */}
          {STARS.map((s, i) => {
            const drift = reduced.current
              ? s.x
              : (((s.x - starPhase.current * (0.4 + s.r * 0.3)) % (VW + 4)) +
                  VW +
                  4) %
                (VW + 4);
            return (
              <circle
                key={i}
                cx={drift}
                cy={s.y}
                r={s.r}
                fill="#ffffff"
                opacity={s.o}
              />
            );
          })}

          {/* circular-orbit guide at the launch altitude */}
          <circle
            cx={CX}
            cy={CY}
            r={LAUNCH_R}
            fill="none"
            stroke={SKY_DIM}
            strokeWidth={1}
            strokeDasharray="3 9"
            opacity={0.5}
          />

          {/* previous attempt, dimmed */}
          {ghostPts && !flying && (
            <polyline
              points={ghostPts}
              fill="none"
              stroke={TEXT300}
              strokeWidth={1.5}
              opacity={0.25}
            />
          )}

          {/* aiming hint before launch */}
          {!flying && (
            <polyline
              points={preview}
              fill="none"
              stroke={SKY}
              strokeWidth={1.5}
              strokeDasharray="2 6"
              opacity={0.5}
            />
          )}

          {/* current trajectory */}
          {trailPts && (
            <polyline
              points={trailPts}
              fill="none"
              stroke={
                phase === "orbit" ? SAGE : phase === "crashed" ? ROSE : SKY
              }
              strokeWidth={2}
              opacity={0.85}
            />
          )}

          {/* planet + mountain + cannon */}
          <circle cx={CX} cy={CY} r={PLANET_R} fill="#1b2434" />
          <circle
            cx={CX}
            cy={CY}
            r={PLANET_R}
            fill="none"
            stroke={SKY_DIM}
            strokeWidth={2}
          />
          <circle
            cx={CX - 18}
            cy={CY - 12}
            r={14}
            fill={SKY_DIM}
            opacity={0.18}
          />
          <circle
            cx={CX + 22}
            cy={CY + 18}
            r={10}
            fill={SKY_DIM}
            opacity={0.14}
          />
          <polygon
            points={`${CX - 11},${CY - PLANET_R + 3} ${CX + 11},${CY - PLANET_R + 3} ${CX},${CY - LAUNCH_R + 2}`}
            fill="#2a3346"
            stroke={SKY_DIM}
            strokeWidth={1}
          />
          <text
            x={CX}
            y={CY + 5}
            textAnchor="middle"
            fontSize={13}
            fill={TEXT300}
            fontFamily="ui-monospace, monospace"
          >
            M
          </text>

          {/* projectile + gravity vector */}
          {(flying || done) && (
            <>
              {phase !== "escaped" && (
                <line
                  x1={p.x}
                  y1={p.y}
                  x2={p.x + gx * gravLen}
                  y2={p.y + gy * gravLen}
                  stroke={SAND}
                  strokeWidth={2}
                  strokeLinecap="round"
                  opacity={0.75}
                />
              )}
              <circle
                cx={p.x}
                cy={p.y}
                r={5}
                fill={
                  phase === "orbit" ? SAGE : phase === "crashed" ? ROSE : SKY
                }
                stroke="#0f1218"
                strokeWidth={1.5}
              />
            </>
          )}
          {!flying && !done && (
            <circle
              cx={CX}
              cy={CY - LAUNCH_R}
              r={5}
              fill={SKY}
              stroke="#0f1218"
              strokeWidth={1.5}
            />
          )}

          {/* outcome banner */}
          {done && (
            <text
              x={CX}
              y={64}
              textAnchor="middle"
              fontSize={17}
              fill={statusColor}
              fontFamily="ui-monospace, monospace"
            >
              {phase === "orbit"
                ? "ORBIT ACHIEVED"
                : phase === "crashed"
                  ? "CRASHED"
                  : "ESCAPED"}
            </text>
          )}
        </svg>

        {/* readout overlay */}
        <div className="pointer-events-none absolute left-3 top-3 flex gap-4 font-mono text-[0.65rem] sm:text-xs">
          <span style={{ color: SKY }}>
            r {(Math.max(rNow, PLANET_R) / LAUNCH_R).toFixed(2)} r₀
          </span>
          <span style={{ color: SAND }}>F {fRatio.toFixed(2)} F₀</span>
          <span style={{ color: TEXT300 }}>
            v {Math.round(flying || done ? vNow : speed)}
          </span>
          <span style={{ color: SAGE }}>orbits {orbits}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end">
        <div className="flex-1">
          <div className="flex items-center justify-between text-[0.7rem] text-text-300 sm:text-xs">
            <span>Launch speed</span>
            <span className="font-mono" style={{ color: SKY }}>
              {speed} · circular ≈ {Math.round(vCirc)} · escape ≈{" "}
              {Math.round(vEsc)}
            </span>
          </div>
          <input
            type="range"
            min={40}
            max={210}
            step={1}
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="mt-1 w-full accent-[#a7c5e8]"
            aria-label="Launch speed"
          />
          <p className="mt-1 text-[0.65rem] text-text-500 sm:text-[0.7rem]">
            Sideways speed is the only control — gravity supplies all the
            curving.
          </p>
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between text-[0.7rem] text-text-300 sm:text-xs">
            <span>Planet mass (M in F = GMm/r²)</span>
            <span className="font-mono" style={{ color: SAND }}>
              {mass.toFixed(1)}×
            </span>
          </div>
          <input
            type="range"
            min={0.5}
            max={2}
            step={0.1}
            value={mass}
            onChange={(e) => setMass(Number(e.target.value))}
            className="mt-1 w-full accent-[#e3cf9b]"
            aria-label="Planet mass"
          />
          <p className="mt-1 text-[0.65rem] text-text-500 sm:text-[0.7rem]">
            Double the mass → double the force at the same distance. The speed
            an orbit needs grows as √M.
          </p>
        </div>

        <button
          type="button"
          onClick={launch}
          className="shrink-0 rounded-md border border-line-700 bg-ink-800 px-5 py-2 text-sm font-medium text-text-100 transition-colors hover:border-brand-pink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue"
        >
          {flying ? "Relaunch ↻" : done ? "Launch again ↻" : "Launch"}
        </button>
      </div>

      <p
        className="mt-3 text-[0.7rem] sm:text-xs"
        style={{ color: statusColor }}
        aria-live="polite"
      >
        {statusText}
      </p>
      <p className="mt-1 text-[0.65rem] text-text-500 sm:text-[0.7rem]">
        Newton&apos;s cannonball: the apple and the Moon obey the same law. Find
        the speeds where falling becomes orbiting — and where orbiting becomes
        leaving.
      </p>
    </div>
  );
}
