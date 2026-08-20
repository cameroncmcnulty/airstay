"use client";

import { FormEvent, Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CalendarDays, Hotel, MapPin, Plane, Users } from "lucide-react";
import { cad, cadFr, paramsToQuery } from "@/lib/deeplinks";
import { nightsBetween } from "@/data/resorts";
import { useApp } from "@/context/AppContext";
import { currentUser } from "@/lib/auth";

type Quote = {
  quoteId: string;
  stayCad: number;
  hotelName: string;
  roomName?: string;
  board?: string;
  checkIn: string;
  checkOut: string;
  image?: string;
  address?: string;
};

type Guest = { givenName: string; familyName: string; bornOn: string };

export default function BookPage() {
  return (
    <Suspense fallback={<div className="px-4 py-16 text-center text-navy/60">…</div>}>
      <BookInner />
    </Suspense>
  );
}

function BookInner() {
  const sp = useSearchParams();
  const q = useMemo(() => paramsToQuery(sp), [sp]);
  const { m, locale } = useApp();
  const router = useRouter();
  const stayId = sp.get("stayId") || "";
  const hotel = sp.get("hotel") || "";
  const flightsUrl = sp.get("flights") || "";
  const nights = nightsBetween(q.depart, q.returnDate);
  const guestCount = Math.max(1, (q.adults || 1) + (q.children || 0));

  const [quote, setQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(Boolean(stayId));
  const [error, setError] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [requests, setRequests] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [guests, setGuests] = useState<Guest[]>(() =>
    Array.from({ length: guestCount }, () => ({ givenName: "", familyName: "", bornOn: "" }))
  );

  useEffect(() => {
    const u = currentUser();
    if (u?.email) setEmail(u.email);
    if (u?.name) {
      const [first, ...rest] = u.name.split(" ");
      setGuests((prev) => {
        const next = [...prev];
        if (next[0]) next[0] = { ...next[0], givenName: first || "", familyName: rest.join(" ") };
        return next;
      });
    }
  }, []);

  useEffect(() => {
    if (!stayId) {
      setLoading(false);
      setError(m.book.missingStay);
      return;
    }
    let cancelled = false;
    setLoading(true);
    fetch("/api/book/quote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stayId }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        if (!data.ok) {
          setError(data.error || m.book.quoteFail);
          return;
        }
        setQuote(data.quote);
      })
      .catch(() => {
        if (!cancelled) setError(m.book.quoteFail);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [stayId, m.book.missingStay, m.book.quoteFail]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!quote) return;
    setSubmitting(true);
    setError("");
    const res = await fetch("/api/book/confirm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        quoteId: quote.quoteId,
        email,
        phone,
        specialRequests: requests,
        guests: guests.map((g) => ({
          givenName: g.givenName,
          familyName: g.familyName,
          bornOn: g.bornOn || undefined,
        })),
      }),
    });
    const data = await res.json().catch(() => ({}));
    setSubmitting(false);
    if (!data.ok) {
      setError(data.error || m.book.bookFail);
      return;
    }
    const p = new URLSearchParams({
      ref: data.booking.reference || data.booking.bookingId,
      hotel: data.booking.hotelName || quote.hotelName,
      checkIn: data.booking.checkIn || quote.checkIn,
      checkOut: data.booking.checkOut || quote.checkOut,
    });
    if (flightsUrl || (q.from && q.to && q.depart)) {
      p.set("flights", flightsUrl);
      p.set("from", q.from || "");
      p.set("to", q.to || "");
      p.set("depart", q.depart || "");
      p.set("return", q.returnDate || "");
      p.set("adults", String(q.adults || 1));
    }
    router.push(`/book/confirmed?${p.toString()}`);
  }

  const money = (n: number) => (locale === "fr" ? cadFr(n) : cad(n));

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-700">{m.book.kicker}</p>
      <h1 className="mt-2 text-3xl font-black text-navy">{m.book.title}</h1>
      <p className="mt-2 text-sm text-navy/65">{m.book.sub}</p>

      <div className="mt-6 overflow-hidden rounded-card bg-white shadow-card ring-1 ring-navy/5">
        {quote?.image && <img src={quote.image} alt="" className="h-48 w-full object-cover" />}
        <div className="p-5">
          <h2 className="text-xl font-black text-navy">{quote?.hotelName || hotel || m.book.stay}</h2>
          {quote?.address && (
            <p className="mt-1 flex items-center gap-1 text-sm text-navy/60">
              <MapPin className="h-3.5 w-3.5" />
              {quote.address}
            </p>
          )}
          <div className="mt-3 flex flex-wrap gap-2 text-xs font-bold text-navy/70">
            <Chip icon={CalendarDays}>
              {q.depart} – {q.returnDate} · {m.results.nights.replace("{n}", String(nights))}
            </Chip>
            <Chip icon={Users}>
              {q.adults} {m.search.adults}
              {q.children ? ` · ${q.children} ${m.search.children}` : ""}
            </Chip>
            {q.from && q.to && (
              <Chip icon={Plane}>
                {q.from} → {q.to}
              </Chip>
            )}
            {(quote?.roomName || quote?.board) && (
              <Chip icon={Hotel}>{[quote.roomName, quote.board].filter(Boolean).join(" · ")}</Chip>
            )}
          </div>
          {loading && <p className="mt-4 text-sm font-semibold text-sky-800">{m.book.quoting}</p>}
          {quote && (
            <p className="mt-4 text-3xl font-black text-navy">
              {money(quote.stayCad)}
              <span className="ml-2 text-sm font-semibold text-navy/50">{m.book.stayTotal}</span>
            </p>
          )}
        </div>
      </div>

      {error && <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-800">{error}</p>}

      {quote && (
        <form onSubmit={onSubmit} className="mt-6 space-y-4 rounded-card bg-white p-5 shadow-card ring-1 ring-navy/5">
          {guests.map((g, i) => (
            <div key={i} className="grid gap-3 md:grid-cols-3">
              <label className="block">
                <span className="mb-1 block text-xs font-bold text-navy/60">
                  {m.book.given} {i + 1}
                </span>
                <input
                  className="field"
                  required
                  value={g.givenName}
                  onChange={(e) =>
                    setGuests((prev) => prev.map((row, idx) => (idx === i ? { ...row, givenName: e.target.value } : row)))
                  }
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-xs font-bold text-navy/60">{m.book.family}</span>
                <input
                  className="field"
                  required
                  value={g.familyName}
                  onChange={(e) =>
                    setGuests((prev) => prev.map((row, idx) => (idx === i ? { ...row, familyName: e.target.value } : row)))
                  }
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-xs font-bold text-navy/60">{m.book.born}</span>
                <input
                  className="field"
                  type="date"
                  value={g.bornOn}
                  onChange={(e) =>
                    setGuests((prev) => prev.map((row, idx) => (idx === i ? { ...row, bornOn: e.target.value } : row)))
                  }
                />
              </label>
            </div>
          ))}
          <div className="grid gap-3 md:grid-cols-2">
            <label className="block">
              <span className="mb-1 block text-xs font-bold text-navy/60">{m.book.email}</span>
              <input className="field" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-bold text-navy/60">{m.book.phone}</span>
              <input
                className="field"
                required
                inputMode="tel"
                placeholder="+1 416 555 0100"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </label>
          </div>
          <label className="block">
            <span className="mb-1 block text-xs font-bold text-navy/60">{m.book.requests}</span>
            <textarea className="field min-h-20" value={requests} onChange={(e) => setRequests(e.target.value)} />
          </label>
          <p className="text-xs leading-relaxed text-navy/55">{m.book.legal}</p>
          <button
            type="submit"
            disabled={submitting}
            className="rounded-full bg-sky px-5 py-3 text-sm font-bold text-white shadow-lift disabled:opacity-60"
          >
            {submitting ? m.book.booking : m.book.confirm}
          </button>
        </form>
      )}
    </div>
  );
}

function Chip({ icon: Icon, children }: { icon: typeof CalendarDays; children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-mist px-2.5 py-1">
      <Icon className="h-3.5 w-3.5 text-sky" />
      {children}
    </span>
  );
}
