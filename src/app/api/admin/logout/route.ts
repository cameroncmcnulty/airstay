import { NextResponse } from "next/server";
import { cookieName, otpCookieName, otpTriesCookieName } from "@/lib/admin";

export const runtime = "nodejs";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(cookieName(), "", { httpOnly: true, path: "/", maxAge: 0 });
  res.cookies.set(otpCookieName(), "", { httpOnly: true, path: "/", maxAge: 0 });
  res.cookies.set(otpTriesCookieName(), "", { httpOnly: true, path: "/", maxAge: 0 });
  return res;
}
