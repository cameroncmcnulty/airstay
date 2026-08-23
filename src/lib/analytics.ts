import { mkdirSync, readFileSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { getDestination } from "@/lib/airports";

export type AnalyticsEvent = {
  id: string;
  at: string;
  type: "search" | "outbound";
  kind: string;
  origin?: string;
  destination?: string;
  destCity?: string;
  destCountry?: string;
  partner?: string;
  depart?: string;
  returnDate?: string;
  adults?: number;
  results?: number;
};

const MAX = 4000;
const memory: AnalyticsEvent[] = [];
let loaded = false;

function paths() {
  return [join(process.cwd(), "data", "analytics.json"), join("/tmp", "airstay-analytics.json")];
}

function load() {
  if (loaded) return;
  loaded = true;
  const seen = new Set<string>();
  for (const file of paths()) {
    try {
      const raw = readFileSync(file, "utf8");
      const rows = JSON.parse(raw) as AnalyticsEvent[];
      if (!Array.isArray(rows)) continue;
      for (const row of rows) {
        if (!row?.id || seen.has(row.id)) continue;
        seen.add(row.id);
        memory.push(row);
      }
    } catch {
      /* missing or unreadable */
    }
  }
  memory.sort((a, b) => b.at.localeCompare(a.at));
  if (memory.length > MAX) memory.length = MAX;
}

function persist() {
  const json = JSON.stringify(memory, null, 0);
  for (const file of paths()) {
    try {
      mkdirSync(dirname(file), { recursive: true });
      writeFileSync(file, json);
    } catch {
      /* read-only host */
    }
  }
}

export function recordEvent(input: Omit<AnalyticsEvent, "id" | "at"> & { at?: string }) {
  load();
  const dest = input.destination ? getDestination(input.destination) : undefined;
  const event: AnalyticsEvent = {
    id: `ev-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    at: input.at || new Date().toISOString(),
    type: input.type,
    kind: input.kind,
    origin: input.origin,
    destination: input.destination,
    destCity: input.destCity || dest?.city,
    destCountry: input.destCountry || dest?.country,
    partner: input.partner,
    depart: input.depart,
    returnDate: input.returnDate,
    adults: input.adults,
    results: input.results,
  };
  memory.unshift(event);
  if (memory.length > MAX) memory.length = MAX;
  persist();
  return event;
}

export function listEvents(limit = 200) {
  load();
  return memory.slice(0, limit);
}

function monthKey(iso: string) {
  return iso.slice(0, 7);
}

function lastMonths(n: number) {
  const out: string[] = [];
  const d = new Date();
  d.setDate(1);
  for (let i = 0; i < n; i++) {
    out.unshift(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
    d.setMonth(d.getMonth() - 1);
  }
  return out;
}

function lastDays(n: number) {
  const out: string[] = [];
  const d = new Date();
  for (let i = 0; i < n; i++) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    out.unshift(`${y}-${m}-${day}`);
    d.setDate(d.getDate() - 1);
  }
  return out;
}

const KINDS = ["flights", "stays", "cars"] as const;

export function analyticsSummary(month?: string) {
  load();
  const months = lastMonths(12);
  const days = lastDays(30);
  const selected = month && months.includes(month) ? month : months[months.length - 1];

  const byMonth = months.map((key) => {
    const rows = memory.filter((e) => monthKey(e.at) === key);
    const searches = rows.filter((e) => e.type === "search");
    const outbounds = rows.filter((e) => e.type === "outbound");
    const mix = {
      flights: searches.filter((e) => e.kind === "flights").length,
      stays: searches.filter((e) => e.kind === "stays").length,
      cars: searches.filter((e) => e.kind === "cars").length,
    };
    const booked = {
      flights: outbounds.filter((e) => e.kind === "flights").length,
      stays: outbounds.filter((e) => e.kind === "stays").length,
      cars: outbounds.filter((e) => e.kind === "cars").length,
    };
    return { month: key, searches: searches.length, outbounds: outbounds.length, mix, booked };
  });

  const daily = days.map((key) => {
    const rows = memory.filter((e) => e.at.slice(0, 10) === key);
    return {
      day: key,
      searches: rows.filter((e) => e.type === "search").length,
      outbounds: rows.filter((e) => e.type === "outbound").length,
    };
  });

  function topDests(rows: AnalyticsEvent[], limit = 10) {
    const map = new Map<
      string,
      { code: string; city: string; country: string; total: number; flights: number; stays: number; cars: number }
    >();
    for (const e of rows) {
      const code = (e.destination || e.destCity || "").toUpperCase();
      if (!code) continue;
      const dest = getDestination(code);
      const city = e.destCity || dest?.city || code;
      const country = e.destCountry || dest?.country || "";
      const cur = map.get(code) || { code, city, country, total: 0, flights: 0, stays: 0, cars: 0 };
      cur.total += 1;
      if (e.kind === "flights") cur.flights += 1;
      else if (e.kind === "stays") cur.stays += 1;
      else if (e.kind === "cars") cur.cars += 1;
      map.set(code, cur);
    }
    return [...map.values()].sort((a, b) => b.total - a.total).slice(0, limit);
  }

  const monthRows = memory.filter((e) => monthKey(e.at) === selected);
  const monthSearches = monthRows.filter((e) => e.type === "search");
  const monthOut = monthRows.filter((e) => e.type === "outbound");
  const allSearches = memory.filter((e) => e.type === "search");
  const allOut = memory.filter((e) => e.type === "outbound");

  const partners: Record<string, number> = {};
  for (const e of allOut) {
    const name = e.partner || "Unknown";
    partners[name] = (partners[name] || 0) + 1;
  }
  const topPartners = Object.entries(partners)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  const mixAll = {
    flights: allSearches.filter((e) => e.kind === "flights").length,
    stays: allSearches.filter((e) => e.kind === "stays").length,
    cars: allSearches.filter((e) => e.kind === "cars").length,
  };
  const bookedAll = {
    flights: allOut.filter((e) => e.kind === "flights").length,
    stays: allOut.filter((e) => e.kind === "stays").length,
    cars: allOut.filter((e) => e.kind === "cars").length,
  };

  return {
    selectedMonth: selected,
    months,
    totals: {
      searches: allSearches.length,
      outbounds: allOut.length,
      uniqueDests: new Set(memory.map((e) => e.destination).filter(Boolean)).size,
      topKind: (["flights", "stays", "cars"] as Array<keyof typeof mixAll>).sort((a, b) => mixAll[b] - mixAll[a])[0],
    },
    mixAll,
    bookedAll,
    byMonth,
    daily,
    topDestinationsMonth: topDests(monthSearches),
    topDestinationsAll: topDests(allSearches),
    topBookedMonth: topDests(monthOut),
    topPartners,
    kinds: KINDS,
    monthSearchCount: monthSearches.length,
    monthOutboundCount: monthOut.length,
  };
}
