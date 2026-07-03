"use client";

import { useEffect, useRef, useState } from "react";

// Interactive hero + mini-game for the "Newton's Laws of Motion" entry.
//
// A frictionless spacecraft you steer to a docking ring using directional
// thrust. All three laws are visible in play:
//
//  • 1st law (inertia): with no thrust the ship coasts forever at constant
//    velocity — it never slows on its own, so you must thrust *backwards* to
//    stop. This is the lesson most players feel first.
//  • 2nd law (F = ma): thrust is a fixed force; the Mass slider changes how
//    much that force accelerates the ship. Heavier ship → sluggish response.
//  • 3rd law (action–reaction): every thrust fires an exhaust plume in the
//    exact opposite direction to the push the ship receives.
//
// Pure React + SVG, no external libs, no storage. Respects
// prefers-reduced-motion by dropping the decorative star drift and exhaust
// flicker (the physics loop still runs — it is the point of the widget).

const VW = 960;
const VH = 540;

const SHIP_R = 16;
const RING_R = 46;
const DOCK_SPEED = 70; // must be slower than this, inside the ring, to dock
const THRUST = 640; // force magnitude (units / s^2 at mass = 1)
const RESTITUTION = 0.68; // wall bounce energy retained
const MARGIN = 70; // keep target away from the edges

// Palette (mirrors the dark ink tokens; SVG needs literal colors).
const SKY = "#a7c5e8";
const SKY_DIM = "#6298d6";
const SAND = "#e3cf9b";
const SAGE = "#a3d4bd";
const ROSE = "#e7b9c7";
const TEXT300 = "#a5a79f";

type Dir = "up" | "down" | "left" | "right";

const KEY_TO_DIR: Record<string, Dir | undefined> = {
  ArrowUp: "up",
  ArrowDown: "down",
  ArrowLeft: "left",
  ArrowRight: "right",
  w: "up",
  s: "down",
  a: "left",
  d: "right",
  W: "up",
  S: "down",
  A: "left",
  D: "right",
};
const DIR_VEC: Record<Dir, { x: number; y: number }> = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

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

export default function InteractiveThruster() {
  const [mass, setMass] = useState(1.4);
  const [docks, setDocks] = useState(0);
  const [docked, setDocked] = useState(false);
  const [thrusting, setThrusting] = useState(false);
  const [, setTick] = useState(0); // forces a re-render each animation frame

  // Physics state lives in refs so the rAF loop mutates without re-subscribing.
  const pos = useRef({ x: 190, y: VH / 2 });
  const vel = useRef({ x: 0, y: 0 });
  const heading = useRef(0); // radians, ship nose direction
  const target = useRef({ x: VW - 220, y: VH / 2 });
  const active = useRef<Set<Dir>>(new Set());
  const massRef = useRef(mass);
  const dockedRef = useRef(false);
  const reduced = useRef(false);
  const focused = useRef(false);
  const raf = useRef<number | null>(null);
  const last = useRef(0);
  const starPhase = useRef(0);

  useEffect(() => {
    massRef.current = mass;
  }, [mass]);

  const placeTarget = () => {
    // Drop the ring somewhere new, comfortably away from the ship + edges.
    for (let i = 0; i < 40; i++) {
      const x = rand(MARGIN, VW - MARGIN);
      const y = rand(MARGIN, VH - MARGIN);
      const dx = x - pos.current.x;
      const dy = y - pos.current.y;
      if (Math.hypot(dx, dy) > 260) {
        target.current = { x, y };
        return;
      }
    }
    target.current = {
      x: rand(MARGIN, VW - MARGIN),
      y: rand(MARGIN, VH - MARGIN),
    };
  };

  const setDir = (d: Dir, on: boolean) => {
    if (on) active.current.add(d);
    else active.current.delete(d);
    setThrusting(active.current.size > 0);
  };

  const reset = () => {
    pos.current = { x: 190, y: VH / 2 };
    vel.current = { x: 0, y: 0 };
    active.current.clear();
    dockedRef.current = false;
    setDocked(false);
    setThrusting(false);
    placeTarget();
  };

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    reduced.current = mq.matches;
    const onMq = () => (reduced.current = mq.matches);
    mq.addEventListener("change", onMq);

    placeTarget();

    const onKeyDown = (e: KeyboardEvent) => {
      const d = KEY_TO_DIR[e.key];
      if (!d || !focused.current) return;
      e.preventDefault();
      active.current.add(d);
      setThrusting(true);
    };
    const onKeyUp = (e: KeyboardEvent) => {
      const d = KEY_TO_DIR[e.key];
      if (!d) return;
      active.current.delete(d);
      setThrusting(active.current.size > 0);
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    const loop = (now: number) => {
      if (!last.current) last.current = now;
      const dt = Math.min((now - last.current) / 1000, 0.032);
      last.current = now;

      const a = THRUST / massRef.current;
      let ax = 0;
      let ay = 0;
      active.current.forEach((d) => {
        ax += DIR_VEC[d].x * a;
        ay += DIR_VEC[d].y * a;
      });

      if (!dockedRef.current) {
        vel.current.x += ax * dt;
        vel.current.y += ay * dt;
        pos.current.x += vel.current.x * dt;
        pos.current.y += vel.current.y * dt;

        // Elastic-ish walls (an external force — the only thing that isn't
        // pure coasting). Keeps the ship on screen without killing momentum.
        if (pos.current.x < SHIP_R) {
          pos.current.x = SHIP_R;
          vel.current.x = Math.abs(vel.current.x) * RESTITUTION;
        } else if (pos.current.x > VW - SHIP_R) {
          pos.current.x = VW - SHIP_R;
          vel.current.x = -Math.abs(vel.current.x) * RESTITUTION;
        }
        if (pos.current.y < SHIP_R) {
          pos.current.y = SHIP_R;
          vel.current.y = Math.abs(vel.current.y) * RESTITUTION;
        } else if (pos.current.y > VH - SHIP_R) {
          pos.current.y = VH - SHIP_R;
          vel.current.y = -Math.abs(vel.current.y) * RESTITUTION;
        }

        const sp = Math.hypot(vel.current.x, vel.current.y);
        if (sp > 4) heading.current = Math.atan2(vel.current.y, vel.current.x);

        const dx = target.current.x - pos.current.x;
        const dy = target.current.y - pos.current.y;
        if (Math.hypot(dx, dy) < RING_R - 6 && sp < DOCK_SPEED) {
          dockedRef.current = true;
          vel.current = { x: 0, y: 0 };
          active.current.clear();
          pos.current = { x: target.current.x, y: target.current.y };
          setDocked(true);
          setThrusting(false);
          setDocks((n) => n + 1);
        }
      }

      if (!reduced.current) starPhase.current += dt * 10;
      setTick((t) => (t + 1) % 1000000);
      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);

    return () => {
      mq.removeEventListener("change", onMq);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, []);

  const p = pos.current;
  const v = vel.current;
  const tg = target.current;
  const sp = Math.hypot(v.x, v.y);
  const slowEnough = sp < DOCK_SPEED;
  const distToRing = Math.hypot(tg.x - p.x, tg.y - p.y);
  const near = distToRing < RING_R + 40;

  // Ship triangle, oriented to heading.
  const hx = Math.cos(heading.current);
  const hy = Math.sin(heading.current);
  const nose = { x: p.x + hx * SHIP_R * 1.5, y: p.y + hy * SHIP_R * 1.5 };
  const tailL = {
    x: p.x - hx * SHIP_R + -hy * SHIP_R * 0.9,
    y: p.y - hy * SHIP_R + hx * SHIP_R * 0.9,
  };
  const tailR = {
    x: p.x - hx * SHIP_R - -hy * SHIP_R * 0.9,
    y: p.y - hy * SHIP_R - hx * SHIP_R * 0.9,
  };

  // Net thrust direction, for the exhaust plume (fires opposite the push).
  let tx = 0;
  let ty = 0;
  active.current.forEach((d) => {
    tx += DIR_VEC[d].x;
    ty += DIR_VEC[d].y;
  });
  const tmag = Math.hypot(tx, ty);
  const flicker = reduced.current
    ? 1
    : 0.75 + Math.sin(starPhase.current * 3) * 0.25;

  const statusText = docked
    ? "Docked — the ship stopped only because you cancelled its momentum."
    : thrusting
      ? "Thrusting — force adds velocity (F = ma). Exhaust fires the other way."
      : sp > 6
        ? "Coasting — no force, yet it keeps moving. That's inertia (1st law)."
        : "At rest. Thrust to move — and remember you'll have to thrust back to stop.";

  return (
    <div className="mb-8">
      <div
        className="relative w-full overflow-hidden rounded-lg border border-line-700 bg-ink-950 outline-none focus-visible:border-brand-blue"
        tabIndex={0}
        role="application"
        aria-label="Thruster pilot: steer a frictionless spacecraft into the docking ring"
        onFocus={() => (focused.current = true)}
        onBlur={() => {
          focused.current = false;
          active.current.clear();
          setThrusting(false);
        }}
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

          {/* docking ring */}
          <circle
            cx={tg.x}
            cy={tg.y}
            r={RING_R}
            fill={
              docked
                ? `${SAGE}22`
                : near && slowEnough
                  ? `${SAGE}18`
                  : `${SKY}10`
            }
            stroke={docked ? SAGE : near && slowEnough ? SAGE : SKY_DIM}
            strokeWidth={2.5}
            strokeDasharray="6 7"
          />
          <circle cx={tg.x} cy={tg.y} r={5} fill={docked ? SAGE : SKY_DIM} />
          <text
            x={tg.x}
            y={tg.y - RING_R - 10}
            textAnchor="middle"
            fontSize={13}
            fill={docked ? SAGE : TEXT300}
            fontFamily="ui-monospace, monospace"
          >
            {docked ? "DOCKED" : "DOCK"}
          </text>

          {/* velocity vector from the ship */}
          {sp > 10 && !docked && (
            <line
              x1={p.x}
              y1={p.y}
              x2={p.x + v.x * 0.32}
              y2={p.y + v.y * 0.32}
              stroke={slowEnough ? SAGE : SAND}
              strokeWidth={2}
              strokeLinecap="round"
              opacity={0.65}
            />
          )}

          {/* exhaust plume — opposite the applied push (3rd law) */}
          {tmag > 0 && !docked && (
            <g opacity={flicker}>
              {[0, 1, 2].map((k) => {
                const len = (18 + k * 12) * (1 / massRef.current) * 1.1;
                const ex = p.x + (tx / tmag) * (SHIP_R + len);
                const ey = p.y + (ty / tmag) * (SHIP_R + len);
                return (
                  <circle
                    key={k}
                    cx={ex}
                    cy={ey}
                    r={7 - k * 1.6}
                    fill={k === 0 ? SAND : ROSE}
                    opacity={0.8 - k * 0.22}
                  />
                );
              })}
            </g>
          )}

          {/* ship */}
          <polygon
            points={`${nose.x},${nose.y} ${tailL.x},${tailL.y} ${tailR.x},${tailR.y}`}
            fill={docked ? SAGE : SKY}
            stroke="#0f1218"
            strokeWidth={1.5}
          />
          <circle cx={p.x} cy={p.y} r={4} fill="#0f1218" opacity={0.5} />
        </svg>

        {/* readout overlay */}
        <div className="pointer-events-none absolute left-3 top-3 flex gap-4 font-mono text-[0.65rem] sm:text-xs">
          <span style={{ color: slowEnough ? SAGE : SAND }}>
            speed {Math.round(sp)}
          </span>
          <span style={{ color: TEXT300 }}>docked {docks}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* D-pad */}
        <div
          className="grid shrink-0 grid-cols-3 grid-rows-2 gap-1.5"
          style={{ width: 168 }}
          aria-hidden="false"
        >
          <ThrustButton
            dir="up"
            label="▲"
            className="col-start-2 row-start-1"
            onSet={setDir}
          />
          <ThrustButton
            dir="left"
            label="◀"
            className="col-start-1 row-start-2"
            onSet={setDir}
          />
          <ThrustButton
            dir="down"
            label="▼"
            className="col-start-2 row-start-2"
            onSet={setDir}
          />
          <ThrustButton
            dir="right"
            label="▶"
            className="col-start-3 row-start-2"
            onSet={setDir}
          />
        </div>

        {/* Mass slider (F = ma) */}
        <div className="flex-1">
          <div className="flex items-center justify-between text-[0.7rem] text-text-300 sm:text-xs">
            <span>Ship mass (F = ma)</span>
            <span className="font-mono" style={{ color: SKY }}>
              {mass.toFixed(1)}× · accel {Math.round(THRUST / mass)}
            </span>
          </div>
          <input
            type="range"
            min={0.6}
            max={3}
            step={0.1}
            value={mass}
            onChange={(e) => setMass(Number(e.target.value))}
            className="mt-1 w-full accent-[#a7c5e8]"
            aria-label="Ship mass"
          />
          <p className="mt-1 text-[0.65rem] text-text-500 sm:text-[0.7rem]">
            Same thrust, more mass → less acceleration. Heavier ships turn and
            stop slower.
          </p>
        </div>

        {/* Reset / new target */}
        <button
          type="button"
          onClick={reset}
          className="shrink-0 rounded-md border border-line-700 bg-ink-800 px-4 py-2 text-sm font-medium text-text-100 transition-colors hover:border-brand-pink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue"
        >
          {docked ? "New target ↻" : "Reset"}
        </button>
      </div>

      <p
        className="mt-3 text-[0.7rem] sm:text-xs"
        style={{ color: docked ? SAGE : thrusting ? SAND : TEXT300 }}
        aria-live="polite"
      >
        {statusText}
      </p>
      <p className="mt-1 text-[0.65rem] text-text-500 sm:text-[0.7rem]">
        Click the pad or focus the game and use arrow keys / WASD. There is no
        friction: the ship only changes motion when you push it.
      </p>
    </div>
  );
}

function ThrustButton({
  dir,
  label,
  className,
  onSet,
}: {
  dir: Dir;
  label: string;
  className: string;
  onSet: (d: Dir, on: boolean) => void;
}) {
  return (
    <button
      type="button"
      className={`${className} flex h-12 select-none items-center justify-center rounded-md border border-line-700 bg-ink-800 text-text-100 transition-colors hover:border-brand-blue focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue active:border-brand-pink active:bg-ink-700`}
      aria-label={`Thrust ${dir}`}
      onPointerDown={(e) => {
        e.preventDefault();
        (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
        onSet(dir, true);
      }}
      onPointerUp={() => onSet(dir, false)}
      onPointerLeave={() => onSet(dir, false)}
      onPointerCancel={() => onSet(dir, false)}
    >
      <span aria-hidden="true">{label}</span>
    </button>
  );
}
