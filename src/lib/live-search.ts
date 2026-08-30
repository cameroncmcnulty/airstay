import type { SearchQuery } from "@/lib/deeplinks";
import { searchCodes } from "@/lib/iata-cities";
import {
  PARTNER_META,
  type PartnerKey,
  airlineLogo,
  aviasalesUrl,
  bookingHotelsUrl,
  expediaFlightsUrl,
  googleFlightsUrl,
  kayakFlightsUrl,
  skyscannerFlightsUrl,
} from "@/lib/partners";
import { tpTrack, tpWrap } from "@/lib/affiliate";
import { searchEsim } from "@/lib/esim";
import { fromIso, nightsBetweenIso, pad2, todayIso } from "@/lib/dates";

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
  priceUnit?: "trip" | "night" | "day" | "person" | "plan";
  dataGb?: number;
  unlimited?: boolean;
  validityDays?: number;
  operator?: string;
  network?: string;
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
  if (o.kind === "esim") {
    if (o.unlimited) return 1;
    return 80 / Math.max(0.5, o.dataGb || 1);
  }
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
  if (q.kind !== "flights") return [];
  const boards: Array<[PartnerKey, string | undefined]> = [
    ["aviasales", aviasalesUrl(q)],
    ["expedia", expediaFlightsUrl(q)],
    ["kayak", kayakFlightsUrl(q)],
    ["skyscanner", skyscannerFlightsUrl(q)],
    ["google", googleFlightsUrl(q)],
  ];
  return boards.flatMap(([key, url], i) => {
    const offer = offerFromPartner(key, q, url, { id: `board-${key}`, featured: i === 0 });
    return offer ? [offer] : [];
  });
}

async function tp(path: string) {
  const url = path.includes("?") ? `${path}&token=${TOKEN}` : `${path}?token=${TOKEN}`;
  const res = await fetch(url, {
    headers: { "x-access-token": TOKEN, Accept: "application/json" },
    next: { revalidate: 600 },
  });
  if (!res.ok) return null;
  return res.json();
}

function dateBand(offer: LiveOffer, wanted?: string) {
  const day = isoDay(offer.departAt);
  if (!wanted || !day) return 3;
  const n = daysBetween(day, wanted);
  if (n === 0) return 0;
  if (n <= 3) return 1;
  if (n <= 10) return 2;
  return 3;
}

export async function searchLive(q: SearchQuery): Promise<LiveOffer[]> {
  if (q.kind === "esim") return searchEsim(q);
  if (q.kind === "stays") return fetchHotelPrices(q);
  if (q.kind === "cars") return [];
  if (q.kind !== "flights") return [];
  const origins = searchCodes(q.from);
  const dests = searchCodes(q.to);
  const names = await airlines();
  const adults = q.adults || 1;
  const pairs: Promise<PromiseSettledResult<LiveOffer[]>[]>[] = [];

  for (const origin of origins.slice(0, 2)) {
    for (const dest of dests.slice(0, 2)) {
      pairs.push(
        Promise.allSettled([
          fetchDates(origin, dest, q, names, adults, "price", 50),
          fetchDirect(origin, dest, q, names, adults),
          fetchWeek(origin, dest, q, names, adults),
          fetchCheap(origin, dest, q, names, adults),
          fetchCalendar(origin, dest, q, names, adults),
        ])
      );
    }
  }

  const found: LiveOffer[] = [];
  for (const batch of await Promise.all(pairs)) {
    for (const item of batch) {
      if (item.status === "fulfilled") found.push(...item.value);
    }
  }

  const seen = new Set<string>();
  return found
    .filter((o) => (o.priceCad || 0) > 0)
    .sort((a, b) => dateBand(a, q.depart) - dateBand(b, q.depart) || (a.priceCad || 0) - (b.priceCad || 0))
    .filter((o) => {
      const key = [
        o.airline || o.title,
        o.flightNumber || "",
        o.priceCad,
        o.departAt?.slice(0, 16),
        o.originAirport,
        o.destAirport,
        o.stops,
        o.durationMin || 0,
      ].join("-");
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, 48);
}

export type DateChangeKind = "depart" | "return" | "both";

export type FlightDateOption = {
  change: DateChangeKind;
  depart: string;
  returnDate?: string;
  priceCad: number;
};

export type FlightDateSuggestions = {
  missing: DateChangeKind;
  options: FlightDateOption[];
};

type FareHit = { depart: string; returnDate?: string; priceCad: number };

function isoDay(value?: string) {
  return (value || "").slice(0, 10);
}

function monthsAround(iso: string, back = 0, ahead = 2) {
  const base = fromIso(iso.slice(0, 10) || todayIso());
  const start = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  const out: string[] = [];
  for (let i = -back; i <= ahead; i++) {
    const d = new Date(base.getFullYear(), base.getMonth() + i, 1);
    if (d < start) continue;
    out.push(`${d.getFullYear()}-${pad2(d.getMonth() + 1)}`);
  }
  return out.length ? out : [(iso || todayIso()).slice(0, 7)];
}

function daysBetween(a: string, b: string) {
  return Math.abs(fromIso(a).getTime() - fromIso(b).getTime()) / 86400000;
}

function parseFareHits(json: unknown): FareHit[] {
  if (!json || typeof json !== "object") return [];
  const data = (json as { data?: unknown }).data;
  const rows: Record<string, unknown>[] = [];
  if (Array.isArray(data)) {
    rows.push(...(data as Record<string, unknown>[]));
  } else if (data && typeof data === "object") {
    for (const value of Object.values(data as Record<string, unknown>)) {
      if (Array.isArray(value)) {
        rows.push(...(value as Record<string, unknown>[]));
      } else if (value && typeof value === "object") {
        const nested = value as Record<string, unknown>;
        const looksGrouped = Object.values(nested).some(
          (item) => item && typeof item === "object" && ("price" in (item as object) || "value" in (item as object))
        );
        if (looksGrouped && nested.price == null && nested.value == null) {
          rows.push(...(Object.values(nested) as Record<string, unknown>[]));
        } else {
          rows.push(nested);
        }
      }
    }
  }
  const today = todayIso();
  const out: FareHit[] = [];
  for (const row of rows) {
    if (!row || typeof row !== "object") continue;
    const price = Math.round(Number(row.price ?? row.value ?? 0));
    if (!price) continue;
    const depart = isoDay(String(row.departure_at || row.depart_date || ""));
    if (!depart || depart < today) continue;
    const ret = isoDay(String(row.return_at || row.return_date || ""));
    out.push({
      depart,
      returnDate: ret && ret >= depart ? ret : undefined,
      priceCad: price,
    });
  }
  return out;
}

async function fetchDateHits(path: string) {
  const json = await tp(path);
  return parseFareHits(json);
}

function pricesForDatesPath(origin: string, dest: string, departAt: string, returnAt?: string, oneWay = false) {
  const params = new URLSearchParams({
    origin,
    destination: dest,
    currency: "cad",
    cy: "cad",
    sorting: "price",
    direct: "false",
    limit: "30",
    unique: "false",
    page: "1",
    departure_at: departAt,
  });
  if (oneWay || !returnAt) params.set("one_way", "true");
  else {
    params.set("one_way", "false");
    params.set("return_at", returnAt);
  }
  return `https://api.travelpayouts.com/aviasales/v3/prices_for_dates?${params.toString()}`;
}

function groupedPricesPath(origin: string, dest: string, month: string, returnAt?: string, groupBy = "departure_at") {
  const params = new URLSearchParams({
    origin,
    destination: dest,
    currency: "cad",
    group_by: groupBy,
    departure_at: month,
  });
  if (returnAt) params.set("return_at", returnAt);
  return `https://api.travelpayouts.com/aviasales/v3/grouped_prices?${params.toString()}`;
}

function dedupeHits(hits: FareHit[]) {
  const best = new Map<string, FareHit>();
  for (const hit of hits) {
    const key = `${hit.depart}|${hit.returnDate || ""}`;
    const prev = best.get(key);
    if (!prev || hit.priceCad < prev.priceCad) best.set(key, hit);
  }
  return [...best.values()];
}

function pickHits(hits: FareHit[], n: number, score: (hit: FareHit) => number) {
  return [...hits]
    .sort((a, b) => score(a) - score(b) || a.priceCad - b.priceCad)
    .slice(0, n);
}

export async function suggestFlightDates(q: SearchQuery): Promise<FlightDateSuggestions | null> {
  if (q.kind !== "flights" || !q.from || !q.to || !q.depart) return null;
  const wantedDepart = q.depart;
  const wantedReturn = q.returnDate;
  const origins = searchCodes(q.from);
  const dests = searchCodes(q.to);
  const origin = origins[origins.length - 1];
  const dest = dests[dests.length - 1];
  if (!origin || !dest) return null;

  const round = q.trip !== "oneway" && Boolean(wantedReturn);
  const stay = round && wantedReturn ? nightsBetweenIso(wantedDepart, wantedReturn) : 0;
  const departMonths = monthsAround(wantedDepart, 0, 2);
  const returnMonths = round && wantedReturn ? monthsAround(wantedReturn, 0, 2) : [];

  const jobs: Promise<FareHit[]>[] = [
    fetchDateHits(pricesForDatesPath(origin, dest, wantedDepart, undefined, true)),
  ];

  if (round && wantedReturn) {
    jobs.push(fetchDateHits(pricesForDatesPath(origin, dest, wantedDepart, wantedReturn.slice(0, 7))));
    jobs.push(fetchDateHits(pricesForDatesPath(origin, dest, wantedDepart.slice(0, 7), wantedReturn)));
  }

  for (const month of departMonths) {
    const returnMonth = round ? returnMonths.find((item) => item >= month) || returnMonths[0] : undefined;
    jobs.push(fetchDateHits(pricesForDatesPath(origin, dest, month, returnMonth, !round)));
    jobs.push(fetchDateHits(groupedPricesPath(origin, dest, month, returnMonth)));
    if (round && returnMonth) {
      jobs.push(fetchDateHits(groupedPricesPath(origin, dest, month, returnMonth, "return_at")));
    }
  }

  jobs.push(
    fetchDateHits(
      `https://api.travelpayouts.com/v2/prices/latest?${new URLSearchParams({
        origin,
        destination: dest,
        currency: "cad",
        period_type: "year",
        page: "1",
        limit: "30",
        show_to_affiliates: "true",
        sorting: "price",
      }).toString()}`
    )
  );

  const settled = await Promise.allSettled(jobs);
  const hits: FareHit[] = [];
  for (const item of settled) {
    if (item.status === "fulfilled") hits.push(...item.value);
  }

  const unique = dedupeHits(hits).filter((hit) => {
    if (hit.depart === wantedDepart && (!round || hit.returnDate === wantedReturn)) return false;
    if (round && !hit.returnDate) return false;
    return true;
  });
  if (!unique.length) return null;

  const departHasFares = hits.some((hit) => hit.depart === wantedDepart);
  const returnHasFares = round && hits.some((hit) => hit.returnDate === wantedReturn);

  const keepReturn = unique.filter((hit) => round && hit.returnDate === wantedReturn && hit.depart !== wantedDepart);
  const keepDepart = unique.filter(
    (hit) => hit.depart === wantedDepart && hit.returnDate && hit.returnDate !== wantedReturn
  );
  const shiftBoth = unique.filter(
    (hit) => hit.depart !== wantedDepart && (!round || hit.returnDate !== wantedReturn)
  );

  const missing: DateChangeKind = !round
    ? "depart"
    : !departHasFares && returnHasFares
      ? "depart"
      : departHasFares && !returnHasFares
        ? "return"
        : "both";

  const nearDepart = (hit: FareHit) => daysBetween(hit.depart, wantedDepart) * 3 + hit.priceCad / 400;
  const nearReturn = (hit: FareHit) =>
    daysBetween(hit.returnDate || hit.depart, wantedReturn || wantedDepart) * 3 + hit.priceCad / 400;
  const nearTrip = (hit: FareHit) => {
    const nightDelta = stay && hit.returnDate ? Math.abs(nightsBetweenIso(hit.depart, hit.returnDate) - stay) : 0;
    const returnDelta = wantedReturn && hit.returnDate ? daysBetween(hit.returnDate, wantedReturn) : 0;
    return daysBetween(hit.depart, wantedDepart) * 2 + returnDelta * 2 + nightDelta * 4 + hit.priceCad / 500;
  };

  const options: FlightDateOption[] = [];
  const showDepart = !round ? unique.length > 0 : keepReturn.length > 0;
  const showReturn = round && keepDepart.length > 0;
  const showBoth =
    round &&
    ((!showDepart && !showReturn) || missing === "both" || keepReturn.length + keepDepart.length < 3);

  if (showDepart) {
    const pool = round ? keepReturn : unique;
    for (const hit of pickHits(pool, 4, round ? nearDepart : nearTrip)) {
      options.push({
        change: "depart",
        depart: hit.depart,
        returnDate: round ? wantedReturn : undefined,
        priceCad: hit.priceCad,
      });
    }
  }
  if (showReturn) {
    for (const hit of pickHits(keepDepart, 4, nearReturn)) {
      options.push({
        change: "return",
        depart: wantedDepart,
        returnDate: hit.returnDate,
        priceCad: hit.priceCad,
      });
    }
  }
  if (showBoth) {
    const used = new Set(options.map((o) => `${o.depart}|${o.returnDate || ""}`));
    for (const hit of pickHits(shiftBoth, 6, nearTrip)) {
      const key = `${hit.depart}|${hit.returnDate || ""}`;
      if (used.has(key)) continue;
      options.push({ change: "both", depart: hit.depart, returnDate: hit.returnDate, priceCad: hit.priceCad });
      if (options.filter((o) => o.change === "both").length >= 6) break;
    }
  }

  const cleaned = options.filter((o, i, all) => {
    if (!o.depart) return false;
    if (round && !o.returnDate) return false;
    return all.findIndex((x) => x.change === o.change && x.depart === o.depart && x.returnDate === o.returnDate) === i;
  });
  if (!cleaned.length) return null;
  return { missing, options: cleaned.slice(0, 12) };
}

async function fetchDates(
  origin: string,
  dest: string,
  q: SearchQuery,
  names: Map<string, string>,
  adults: number,
  sorting = "price",
  limit = 50
) {
  const round = q.trip !== "oneway" && Boolean(q.returnDate);
  const periods: Array<{ dep: string; ret?: string }> = [];
  if (q.depart) periods.push({ dep: q.depart, ret: round ? q.returnDate : undefined });
  if (q.depart) {
    const depMonth = q.depart.slice(0, 7);
    const retMonth = round && q.returnDate ? q.returnDate.slice(0, 7) : undefined;
    if (!periods.some((p) => p.dep === depMonth && p.ret === retMonth)) {
      periods.push({ dep: depMonth, ret: retMonth });
    }
  }
  const jsons = await Promise.all(
    periods.map((period) => {
      const params = new URLSearchParams({
        origin,
        destination: dest,
        currency: "cad",
        cy: "cad",
        sorting,
        direct: "false",
        limit: String(limit),
        unique: "false",
        one_way: round && period.ret ? "false" : "true",
        departure_at: period.dep,
        page: "1",
      });
      if (period.ret) params.set("return_at", period.ret);
      return tp(`https://api.travelpayouts.com/aviasales/v3/prices_for_dates?${params.toString()}`);
    })
  );
  const rows = jsons.flatMap((json) => (Array.isArray(json?.data) ? json.data : []));
  return rows.map((row: Record<string, unknown>, i: number) =>
    toOffer({
      id: `dates-${sorting}-${origin}-${dest}-${i}`,
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
    limit: "24",
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
  if (month) params.set("depart_date", month);
  if (q.returnDate && q.trip !== "oneway") params.set("return_date", q.returnDate.slice(0, 7));
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
    .filter(([day]) => !wanted || day === wanted || Math.abs(Date.parse(day) - Date.parse(wanted)) <= 14 * 86400000)
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
  const raw = input.link
    ? input.link.startsWith("http")
      ? input.link
      : `https://www.aviasales.com${input.link.startsWith("/") ? "" : "/"}${input.link}`
    : built;
  const link = tpWrap(raw) || tpTrack("aviasales", raw);
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
