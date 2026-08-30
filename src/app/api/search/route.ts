import { NextRequest, NextResponse } from "next/server";
import { paramsToQuery } from "@/lib/deeplinks";
import { searchLive, suggestFlightDates, travelpayoutsCheckouts } from "@/lib/live-search";
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
  const q = paramsToQuery(req.nextUrl.searchParams);
  try {
    const priced = q.kind === "packages" ? [] : await searchLive(q);
    const dateSuggestions =
      q.kind === "flights" && priced.length === 0
        ? await withTimeout(suggestFlightDates(q), 5000, null)
        : null;
    const live = [...priced, ...travelpayoutsCheckouts(q)];
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
        packages: [],
        error: err instanceof Error ? err.message : "search_failed",
        generatedAt: new Date().toISOString(),
      },
      { status: 200 }
    );
  }
}
