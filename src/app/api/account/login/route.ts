import { NextRequest, NextResponse } from "next/server";
import { publicProfile, verifyUserPassword } from "@/lib/users-store";
import { validEmail } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const email = String(body.email || "").trim().toLowerCase();
  const password = String(body.password || "");
  if (!validEmail(email) || !password) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  const user = verifyUserPassword(email, password);
  if (!user) return NextResponse.json({ ok: false, error: "creds" }, { status: 401 });
  return NextResponse.json({ ok: true, user: publicProfile(user) });
}
