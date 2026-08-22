import { NextResponse } from "next/server";

export const runtime = "nodejs";

export function POST() {
  return NextResponse.json({
    success: true,
    data: { searchId: "coming-soon", currency: "CAD", offers: [] },
    meta: { elapsedMs: 0, providers: [], generatedAt: new Date().toISOString(), note: "Packages coming soon" },
  });
}
