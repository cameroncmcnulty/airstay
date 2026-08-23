"use client";

import { useApp } from "@/context/AppContext";

const ENDPOINTS = [
  { method: "GET", path: "/api/v1/health", descEn: "Is the search API awake?", descFr: "L’API de recherche est-elle réveillée ?" },
  { method: "POST", path: "/api/v1/search/flights", descEn: "CAD fares for a Canada-outbound trip", descFr: "Tarifs en $ CA pour un départ du Canada" },
  { method: "POST", path: "/api/v1/search/hotels", descEn: "Hotels with your dates ready", descFr: "Hôtels avec vos dates déjà prêtes" },
  { method: "POST", path: "/api/v1/search/cars", descEn: "Cars waiting at the destination", descFr: "Autos à l’arrivée" },
];

export default function DevelopersPage() {
  const { locale } = useApp();
  const fr = locale === "fr";
  return (
    <article className="mx-auto max-w-3xl px-4 py-12">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-700">AIRSTAY</p>
      <h1 className="mt-2 text-3xl font-black text-navy">
        {fr ? "La même recherche, en API." : "The same search, as an API."}
      </h1>
      <p className="mt-4 text-navy/70">
        {fr
          ? "Vols, hôtels et autos au départ du Canada, en $ CA. Sans frais de réservation AIRSTAY."
          : "Flights, hotels and cars from Canada, in CAD. No AIRSTAY booking fee."}
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
            <p className="mt-1 text-sm text-navy/60">{fr ? e.descFr : e.descEn}</p>
          </li>
        ))}
      </ul>
    </article>
  );
}
