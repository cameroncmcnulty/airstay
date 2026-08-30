"use client";

import { useState } from "react";
import { ShieldCheck, MapPin, BadgeDollarSign, Link2 } from "lucide-react";
import { SearchWidget } from "@/components/SearchWidget";
import { CategoryBubbles } from "@/components/CategoryBubbles";
import { DealGrid } from "@/components/DealCard";
import { HeroMedia } from "@/components/HeroMedia";
import { HeroPeek } from "@/components/HeroPeek";
import { HowItWorks, TrustStrip } from "@/components/HowItWorks";
import { PopularDestGrid } from "@/components/PopularDestGrid";
import { ExpediaOffer } from "@/components/ExpediaOffer";
import { TravelpayoutsEmbed } from "@/components/TravelpayoutsEmbed";
import { useApp } from "@/context/AppContext";
import { type SearchKind } from "@/lib/deeplinks";

const PARTNERS = [
  "Aviasales",
  "Kayak",
  "Skyscanner",
  "Expedia",
  "Booking.com",
  "Hotels.com",
  "Agoda",
  "Discover Cars",
  "Rentalcars.com",
];

export default function HomePage() {
  const { m, settings, origin } = useApp();
  const [kind, setKind] = useState<SearchKind>("flights");
  const why = [
    { icon: MapPin, t: m.why.c1t, d: m.why.c1d },
    { icon: Link2, t: m.why.c2t, d: m.why.c2d },
    { icon: BadgeDollarSign, t: m.why.c3t, d: m.why.c3d },
    { icon: ShieldCheck, t: m.why.c4t, d: m.why.c4d },
  ];
  const from = origin?.code || settings?.defaultFrom || "YYZ";

  return (
    <>
      <section className="relative">
        <div className="relative min-h-[70vh] overflow-hidden sm:min-h-[78vh]">
          <HeroMedia />
          <div className="relative z-10 mx-auto flex min-h-[70vh] max-w-6xl flex-col justify-end gap-8 px-4 pb-28 pt-10 sm:min-h-[78vh] sm:pb-32 md:flex-row md:items-end md:justify-between">
            <div className="max-w-xl pb-2">
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-sky-100">{m.hero.kicker}</p>
              <h1 className="mt-3 text-4xl font-black leading-[0.95] tracking-tight text-white sm:text-5xl md:text-7xl">
                {m.hero.title}
              </h1>
              <p className="mt-4 max-w-md text-base text-white/85 sm:text-lg">{m.hero.subtitle}</p>
              <a
                href="#search"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-sky px-5 py-2.5 text-sm font-bold text-white shadow-lift hover:bg-sky-600"
              >
                {m.search.search}
                <span aria-hidden>→</span>
              </a>
            </div>
            <HeroPeek from={from} />
          </div>
        </div>
        <div id="search" className="relative z-20 mx-auto -mt-16 max-w-6xl px-3 sm:-mt-20 sm:px-4">
          <div className="rounded-[1.7rem] bg-white p-3 shadow-card ring-1 ring-navy/5 sm:rounded-[1.9rem] sm:p-6">
            <CategoryBubbles selected={kind} onSelect={setKind} compact />
            <div className="mt-3 sm:mt-5">
              <SearchWidget kind={kind} hideTabs embedded />
            </div>
          </div>
        </div>
      </section>

      <div className="space-y-16 py-14 sm:space-y-24 sm:py-20">
        <TrustStrip />
        <ExpediaOffer />
        <TravelpayoutsEmbed />
        <HowItWorks />
        <DealGrid limit={4} />

        <section className="mx-auto max-w-6xl px-4">
          <h2 className="text-center text-2xl font-extrabold text-navy md:text-3xl">{m.why.title}</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {why.map((w) => (
              <div key={w.t} className="rounded-[1.6rem] bg-white p-6 text-center shadow-card ring-1 ring-navy/5">
                <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-sky-50 text-sky">
                  <w.icon className="h-6 w-6" />
                </span>
                <h3 className="mt-4 font-extrabold text-navy">{w.t}</h3>
                <p className="mt-1 text-sm leading-relaxed text-navy/60">{w.d}</p>
              </div>
            ))}
          </div>
        </section>

        <PopularDestGrid featured />

        <section className="mx-auto max-w-6xl px-4">
          <h2 className="text-center text-2xl font-extrabold text-navy">{m.partners.title}</h2>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {PARTNERS.map((p) => (
              <span key={p} className="rounded-full bg-white px-4 py-2 text-sm font-bold text-navy shadow-sm ring-1 ring-navy/10">
                {p}
              </span>
            ))}
          </div>
          <p className="mx-auto mt-4 max-w-2xl text-center text-xs text-navy/55">{m.partners.note}</p>
        </section>
      </div>
    </>
  );
}
