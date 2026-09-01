import type { SearchQuery } from "@/lib/deeplinks";
import { searchCodes } from "@/lib/iata-cities";
import {
  PARTNER_META,
  type PartnerKey,
  airlineLogo,
  aviasalesUrl,
  agodaUrl,
  bookingHotelsUrl,
  compareLinksFor,
  discoverCarsUrl,
  expediaCarsUrl,
  expediaFlightsUrl,
  expediaHotelsUrl,
  expediaPackagesUrl,
  googleFlightsUrl,
  hotelsComUrl,
  hotellookSearchUrl,
  kayakCarsUrl,
  kayakFlightsUrl,
  kayakHotelsUrl,
  rentalcarsUrl,
  skyscannerFlightsUrl,
  type CompareLink,
} from "@/lib/partners";
import { tpTrack, tpWrap } from "@/lib/affiliate";
import { getAirport, getDestination } from "@/lib/airports";
import { searchEsim } from "@/lib/esim";
import { addDays, fromIso, nightsBetweenIso, pad2, todayIso } from "@/lib/dates";
import { scrapeFares, type ScrapedFare } from "@/lib/scrape-prices";

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
  compare?: CompareLink[];
  nearbyAirport?: boolean;
  routeNote?: string;
};

/** Smaller Canadian cities often have no Aviasales cache; try the nearest major hub. */
const ORIGIN_HUBS: Record<string, string[]> = {
  YEG: ["YYC"],
  YQR: ["YWG", "YXE"],
  YXE: ["YWG", "YYC"],
  YYJ: ["YVR"],
  YXX: ["YVR"],
  YLW: ["YVR"],
  YKA: ["YVR"],
  YQB: ["YUL"],
  YFC: ["YHZ"],
  YQM: ["YHZ"],
  YYG: ["YHZ"],
  YYT: ["YHZ"],
  YQT: ["YWG", "YYZ"],
  YMM: ["YYC", "YEG"],
  YQU: ["YYC", "YEG"],
  YXH: ["YYC"],
  YQL: ["YYC"],
  YCD: ["YVR"],
  YQQ: ["YVR"],
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
  const boards: Array<[PartnerKey, string | undefined]> =
    q.kind === "flights"
      ? [
          ["aviasales", aviasalesUrl(q)],
          ["expedia", expediaFlightsUrl(q)],
          ["kayak", kayakFlightsUrl(q)],
          ["skyscanner", skyscannerFlightsUrl(q)],
          ["google", googleFlightsUrl(q)],
        ]
      : q.kind === "stays"
        ? [
            ["booking", bookingHotelsUrl(q)],
            ["expedia", expediaHotelsUrl(q)],
            ["kayak", kayakHotelsUrl(q)],
            ["hotels", hotelsComUrl(q)],
            ["agoda", agodaUrl(q)],
          ]
        : q.kind === "cars"
          ? [
              ["discover", discoverCarsUrl(q)],
              ["rentalcars", rentalcarsUrl(q)],
              ["kayak", kayakCarsUrl(q)],
              ["expedia", expediaCarsUrl(q)],
            ]
          : q.kind === "packages"
            ? [["expedia", expediaPackagesUrl()]]
            : [];
  return boards.flatMap(([key, url], i) => {
    const offer = offerFromPartner(key, q, url, { id: `board-${key}`, featured: i === 0 });
    return offer ? [offer] : [];
  });
}

function fromScraped(hit: ScrapedFare, q: SearchQuery, names: Map<string, string>): LiveOffer {
  const meta = PARTNER_META[hit.partnerKey];
  const airline = hit.airline;
  const checkout =
    q.kind === "flights"
      ? aviasalesUrl(q) || hit.url
      : q.kind === "stays"
        ? hotellookSearchUrl(q)
        : q.kind === "cars"
          ? tpTrack("getrentacar")
          : hit.url;
  return {
    id: `scrape-${hit.partnerKey}-${airline || "x"}-${hit.flightNumber || hit.title || ""}-${hit.priceCad}`,
    source: q.kind === "flights" ? "travelpayouts" : "partner",
    kind: q.kind,
    title: hit.title || (airline ? names.get(airline) || airline : meta.name),
    partner: q.kind === "flights" ? "Aviasales" : q.kind === "stays" ? "Hotellook" : meta.name,
    partnerKey: q.kind === "flights" ? "aviasales" : hit.partnerKey,
    domain: q.kind === "flights" ? "aviasales.com" : meta.domain,
    color: meta.color,
    tagline: meta.tagline,
    taglineFr: meta.taglineFr,
    airline,
    airlineName: airline ? names.get(airline) || airline : undefined,
    airlineLogo: airlineLogo(airline),
    flightNumber: hit.flightNumber,
    originAirport: q.from?.toUpperCase(),
    destAirport: q.to?.toUpperCase(),
    priceCad: hit.priceCad,
    priceUnit: q.kind === "stays" ? "night" : q.kind === "cars" ? "day" : "person",
    adults: q.adults || 1,
    stops: hit.stops,
    departAt: q.depart,
    returnAt: q.returnDate,
    url: checkout,
    live: true,
    compare: compareLinksFor(q, { aviasales: hit.priceCad }),
  };
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

function placeName(code?: string) {
  const c = (code || "").toUpperCase();
  if (!c) return "";
  return getAirport(c)?.city || getDestination(c)?.city || c;
}

function isIsoDay(value?: string): value is string {
  return /^\d{4}-\d{2}-\d{2}$/.test(value || "");
}

/** Travelpayouts returns `data` as an array, a nested object, or `prices` (nearest-places). */
function tpRows(json: unknown): Record<string, unknown>[] {
  if (!json || typeof json !== "object") return [];
  const root = json as Record<string, unknown>;
  const data = root.data ?? root.prices;
  const rows: Record<string, unknown>[] = [];
  const push = (value: unknown, key?: string) => {
    if (!value) return;
    if (Array.isArray(value)) {
      value.forEach((item) => push(item, key));
      return;
    }
    if (typeof value !== "object") return;
    const obj = value as Record<string, unknown>;
    if (obj.price != null || obj.value != null) {
      const row = { ...obj };
      if (key && isIsoDay(key.slice(0, 10)) && !row.departure_at && !row.depart_date) {
        row.depart_date = key.slice(0, 10);
      }
      rows.push(row);
      return;
    }
    for (const [childKey, child] of Object.entries(obj)) push(child, childKey);
  };
  if (data && typeof data === "object" && !Array.isArray(data)) {
    for (const [key, child] of Object.entries(data)) push(child, key);
  } else {
    push(data);
  }
  return rows;
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

export type MonthDeal = {
  depart: string;
  returnDate?: string;
  priceCad: number;
  stops?: number;
  /** Outbound + return one-ways. */
  paired?: boolean;
  /** 2× outbound used only when no return-direction cache exists. */
  estimated?: boolean;
};

function daysInMonth(ym: string) {
  const [y, m] = ym.split("-").map(Number);
  const last = new Date(y, m, 0).getDate();
  const today = todayIso();
  const out: string[] = [];
  for (let d = 1; d <= last; d++) {
    const iso = `${y}-${pad2(m)}-${pad2(d)}`;
    if (iso >= today) out.push(iso);
  }
  return out;
}

function nextYearMonth(ym: string) {
  const [y, m] = ym.split("-").map(Number);
  const d = new Date(y, m, 1);
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}`;
}

function sampleDaysInMonth(ym: string, n = 4) {
  const days = daysInMonth(ym);
  if (!days.length) return [];
  if (days.length <= n) return days;
  const out: string[] = [];
  for (let i = 0; i < n; i++) {
    const idx = Math.round((i * (days.length - 1)) / Math.max(1, n - 1));
    const day = days[idx];
    if (day && !out.includes(day)) out.push(day);
  }
  return out;
}

function stayMatches(depart: string, returnDate: string | undefined, nights: number) {
  if (!returnDate) return false;
  const n = nightsBetweenIso(depart, returnDate);
  return Boolean(n && Math.abs(n - nights) <= 2);
}

function dealKind(deal: MonthDeal) {
  if (!deal.paired) return 0;
  if (!deal.estimated) return 1;
  return 2;
}

function betterMonthDeal(prev: MonthDeal | undefined, deal: MonthDeal) {
  if (!prev) return deal;
  const prevKind = dealKind(prev);
  const nextKind = dealKind(deal);
  if (nextKind < prevKind) return deal;
  if (nextKind > prevKind) return prev;
  if (deal.priceCad < prev.priceCad) return deal;
  if (deal.priceCad === prev.priceCad && (deal.returnDate || "") < (prev.returnDate || "")) return deal;
  return prev;
}

export function mergeMonthDeals(deals: MonthDeal[]) {
  const best = new Map<string, MonthDeal>();
  for (const deal of deals) {
    if (!isIsoDay(deal.depart) || deal.priceCad <= 0) continue;
    best.set(deal.depart, betterMonthDeal(best.get(deal.depart), deal));
  }
  return [...best.values()].sort((a, b) => a.priceCad - b.priceCad || a.depart.localeCompare(b.depart)).slice(0, 16);
}

function cheapestByDay(hits: FareHit[], months?: string[]) {
  const best = new Map<string, number>();
  for (const hit of hits) {
    if (!isIsoDay(hit.depart) || hit.priceCad <= 0) continue;
    if (months && !months.some((ym) => hit.depart.startsWith(ym))) continue;
    const prev = best.get(hit.depart);
    if (prev == null || hit.priceCad < prev) best.set(hit.depart, hit.priceCad);
  }
  return best;
}

function nearestReturnFare(inbound: Map<string, number>, depart: string, nights: number) {
  let best: { day: string; price: number; score: number } | undefined;
  for (const [day, price] of inbound) {
    if (day <= depart) continue;
    const n = nightsBetweenIso(depart, day);
    if (!n) continue;
    const delta = Math.abs(n - nights);
    if (delta > 4) continue;
    const score = delta * 400 + price;
    if (!best || score < best.score) best = { day, price, score };
  }
  return best;
}

/** Build round trips from outbound + inbound one-ways. Last resort: 2× outbound. */
export function pairOneWayDeals(
  outbound: Map<string, number>,
  inbound: Map<string, number>,
  month: string,
  nights: number
): MonthDeal[] {
  const deals: MonthDeal[] = [];
  const hasInbound = inbound.size > 0;
  for (const [depart, outPrice] of outbound) {
    if (!depart.startsWith(month)) continue;
    const back = nearestReturnFare(inbound, depart, nights);
    if (back) {
      deals.push({
        depart,
        returnDate: back.day,
        priceCad: outPrice + back.price,
        paired: true,
      });
      continue;
    }
    if (!hasInbound) {
      deals.push({
        depart,
        returnDate: addDays(depart, nights),
        priceCad: outPrice * 2,
        paired: true,
        estimated: true,
      });
    }
  }
  return deals;
}

export function monthDealsFromOffers(q: SearchQuery, offers: LiveOffer[]): MonthDeal[] {
  const month = q.flexMonth || (q.depart || "").slice(0, 7);
  if (!month) return [];
  const nights = Math.max(1, Math.min(28, q.nights || 7));
  const round = q.trip !== "oneway";
  const ticketed: MonthDeal[] = [];
  const outbound = new Map<string, number>();
  for (const offer of offers) {
    const priceCad = Math.round(offer.priceCad || 0);
    const depart = isoDay(offer.departAt);
    if (!priceCad || !isIsoDay(depart) || !depart.startsWith(month)) continue;
    const returnDate = isoDay(offer.returnAt);
    if (round && stayMatches(depart, returnDate, nights)) {
      ticketed.push({ depart, returnDate, priceCad, stops: offer.stops });
      continue;
    }
    const prev = outbound.get(depart);
    if (prev == null || priceCad < prev) outbound.set(depart, priceCad);
  }
  if (!round) {
    return mergeMonthDeals(
      [...outbound.entries()].map(([depart, priceCad]) => ({ depart, priceCad }))
    );
  }
  return mergeMonthDeals([...ticketed, ...pairOneWayDeals(outbound, new Map(), month, nights)]);
}

export async function cheapestMonthDeals(q: SearchQuery): Promise<MonthDeal[]> {
  const month = q.flexMonth || (q.depart || "").slice(0, 7);
  if (!month || q.kind !== "flights") return [];
  const origins = searchCodes(q.from);
  const dests = searchCodes(q.to);
  const origin = origins[0];
  const dest = dests[0];
  if (!origin || !dest) return [];
  const nights = Math.max(1, Math.min(28, q.nights || 7));
  const round = q.trip !== "oneway";
  const following = nextYearMonth(month);
  const samples = sampleDaysInMonth(month, 4);
  const outJobs: Promise<FareHit[]>[] = [
    fetchDateHits(pricesForDatesPath(origin, dest, month, undefined, true, false)),
    fetchDateHits(pricesForDatesPath(origin, dest, following, undefined, true, false)),
    fetchDateHits(pricesForDatesPath(origin, dest, month, following, false, false)),
    fetchDateHits(
      `https://api.travelpayouts.com/v1/prices/calendar?${new URLSearchParams({
        origin,
        destination: dest,
        depart_date: `${month}-01`,
        calendar_type: "departure_date",
        currency: "cad",
      }).toString()}`
    ),
    fetchDateHits(
      `https://api.travelpayouts.com/v2/prices/month-matrix?${new URLSearchParams({
        origin,
        destination: dest,
        month: `${month}-01`,
        currency: "cad",
        show_to_affiliates: "true",
        one_way: round ? "false" : "true",
        trip_duration: String(Math.max(1, Math.round(nights / 7))),
        limit: "31",
      }).toString()}`
    ),
    fetchDateHits(
      `https://api.travelpayouts.com/v2/prices/month-matrix?${new URLSearchParams({
        origin,
        destination: dest,
        month: `${month}-01`,
        currency: "cad",
        show_to_affiliates: "true",
        one_way: "true",
        limit: "31",
      }).toString()}`
    ),
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
    ),
    fetchDateHits(groupedPricesPath(origin, dest, month, round ? following : undefined)),
  ];
  for (const day of samples) {
    outJobs.push(fetchDateHits(pricesForDatesPath(origin, dest, day, undefined, true, false)));
    if (round) outJobs.push(fetchDateHits(pricesForDatesPath(origin, dest, day, addDays(day, nights), false, false)));
  }
  const inJobs: Promise<FareHit[]>[] = round
    ? [
        fetchDateHits(pricesForDatesPath(dest, origin, month, undefined, true, false)),
        fetchDateHits(pricesForDatesPath(dest, origin, following, undefined, true, false)),
        fetchDateHits(
          `https://api.travelpayouts.com/v2/prices/month-matrix?${new URLSearchParams({
            origin: dest,
            destination: origin,
            month: `${month}-01`,
            currency: "cad",
            show_to_affiliates: "true",
            one_way: "true",
            limit: "31",
          }).toString()}`
        ),
        fetchDateHits(
          `https://api.travelpayouts.com/v2/prices/month-matrix?${new URLSearchParams({
            origin: dest,
            destination: origin,
            month: `${following}-01`,
            currency: "cad",
            show_to_affiliates: "true",
            one_way: "true",
            limit: "31",
          }).toString()}`
        ),
        fetchDateHits(
          `https://api.travelpayouts.com/v1/prices/calendar?${new URLSearchParams({
            origin: dest,
            destination: origin,
            depart_date: `${month}-01`,
            calendar_type: "departure_date",
            currency: "cad",
          }).toString()}`
        ),
        fetchDateHits(
          `https://api.travelpayouts.com/v2/prices/latest?${new URLSearchParams({
            origin: dest,
            destination: origin,
            currency: "cad",
            period_type: "year",
            page: "1",
            limit: "30",
            show_to_affiliates: "true",
            sorting: "price",
          }).toString()}`
        ),
        ...samples.map((day) =>
          fetchDateHits(pricesForDatesPath(dest, origin, addDays(day, nights), undefined, true, false))
        ),
      ]
    : [];
  const settled = await Promise.allSettled([...outJobs, ...inJobs]);
  const outHits: FareHit[] = [];
  const inHits: FareHit[] = [];
  settled.forEach((item, i) => {
    if (item.status !== "fulfilled") return;
    if (i < outJobs.length) outHits.push(...item.value);
    else inHits.push(...item.value);
  });
  if (!round) {
    return mergeMonthDeals(
      outHits
        .filter((hit) => isIsoDay(hit.depart) && hit.depart.startsWith(month))
        .map((hit) => ({ depart: hit.depart, priceCad: hit.priceCad }))
    );
  }
  const ticketed: MonthDeal[] = [];
  for (const hit of outHits) {
    if (!isIsoDay(hit.depart) || !hit.depart.startsWith(month)) continue;
    if (!stayMatches(hit.depart, hit.returnDate, nights)) continue;
    ticketed.push({ depart: hit.depart, returnDate: hit.returnDate, priceCad: hit.priceCad });
  }
  const outbound = cheapestByDay(outHits, [month]);
  const inbound = cheapestByDay(inHits, [month, following]);
  return mergeMonthDeals([...ticketed, ...pairOneWayDeals(outbound, inbound, month, nights)]);
}

/** Pin to a real cheapest day when we have one. Otherwise probe mid-month so live search/scrape can still run. */
export function flexFallbackDates(q: SearchQuery, deals: MonthDeal[]) {
  if (deals[0] && isIsoDay(deals[0].depart)) {
    return { depart: deals[0].depart, returnDate: deals[0].returnDate };
  }
  const month = q.flexMonth;
  if (!month) return {};
  const days = daysInMonth(month);
  if (!days.length) return {};
  const day = days[Math.floor((days.length - 1) / 2)] || days[0];
  const nights = Math.max(1, q.nights || 7);
  return {
    depart: day,
    returnDate: q.trip === "oneway" ? undefined : addDays(day, nights),
  };
}

export async function searchLive(q: SearchQuery): Promise<LiveOffer[]> {
  if (q.kind === "esim") return searchEsim(q);
  const names = await airlines();
  const scrapedTask = scrapeFares(q).catch(() => [] as ScrapedFare[]);
  if (q.kind === "stays") {
    const [hotels, scraped] = await Promise.all([fetchHotelPrices(q), scrapedTask]);
    return [...hotels, ...scraped.map((hit) => fromScraped(hit, q, names))];
  }
  if (q.kind === "cars" || q.kind === "packages") {
    const scraped = await scrapedTask;
    return scraped.map((hit) => fromScraped(hit, q, names));
  }
  if (q.kind !== "flights") return [];
  const origins = searchCodes(q.from);
  const dests = searchCodes(q.to);
  const adults = q.adults || 1;
  const pairs: Promise<PromiseSettledResult<LiveOffer[]>[]>[] = [];

  for (const origin of origins.slice(0, 2)) {
    for (const dest of dests.slice(0, 2)) {
      const primary = origin === origins[0] && dest === dests[0];
      const jobs: Promise<LiveOffer[]>[] = [
        fetchDates(origin, dest, q, names, adults, "price", 50),
        fetchDirect(origin, dest, q, names, adults),
        fetchWeek(origin, dest, q, names, adults),
        fetchCheap(origin, dest, q, names, adults),
        fetchCalendar(origin, dest, q, names, adults),
      ];
      if (primary) {
        jobs.push(
          fetchMonthMatrix(origin, dest, q, names, adults),
          fetchLatest(origin, dest, q, names, adults),
          fetchNearest(origin, dest, q, names, adults),
          fetchGrouped(origin, dest, q, names, adults)
        );
      }
      pairs.push(Promise.allSettled(jobs));
    }
  }

  const found: LiveOffer[] = [];
  const [batches, scraped] = await Promise.all([Promise.all(pairs), scrapedTask]);
  for (const batch of batches) {
    for (const item of batch) {
      if (item.status === "fulfilled") found.push(...item.value);
    }
  }
  found.push(...scraped.map((hit) => fromScraped(hit, q, names)));

  let priced = found.filter((o) => (o.priceCad || 0) > 0);
  if (!priced.length) {
    const hubs = ORIGIN_HUBS[origins[0]] || [];
    const dest = dests[0];
    if (hubs.length && dest) {
      const extra = await Promise.allSettled(
        hubs.flatMap((hub) => [
          fetchDates(hub, dest, { ...q, from: hub }, names, adults, "price", 30),
          fetchMonthMatrix(hub, dest, { ...q, from: hub }, names, adults),
          fetchLatest(hub, dest, { ...q, from: hub }, names, adults),
          fetchNearest(hub, dest, { ...q, from: hub }, names, adults),
        ])
      );
      for (const item of extra) {
        if (item.status !== "fulfilled") continue;
        for (const offer of item.value) {
          if ((offer.priceCad || 0) <= 0) continue;
          offer.nearbyAirport = true;
          offer.routeNote = `From ${placeName(offer.originAirport)}`;
          priced.push(offer);
        }
      }
    }
  }

  const seen = new Set<string>();
  const sameRoute = priced.filter((o) => !o.nearbyAirport);
  const nonstop = sameRoute.filter((o) => o.stops === 0);
  const pool = q.directOnly && nonstop.length ? nonstop : sameRoute.length ? sameRoute : priced;
  return pool
    .sort((a, b) =>
      q.flexMonth
        ? (a.priceCad || 0) - (b.priceCad || 0)
        : dateBand(a, q.depart) - dateBand(b, q.depart) || (a.priceCad || 0) - (b.priceCad || 0)
    )
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
  const today = todayIso();
  const out: FareHit[] = [];
  for (const row of tpRows(json)) {
    const price = Math.round(Number(row.price ?? row.value ?? 0));
    if (!price) continue;
    const depart = isoDay(String(row.departure_at || row.depart_date || ""));
    if (!isIsoDay(depart) || depart < today) continue;
    const ret = isoDay(String(row.return_at || row.return_date || ""));
    out.push({
      depart,
      returnDate: isIsoDay(ret) && ret >= depart ? ret : undefined,
      priceCad: price,
    });
  }
  return out;
}

async function fetchDateHits(path: string) {
  const json = await tp(path);
  return parseFareHits(json);
}

function pricesForDatesPath(origin: string, dest: string, departAt: string, returnAt?: string, oneWay = false, direct = false) {
  const params = new URLSearchParams({
    origin,
    destination: dest,
    currency: "cad",
    cy: "cad",
    market: "ca",
    sorting: "price",
    direct: direct ? "true" : "false",
    limit: "100",
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
  const periods: Array<{ dep: string; ret?: string; oneWay: boolean }> = [];
  const months = new Set<string>();
  if (q.flexMonth) months.add(q.flexMonth);
  if (q.depart) months.add(q.depart.slice(0, 7));
  if (q.returnDate) months.add(q.returnDate.slice(0, 7));
  if (!months.size) months.add(todayIso().slice(0, 7));
  for (const month of [...months]) months.add(nextYearMonth(month));

  if (q.depart && round && q.returnDate) periods.push({ dep: q.depart, ret: q.returnDate, oneWay: false });
  if (q.depart) periods.push({ dep: q.depart, oneWay: true });
  for (const month of months) {
    periods.push({ dep: month, oneWay: true });
    periods.push({ dep: month, ret: month, oneWay: false });
  }

  const jsons = await Promise.all(
    periods.map((period) => {
      const params = new URLSearchParams({
        origin,
        destination: dest,
        currency: "cad",
        cy: "cad",
        market: "ca",
        sorting,
        direct: "false",
        limit: String(limit),
        unique: "false",
        one_way: period.oneWay ? "true" : "false",
        departure_at: period.dep,
        page: "1",
      });
      if (!period.oneWay && period.ret) params.set("return_at", period.ret);
      return tp(`https://api.travelpayouts.com/aviasales/v3/prices_for_dates?${params.toString()}`);
    })
  );
  const rows = jsons.flatMap((json) => tpRows(json));
  return rows.map((row: Record<string, unknown>, i: number) =>
    toOffer({
      id: `dates-${sorting}-${origin}-${dest}-${String(row.departure_at || "").slice(0, 16)}-${row.price}-${i}`,
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
      returnAt: String(row.return_at || ""),
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
    const offer = offerFromPartner("booking", q, hotellookSearchUrl(q), {
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

function rowsToOffers(
  rows: Record<string, unknown>[],
  prefix: string,
  origin: string,
  dest: string,
  q: SearchQuery,
  names: Map<string, string>,
  adults: number
) {
  return rows.map((row, i) =>
    toOffer({
      id: `${prefix}-${origin}-${dest}-${String(row.departure_at || row.depart_date || "").slice(0, 16)}-${row.price ?? row.value}-${i}`,
      origin: String(row.origin || origin),
      dest: String(row.destination || dest),
      originAirport: String(row.origin_airport || row.origin || origin),
      destAirport: String(row.destination_airport || row.destination || dest),
      price: Number(row.price ?? row.value),
      stops: Number(row.transfers ?? row.number_of_changes ?? 0),
      returnStops: row.return_transfers != null ? Number(row.return_transfers) : undefined,
      airline: String(row.airline || row.main_airline || ""),
      flightNumber: String(row.flight_number || ""),
      departAt: String(row.departure_at || row.depart_date || q.depart || ""),
      returnAt: String(row.return_at || row.return_date || ""),
      durationMin: minutes(row.duration_to ?? row.duration),
      durationBack: minutes(row.duration_back),
      foundAt: String(row.found_at || row.expires_at || ""),
      link: typeof row.link === "string" ? row.link : undefined,
      names,
      adults,
      q,
    })
  );
}

async function fetchMonthMatrix(
  origin: string,
  dest: string,
  q: SearchQuery,
  names: Map<string, string>,
  adults: number
) {
  const month = (q.flexMonth || q.depart || todayIso()).slice(0, 7);
  const months = [...new Set([month, nextYearMonth(month)])];
  const jsons = await Promise.all(
    months.map((ym) =>
      tp(
        `https://api.travelpayouts.com/v2/prices/month-matrix?${new URLSearchParams({
          origin,
          destination: dest,
          month: `${ym}-01`,
          currency: "cad",
          show_to_affiliates: "true",
          one_way: "true",
          limit: "31",
        }).toString()}`
      )
    )
  );
  return rowsToOffers(jsons.flatMap((json) => tpRows(json)), "matrix", origin, dest, q, names, adults);
}

async function fetchLatest(
  origin: string,
  dest: string,
  q: SearchQuery,
  names: Map<string, string>,
  adults: number
) {
  const json = await tp(
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
  );
  return rowsToOffers(tpRows(json), "latest", origin, dest, q, names, adults);
}

async function fetchNearest(
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
    show_to_affiliates: "true",
    distance: "1000",
    limit: "7",
  });
  if (q.depart) params.set("depart_date", q.depart);
  if (q.returnDate && q.trip !== "oneway") params.set("return_date", q.returnDate);
  const json = await tp(`https://api.travelpayouts.com/v2/prices/nearest-places-matrix?${params.toString()}`);
  return rowsToOffers(tpRows(json), "near", origin, dest, q, names, adults);
}

async function fetchGrouped(
  origin: string,
  dest: string,
  q: SearchQuery,
  names: Map<string, string>,
  adults: number
) {
  const month = (q.flexMonth || q.depart || todayIso()).slice(0, 7);
  const json = await tp(groupedPricesPath(origin, dest, month));
  return rowsToOffers(tpRows(json), "grouped", origin, dest, q, names, adults);
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
  const originAirport = (input.originAirport || input.origin).toUpperCase();
  const destAirport = (input.destAirport || input.dest).toUpperCase();
  const askedFrom = new Set(searchCodes(input.q.from).map((c) => c.toUpperCase()));
  const askedTo = new Set(searchCodes(input.q.to).map((c) => c.toUpperCase()));
  const fromOff = askedFrom.size > 0 && !askedFrom.has(originAirport) && !askedFrom.has(input.origin.toUpperCase());
  const toOff = askedTo.size > 0 && !askedTo.has(destAirport) && !askedTo.has(input.dest.toUpperCase());
  const nearbyAirport = fromOff || toOff;
  const routeNote = nearbyAirport
    ? `${placeName(originAirport) || originAirport} → ${placeName(destAirport) || destAirport}`
    : undefined;
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
    originAirport,
    destAirport,
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
    nearbyAirport,
    routeNote,
    compare: compareLinksFor(
      {
        ...input.q,
        from: input.origin,
        to: input.dest,
        depart: input.departAt?.slice(0, 10) || input.q.depart,
        returnDate: input.returnAt?.slice(0, 10) || input.q.returnDate,
        adults: input.adults,
      },
      { aviasales: Math.round(input.price) }
    ),
  };
}

function arriveIso(depart?: string, min?: number) {
  if (!depart || !min || depart.length < 16) return undefined;
  const d = new Date(depart);
  if (Number.isNaN(d.getTime())) return undefined;
  return new Date(d.getTime() + min * 60000).toISOString();
}
