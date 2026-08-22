import { NextRequest, NextResponse } from "next/server";
import { cookieName, readAdminToken } from "@/lib/admin";
import { searchLive } from "@/lib/live-search";
import { defaultDepart, defaultReturn } from "@/lib/deeplinks";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const authed = readAdminToken(req.cookies.get(cookieName())?.value);
  if (!authed) return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  const started = Date.now();
  try {
    const flights = await searchLive({
      kind: "flights",
      from: "YYZ",
      to: "CUN",
      depart: defaultDepart(),
      returnDate: defaultReturn(),
      adults: 2,
    });
    const fares = flights.filter((f) => f.priceCad);
    return NextResponse.json({
      ok: fares.length > 0,
      elapsedMs: Date.now() - started,
      flights: {
        count: fares.length,
        sample: fares.slice(0, 3).map((f) => ({ name: f.airlineName || f.title, priceCad: f.priceCad })),
        error: null,
      },
    });
  } catch (err) {
    return NextResponse.json({
      ok: false,
      elapsedMs: Date.now() - started,
      error: err instanceof Error ? err.message : "ping_failed",
    });
  }
}
