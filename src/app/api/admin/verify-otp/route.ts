import { NextRequest, NextResponse } from "next/server";
import {
  backupCodeMatches,
  cookieName,
  otpChallengeValid,
  otpCookieName,
  otpTriesCookieName,
  sessionCookieOpts,
  signAdminToken,
} from "@/lib/admin";

export const runtime = "nodejs";

const MAX_TRIES = 5;

export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => ({}))) as { code?: string };
  const code = String(body.code || "").trim();
  const challenge = req.cookies.get(otpCookieName())?.value;
  const tries = Number(req.cookies.get(otpTriesCookieName())?.value || 0);

  if (backupCodeMatches(code)) {
    const res = NextResponse.json({ ok: true });
    res.cookies.set(cookieName(), signAdminToken(), sessionCookieOpts);
    res.cookies.set(otpCookieName(), "", { path: "/", maxAge: 0 });
    res.cookies.set(otpTriesCookieName(), "", { path: "/", maxAge: 0 });
    return res;
  }

  if (!challenge) {
    return NextResponse.json({ ok: false, error: "Login expired. Start again." }, { status: 401 });
  }
  if (tries >= MAX_TRIES) {
    const res = NextResponse.json({ ok: false, error: "Too many attempts. Start again." }, { status: 429 });
    res.cookies.set(otpCookieName(), "", { path: "/", maxAge: 0 });
    res.cookies.set(otpTriesCookieName(), "", { path: "/", maxAge: 0 });
    return res;
  }
  const digits = code.replace(/\s/g, "");
  if (!/^\d{6}$/.test(digits) || !otpChallengeValid(challenge, digits)) {
    const res = NextResponse.json(
      { ok: false, error: "That code is incorrect or expired. You can also use your backup code." },
      { status: 401 }
    );
    res.cookies.set(otpTriesCookieName(), String(tries + 1), {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 10,
    });
    return res;
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(cookieName(), signAdminToken(), sessionCookieOpts);
  res.cookies.set(otpCookieName(), "", { path: "/", maxAge: 0 });
  res.cookies.set(otpTriesCookieName(), "", { path: "/", maxAge: 0 });
  return res;
}
