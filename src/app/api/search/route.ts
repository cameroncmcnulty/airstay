import { NextRequest, NextResponse } from "next/server";
import { paramsToQuery } from "@/lib/deeplinks";
import { cheapestMonthDeals, searchLive, suggestFlightDates, travelpayoutsCheckouts } from "@/lib/live-search";
import { logSearch } from "@/lib/travel-api/store";
import { recordEvent } from "@/lib/analytics";
import { getDestination } from "@/lib/airports";

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
    const monthDeals =
      q.kind === "flights" && q.flexMonth ? await withTimeout(cheapestMonthDeals(q), 8000, []) : [];
    if (monthDeals[0] && !req.nextUrl.searchParams.get("depart")) {
      q = { ...q, depart: monthDeals[0].depart, returnDate: monthDeals[0].returnDate || q.returnDate };
    }
    const priced = await searchLive(q);
    const dateSuggestions =
      q.kind === "flights" && priced.length === 0 && !q.flexMonth
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
        packages: [],
        error: err instanceof Error ? err.message : "search_failed",
        generatedAt: new Date().toISOString(),
      },
      { status: 200 }
    );
  }
}
