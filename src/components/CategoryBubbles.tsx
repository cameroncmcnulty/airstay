"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import type { SearchKind } from "@/lib/deeplinks";
import { CategoryMotion } from "./CategoryMotion";

const items = [
  { id: "flights" as const, href: "/flights", key: "flights" as const, sub: "flightsSub" as const },
  { id: "stays" as const, href: "/stays", key: "stays" as const, sub: "staysSub" as const },
  { id: "cars" as const, href: "/cars", key: "cars" as const, sub: "carsSub" as const },
  { id: "packages" as const, href: "/packages", key: "packages" as const, sub: "packagesSub" as const },
];

export function CategoryBubbles({
  selected,
  onSelect,
  light = false,
  compact = false,
}: {
  selected?: SearchKind;
  onSelect?: (kind: SearchKind) => void;
  light?: boolean;
  compact?: boolean;
}) {
  const { m } = useApp();
  const [play, setPlay] = useState<SearchKind | null>(null);
  const [tick, setTick] = useState(0);
  const stop = useCallback(() => setPlay(null), []);

  function fire(id: SearchKind) {
    setPlay(id);
    setTick((n) => n + 1);
    onSelect?.(id);
  }

  return (
    <section className={compact ? "" : "mx-auto max-w-6xl px-4"}>
      {!compact && (
        <h2 className={`text-center text-2xl font-extrabold ${light ? "text-white" : "text-navy"}`}>{m.bubbles.title}</h2>
      )}
      <div className={`grid grid-cols-4 ${compact ? "gap-1 sm:gap-3" : "mt-8 gap-4"}`}>
        {items.map((it) => {
          const active = selected === it.id;
          const inner = (
            <>
              <span
                className={`grid place-items-center rounded-full bg-white shadow-bubble ring-1 transition group-hover:-translate-y-0.5 group-hover:shadow-lift ${
                  compact ? "h-16 w-16 sm:h-[4.5rem] sm:w-[4.5rem] md:h-24 md:w-24" : "h-24 w-24 md:h-32 md:w-32"
                } ${active ? "ring-4 ring-sky" : "ring-navy/10"}`}
              >
                <span
                  className={`relative overflow-hidden rounded-full text-white ${
                    compact ? "h-11 w-11 sm:h-12 sm:w-12 md:h-16 md:w-16" : "h-16 w-16 md:h-20 md:w-20"
                  } ${active ? "bg-sky" : "bg-navy"}`}
                >
                  <CategoryMotion
                    kind={it.id}
                    play={play === it.id}
                    playKey={play === it.id ? tick : 0}
                    className={compact ? "h-6 w-6 md:h-8 md:w-8" : "h-8 w-8 md:h-10 md:w-10"}
                    onDone={stop}
                  />
                </span>
              </span>
              <span className={`mt-2 max-w-full truncate font-extrabold ${compact ? "text-[11px] sm:text-sm" : "mt-4 text-lg"} ${light && !compact ? "text-white" : "text-navy"}`}>
                {m.bubbles[it.key]}
              </span>
              {!compact && (
                <span className={`text-sm ${light ? "text-white/70" : "text-navy/55"}`}>{m.bubbles[it.sub]}</span>
              )}
            </>
          );
          const className = `group flex flex-col items-center text-center ${compact ? "rounded-2xl p-1 sm:p-2" : "rounded-[2rem] p-4"}`;
          if (onSelect) {
            return (
              <button key={it.id} type="button" onClick={() => fire(it.id)} className={className} aria-pressed={active}>
                {inner}
              </button>
            );
          }
          return (
            <Link key={it.id} href={it.href} className={className} onClick={() => fire(it.id)}>
              {inner}
            </Link>
          );
        })}
      </div>
    </section>
  );
}
