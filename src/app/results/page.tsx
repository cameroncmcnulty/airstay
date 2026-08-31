"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ExternalLink,
  BookmarkPlus,
  BookmarkCheck,
  CalendarDays,
  Users,
  MapPin,
  Plane,
  Moon,
  ShieldCheck,
  Car,
  Building2,
  Trophy,
  Smartphone,
  Banknote,
  Zap,
} from "lucide-react";
import { paramsToQuery, queryToParams, cad, cadFr } from "@/lib/deeplinks";
import { getAirport, getDestination } from "@/lib/airports";
import { DEST_PHOTOS } from "@/lib/deals";
import { useApp } from "@/context/AppContext";
import { currentUser, updateUser } from "@/lib/auth";
import { rankOffers, type FlightDateOption, type FlightDateSuggestions, type LiveOffer } from "@/lib/live-search";
import { formatBubble, nightsBetweenIso } from "@/lib/dates";
import { compareLinksFor, nightsBetween, partnerFavicon, PARTNER_META, type CompareLink } from "@/lib/partners";
import { SearchWidget } from "@/components/SearchWidget";
import { ConfettiHandoff } from "@/components/ConfettiHandoff";

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
  const router = useRouter();
  const q = useMemo(() => paramsToQuery(sp), [sp]);
  const { m, locale, refreshUser } = useApp();
  const [leaving, setLeaving] = useState<Leaving | null>(null);
  const [saved, setSaved] = useState(false);
  const [live, setLive] = useState<LiveOffer[]>([]);
  const [alts, setAlts] = useState<FlightDateSuggestions | null>(null);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState<"best" | "price" | "fast">("best");
  const [burst, setBurst] = useState<{ origin: { x: number; y: number; w: number; h: number } } | null>(null);

  const origin = q.from ? getAirport(q.from) : undefined;
  const dest = q.to ? getDestination(q.to) : undefined;
  const destName = dest ? (locale === "fr" ? dest.cityFr : dest.city) : q.toCity || q.to || "";
  const originName = origin ? `${locale === "fr" ? origin.cityFr : origin.city}` : q.from || "";
  const destPhoto = (q.to && DEST_PHOTOS[q.to]) || DEST_PHOTOS.LHR || DEST_PHOTOS.CUN;
  const nights = nightsBetween(q.depart, q.returnDate);
  const money = (n: number) => (locale === "fr" ? cadFr(n) : cad(n));

  const queryString = sp.toString();
  const extras = useMemo(() => live.filter((o) => !(o.priceCad && o.priceCad > 0)), [live]);
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
    setAlts(null);
    fetch(`/api/search?${queryString}`)
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        setLive(Array.isArray(data.live) ? data.live : []);
        setAlts(data.dateSuggestions || null);
      })
      .catch(() => {
        if (!cancelled) {
          setLive([]);
          setAlts(null);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [queryString]);

  useEffect(() => {
    if (!leaving) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setLeaving(null);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [leaving]);

  function applyAlt(opt: FlightDateOption) {
    const next = {
      ...q,
      depart: opt.depart,
      returnDate: q.trip === "oneway" ? undefined : opt.returnDate || q.returnDate,
    };
    router.push(`/results?${queryToParams(next)}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

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

  function trackOutbound(offer: Leaving) {
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
    setLeaving(null);
  }

  function startHandoff(e: React.MouseEvent<HTMLAnchorElement>, offer: Leaving) {
    e.preventDefault();
    const href = offer.url;
    window.open(href, "_blank", "noopener");
    trackOutbound(offer);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = e.currentTarget.getBoundingClientRect();
    setBurst({ origin: { x: r.left, y: r.top, w: r.width, h: r.height } });
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

  const kindIcon = q.kind === "cars" ? Car : q.kind === "stays" ? Building2 : q.kind === "esim" ? Smartphone : Plane;
  const KindIcon = kindIcon;
  const headline =
    q.kind === "esim"
      ? `${m.nav.esim} · ${dest ? (locale === "fr" ? dest.countryFr : dest.country) : destName || m.nav.esim}`
      : q.kind === "stays" || q.kind === "cars"
        ? destName || m.results.title
        : `${originName || "—"} → ${destName || "—"}`;

  return (
    <div className="pb-[calc(5.5rem+env(safe-area-inset-bottom))]">
      <section className="relative overflow-hidden bg-navy">
        <img src={destPhoto} alt="" className="absolute inset-0 h-full w-full object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/88 to-navy/60" />
        <div className="relative mx-auto max-w-6xl px-4 py-8 text-white sm:py-10">
          <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-sky-200">
            <KindIcon className="h-3.5 w-3.5" />
            {q.kind === "stays" ? m.nav.stays : q.kind === "cars" ? m.nav.cars : q.kind === "esim" ? m.nav.esim : m.nav.flights}
          </p>
          <h1 className="mt-2 text-[1.75rem] font-black tracking-tight sm:text-3xl md:text-5xl">{headline}</h1>
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
            {q.kind === "esim" ? (
              <MetaChip icon={Smartphone}>{m.results.validDays.replace("{n}", String(Math.max(1, nights)))}</MetaChip>
            ) : q.kind === "cars" ? (
              <MetaChip icon={Car}>{m.results.days.replace("{n}", String(nights))}</MetaChip>
            ) : (
              <MetaChip icon={Moon}>{m.results.nights.replace("{n}", String(nights))}</MetaChip>
            )}
            <MetaChip icon={Users}>
              {q.kind === "esim"
                ? `${q.adults} ${m.search.esims}`
                : `${q.adults} ${m.search.adults}${q.children ? ` · ${q.children} ${m.search.children}` : ""}`}
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
              {!loading && list.length > 0 && (
                <p className="mt-1 text-xs font-bold uppercase tracking-wide text-navy/40">
                  {m.results.showingN.replace("{n}", String(list.length))}
                </p>
              )}
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
                    {key === "best"
                      ? m.results.sortBest
                      : key === "price"
                        ? m.results.sortPrice
                        : q.kind === "esim"
                          ? m.results.badgeData
                          : m.results.sortFast}
                  </button>
                ))}
              </div>
            )}
          </div>
          {!loading && list.length > 0 && (
            <div className="mt-5 grid grid-cols-3 gap-2 sm:gap-3">
              <StatTile
                icon={Trophy}
                label={m.results.badgeBest}
                value={money(list.find((o) => o.id === ranked.bestId)?.priceCad || 0)}
                hint={list.find((o) => o.id === ranked.bestId)?.airlineName}
                accent
              />
              <StatTile
                icon={Banknote}
                label={m.results.badgeCheap}
                value={money(list.find((o) => o.id === ranked.cheapestId)?.priceCad || 0)}
                hint={list.find((o) => o.id === ranked.cheapestId)?.airlineName}
              />
              <StatTile
                icon={Zap}
                label={q.kind === "esim" ? m.results.badgeData : m.results.badgeFast}
                value={
                  q.kind === "esim"
                    ? list.find((o) => o.id === ranked.fastestId)?.unlimited
                      ? m.results.unlimited
                      : m.results.dataLabel.replace("{n}", String(list.find((o) => o.id === ranked.fastestId)?.dataGb || 0))
                    : prettyDuration(list.find((o) => o.id === ranked.fastestId)?.durationMin, list.find((o) => o.id === ranked.fastestId)?.stops)
                }
                hint={list.find((o) => o.id === ranked.fastestId)?.airlineName}
              />
            </div>
          )}
          {loading && <SkeletonList />}
          {!loading && list.length === 0 && extras.length > 0 && q.kind === "flights" && (
            <div className="mt-5">
              <h3 className="text-lg font-black text-navy">{m.results.liveBoardsTitle}</h3>
              <p className="mt-1 text-sm text-navy/60">{m.results.liveBoardsSub}</p>
              <ul className="mt-4 space-y-4">
                {extras.map((o, i) => (
                  <li key={o.id}>
                    <PartnerBoardCard
                      offer={o}
                      rank={i + 1}
                      locale={locale}
                      m={m}
                      q={q}
                      onHandoff={startHandoff}
                    />
                  </li>
                ))}
              </ul>
            </div>
          )}
          {!loading && list.length === 0 && extras.length === 0 && (
            <DateAltPanel q={q} alts={alts} locale={locale} money={money} m={m} onPick={applyAlt} />
          )}
          {!loading && list.length === 0 && extras.length > 0 && alts?.options?.length ? (
            <div className="mt-8">
              <DateAltPanel q={q} alts={alts} locale={locale} money={money} m={m} onPick={applyAlt} />
            </div>
          ) : null}
          <ul className="mt-5 space-y-4">
            {list.map((o, i) => (
              <li key={o.id}>
                {i === 3 && (
                  <p className="mb-3 pt-2 text-xs font-bold uppercase tracking-[0.16em] text-navy/40">
                    {m.results.otherOptions}
                  </p>
                )}
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
                  onCompare={(link) =>
                    setLeaving({
                      ...o,
                      id: `${o.id}-${link.key}`,
                      partner: link.name,
                      title: link.name,
                      partnerKey: link.key,
                      domain: PARTNER_META[link.key].domain,
                      url: link.url,
                      priceCad: link.priceCad || o.priceCad,
                    })
                  }
                  cheapestPrice={list.find((x) => x.id === ranked.cheapestId)?.priceCad || 0}
                  wantedDepart={q.depart}
                  query={q}
                />
              </li>
            ))}
          </ul>
          {extras.length > 0 && list.length > 0 && (
            <div className="mt-8">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-navy/40">{m.results.alsoCompare}</p>
              <ul className="mt-3 grid gap-3 sm:grid-cols-3">
                {extras.map((o) => (
                  <li key={o.id}>
                    <button
                      type="button"
                      onClick={() => setLeaving(o)}
                      className="flex w-full items-center justify-between rounded-2xl bg-white px-4 py-3 text-left shadow-sm ring-1 ring-navy/8 hover:shadow-lift"
                    >
                      <span>
                        <span className="block text-sm font-extrabold text-navy">{o.partner || o.title}</span>
                        <span className="text-[11px] font-semibold text-navy/50">
                          {locale === "fr" ? o.taglineFr : o.tagline}
                        </span>
                      </span>
                      <ExternalLink className="h-4 w-4 text-sky" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
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

      {burst && (
        <ConfettiHandoff origin={burst.origin} onDone={() => setBurst(null)} />
      )}
      {leaving && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-navy/55 p-3 backdrop-blur-sm sm:p-4"
          role="dialog"
          aria-modal="true"
          onClick={(e) => {
            if (e.target === e.currentTarget) setLeaving(null);
          }}
        >
          <div className="max-h-[min(92dvh,40rem)] w-full max-w-md overflow-y-auto rounded-card bg-white p-5 shadow-card sm:p-6">
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
              <a
                className="btn-primary"
                href={leaving.url}
                target="_blank"
                rel="noopener"
                onClick={(e) => startHandoff(e, leaving)}
              >
                {m.results.continue.replace("{partner}", leavingName(leaving))}
              </a>
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

function PartnerBoardCard({
  offer,
  rank,
  locale,
  m,
  q,
  onHandoff,
}: {
  offer: LiveOffer;
  rank: number;
  locale: "en" | "fr";
  m: ReturnType<typeof useApp>["m"];
  q: ReturnType<typeof paramsToQuery>;
  onHandoff: (e: React.MouseEvent<HTMLAnchorElement>, offer: LiveOffer) => void;
}) {
  const loc = locale === "fr" ? "fr-CA" : "en-CA";
  const when = [q.depart && formatBubble(q.depart, loc), q.returnDate && formatBubble(q.returnDate, loc)]
    .filter(Boolean)
    .join(" – ");
  return (
    <article
      className={`overflow-hidden rounded-[1.4rem] bg-white shadow-card ring-1 transition hover:-translate-y-0.5 hover:shadow-lift ${
        rank === 1 ? "ring-2 ring-sky" : "ring-navy/8"
      }`}
    >
      {rank === 1 && (
        <div className="bg-sky px-5 py-1.5 text-[11px] font-black uppercase tracking-[0.16em] text-white">
          {m.results.seeLiveFares}
        </div>
      )}
      <div className="flex flex-col gap-4 p-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 flex-1 items-start gap-4">
          <span
            className={`grid h-11 w-11 shrink-0 place-items-center rounded-full text-sm font-black ${
              rank === 1 ? "bg-sky text-white" : "bg-mist text-navy"
            }`}
          >
            {rank}
          </span>
          {offer.domain ? (
            <img src={partnerFavicon(offer.domain)} alt="" className="h-12 w-12 rounded-2xl bg-white object-contain ring-1 ring-navy/10" />
          ) : (
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-navy text-white">
              <Plane className="h-5 w-5" />
            </span>
          )}
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-lg font-black text-navy">{offer.partner || offer.title}</h3>
            <p className="mt-0.5 text-sm font-semibold text-navy/55">{locale === "fr" ? offer.taglineFr : offer.tagline}</p>
            <p className="mt-2 text-sm font-bold text-navy">
              {q.from} → {q.to}
              {when ? ` · ${when}` : ""}
            </p>
          </div>
        </div>
        <div className="flex items-center justify-between gap-4 lg:flex-col lg:items-end">
          <p className="text-sm font-bold text-navy/50">{m.results.onSite}</p>
          <a
            href={offer.url}
            target="_blank"
            rel="noopener"
            onClick={(e) => onHandoff(e, offer)}
            className="btn-primary shrink-0"
          >
            {m.results.seeLiveFares}
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </div>
    </article>
  );
}

function DateAltPanel({
  q,
  alts,
  locale,
  money,
  m,
  onPick,
}: {
  q: ReturnType<typeof paramsToQuery>;
  alts: FlightDateSuggestions | null;
  locale: "en" | "fr";
  money: (n: number) => string;
  m: ReturnType<typeof useApp>["m"];
  onPick: (opt: FlightDateOption) => void;
}) {
  const loc = locale === "fr" ? "fr-CA" : "en-CA";
  const departOpts = alts?.options?.filter((o) => o.change === "depart") || [];
  const returnOpts = alts?.options?.filter((o) => o.change === "return") || [];
  const bothOpts = alts?.options?.filter((o) => o.change === "both") || [];
  const hasAlts = Boolean(departOpts.length || returnOpts.length || bothOpts.length);
  const groupCount = [departOpts, returnOpts, bothOpts].filter((g) => g.length).length;
  const title =
    groupCount > 1
      ? m.results.altDatesTitle
      : departOpts.length
        ? m.results.altDepartTitle
        : returnOpts.length
          ? m.results.altReturnTitle
          : m.results.altBothTitle;

  return (
    <div className="mt-4 overflow-hidden rounded-[1.4rem] bg-mist ring-1 ring-navy/8">
      <div className="px-5 py-4 sm:px-6">
        <p className="text-sm font-semibold text-navy/70">{m.results.altDatesTitle}</p>
        {hasAlts ? (
          <>
            <h3 className="mt-2 text-lg font-black text-navy">{title}</h3>
            <p className="mt-1 text-sm text-navy/55">{m.results.altDatesSub}</p>
          </>
        ) : q.kind === "flights" ? (
          <p className="mt-2 text-sm font-semibold text-navy/70">{m.results.altNoRoute}</p>
        ) : null}
      </div>
      {hasAlts && (
        <div className="space-y-5 border-t border-navy/8 bg-white px-5 py-5 sm:px-6">
          {departOpts.length > 0 && (
            <AltGroup
              label={m.results.altChangeDepart}
              hint={q.returnDate ? m.results.altKeepReturn.replace("{date}", formatBubble(q.returnDate, loc)) : undefined}
              options={departOpts}
              locale={loc}
              money={money}
              m={m}
              onPick={onPick}
            />
          )}
          {returnOpts.length > 0 && (
            <AltGroup
              label={m.results.altChangeReturn}
              hint={q.depart ? m.results.altKeepDepart.replace("{date}", formatBubble(q.depart, loc)) : undefined}
              options={returnOpts}
              locale={loc}
              money={money}
              m={m}
              onPick={onPick}
            />
          )}
          {bothOpts.length > 0 && (
            <AltGroup
              label={m.results.altChangeBoth}
              options={bothOpts}
              locale={loc}
              money={money}
              m={m}
              onPick={onPick}
            />
          )}
        </div>
      )}
    </div>
  );
}

function AltGroup({
  label,
  hint,
  options,
  locale,
  money,
  m,
  onPick,
}: {
  label: string;
  hint?: string;
  options: FlightDateOption[];
  locale: string;
  money: (n: number) => string;
  m: ReturnType<typeof useApp>["m"];
  onPick: (opt: FlightDateOption) => void;
}) {
  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-2">
        <p className="text-xs font-black uppercase tracking-[0.16em] text-navy/45">{label}</p>
        {hint && <p className="text-xs font-semibold text-navy/45">{hint}</p>}
      </div>
      <ul className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {options.map((opt) => {
          const nights = opt.returnDate ? nightsBetweenIso(opt.depart, opt.returnDate) : 0;
          const labelText =
            opt.change === "return" && opt.returnDate
              ? formatBubble(opt.returnDate, locale)
              : opt.change === "both" && opt.returnDate
                ? `${formatBubble(opt.depart, locale)} – ${formatBubble(opt.returnDate, locale)}`
                : formatBubble(opt.depart, locale);
          return (
            <li key={`${opt.change}-${opt.depart}-${opt.returnDate || ""}`}>
              <button
                type="button"
                onClick={() => onPick(opt)}
                className="flex w-full flex-col items-start rounded-2xl bg-mist px-4 py-3 text-left ring-1 ring-navy/8 transition hover:-translate-y-0.5 hover:bg-white hover:ring-sky hover:shadow-lift"
              >
                <span className="inline-flex items-center gap-1.5 text-sm font-extrabold text-navy">
                  <CalendarDays className="h-3.5 w-3.5 text-sky" />
                  {labelText}
                </span>
                {opt.change === "both" && nights > 0 && (
                  <span className="mt-0.5 text-[11px] font-semibold text-navy/45">
                    {m.results.altNights.replace("{n}", String(nights))}
                  </span>
                )}
                <span className="mt-1 text-xs font-bold text-sky">
                  {m.results.altFromPrice.replace("{price}", money(opt.priceCad))}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
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
  onCompare,
  cheapestPrice,
  wantedDepart,
  query,
}: {
  offer: LiveOffer;
  rank: number;
  badges: { best: boolean; cheap: boolean; fast: boolean };
  locale: "en" | "fr";
  money: (n: number) => string;
  m: ReturnType<typeof useApp>["m"];
  stopsLabel: (n?: number) => string;
  onOpen: () => void;
  onCompare: (link: CompareLink) => void;
  cheapestPrice: number;
  wantedDepart?: string;
  query: ReturnType<typeof paramsToQuery>;
}) {
  const loc = locale === "fr" ? "fr-CA" : "en-CA";
  const extra = cheapestPrice && offer.priceCad && offer.priceCad > cheapestPrice ? offer.priceCad - cheapestPrice : 0;
  const offerDay = (offer.departAt || "").slice(0, 10);
  const nearby = Boolean(wantedDepart && offerDay && offerDay !== wantedDepart);
  return (
    <article
      className={`overflow-hidden rounded-[1.4rem] bg-white shadow-card transition hover:-translate-y-0.5 hover:shadow-lift ${
        badges.best ? "ring-2 ring-sky" : "ring-1 ring-navy/8"
      } ${rank > 3 ? "bg-white/90" : ""}`}
    >
      {badges.best && (
        <div className="bg-sky px-4 py-1.5 text-[11px] font-black uppercase tracking-[0.16em] text-white sm:px-5">
          {m.results.badgeBest}
        </div>
      )}
      <div className="flex flex-col gap-4 p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 flex-1 items-start gap-3 sm:gap-4">
          <span
            className={`grid h-11 w-11 shrink-0 place-items-center rounded-full text-sm font-black ${
              rank === 1 ? "bg-sky text-white" : "bg-mist text-navy"
            }`}
          >
            {rank}
          </span>
          {offer.airlineLogo ? (
            <img src={offer.airlineLogo} alt="" className="h-12 w-12 rounded-2xl bg-white object-contain ring-1 ring-navy/10" />
          ) : (
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-navy text-white">
              {offer.kind === "esim" ? <Smartphone className="h-5 w-5" /> : <Plane className="h-5 w-5" />}
            </span>
          )}
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="truncate text-lg font-black text-navy">{offer.airlineName || offer.title}</h3>
              {offer.flightNumber && (
                <span className="text-xs font-semibold text-navy/45">
                  {m.results.flightNo.replace("{n}", `${offer.airline || ""}${offer.flightNumber}`)}
                </span>
              )}
            </div>
            <div className="mt-1 flex flex-wrap gap-1.5">
              {badges.cheap && (
                <span className="inline-flex items-center gap-1 rounded-full bg-navy px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wide text-white">
                  <Banknote className="h-3 w-3" />
                  {m.results.badgeCheap}
                </span>
              )}
              {badges.fast && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-600 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wide text-white">
                  <Zap className="h-3 w-3" />
                  {offer.kind === "esim" ? m.results.badgeData : m.results.badgeFast}
                </span>
              )}
              {!badges.best && !badges.cheap && !badges.fast && (
                <span className="text-[10px] font-bold uppercase tracking-wide text-sky-700">{m.results.liveFare}</span>
              )}
              {nearby && (
                <span className="rounded-full bg-sky/15 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wide text-sky-700">
                  {m.results.nearbyDate}
                </span>
              )}
            </div>
            {offer.kind === "esim" ? (
              <EsimLine offer={offer} m={m} locale={locale} />
            ) : offer.kind === "stays" || offer.kind === "cars" || offer.kind === "packages" ? (
              <>
                <p className="mt-3 text-sm font-bold text-navy/60">
                  {offer.title}
                  {offer.departAt ? ` · ${offer.departAt}` : ""}
                  {offer.returnAt ? ` – ${offer.returnAt}` : ""}
                </p>
                <CompareBar
                  links={
                    offer.compare?.length
                      ? offer.compare
                      : compareLinksFor(
                          {
                            ...query,
                            depart: offerDay || query.depart,
                            returnDate: (offer.returnAt || "").slice(0, 10) || query.returnDate,
                          },
                          { aviasales: offer.priceCad }
                        )
                  }
                  money={money}
                  m={m}
                  onCompare={onCompare}
                />
              </>
            ) : (
              <>
                <FlightLine offer={offer} loc={loc} stopsLabel={stopsLabel} m={m} />
                <CompareBar
                  links={
                    offer.compare?.length
                      ? offer.compare
                      : compareLinksFor(
                          {
                            ...query,
                            depart: offerDay || query.depart,
                            returnDate: (offer.returnAt || "").slice(0, 10) || query.returnDate,
                          },
                          { aviasales: offer.priceCad }
                        )
                  }
                  money={money}
                  m={m}
                  onCompare={onCompare}
                />
              </>
            )}
          </div>
        </div>
        <div className="flex items-center justify-between gap-3 border-t border-navy/5 pt-4 lg:flex-col lg:items-end lg:border-0 lg:pt-0">
          <div className="lg:text-right">
            <p className="text-2xl font-black tracking-tight text-navy sm:text-3xl">{money(offer.priceCad || 0)}</p>
            <p className="text-[11px] font-semibold text-navy/45">
              {m.results.cadNote}
              {offer.priceUnit === "person" ? m.results.perAdult : offer.priceUnit === "plan" ? m.results.perPlan : ""}
            </p>
            {extra > 0 && (
              <p className="mt-0.5 text-[11px] font-semibold text-navy/40">{m.results.vsCheap.replace("{n}", money(extra))}</p>
            )}
          </div>
          <button type="button" onClick={onOpen} className="btn-primary min-h-11 shrink-0 px-5 sm:w-auto">
            {offer.kind === "esim" ? m.results.bookEsim : m.results.bookLive}
            <ExternalLink className="h-4 w-4" />
          </button>
        </div>
      </div>
    </article>
  );
}

function EsimLine({
  offer,
  m,
  locale,
}: {
  offer: LiveOffer;
  m: ReturnType<typeof useApp>["m"];
  locale: "en" | "fr";
}) {
  const data = offer.unlimited ? m.results.unlimited : m.results.dataLabel.replace("{n}", String(offer.dataGb || 0));
  const bits = (locale === "fr" ? offer.highlightsFr : offer.highlights) || [];
  return (
    <div className="mt-3">
      <p className="text-lg font-black text-navy">{data}</p>
      <p className="text-xs font-bold text-navy/50">
        {m.results.validDays.replace("{n}", String(offer.validityDays || 0))}
        {offer.operator ? ` · ${offer.operator}` : ""}
      </p>
      {offer.network && (
        <p className="mt-1 text-[11px] font-semibold text-navy/45">
          {m.results.network}: {offer.network}
        </p>
      )}
      {bits.length > 0 && <p className="mt-1 text-[11px] font-semibold text-navy/40">{bits.join(" · ")}</p>}
    </div>
  );
}

function FlightLine({
  offer,
  loc,
  stopsLabel,
  m,
}: {
  offer: LiveOffer;
  loc: string;
  stopsLabel: (n?: number) => string;
  m: ReturnType<typeof useApp>["m"];
}) {
  const from = offer.originAirport || "";
  const to = offer.destAirport || "";
  const departDay = (offer.departAt || "").slice(0, 10);
  const returnDay = (offer.returnAt || "").slice(0, 10);
  return (
    <div className="mt-3 min-w-0 max-w-lg space-y-3">
      <FlightLeg
        label={m.results.outbound}
        from={from}
        to={to}
        at={offer.departAt}
        arrive={offer.arriveAt}
        day={departDay}
        duration={offer.durationMin}
        stops={offer.stops}
        loc={loc}
        stopsLabel={stopsLabel}
      />
      {returnDay && (
        <FlightLeg
          label={m.results.inbound}
          from={to}
          to={from}
          at={offer.returnAt}
          day={returnDay}
          duration={offer.durationBack}
          stops={offer.returnStops}
          loc={loc}
          stopsLabel={stopsLabel}
        />
      )}
    </div>
  );
}

function FlightLeg({
  label,
  from,
  to,
  at,
  arrive,
  day,
  duration,
  stops,
  loc,
  stopsLabel,
}: {
  label: string;
  from: string;
  to: string;
  at?: string;
  arrive?: string;
  day?: string;
  duration?: number;
  stops?: number;
  loc: string;
  stopsLabel: (n?: number) => string;
}) {
  const departTime = clock(at, loc);
  const arriveTime = clock(arrive, loc);
  return (
    <div>
      <p className="text-[10px] font-black uppercase tracking-[0.16em] text-navy/40">{label}</p>
      <div className="mt-1 flex items-center justify-between gap-3 text-navy">
        <div>
          <p className="text-lg font-black tabular-nums sm:text-xl">
            {departTime !== "—" ? departTime : day ? formatBubble(day, loc) : "—"}
          </p>
          <p className="text-xs font-bold text-navy/45">
            {from}
            {departTime !== "—" && day ? ` · ${formatBubble(day, loc)}` : ""}
          </p>
        </div>
        <div className="min-w-0 flex-1 text-center">
          <p className="text-[11px] font-bold text-navy/50">{prettyDuration(duration, stops)}</p>
          <div className="relative my-1 h-px bg-navy/15">
            <span className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky" />
          </div>
          <p className="text-[11px] font-bold text-navy/55">{stopsLabel(stops)}</p>
        </div>
        <div className="text-right">
          <p className="text-lg font-black tabular-nums sm:text-xl">{arriveTime !== "—" ? arriveTime : "—"}</p>
          <p className="text-xs font-bold text-navy/45">{to}</p>
        </div>
      </div>
    </div>
  );
}

function CompareBar({
  links,
  money,
  m,
  onCompare,
}: {
  links: CompareLink[];
  money: (n: number) => string;
  m: ReturnType<typeof useApp>["m"];
  onCompare: (link: CompareLink) => void;
}) {
  if (!links.length) return null;
  return (
    <div className="mt-3">
      <p className="text-[10px] font-black uppercase tracking-[0.16em] text-navy/40">{m.results.compareThis}</p>
      <div className="mt-1.5 flex flex-wrap gap-1.5">
        {links.map((link) => (
          <button
            key={link.key}
            type="button"
            onClick={() => onCompare(link)}
            className="inline-flex min-h-9 items-center gap-1.5 rounded-full bg-mist px-2.5 py-1.5 text-[11px] font-bold text-navy ring-1 ring-navy/8 hover:bg-white hover:ring-sky"
          >
            <img src={partnerFavicon(PARTNER_META[link.key].domain)} alt="" className="h-3.5 w-3.5 rounded-sm" />
            {link.name}
            {link.priceCad ? <span className="text-sky">{money(link.priceCad)}</span> : null}
          </button>
        ))}
      </div>
    </div>
  );
}

function StatTile({
  icon: Icon,
  label,
  value,
  hint,
  accent,
}: {
  icon: typeof Trophy;
  label: string;
  value: string;
  hint?: string;
  accent?: boolean;
}) {
  return (
    <div className={`rounded-2xl p-2.5 ring-1 sm:p-4 ${accent ? "bg-sky text-white ring-sky" : "bg-white text-navy ring-navy/8"}`}>
      <p className={`inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wide ${accent ? "text-white/80" : "text-navy/45"}`}>
        <Icon className="h-3.5 w-3.5" />
        {label}
      </p>
      <p className="mt-1 text-lg font-black sm:text-2xl">{value}</p>
      {hint && <p className={`truncate text-xs font-semibold ${accent ? "text-white/75" : "text-navy/50"}`}>{hint}</p>}
    </div>
  );
}

function clock(iso?: string, loc = "en-CA") {
  if (!iso || iso.length < 16) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleTimeString(loc, { hour: "numeric", minute: "2-digit" });
}

function prettyDuration(min?: number, stops?: number) {
  if (min && min > 0) {
    const m = min > 3000 ? Math.round(min / 60) : min;
    const h = Math.floor(m / 60);
    const r = Math.round(m % 60);
    return h ? `${h}h ${r}m` : `${r}m`;
  }
  if (stops === 0) return "Non-stop";
  return "—";
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

