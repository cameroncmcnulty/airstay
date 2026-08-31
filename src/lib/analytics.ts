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

export const KINDS = ["flights", "stays", "cars", "packages", "esim"] as const;
export type Kind = (typeof KINDS)[number];
export type Mix = Record<Kind, number>;

function emptyMix(): Mix {
  return { flights: 0, stays: 0, cars: 0, packages: 0, esim: 0 };
}

function mixOf(rows: AnalyticsEvent[]): Mix {
  const mix = emptyMix();
  for (const e of rows) {
    if (e.kind in mix) mix[e.kind as Kind] += 1;
  }
  return mix;
}

function counts(rows: AnalyticsEvent[]) {
  const searches = rows.filter((e) => e.type === "search");
  const outbounds = rows.filter((e) => e.type === "outbound");
  return {
    searches: searches.length,
    outbounds: outbounds.length,
    mix: mixOf(searches),
    booked: mixOf(outbounds),
  };
}

function conversion(searches: number, outbounds: number) {
  if (!searches) return 0;
  return Math.round((outbounds / searches) * 1000) / 10;
}

function ymd(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function startOfWeek(d = new Date()) {
  const x = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const day = (x.getDay() + 6) % 7;
  x.setDate(x.getDate() - day);
  return x;
}

function lastWeeks(n: number) {
  const out: string[] = [];
  const d = startOfWeek();
  for (let i = 0; i < n; i++) {
    out.unshift(ymd(d));
    d.setDate(d.getDate() - 7);
  }
  return out;
}

function addDaysYmd(key: string, n: number) {
  const [y, m, d] = key.split("-").map(Number);
  const dt = new Date(y, (m || 1) - 1, d || 1);
  dt.setDate(dt.getDate() + n);
  return ymd(dt);
}

function period(rows: AnalyticsEvent[], start: string, end: string) {
  return counts(rows.filter((e) => e.at.slice(0, 10) >= start && e.at.slice(0, 10) < end));
}

function topDests(rows: AnalyticsEvent[], limit = 10) {
  const map = new Map<
    string,
    { code: string; city: string; country: string; total: number } & Mix
  >();
  for (const e of rows) {
    const code = (e.destination || e.destCity || "").toUpperCase();
    if (!code) continue;
    const dest = getDestination(code);
    const city = e.destCity || dest?.city || code;
    const country = e.destCountry || dest?.country || "";
    const cur = map.get(code) || { code, city, country, total: 0, ...emptyMix() };
    cur.total += 1;
    if (e.kind in emptyMix()) cur[e.kind as Kind] += 1;
    map.set(code, cur);
  }
  return [...map.values()].sort((a, b) => b.total - a.total).slice(0, limit);
}

function topList(rows: AnalyticsEvent[], key: (e: AnalyticsEvent) => string, limit = 8) {
  const map = new Map<string, number>();
  for (const e of rows) {
    const k = key(e);
    if (!k) continue;
    map.set(k, (map.get(k) || 0) + 1);
  }
  return [...map.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

export function analyticsSummary(month?: string) {
  load();
  const months = lastMonths(12);
  const days = lastDays(30);
  const weeks = lastWeeks(12);
  const selected = month && months.includes(month) ? month : months[months.length - 1];

  const byMonth = months.map((key) => {
    const rows = memory.filter((e) => monthKey(e.at) === key);
    const c = counts(rows);
    return { month: key, ...c };
  });

  const daily = days.map((key) => {
    const rows = memory.filter((e) => e.at.slice(0, 10) === key);
    const c = counts(rows);
    return { day: key, ...c };
  });

  const weekly = weeks.map((start) => {
    const end = addDaysYmd(start, 7);
    const rows = memory.filter((e) => e.at.slice(0, 10) >= start && e.at.slice(0, 10) < end);
    const c = counts(rows);
    return { week: start, ...c };
  });

  const monthRows = memory.filter((e) => monthKey(e.at) === selected);
  const monthSearches = monthRows.filter((e) => e.type === "search");
  const monthOut = monthRows.filter((e) => e.type === "outbound");
  const allSearches = memory.filter((e) => e.type === "search");
  const allOut = memory.filter((e) => e.type === "outbound");
  const mixAll = mixOf(allSearches);
  const bookedAll = mixOf(allOut);

  const today = ymd(new Date());
  const yesterday = addDaysYmd(today, -1);
  const weekStart = ymd(startOfWeek());
  const lastWeekStart = addDaysYmd(weekStart, -7);
  const monthStart = today.slice(0, 7) + "-01";
  const prevMonthDate = new Date();
  prevMonthDate.setDate(1);
  prevMonthDate.setMonth(prevMonthDate.getMonth() - 1);
  const lastMonthStart = ymd(prevMonthDate);
  const lastMonthEnd = monthStart;

  const todayC = period(memory, today, addDaysYmd(today, 1));
  const yesterdayC = period(memory, yesterday, today);
  const weekC = period(memory, weekStart, addDaysYmd(weekStart, 7));
  const lastWeekC = period(memory, lastWeekStart, weekStart);
  const monthC = period(memory, monthStart, addDaysYmd(today, 1));
  const lastMonthC = period(memory, lastMonthStart, lastMonthEnd);

  const topKind = (Object.keys(mixAll) as Kind[]).sort((a, b) => mixAll[b] - mixAll[a])[0] || "flights";

  return {
    selectedMonth: selected,
    months,
    totals: {
      searches: allSearches.length,
      outbounds: allOut.length,
      uniqueDests: new Set(memory.map((e) => e.destination).filter(Boolean)).size,
      topKind,
      conversion: conversion(allSearches.length, allOut.length),
    },
    mixAll,
    bookedAll,
    byMonth,
    daily,
    weekly,
    periods: {
      today: { ...todayC, conversion: conversion(todayC.searches, todayC.outbounds) },
      yesterday: { ...yesterdayC, conversion: conversion(yesterdayC.searches, yesterdayC.outbounds) },
      week: { ...weekC, conversion: conversion(weekC.searches, weekC.outbounds) },
      lastWeek: { ...lastWeekC, conversion: conversion(lastWeekC.searches, lastWeekC.outbounds) },
      month: { ...monthC, conversion: conversion(monthC.searches, monthC.outbounds) },
      lastMonth: { ...lastMonthC, conversion: conversion(lastMonthC.searches, lastMonthC.outbounds) },
    },
    topDestinationsMonth: topDests(monthSearches),
    topDestinationsAll: topDests(allSearches),
    topBookedMonth: topDests(monthOut),
    topPartners: topList(allOut, (e) => e.partner || "Unknown"),
    topOrigins: topList(allSearches, (e) => (e.origin || "").toUpperCase()),
    kinds: KINDS,
    monthSearchCount: monthSearches.length,
    monthOutboundCount: monthOut.length,
    recentBookings: allOut.slice(0, 80).map((e) => ({
      id: e.id,
      at: e.at,
      kind: e.kind,
      partner: e.partner || "Partner",
      origin: e.origin,
      destination: e.destination,
      destCity: e.destCity,
      depart: e.depart,
      returnDate: e.returnDate,
    })),
  };
}
