"use client";

import { ExpediaPackageBanner } from "@/components/ExpediaPackageBanner";
import { useApp } from "@/context/AppContext";

export function ExpediaOffer() {
  const { m } = useApp();
  return (
    <section className="mx-auto max-w-6xl px-4">
      <div className="mx-auto w-full max-w-[760px] overflow-hidden rounded-2xl bg-white px-4 py-3 shadow-sm ring-1 ring-navy/8">
        <div className="mb-2 flex items-baseline justify-between gap-3">
          <h2 className="text-sm font-extrabold tracking-tight text-navy sm:text-base">{m.ad.title}</h2>
          <p className="shrink-0 text-[10px] font-semibold uppercase tracking-wide text-navy/40">{m.ad.kicker}</p>
        </div>
        <div className="eg-leaderboard-fit">
          <div className="eg-leaderboard-inner">
            <ExpediaPackageBanner layout="leaderboard" />
          </div>
        </div>
        <p className="mt-2 text-[11px] font-medium text-navy/45">{m.ad.note}</p>
      </div>
    </section>
  );
}
