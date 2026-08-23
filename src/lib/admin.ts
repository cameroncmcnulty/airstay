import { createHmac, createHash, randomInt, timingSafeEqual } from "crypto";

const SESSION_COOKIE = "airstay_admin";
const OTP_COOKIE = "airstay_admin_otp";
const OTP_TRIES_COOKIE = "airstay_admin_otp_tries";

function secret() {
  return process.env.ADMIN_OTP_SECRET || process.env.ADMIN_PASSWORD || "airstay-admin-dev";
}

export function adminUsername() {
  return process.env.ADMIN_USERNAME || "airstay.admin";
}

export function adminEmail() {
  return process.env.ADMIN_EMAIL || "airstaytravel@gmail.com";
}

export function adminConfigured() {
  return Boolean(process.env.ADMIN_PASSWORD && process.env.ADMIN_USERNAME);
}

export function cookieName() {
  return SESSION_COOKIE;
}

export function otpCookieName() {
  return OTP_COOKIE;
}

export function otpTriesCookieName() {
  return OTP_TRIES_COOKIE;
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

export function usernameMatches(input: string) {
  return safeEqual(input.trim(), adminUsername());
}

export function passwordMatches(input: string) {
  const expected = process.env.ADMIN_PASSWORD || "";
  if (!expected) return false;
  return safeEqual(input, expected);
}

function normalizeBackup(value: string) {
  return value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
}

export function backupCodeMatches(input: string) {
  const expected = process.env.ADMIN_BACKUP_CODE || "";
  if (!expected) return false;
  const a = normalizeBackup(input);
  const b = normalizeBackup(expected);
  if (!a || !b) return false;
  return safeEqual(a, b);
}

export function signAdminToken() {
  const exp = Date.now() + 7 * 24 * 60 * 60 * 1000;
  const payload = `ok.${exp}`;
  const sig = createHmac("sha256", secret()).update(payload).digest("hex");
  return `${payload}.${sig}`;
}

export function readAdminToken(token?: string | null) {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  const [ok, exp, sig] = parts;
  const payload = `${ok}.${exp}`;
  const expected = createHmac("sha256", secret()).update(payload).digest("hex");
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return false;
  if (ok !== "ok" || Number(exp) < Date.now()) return false;
  return true;
}

export function generateOtp() {
  return String(randomInt(0, 1_000_000)).padStart(6, "0");
}

function otpDigest(code: string, exp: number) {
  return createHmac("sha256", secret()).update(`otp:${adminUsername()}:${code}:${exp}`).digest("hex");
}

export function signOtpChallenge(code: string) {
  const exp = Date.now() + 10 * 60 * 1000;
  const digest = otpDigest(code, exp);
  const sig = createHmac("sha256", secret()).update(`${exp}.${digest}`).digest("hex");
  return `${exp}.${digest}.${sig}`;
}

export function otpChallengeValid(token: string | undefined, code: string) {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  const [expRaw, digest, sig] = parts;
  const exp = Number(expRaw);
  if (!Number.isFinite(exp) || exp < Date.now()) return false;
  const expectedSig = createHmac("sha256", secret()).update(`${exp}.${digest}`).digest("hex");
  if (!safeEqual(sig, expectedSig)) return false;
  const submitted = otpDigest(code.replace(/\s/g, ""), exp);
  return safeEqual(submitted, digest);
}

export function hashIp(ip: string) {
  return createHash("sha256").update(ip).digest("hex").slice(0, 12);
}

export const sessionCookieOpts = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: 60 * 60 * 24 * 7,
};

export const otpCookieOpts = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: 60 * 10,
};
