import type { SearchQuery } from "@/lib/deeplinks";
import { searchCodes } from "@/lib/iata-cities";
import {
  PARTNER_META,
  type PartnerKey,
  airlineLogo,
  agodaUrl,
  aviasalesUrl,
  bookingHotelsUrl,
  discoverCarsUrl,
  expediaCarsUrl,
  expediaFlightsUrl,
  expediaHotelsUrl,
  googleFlightsUrl,
  hotelsComUrl,
  kayakCarsUrl,
  kayakFlightsUrl,
  kayakHotelsUrl,
  nightsBetween,
  rentalcarsUrl,
  skyscannerCarsUrl,
  skyscannerFlightsUrl,
  typicalCarRange,
  typicalStayRange,
} from "@/lib/partners";

export type LiveOffer = {
  id: string;
  source: "travelpayouts" | "partner";
  kind: SearchQuery["kind"];
  title: string;
  partner?: string;
  partnerKey?: PartnerKey;
  domain?: string;
  color?: string;
  tagline?: string;
  taglineFr?: string;
  highlights?: string[];
  highlightsFr?: string[];
  airline?: string;
  airlineName?: string;
  airlineLogo?: string;
  flightNumber?: string;
  priceCad?: number;
  priceFromCad?: number;
  priceToCad?: number;
  priceUnit?: "trip" | "night" | "day" | "person";
  stops?: number;
  departAt?: string;
  returnAt?: string;
  durationMin?: number;
  url: string;
  foundAt?: string;
  featured?: boolean;
  live: true;
};

const TOKEN = process.env.TRAVELPAYOUTS_TOKEN || "321d6a221f8926b5ec41ae89a3b2ae7b";

type Airline = { code: string; name: string };
let airlineCache: Map<string, string> | null = null;

async function airlines() {
  if (airlineCache) return airlineCache;
  try {
    const res = await fetch("https://api.travelpayouts.com/data/en/airlines.json", {
      next: { revalidate: 86400 },
    });
    if (!res.ok) throw new Error("airlines");
    const rows = (await res.json()) as Airline[];
    airlineCache = new Map(rows.map((a) => [a.code, a.name]));
  } catch {
    airlineCache = new Map();
  }
  return airlineCache;
}

function offerFromPartner(
  key: PartnerKey,
  q: SearchQuery,
  url: string | undefined,
  extra: Partial<LiveOffer> = {}
): LiveOffer | null {
  if (!url) return null;
  const meta = PARTNER_META[key];
  return {
    id: `tp-${key}`,
    source: key === "aviasales" ? "travelpayouts" : "partner",
    kind: q.kind,
    title: meta.name,
    partner: meta.name,
    partnerKey: key,
    domain: meta.domain,
    color: meta.color,
    tagline: meta.tagline,
    taglineFr: meta.taglineFr,
    highlights: meta.highlights,
    highlightsFr: meta.highlightsFr,
    url,
    live: true,
    ...extra,
  };
}

export function travelpayoutsCheckouts(q: SearchQuery): LiveOffer[] {
  const code = (q.to || "").toUpperCase();
  const nights = nightsBetween(q.depart, q.returnDate);
  const days = nights;

  if (q.kind === "flights") {
    return [
      offerFromPartner("aviasales", q, aviasalesUrl(q), { featured: true }),
      offerFromPartner("kayak", q, kayakFlightsUrl(q)),
      offerFromPartner("skyscanner", q, skyscannerFlightsUrl(q)),
      offerFromPartner("google", q, googleFlightsUrl(q)),
      offerFromPartner("expedia", q, expediaFlightsUrl(q)),
    ].filter((o): o is LiveOffer => Boolean(o));
  }

  if (q.kind === "stays") {
    const [lo, hi] = typicalStayRange(code);
    const range = { priceFromCad: lo * nights, priceToCad: hi * nights, priceUnit: "trip" as const };
    return [
      offerFromPartner("booking", q, bookingHotelsUrl(q), { ...range, featured: true }),
      offerFromPartner("kayak", q, kayakHotelsUrl(q), range),
      offerFromPartner("expedia", q, expediaHotelsUrl(q), range),
      offerFromPartner("hotels", q, hotelsComUrl(q), range),
      offerFromPartner("agoda", q, agodaUrl(q), range),
    ].filter((o): o is LiveOffer => Boolean(o));
  }

  if (q.kind === "cars") {
    const [lo, hi] = typicalCarRange(code);
    const range = { priceFromCad: lo * days, priceToCad: hi * days, priceUnit: "trip" as const };
    return [
      offerFromPartner("kayak", q, kayakCarsUrl(q), { ...range, featured: true }),
      offerFromPartner("skyscanner", q, skyscannerCarsUrl(q), range),
      offerFromPartner("expedia", q, expediaCarsUrl(q), range),
      offerFromPartner("discover", q, discoverCarsUrl(q), range),
      offerFromPartner("rentalcars", q, rentalcarsUrl(q), range),
    ].filter((o): o is LiveOffer => Boolean(o));
  }

  return [];
}

async function tp(path: string) {
  const url = path.includes("?") ? `${path}&token=${TOKEN}` : `${path}?token=${TOKEN}`;
  const res = await fetch(url, {
    headers: { "x-access-token": TOKEN, Accept: "application/json" },
    next: { revalidate: 1800 },
  });
  if (!res.ok) return null;
  return res.json();
}

export async function searchLive(q: SearchQuery): Promise<LiveOffer[]> {
  if (q.kind === "stays" || q.kind === "cars") return travelpayoutsCheckouts(q);
  if (q.kind !== "flights") return [];
  const origins = searchCodes(q.from);
  const dests = searchCodes(q.to);
  const names = await airlines();
  const found: LiveOffer[] = [];
  const adults = q.adults || 1;

  for (const origin of origins) {
    for (const dest of dests) {
      const batch = await Promise.allSettled([
        fetchWeek(origin, dest, q, names, adults),
        fetchCheap(origin, dest, q, names, adults),
        fetchCalendar(origin, dest, q, names, adults),
      ]);
      for (const item of batch) {
        if (item.status === "fulfilled") found.push(...item.value);
      }
    }
  }

  const seen = new Set<string>();
  const fares = found
    .filter((o) => (o.priceCad || 0) > 0)
    .sort((a, b) => (a.priceCad || 0) - (b.priceCad || 0))
    .filter((o) => {
      const key = `${o.airline}-${o.priceCad}-${o.departAt?.slice(0, 10)}-${o.stops}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, 12);

  const checkout = travelpayoutsCheckouts(q);
  return [...fares, ...checkout.filter((c) => !fares.some((f) => f.url === c.url))];
}

async function fetchWeek(
  origin: string,
  dest: string,
  q: SearchQuery,
  names: Map<string, string>,
  adults: number
) {
  const params = new URLSearchParams({
    currency: "cad",
    origin,
    destination: dest,
    show_to_affiliates: "true",
  });
  if (q.depart) params.set("depart_date", q.depart);
  if (q.returnDate && q.trip !== "oneway") params.set("return_date", q.returnDate);
  const json = await tp(`https://api.travelpayouts.com/v2/prices/week-matrix?${params.toString()}`);
  const rows = Array.isArray(json?.data) ? json.data : [];
  return rows.map((row: Record<string, unknown>, i: number) =>
    toOffer({
      id: `week-${origin}-${dest}-${i}`,
      origin,
      dest,
      price: Number(row.value),
      stops: Number(row.number_of_changes ?? 0),
      departAt: String(row.depart_date || q.depart || ""),
      returnAt: String(row.return_date || q.returnDate || ""),
      durationMin: row.duration != null ? Number(row.duration) : undefined,
      foundAt: String(row.found_at || ""),
      names,
      adults,
      q,
    })
  );
}

async function fetchCheap(
  origin: string,
  dest: string,
  q: SearchQuery,
  names: Map<string, string>,
  adults: number
) {
  const month = (q.depart || "").slice(0, 7);
  const params = new URLSearchParams({
    origin,
    destination: dest,
    currency: "cad",
  });
  if (q.depart) params.set("depart_date", q.depart);
  else if (month) params.set("depart_date", month);
  if (q.returnDate && q.trip !== "oneway") params.set("return_date", q.returnDate);
  const json = await tp(`https://api.travelpayouts.com/v1/prices/cheap?${params.toString()}`);
  const grouped = json?.data && typeof json.data === "object" ? json.data : {};
  const out: LiveOffer[] = [];
  for (const destKey of Object.keys(grouped)) {
    const byStops = grouped[destKey] as Record<string, Record<string, unknown>>;
    for (const stopKey of Object.keys(byStops)) {
      const row = byStops[stopKey];
      out.push(
        toOffer({
          id: `cheap-${origin}-${destKey}-${stopKey}`,
          origin,
          dest: destKey,
          price: Number(row.price),
          stops: Number(stopKey),
          airline: String(row.airline || ""),
          flightNumber: String(row.flight_number || ""),
          departAt: String(row.departure_at || q.depart || ""),
          returnAt: String(row.return_at || q.returnDate || ""),
          durationMin: row.duration != null ? Number(row.duration) : undefined,
          foundAt: String(row.expires_at || ""),
          names,
          adults,
          q,
        })
      );
    }
  }
  return out;
}

async function fetchCalendar(
  origin: string,
  dest: string,
  q: SearchQuery,
  names: Map<string, string>,
  adults: number
) {
  const month = (q.depart || "").slice(0, 7);
  if (!month) return [];
  const params = new URLSearchParams({
    origin,
    destination: dest,
    depart_date: month,
    calendar_type: "departure_date",
    currency: "cad",
  });
  if (q.returnDate && q.trip !== "oneway") params.set("return_date", (q.returnDate || "").slice(0, 7));
  const json = await tp(`https://api.travelpayouts.com/v1/prices/calendar?${params.toString()}`);
  const grouped = json?.data && typeof json.data === "object" ? json.data : {};
  const wanted = q.depart;
  return Object.entries(grouped)
    .filter(([day]) => !wanted || day === wanted || Math.abs(Date.parse(day) - Date.parse(wanted)) <= 3 * 86400000)
    .map(([day, row]) => {
      const r = row as Record<string, unknown>;
      return toOffer({
        id: `cal-${origin}-${dest}-${day}`,
        origin,
        dest,
        price: Number(r.price),
        stops: Number(r.transfers ?? 0),
        airline: String(r.airline || ""),
        flightNumber: String(r.flight_number || ""),
        departAt: String(r.departure_at || day),
        returnAt: String(r.return_at || q.returnDate || ""),
        names,
        adults,
        q,
      });
    });
}

function toOffer(input: {
  id: string;
  origin: string;
  dest: string;
  price: number;
  stops?: number;
  airline?: string;
  flightNumber?: string;
  departAt?: string;
  returnAt?: string;
  durationMin?: number;
  foundAt?: string;
  names: Map<string, string>;
  adults: number;
  q: SearchQuery;
}): LiveOffer {
  const airline = input.airline || undefined;
  const name = airline ? input.names.get(airline) || airline : "Live fare";
  const url =
    aviasalesUrl({
      ...input.q,
      from: input.origin,
      to: input.dest,
      depart: input.departAt?.slice(0, 10) || input.q.depart,
      returnDate: input.returnAt?.slice(0, 10) || input.q.returnDate,
      adults: input.adults,
    }) || "#";
  return {
    id: input.id,
    source: "travelpayouts",
    kind: "flights",
    title: name,
    partner: "Aviasales",
    partnerKey: "aviasales",
    domain: "aviasales.com",
    color: PARTNER_META.aviasales.color,
    airline,
    airlineName: airline ? input.names.get(airline) : undefined,
    airlineLogo: airlineLogo(airline),
    flightNumber: input.flightNumber || undefined,
    priceCad: Math.round(input.price),
    priceUnit: "person",
    stops: input.stops,
    departAt: input.departAt,
    returnAt: input.returnAt,
    durationMin: input.durationMin,
    url,
    foundAt: input.foundAt,
    live: true,
  };
}
