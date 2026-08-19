export type User = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  province: string;
  marketingConsent: boolean;
  marketingConsentAt?: string;
  createdAt: string;
  savedSearches: SavedSearch[];
  clicks: ClickRecord[];
};

export type PublicUser = Omit<User, "passwordHash">;

export type SavedSearch = {
  id: string;
  label: string;
  href: string;
  createdAt: string;
};

export type ClickRecord = {
  partner: string;
  url: string;
  at: string;
};

const USERS_KEY = "airstay.users.v1";
const SESSION_KEY = "airstay.session.v1";

function readUsers(): User[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || "[]") as User[];
  } catch {
    return [];
  }
}

function writeUsers(users: User[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export async function hashPassword(password: string, salt: string) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey("raw", enc.encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt: enc.encode(salt), iterations: 120000, hash: "SHA-256" },
    key,
    256
  );
  return [...new Uint8Array(bits)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

export function validEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validPassword(password: string) {
  return password.length >= 8 && /[A-Za-z]/.test(password) && /\d/.test(password);
}

export async function createUser(input: {
  name: string;
  email: string;
  password: string;
  province: string;
  marketingConsent: boolean;
}): Promise<{ ok: true; user: PublicUser } | { ok: false; error: "exists" }> {
  const users = readUsers();
  const email = input.email.trim().toLowerCase();
  if (users.some((u) => u.email === email)) return { ok: false, error: "exists" };
  const id = crypto.randomUUID();
  const passwordHash = await hashPassword(input.password, id);
  const user: User = {
    id,
    name: input.name.trim(),
    email,
    passwordHash,
    province: input.province,
    marketingConsent: input.marketingConsent,
    marketingConsentAt: input.marketingConsent ? new Date().toISOString() : undefined,
    createdAt: new Date().toISOString(),
    savedSearches: [],
    clicks: [],
  };
  users.push(user);
  writeUsers(users);
  localStorage.setItem(SESSION_KEY, id);
  return { ok: true, user: toPublic(user) };
}

export async function signIn(email: string, password: string): Promise<PublicUser | null> {
  const users = readUsers();
  const user = users.find((u) => u.email === email.trim().toLowerCase());
  if (!user) return null;
  const hash = await hashPassword(password, user.id);
  if (hash !== user.passwordHash) return null;
  localStorage.setItem(SESSION_KEY, user.id);
  return toPublic(user);
}

export function signOut() {
  localStorage.removeItem(SESSION_KEY);
}

export function currentUser(): PublicUser | null {
  if (typeof window === "undefined") return null;
  const id = localStorage.getItem(SESSION_KEY);
  if (!id) return null;
  const user = readUsers().find((u) => u.id === id);
  return user ? toPublic(user) : null;
}

export function updateUser(id: string, patch: Partial<User>) {
  const users = readUsers();
  const i = users.findIndex((u) => u.id === id);
  if (i < 0) return null;
  users[i] = { ...users[i], ...patch, id: users[i].id, passwordHash: users[i].passwordHash };
  writeUsers(users);
  return toPublic(users[i]);
}

export function deleteUser(id: string) {
  writeUsers(readUsers().filter((u) => u.id !== id));
  const sid = localStorage.getItem(SESSION_KEY);
  if (sid === id) localStorage.removeItem(SESSION_KEY);
}

export function toPublic(user: User): PublicUser {
  const { passwordHash: _p, ...rest } = user;
  return rest;
}

export function exportUserJson(user: PublicUser) {
  const blob = new Blob([JSON.stringify(user, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `airstay-data-${user.id}.json`;
  a.click();
  URL.revokeObjectURL(url);
}
