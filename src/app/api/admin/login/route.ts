import { NextRequest, NextResponse } from "next/server";
import { adminConfigured, cookieName, passwordMatches, signAdminToken } from "@/lib/admin";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  if (!adminConfigured()) {
    return NextResponse.json({ ok: false, error: "Set ADMIN_PASSWORD in the environment first." }, { status: 400 });
  }
  const body = (await req.json().catch(() => ({}))) as { password?: string };
  if (!passwordMatches(body.password || "")) {
    return NextResponse.json({ ok: false, error: "Wrong password." }, { status: 401 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set(cookieName(), signAdminToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}
