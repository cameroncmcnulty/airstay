import { NextRequest, NextResponse } from "next/server";
import { paramsToQuery } from "@/lib/deeplinks";
import { searchLive, suggestFlightDates } from "@/lib/live-search";
import { logSearch } from "@/lib/travel-api/store";
import { recordEvent } from "@/lib/analytics";
import { getDestination } from "@/lib/airports";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(req: NextRequest) {
  const q = paramsToQuery(req.nextUrl.searchParams);
  try {
    const live = q.kind === "packages" ? [] : await searchLive(q);
    const dateSuggestions =
      q.kind === "flights" && live.length === 0 ? await suggestFlightDates(q) : null;
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
        live: [],
        dateSuggestions: null,
        packages: [],
        error: err instanceof Error ? err.message : "search_failed",
        generatedAt: new Date().toISOString(),
      },
      { status: 200 }
    );
  }
}
