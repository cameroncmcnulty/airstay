"use client";

import Link from "next/link";
import { Plane, Building2, BadgeDollarSign, TreePalm } from "lucide-react";
import { DEST_PHOTOS } from "@/lib/deals";
import { useApp } from "@/context/AppContext";

export function VacationPackages({ compact = false }: { compact?: boolean }) {
  const { m } = useApp();
  const perks = [
    { icon: Plane, t: m.packages.perk1 },
    { icon: Building2, t: m.packages.perk2 },
    { icon: BadgeDollarSign, t: m.packages.perk3 },
  ];

  return (
    <section id="packages" className={compact ? "" : "mx-auto max-w-6xl px-4"}>
      <div className="relative overflow-hidden rounded-[1.8rem] bg-navy text-white shadow-card sm:rounded-[2.2rem]">
        <img
          src={DEST_PHOTOS.CUN}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/88 to-navy/55" />
        <div className="relative p-6 sm:p-10">
          <p className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.22em] text-sky-200">
            <TreePalm className="h-3.5 w-3.5" />
            {m.packages.kicker}
          </p>
          <h2 className="mt-3 max-w-xl text-3xl font-black tracking-tight sm:text-4xl md:text-5xl">{m.packages.title}</h2>
          <p className="mt-3 max-w-lg text-sm leading-relaxed text-white/80 sm:text-base">{m.packages.subtitle}</p>
          <ul className="mt-5 flex flex-wrap gap-2">
            {perks.map((p) => (
              <li
                key={p.t}
                className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold text-sky-50 ring-1 ring-white/15"
              >
                <p.icon className="h-3.5 w-3.5" />
                {p.t}
              </li>
            ))}
          </ul>
          <div className="mt-6 flex flex-wrap gap-2">
            {!compact && (
              <Link
                href="/packages"
                className="inline-flex items-center gap-2 rounded-full bg-sky px-5 py-2.5 text-sm font-bold text-white shadow-lift hover:bg-sky-600"
              >
                {m.packages.see}
              </Link>
            )}
            <Link href="/flights" className="inline-flex items-center rounded-full bg-white/10 px-4 py-2.5 text-sm font-bold text-white ring-1 ring-white/20 hover:bg-white/15">
              {m.nav.flights}
            </Link>
            <Link href="/stays" className="inline-flex items-center rounded-full bg-white/10 px-4 py-2.5 text-sm font-bold text-white ring-1 ring-white/20 hover:bg-white/15">
              {m.nav.stays}
            </Link>
          </div>
          <p className="mt-3 max-w-md text-[11px] font-medium text-white/55">{m.packages.note}</p>
        </div>
      </div>
    </section>
  );
}
