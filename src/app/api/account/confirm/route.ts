import { NextRequest, NextResponse } from "next/server";
import {
  accountOtpCookieName,
  accountOtpTriesCookieName,
  accountOtpValid,
} from "@/lib/account-otp";
import { createVerifiedUser } from "@/lib/users-store";
import { validEmail, validPassword } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_TRIES = 5;

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const email = String(body.email || "").trim().toLowerCase();
  const code = String(body.code || "").replace(/\s/g, "");
  const name = String(body.name || "").trim();
  const password = String(body.password || "");
  const province = String(body.province || "ON");
  const marketingConsent = Boolean(body.marketingConsent);
  const challenge = req.cookies.get(accountOtpCookieName())?.value;
  const tries = Number(req.cookies.get(accountOtpTriesCookieName())?.value || 0);

  if (!validEmail(email) || name.length < 2) {
    return NextResponse.json({ ok: false, error: "bad_input" }, { status: 400 });
  }
  if (!validPassword(password)) {
    return NextResponse.json({ ok: false, error: "weak" }, { status: 400 });
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
  if (!/^\d{6}$/.test(code) || !accountOtpValid(challenge, "signup", email, code)) {
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

  const created = createVerifiedUser({ name, email, password, province, marketingConsent });
  if (!created.ok) {
    return NextResponse.json({ ok: false, error: "exists" }, { status: 409 });
  }

  const res = NextResponse.json({
    ok: true,
    user: {
      id: created.user.id,
      name: created.user.name,
      email: created.user.email,
      province: created.user.province,
      marketingConsent: created.user.marketingConsent,
      createdAt: created.user.createdAt,
      emailVerified: true,
    },
  });
  res.cookies.set(accountOtpCookieName(), "", { path: "/", maxAge: 0 });
  res.cookies.set(accountOtpTriesCookieName(), "", { path: "/", maxAge: 0 });
  return res;
}
