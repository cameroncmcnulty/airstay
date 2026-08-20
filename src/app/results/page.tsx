"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  ExternalLink,
  BookmarkPlus,
  BookmarkCheck,
  CalendarDays,
  Users,
  MapPin,
  Plane,
  Moon,
  Star,
  UtensilsCrossed,
  Waves,
  Sparkles,
  Baby,
  Wine,
  Clock,
  Hotel,
} from "lucide-react";
import { paramsToQuery, buildPartnerOffers, cad, cadFr, type PartnerOffer } from "@/lib/deeplinks";
import { getAirport, getDestination } from "@/lib/airports";
import { DEST_PHOTOS } from "@/lib/deals";
import { useApp } from "@/context/AppContext";
import { currentUser, updateUser } from "@/lib/auth";
import type { LiveOffer } from "@/lib/live-search";
import type { PackageOffer } from "@/lib/packages";
import { nightsBetween } from "@/data/resorts";

type Leaving = PartnerOffer | LiveOffer | PackageOffer;

export default function ResultsPage() {
  return (
    <Suspense fallback={<div className="px-4 py-16 text-center text-navy/60">…</div>}>
      <ResultsInner />
    </Suspense>
  );
}

function ResultsInner() {
  const sp = useSearchParams();
  const q = useMemo(() => paramsToQuery(sp), [sp]);
  const partners = useMemo(() => buildPartnerOffers(q), [q]);
  const { m, locale, refreshUser } = useApp();
  const [leaving, setLeaving] = useState<Leaving | null>(null);
  const [saved, setSaved] = useState(false);
  const [live, setLive] = useState<LiveOffer[]>([]);
  const [packages, setPackages] = useState<PackageOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "family" | "adults" | "luxury">("all");

  const origin = q.from ? getAirport(q.from) : undefined;
  const dest = q.to ? getDestination(q.to) : undefined;
  const destName = dest ? (locale === "fr" ? dest.cityFr : dest.city) : q.toCity || q.to || "";
  const originName = origin ? `${locale === "fr" ? origin.cityFr : origin.city}` : q.from || "";
  const destPhoto = (q.to && DEST_PHOTOS[q.to]) || DEST_PHOTOS.CUN;
  const nights = nightsBetween(q.depart, q.returnDate);
  const showPackages = q.kind === "packages" || q.kind === "stays";
  const showFlights = q.kind === "flights" || q.kind === "packages";

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch(`/api/search?${sp.toString()}`)
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        setLive(Array.isArray(data.live) ? data.live : []);
        setPackages(Array.isArray(data.packages) ? data.packages : []);
      })
      .catch(() => {
        if (cancelled) return;
        setLive([]);
        setPackages([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [sp]);

  const visiblePackages = packages.filter((p) => filter === "all" || p.vibe === filter);

  function save() {
    const u = currentUser();
    if (!u) {
      window.location.href = "/signup";
      return;
    }
    updateUser(u.id, {
      savedSearches: [
        {
          id: crypto.randomUUID(),
          label: `${originName || destName} → ${destName} · ${q.depart}`,
          href: `/results?${sp.toString()}`,
          createdAt: new Date().toISOString(),
        },
        ...u.savedSearches,
      ].slice(0, 20),
    });
    setSaved(true);
    refreshUser();
  }

  function go(offer: Leaving) {
    const u = currentUser();
    const name = "partner" in offer ? offer.partner : "name" in offer ? offer.name : offer.title;
    if (u) {
      updateUser(u.id, {
        clicks: [{ partner: name, url: offer.url, at: new Date().toISOString() }, ...u.clicks].slice(0, 30),
      });
      refreshUser();
    }
    window.open(offer.url, "_blank", "noopener,noreferrer");
    setLeaving(null);
  }

  function stopsLabel(n?: number) {
    if (n == null) return "";
    if (n === 0) return m.results.nonstop;
    if (n === 1) return m.results.stops.replace("{n}", "1");
    return m.results.stopsPlural.replace("{n}", String(n));
  }

  function leavingName(offer: Leaving) {
    if ("partner" in offer) return offer.partner;
    if ("name" in offer) return offer.name;
    return offer.airlineName || offer.title;
  }

  return (
    <div className="pb-16">
      <section className="relative overflow-hidden bg-navy">
        <img src={destPhoto} alt="" className="absolute inset-0 h-full w-full object-cover opacity-35" />
        <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/85 to-navy/55" />
        <div className="relative mx-auto max-w-6xl px-4 py-10 text-white">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-200">
            {q.kind === "packages" ? m.nav.packages : q.kind === "stays" ? m.nav.stays : q.kind === "cars" ? m.nav.cars : m.nav.flights}
          </p>
          <h1 className="mt-2 text-3xl font-black md:text-4xl">
            {q.kind === "stays" || q.kind === "cars" ? destName : `${originName} → ${destName}`}
          </h1>
          <div className="mt-5 flex flex-wrap gap-2">
            {q.depart && (
              <MetaChip icon={CalendarDays}>
                {q.depart}
                {q.returnDate ? ` – ${q.returnDate}` : ""}
              </MetaChip>
            )}
            <MetaChip icon={Moon}>{m.results.nights.replace("{n}", String(nights))}</MetaChip>
            <MetaChip icon={Users}>
              {q.adults} {m.search.adults}
              {q.children ? ` · ${q.children} ${m.search.children}` : ""}
            </MetaChip>
            {q.from && q.kind !== "stays" && q.kind !== "cars" && <MetaChip icon={Plane}>{origin?.code || q.from}</MetaChip>}
            {destName && <MetaChip icon={MapPin}>{destName}</MetaChip>}
          </div>
          <button
            type="button"
            onClick={save}
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-bold text-white ring-1 ring-white/20 hover:bg-white/25"
          >
            {saved ? <BookmarkCheck className="h-4 w-4" /> : <BookmarkPlus className="h-4 w-4" />}
            {saved ? m.results.saved : m.results.save}
          </button>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4">
        {showPackages && (
          <section className="mt-10">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 className="text-2xl font-extrabold text-navy">{m.results.packagesTitle}</h2>
                <p className="mt-1 max-w-2xl text-sm text-navy/60">{m.results.packagesSub}</p>
              </div>
              {packages.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {(
                    [
                      ["all", m.results.allInclusive],
                      ["family", m.results.family],
                      ["adults", m.results.adultsOnly],
                      ["luxury", m.results.luxury],
                    ] as const
                  ).map(([id, label]) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setFilter(id)}
                      className={`rounded-full px-3 py-1.5 text-xs font-bold ${
                        filter === id ? "bg-navy text-white" : "bg-white text-navy ring-1 ring-navy/10"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {loading && <p className="mt-6 text-sm font-semibold text-sky-800">{m.results.loadingPackages}</p>}
            {!loading && packages.length === 0 && (
              <p className="mt-6 rounded-2xl bg-mist px-4 py-3 text-sm text-navy/70">{m.results.noPackages}</p>
            )}
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              {visiblePackages.map((p) => (
                <article key={p.id} className="overflow-hidden rounded-card bg-white shadow-card ring-1 ring-navy/5">
                  <div className="relative h-56">
                    <img
                      src={p.image}
                      alt={locale === "fr" ? p.imageAltFr : p.imageAlt}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/20 to-transparent" />
                    <span className="absolute left-3 top-3 rounded-full bg-sky px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
                      {m.results.allInclusive}
                    </span>
                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <div className="flex items-center gap-1 text-amber-300">
                        {Array.from({ length: p.stars }).map((_, i) => (
                          <Star key={i} className="h-3.5 w-3.5 fill-current" />
                        ))}
                      </div>
                      <h3 className="mt-1 text-xl font-black">{p.name}</h3>
                      <p className="flex items-center gap-1 text-sm text-white/80">
                        <MapPin className="h-3.5 w-3.5" />
                        {locale === "fr" ? p.areaFr : p.area}
                      </p>
                    </div>
                  </div>
                  <div className="p-5">
                    <p className="text-sm leading-relaxed text-navy/70">{locale === "fr" ? p.blurbFr : p.blurb}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Amenity icon={UtensilsCrossed} label={m.results.allInclusive} />
                      {p.amenities.includes("beach") && <Amenity icon={Waves} label={locale === "fr" ? "Plage" : "Beach"} />}
                      {p.amenities.includes("pools") && <Amenity icon={Hotel} label={locale === "fr" ? "Piscines" : "Pools"} />}
                      {p.amenities.includes("spa") && <Amenity icon={Sparkles} label="Spa" />}
                      {p.amenities.includes("kids") && <Amenity icon={Baby} label={m.results.family} />}
                      {p.amenities.includes("adults") && <Amenity icon={Wine} label={m.results.adultsOnly} />}
                      <Amenity icon={Moon} label={m.results.nights.replace("{n}", String(p.nights))} />
                    </div>
                    <div className="mt-5 flex flex-wrap items-end justify-between gap-3">
                      <div>
                        {p.flightFromCad ? (
                          <>
                            <p className="text-xs font-semibold text-navy/45">{m.results.flightsFrom}</p>
                            <p className="text-2xl font-black text-navy">
                              {locale === "fr" ? cadFr(p.flightFromCad) : cad(p.flightFromCad)}
                              <span className="ml-1 text-sm font-semibold text-navy/50">{m.results.perPerson}</span>
                            </p>
                          </>
                        ) : (
                          <p className="text-sm font-bold text-navy">{m.results.seeLive}</p>
                        )}
                      </div>
                      <div className="flex flex-wrap justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setLeaving({ ...p, url: p.googleUrl })}
                          className="inline-flex items-center gap-2 rounded-full bg-sky px-4 py-2.5 text-sm font-bold text-white shadow-lift"
                        >
                          {m.results.liveStay}
                          <ExternalLink className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setLeaving(p)}
                          className="rounded-full border border-navy/15 px-4 py-2.5 text-sm font-bold text-navy"
                        >
                          {m.results.viewPackage}
                        </button>
                      </div>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <button type="button" className="text-xs font-bold text-sky-800 underline" onClick={() => setLeaving({ ...p, url: p.kayakUrl })}>
                        {m.results.kayak}
                      </button>
                      <button type="button" className="text-xs font-bold text-sky-800 underline" onClick={() => setLeaving({ ...p, url: p.bookingUrl })}>
                        {m.results.booking}
                      </button>
                      <button type="button" className="text-xs font-bold text-sky-800 underline" onClick={() => setLeaving({ ...p, url: p.sunwingUrl })}>
                        {m.results.sunwing}
                      </button>
                      {p.flightsUrl && (
                        <button type="button" className="text-xs font-bold text-sky-800 underline" onClick={() => setLeaving({ ...p, url: p.flightsUrl as string })}>
                          {m.results.liveFlights}
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {showFlights && (
          <section className="mt-12">
            <h2 className="text-2xl font-extrabold text-navy">{m.results.liveTitle}</h2>
            <p className="mt-1 text-sm text-navy/60">{m.results.liveSub}</p>
            {loading && <p className="mt-4 text-sm font-semibold text-sky-800">{m.results.loading}</p>}
            {!loading && live.length === 0 && (
              <p className="mt-4 rounded-2xl bg-mist px-4 py-3 text-sm text-navy/70">{m.results.liveEmpty}</p>
            )}
            <ul className="mt-5 space-y-4">
              {live.map((o) => (
                <li key={o.id} className="overflow-hidden rounded-card bg-white shadow-card ring-1 ring-navy/5 md:flex">
                  <div className="relative h-40 w-full shrink-0 md:h-auto md:w-56">
                    <img src={destPhoto} alt="" className="h-full w-full object-cover" />
                    <span className="absolute left-3 top-3 rounded-full bg-sky px-2.5 py-1 text-[10px] font-bold uppercase text-white">
                      Live
                    </span>
                  </div>
                  <div className="flex flex-1 flex-wrap items-center justify-between gap-4 p-5">
                    <div>
                      <h3 className="text-lg font-black text-navy">{o.airlineName || o.title}</h3>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {o.flightNumber && (
                          <Amenity icon={Plane} label={`${o.airline || ""}${o.flightNumber}`} />
                        )}
                        {o.departAt && (
                          <Amenity
                            icon={CalendarDays}
                            label={new Date(o.departAt).toLocaleDateString(locale === "fr" ? "fr-CA" : "en-CA", {
                              month: "short",
                              day: "numeric",
                            })}
                          />
                        )}
                        {o.stops != null && <Amenity icon={MapPin} label={stopsLabel(o.stops)} />}
                        {o.durationMin ? (
                          <Amenity icon={Clock} label={m.results.duration.replace("{n}", String(Math.round(o.durationMin / 60)))} />
                        ) : null}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-xs font-semibold text-navy/45">{m.results.advertised}</p>
                        <p className="text-2xl font-black text-navy">{locale === "fr" ? cadFr(o.priceCad) : cad(o.priceCad)}</p>
                        <p className="text-[11px] text-navy/45">{m.results.cadNote}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setLeaving(o)}
                        className="inline-flex items-center gap-2 rounded-full bg-sky px-4 py-3 text-sm font-bold text-white shadow-lift"
                      >
                        {m.results.bookLive}
                        <ExternalLink className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}

        <h2 className="mt-12 text-2xl font-extrabold text-navy">{m.results.partnersTitle}</h2>
        <p className="mt-2 rounded-2xl bg-sky-50 px-4 py-3 text-sm text-navy/75">{m.partners.note}</p>
        <ul className="mt-4 grid gap-3 md:grid-cols-2">
          {partners.map((o) => (
            <li key={o.id} className="flex items-center justify-between gap-4 rounded-card bg-white p-5 shadow-card ring-1 ring-navy/5">
              <div>
                <p className="text-lg font-black text-navy">{o.partner}</p>
                <p className="text-sm text-navy/55">{locale === "fr" ? o.taglineFr : o.tagline}</p>
              </div>
              <button
                type="button"
                onClick={() => setLeaving(o)}
                className="inline-flex items-center gap-2 rounded-full bg-navy px-4 py-2.5 text-sm font-bold text-white"
              >
                {m.results.seeLive}
                <ExternalLink className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      </div>

      {leaving && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-navy/50 p-4" role="dialog" aria-modal="true">
          <div className="w-full max-w-md rounded-card bg-white p-6 shadow-card">
            <h2 className="text-xl font-black text-navy">{m.results.leaving}</h2>
            <p className="mt-2 text-sm leading-relaxed text-navy/70">{m.results.leavingBody}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              <button type="button" className="rounded-full bg-sky px-4 py-2.5 text-sm font-bold text-white" onClick={() => go(leaving)}>
                {m.results.continue.replace("{partner}", leavingName(leaving))}
              </button>
              <button
                type="button"
                className="rounded-full border border-navy/15 px-4 py-2.5 text-sm font-bold text-navy"
                onClick={() => setLeaving(null)}
              >
                {m.results.stay}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MetaChip({ icon: Icon, children }: { icon: typeof CalendarDays; children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-sm font-semibold ring-1 ring-white/15">
      <Icon className="h-3.5 w-3.5" />
      {children}
    </span>
  );
}

function Amenity({ icon: Icon, label }: { icon: typeof Star; label: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-mist px-2.5 py-1 text-[11px] font-bold text-navy/80">
      <Icon className="h-3.5 w-3.5 text-sky" />
      {label}
    </span>
  );
}
