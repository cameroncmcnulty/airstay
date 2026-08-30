"use client";

import { ExpediaPackageBanner } from "@/components/ExpediaPackageBanner";
import { useApp } from "@/context/AppContext";

export function ExpediaOffer() {
  const { m } = useApp();
  return (
    <section className="mx-auto max-w-6xl px-4">
      <div className="flex flex-col items-center rounded-[1.8rem] bg-white px-5 py-8 shadow-card ring-1 ring-navy/5 sm:px-10 sm:py-10">
        <p className="text-[11px] font-black uppercase tracking-[0.18em] text-navy/40">{m.ad.kicker}</p>
        <p className="mt-1 text-center text-lg font-extrabold text-navy">{m.ad.title}</p>
        <div className="mt-5 flex min-h-[250px] w-full items-center justify-center">
          <ExpediaPackageBanner />
        </div>
        <p className="mt-4 max-w-sm text-center text-[11px] font-medium text-navy/45">{m.ad.note}</p>
      </div>
    </section>
  );
}
