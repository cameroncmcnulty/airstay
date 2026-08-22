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
      ],
      providers: {
        travelpayouts: true,
      },
    },
  });
}
