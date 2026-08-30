"use client";

import { VacationPackages } from "@/components/VacationPackages";
import { HowItWorks, TrustStrip } from "@/components/HowItWorks";
import { useApp } from "@/context/AppContext";

export default function PackagesPage() {
  const { m } = useApp();
  return (
    <div className="space-y-12 py-10 sm:space-y-16 sm:py-14">
      <div className="mx-auto max-w-6xl px-4">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-700">{m.nav.packages}</p>
        <h1 className="mt-2 text-3xl font-black text-navy md:text-5xl">{m.pages.packagesTitle}</h1>
        <p className="mt-3 max-w-2xl text-navy/65">{m.pages.packagesSub}</p>
      </div>
      <VacationPackages compact />
      <TrustStrip />
      <HowItWorks />
    </div>
  );
}
