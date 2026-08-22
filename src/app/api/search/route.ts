import { NextRequest, NextResponse } from "next/server";
import { paramsToQuery } from "@/lib/deeplinks";
import { searchLive } from "@/lib/live-search";
import { logSearch } from "@/lib/travel-api/store";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(req: NextRequest) {
  const q = paramsToQuery(req.nextUrl.searchParams);
  try {
    const live = q.kind === "packages" ? [] : await searchLive(q);
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
    return NextResponse.json({
      ok: true,
      live,
      packages: [],
      source: "travelpayouts",
      generatedAt: new Date().toISOString(),
    });
  } catch (err) {
    return NextResponse.json(
      {
        ok: false,
        live: [],
        packages: [],
        error: err instanceof Error ? err.message : "search_failed",
        generatedAt: new Date().toISOString(),
      },
      { status: 200 }
    );
  }
}
