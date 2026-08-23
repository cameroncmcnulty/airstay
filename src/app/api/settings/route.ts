import { NextResponse } from "next/server";
import { publicSettings } from "@/lib/site-settings";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ ok: true, settings: publicSettings() });
}
