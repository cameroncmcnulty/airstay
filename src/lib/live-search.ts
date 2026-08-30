import type { SearchQuery } from "@/lib/deeplinks";
import { searchCodes } from "@/lib/iata-cities";
import { PARTNER_META, type PartnerKey, airlineLogo, aviasalesUrl, bookingHotelsUrl } from "@/lib/partners";

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
  originAirport?: string;
  destAirport?: string;
  priceCad?: number;
  priceFromCad?: number;
  priceToCad?: number;
  priceUnit?: "trip" | "night" | "day" | "person";
  adults?: number;
  stops?: number;
  returnStops?: number;
  departAt?: string;
  returnAt?: string;
  arriveAt?: string;
  durationMin?: number;
  durationBack?: number;
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

export function pricedOnly(offers: LiveOffer[]) {
  return offers.filter((o) => (o.priceCad || 0) > 0);
}

function speedValue(o: LiveOffer) {
  if (o.durationMin && o.durationMin > 0) return o.durationMin;
  if (o.stops == null) return 9999;
  return 180 + o.stops * 140;
}

export function rankOffers(offers: LiveOffer[]) {
  const priced = pricedOnly(offers);
  if (!priced.length) {
    return { ranked: [] as LiveOffer[], cheapestId: "", fastestId: "", bestId: "" };
  }
  const minPrice = Math.min(...priced.map((o) => o.priceCad || Infinity));
  const minSpeed = Math.min(...priced.map(speedValue));
  const scored = priced.map((o) => {
    const p = (o.priceCad || minPrice) / minPrice;
    const s = speedValue(o) / (minSpeed || 1);
    return { o, score: p * 0.62 + s * 0.38 };
  });
  scored.sort((a, b) => a.score - b.score || (a.o.priceCad || 0) - (b.o.priceCad || 0));
  const cheapest = priced.reduce((a, b) => ((a.priceCad || 0) <= (b.priceCad || 0) ? a : b));
  const fastest = priced.reduce((a, b) => (speedValue(a) <= speedValue(b) ? a : b));
  return {
    ranked: scored.map((x) => x.o),
    cheapestId: cheapest.id,
    fastestId: fastest.id,
    bestId: scored[0].o.id,
  };
}

export function travelpayoutsCheckouts(q: SearchQuery): LiveOffer[] {
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
  if (q.kind === "stays") return fetchHotelPrices(q);
  if (q.kind === "cars") return [];
  if (q.kind !== "flights") return [];
  const origins = searchCodes(q.from);
  const dests = searchCodes(q.to);
  const names = await airlines();
  const found: LiveOffer[] = [];
  const adults = q.adults || 1;

  for (const origin of origins.slice(0, 2)) {
    for (const dest of dests.slice(0, 2)) {
      const batch = await Promise.allSettled([
        fetchDates(origin, dest, q, names, adults),
        fetchDirect(origin, dest, q, names, adults),
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
  return found
    .filter((o) => (o.priceCad || 0) > 0)
    .sort((a, b) => (a.priceCad || 0) - (b.priceCad || 0))
    .filter((o) => {
      const key = `${o.airline || o.title}-${o.priceCad}-${o.departAt?.slice(0, 10)}-${o.stops}-${o.durationMin || 0}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, 20);
}

async function fetchDates(
  origin: string,
  dest: string,
  q: SearchQuery,
  names: Map<string, string>,
  adults: number
) {
  const params = new URLSearchParams({
    origin,
    destination: dest,
    currency: "cad",
    sorting: "price",
    direct: "false",
    limit: "30",
    unique: "false",
  });
  if (q.depart) params.set("departure_at", q.depart);
  if (q.returnDate && q.trip !== "oneway") params.set("return_at", q.returnDate);
  const json = await tp(`https://api.travelpayouts.com/aviasales/v3/prices_for_dates?${params.toString()}`);
  const rows = Array.isArray(json?.data) ? json.data : [];
  return rows.map((row: Record<string, unknown>, i: number) =>
    toOffer({
      id: `dates-${origin}-${dest}-${i}`,
      origin: String(row.origin || origin),
      dest: String(row.destination || dest),
      originAirport: String(row.origin_airport || row.origin || origin),
      destAirport: String(row.destination_airport || row.destination || dest),
      price: Number(row.price),
      stops: Number(row.transfers ?? row.number_of_changes ?? 0),
      returnStops: row.return_transfers != null ? Number(row.return_transfers) : undefined,
      airline: String(row.airline || ""),
      flightNumber: String(row.flight_number || ""),
      departAt: String(row.departure_at || q.depart || ""),
      returnAt: String(row.return_at || q.returnDate || ""),
      durationMin: minutes(row.duration_to ?? row.duration),
      durationBack: minutes(row.duration_back),
      link: typeof row.link === "string" ? row.link : undefined,
      names,
      adults,
      q,
    })
  );
}

async function fetchDirect(
  origin: string,
  dest: string,
  q: SearchQuery,
  names: Map<string, string>,
  adults: number
) {
  const params = new URLSearchParams({ origin, destination: dest, currency: "cad" });
  if (q.depart) params.set("depart_date", q.depart);
  if (q.returnDate && q.trip !== "oneway") params.set("return_date", q.returnDate);
  const json = await tp(`https://api.travelpayouts.com/v1/prices/direct?${params.toString()}`);
  const grouped = json?.data && typeof json.data === "object" ? json.data : {};
  const out: LiveOffer[] = [];
  for (const destKey of Object.keys(grouped)) {
    const row = grouped[destKey] as Record<string, unknown>;
    out.push(
      toOffer({
        id: `direct-${origin}-${destKey}`,
        origin,
        dest: destKey,
        price: Number(row.price),
        stops: 0,
        airline: String(row.airline || ""),
        flightNumber: String(row.flight_number || ""),
        departAt: String(row.departure_at || q.depart || ""),
        returnAt: String(row.return_at || q.returnDate || ""),
        names,
        adults,
        q,
      })
    );
  }
  return out;
}

function minutes(raw: unknown) {
  const n = Number(raw);
  if (!Number.isFinite(n) || n <= 0) return undefined;
  if (n > 3000) return Math.round(n / 60);
  return Math.round(n);
}

async function fetchHotelPrices(q: SearchQuery): Promise<LiveOffer[]> {
  const loc = q.toCity || q.to || "";
  if (!loc || !q.depart || !q.returnDate) return [];
  const params = new URLSearchParams({
    location: loc,
    checkIn: q.depart,
    checkOut: q.returnDate,
    currency: "cad",
    limit: "12",
    token: TOKEN,
  });
  const json = await tp(`https://engine.hotellook.com/api/v2/cache.json?${params.toString()}`);
  const rows = Array.isArray(json) ? json : Array.isArray(json?.data) ? json.data : [];
  const out: LiveOffer[] = [];
  rows.forEach((row: Record<string, unknown>, i: number) => {
    const price = Math.round(Number(row.priceFrom || row.priceAvg || row.price || 0));
    if (!price) return;
    const name = String(row.hotelName || row.name || "Hotel");
    const offer = offerFromPartner("booking", q, bookingHotelsUrl(q), {
      id: `stay-${row.hotelId || i}`,
      title: name,
      partner: name,
      priceCad: price,
      priceUnit: "trip",
    });
    if (offer) out.push(offer);
  });
  return out;
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
  originAirport?: string;
  destAirport?: string;
  price: number;
  stops?: number;
  returnStops?: number;
  airline?: string;
  flightNumber?: string;
  departAt?: string;
  returnAt?: string;
  durationMin?: number;
  durationBack?: number;
  foundAt?: string;
  link?: string;
  names: Map<string, string>;
  adults: number;
  q: SearchQuery;
}): LiveOffer {
  const airline = input.airline && input.airline !== "undefined" ? input.airline : undefined;
  const name = airline ? input.names.get(airline) || airline : "Live fare";
  const built =
    aviasalesUrl({
      ...input.q,
      from: input.origin,
      to: input.dest,
      depart: input.departAt?.slice(0, 10) || input.q.depart,
      returnDate: input.returnAt?.slice(0, 10) || input.q.returnDate,
      adults: input.adults,
    }) || "#";
  const link = input.link
    ? input.link.startsWith("http")
      ? input.link
      : `https://www.aviasales.com${input.link.startsWith("/") ? "" : "/"}${input.link}`
    : built;
  const durationMin = minutes(input.durationMin);
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
    flightNumber: input.flightNumber && input.flightNumber !== "undefined" ? input.flightNumber : undefined,
    originAirport: (input.originAirport || input.origin).toUpperCase(),
    destAirport: (input.destAirport || input.dest).toUpperCase(),
    priceCad: Math.round(input.price),
    priceUnit: "person",
    adults: input.adults,
    stops: input.stops,
    returnStops: input.returnStops,
    departAt: input.departAt,
    returnAt: input.returnAt,
    arriveAt: arriveIso(input.departAt, durationMin),
    durationMin,
    durationBack: minutes(input.durationBack),
    url: link,
    foundAt: input.foundAt,
    live: true,
  };
}

function arriveIso(depart?: string, min?: number) {
  if (!depart || !min || depart.length < 16) return undefined;
  const d = new Date(depart);
  if (Number.isNaN(d.getTime())) return undefined;
  return new Date(d.getTime() + min * 60000).toISOString();
}
