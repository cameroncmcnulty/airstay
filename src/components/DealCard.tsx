"use client";

import Link from "next/link";
import { DEALS, type Deal } from "@/lib/deals";
import { cad, cadFr, defaultDepart, defaultReturn, queryToParams, type SearchKind } from "@/lib/deeplinks";
import { useApp } from "@/context/AppContext";

export function DealCard({ deal }: { deal: Deal }) {
  const { locale, m } = useApp();
  const price = locale === "fr" ? cadFr(deal.priceCad) : cad(deal.priceCad);
  const was = deal.wasCad ? (locale === "fr" ? cadFr(deal.wasCad) : cad(deal.wasCad)) : null;
  const href = `/results?${queryToParams({
    kind: deal.kind === "flight" ? "flights" : deal.kind === "stay" ? "stays" : deal.kind === "car" ? "cars" : "packages",
    from: deal.from,
    to: deal.to,
    toCity: locale === "fr" ? deal.toCityFr : deal.toCity,
    depart: defaultDepart(),
    returnDate: defaultReturn(),
    adults: 1,
  })}`;
  return (
    <Link href={href} className="group flex flex-col overflow-hidden rounded-card bg-white shadow-card ring-1 ring-navy/5">
      <div className="relative h-44 overflow-hidden">
        <img
          src={deal.image}
          alt={locale === "fr" ? deal.imageAltFr : deal.imageAlt}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        {deal.badge && (
          <span className="absolute left-3 top-3 rounded-full bg-sky px-3 py-1 text-xs font-bold text-white">
            {locale === "fr" ? deal.badgeFr : deal.badge}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <p className="text-xs font-bold uppercase tracking-wide text-sky-700">
          {kindLabel(deal.kind, locale)}
          {deal.from ? ` · ${deal.from}` : ""}
        </p>
        <h3 className="mt-1 text-xl font-extrabold text-navy">{locale === "fr" ? deal.toCityFr : deal.toCity}</h3>
        <p className="text-sm text-navy/55">{locale === "fr" ? deal.blurbFr : deal.blurb}</p>
        <div className="mt-auto pt-4">
          <p className="text-xs font-semibold text-navy/45">{m.deals.from}</p>
          <p className="text-2xl font-black text-navy">
            {price}
            {was && <span className="ml-2 text-sm font-semibold text-navy/40 line-through">{was}</span>}
          </p>
        </div>
      </div>
    </Link>
  );
}

export function DealGrid({ limit }: { limit?: number }) {
  const { m } = useApp();
  const list = limit ? DEALS.slice(0, limit) : DEALS;
  return (
    <section className="mx-auto max-w-6xl px-4">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-navy md:text-3xl">{m.deals.title}</h2>
          <p className="mt-1 max-w-2xl text-sm text-navy/60">{m.deals.subtitle}</p>
        </div>
        {limit && (
          <a href="/deals" className="hidden text-sm font-bold text-sky-700 md:inline">
            {m.deals.viewAll}
          </a>
        )}
      </div>
      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {list.map((d) => (
          <DealCard key={d.id} deal={d} />
        ))}
      </div>
    </section>
  );
}

function kindLabel(kind: Deal["kind"], locale: "en" | "fr") {
  const map = {
    flight: { en: "Flight", fr: "Vol" },
    stay: { en: "Stay", fr: "Séjour" },
    car: { en: "Car", fr: "Auto" },
    package: { en: "Package", fr: "Forfait" },
  };
  return map[kind][locale];
}

export function kindToSearch(kind: Deal["kind"]): SearchKind {
  if (kind === "flight") return "flights";
  if (kind === "stay") return "stays";
  if (kind === "car") return "cars";
  return "packages";
}
