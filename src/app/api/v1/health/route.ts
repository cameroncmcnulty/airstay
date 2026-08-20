import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({
    success: true,
    data: {
      name: "AIRSTAY Travel API",
      version: "v1",
      currency: "CAD",
      endpoints: [
        "POST /api/v1/search/flights",
        "POST /api/v1/search/hotels",
        "POST /api/v1/search/cars",
        "POST /api/v1/search/packages",
        "POST /api/v1/bookings",
        "GET /api/v1/bookings/{id}",
        "POST /api/v1/bookings/{id}/cancel",
      ],
      providers: {
        travelpayouts: true,
        liteapi: Boolean(process.env.LITEAPI_KEY),
        amadeus: Boolean(process.env.AMADEUS_CLIENT_ID && process.env.AMADEUS_CLIENT_SECRET),
        airstayInventory: true,
      },
    },
  });
}
