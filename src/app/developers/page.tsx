"use client";

import { useApp } from "@/context/AppContext";

const ENDPOINTS = [
  { method: "GET", path: "/api/v1/health", desc: "Provider status and endpoint list" },
  { method: "POST", path: "/api/v1/search/flights", desc: "Live CAD fares (Duffel, Travelpayouts fallback)" },
  { method: "POST", path: "/api/v1/search/hotels", desc: "Live stay rates via Duffel Stays" },
  { method: "POST", path: "/api/v1/search/cars", desc: "Normalized car-rental supplier search" },
  { method: "POST", path: "/api/v1/search/packages", desc: "Dynamic flight + resort packages" },
  { method: "POST", path: "/api/v1/bookings", desc: "Create a booking quote from an offer" },
  { method: "GET", path: "/api/v1/bookings/{id}", desc: "Retrieve a booking" },
  { method: "POST", path: "/api/v1/bookings/{id}/cancel", desc: "Cancel a booking quote" },
];

export default function DevelopersPage() {
  const { locale } = useApp();
  return (
    <article className="mx-auto max-w-3xl px-4 py-12">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-700">AIRSTAY Travel API v1</p>
      <h1 className="mt-2 text-3xl font-black text-navy">One API for flights, stays, cars and packages.</h1>
      <p className="mt-4 text-navy/70">
        {locale === "fr"
          ? "Même idée qu’un agrégateur type ReservationHub / TripGic : un JSON normalisé, des fournisseurs branchés derrière."
          : "Same idea as ReservationHub / TripGic: one normalized JSON surface, suppliers behind it."}
      </p>
      <pre className="mt-6 overflow-auto rounded-2xl bg-navy p-4 text-xs text-sky-100">
        {`POST /api/v1/search/packages
{
  "origin": "YYZ",
  "destination": "CUN",
  "destinationName": "Cancun",
  "departDate": "2026-09-16",
  "returnDate": "2026-09-23",
  "adults": 2
}`}
      </pre>
      <ul className="mt-8 space-y-3">
        {ENDPOINTS.map((e) => (
          <li key={e.path} className="rounded-2xl bg-white p-4 ring-1 ring-navy/5">
            <p className="font-mono text-sm font-bold text-navy">
              <span className="text-sky-700">{e.method}</span> {e.path}
            </p>
            <p className="mt-1 text-sm text-navy/60">{e.desc}</p>
          </li>
        ))}
      </ul>
      <p className="mt-8 text-sm text-navy/60">
        Live stays and bookable fares use Duffel. Set <code>DUFFEL_ACCESS_TOKEN</code> (test token from the Duffel
        dashboard). Flight tickets still complete on the airline/Aviasales checkout with your AIRSTAY dates. AIRSTAY is
        a connectivity layer, not a TICO travel agency.
      </p>
    </article>
  );
}
