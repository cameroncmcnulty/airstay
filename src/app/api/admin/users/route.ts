import { NextRequest, NextResponse } from "next/server";
import { cookieName, readAdminToken } from "@/lib/admin";
import { listUsers, patchUser, removeUser } from "@/lib/users-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function authed(req: NextRequest) {
  return readAdminToken(req.cookies.get(cookieName())?.value);
}

export async function GET(req: NextRequest) {
  if (!authed(req)) return NextResponse.json({ ok: false }, { status: 401 });
  return NextResponse.json({ ok: true, users: listUsers() });
}

export async function PATCH(req: NextRequest) {
  if (!authed(req)) return NextResponse.json({ ok: false }, { status: 401 });
  const body = await req.json().catch(() => ({}));
  const id = String(body.id || "");
  if (!id) return NextResponse.json({ ok: false, error: "missing_id" }, { status: 400 });
  const user = patchUser(id, {
    disabled: typeof body.disabled === "boolean" ? body.disabled : undefined,
    notes: typeof body.notes === "string" ? body.notes : undefined,
    marketingConsent: typeof body.marketingConsent === "boolean" ? body.marketingConsent : undefined,
    name: typeof body.name === "string" ? body.name : undefined,
  });
  if (!user) return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 });
  return NextResponse.json({ ok: true, user });
}

export async function DELETE(req: NextRequest) {
  if (!authed(req)) return NextResponse.json({ ok: false }, { status: 401 });
  const id = req.nextUrl.searchParams.get("id") || "";
  if (!id) return NextResponse.json({ ok: false, error: "missing_id" }, { status: 400 });
  removeUser(id);
  return NextResponse.json({ ok: true });
}
