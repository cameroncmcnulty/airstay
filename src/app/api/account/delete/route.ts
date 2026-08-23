import { NextRequest, NextResponse } from "next/server";
import { getUserByEmail, removeUser } from "@/lib/users-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const email = String(body.email || "");
  const user = getUserByEmail(email);
  if (user) removeUser(user.id);
  return NextResponse.json({ ok: true });
}
