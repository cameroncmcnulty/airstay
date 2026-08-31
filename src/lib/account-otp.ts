import { createHmac, pbkdf2Sync, timingSafeEqual } from "crypto";
import { generateOtp } from "@/lib/admin";

export type OtpPurpose = "signup" | "reset";

const OTP_COOKIE = "airstay_acct_otp";
const OTP_TRIES_COOKIE = "airstay_acct_otp_tries";

function secret() {
  return process.env.ADMIN_OTP_SECRET || process.env.ADMIN_PASSWORD || "airstay-account-otp";
}

function safeEqual(a: string, b: string) {
  const aa = Buffer.from(a);
  const bb = Buffer.from(b);
  if (aa.length !== bb.length) {
    timingSafeEqual(aa, aa);
    return false;
  }
  return timingSafeEqual(aa, bb);
}

function hmac(value: string) {
  return createHmac("sha256", secret()).update(value).digest("hex");
}

export function accountOtpCookieName() {
  return OTP_COOKIE;
}

export function accountOtpTriesCookieName() {
  return OTP_TRIES_COOKIE;
}

export function makeAccountOtp() {
  return generateOtp();
}

function otpDigest(purpose: OtpPurpose, email: string, code: string, exp: number) {
  return hmac(`otp:${purpose}:${email.trim().toLowerCase()}:${code}:${exp}`);
}

export function signAccountOtp(purpose: OtpPurpose, email: string, code: string) {
  const exp = Date.now() + 10 * 60 * 1000;
  const digest = otpDigest(purpose, email, code, exp);
  return `${exp}.${digest}.${hmac(`${exp}.${digest}`)}`;
}

export function accountOtpValid(token: string | undefined, purpose: OtpPurpose, email: string, code: string) {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  const [expRaw, digest, sig] = parts;
  const exp = Number(expRaw);
  if (!Number.isFinite(exp) || exp < Date.now()) return false;
  if (!safeEqual(sig, hmac(`${exp}.${digest}`))) return false;
  const submitted = otpDigest(purpose, email, code.replace(/\s/g, ""), exp);
  return safeEqual(submitted, digest);
}

export function hashAccountPassword(password: string, salt: string) {
  return pbkdf2Sync(password, salt, 120000, 32, "sha256").toString("hex");
}

export function accountPasswordMatches(password: string, salt: string, hash: string) {
  if (!hash) return false;
  const next = hashAccountPassword(password, salt);
  const a = Buffer.from(next);
  const b = Buffer.from(hash);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export function maskEmail(email: string) {
  const [user, domain] = email.split("@");
  if (!user || !domain) return email;
  const shown = user.slice(0, 2);
  return `${shown}${"•".repeat(Math.max(1, user.length - 2))}@${domain}`;
}

export const accountOtpCookieOpts = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: 60 * 10,
};
