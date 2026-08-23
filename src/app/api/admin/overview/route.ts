import { NextRequest, NextResponse } from "next/server";
import { cookieName, readAdminToken } from "@/lib/admin";
import { listBookings, listSearches, stats } from "@/lib/travel-api/store";
import { analyticsSummary } from "@/lib/analytics";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const authed = readAdminToken(req.cookies.get(cookieName())?.value);
  if (!authed) return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  const month = req.nextUrl.searchParams.get("month") || undefined;
  return NextResponse.json({
    ok: true,
    generatedAt: new Date().toISOString(),
    providers: {
      travelpayouts: true,
    },
    env: {
      travelpayoutsToken: Boolean(process.env.TRAVELPAYOUTS_TOKEN),
      travelpayoutsMarker: process.env.TRAVELPAYOUTS_MARKER || "564250",
      adminPassword: Boolean(process.env.ADMIN_PASSWORD),
      adminUsername: Boolean(process.env.ADMIN_USERNAME),
      adminEmail: process.env.ADMIN_EMAIL || "airstaytravel@gmail.com",
      mail: Boolean(process.env.AGENTMAIL_API_KEY || process.env.RESEND_API_KEY),
    },
    stats: stats(),
    analytics: analyticsSummary(month),
    searches: listSearches().slice(0, 40),
    bookings: listBookings().slice(0, 40),
  });
}
