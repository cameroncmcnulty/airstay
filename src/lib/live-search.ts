import type { SearchQuery } from "@/lib/deeplinks";
import { searchCodes } from "@/lib/iata-cities";
import { duffelConfigured, searchFlights as searchDuffelFlights } from "@/lib/duffel";

export type LiveOffer = {
  id: string;
  source: "travelpayouts" | "duffel";
  kind: SearchQuery["kind"];
  title: string;
  airline?: string;
  airlineName?: string;
  flightNumber?: string;
  priceCad: number;
  stops?: number;
  departAt?: string;
  returnAt?: string;
  durationMin?: number;
  url: string;
  foundAt?: string;
  live: true;
};

const MARKER = process.env.TRAVELPAYOUTS_MARKER || "564250";
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

function aviaStamp(iso?: string) {
  if (!iso) return "";
  const [, m, d] = iso.split("-");
  return `${d}${m}`;
}

function bookingUrl(origin: string, dest: string, depart?: string, ret?: string, adults = 1) {
  const path = `${origin}${aviaStamp(depart)}${dest}${aviaStamp(ret)}${Math.max(1, adults)}`;
  return `https://www.aviasales.com/search/${path}?marker=${MARKER}&currency=cad&locale=en`;
}

export function aviasalesUrl(q: Pick<SearchQuery, "from" | "to" | "depart" | "returnDate" | "adults" | "trip">) {
  if (!q.from || !q.to || !q.depart) return undefined;
  const origin = searchCodes(q.from)[0];
  const dest = searchCodes(q.to)[0];
  const ret = q.trip === "oneway" ? undefined : q.returnDate;
  return bookingUrl(origin, dest, q.depart, ret, q.adults || 1);
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
  if (q.kind !== "flights" && q.kind !== "packages") return [];
  const origins = searchCodes(q.from);
  const dests = searchCodes(q.to);
  const names = await airlines();
  const found: LiveOffer[] = [];
  const book = aviasalesUrl(q) || "";

  const duffelTask = duffelConfigured() && q.from && q.to && q.depart
    ? searchDuffelFlights(q)
        .then((rows) =>
          rows.map(
            (f): LiveOffer => ({
              id: f.offerId,
              source: "duffel",
              kind: "flights",
              title: f.airlineName || "Live fare",
              airline: f.airline,
              airlineName: f.airlineName,
              flightNumber: f.flightNumber,
              priceCad: f.priceCad,
              stops: f.stops,
              departAt: f.departAt,
              returnAt: f.returnAt,
              durationMin: f.durationMin,
              url: book,
              live: true,
            })
          )
        )
        .catch(() => [] as LiveOffer[])
    : Promise.resolve([] as LiveOffer[]);

  const tpTask = (async () => {
    const rows: LiveOffer[] = [];
    for (const origin of origins) {
      for (const dest of dests) {
        const batch = await Promise.allSettled([
          fetchWeek(origin, dest, q, names),
          fetchCheap(origin, dest, q, names),
          fetchCalendar(origin, dest, q, names),
        ]);
        for (const item of batch) {
          if (item.status === "fulfilled") rows.push(...item.value);
        }
      }
    }
    return rows;
  })();

  const [duffelRows, tpRows] = await Promise.all([duffelTask, tpTask]);
  found.push(...duffelRows, ...tpRows);

  const seen = new Set<string>();
  return found
    .filter((o) => o.priceCad > 0)
    .sort((a, b) => a.priceCad - b.priceCad)
    .filter((o) => {
      const key = `${o.airline}-${o.priceCad}-${o.departAt?.slice(0, 10)}-${o.stops}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, 12);
}

async function fetchWeek(origin: string, dest: string, q: SearchQuery, names: Map<string, string>) {
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
    })
  );
}

async function fetchCheap(origin: string, dest: string, q: SearchQuery, names: Map<string, string>) {
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
        })
      );
    }
  }
  return out;
}

async function fetchCalendar(origin: string, dest: string, q: SearchQuery, names: Map<string, string>) {
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
  airlineName?: string;
  flightNumber?: string;
  departAt?: string;
  returnAt?: string;
  durationMin?: number;
  foundAt?: string;
  names: Map<string, string>;
}): LiveOffer {
  const airline = input.airline || undefined;
  const depart = input.departAt?.slice(0, 10);
  const ret = input.returnAt?.slice(0, 10);
  return {
    id: input.id,
    source: "travelpayouts",
    kind: "flights",
    title: airline ? `${input.names.get(airline) || airline}` : "Live fare",
    airline,
    airlineName: airline ? input.names.get(airline) : undefined,
    flightNumber: input.flightNumber || undefined,
    priceCad: Math.round(input.price),
    stops: input.stops,
    departAt: input.departAt,
    returnAt: input.returnAt,
    durationMin: input.durationMin,
    url: bookingUrl(input.origin, input.dest, depart, ret),
    foundAt: input.foundAt,
    live: true,
  };
}
