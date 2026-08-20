import { NextRequest, NextResponse } from "next/server";
import { cookieName, readAdminToken } from "@/lib/admin";
import { duffelConfigured } from "@/lib/duffel";
import { listBookings, listSearches, stats } from "@/lib/travel-api/store";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const authed = readAdminToken(req.cookies.get(cookieName())?.value);
  if (!authed) return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  return NextResponse.json({
    ok: true,
    generatedAt: new Date().toISOString(),
    providers: {
      duffel: duffelConfigured(),
      travelpayouts: true,
    },
    env: {
      duffel: duffelConfigured(),
      travelpayoutsToken: Boolean(process.env.TRAVELPAYOUTS_TOKEN),
      travelpayoutsMarker: process.env.TRAVELPAYOUTS_MARKER || "564250",
      adminPassword: Boolean(process.env.ADMIN_PASSWORD),
    },
    stats: stats(),
    searches: listSearches().slice(0, 40),
    bookings: listBookings().slice(0, 40),
  });
}
