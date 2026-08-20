import { NextResponse } from "next/server";
import { getBooking } from "@/lib/travel-api/store";

export const runtime = "nodejs";

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const booking = getBooking(id);
  if (!booking) {
    return NextResponse.json(
      { success: false, error: { code: "not_found", message: "Booking not found." } },
      { status: 404 }
    );
  }
  return NextResponse.json({ success: true, data: booking });
}
