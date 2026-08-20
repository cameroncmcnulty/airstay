import { NextRequest, NextResponse } from "next/server";
import { paramsToQuery } from "@/lib/deeplinks";
import { searchLive } from "@/lib/live-search";
import { searchPackages } from "@/lib/packages";
import { duffelConfigured } from "@/lib/duffel";
import { logSearch } from "@/lib/travel-api/store";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(req: NextRequest) {
  const q = paramsToQuery(req.nextUrl.searchParams);
  try {
    const live = await searchLive(q);
    const packages = q.kind === "packages" || q.kind === "stays" ? await searchPackages(q, live) : [];
    const source = duffelConfigured() ? "duffel" : "travelpayouts";
    logSearch({
      kind: q.kind,
      origin: q.from,
      destination: q.to || q.toCity,
      depart: q.depart,
      returnDate: q.returnDate,
      adults: q.adults,
      results: (q.kind === "packages" || q.kind === "stays" ? packages.length : live.length),
      providers: [source, ...(live.some((o) => o.source === "duffel") ? ["duffel-air"] : [])],
      source,
    });
    return NextResponse.json({
      ok: true,
      live,
      packages,
      source,
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
