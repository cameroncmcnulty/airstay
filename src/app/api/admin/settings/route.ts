import { NextRequest, NextResponse } from "next/server";
import { cookieName, readAdminToken } from "@/lib/admin";
import { getSettings, saveSettings } from "@/lib/site-settings";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function authed(req: NextRequest) {
  return readAdminToken(req.cookies.get(cookieName())?.value);
}

export async function GET(req: NextRequest) {
  if (!authed(req)) return NextResponse.json({ ok: false }, { status: 401 });
  return NextResponse.json({ ok: true, settings: getSettings() });
}

export async function POST(req: NextRequest) {
  if (!authed(req)) return NextResponse.json({ ok: false }, { status: 401 });
  const body = await req.json().catch(() => ({}));
  const settings = saveSettings({
    chatEnabled: typeof body.chatEnabled === "boolean" ? body.chatEnabled : undefined,
    maintenance: typeof body.maintenance === "boolean" ? body.maintenance : undefined,
    banner: typeof body.banner === "string" ? body.banner.slice(0, 240) : undefined,
    contactEmail: typeof body.contactEmail === "string" ? body.contactEmail.slice(0, 120) : undefined,
    supportHours: typeof body.supportHours === "string" ? body.supportHours.slice(0, 80) : undefined,
    defaultFrom: typeof body.defaultFrom === "string" ? body.defaultFrom.slice(0, 3).toUpperCase() : undefined,
    announceFr: typeof body.announceFr === "string" ? body.announceFr.slice(0, 240) : undefined,
  });
  return NextResponse.json({ ok: true, settings });
}
