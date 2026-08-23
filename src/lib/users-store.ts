import { jsonStore } from "./json-store";

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
};

const store = jsonStore<ManagedUser[]>("users", []);

export function listUsers() {
  return store.load().sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function upsertUser(input: {
  id?: string;
  name: string;
  email: string;
  province?: string;
  marketingConsent?: boolean;
}) {
  const users = store.load();
  const email = input.email.trim().toLowerCase();
  const existing = users.find((u) => u.email === email);
  const now = new Date().toISOString();
  if (existing) {
    existing.name = input.name || existing.name;
    existing.province = input.province || existing.province;
    if (input.marketingConsent != null) existing.marketingConsent = input.marketingConsent;
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
