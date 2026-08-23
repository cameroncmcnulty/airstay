import { NextRequest, NextResponse } from "next/server";
import { cookieName, readAdminToken } from "@/lib/admin";
import { listContacts, patchContact, removeContact } from "@/lib/contact-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function authed(req: NextRequest) {
  return readAdminToken(req.cookies.get(cookieName())?.value);
}

export async function GET(req: NextRequest) {
  if (!authed(req)) return NextResponse.json({ ok: false }, { status: 401 });
  return NextResponse.json({ ok: true, messages: listContacts() });
}

export async function PATCH(req: NextRequest) {
  if (!authed(req)) return NextResponse.json({ ok: false }, { status: 401 });
  const body = await req.json().catch(() => ({}));
  const id = String(body.id || "");
  if (!id) return NextResponse.json({ ok: false }, { status: 400 });
  const row = patchContact(id, { read: typeof body.read === "boolean" ? body.read : true });
  if (!row) return NextResponse.json({ ok: false }, { status: 404 });
  return NextResponse.json({ ok: true, message: row });
}

export async function DELETE(req: NextRequest) {
  if (!authed(req)) return NextResponse.json({ ok: false }, { status: 401 });
  const id = req.nextUrl.searchParams.get("id") || "";
  if (!id) return NextResponse.json({ ok: false }, { status: 400 });
  removeContact(id);
  return NextResponse.json({ ok: true });
}
