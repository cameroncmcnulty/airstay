import { NextRequest, NextResponse } from "next/server";
import { upsertUser } from "@/lib/users-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const email = String(body.email || "");
  const name = String(body.name || "");
  if (!email || !name) return NextResponse.json({ ok: false }, { status: 400 });
  const user = upsertUser({
    id: typeof body.id === "string" ? body.id : undefined,
    name,
    email,
    province: typeof body.province === "string" ? body.province : "",
    marketingConsent: Boolean(body.marketingConsent),
  });
  return NextResponse.json({ ok: true, id: user.id, disabled: user.disabled });
}
