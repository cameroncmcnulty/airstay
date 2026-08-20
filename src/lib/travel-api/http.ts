import { NextRequest, NextResponse } from "next/server";
import { runSearch } from "./engine";
import type { SearchRequest } from "./types";

export const runtime = "nodejs";

export async function handleSearch(req: NextRequest, type: SearchRequest["type"]) {
  try {
    const body = (await req.json().catch(() => ({}))) as Partial<SearchRequest>;
    const result = await runSearch({
      type,
      origin: body.origin,
      destination: body.destination,
      destinationName: body.destinationName,
      departDate: body.departDate,
      returnDate: body.returnDate,
      adults: body.adults ?? 1,
      children: body.children ?? 0,
      childAges: body.childAges,
      rooms: body.rooms ?? 1,
      cabin: body.cabin,
      trip: body.trip,
    });
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      {
        success: false,
        error: { code: "search_failed", message: err instanceof Error ? err.message : "Search failed" },
      },
      { status: 500 }
    );
  }
}
