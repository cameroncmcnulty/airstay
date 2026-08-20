import { NextRequest, NextResponse } from "next/server";
import { paramsToQuery } from "@/lib/deeplinks";
import { searchLive } from "@/lib/live-search";
import { searchPackages } from "@/lib/packages";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const q = paramsToQuery(req.nextUrl.searchParams);
  try {
    const live = await searchLive(q);
    const packages = await searchPackages(q, live);
    return NextResponse.json({
      ok: true,
      live,
      packages,
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
