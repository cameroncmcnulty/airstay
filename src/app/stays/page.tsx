"use client";

import { SearchWidget } from "@/components/SearchWidget";
import { useApp } from "@/context/AppContext";

export default function StaysPage() {
  const { m } = useApp();
  return (
    <div className="bg-gradient-to-b from-sky-700 to-navy pb-16 pt-12 text-white">
      <div className="mx-auto max-w-6xl px-4">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-100">{m.nav.stays}</p>
        <h1 className="mt-2 text-3xl font-black md:text-4xl">{m.bubbles.stays}</h1>
        <p className="mt-3 max-w-2xl text-white/75">{m.bubbles.staysSub}</p>
        <div className="mt-8 text-navy">
          <SearchWidget initialKind="stays" />
        </div>
      </div>
    </div>
  );
}
