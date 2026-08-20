import { NextRequest, NextResponse } from "next/server";
import { createBooking } from "@/lib/travel-api/engine";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => ({}))) as {
    offerId?: string;
    contactEmail?: string;
    passengers?: { firstName: string; lastName: string; email: string; dateOfBirth?: string }[];
  };
  const result = createBooking({
    offerId: body.offerId || "",
    offer: (body as { offer?: import("@/lib/travel-api/types").NormalizedOffer }).offer,
    contactEmail: body.contactEmail || body.passengers?.[0]?.email || "",
    passengers: body.passengers || [],
  });
  return NextResponse.json(result, { status: result.success ? 201 : 400 });
}
