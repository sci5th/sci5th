"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

// Interactive hero + mini-game for the "Probability Theory" entry.
//
// A Galton board (quincunx) turned into a betting game, because the betting
// is what makes the theory bite:
//
//  • Each ball makes `rows` independent left/right decisions, each going
//    right with probability p. The number of rights is Binomial(rows, p),
//    so the bin it lands in is drawn from C(n,k) p^k (1-p)^(n-k).
//  • The player covers any set of bins before dropping. The board pays
//    FAIR ODDS — 1 / P(covered) on a hit, nothing on a miss — so every
//    possible bet has expected value exactly 1 chip per drop. Covering one
//    rare bin and covering nine common ones are worth the same in
//    expectation; only the variance differs. That invariance IS the lesson.
//  • The running return per drop therefore converges to 1.00 (law of large
//    numbers), and the observed histogram converges to the binomial curve,
//    which itself converges to the normal curve (de Moivre–Laplace / CLT).
//    All three convergences are on screen at once.
//
// Pure React + SVG, no external libs, no storage. Respects
// prefers-reduced-motion: the ball is not animated down the pegs — the drop
// resolves instantly and the result is shown as a static landing marker.

const VW = 960;
const VH = 540;
const CX = VW / 2;
const MARGIN = 60;
const PEG_TOP = 78;
const PEG_AREA_H = 244;
const HIST_TOP = 356;
const HIST_H = 138;
const HOP_MS = 58;
const MAX_PEG_SPACING = 56;

const SKY = "#a7c5e8";
const SKY_DIM = "#6298d6";
const SAND = "#e3cf9b";
const SAGE = "#a3d4bd";
const ROSE = "#e7b9c7";
const TEXT300 = "#a5a79f";
const TEXT500 = "#6d6e68";

type Ball = {
  /** Screen waypoints: release point, one per peg row, then the bin mouth. */
  path: { x: number; y: number }[];
  /** Which waypoint segment the ball is currently traversing. */
  leg: number;
  /** Progress along the current segment, 0..1. */
  t: number;
  /** Final bin index, decided the moment the ball is released. */
  bin: number;
  /** Coverage probability of the bet locked in at release. */
  pBet: number;
  /** Whether the released bet covered the landing bin. */
  won: boolean;
};

/** Binomial pmf. Rows are capped at 14, so the plain product is exact enough. */
function binomPmf(n: number, k: number, p: number): number {
  let c = 1;
  for (let i = 0; i < k; i++) c = (c * (n - i)) / (i + 1);
  return c * Math.pow(p, k) * Math.pow(1 - p, n - k);
}

/** Horizontal spacing between neighbouring pegs (and so between bins). */
function spacingFor(rows: number): number {
  return Math.min((VW - 2 * MARGIN) / (rows + 1), MAX_PEG_SPACING);
}

/** Screen x of peg `j` in row `r` — also the centre of bin `j` when r = rows. */
function slotX(r: number, j: number, s: number): number {
  return CX + (j - r / 2) * s;
}

/** One ball's worth of left/right decisions, returned as the landing bin. */
function sampleBin(rows: number, p: number): number {
  let k = 0;
  for (let i = 0; i < rows; i++) if (Math.random() < p) k++;
  return k;
}

/** The bins a fresh board starts with covered: the mode and its neighbours. */
function defaultBets(rows: number, p: number): boolean[] {
  const mode = Math.min(rows, Math.max(0, Math.round((rows + 1) * p - 0.5)));
  return Array.from({ length: rows + 1 }, (_, k) => Math.abs(k - mode) <= 1);
}

export default function InteractiveGaltonBoard() {
  const [rows, setRows] = useState(10);
  const [p, setP] = useState(0.5);
  const [bets, setBets] = useState<boolean[]>(() => defaultBets(10, 0.5));
  const [counts, setCounts] = useState<number[]>(() => Array(11).fill(0));
  const [drops, setDrops] = useState(0);
  const [hits, setHits] = useState(0);
  const [payout, setPayout] = useState(0);
  const [lastBin, setLastBin] = useState<number | null>(null);
  const [lastWon, setLastWon] = useState<boolean | null>(null);
  const [lastPay, setLastPay] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [, setFrame] = useState(0);

  // The travelling ball lives in a ref so the animation loop can mutate it
  // without re-subscribing every frame.
  const ball = useRef<Ball | null>(null);
  const raf = useRef<number | null>(null);
  const last = useRef(0);
  const reduced = useRef(false);

  const s = spacingFor(rows);
  const bins = rows + 1;

  const theory = useMemo(
    () => Array.from({ length: rows + 1 }, (_, k) => binomPmf(rows, k, p)),
    [rows, p]
  );
  const pBet = useMemo(
    () => theory.reduce((acc, q, k) => (bets[k] ? acc + q : acc), 0),
    [theory, bets]
  );

  const resetRun = useCallback((nextRows: number, nextP: number) => {
    ball.current = null;
    setAnimating(false);
    setCounts(Array(nextRows + 1).fill(0));
    setDrops(0);
    setHits(0);
    setPayout(0);
    setLastBin(null);
    setLastWon(null);
    setLastPay(0);
    setBets((prev) =>
      prev.length === nextRows + 1 ? prev : defaultBets(nextRows, nextP)
    );
  }, []);

  const record = useCallback((bin: number, won: boolean, bet: number) => {
    setCounts((c) => {
      const next = [...c];
      next[bin] += 1;
      return next;
    });
    setDrops((d) => d + 1);
    setLastBin(bin);
    setLastWon(won);
    setLastPay(won ? 1 / bet : 0);
    if (won) {
      setHits((h) => h + 1);
      setPayout((v) => v + 1 / bet);
    }
  }, []);

  const dropOne = useCallback(() => {
    if (ball.current || pBet <= 0) return;
    const bin = sampleBin(rows, p);
    const won = bets[bin] === true;

    if (reduced.current) {
      record(bin, won, pBet);
      return;
    }
    setAnimating(true);

    // Rebuild the ball's route from the same decisions that produced `bin`:
    // a monotone staircase of peg indices ending on `bin` is statistically
    // identical to the draw, and keeps the animation honest.
    const rights: number[] = [];
    let remaining = bin;
    for (let r = rows; r > 0; r--) {
      // Choose, uniformly among the arrangements consistent with `bin`,
      // whether this row's decision was a right.
      const goRight = Math.random() < remaining / r;
      rights.push(goRight ? 1 : 0);
      if (goRight) remaining -= 1;
    }
    rights.reverse();

    const path: { x: number; y: number }[] = [
      { x: CX, y: PEG_TOP - PEG_AREA_H / rows },
    ];
    let k = 0;
    for (let r = 0; r < rows; r++) {
      path.push({ x: slotX(r, k, s), y: PEG_TOP + (r * PEG_AREA_H) / rows });
      k += rights[r];
    }
    path.push({ x: slotX(rows, bin, s), y: HIST_TOP - 4 });

    ball.current = { path, leg: 0, t: 0, bin, pBet, won };
  }, [ball, bets, p, pBet, record, rows, s]);

  const dropMany = useCallback(
    (n: number) => {
      if (ball.current || pBet <= 0) return;
      const next = [...counts];
      let addHits = 0;
      let addPay = 0;
      let final = 0;
      for (let i = 0; i < n; i++) {
        const bin = sampleBin(rows, p);
        next[bin] += 1;
        final = bin;
        if (bets[bin]) {
          addHits += 1;
          addPay += 1 / pBet;
        }
      }
      setCounts(next);
      setDrops((d) => d + n);
      setHits((h) => h + addHits);
      setPayout((v) => v + addPay);
      setLastBin(final);
      setLastWon(bets[final] === true);
      setLastPay(bets[final] ? 1 / pBet : 0);
    },
    [ball, bets, counts, p, pBet, rows]
  );

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    reduced.current = mq.matches;
    const onMq = () => {
      reduced.current = mq.matches;
    };
    mq.addEventListener("change", onMq);
    return () => mq.removeEventListener("change", onMq);
  }, []);

  useEffect(() => {
    if (!animating) return;
    last.current = 0;
    const loop = (now: number) => {
      if (!last.current) last.current = now;
      const dt = Math.min(now - last.current, 48);
      last.current = now;

      const b = ball.current;
      if (b) {
        b.t += dt / HOP_MS;
        while (b.t >= 1 && b.leg < b.path.length - 2) {
          b.t -= 1;
          b.leg += 1;
        }
        if (b.leg >= b.path.length - 2 && b.t >= 1) {
          ball.current = null;
          record(b.bin, b.won, b.pBet);
          setAnimating(false);
        }
        setFrame((f) => (f + 1) % 100000);
      }
      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [animating, record]);

  const toggleBin = (k: number) => {
    setBets((prev) => {
      const next = [...prev];
      next[k] = !next[k];
      return next;
    });
  };

  const total = drops || 1;
  const maxTheory = Math.max(...theory);
  const maxObserved = Math.max(...counts) / total;
  const scale = Math.max(maxTheory * 1.32, maxObserved * 1.04, 1e-6);

  const barY = (freq: number) =>
    HIST_TOP + HIST_H - Math.min(freq / scale, 1) * HIST_H;

  // Normal approximation to Binomial(rows, p): the de Moivre–Laplace limit.
  const mu = rows * p;
  const sigma = Math.sqrt(rows * p * (1 - p));
  const normalPts = useMemo(() => {
    const pts: string[] = [];
    for (let i = 0; i <= 160; i++) {
      const x = -0.5 + (i / 160) * (rows + 1);
      const d =
        Math.exp(-((x - mu) * (x - mu)) / (2 * sigma * sigma)) /
        (sigma * Math.sqrt(2 * Math.PI));
      pts.push(
        `${slotX(rows, x, s).toFixed(1)},${(
          HIST_TOP +
          HIST_H -
          Math.min(d / scale, 1.02) * HIST_H
        ).toFixed(1)}`
      );
    }
    return pts.join(" ");
  }, [mu, rows, s, scale, sigma]);

  const perDrop = drops > 0 ? payout / drops : 0;
  const hitRate = drops > 0 ? hits / drops : 0;
  const ballPos = (() => {
    const b = ball.current;
    if (!b) return null;
    const a = b.path[b.leg];
    const c = b.path[Math.min(b.leg + 1, b.path.length - 1)];
    const t = Math.min(b.t, 1);
    return {
      x: a.x + (c.x - a.x) * t,
      // Ease the vertical drop so each hop looks like a fall, not a glide.
      y: a.y + (c.y - a.y) * (t * t * 0.65 + t * 0.35),
    };
  })();

  const statusColor = lastWon === null ? TEXT300 : lastWon ? SAGE : ROSE;
  const statusText =
    pBet <= 0
      ? "Cover at least one bin — an empty bet has probability zero, and the fair payout 1/0 is undefined."
      : lastBin === null
        ? `Cover the bins you think the ball will reach, then drop. A hit pays 1/${pBet.toFixed(3)} = ${(1 / pBet).toFixed(2)} chips; a miss pays nothing.`
        : lastWon
          ? `Bin ${lastBin} — covered. Paid ${lastPay.toFixed(2)} chips at fair odds.`
          : `Bin ${lastBin} — not covered. No payout. The expected value of the bet was still exactly 1 chip.`;

  return (
    <div className="mb-8">
      <div
        className="relative w-full overflow-hidden rounded-lg border border-line-700 bg-ink-950"
        role="group"
        aria-label="Galton board: cover bins, drop balls at fair odds, and watch the binomial distribution build"
      >
        <svg viewBox={`0 0 ${VW} ${VH}`} className="block w-full">
          {/* funnel */}
          <path
            d={`M ${CX - 26} 26 L ${CX - 5} ${PEG_TOP - PEG_AREA_H / rows} L ${CX + 5} ${PEG_TOP - PEG_AREA_H / rows} L ${CX + 26} 26`}
            fill="none"
            stroke={SKY_DIM}
            strokeWidth={1.5}
            opacity={0.55}
          />

          {/* peg lattice */}
          {Array.from({ length: rows }, (_, r) =>
            Array.from({ length: r + 1 }, (_, j) => (
              <circle
                key={`${r}-${j}`}
                cx={slotX(r, j, s)}
                cy={PEG_TOP + (r * PEG_AREA_H) / rows}
                r={Math.max(2, Math.min(3.4, s / 14))}
                fill={SKY_DIM}
                opacity={0.6}
              />
            ))
          )}

          {/* bin lanes */}
          {Array.from({ length: bins }, (_, k) => (
            <rect
              key={`lane-${k}`}
              x={slotX(rows, k, s) - s / 2 + 1}
              y={HIST_TOP}
              width={s - 2}
              height={HIST_H}
              fill={bets[k] ? SAGE : "#ffffff"}
              opacity={bets[k] ? 0.09 : 0.02}
            />
          ))}

          {/* observed frequencies */}
          {counts.map((n, k) => {
            const freq = n / total;
            if (n === 0) return null;
            return (
              <rect
                key={`bar-${k}`}
                x={slotX(rows, k, s) - s / 2 + 3}
                y={barY(freq)}
                width={s - 6}
                height={HIST_TOP + HIST_H - barY(freq)}
                fill={bets[k] ? SAGE : SKY}
                opacity={0.72}
              />
            );
          })}

          {/* the exact binomial, as a step outline */}
          <polyline
            points={theory
              .flatMap((q, k) => [
                `${(slotX(rows, k, s) - s / 2).toFixed(1)},${barY(q).toFixed(1)}`,
                `${(slotX(rows, k, s) + s / 2).toFixed(1)},${barY(q).toFixed(1)}`,
              ])
              .join(" ")}
            fill="none"
            stroke={SAND}
            strokeWidth={1.8}
            opacity={0.9}
          />

          {/* the normal limit of that binomial */}
          <polyline
            points={normalPts}
            fill="none"
            stroke={ROSE}
            strokeWidth={1.6}
            strokeDasharray="5 5"
            opacity={0.8}
          />

          {/* baseline */}
          <line
            x1={slotX(rows, 0, s) - s / 2}
            y1={HIST_TOP + HIST_H}
            x2={slotX(rows, rows, s) + s / 2}
            y2={HIST_TOP + HIST_H}
            stroke={TEXT500}
            strokeWidth={1}
            opacity={0.7}
          />

          {/* bin labels */}
          {Array.from({ length: bins }, (_, k) => (
            <text
              key={`lab-${k}`}
              x={slotX(rows, k, s)}
              y={HIST_TOP + HIST_H + 16}
              textAnchor="middle"
              fontSize={Math.min(11, s / 2.6)}
              fill={lastBin === k ? SAND : TEXT500}
              fontFamily="ui-monospace, monospace"
            >
              {k}
            </text>
          ))}

          {/* landing marker (the only cue when motion is reduced) */}
          {lastBin !== null && !ballPos && (
            <circle
              cx={slotX(rows, lastBin, s)}
              cy={HIST_TOP - 8}
              r={5}
              fill={lastWon ? SAGE : ROSE}
              stroke="#0f1218"
              strokeWidth={1.5}
            />
          )}

          {/* travelling ball */}
          {ballPos && (
            <circle
              cx={ballPos.x}
              cy={ballPos.y}
              r={6}
              fill={SAND}
              stroke="#0f1218"
              strokeWidth={1.5}
            />
          )}

          {/* legend */}
          <g fontFamily="ui-monospace, monospace" fontSize={11}>
            <line
              x1={VW - 214}
              y1={30}
              x2={VW - 194}
              y2={30}
              stroke={SAND}
              strokeWidth={1.8}
            />
            <text x={VW - 188} y={34} fill={TEXT300}>
              binomial
            </text>
            <line
              x1={VW - 214}
              y1={48}
              x2={VW - 194}
              y2={48}
              stroke={ROSE}
              strokeWidth={1.6}
              strokeDasharray="5 5"
            />
            <text x={VW - 188} y={52} fill={TEXT300}>
              normal limit
            </text>
            <rect
              x={VW - 214}
              y={62}
              width={20}
              height={8}
              fill={SKY}
              opacity={0.72}
            />
            <text x={VW - 188} y={70} fill={TEXT300}>
              observed
            </text>
          </g>
        </svg>

        {/* Real buttons over the bin lanes: keyboard-reachable, announced. */}
        <div className="absolute inset-0">
          {Array.from({ length: bins }, (_, k) => (
            <button
              key={`btn-${k}`}
              type="button"
              onClick={() => toggleBin(k)}
              aria-pressed={bets[k]}
              aria-label={`Bin ${k}, probability ${(theory[k] * 100).toFixed(2)} percent`}
              title={`P(bin ${k}) = ${theory[k].toFixed(4)}`}
              className="absolute cursor-pointer rounded-sm transition-colors hover:bg-white/[0.06] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-brand-blue"
              style={{
                left: `${((slotX(rows, k, s) - s / 2) / VW) * 100}%`,
                width: `${(s / VW) * 100}%`,
                top: `${(HIST_TOP / VH) * 100}%`,
                height: `${(HIST_H / VH) * 100}%`,
              }}
            />
          ))}
        </div>

        {/* readout overlay */}
        <div className="pointer-events-none absolute left-3 top-3 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[0.6rem] sm:text-xs">
          <span style={{ color: SKY }}>drops {drops}</span>
          <span style={{ color: SAGE }}>
            hit {(hitRate * 100).toFixed(1)}% / P {(pBet * 100).toFixed(1)}%
          </span>
          <span style={{ color: SAND }}>
            return {perDrop.toFixed(3)} per drop
          </span>
          <span style={{ color: TEXT300 }}>
            µ {mu.toFixed(1)} σ {sigma.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end">
        <div className="flex-1">
          <div className="flex items-center justify-between text-[0.7rem] text-text-300 sm:text-xs">
            <span>Rows of pegs (n independent trials)</span>
            <span className="font-mono" style={{ color: SKY }}>
              {rows}
            </span>
          </div>
          <input
            type="range"
            min={4}
            max={14}
            step={1}
            value={rows}
            onChange={(e) => {
              const next = Number(e.target.value);
              setRows(next);
              setBets(defaultBets(next, p));
              resetRun(next, p);
            }}
            className="mt-1 w-full accent-[#a7c5e8]"
            aria-label="Rows of pegs"
          />
          <p className="mt-1 text-[0.65rem] text-text-500 sm:text-[0.7rem]">
            Every extra row is one more coin flip added to the sum. More rows,
            smoother bell.
          </p>
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between text-[0.7rem] text-text-300 sm:text-xs">
            <span>Bounce-right probability (p)</span>
            <span className="font-mono" style={{ color: SAND }}>
              {p.toFixed(2)}
            </span>
          </div>
          <input
            type="range"
            min={0.25}
            max={0.75}
            step={0.05}
            value={p}
            onChange={(e) => {
              const next = Number(e.target.value);
              setP(next);
              resetRun(rows, next);
            }}
            className="mt-1 w-full accent-[#e3cf9b]"
            aria-label="Bounce-right probability"
          />
          <p className="mt-1 text-[0.65rem] text-text-500 sm:text-[0.7rem]">
            Tilt the pegs and the bell slides to µ = np — but it is still a
            bell.
          </p>
        </div>

        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={dropOne}
            disabled={pBet <= 0 || animating}
            className="rounded-md border border-line-700 bg-ink-800 px-4 py-2 text-sm font-medium text-text-100 transition-colors hover:border-brand-pink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue disabled:cursor-not-allowed disabled:opacity-40"
          >
            Drop
          </button>
          <button
            type="button"
            onClick={() => dropMany(200)}
            disabled={pBet <= 0 || animating}
            className="rounded-md border border-line-700 bg-ink-800 px-4 py-2 text-sm font-medium text-text-100 transition-colors hover:border-brand-pink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue disabled:cursor-not-allowed disabled:opacity-40"
          >
            Drop 200
          </button>
          <button
            type="button"
            onClick={() => resetRun(rows, p)}
            className="rounded-md border border-line-700 bg-ink-800 px-4 py-2 text-sm font-medium text-text-300 transition-colors hover:border-brand-pink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue"
          >
            Reset ↻
          </button>
        </div>
      </div>

      <p
        className="mt-3 text-[0.7rem] sm:text-xs"
        style={{ color: statusColor }}
        aria-live="polite"
      >
        {statusText}
      </p>
      <p className="mt-1 text-[0.65rem] text-text-500 sm:text-[0.7rem]">
        Click the bins to change your bet. Cover one rare bin or nine common
        ones — at fair odds both are worth exactly 1 chip per drop, and only the
        wildness of the ride changes. Keep dropping: the return heads for 1.000
        and the bars settle onto the curve.
      </p>
    </div>
  );
}
