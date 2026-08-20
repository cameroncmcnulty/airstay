import { NextRequest, NextResponse } from "next/server";
import { cookieName, readAdminToken } from "@/lib/admin";
import { duffelConfigured, searchFlights, searchStays } from "@/lib/duffel";
import { defaultDepart, defaultReturn } from "@/lib/deeplinks";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const authed = readAdminToken(req.cookies.get(cookieName())?.value);
  if (!authed) return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  if (!duffelConfigured()) {
    return NextResponse.json({
      ok: false,
      error: "DUFFEL_ACCESS_TOKEN is not set on this environment.",
    });
  }
  const depart = defaultDepart();
  const ret = defaultReturn();
  const q = {
    kind: "packages" as const,
    from: "YYZ",
    to: "CUN",
    toCity: "Cancún",
    depart,
    returnDate: ret,
    adults: 2,
    rooms: 1,
  };
  const started = Date.now();
  try {
    const [stays, flights] = await Promise.all([
      searchStays(q).catch((err: Error) => ({ error: err.message, rows: [] as Awaited<ReturnType<typeof searchStays>> })),
      searchFlights(q).catch((err: Error) => ({ error: err.message, rows: [] as Awaited<ReturnType<typeof searchFlights>> })),
    ]);
    const stayRows = Array.isArray(stays) ? stays : [];
    const flightRows = Array.isArray(flights) ? flights : [];
    return NextResponse.json({
      ok: stayRows.length > 0 || flightRows.length > 0,
      elapsedMs: Date.now() - started,
      stays: {
        count: stayRows.length,
        sample: stayRows.slice(0, 3).map((s) => ({ name: s.name, stayCad: s.stayCad })),
        error: Array.isArray(stays) ? null : stays.error,
      },
      flights: {
        count: flightRows.length,
        sample: flightRows.slice(0, 3).map((f) => ({ name: f.airlineName, priceCad: f.priceCad })),
        error: Array.isArray(flights) ? null : flights.error,
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
