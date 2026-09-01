import { NextRequest, NextResponse } from "next/server";
import { paramsToQuery } from "@/lib/deeplinks";
import {
  cheapestMonthDeals,
  flexFallbackDates,
  monthDealsFromOffers,
  searchLive,
  suggestFlightDates,
  travelpayoutsCheckouts,
} from "@/lib/live-search";
import { logSearch } from "@/lib/travel-api/store";
import { recordEvent } from "@/lib/analytics";
import { getDestination } from "@/lib/airports";
import { addDays } from "@/lib/dates";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

function withTimeout<T>(promise: Promise<T>, ms: number, fallback: T) {
  return new Promise<T>((resolve) => {
    const timer = setTimeout(() => resolve(fallback), ms);
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      () => {
        clearTimeout(timer);
        resolve(fallback);
      }
    );
  });
}

export async function GET(req: NextRequest) {
  let q = paramsToQuery(req.nextUrl.searchParams);
  try {
    const monthTask =
      q.kind === "flights" ? withTimeout(cheapestMonthDeals(q), 8000, []) : Promise.resolve([]);
    const needFlexDates = Boolean(q.flexMonth && !req.nextUrl.searchParams.get("depart"));
    let monthDeals = needFlexDates ? await monthTask : [];
    if (needFlexDates) {
      const fallback = flexFallbackDates(q, monthDeals);
      q = { ...q, depart: fallback.depart, returnDate: fallback.returnDate || q.returnDate };
    }
    let priced = await searchLive(q);
    if (!needFlexDates) monthDeals = await monthTask;
    if (q.kind === "flights") {
      const byDay = new Map<string, (typeof monthDeals)[number]>();
      for (const deal of [...monthDeals, ...monthDealsFromOffers(q, priced)]) {
        const prev = byDay.get(deal.depart);
        if (!prev || deal.priceCad < prev.priceCad) byDay.set(deal.depart, deal);
      }
      monthDeals = [...byDay.values()]
        .sort((a, b) => a.priceCad - b.priceCad || a.depart.localeCompare(b.depart))
        .slice(0, 16);
    }
    if (q.flexMonth && !q.depart) {
      const picked = monthDeals[0];
      const fromOffer = priced.find((row) => /^\d{4}-\d{2}-\d{2}$/.test((row.departAt || "").slice(0, 10)));
      const depart = picked?.depart || (fromOffer?.departAt || "").slice(0, 10);
      if (depart) {
        const ret =
          picked?.returnDate ||
          (fromOffer?.returnAt || "").slice(0, 10) ||
          (q.trip === "oneway" ? undefined : addDays(depart, q.nights || 7));
        q = { ...q, depart, returnDate: ret || q.returnDate };
      }
    }
    let relaxedDirect = false;
    if (q.directOnly && priced.length === 0) {
      priced = await searchLive({ ...q, directOnly: false });
      relaxedDirect = priced.length > 0;
    }
    const wantedDay = (q.depart || "").slice(0, 10);
    const nearbyDates = Boolean(
      q.kind === "flights" &&
        wantedDay &&
        priced.length > 0 &&
        !priced.some((row) => (row.departAt || "").slice(0, 10) === wantedDay && !row.nearbyAirport)
    );
    const nearbyAirports = priced.some((row) => row.nearbyAirport);
    const dateSuggestions =
      q.kind === "flights" && priced.length === 0
        ? await withTimeout(suggestFlightDates(q), 5000, null)
        : null;
    const boards = travelpayoutsCheckouts(q).filter(
      (board) => !priced.some((row) => row.partnerKey === board.partnerKey && (row.priceCad || 0) > 0)
    );
    const live = [...priced, ...boards];
    const dest = q.to ? getDestination(q.to) : undefined;
    logSearch({
      kind: q.kind,
      origin: q.from,
      destination: q.to || q.toCity,
      depart: q.depart,
      returnDate: q.returnDate,
      adults: q.adults,
      results: live.length,
      providers: ["travelpayouts"],
      source: "travelpayouts",
    });
    recordEvent({
      type: "search",
      kind: q.kind,
      origin: q.from,
      destination: q.to,
      destCity: dest?.city || q.toCity,
      destCountry: dest?.country,
      depart: q.depart,
      returnDate: q.returnDate,
      adults: q.adults,
      results: live.length,
    });
    return NextResponse.json({
      ok: true,
      live,
      dateSuggestions,
      monthDeals,
      relaxedDirect,
      nearbyDates,
      nearbyAirports,
      packages: [],
      source: "travelpayouts",
      generatedAt: new Date().toISOString(),
    });
  } catch (err) {
    return NextResponse.json(
      {
        ok: false,
        live: travelpayoutsCheckouts(q),
        dateSuggestions: null,
        monthDeals: [],
        relaxedDirect: false,
        nearbyDates: false,
        nearbyAirports: false,
        packages: [],
        error: err instanceof Error ? err.message : "search_failed",
        generatedAt: new Date().toISOString(),
      },
      { status: 200 }
    );
  }
}
