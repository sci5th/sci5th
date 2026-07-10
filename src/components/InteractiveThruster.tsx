"use client";

import { useEffect, useRef, useState } from "react";

// Interactive hero + mini-game for the "Newton's Laws of Motion" entry.
//
// Asteroid Tug: nudge drifting asteroids into a capture ring by bumping them
// with your ship. All three laws ARE the gameplay:
//
//  • 1st law (inertia): nothing slows down on its own — your ship and every
//    rock coast at constant velocity until something pushes them.
//  • 2nd law (F = ma): the same bump barely budges a heavy asteroid and sends
//    a light one flying. Every rock wears its mass on its face.
//  • 3rd law (action–reaction): every push is mutual — the collision impulse
//    on the rock is paired with an equal, opposite impulse on your ship
//    (watch the paired arrows at the contact point, and feel the recoil).
//
// Collisions conserve momentum exactly (impulse-based, equal and opposite by
// construction). Pure React + SVG, no external libs, no storage. Respects
// prefers-reduced-motion by dropping the decorative star drift, exhaust
// flicker, and impulse-arrow fade (the physics loop still runs — it is the
// point of the widget).

const VW = 960;
const VH = 540;

const SHIP_R = 14;
const SHIP_M = 1;
const THRUST = 620; // force magnitude (ship mass is 1)
const WALL_E = 0.6; // wall bounce energy retained
const HIT_E = 0.35; // body–body restitution: soft, push-friendly bumps
const ZONE_R = 78;
const CAPTURE_SPEED = 55; // slower than this, inside the ring → captured
const MARGIN = 60;

// Scripted opening rounds, then random heavier ones.
const ROUND_MASSES: number[][] = [[2], [2, 5], [3, 6, 10]];

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

type Body = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  m: number;
  r: number;
};
type Asteroid = Body & {
  captured: boolean;
  craters: { dx: number; dy: number; cr: number }[];
};
type Flash = {
  x: number;
  y: number;
  nx: number;
  ny: number;
  mag: number;
  t: number;
};

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function asteroidRadius(m: number) {
  return 14 + m * 2.6;
}

// A fixed starfield, generated once (module scope) so it never re-seeds.
const STARS = Array.from({ length: 46 }, () => ({
  x: rand(0, VW),
  y: rand(0, VH),
  r: rand(0.4, 1.5),
  o: rand(0.2, 0.7),
}));

export default function InteractiveThruster() {
  const [round, setRound] = useState(0);
  const [captured, setCaptured] = useState(0);
  const [total, setTotal] = useState(1);
  const [cleared, setCleared] = useState(false);
  const [thrusting, setThrusting] = useState(false);
  const [, setTick] = useState(0); // forces a re-render each animation frame

  // Physics state lives in refs so the rAF loop mutates without re-subscribing.
  const ship = useRef<Body>({
    x: 150,
    y: VH / 2,
    vx: 0,
    vy: 0,
    m: SHIP_M,
    r: SHIP_R,
  });
  const rocks = useRef<Asteroid[]>([]);
  const zone = useRef({ x: VW - 200, y: VH / 2 });
  const heading = useRef(0);
  const active = useRef<Set<Dir>>(new Set());
  const flashes = useRef<Flash[]>([]);
  const lastBumpAt = useRef(-1e9);
  const roundRef = useRef(0);
  const clearedRef = useRef(false);
  const reduced = useRef(false);
  const focused = useRef(false);
  const raf = useRef<number | null>(null);
  const last = useRef(0);
  const starPhase = useRef(0);

  const setupRound = (idx: number) => {
    const masses =
      idx < ROUND_MASSES.length
        ? ROUND_MASSES[idx]
        : Array.from({ length: 3 }, () => Math.round(rand(3, 12)));

    ship.current = { x: 150, y: VH / 2, vx: 0, vy: 0, m: SHIP_M, r: SHIP_R };
    heading.current = 0;
    active.current.clear();
    flashes.current = [];
    lastBumpAt.current = -1e9;

    for (let i = 0; i < 60; i++) {
      const x = rand(MARGIN + ZONE_R, VW - MARGIN - ZONE_R);
      const y = rand(MARGIN + ZONE_R, VH - MARGIN - ZONE_R);
      if (Math.hypot(x - ship.current.x, y - ship.current.y) > 300) {
        zone.current = { x, y };
        break;
      }
    }

    const placed: Asteroid[] = [];
    masses.forEach((m) => {
      const r = asteroidRadius(m);
      for (let i = 0; i < 80; i++) {
        const x = rand(MARGIN + r, VW - MARGIN - r);
        const y = rand(MARGIN + r, VH - MARGIN - r);
        const clearOfZone =
          Math.hypot(x - zone.current.x, y - zone.current.y) > ZONE_R + r + 60;
        const clearOfShip =
          Math.hypot(x - ship.current.x, y - ship.current.y) > 140;
        const clearOfRocks = placed.every(
          (a) => Math.hypot(x - a.x, y - a.y) > a.r + r + 14
        );
        if (clearOfZone && clearOfShip && clearOfRocks) {
          placed.push({
            x,
            y,
            vx: 0,
            vy: 0,
            m,
            r,
            captured: false,
            craters: [
              {
                dx: rand(-0.4, 0.1) * r,
                dy: rand(-0.4, 0.2) * r,
                cr: r * 0.22,
              },
              { dx: rand(0.1, 0.45) * r, dy: rand(0, 0.45) * r, cr: r * 0.15 },
            ],
          });
          break;
        }
      }
    });
    rocks.current = placed;
    roundRef.current = idx;
    clearedRef.current = false;
    setRound(idx);
    setTotal(placed.length);
    setCaptured(0);
    setCleared(false);
    setThrusting(false);
  };

  const setDir = (d: Dir, on: boolean) => {
    if (on) active.current.add(d);
    else active.current.delete(d);
    setThrusting(active.current.size > 0);
  };

  // Momentum-conserving impulse between two bodies, with positional
  // de-penetration. The ±j pair is the third law, literally.
  const collide = (A: Body, B: Body) => {
    const dx = B.x - A.x;
    const dy = B.y - A.y;
    const dist = Math.hypot(dx, dy) || 0.001;
    const overlap = A.r + B.r - dist;
    if (overlap <= 0) return;
    const nx = dx / dist;
    const ny = dy / dist;
    const invA = 1 / A.m;
    const invB = 1 / B.m;
    const corr = overlap / (invA + invB);
    A.x -= nx * corr * invA;
    A.y -= ny * corr * invA;
    B.x += nx * corr * invB;
    B.y += ny * corr * invB;
    const rvn = (B.vx - A.vx) * nx + (B.vy - A.vy) * ny;
    if (rvn > 0) return;
    const j = (-(1 + HIT_E) * rvn) / (invA + invB);
    A.vx -= j * nx * invA;
    A.vy -= j * ny * invA;
    B.vx += j * nx * invB;
    B.vy += j * ny * invB;
    if (j > 14) {
      flashes.current.push({
        x: A.x + nx * A.r,
        y: A.y + ny * A.r,
        nx,
        ny,
        mag: j,
        t: 0.45,
      });
      if (flashes.current.length > 8) flashes.current.shift();
    }
    lastBumpAt.current = performance.now();
  };

  const bounceWalls = (b: Body) => {
    if (b.x < b.r) {
      b.x = b.r;
      b.vx = Math.abs(b.vx) * WALL_E;
    } else if (b.x > VW - b.r) {
      b.x = VW - b.r;
      b.vx = -Math.abs(b.vx) * WALL_E;
    }
    if (b.y < b.r) {
      b.y = b.r;
      b.vy = Math.abs(b.vy) * WALL_E;
    } else if (b.y > VH - b.r) {
      b.y = VH - b.r;
      b.vy = -Math.abs(b.vy) * WALL_E;
    }
  };

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    reduced.current = mq.matches;
    const onMq = () => (reduced.current = mq.matches);
    mq.addEventListener("change", onMq);

    setupRound(0);

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

      const s = ship.current;
      let ax = 0;
      let ay = 0;
      active.current.forEach((d) => {
        ax += (DIR_VEC[d].x * THRUST) / s.m;
        ay += (DIR_VEC[d].y * THRUST) / s.m;
      });
      s.vx += ax * dt;
      s.vy += ay * dt;
      s.x += s.vx * dt;
      s.y += s.vy * dt;
      bounceWalls(s);

      const live = rocks.current.filter((a) => !a.captured);
      live.forEach((a) => {
        a.x += a.vx * dt;
        a.y += a.vy * dt;
        bounceWalls(a);
      });

      live.forEach((a) => collide(s, a));
      for (let i = 0; i < live.length; i++)
        for (let k = i + 1; k < live.length; k++) collide(live[i], live[k]);

      let caught = 0;
      rocks.current.forEach((a) => {
        if (a.captured) {
          caught++;
          return;
        }
        const inZone =
          Math.hypot(a.x - zone.current.x, a.y - zone.current.y) <
          ZONE_R - a.r * 0.3;
        if (inZone && Math.hypot(a.vx, a.vy) < CAPTURE_SPEED) {
          a.captured = true;
          a.vx = 0;
          a.vy = 0;
          caught++;
        }
      });
      setCaptured(caught);
      if (caught === rocks.current.length && rocks.current.length > 0) {
        if (!clearedRef.current) {
          clearedRef.current = true;
          setCleared(true);
        }
      }

      const sp = Math.hypot(s.vx, s.vy);
      if (sp > 4) heading.current = Math.atan2(s.vy, s.vx);

      flashes.current.forEach((f) => (f.t -= dt));
      flashes.current = flashes.current.filter((f) => f.t > 0);

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

  const s = ship.current;
  const sp = Math.hypot(s.vx, s.vy);

  // Ship triangle, oriented to heading.
  const hx = Math.cos(heading.current);
  const hy = Math.sin(heading.current);
  const nose = { x: s.x + hx * SHIP_R * 1.5, y: s.y + hy * SHIP_R * 1.5 };
  const tailL = {
    x: s.x - hx * SHIP_R + -hy * SHIP_R * 0.9,
    y: s.y - hy * SHIP_R + hx * SHIP_R * 0.9,
  };
  const tailR = {
    x: s.x - hx * SHIP_R - -hy * SHIP_R * 0.9,
    y: s.y - hy * SHIP_R - hx * SHIP_R * 0.9,
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

  const recentBump = performance.now() - lastBumpAt.current < 1100;
  const anyDrifting = rocks.current.some(
    (a) => !a.captured && Math.hypot(a.vx, a.vy) > 8
  );
  const statusText = cleared
    ? `Round ${round + 1} clear — every rock parked. The next one brings more mass.`
    : recentBump
      ? "Equal and opposite (3rd law): the rock pushed your ship back exactly as hard. Heavier rock → smaller change in its motion (F = ma)."
      : thrusting
        ? "Thrusting — force changes your velocity (F = ma). Exhaust fires the other way."
        : anyDrifting
          ? "Coasting — nothing pushes the rock, yet it keeps moving. Inertia (1st law)."
          : "Bump the asteroids into the ring — gently. Nothing out here stops on its own.";

  return (
    <div className="mb-8">
      <div
        className="relative w-full overflow-hidden rounded-lg border border-line-700 bg-ink-950 outline-none focus-visible:border-brand-blue"
        tabIndex={0}
        role="application"
        aria-label="Asteroid tug: bump asteroids of different masses into the capture ring"
        onFocus={() => (focused.current = true)}
        onBlur={() => {
          focused.current = false;
          active.current.clear();
          setThrusting(false);
        }}
      >
        <svg viewBox={`0 0 ${VW} ${VH}`} className="block w-full">
          {/* starfield */}
          {STARS.map((st, i) => {
            const drift = reduced.current
              ? st.x
              : (((st.x - starPhase.current * (0.4 + st.r * 0.3)) % (VW + 4)) +
                  VW +
                  4) %
                (VW + 4);
            return (
              <circle
                key={i}
                cx={drift}
                cy={st.y}
                r={st.r}
                fill="#ffffff"
                opacity={st.o}
              />
            );
          })}

          {/* capture ring */}
          <circle
            cx={zone.current.x}
            cy={zone.current.y}
            r={ZONE_R}
            fill={cleared ? `${SAGE}22` : `${SKY}10`}
            stroke={cleared ? SAGE : SKY_DIM}
            strokeWidth={2.5}
            strokeDasharray="6 7"
          />
          <text
            x={zone.current.x}
            y={zone.current.y - ZONE_R - 10}
            textAnchor="middle"
            fontSize={13}
            fill={cleared ? SAGE : TEXT300}
            fontFamily="ui-monospace, monospace"
          >
            {cleared ? "SECURED" : "CAPTURE"}
          </text>

          {/* asteroids */}
          {rocks.current.map((a, i) => (
            <g key={i} opacity={a.captured ? 0.55 : 1}>
              <circle
                cx={a.x}
                cy={a.y}
                r={a.r}
                fill="#2a3346"
                stroke={a.captured ? SAGE : SKY_DIM}
                strokeWidth={2}
              />
              {a.craters.map((c, k) => (
                <circle
                  key={k}
                  cx={a.x + c.dx}
                  cy={a.y + c.dy}
                  r={c.cr}
                  fill="#1b2434"
                />
              ))}
              <text
                x={a.x}
                y={a.y + 4}
                textAnchor="middle"
                fontSize={12}
                fill={a.captured ? SAGE : TEXT300}
                fontFamily="ui-monospace, monospace"
              >
                {a.captured ? "✓" : `m ${a.m}`}
              </text>
            </g>
          ))}

          {/* paired collision impulses — the 3rd law made visible */}
          {flashes.current.map((f, i) => {
            const L = Math.min(12 + f.mag * 0.12, 46);
            const o = reduced.current ? 0.9 : Math.max(f.t / 0.45, 0) * 0.9;
            return (
              <g key={i} opacity={o}>
                <line
                  x1={f.x}
                  y1={f.y}
                  x2={f.x + f.nx * L}
                  y2={f.y + f.ny * L}
                  stroke={SAND}
                  strokeWidth={2.5}
                  strokeLinecap="round"
                />
                <line
                  x1={f.x}
                  y1={f.y}
                  x2={f.x - f.nx * L}
                  y2={f.y - f.ny * L}
                  stroke={ROSE}
                  strokeWidth={2.5}
                  strokeLinecap="round"
                />
              </g>
            );
          })}

          {/* velocity vector from the ship */}
          {sp > 10 && (
            <line
              x1={s.x}
              y1={s.y}
              x2={s.x + s.vx * 0.32}
              y2={s.y + s.vy * 0.32}
              stroke={SAND}
              strokeWidth={2}
              strokeLinecap="round"
              opacity={0.65}
            />
          )}

          {/* exhaust plume — opposite the applied push (3rd law) */}
          {tmag > 0 && (
            <g opacity={flicker}>
              {[0, 1, 2].map((k) => {
                const len = 18 + k * 12;
                const ex = s.x + (tx / tmag) * (SHIP_R + len);
                const ey = s.y + (ty / tmag) * (SHIP_R + len);
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
            fill={SKY}
            stroke="#0f1218"
            strokeWidth={1.5}
          />
          <circle cx={s.x} cy={s.y} r={4} fill="#0f1218" opacity={0.5} />
        </svg>

        {/* readout overlay */}
        <div className="pointer-events-none absolute left-3 top-3 flex gap-4 font-mono text-[0.65rem] sm:text-xs">
          <span style={{ color: SKY }}>round {round + 1}</span>
          <span style={{ color: cleared ? SAGE : TEXT300 }}>
            captured {captured}/{total}
          </span>
          <span style={{ color: SAND }}>speed {Math.round(sp)}</span>
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

        <p className="flex-1 text-[0.7rem] text-text-500 sm:text-xs">
          An asteroid is captured when it sits inside the ring and is moving
          slowly. Light rocks fly off a hard bump — heavy ones need a long,
          patient push. Your ship recoils either way.
        </p>

        <button
          type="button"
          onClick={() => setupRound(cleared ? round + 1 : round)}
          className="shrink-0 rounded-md border border-line-700 bg-ink-800 px-4 py-2 text-sm font-medium text-text-100 transition-colors hover:border-brand-pink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue"
        >
          {cleared ? "Next round ▶" : "Reset round"}
        </button>
      </div>

      <p
        className="mt-3 text-[0.7rem] sm:text-xs"
        style={{
          color: cleared ? SAGE : recentBump ? SAND : TEXT300,
        }}
        aria-live="polite"
      >
        {statusText}
      </p>
      <p className="mt-1 text-[0.65rem] text-text-500 sm:text-[0.7rem]">
        Click the pad or focus the game and use arrow keys / WASD. There is no
        friction: everything keeps its motion until something pushes it.
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
