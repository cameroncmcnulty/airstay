"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, ExternalLink, Plane } from "lucide-react";
import { useApp } from "@/context/AppContext";

export default function ConfirmedPage() {
  return (
    <Suspense fallback={<div className="px-4 py-16 text-center text-navy/60">…</div>}>
      <Inner />
    </Suspense>
  );
}

function Inner() {
  const sp = useSearchParams();
  const { m } = useApp();
  const flights = sp.get("flights");

  return (
    <div className="mx-auto max-w-xl px-4 py-16 text-center">
      <CheckCircle2 className="mx-auto h-12 w-12 text-sky" />
      <h1 className="mt-4 text-3xl font-black text-navy">{m.book.doneTitle}</h1>
      <p className="mt-2 text-navy/65">{m.book.doneBody}</p>
      <div className="mt-6 rounded-card bg-white p-5 text-left shadow-card ring-1 ring-navy/5">
        <p className="text-xs font-bold uppercase tracking-wide text-navy/45">{m.book.reference}</p>
        <p className="mt-1 text-2xl font-black text-navy">{sp.get("ref")}</p>
        <p className="mt-3 font-bold text-navy">{sp.get("hotel")}</p>
        <p className="text-sm text-navy/60">
          {sp.get("checkIn")} – {sp.get("checkOut")}
        </p>
      </div>
      {flights && (
        <a
          href={flights}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-navy px-5 py-3 text-sm font-bold text-white"
        >
          <Plane className="h-4 w-4" />
          {m.book.bookFlights}
          <ExternalLink className="h-4 w-4" />
        </a>
      )}
    </div>
  );
}
