import { NextRequest, NextResponse } from "next/server";
import {
  accountOtpCookieName,
  accountOtpTriesCookieName,
  accountOtpValid,
} from "@/lib/account-otp";
import { publicProfile, setUserPassword } from "@/lib/users-store";
import { validEmail, validPassword } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_TRIES = 5;

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const email = String(body.email || "").trim().toLowerCase();
  const code = String(body.code || "").replace(/\s/g, "");
  const password = String(body.password || "");
  const challenge = req.cookies.get(accountOtpCookieName())?.value;
  const tries = Number(req.cookies.get(accountOtpTriesCookieName())?.value || 0);

  if (!validEmail(email) || !validPassword(password)) {
    return NextResponse.json({ ok: false, error: "bad_input" }, { status: 400 });
  }
  if (!challenge) {
    return NextResponse.json({ ok: false, error: "expired" }, { status: 401 });
  }
  if (tries >= MAX_TRIES) {
    const res = NextResponse.json({ ok: false, error: "tries" }, { status: 429 });
    res.cookies.set(accountOtpCookieName(), "", { path: "/", maxAge: 0 });
    res.cookies.set(accountOtpTriesCookieName(), "", { path: "/", maxAge: 0 });
    return res;
  }
  if (!/^\d{6}$/.test(code) || !accountOtpValid(challenge, "reset", email, code)) {
    const res = NextResponse.json({ ok: false, error: "otp" }, { status: 401 });
    res.cookies.set(accountOtpTriesCookieName(), String(tries + 1), {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 10,
    });
    return res;
  }

  const user = setUserPassword(email, password);
  if (!user) {
    return NextResponse.json({ ok: false, error: "otp" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true, user: publicProfile(user) });
  res.cookies.set(accountOtpCookieName(), "", { path: "/", maxAge: 0 });
  res.cookies.set(accountOtpTriesCookieName(), "", { path: "/", maxAge: 0 });
  return res;
}
