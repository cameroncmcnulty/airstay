import { NextRequest, NextResponse } from "next/server";
import { createStayBooking, duffelConfigured, toE164 } from "@/lib/duffel";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  if (!duffelConfigured()) {
    return NextResponse.json({ ok: false, error: "Duffel is not configured." }, { status: 400 });
  }
  const body = (await req.json().catch(() => ({}))) as {
    quoteId?: string;
    email?: string;
    phone?: string;
    specialRequests?: string;
    guests?: Array<{ givenName?: string; familyName?: string; bornOn?: string }>;
  };
  const guests = (body.guests || [])
    .map((g) => ({
      given_name: (g.givenName || "").trim(),
      family_name: (g.familyName || "").trim(),
      born_on: g.bornOn || undefined,
    }))
    .filter((g) => g.given_name && g.family_name);
  if (!body.quoteId || !body.email || !body.phone || !guests.length) {
    return NextResponse.json({ ok: false, error: "Name, email and phone are required." }, { status: 400 });
  }
  try {
    const booking = await createStayBooking({
      quoteId: body.quoteId,
      email: body.email.trim(),
      phone: toE164(body.phone),
      guests,
      specialRequests: body.specialRequests,
    });
    return NextResponse.json({ ok: true, booking });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "booking_failed" },
      { status: 400 }
    );
  }
}
