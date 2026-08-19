"use client";

import { DealGrid } from "@/components/DealCard";
import { useApp } from "@/context/AppContext";

export default function DealsPage() {
  const { m } = useApp();
  return (
    <div className="py-12">
      <div className="mx-auto max-w-6xl px-4 pb-8">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-700">{m.nav.deals}</p>
        <h1 className="mt-2 text-3xl font-black text-navy md:text-4xl">{m.deals.title}</h1>
        <p className="mt-2 max-w-2xl text-navy/65">{m.deals.subtitle}</p>
      </div>
      <DealGrid />
    </div>
  );
}
