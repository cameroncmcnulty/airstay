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
  Clock,
  ShieldCheck,
  Car,
  Building2,
} from "lucide-react";
import { paramsToQuery, cad, cadFr } from "@/lib/deeplinks";
import { getAirport, getDestination } from "@/lib/airports";
import { DEST_PHOTOS } from "@/lib/deals";
import { useApp } from "@/context/AppContext";
import { currentUser, updateUser } from "@/lib/auth";
import { rankOffers, type LiveOffer } from "@/lib/live-search";
import { nightsBetween, partnerFavicon } from "@/lib/partners";
import { SearchWidget } from "@/components/SearchWidget";

type Leaving = LiveOffer;

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
  const { m, locale, refreshUser } = useApp();
  const [leaving, setLeaving] = useState<Leaving | null>(null);
  const [saved, setSaved] = useState(false);
  const [live, setLive] = useState<LiveOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState<"best" | "price" | "fast">("best");

  const origin = q.from ? getAirport(q.from) : undefined;
  const dest = q.to ? getDestination(q.to) : undefined;
  const destName = dest ? (locale === "fr" ? dest.cityFr : dest.city) : q.toCity || q.to || "";
  const originName = origin ? `${locale === "fr" ? origin.cityFr : origin.city}` : q.from || "";
  const destPhoto = (q.to && DEST_PHOTOS[q.to]) || DEST_PHOTOS.LHR || DEST_PHOTOS.CUN;
  const nights = nightsBetween(q.depart, q.returnDate);
  const money = (n: number) => (locale === "fr" ? cadFr(n) : cad(n));

  const ranked = useMemo(() => rankOffers(live), [live]);
  const list = useMemo(() => {
    const rows = ranked.ranked;
    if (sort === "price") return [...rows].sort((a, b) => (a.priceCad || 0) - (b.priceCad || 0));
    if (sort === "fast") {
      return [...rows].sort((a, b) => {
        const da = a.durationMin ?? (a.stops == null ? 9999 : 180 + a.stops * 140);
        const db = b.durationMin ?? (b.stops == null ? 9999 : 180 + b.stops * 140);
        return da - db || (a.priceCad || 0) - (b.priceCad || 0);
      });
    }
    return rows;
  }, [ranked, sort]);

  useEffect(() => {
    setSaved(false);
    let cancelled = false;
    setLoading(true);
    fetch(`/api/search?${sp.toString()}`)
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        setLive(Array.isArray(data.live) ? data.live : []);
      })
      .catch(() => {
        if (!cancelled) setLive([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [sp]);

  useEffect(() => {
    if (!leaving) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setLeaving(null);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [leaving]);

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
    const name = offer.partner || offer.airlineName || offer.title;
    if (u) {
      updateUser(u.id, {
        clicks: [{ partner: name, url: offer.url, at: new Date().toISOString() }, ...u.clicks].slice(0, 30),
      });
      refreshUser();
    }
    fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "outbound",
        kind: q.kind,
        origin: q.from,
        destination: q.to,
        destCity: destName,
        destCountry: dest ? (locale === "fr" ? dest.countryFr : dest.country) : undefined,
        partner: name,
        depart: q.depart,
        returnDate: q.returnDate,
      }),
    }).catch(() => undefined);
    window.open(offer.url, "_blank", "noopener,noreferrer");
    setLeaving(null);
  }

  function leavingName(offer: Leaving) {
    return offer.partner || offer.airlineName || offer.title;
  }

  function stopsLabel(n?: number) {
    if (n == null) return "";
    if (n === 0) return m.results.nonstop;
    if (n === 1) return m.results.stops.replace("{n}", "1");
    return m.results.stopsPlural.replace("{n}", String(n));
  }

  const kindIcon = q.kind === "cars" ? Car : q.kind === "stays" ? Building2 : Plane;
  const KindIcon = kindIcon;
  const headline =
    q.kind === "stays" || q.kind === "cars" ? destName || m.results.title : `${originName || "—"} → ${destName || "—"}`;

  return (
    <div className="pb-20">
      <section className="relative overflow-hidden bg-navy">
        <img src={destPhoto} alt="" className="absolute inset-0 h-full w-full object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/88 to-navy/60" />
        <div className="relative mx-auto max-w-6xl px-4 py-8 text-white sm:py-10">
          <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-sky-200">
            <KindIcon className="h-3.5 w-3.5" />
            {q.kind === "stays" ? m.nav.stays : q.kind === "cars" ? m.nav.cars : m.nav.flights}
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-tight md:text-5xl">{headline}</h1>
          {dest && (
            <p className="mt-1 text-sm text-white/70">{locale === "fr" ? dest.countryFr : dest.country}</p>
          )}
          <div className="mt-5 flex flex-wrap gap-2">
            {q.depart && (
              <MetaChip icon={CalendarDays}>
                {q.depart}
                {q.returnDate ? ` – ${q.returnDate}` : ""}
              </MetaChip>
            )}
            {q.kind === "cars" ? (
              <MetaChip icon={Car}>{m.results.days.replace("{n}", String(nights))}</MetaChip>
            ) : (
              <MetaChip icon={Moon}>{m.results.nights.replace("{n}", String(nights))}</MetaChip>
            )}
            <MetaChip icon={Users}>
              {q.adults} {m.search.adults}
              {q.children ? ` · ${q.children} ${m.search.children}` : ""}
            </MetaChip>
            {q.from && q.kind === "flights" && <MetaChip icon={Plane}>{origin?.code || q.from}</MetaChip>}
            {destName && <MetaChip icon={MapPin}>{destName}</MetaChip>}
          </div>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={save}
              className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-bold text-white ring-1 ring-white/20 hover:bg-white/25"
            >
              {saved ? <BookmarkCheck className="h-4 w-4" /> : <BookmarkPlus className="h-4 w-4" />}
              {saved ? m.results.saved : m.results.save}
            </button>
            <span className="text-xs font-semibold text-sky-100/90">{m.results.prefilled}</span>
          </div>
        </div>
      </section>

      <div className="relative z-20 mx-auto -mt-6 max-w-6xl px-3 sm:-mt-8 sm:px-4">
        <div className="rounded-[1.6rem] bg-white p-3 shadow-card ring-1 ring-navy/5 sm:p-5">
          <SearchWidget key={sp.toString()} kind={q.kind} hideTabs embedded initial={q} />
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4">
        <div className="mt-8 flex flex-wrap items-center gap-3 rounded-2xl bg-navy px-4 py-3 text-white">
          <ShieldCheck className="h-5 w-5 text-sky-200" />
          <p className="text-sm font-semibold">{m.results.trust}</p>
        </div>

        <section className="mt-10">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-2xl font-extrabold text-navy">{m.results.rankedTitle}</h2>
              <p className="mt-1 text-sm text-navy/60">{m.results.rankedSub}</p>
            </div>
            {list.length > 1 && (
              <div className="flex rounded-full bg-mist p-1 text-xs font-bold">
                {(["best", "price", "fast"] as const).map((key) => (
                  <button
                    key={key}
                    type="button"
                    className={`rounded-full px-3 py-1.5 ${sort === key ? "bg-white text-navy shadow-sm" : "text-navy/55"}`}
                    onClick={() => setSort(key)}
                  >
                    {key === "best" ? m.results.sortBest : key === "price" ? m.results.sortPrice : m.results.sortFast}
                  </button>
                ))}
              </div>
            )}
          </div>
          {loading && <SkeletonList />}
          {!loading && list.length === 0 && (
            <p className="mt-4 rounded-2xl bg-mist px-4 py-3 text-sm text-navy/70">{m.results.noPrice}</p>
          )}
          <ul className="mt-5 space-y-4">
            {list.map((o, i) => (
              <li key={o.id}>
                <RankedCard
                  offer={o}
                  rank={i + 1}
                  badges={{
                    best: o.id === ranked.bestId,
                    cheap: o.id === ranked.cheapestId,
                    fast: o.id === ranked.fastestId,
                  }}
                  locale={locale}
                  money={money}
                  m={m}
                  stopsLabel={stopsLabel}
                  onOpen={() => setLeaving(o)}
                />
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-14 grid gap-4 md:grid-cols-3">
          {[
            { t: m.results.how1t, d: m.results.how1d, n: "01" },
            { t: m.results.how2t, d: m.results.how2d, n: "02" },
            { t: m.results.how3t, d: m.results.how3d, n: "03" },
          ].map((s) => (
            <div key={s.n} className="rounded-card bg-white p-5 shadow-card ring-1 ring-navy/5">
              <p className="text-xs font-black tracking-[0.2em] text-sky-700">{s.n}</p>
              <h3 className="mt-2 font-extrabold text-navy">{s.t}</h3>
              <p className="mt-1 text-sm leading-relaxed text-navy/60">{s.d}</p>
            </div>
          ))}
        </section>
      </div>

      {leaving && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-navy/55 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          onClick={(e) => {
            if (e.target === e.currentTarget) setLeaving(null);
          }}
        >
          <div className="w-full max-w-md rounded-card bg-white p-6 shadow-card">
            <div className="flex items-center gap-3">
              {leaving.domain && (
                <img src={partnerFavicon(leaving.domain)} alt="" className="h-10 w-10 rounded-xl ring-1 ring-navy/10" />
              )}
              <div>
                <h2 className="text-xl font-black text-navy">{m.results.leaving}</h2>
                <p className="text-sm font-semibold text-navy/50">{leavingName(leaving)}</p>
              </div>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-navy/70">
              {m.results.leavingBody.replace("{partner}", leavingName(leaving))}
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <button type="button" className="btn-primary" onClick={() => go(leaving)}>
                {m.results.continue.replace("{partner}", leavingName(leaving))}
              </button>
              <button type="button" className="btn-ghost" onClick={() => setLeaving(null)}>
                {m.results.stay}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function RankedCard({
  offer,
  rank,
  badges,
  locale,
  money,
  m,
  stopsLabel,
  onOpen,
}: {
  offer: LiveOffer;
  rank: number;
  badges: { best: boolean; cheap: boolean; fast: boolean };
  locale: "en" | "fr";
  money: (n: number) => string;
  m: ReturnType<typeof useApp>["m"];
  stopsLabel: (n?: number) => string;
  onOpen: () => void;
}) {
  return (
    <article
      className={`overflow-hidden rounded-card bg-white shadow-card ring-1 transition hover:-translate-y-0.5 hover:shadow-lift ${
        badges.best ? "ring-sky ring-2" : "ring-navy/5"
      }`}
    >
      <div className="flex flex-col md:flex-row">
        <div className="flex items-center gap-4 border-b border-navy/5 p-5 md:w-56 md:flex-col md:items-start md:border-b-0 md:border-r md:bg-mist/60">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-navy text-sm font-black text-white">
            {rank}
          </span>
          {offer.airlineLogo ? (
            <img src={offer.airlineLogo} alt="" className="h-12 w-12 rounded-2xl bg-white object-contain ring-1 ring-navy/10" />
          ) : offer.domain ? (
            <img src={partnerFavicon(offer.domain)} alt="" className="h-12 w-12 rounded-2xl bg-white object-contain p-1 ring-1 ring-navy/10" />
          ) : (
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-navy text-white">
              <Plane className="h-5 w-5" />
            </span>
          )}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-sky-700">{m.results.liveFare}</p>
            <h3 className="text-lg font-black text-navy">{offer.airlineName || offer.title}</h3>
            {offer.airline && (
              <p className="text-xs font-semibold text-navy/45">
                {offer.airline}
                {offer.flightNumber || ""}
              </p>
            )}
          </div>
        </div>
        <div className="flex flex-1 flex-wrap items-center justify-between gap-4 p-5">
          <div>
            <div className="flex flex-wrap gap-1.5">
              {badges.best && <Badge tone="sky">{m.results.badgeBest}</Badge>}
              {badges.cheap && <Badge tone="navy">{m.results.badgeCheap}</Badge>}
              {badges.fast && <Badge tone="mist">{m.results.badgeFast}</Badge>}
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {offer.departAt && (
                <Amenity
                  icon={CalendarDays}
                  label={new Date(offer.departAt).toLocaleDateString(locale === "fr" ? "fr-CA" : "en-CA", {
                    month: "short",
                    day: "numeric",
                  })}
                />
              )}
              {offer.stops != null && <Amenity icon={MapPin} label={stopsLabel(offer.stops)} />}
              {offer.durationMin ? (
                <Amenity icon={Clock} label={m.results.duration.replace("{n}", String(Math.round(offer.durationMin / 60)))} />
              ) : null}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs font-semibold text-navy/45">{m.results.advertised}</p>
              <p className="text-3xl font-black tracking-tight text-navy">{money(offer.priceCad || 0)}</p>
              <p className="text-[11px] text-navy/45">{m.results.cadNote}</p>
            </div>
            <button type="button" onClick={onOpen} className="btn-primary">
              {m.results.bookLive}
              <ExternalLink className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

function Badge({ tone, children }: { tone: "sky" | "navy" | "mist"; children: React.ReactNode }) {
  const cls =
    tone === "sky"
      ? "bg-sky text-white"
      : tone === "navy"
        ? "bg-navy text-white"
        : "bg-mist text-navy ring-1 ring-navy/10";
  return <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wide ${cls}`}>{children}</span>;
}

function SkeletonList() {
  return (
    <ul className="mt-5 space-y-3">
      {[0, 1, 2].map((i) => (
        <li key={i} className="h-28 animate-pulse rounded-card bg-white/80 ring-1 ring-navy/5" />
      ))}
    </ul>
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

function Amenity({ icon: Icon, label }: { icon: typeof Plane; label: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-mist px-2.5 py-1 text-[11px] font-bold text-navy/80">
      <Icon className="h-3.5 w-3.5 text-sky" />
      {label}
    </span>
  );
}
