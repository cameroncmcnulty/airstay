"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ExternalLink, BookmarkPlus, BookmarkCheck } from "lucide-react";
import { paramsToQuery, buildPartnerOffers, cad, cadFr } from "@/lib/deeplinks";
import { getAirport, getDestination } from "@/lib/airports";
import { useApp } from "@/context/AppContext";
import { currentUser, updateUser } from "@/lib/auth";

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
  const offers = useMemo(() => buildPartnerOffers(q), [q]);
  const { m, locale, refreshUser } = useApp();
  const [leaving, setLeaving] = useState<(typeof offers)[0] | null>(null);
  const [saved, setSaved] = useState(false);

  const origin = q.from ? getAirport(q.from) : undefined;
  const dest = q.to ? getDestination(q.to) : undefined;
  const destName = dest ? (locale === "fr" ? dest.cityFr : dest.city) : q.toCity || q.to || "";
  const originName = origin ? `${locale === "fr" ? origin.cityFr : origin.city} (${origin.code})` : q.from || "";

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

  function go(offer: (typeof offers)[0]) {
    const u = currentUser();
    if (u) {
      updateUser(u.id, {
        clicks: [{ partner: offer.partner, url: offer.url, at: new Date().toISOString() }, ...u.clicks].slice(0, 30),
      });
      refreshUser();
    }
    window.open(offer.url, "_blank", "noopener,noreferrer");
    setLeaving(null);
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-700">{m.results.title}</p>
          <h1 className="mt-2 text-3xl font-black text-navy">
            {q.kind === "stays" || q.kind === "cars" ? destName : `${originName} → ${destName}`}
          </h1>
          <p className="mt-1 text-sm text-navy/60">
            {q.depart}
            {q.returnDate ? ` – ${q.returnDate}` : ""} · {q.adults} {m.search.adults}
            {q.children
              ? ` · ${q.children} ${m.search.children}${
                  q.childAges?.length
                    ? ` (${q.childAges
                        .map((n) =>
                          n === 0 ? m.search.underOne : n === 1 ? m.search.yearOld : m.search.yearsOld.replace("{n}", String(n))
                        )
                        .join(", ")})`
                    : ""
                }`
              : ""}
          </p>
        </div>
        <button
          type="button"
          onClick={save}
          className="inline-flex items-center gap-2 rounded-full border border-navy/15 bg-white px-4 py-2 text-sm font-bold text-navy"
        >
          {saved ? <BookmarkCheck className="h-4 w-4 text-sky" /> : <BookmarkPlus className="h-4 w-4" />}
          {saved ? m.results.saved : m.results.save}
        </button>
      </div>

      <p className="mt-4 rounded-2xl bg-sky-50 px-4 py-3 text-sm text-navy/75">{m.partners.note}</p>

      <ul className="mt-6 space-y-3">
        {offers.map((o, i) => (
          <li key={o.id} className="flex flex-wrap items-center justify-between gap-4 rounded-card bg-white p-5 shadow-card ring-1 ring-navy/5">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-black text-navy">{o.partner}</span>
                <span className="rounded-full bg-sand px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-navy/60">
                  {locale === "fr" ? "Partenaire" : "Partner"}
                </span>
                {i === 0 && (
                  <span className="rounded-full bg-sky-100 px-2 py-0.5 text-[10px] font-bold uppercase text-sky-800">
                    {locale === "fr" ? "Prix mis en avant" : "Highlighted"}
                  </span>
                )}
              </div>
              <p className="text-sm text-navy/55">{locale === "fr" ? o.taglineFr : o.tagline}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-xs font-semibold text-navy/45">{m.results.advertised}</p>
                <p className="text-2xl font-black text-navy">{locale === "fr" ? cadFr(o.priceCad) : cad(o.priceCad)}</p>
                <p className="max-w-[180px] text-[11px] leading-tight text-navy/45">{m.results.cadNote}</p>
              </div>
              <button
                type="button"
                onClick={() => setLeaving(o)}
                className="inline-flex items-center gap-2 rounded-full bg-sky px-4 py-3 text-sm font-bold text-white shadow-lift"
              >
                {o.partner}
                <ExternalLink className="h-4 w-4" />
              </button>
            </div>
          </li>
        ))}
      </ul>

      {leaving && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-navy/50 p-4" role="dialog" aria-modal="true">
          <div className="w-full max-w-md rounded-card bg-white p-6 shadow-card">
            <h2 className="text-xl font-black text-navy">{m.results.leaving}</h2>
            <p className="mt-2 text-sm leading-relaxed text-navy/70">{m.results.leavingBody}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              <button
                type="button"
                className="rounded-full bg-sky px-4 py-2.5 text-sm font-bold text-white"
                onClick={() => go(leaving)}
              >
                {m.results.continue.replace("{partner}", leaving.partner)}
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
