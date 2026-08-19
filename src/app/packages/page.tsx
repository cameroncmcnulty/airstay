"use client";

import { SearchWidget } from "@/components/SearchWidget";
import { useApp } from "@/context/AppContext";

export default function PackagesPage() {
  const { m } = useApp();
  return (
    <div className="bg-gradient-to-b from-sky to-navy pb-16 pt-12 text-white">
      <div className="mx-auto max-w-6xl px-4">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-100">{m.nav.packages}</p>
        <h1 className="mt-2 text-3xl font-black md:text-4xl">{m.bubbles.packages}</h1>
        <p className="mt-3 max-w-2xl text-white/75">{m.bubbles.packagesSub}</p>
        <div className="mt-8 text-navy">
          <SearchWidget initialKind="packages" />
        </div>
      </div>
    </div>
  );
}
