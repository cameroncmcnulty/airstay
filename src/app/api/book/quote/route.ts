import { NextRequest, NextResponse } from "next/server";
import { createStayQuote, duffelConfigured, fetchStayRates } from "@/lib/duffel";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  if (!duffelConfigured()) {
    return NextResponse.json(
      { ok: false, error: "Add DUFFEL_ACCESS_TOKEN to book this stay through AIRSTAY." },
      { status: 400 }
    );
  }
  const body = (await req.json().catch(() => ({}))) as { stayId?: string; rateId?: string };
  try {
    let rateId = body.rateId || "";
    let hotelName = "";
    let image: string | undefined;
    let address: string | undefined;
    let checkIn: string | undefined;
    let checkOut: string | undefined;
    let roomName: string | undefined;
    let board: string | undefined;
    if (body.stayId) {
      const rates = await fetchStayRates(body.stayId);
      hotelName = rates.hotelName;
      image = rates.image;
      address = rates.address;
      checkIn = rates.checkIn;
      checkOut = rates.checkOut;
      const best = rates.rates[0];
      if (!best) return NextResponse.json({ ok: false, error: "No rooms left for those dates." }, { status: 409 });
      rateId = best.rateId;
      roomName = best.roomName;
      board = best.board;
    }
    if (!rateId) return NextResponse.json({ ok: false, error: "Missing stay." }, { status: 400 });
    const quote = await createStayQuote(rateId);
    return NextResponse.json({
      ok: true,
      quote: {
        ...quote,
        hotelName: quote.hotelName || hotelName,
        image: quote.image || image,
        address: quote.address || address,
        checkIn: quote.checkIn || checkIn,
        checkOut: quote.checkOut || checkOut,
        roomName: quote.roomName || roomName,
        board: quote.board || board,
      },
    });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "quote_failed" },
      { status: 400 }
    );
  }
}
