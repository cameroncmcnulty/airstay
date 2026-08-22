"use client";

import { useApp } from "@/context/AppContext";

const ENDPOINTS = [
  { method: "GET", path: "/api/v1/health", desc: "Provider status" },
  { method: "POST", path: "/api/v1/search/flights", desc: "Live CAD fares via Travelpayouts, checkout on Aviasales" },
  { method: "POST", path: "/api/v1/search/hotels", desc: "Stay search with dates on Booking.com, Hotels.com, Agoda" },
  { method: "POST", path: "/api/v1/search/cars", desc: "Car search with dates on Discover Cars and Rentalcars.com" },
];

export default function DevelopersPage() {
  const { locale } = useApp();
  return (
    <article className="mx-auto max-w-3xl px-4 py-12">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-700">AIRSTAY Travel API v1</p>
      <h1 className="mt-2 text-3xl font-black text-navy">Travelpayouts search for flights, stays and cars.</h1>
      <p className="mt-4 text-navy/70">
        {locale === "fr"
          ? "Prix de vols en $ CA via Travelpayouts. Les séjours et autos ouvrent le site partenaire avec vos dates."
          : "Live CAD flight prices from Travelpayouts. Stays and cars open the partner site with your AIRSTAY dates already filled."}
      </p>
      <pre className="mt-6 overflow-auto rounded-2xl bg-navy p-4 text-xs text-sky-100">
        {`POST /api/v1/search/flights
{
  "origin": "YYZ",
  "destination": "CUN",
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
        Bookings complete on the Travelpayouts partner site (Aviasales, Booking.com, Discover Cars, and similar). AIRSTAY
        is a connectivity layer, not a TICO travel agency. Vacation packages are coming soon.
      </p>
    </article>
  );
}
