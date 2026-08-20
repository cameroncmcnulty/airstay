import { NextRequest, NextResponse } from "next/server";
import { paramsToQuery } from "@/lib/deeplinks";
import { searchLive } from "@/lib/live-search";
import { searchPackages } from "@/lib/packages";
import { duffelConfigured } from "@/lib/duffel";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(req: NextRequest) {
  const q = paramsToQuery(req.nextUrl.searchParams);
  try {
    const live = await searchLive(q);
    const packages = q.kind === "packages" || q.kind === "stays" ? await searchPackages(q, live) : [];
    return NextResponse.json({
      ok: true,
      live,
      packages,
      source: duffelConfigured() ? "duffel" : "travelpayouts",
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
