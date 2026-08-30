"use client";

import Link from "next/link";
import { FEATURED_DESTINATIONS, getDestination } from "@/lib/airports";
import { DEST_PHOTOS } from "@/lib/deals";
import { defaultDepart, defaultReturn, queryToParams, type SearchKind } from "@/lib/deeplinks";
import { useApp } from "@/context/AppContext";

export function PopularDestGrid({
  kind = "flights",
  from = "YYZ",
  featured = false,
}: {
  kind?: SearchKind;
  from?: string;
  featured?: boolean;
}) {
  const { m, locale, settings, origin: geo } = useApp();
  const origin = geo?.code || settings?.defaultFrom || from;
  const codes = featured ? FEATURED_DESTINATIONS.slice(0, 8) : FEATURED_DESTINATIONS;
  return (
    <section className="mx-auto max-w-6xl px-4">
      <h2 className="text-2xl font-extrabold text-navy md:text-3xl">{m.popular.title}</h2>
      <p className="mt-1 text-sm text-navy/60">{m.popular.subtitle}</p>
      <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        {codes.map((code, i) => {
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
          const wide = featured && i < 2;
          return (
            <Link
              key={`${kind}-${d.code}`}
              href={href}
              className={`group relative overflow-hidden rounded-[1.4rem] ${
                wide ? "col-span-2 h-48 sm:h-64 md:h-72" : "h-40 sm:h-48"
              }`}
            >
              <img
                src={DEST_PHOTOS[d.code] || DEST_PHOTOS.LHR}
                alt=""
                className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/15 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <p className={`font-extrabold ${wide ? "text-2xl sm:text-3xl" : "text-lg"}`}>
                  {locale === "fr" ? d.cityFr : d.city}
                </p>
                <p className="text-xs text-white/75 sm:text-sm">{locale === "fr" ? d.countryFr : d.country}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
