"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// Interactive hero + mini-game for the "General Strain Theory" entry.
//
// Robert Agnew's causal chain, made playable: strain -> negative emotion ->
// coping -> outcome, with conditioning factors sitting on every arrow.
//
//  • Twenty weeks of a life. Each week may deliver a strain drawn from
//    Agnew's three types: failure to achieve positively valued goals,
//    removal of positively valued stimuli, presentation of negative stimuli.
//  • A strain's magnitude and its perceived INJUSTICE decide how it splits
//    between anger (outward-facing, blamed on others) and despair
//    (inward-facing). Per Agnew (2001), high-magnitude, unjust strains are
//    the criminogenic ones — the game weights them accordingly.
//  • The player picks one coping response per week: cognitive (reframe),
//    social (talk to someone), emotional (work it off), or deviant (hit
//    back / numb it). Deviant coping relieves the most pressure fastest
//    AND degrades the buffers, which is the feedback loop GST describes.
//  • If a meter passes the breaking point the player gets no choice at all
//    that week — the person acts anyway. Pressure with no outlet is the
//    theory's whole claim.
//  • The three conditioning-factor sliders (social support, constraint,
//    delinquent peers) sit on the strain->emotion and emotion->coping
//    arrows. "Replay this year" re-runs the IDENTICAL strain sequence with
//    whatever buffers are set now, which is the cleanest demonstration of
//    why most strained people never offend.
//
// Pure React + SVG, no external libs, no storage. Respects
// prefers-reduced-motion: the travelling pulse along the strain arrow is
// skipped and the arrow simply lights up.

const VW = 960;
const VH = 540;
const WEEKS = 20;

const SKY = "#a7c5e8";
const SAND = "#e3cf9b";
const SAGE = "#a3d4bd";
const ROSE = "#e7b9c7";
const ROSE_DIM = "#d17893";
const LILAC = "#c4b0e3";
const TEXT100 = "#e9e8e2";
const TEXT300 = "#a5a79f";
const TEXT500 = "#6d6e68";
const INK800 = "#1e2430";
const INK700 = "#2a3140";

type Kind = 1 | 2 | 3;

type Ev = {
  kind: Kind;
  text: string;
  /** 1 = irritant, 3 = severe. Drives how much pressure the strain adds. */
  mag: 1 | 2 | 3;
  /** 0 = nobody to blame, 1 = plainly unfair. Splits anger vs despair. */
  unjust: number;
};

/** Agnew's three strain types, as they are labelled on screen. */
const KIND_LABEL: Record<Kind, string> = {
  1: "Goal blocked",
  2: "Something good removed",
  3: "Something bad imposed",
};

const KIND_FULL: Record<Kind, string> = {
  1: "Failure to achieve positively valued goals",
  2: "Removal of positively valued stimuli",
  3: "Presentation of negative stimuli",
};

const KIND_COLOR: Record<Kind, string> = { 1: SAND, 2: LILAC, 3: ROSE };

// Illustrative scenarios, drawn from the kinds of strain the GST literature
// actually measures. Deliberately ordinary and non-graphic.
const EVENTS: Ev[] = [
  {
    kind: 1,
    text: "You studied for weeks. The exam that decides your placement comes back a fail.",
    mag: 2,
    unjust: 0.25,
  },
  {
    kind: 1,
    text: "The scholarship goes to someone who did less work and knew the right person.",
    mag: 3,
    unjust: 0.95,
  },
  {
    kind: 1,
    text: "Third rejection this month. Rent is due on Friday.",
    mag: 3,
    unjust: 0.5,
  },
  {
    kind: 1,
    text: "You made every training session all summer. The coach picks his nephew.",
    mag: 2,
    unjust: 0.9,
  },
  {
    kind: 1,
    text: "They promised the trip if you got the grades. You got them. It is off.",
    mag: 2,
    unjust: 0.8,
  },
  {
    kind: 1,
    text: "Everyone you grew up with seems to be getting somewhere. You are not.",
    mag: 2,
    unjust: 0.3,
  },
  {
    kind: 2,
    text: "Your closest friend moves three states away.",
    mag: 2,
    unjust: 0.05,
  },
  {
    kind: 2,
    text: "Your parents separate. You pack up the room you grew up in.",
    mag: 3,
    unjust: 0.2,
  },
  {
    kind: 2,
    text: "Your grandmother — the one who raised you — dies.",
    mag: 3,
    unjust: 0.05,
  },
  {
    kind: 2,
    text: "The relationship ends. No explanation, no conversation.",
    mag: 2,
    unjust: 0.55,
  },
  {
    kind: 2,
    text: "Your hours are cut. The job you liked is gone by Friday.",
    mag: 2,
    unjust: 0.6,
  },
  {
    kind: 2,
    text: "The youth centre where you spent every evening closes for good.",
    mag: 1,
    unjust: 0.4,
  },
  {
    kind: 3,
    text: "A teacher takes you apart in front of the whole class.",
    mag: 2,
    unjust: 0.9,
  },
  {
    kind: 3,
    text: "You are jumped walking home. They take your phone.",
    mag: 3,
    unjust: 0.95,
  },
  {
    kind: 3,
    text: "Stopped and searched again. Third time this month, same street.",
    mag: 2,
    unjust: 0.95,
  },
  {
    kind: 3,
    text: "It does not stop at school. Every day, and always with an audience.",
    mag: 3,
    unjust: 0.9,
  },
  {
    kind: 3,
    text: "The shouting at home turns on you again.",
    mag: 3,
    unjust: 0.85,
  },
  {
    kind: 3,
    text: "The landlord lets himself in without notice. Again.",
    mag: 1,
    unjust: 0.85,
  },
];

type Choice = "reframe" | "talk" | "absorb" | "strike" | "numb";

/** What actually happened in a resolved week. */
type Slot = {
  kind: Kind | 0;
  outcome: Choice | "broke" | "flooded" | "quiet";
};

type Run = {
  year: (Ev | null)[];
  week: number;
  anger: number;
  despair: number;
  /** Live buffers — they drift as deviant coping is used. */
  support: number;
  control: number;
  peers: number;
  /** Buffer values the run started with, for the drift markers. */
  base: { support: number; control: number; peers: number };
  outward: number;
  inward: number;
  legit: number;
  log: Slot[];
  done: boolean;
};

/** Deterministic PRNG (mulberry32) so a year can be replayed exactly. */
function rng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildYear(seed: number): (Ev | null)[] {
  const r = rng(seed);
  const out: (Ev | null)[] = [];
  let prev = -1;
  for (let w = 0; w < WEEKS; w++) {
    if (r() < 0.18) {
      out.push(null);
      continue;
    }
    let i = Math.floor(r() * EVENTS.length);
    if (i === prev) i = (i + 1 + Math.floor(r() * 3)) % EVENTS.length;
    prev = i;
    out.push(EVENTS[i]);
  }
  return out;
}

const clamp = (v: number, lo = 0, hi = 100) => Math.max(lo, Math.min(hi, v));

/** Anger breaking point: constraint raises it, delinquent peers lower it. */
function angerThreshold(r: Run): number {
  return 68 + 24 * (r.control / 100) - 16 * (r.peers / 100);
}
function despairThreshold(r: Run): number {
  return 72 + 20 * (r.control / 100) - 6 * (r.peers / 100);
}

/** A strain lands: magnitude sets the size, injustice sets the direction. */
function applyStrain(r: Run, ev: Ev): Run {
  const raw = ev.mag * 19;
  const damp = 1 - 0.4 * (r.support / 100);
  return {
    ...r,
    anger: clamp(r.anger + raw * (0.35 + 0.65 * ev.unjust) * damp),
    despair: clamp(r.despair + raw * (0.35 + 0.65 * (1 - ev.unjust)) * damp),
  };
}

function applyChoice(r: Run, ev: Ev | null, choice: Choice): Run {
  const unjust = ev?.unjust ?? 0.4;
  let { anger, despair, support, control, peers } = r;
  let outward = r.outward;
  let inward = r.inward;
  let legit = r.legit;

  switch (choice) {
    case "reframe": {
      // Cognitive coping: reinterpret the strain as smaller or deserved.
      // Injustice resists it — you cannot talk yourself out of unfairness.
      const eff = 0.28 + 0.34 * (control / 100);
      anger -= anger * eff * (1 - 0.5 * unjust);
      despair -= despair * eff;
      legit += 1;
      break;
    }
    case "talk": {
      // Social coping: only as good as the support actually available.
      const eff = 0.2 + 0.48 * (support / 100);
      anger -= anger * eff;
      despair -= despair * eff * 1.1;
      legit += 1;
      break;
    }
    case "absorb": {
      // Emotional coping: always available, never enough on its own.
      anger -= anger * 0.3;
      despair -= despair * 0.24;
      legit += 1;
      break;
    }
    case "strike": {
      // Criminal coping. Fastest relief, and it eats the buffers that
      // would have made legitimate coping work next time.
      anger -= anger * (0.65 + 0.2 * (peers / 100));
      despair -= despair * 0.35;
      outward += 1;
      support = clamp(support - 5);
      control = clamp(control - 2);
      peers = clamp(peers + 5);
      break;
    }
    case "numb": {
      // Escapist deviance — the despair-side response.
      despair -= despair * 0.75;
      anger -= anger * 0.3;
      inward += 1;
      support = clamp(support - 2);
      control = clamp(control - 5);
      peers = clamp(peers + 3);
      break;
    }
  }

  return {
    ...r,
    anger: clamp(anger),
    despair: clamp(despair),
    support,
    control,
    peers,
    outward,
    inward,
    legit,
  };
}

/** Natural recovery between weeks, faster for the well-regulated. */
function decay(r: Run): Run {
  const d = 3 + 5 * (r.control / 100);
  return { ...r, anger: clamp(r.anger - d), despair: clamp(r.despair - d) };
}

/**
 * Land week `w`'s strain, then resolve every week the person cannot choose
 * their way through, stopping at the first week that awaits a decision (or
 * at the end of the year).
 */
function settle(start: Run): Run {
  let r = start;
  let guard = 0;
  while (guard++ < WEEKS * 3) {
    if (r.week >= WEEKS) return { ...r, done: true };

    const ev = r.year[r.week];
    if (ev) r = applyStrain(r, ev);

    // Breaking point: no choice is offered this week.
    if (r.anger >= angerThreshold(r)) {
      const after = applyChoice(r, ev, "strike");
      r = decay({
        ...after,
        log: [...r.log, { kind: ev?.kind ?? 0, outcome: "broke" }],
        week: r.week + 1,
      });
      continue;
    }
    if (r.despair >= despairThreshold(r)) {
      const after = applyChoice(r, ev, "numb");
      r = decay({
        ...after,
        log: [...r.log, { kind: ev?.kind ?? 0, outcome: "flooded" }],
        week: r.week + 1,
      });
      continue;
    }

    // A quiet week resolves itself.
    if (!ev) {
      r = decay({
        ...r,
        log: [...r.log, { kind: 0, outcome: "quiet" }],
        week: r.week + 1,
      });
      continue;
    }

    return r; // awaiting the player
  }
  return { ...r, done: true };
}

function startRun(
  seed: number,
  support: number,
  control: number,
  peers: number
): Run {
  return settle({
    year: buildYear(seed),
    week: 0,
    anger: 0,
    despair: 0,
    support,
    control,
    peers,
    base: { support, control, peers },
    outward: 0,
    inward: 0,
    legit: 0,
    log: [],
    done: false,
  });
}

const CHOICES: {
  id: Choice;
  label: string;
  hint: string;
  deviant: boolean;
}[] = [
  {
    id: "reframe",
    label: "Reframe it",
    hint: "Cognitive coping — decide it matters less. Works badly on injustice.",
    deviant: false,
  },
  {
    id: "talk",
    label: "Talk to someone",
    hint: "Social coping — only as strong as the support you actually have.",
    deviant: false,
  },
  {
    id: "absorb",
    label: "Work it off",
    hint: "Emotional coping — always available, rarely enough alone.",
    deviant: false,
  },
  {
    id: "strike",
    label: "Hit back",
    hint: "Criminal coping — instant relief on anger, and it costs you buffers.",
    deviant: true,
  },
  {
    id: "numb",
    label: "Numb it",
    hint: "Escapist deviance — drains despair, drains constraint.",
    deviant: true,
  },
];

export default function InteractiveStrain() {
  const [support, setSupport] = useState(50);
  const [control, setControl] = useState(50);
  const [peers, setPeers] = useState(35);
  const [seed, setSeed] = useState(20260826);
  const [run, setRun] = useState<Run>(() => startRun(20260826, 50, 50, 35));
  const [pulse, setPulse] = useState(0);

  const reduced = useRef(false);
  const raf = useRef<number | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    reduced.current = mq.matches;
    const onMq = () => {
      reduced.current = mq.matches;
    };
    mq.addEventListener("change", onMq);
    return () => mq.removeEventListener("change", onMq);
  }, []);

  // A single travelling pulse along the active strain arrow. Runs only while
  // a strain is on screen, and not at all under reduced motion.
  const ev = run.done ? null : run.year[run.week];
  useEffect(() => {
    if (!ev || reduced.current) {
      setPulse(0);
      return;
    }
    let t0 = 0;
    const loop = (now: number) => {
      if (!t0) t0 = now;
      setPulse(((now - t0) / 1400) % 1);
      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [ev]);

  const choose = useCallback(
    (c: Choice) => {
      setRun((r) => {
        if (r.done) return r;
        const cur = r.year[r.week];
        const after = applyChoice(r, cur, c);
        return settle(
          decay({
            ...after,
            log: [...r.log, { kind: cur?.kind ?? 0, outcome: c }],
            week: r.week + 1,
          })
        );
      });
    },
    [setRun]
  );

  const replaySameYear = useCallback(() => {
    setRun(startRun(seed, support, control, peers));
  }, [seed, support, control, peers]);

  const newYear = useCallback(() => {
    const s = (seed * 1664525 + 1013904223) >>> 0;
    setSeed(s);
    setRun(startRun(s, support, control, peers));
  }, [seed, support, control, peers]);

  const angerT = angerThreshold(run);
  const despairT = despairThreshold(run);
  const acts = run.outward + run.inward;

  // ── layout ────────────────────────────────────────────────────────────
  const SRC_X = 34;
  const SRC_W = 176;
  const SRC_Y = [176, 250, 324];
  const EMO_X = 268;
  const EMO_W = 344;
  const OUT_X = 664;
  const OUT_W = 262;
  const PANEL_Y = 158;
  const PANEL_H = 236;

  const meter = (
    y: number,
    value: number,
    thresh: number,
    color: string,
    label: string
  ) => {
    const x = EMO_X + 20;
    const w = EMO_W - 40;
    return (
      <g key={label}>
        <text
          x={x}
          y={y - 8}
          fontSize={11}
          fill={TEXT300}
          fontFamily="ui-monospace, monospace"
        >
          {label}
        </text>
        <text
          x={x + w}
          y={y - 8}
          textAnchor="end"
          fontSize={11}
          fill={color}
          fontFamily="ui-monospace, monospace"
        >
          {Math.round(value)}
        </text>
        <rect x={x} y={y} width={w} height={20} rx={4} fill={INK800} />
        <rect
          x={x}
          y={y}
          width={Math.max((value / 100) * w, 0)}
          height={20}
          rx={4}
          fill={color}
          opacity={0.85}
        />
        <line
          x1={x + (thresh / 100) * w}
          y1={y - 3}
          x2={x + (thresh / 100) * w}
          y2={y + 23}
          stroke={TEXT100}
          strokeWidth={1.5}
          opacity={0.75}
        />
        <text
          x={x + (thresh / 100) * w}
          y={y + 34}
          textAnchor="middle"
          fontSize={9}
          fill={TEXT500}
          fontFamily="ui-monospace, monospace"
        >
          breaking point
        </text>
      </g>
    );
  };

  const gauge = (
    y: number,
    label: string,
    val: number,
    base: number,
    c: string
  ) => {
    const x = OUT_X + 18;
    const w = OUT_W - 36;
    return (
      <g key={label}>
        <text
          x={x}
          y={y - 5}
          fontSize={10}
          fill={TEXT500}
          fontFamily="ui-monospace, monospace"
        >
          {label}
        </text>
        <text
          x={x + w}
          y={y - 5}
          textAnchor="end"
          fontSize={10}
          fill={c}
          fontFamily="ui-monospace, monospace"
        >
          {Math.round(val)}
        </text>
        <rect x={x} y={y} width={w} height={7} rx={3} fill={INK800} />
        <rect
          x={x}
          y={y}
          width={(val / 100) * w}
          height={7}
          rx={3}
          fill={c}
          opacity={0.85}
        />
        {Math.abs(val - base) > 0.5 && (
          <line
            x1={x + (base / 100) * w}
            y1={y - 2}
            x2={x + (base / 100) * w}
            y2={y + 9}
            stroke={TEXT500}
            strokeWidth={1.5}
          />
        )}
      </g>
    );
  };

  return (
    <div className="mb-8">
      <div
        className="relative w-full overflow-hidden rounded-lg border border-line-700 bg-ink-950"
        role="group"
        aria-label="General Strain Theory: absorb a year of strains and choose how to cope"
      >
        <svg viewBox={`0 0 ${VW} ${VH}`} className="block w-full">
          {/* ── the week's strain ───────────────────────────────────── */}
          <rect
            x={188}
            y={26}
            width={584}
            height={92}
            rx={10}
            fill={INK800}
            stroke={ev ? KIND_COLOR[ev.kind] : INK700}
            strokeWidth={1.5}
            opacity={ev ? 1 : 0.6}
          />
          <text
            x={480}
            y={50}
            textAnchor="middle"
            fontSize={11}
            fill={ev ? KIND_COLOR[ev.kind] : TEXT500}
            fontFamily="ui-monospace, monospace"
            letterSpacing={1}
          >
            {run.done
              ? "YEAR COMPLETE"
              : ev
                ? KIND_LABEL[ev.kind].toUpperCase()
                : " "}
          </text>
          {run.done ? (
            <text
              x={480}
              y={82}
              textAnchor="middle"
              fontSize={16}
              fill={TEXT100}
            >
              {acts === 0
                ? "Twenty weeks, no deviant coping."
                : `Twenty weeks. ${acts} deviant act${acts === 1 ? "" : "s"}.`}
            </text>
          ) : ev ? (
            <>
              <text
                x={480}
                y={80}
                textAnchor="middle"
                fontSize={15}
                fill={TEXT100}
              >
                {ev.text.length > 74 ? ev.text.slice(0, 72) + "…" : ev.text}
              </text>
              <text
                x={480}
                y={104}
                textAnchor="middle"
                fontSize={10}
                fill={TEXT500}
                fontFamily="ui-monospace, monospace"
              >
                magnitude {ev.mag}/3 · perceived injustice{" "}
                {Math.round(ev.unjust * 100)}%
              </text>
            </>
          ) : null}

          {/* ── strain sources ──────────────────────────────────────── */}
          {([1, 2, 3] as Kind[]).map((k, i) => {
            const active = ev?.kind === k;
            const count = run.log.filter((l) => l.kind === k).length;
            return (
              <g key={k}>
                <rect
                  x={SRC_X}
                  y={SRC_Y[i]}
                  width={SRC_W}
                  height={52}
                  rx={8}
                  fill={active ? INK700 : INK800}
                  stroke={active ? KIND_COLOR[k] : INK700}
                  strokeWidth={active ? 2 : 1}
                />
                <text
                  x={SRC_X + 12}
                  y={SRC_Y[i] + 21}
                  fontSize={11.5}
                  fill={active ? KIND_COLOR[k] : TEXT300}
                  fontFamily="ui-monospace, monospace"
                >
                  {KIND_LABEL[k]}
                </text>
                <text
                  x={SRC_X + 12}
                  y={SRC_Y[i] + 39}
                  fontSize={9.5}
                  fill={TEXT500}
                  fontFamily="ui-monospace, monospace"
                >
                  type {k} · {count} so far
                </text>
                {/* arrow into the emotion panel */}
                <line
                  x1={SRC_X + SRC_W}
                  y1={SRC_Y[i] + 26}
                  x2={EMO_X - 8}
                  y2={PANEL_Y + PANEL_H / 2}
                  stroke={active ? KIND_COLOR[k] : INK700}
                  strokeWidth={active ? 2 : 1}
                  opacity={active ? 0.9 : 0.7}
                />
                {active && pulse > 0 && (
                  <circle
                    cx={SRC_X + SRC_W + (EMO_X - 8 - SRC_X - SRC_W) * pulse}
                    cy={
                      SRC_Y[i] +
                      26 +
                      (PANEL_Y + PANEL_H / 2 - SRC_Y[i] - 26) * pulse
                    }
                    r={4}
                    fill={KIND_COLOR[k]}
                  />
                )}
              </g>
            );
          })}
          <text
            x={SRC_X}
            y={150}
            fontSize={10}
            fill={TEXT500}
            fontFamily="ui-monospace, monospace"
            letterSpacing={1}
          >
            STRAIN
          </text>

          {/* ── negative emotion ────────────────────────────────────── */}
          <text
            x={EMO_X}
            y={150}
            fontSize={10}
            fill={TEXT500}
            fontFamily="ui-monospace, monospace"
            letterSpacing={1}
          >
            NEGATIVE EMOTION
          </text>
          <rect
            x={EMO_X}
            y={PANEL_Y}
            width={EMO_W}
            height={PANEL_H}
            rx={10}
            fill={INK800}
            stroke={INK700}
            strokeWidth={1}
          />
          {meter(PANEL_Y + 46, run.anger, angerT, ROSE_DIM, "anger")}
          {meter(PANEL_Y + 146, run.despair, despairT, LILAC, "despair")}
          <text
            x={EMO_X + EMO_W / 2}
            y={PANEL_Y + PANEL_H - 12}
            textAnchor="middle"
            fontSize={9.5}
            fill={TEXT500}
            fontFamily="ui-monospace, monospace"
          >
            unjust strain → anger · loss → despair
          </text>

          {/* arrow to outcome */}
          <line
            x1={EMO_X + EMO_W}
            y1={PANEL_Y + PANEL_H / 2}
            x2={OUT_X - 8}
            y2={PANEL_Y + PANEL_H / 2}
            stroke={INK700}
            strokeWidth={1.5}
          />
          <text
            x={(EMO_X + EMO_W + OUT_X) / 2}
            y={PANEL_Y + PANEL_H / 2 - 10}
            textAnchor="middle"
            fontSize={9.5}
            fill={TEXT500}
            fontFamily="ui-monospace, monospace"
          >
            coping
          </text>

          {/* ── outcome + live buffers ──────────────────────────────── */}
          <text
            x={OUT_X}
            y={150}
            fontSize={10}
            fill={TEXT500}
            fontFamily="ui-monospace, monospace"
            letterSpacing={1}
          >
            OUTCOME
          </text>
          <rect
            x={OUT_X}
            y={PANEL_Y}
            width={OUT_W}
            height={PANEL_H}
            rx={10}
            fill={INK800}
            stroke={INK700}
            strokeWidth={1}
          />
          <text
            x={OUT_X + 18}
            y={PANEL_Y + 30}
            fontSize={12}
            fill={SAGE}
            fontFamily="ui-monospace, monospace"
          >
            legitimate coping {run.legit}
          </text>
          <text
            x={OUT_X + 18}
            y={PANEL_Y + 52}
            fontSize={12}
            fill={ROSE_DIM}
            fontFamily="ui-monospace, monospace"
          >
            outward acts {run.outward}
          </text>
          <text
            x={OUT_X + 18}
            y={PANEL_Y + 74}
            fontSize={12}
            fill={LILAC}
            fontFamily="ui-monospace, monospace"
          >
            escapist acts {run.inward}
          </text>
          <line
            x1={OUT_X + 18}
            y1={PANEL_Y + 90}
            x2={OUT_X + OUT_W - 18}
            y2={PANEL_Y + 90}
            stroke={INK700}
            strokeWidth={1}
          />
          <text
            x={OUT_X + 18}
            y={PANEL_Y + 108}
            fontSize={9.5}
            fill={TEXT500}
            fontFamily="ui-monospace, monospace"
            letterSpacing={0.5}
          >
            CONDITIONING FACTORS
          </text>
          {gauge(
            PANEL_Y + 126,
            "social support",
            run.support,
            run.base.support,
            SAGE
          )}
          {gauge(
            PANEL_Y + 160,
            "constraint",
            run.control,
            run.base.control,
            SKY
          )}
          {gauge(
            PANEL_Y + 194,
            "delinquent peers",
            run.peers,
            run.base.peers,
            ROSE_DIM
          )}

          {/* ── the year, week by week ──────────────────────────────── */}
          <text
            x={34}
            y={438}
            fontSize={10}
            fill={TEXT500}
            fontFamily="ui-monospace, monospace"
            letterSpacing={1}
          >
            WEEK
          </text>
          {Array.from({ length: WEEKS }, (_, w) => {
            const slot = run.log[w];
            const x = 34 + w * ((VW - 68) / WEEKS);
            const cw = (VW - 68) / WEEKS - 6;
            const fill = !slot
              ? INK800
              : slot.outcome === "quiet"
                ? INK700
                : slot.outcome === "broke"
                  ? ROSE_DIM
                  : slot.outcome === "flooded"
                    ? LILAC
                    : slot.outcome === "strike"
                      ? ROSE
                      : slot.outcome === "numb"
                        ? LILAC
                        : SAGE;
            const forced =
              slot?.outcome === "broke" || slot?.outcome === "flooded";
            return (
              <g key={w}>
                <rect
                  x={x}
                  y={452}
                  width={cw}
                  height={26}
                  rx={4}
                  fill={fill}
                  opacity={slot ? (forced ? 1 : 0.75) : 0.5}
                  stroke={w === run.week && !run.done ? TEXT100 : "none"}
                  strokeWidth={1.5}
                />
                {forced && (
                  <text
                    x={x + cw / 2}
                    y={470}
                    textAnchor="middle"
                    fontSize={12}
                    fill="#0f1218"
                    fontFamily="ui-monospace, monospace"
                  >
                    !
                  </text>
                )}
                <text
                  x={x + cw / 2}
                  y={496}
                  textAnchor="middle"
                  fontSize={9}
                  fill={TEXT500}
                  fontFamily="ui-monospace, monospace"
                >
                  {w + 1}
                </text>
              </g>
            );
          })}
          <text
            x={VW - 34}
            y={520}
            textAnchor="end"
            fontSize={9.5}
            fill={TEXT500}
            fontFamily="ui-monospace, monospace"
          >
            ! = pressure passed the breaking point — no choice was offered
          </text>
        </svg>
      </div>

      {/* ── coping choices ───────────────────────────────────────────── */}
      <div className="mt-4 flex flex-wrap gap-2">
        {CHOICES.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => choose(c.id)}
            disabled={run.done}
            title={c.hint}
            className={`rounded-md border px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue disabled:cursor-not-allowed disabled:opacity-40 ${
              c.deviant
                ? "border-accent-rose-dim/50 bg-ink-800 text-accent-rose hover:border-accent-rose"
                : "border-line-700 bg-ink-800 text-text-100 hover:border-accent-sage"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>
      <p className="mt-2 text-[0.65rem] text-text-500 sm:text-[0.7rem]">
        {run.done
          ? "The year is over. Change the buffers below and replay the same twenty weeks."
          : "Every response relieves pressure. Two of them relieve it by spending the buffers that would have made next week survivable."}
      </p>

      {/* ── conditioning factors ─────────────────────────────────────── */}
      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end">
        <div className="flex-1">
          <div className="flex items-center justify-between text-[0.7rem] text-text-300 sm:text-xs">
            <span>Social support</span>
            <span className="font-mono" style={{ color: SAGE }}>
              {support}
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            step={5}
            value={support}
            onChange={(e) => setSupport(Number(e.target.value))}
            className="mt-1 w-full accent-[#a3d4bd]"
            aria-label="Social support"
          />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between text-[0.7rem] text-text-300 sm:text-xs">
            <span>Constraint / self-efficacy</span>
            <span className="font-mono" style={{ color: SKY }}>
              {control}
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            step={5}
            value={control}
            onChange={(e) => setControl(Number(e.target.value))}
            className="mt-1 w-full accent-[#a7c5e8]"
            aria-label="Constraint and self-efficacy"
          />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between text-[0.7rem] text-text-300 sm:text-xs">
            <span>Delinquent peers</span>
            <span className="font-mono" style={{ color: ROSE_DIM }}>
              {peers}
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            step={5}
            value={peers}
            onChange={(e) => setPeers(Number(e.target.value))}
            className="mt-1 w-full accent-[#d17893]"
            aria-label="Delinquent peers"
          />
        </div>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={replaySameYear}
            className="rounded-md border border-line-700 bg-ink-800 px-4 py-2 text-sm font-medium text-text-100 transition-colors hover:border-brand-pink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue"
          >
            Replay this year ↻
          </button>
          <button
            type="button"
            onClick={newYear}
            className="rounded-md border border-line-700 bg-ink-800 px-4 py-2 text-sm font-medium text-text-300 transition-colors hover:border-brand-pink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue"
          >
            New year
          </button>
        </div>
      </div>

      <p
        className="mt-3 text-[0.7rem] sm:text-xs"
        style={{ color: acts === 0 ? SAGE : ROSE }}
        aria-live="polite"
      >
        {run.done
          ? acts === 0
            ? "Strained all year and never offended — which is what most strained people do. Now drop the buffers and replay the identical twenty weeks."
            : `${run.outward} outward and ${run.inward} escapist acts, of which ${run.log.filter((l) => l.outcome === "broke" || l.outcome === "flooded").length} were never chosen — the pressure simply passed the breaking point.`
          : ev
            ? `Week ${run.week + 1} of ${WEEKS}. ${KIND_FULL[ev.kind]}.`
            : `Week ${run.week + 1} of ${WEEKS}.`}
      </p>
      <p className="mt-1 text-[0.65rem] text-text-500 sm:text-[0.7rem]">
        The strains are the same whatever the sliders say. What changes is how
        much emotion each one produces, how well legitimate coping works, and
        how early the breaking point arrives — which is Agnew&apos;s answer to
        why most strained people never offend. Scenarios are illustrative, not
        case records.
      </p>
    </div>
  );
}
