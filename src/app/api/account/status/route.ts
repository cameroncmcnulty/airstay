import { NextRequest, NextResponse } from "next/server";
import { getUserByEmail } from "@/lib/users-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("email") || "";
  if (!email) return NextResponse.json({ ok: true, disabled: false });
  const user = getUserByEmail(email);
  return NextResponse.json({ ok: true, disabled: Boolean(user?.disabled) });
}
