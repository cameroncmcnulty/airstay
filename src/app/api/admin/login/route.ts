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
import { sendAdminOtp } from "@/lib/mail";

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
  try {
    await sendAdminOtp(code);
  } catch (err) {
    return NextResponse.json(
      {
        ok: false,
        error:
          err instanceof Error
            ? `Could not send the login code: ${err.message}`
            : "Could not send the login code email.",
      },
      { status: 502 }
    );
  }

  const res = NextResponse.json({
    ok: true,
    needOtp: true,
    emailHint: maskEmail(adminEmail()),
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
