"use client";

import { useState } from "react";
import {
  ELEMENTS,
  CATEGORY_LABEL,
  CATEGORY_COLOR,
  type ChemElement,
  type ElementCategory,
} from "@/config/periodic-elements";

// Interactive hero for the "Periodic Law" entry. Hover or focus an element to
// read its details; the matching category lights up across the whole table so
// the *recurrence* of properties — the periodic law itself — is visible. No
// external libs, no storage; pure React state. Themed to the dark ink palette.

function hexA(hex: string, alpha: number): string {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

const CATS = Object.keys(CATEGORY_LABEL) as ElementCategory[];

export default function InteractivePeriodicTable() {
  const [active, setActive] = useState<ChemElement | null>(null);
  const [focusCat, setFocusCat] = useState<ElementCategory | null>(null);

  const select = (el: ChemElement | null) => {
    setActive(el);
    setFocusCat(el ? el.cat : null);
  };

  return (
    <div className="mb-8">
      <div className="relative w-full overflow-hidden rounded-lg border border-line-700 bg-ink-900 p-2 sm:p-3 md:aspect-video">
        <div
          className="grid h-full w-full gap-[2px] sm:gap-1"
          style={{
            gridTemplateColumns: "repeat(18, 1fr)",
            gridTemplateRows: "repeat(7, 1fr) 0.45fr repeat(2, 1fr)",
          }}
        >
          {/* Info / readout panel parks in the empty top-centre of the table. */}
          <div
            className="pointer-events-none z-10 flex flex-col justify-center rounded-md px-2"
            style={{ gridColumn: "3 / 13", gridRow: "1 / 4" }}
          >
            {active ? (
              <Readout el={active} />
            ) : (
              <div className="leading-tight">
                <p className="text-sm font-medium text-text-100 sm:text-base md:text-lg">
                  The Periodic Law
                </p>
                <p className="mt-1 text-[0.6rem] text-text-300 sm:text-xs">
                  Hover an element. Its category lights up across the table —
                  the recurrence of properties is the law itself.
                </p>
              </div>
            )}
          </div>

          {ELEMENTS.map((el) => {
            const color = CATEGORY_COLOR[el.cat];
            const dim = focusCat !== null && el.cat !== focusCat;
            const isActive = active?.z === el.z;
            return (
              <button
                key={el.z}
                type="button"
                onMouseEnter={() => select(el)}
                onFocus={() => select(el)}
                onMouseLeave={() => select(null)}
                onBlur={() => select(null)}
                onClick={() => select(el)}
                aria-label={`${el.name}, atomic number ${el.z}, ${CATEGORY_LABEL[el.cat]}`}
                aria-pressed={isActive}
                className="group flex flex-col items-center justify-center rounded-[3px] border transition-all duration-150 focus:outline-none focus-visible:ring-1 focus-visible:ring-white/70"
                style={{
                  gridColumn: el.col,
                  gridRow: el.row,
                  borderColor: hexA(color, isActive ? 1 : 0.55),
                  backgroundColor: isActive
                    ? hexA(color, 0.85)
                    : hexA(color, 0.12),
                  opacity: dim ? 0.22 : 1,
                  color: isActive ? "#0f1218" : color,
                }}
              >
                <span className="text-[5px] leading-none opacity-70 sm:text-[7px]">
                  {el.z}
                </span>
                <span className="text-[7px] font-semibold leading-tight sm:text-[10px] md:text-xs">
                  {el.sym}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Legend — also a filter: hover a swatch to isolate that category. */}
      <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1.5">
        {CATS.map((c) => (
          <button
            key={c}
            type="button"
            onMouseEnter={() => setFocusCat(c)}
            onMouseLeave={() => focusCat === c && !active && setFocusCat(null)}
            className="flex items-center gap-1.5 text-[0.6rem] text-text-300 transition-colors hover:text-text-100 sm:text-xs"
          >
            <span
              className="inline-block h-2.5 w-2.5 rounded-[2px]"
              style={{ backgroundColor: hexA(CATEGORY_COLOR[c], 0.85) }}
              aria-hidden="true"
            />
            {CATEGORY_LABEL[c]}
          </button>
        ))}
      </div>
    </div>
  );
}

function Readout({ el }: { el: ChemElement }) {
  const color = CATEGORY_COLOR[el.cat];
  return (
    <div className="flex items-center gap-3">
      <div
        className="flex h-11 w-11 flex-col items-center justify-center rounded-md sm:h-14 sm:w-14"
        style={{ backgroundColor: hexA(color, 0.9), color: "#0f1218" }}
      >
        <span className="text-[0.55rem] leading-none sm:text-[0.65rem]">
          {el.z}
        </span>
        <span className="text-sm font-bold leading-tight sm:text-xl">
          {el.sym}
        </span>
      </div>
      <div className="leading-tight">
        <p className="text-sm font-medium text-text-100 sm:text-base">
          {el.name}
        </p>
        <p className="text-[0.6rem] sm:text-xs" style={{ color }}>
          {CATEGORY_LABEL[el.cat]}
        </p>
        <p className="mt-0.5 text-[0.6rem] text-text-300 sm:text-xs">
          Period {el.period}
          {el.group ? ` · Group ${el.group}` : " · f-block"}
        </p>
      </div>
    </div>
  );
}
