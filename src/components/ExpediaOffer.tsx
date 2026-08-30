"use client";

import { ExpediaPackageBanner } from "@/components/ExpediaPackageBanner";
import { useApp } from "@/context/AppContext";

export function ExpediaOffer() {
  const { m } = useApp();
  return (
    <section className="mx-auto max-w-6xl px-4">
      <div className="flex flex-col items-center rounded-[1.6rem] bg-white px-5 py-6 shadow-card ring-1 ring-navy/5 sm:px-8">
        <p className="text-[11px] font-black uppercase tracking-[0.18em] text-navy/40">{m.ad.kicker}</p>
        <p className="mt-1 text-sm font-bold text-navy/70">{m.ad.title}</p>
        <div className="mt-4">
          <ExpediaPackageBanner />
        </div>
        <p className="mt-3 max-w-sm text-center text-[11px] font-medium text-navy/45">{m.ad.note}</p>
      </div>
    </section>
  );
}
