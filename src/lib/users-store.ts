import { jsonStore } from "./json-store";
import { accountPasswordMatches, hashAccountPassword } from "@/lib/account-otp";

export type ManagedUser = {
  id: string;
  name: string;
  email: string;
  province: string;
  marketingConsent: boolean;
  createdAt: string;
  lastSeen: string;
  disabled: boolean;
  notes: string;
  passwordHash?: string;
  emailVerified?: boolean;
};

const store = jsonStore<ManagedUser[]>("users", []);

export function listUsers() {
  return store.load().sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function listUsersPublic() {
  return listUsers().map((u) => {
    const { passwordHash: _h, ...rest } = u;
    return { ...rest, emailVerified: Boolean(u.emailVerified), hasPassword: Boolean(u.passwordHash) };
  });
}

export function upsertUser(input: {
  id?: string;
  name: string;
  email: string;
  province?: string;
  marketingConsent?: boolean;
  passwordHash?: string;
  emailVerified?: boolean;
}) {
  const users = store.load();
  const email = input.email.trim().toLowerCase();
  const existing = users.find((u) => u.email === email);
  const now = new Date().toISOString();
  if (existing) {
    existing.name = input.name || existing.name;
    existing.province = input.province || existing.province;
    if (input.marketingConsent != null) existing.marketingConsent = input.marketingConsent;
    if (input.passwordHash) existing.passwordHash = input.passwordHash;
    if (input.emailVerified != null) existing.emailVerified = input.emailVerified;
    existing.lastSeen = now;
    store.save(users);
    return existing;
  }
  const user: ManagedUser = {
    id: input.id || `usr-${Date.now().toString(36)}`,
    name: input.name.trim(),
    email,
    province: input.province || "",
    marketingConsent: Boolean(input.marketingConsent),
    createdAt: now,
    lastSeen: now,
    disabled: false,
    notes: "",
    passwordHash: input.passwordHash,
    emailVerified: Boolean(input.emailVerified),
  };
  users.unshift(user);
  store.save(users);
  return user;
}

export function getUserByEmail(email: string) {
  return store.load().find((u) => u.email === email.trim().toLowerCase());
}

export function patchUser(id: string, patch: Partial<Pick<ManagedUser, "disabled" | "notes" | "marketingConsent" | "name">>) {
  const users = store.load();
  const user = users.find((u) => u.id === id);
  if (!user) return null;
  if (patch.disabled != null) user.disabled = patch.disabled;
  if (patch.notes != null) user.notes = patch.notes;
  if (patch.marketingConsent != null) user.marketingConsent = patch.marketingConsent;
  if (patch.name) user.name = patch.name;
  store.save(users);
  return user;
}

export function removeUser(id: string) {
  const users = store.load().filter((u) => u.id !== id);
  store.save(users);
}

export function createVerifiedUser(input: {
  name: string;
  email: string;
  password: string;
  province?: string;
  marketingConsent?: boolean;
}) {
  const email = input.email.trim().toLowerCase();
  if (getUserByEmail(email)) return { ok: false as const, error: "exists" as const };
  const id = crypto.randomUUID();
  const user = upsertUser({
    id,
    name: input.name,
    email,
    province: input.province,
    marketingConsent: input.marketingConsent,
    passwordHash: hashAccountPassword(input.password, id),
    emailVerified: true,
  });
  return { ok: true as const, user };
}

export function setUserPassword(email: string, password: string) {
  const users = store.load();
  const user = users.find((u) => u.email === email.trim().toLowerCase());
  if (!user || user.disabled) return null;
  user.passwordHash = hashAccountPassword(password, user.id);
  user.emailVerified = true;
  user.lastSeen = new Date().toISOString();
  store.save(users);
  return user;
}

export function verifyUserPassword(email: string, password: string) {
  const user = getUserByEmail(email);
  if (!user || user.disabled || !user.passwordHash) return null;
  if (!accountPasswordMatches(password, user.id, user.passwordHash)) return null;
  user.lastSeen = new Date().toISOString();
  const users = store.load();
  const row = users.find((u) => u.id === user.id);
  if (row) {
    row.lastSeen = user.lastSeen;
    store.save(users);
  }
  return user;
}

export function publicProfile(user: ManagedUser) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    province: user.province,
    marketingConsent: user.marketingConsent,
    createdAt: user.createdAt,
    emailVerified: Boolean(user.emailVerified),
  };
}

export function userStats() {
  const users = store.load();
  const now = Date.now();
  const d7 = now - 7 * 86400000;
  const d30 = now - 30 * 86400000;
  const joined7d = users.filter((u) => new Date(u.createdAt).getTime() >= d7).length;
  const joined30d = users.filter((u) => new Date(u.createdAt).getTime() >= d30).length;
  const seen7d = users.filter((u) => new Date(u.lastSeen).getTime() >= d7).length;
  return {
    total: users.length,
    active: users.filter((u) => !u.disabled).length,
    disabled: users.filter((u) => u.disabled).length,
    marketing: users.filter((u) => u.marketingConsent).length,
    joined7d,
    joined30d,
    seen7d,
  };
}
