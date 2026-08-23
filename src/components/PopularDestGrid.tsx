"use client";

import Link from "next/link";
import { FEATURED_DESTINATIONS, getDestination } from "@/lib/airports";
import { DEST_PHOTOS } from "@/lib/deals";
import { defaultDepart, defaultReturn, queryToParams, type SearchKind } from "@/lib/deeplinks";
import { useApp } from "@/context/AppContext";

export function PopularDestGrid({
  kind = "flights",
  from = "YYZ",
}: {
  kind?: SearchKind;
  from?: string;
}) {
  const { m, locale, settings } = useApp();
  const origin = settings?.defaultFrom || from;
  return (
    <section className="mx-auto max-w-6xl px-4">
      <h2 className="text-2xl font-extrabold text-navy">{m.popular.title}</h2>
      <p className="mt-1 text-sm text-navy/60">{m.popular.subtitle}</p>
      <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        {FEATURED_DESTINATIONS.map((code) => {
          const d = getDestination(code);
          if (!d) return null;
          const href = `/results?${queryToParams({
            kind,
            from: kind === "flights" ? origin : undefined,
            to: d.code,
            toCity: locale === "fr" ? d.cityFr : d.city,
            depart: defaultDepart(),
            returnDate: defaultReturn(),
            adults: kind === "stays" ? 2 : 1,
          })}`;
          return (
            <Link
              key={`${kind}-${d.code}`}
              href={href}
              className="group relative h-36 overflow-hidden rounded-card sm:h-44"
            >
              <img
                src={DEST_PHOTOS[d.code] || DEST_PHOTOS.LHR}
                alt=""
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/85 via-navy/25 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <p className="font-extrabold">{locale === "fr" ? d.cityFr : d.city}</p>
                <p className="text-xs text-white/75">{locale === "fr" ? d.countryFr : d.country}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
