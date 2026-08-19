"use client";

import { SearchWidget } from "@/components/SearchWidget";
import { useApp } from "@/context/AppContext";

export default function CarsPage() {
  const { m } = useApp();
  return (
    <div className="bg-gradient-to-b from-navy-400 to-navy pb-16 pt-12 text-white">
      <div className="mx-auto max-w-6xl px-4">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-100">{m.nav.cars}</p>
        <h1 className="mt-2 text-3xl font-black md:text-4xl">{m.bubbles.cars}</h1>
        <p className="mt-3 max-w-2xl text-white/75">{m.bubbles.carsSub}</p>
        <div className="mt-8 text-navy">
          <SearchWidget initialKind="cars" />
        </div>
      </div>
    </div>
  );
}
