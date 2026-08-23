import { NextRequest, NextResponse } from "next/server";
import {
  adminConfigured,
  adminEmail,
  generateOtp,
  otpCookieName,
  otpCookieOpts,
  otpTriesCookieName,
  passwordMatches,
  signOtpChallenge,
  usernameMatches,
} from "@/lib/admin";
import { mailConfigured, sendAdminOtp } from "@/lib/mail";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  if (!adminConfigured()) {
    return NextResponse.json(
      { ok: false, error: "Admin username and password are not set in the environment." },
      { status: 400 }
    );
  }
  const body = (await req.json().catch(() => ({}))) as { username?: string; password?: string };
  if (!usernameMatches(body.username || "") || !passwordMatches(body.password || "")) {
    return NextResponse.json({ ok: false, error: "Wrong username or password." }, { status: 401 });
  }

  const code = generateOtp();
  let emailSent = false;
  let mailError = "";
  if (mailConfigured()) {
    try {
      await sendAdminOtp(code);
      emailSent = true;
    } catch (err) {
      mailError = err instanceof Error ? err.message : "Could not send the login code email.";
    }
  } else {
    mailError = "Email sending is not set up yet. Use your backup code to finish sign-in.";
  }

  const res = NextResponse.json({
    ok: true,
    needOtp: true,
    emailSent,
    emailHint: maskEmail(adminEmail()),
    mailError: emailSent ? undefined : mailError,
  });
  res.cookies.set(otpCookieName(), signOtpChallenge(code), otpCookieOpts);
  res.cookies.set(otpTriesCookieName(), "0", otpCookieOpts);
  return res;
}

function maskEmail(email: string) {
  const [user, domain] = email.split("@");
  if (!user || !domain) return email;
  const shown = user.slice(0, 2);
  return `${shown}${"•".repeat(Math.max(1, user.length - 2))}@${domain}`;
}
