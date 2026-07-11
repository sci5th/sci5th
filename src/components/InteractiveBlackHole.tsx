"use client";

import { useEffect, useMemo, useRef, useState } from "react";

// Interactive hero + mini-game for the "Black Hole" entry.
//
// Horizon Slingshot: deliver a probe to a station on the far side of a black
// hole. The hole sits between launch pad and station, so there is no
// straight-line route — the player must let its gravity bend the trajectory
// around the shadow. The three possible outcomes are the whole lesson:
//
//  • delivered → a gravity assist: pass close enough and the hole steers the
//    probe for free, the same trick spacecraft play on planets — just far
//    stronger.
//  • captured  → cross the dashed ring (the event horizon) and there is no
//    way back: inside r_s, escape would take more than the speed of light.
//  • lost      → too fast or aimed wide, the bend isn't enough and the probe
//    sails off into deep space.
//
// Gravity uses the Paczyński–Wiita pseudo-Newtonian potential, a = GM/(r−r_s)²,
// which diverges at the horizon instead of at the centre — so unlike Newtonian
// gravity, orbits that stray too close plunge in, and the capture zone is
// bigger than the horizon itself. A live readout shows gravitational time
// dilation, √(1 − r_s/r): the probe's clock visibly slows on close skims.
//
// Pure React + SVG, no external libs, no storage. Respects
// prefers-reduced-motion: Launch computes the entire trajectory instantly and
// renders the final path + outcome with no travelling animation.

const VW = 960;
const VH = 540;

const CX = VW / 2;
const CY = VH / 2;
const RS = 36; // event-horizon radius (px)
const R_PHOTON = RS * 1.5; // photon-sphere hint ring
const GM = 2_200_000; // strength of the pseudo-Newtonian pull
const PAD = { x: 70, y: 460 }; // launch pad
const DOCK_R = 24; // deliver within this distance of the station

const MAX_SIM_TIME = 30; // seconds of simulated time before we call it lost
const H = 0.003; // physics substep (simulated seconds)

// First three stations are a difficulty ramp (checked numerically: every one
// is reachable from the slider ranges); afterwards they come from a vetted
// random pool so the game keeps going.
const STATIONS: [number, number][] = [
  [700, 90],
  [850, 110],
  [870, 300],
];
const STATION_POOL: [number, number][] = [
  [880, 180],
  [820, 60],
  [900, 380],
  [760, 50],
  [890, 240],
];

// Palette (mirrors the dark ink tokens; SVG needs literal colors).
const SKY = "#a7c5e8";
const SKY_DIM = "#6298d6";
const SAND = "#e3cf9b";
const SAND_DIM = "#d0ae57";
const SAGE = "#a3d4bd";
const ROSE = "#e7b9c7";
const ROSE_DIM = "#d17893";
const TEXT300 = "#a5a79f";

type Phase = "ready" | "flying" | "delivered" | "captured" | "lost";

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

// Semi-implicit Euler step under the Paczyński–Wiita pull a = GM/(r−r_s)².
// The denominator is floored a hair above zero for numerical stability —
// anything that close is inside the capture zone and doomed regardless.
function stepBody(b: Body, h: number) {
  const dx = b.x - CX;
  const dy = b.y - CY;
  const r = Math.hypot(dx, dy);
  const d = Math.max(r - RS, 4);
  const a = -GM / (d * d) / Math.max(r, 1);
  b.vx += dx * a * h;
  b.vy += dy * a * h;
  b.x += b.vx * h;
  b.y += b.vy * h;
  return r;
}

// Gravitational time dilation factor for a static clock at radius r.
function clockRate(r: number) {
  return Math.sqrt(Math.max(1 - RS / Math.max(r, RS), 0));
}

export default function InteractiveBlackHole() {
  const [aim, setAim] = useState(-45); // degrees; negative aims upward
  const [speed, setSpeed] = useState(200);
  const [phase, setPhase] = useState<Phase>("ready");
  const [docked, setDocked] = useState(0);
  const [station, setStation] = useState<[number, number]>(STATIONS[0]);
  const [, setTick] = useState(0); // forces a re-render each animation frame

  // Physics state lives in refs so the rAF loop mutates without re-subscribing.
  const body = useRef<Body>({ x: PAD.x, y: PAD.y, vx: 0, vy: 0 });
  const trail = useRef<{ x: number; y: number }[]>([]);
  const ghost = useRef<{ x: number; y: number }[]>([]);
  const simTime = useRef(0);
  const properTime = useRef(0); // probe clock (dilated)
  const closest = useRef(Infinity);
  const stationRef = useRef<[number, number]>(STATIONS[0]);
  const deliveredCount = useRef(0);
  const phaseRef = useRef<Phase>("ready");
  const advanceStationOnLaunch = useRef(false);
  const reduced = useRef(false);
  const raf = useRef<number | null>(null);
  const last = useRef(0);
  const starPhase = useRef(0);

  // Advance the simulation by dtSim seconds in fixed substeps. Returns the
  // terminal phase if one was reached, else null.
  const advance = (dtSim: number): Phase | null => {
    const n = Math.min(Math.ceil(dtSim / H), 4000);
    for (let i = 0; i < n; i++) {
      const r = stepBody(body.current, H);
      simTime.current += H;
      properTime.current += H * clockRate(r);
      if (r < closest.current) closest.current = r;

      const t = trail.current;
      const lastP = t[t.length - 1];
      if (
        !lastP ||
        Math.hypot(body.current.x - lastP.x, body.current.y - lastP.y) > 4
      ) {
        t.push({ x: body.current.x, y: body.current.y });
        if (t.length > 1400) t.shift();
      }

      if (r <= RS + 1) return "captured";
      const [sx, sy] = stationRef.current;
      if (Math.hypot(body.current.x - sx, body.current.y - sy) < DOCK_R)
        return "delivered";
      if (
        body.current.x < -50 ||
        body.current.x > VW + 50 ||
        body.current.y < -50 ||
        body.current.y > VH + 50
      )
        return "lost";
      if (simTime.current > MAX_SIM_TIME) return "lost";
    }
    return null;
  };

  const finish = (out: Phase) => {
    phaseRef.current = out;
    setPhase(out);
    if (out === "delivered") {
      deliveredCount.current += 1;
      setDocked(deliveredCount.current);
      advanceStationOnLaunch.current = true;
    }
  };

  const launch = () => {
    if (advanceStationOnLaunch.current) {
      advanceStationOnLaunch.current = false;
      const n = deliveredCount.current;
      const next =
        n < STATIONS.length
          ? STATIONS[n]
          : STATION_POOL[Math.floor(Math.random() * STATION_POOL.length)];
      stationRef.current = next;
      setStation(next);
    }
    if (trail.current.length > 1) ghost.current = trail.current;
    trail.current = [];
    const a = (aim * Math.PI) / 180;
    body.current = {
      x: PAD.x,
      y: PAD.y,
      vx: speed * Math.cos(a),
      vy: speed * Math.sin(a),
    };
    simTime.current = 0;
    properTime.current = 0;
    closest.current = Infinity;

    if (reduced.current) {
      // No travelling animation: integrate to the outcome in one go and show
      // the completed path.
      let out: Phase | null = null;
      for (let g = 0; g < 3000 && !out; g++) out = advance(0.25);
      finish(out ?? "lost");
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
        // Gentle time-warp far from the hole, where the pull is weak and the
        // arc is lazy, so lofted trajectories don't dawdle.
        const r = Math.hypot(body.current.x - CX, body.current.y - CY);
        const warp = Math.min(Math.max(Math.pow(r / 140, 1.2), 1), 6);
        const out = advance(dt * 1.15 * warp);
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
    const a = (aim * Math.PI) / 180;
    const b: Body = {
      x: PAD.x,
      y: PAD.y,
      vx: speed * Math.cos(a),
      vy: speed * Math.sin(a),
    };
    const pts: string[] = [`${b.x},${b.y}`];
    for (let i = 0; i < 140; i++) {
      let r = Infinity;
      for (let k = 0; k < 3; k++) r = stepBody(b, 0.004);
      pts.push(`${b.x.toFixed(1)},${b.y.toFixed(1)}`);
      if (r <= RS) break;
    }
    return pts.join(" ");
  }, [aim, speed]);

  const p = body.current;
  const rNow = Math.hypot(p.x - CX, p.y - CY);
  const vNow = Math.hypot(p.vx, p.vy);
  const flying = phase === "flying";
  const done =
    phase === "delivered" || phase === "captured" || phase === "lost";
  const rate = clockRate(flying || done ? rNow : Infinity);
  const skimmed = closest.current < RS * 2;
  const avgRate =
    simTime.current > 0 ? properTime.current / simTime.current : 1;

  const trailPts = trail.current
    .map((q) => `${q.x.toFixed(1)},${q.y.toFixed(1)}`)
    .join(" ");
  const ghostPts = ghost.current
    .map((q) => `${q.x.toFixed(1)},${q.y.toFixed(1)}`)
    .join(" ");

  // Pull arrow on the probe, scaled to the (clamped) 1/(r−r_s)² strength.
  const pull = GM / Math.max(rNow - RS, 4) ** 2;
  const gravLen = Math.min(10 + pull * 0.55, 70);
  const gx = (CX - p.x) / Math.max(rNow, 1);
  const gy = (CY - p.y) / Math.max(rNow, 1);

  const [sx, sy] = station;
  const aimRad = (aim * Math.PI) / 180;

  const statusColor =
    phase === "delivered"
      ? SAGE
      : phase === "captured"
        ? ROSE
        : phase === "lost"
          ? SAND
          : TEXT300;
  const statusText =
    phase === "delivered"
      ? `Docked! The hole bent your path for free — a gravity assist. En route the probe's clock ran at ${avgRate.toFixed(2)}× the station's rate${
          skimmed
            ? ` — a daring skim inside 2 r_s, where dilation really bites`
            : ``
        }.`
      : phase === "captured"
        ? "Captured — the probe crossed the event horizon. Inside r_s escape would take more than the speed of light; no signal, no probe, nothing comes back."
        : phase === "lost"
          ? "Lost to deep space — aimed too wide or moving too fast for the bend to close. Slower probes give gravity longer to work."
          : phase === "flying"
            ? "The pull grows as 1/(r − r_s)² — near the horizon it beats anything Newton predicted. Watch the probe's clock slow."
            : "No straight-line route: the hole sits in the way. Aim past it and let gravity steer — but the dashed ring is a one-way door.";

  return (
    <div className="mb-8">
      <div
        className="relative w-full overflow-hidden rounded-lg border border-line-700 bg-ink-950"
        role="group"
        aria-label="Horizon slingshot: curve a probe around a black hole to reach the station without crossing the event horizon"
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

          {/* accretion disk (decorative) */}
          <ellipse
            cx={CX}
            cy={CY}
            rx={130}
            ry={26}
            fill={SAND_DIM}
            opacity={0.1}
          />
          <ellipse cx={CX} cy={CY} rx={88} ry={17} fill={SAND} opacity={0.12} />

          {/* photon-sphere hint ring */}
          <circle
            cx={CX}
            cy={CY}
            r={R_PHOTON}
            fill="none"
            stroke={SAND}
            strokeWidth={1}
            opacity={0.4}
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
                phase === "delivered" ? SAGE : phase === "captured" ? ROSE : SKY
              }
              strokeWidth={2}
              opacity={0.85}
            />
          )}

          {/* the hole: shadow + event horizon (the point of no return) */}
          <circle cx={CX} cy={CY} r={RS} fill="#000000" />
          <circle
            cx={CX}
            cy={CY}
            r={RS}
            fill="none"
            stroke={ROSE_DIM}
            strokeWidth={1.5}
            strokeDasharray="4 6"
            opacity={0.9}
          />
          <text
            x={CX}
            y={CY + RS + 20}
            textAnchor="middle"
            fontSize={11}
            fill={ROSE_DIM}
            fontFamily="ui-monospace, monospace"
          >
            event horizon r_s
          </text>

          {/* station */}
          <circle
            cx={sx}
            cy={sy}
            r={DOCK_R}
            fill="none"
            stroke={SAGE}
            strokeWidth={1}
            strokeDasharray="3 5"
            opacity={0.7}
          />
          <circle cx={sx} cy={sy} r={6} fill={SAGE} />
          <text
            x={sx}
            y={sy + DOCK_R + 16}
            textAnchor="middle"
            fontSize={11}
            fill={SAGE}
            fontFamily="ui-monospace, monospace"
          >
            station
          </text>

          {/* launch pad + aim direction */}
          <polygon
            points={`${PAD.x - 10},${PAD.y + 10} ${PAD.x + 10},${PAD.y + 10} ${PAD.x},${PAD.y - 6}`}
            fill="#2a3346"
            stroke={SKY_DIM}
            strokeWidth={1}
          />
          {!flying && !done && (
            <line
              x1={PAD.x}
              y1={PAD.y}
              x2={PAD.x + Math.cos(aimRad) * 34}
              y2={PAD.y + Math.sin(aimRad) * 34}
              stroke={SKY}
              strokeWidth={2}
              strokeLinecap="round"
              opacity={0.8}
            />
          )}

          {/* probe + gravity vector */}
          {(flying || done) && (
            <>
              {phase !== "lost" && (
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
                  phase === "delivered"
                    ? SAGE
                    : phase === "captured"
                      ? ROSE
                      : SKY
                }
                stroke="#0f1218"
                strokeWidth={1.5}
              />
            </>
          )}
          {!flying && !done && (
            <circle
              cx={PAD.x}
              cy={PAD.y}
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
              y={44}
              textAnchor="middle"
              fontSize={17}
              fill={statusColor}
              fontFamily="ui-monospace, monospace"
            >
              {phase === "delivered"
                ? "DOCKED"
                : phase === "captured"
                  ? "CROSSED THE HORIZON"
                  : "LOST TO DEEP SPACE"}
            </text>
          )}
        </svg>

        {/* readout overlay */}
        <div className="pointer-events-none absolute left-3 top-3 flex gap-4 font-mono text-[0.65rem] sm:text-xs">
          <span style={{ color: SKY }}>
            r{" "}
            {flying || done
              ? (Math.max(rNow, RS) / RS).toFixed(1)
              : (Math.hypot(PAD.x - CX, PAD.y - CY) / RS).toFixed(1)}{" "}
            r_s
          </span>
          <span style={{ color: ROSE }}>clock {rate.toFixed(2)}×</span>
          <span style={{ color: TEXT300 }}>
            v {Math.round(flying || done ? vNow : speed)}
          </span>
          <span style={{ color: SAGE }}>docked {docked}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end">
        <div className="flex-1">
          <div className="flex items-center justify-between text-[0.7rem] text-text-300 sm:text-xs">
            <span>Aim</span>
            <span className="font-mono" style={{ color: SKY }}>
              {aim}°
            </span>
          </div>
          <input
            type="range"
            min={-85}
            max={5}
            step={1}
            value={aim}
            onChange={(e) => setAim(Number(e.target.value))}
            className="mt-1 w-full accent-[#a7c5e8]"
            aria-label="Aim angle"
          />
          <p className="mt-1 text-[0.65rem] text-text-500 sm:text-[0.7rem]">
            Aim to one side of the hole — its gravity supplies the turn.
          </p>
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between text-[0.7rem] text-text-300 sm:text-xs">
            <span>Launch speed</span>
            <span className="font-mono" style={{ color: SAND }}>
              {speed}
            </span>
          </div>
          <input
            type="range"
            min={120}
            max={320}
            step={5}
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="mt-1 w-full accent-[#e3cf9b]"
            aria-label="Launch speed"
          />
          <p className="mt-1 text-[0.65rem] text-text-500 sm:text-[0.7rem]">
            Slow probes bend more — gravity has longer to act. Fast ones barely
            notice.
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
        Horizon Slingshot: a black hole bends trajectories like nothing else in
        nature. Steer close enough to turn — never past the point of no return.
        Each delivery moves the station somewhere harder.
      </p>
    </div>
  );
}
