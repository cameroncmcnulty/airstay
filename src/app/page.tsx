"use client";

import Link from "next/link";
import { useState } from "react";
import { ShieldCheck, MapPin, BadgeDollarSign, Link2 } from "lucide-react";
import { SearchWidget } from "@/components/SearchWidget";
import { CategoryBubbles } from "@/components/CategoryBubbles";
import { DealGrid } from "@/components/DealCard";
import { useApp } from "@/context/AppContext";
import { POPULAR_DESTINATIONS } from "@/lib/airports";
import { DEST_PHOTOS } from "@/lib/deals";
import { defaultDepart, defaultReturn, queryToParams, type SearchKind } from "@/lib/deeplinks";

const PARTNERS = ["Kayak", "Expedia", "Booking.com", "Airbnb", "Skyscanner", "Air Canada", "WestJet", "Sunwing"];

export default function HomePage() {
  const { m, locale } = useApp();
  const [kind, setKind] = useState<SearchKind>("flights");
  const why = [
    { icon: MapPin, t: m.why.c1t, d: m.why.c1d },
    { icon: Link2, t: m.why.c2t, d: m.why.c2d },
    { icon: BadgeDollarSign, t: m.why.c3t, d: m.why.c3d },
    { icon: ShieldCheck, t: m.why.c4t, d: m.why.c4d },
  ];

  return (
    <>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=2000&q=80"
            alt=""
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-navy/80 via-navy/70 to-mist" />
        </div>
        <div className="relative mx-auto max-w-6xl px-4 pb-10 pt-14 md:pt-20">
          <p className="inline-flex rounded-full bg-white/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-sky-100 ring-1 ring-white/20">
            {m.hero.kicker}
          </p>
          <h1 className="mt-4 max-w-3xl text-3xl font-black leading-tight text-white md:text-5xl">{m.hero.title}</h1>
          <p className="mt-4 max-w-2xl text-base text-white/80 md:text-lg">{m.hero.subtitle}</p>
          <div className="mt-10">
            <CategoryBubbles selected={kind} onSelect={setKind} light />
          </div>
          <div className="mt-8">
            <SearchWidget kind={kind} hideTabs />
          </div>
        </div>
      </section>

      <div className="space-y-20 py-16">
        <DealGrid limit={4} />

        <section className="mx-auto max-w-6xl px-4">
          <h2 className="text-2xl font-extrabold text-navy md:text-3xl">{m.why.title}</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {why.map((w) => (
              <div key={w.t} className="flex gap-4 rounded-card bg-white p-5 shadow-card ring-1 ring-navy/5">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-sky-50 text-sky">
                  <w.icon className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="font-extrabold text-navy">{w.t}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-navy/65">{w.d}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4">
          <h2 className="text-2xl font-extrabold text-navy">{m.popular.title}</h2>
          <p className="mt-1 text-sm text-navy/60">{m.popular.subtitle}</p>
          <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
            {POPULAR_DESTINATIONS.slice(0, 8).map((d) => {
              const href = `/results?${queryToParams({
                kind: "flights",
                from: "YYZ",
                to: d.code,
                toCity: locale === "fr" ? d.cityFr : d.city,
                depart: defaultDepart(),
                returnDate: defaultReturn(),
                adults: 1,
              })}`;
              return (
                <Link key={d.code} href={href} className="group relative h-40 overflow-hidden rounded-card">
                  <img
                    src={DEST_PHOTOS[d.code] || DEST_PHOTOS.LHR}
                    alt=""
                    className="h-full w-full object-cover transition group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/80 to-navy/10" />
                  <div className="absolute bottom-3 left-3 text-white">
                    <p className="font-extrabold">{locale === "fr" ? d.cityFr : d.city}</p>
                    <p className="text-xs text-white/75">{locale === "fr" ? d.countryFr : d.country}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

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
