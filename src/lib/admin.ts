import { createHmac, timingSafeEqual } from "crypto";

const COOKIE = "airstay_admin";

function secret() {
  return process.env.ADMIN_PASSWORD || "airstay-admin-dev";
}

export function adminConfigured() {
  return Boolean(process.env.ADMIN_PASSWORD);
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

export function cookieName() {
  return COOKIE;
}

export function passwordMatches(input: string) {
  const expected = process.env.ADMIN_PASSWORD || "";
  if (!expected) return false;
  const a = Buffer.from(input);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}
