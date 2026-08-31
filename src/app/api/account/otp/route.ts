import { NextRequest, NextResponse } from "next/server";
import {
  accountOtpCookieName,
  accountOtpCookieOpts,
  accountOtpTriesCookieName,
  makeAccountOtp,
  maskEmail,
  signAccountOtp,
  type OtpPurpose,
} from "@/lib/account-otp";
import { getUserByEmail } from "@/lib/users-store";
import { mailConfigured, sendUserOtp } from "@/lib/mail";
import { validEmail } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const hits = new Map<string, { n: number; t: number }>();

function limited(key: string, max: number) {
  const now = Date.now();
  const row = hits.get(key);
  if (!row || now - row.t > 10 * 60 * 1000) {
    hits.set(key, { n: 1, t: now });
    return false;
  }
  row.n += 1;
  return row.n > max;
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const purpose: OtpPurpose = body?.purpose === "reset" ? "reset" : "signup";
  const email = String(body?.email || "").trim().toLowerCase();
  if (!validEmail(email)) {
    return NextResponse.json({ ok: false, error: "bad_email" }, { status: 400 });
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || req.headers.get("x-real-ip") || "local";
  if (limited(`ip:${ip}`, 8) || limited(`em:${email}`, 4)) {
    return NextResponse.json({ ok: false, error: "rate" }, { status: 429 });
  }

  if (purpose === "signup") {
    const existing = getUserByEmail(email);
    if (existing?.passwordHash || existing?.emailVerified) {
      return NextResponse.json({ ok: false, error: "exists" }, { status: 409 });
    }
  }

  if (!mailConfigured()) {
    return NextResponse.json({ ok: false, error: "mail" }, { status: 503 });
  }

  const existing = getUserByEmail(email);
  const shouldSend = purpose === "signup" || Boolean(existing && !existing.disabled);
  const code = makeAccountOtp();
  let emailSent = false;
  let mailError = "";

  if (shouldSend) {
    try {
      await sendUserOtp(email, purpose, code);
      emailSent = true;
    } catch (err) {
      mailError = err instanceof Error ? err.message : "Could not send the email.";
    }
  }

  if (purpose === "signup" && !emailSent) {
    return NextResponse.json(
      { ok: false, error: "mail", mailError: mailError || "Could not send the confirmation email." },
      { status: 503 }
    );
  }

  const res = NextResponse.json({
    ok: true,
    needOtp: true,
    emailSent: purpose === "reset" ? true : emailSent,
    emailHint: maskEmail(email),
  });
  if (emailSent) {
    res.cookies.set(accountOtpCookieName(), signAccountOtp(purpose, email, code), accountOtpCookieOpts);
    res.cookies.set(accountOtpTriesCookieName(), "0", accountOtpCookieOpts);
  }
  return res;
}
