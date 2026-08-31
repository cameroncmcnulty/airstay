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
  emailVerified?: boolean;
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

function persistSession(user: User) {
  const users = readUsers();
  const i = users.findIndex((u) => u.id === user.id || u.email === user.email);
  if (i >= 0) {
    users[i] = {
      ...users[i],
      ...user,
      passwordHash: user.passwordHash,
      savedSearches: user.savedSearches?.length ? user.savedSearches : users[i].savedSearches,
      clicks: user.clicks?.length ? user.clicks : users[i].clicks,
    };
  } else users.push(user);
  writeUsers(users);
  localStorage.setItem(SESSION_KEY, user.id);
  return toPublic(users[i >= 0 ? i : users.length - 1]);
}

export async function requestAccountOtp(email: string, purpose: "signup" | "reset") {
  const res = await fetch("/api/account/otp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: email.trim().toLowerCase(), purpose }),
  });
  const json = await res.json().catch(() => ({}));
  return { status: res.status, ...json } as {
    ok?: boolean;
    error?: string;
    emailHint?: string;
    mailError?: string;
    status: number;
  };
}

export async function completeSignup(input: {
  name: string;
  email: string;
  password: string;
  province: string;
  marketingConsent: boolean;
  code: string;
}): Promise<{ ok: true; user: PublicUser } | { ok: false; error: string }> {
  const res = await fetch("/api/account/confirm", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  const json = await res.json().catch(() => ({}));
  if (!json?.ok || !json.user?.id) return { ok: false, error: String(json.error || "otp") };
  const passwordHash = await hashPassword(input.password, json.user.id);
  const user: User = {
    id: json.user.id,
    name: json.user.name,
    email: json.user.email,
    passwordHash,
    province: json.user.province || input.province,
    marketingConsent: Boolean(json.user.marketingConsent),
    marketingConsentAt: json.user.marketingConsent ? new Date().toISOString() : undefined,
    createdAt: json.user.createdAt || new Date().toISOString(),
    savedSearches: [],
    clicks: [],
    emailVerified: true,
  };
  return { ok: true, user: persistSession(user) };
}

export async function completeReset(email: string, code: string, password: string) {
  const res = await fetch("/api/account/reset", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: email.trim().toLowerCase(), code, password }),
  });
  const json = await res.json().catch(() => ({}));
  if (!json?.ok || !json.user?.id) return { ok: false as const, error: String(json.error || "otp") };
  const existing = readUsers().find((u) => u.email === json.user.email);
  const passwordHash = await hashPassword(password, json.user.id);
  const user: User = {
    id: json.user.id,
    name: json.user.name || existing?.name || "Traveller",
    email: json.user.email,
    passwordHash,
    province: json.user.province || existing?.province || "",
    marketingConsent: json.user.marketingConsent ?? existing?.marketingConsent ?? false,
    createdAt: json.user.createdAt || existing?.createdAt || new Date().toISOString(),
    savedSearches: existing?.savedSearches || [],
    clicks: existing?.clicks || [],
    emailVerified: true,
  };
  return { ok: true as const, user: persistSession(user) };
}

export async function signIn(email: string, password: string): Promise<PublicUser | null> {
  const normalized = email.trim().toLowerCase();
  const users = readUsers();
  const local = users.find((u) => u.email === normalized);
  if (local) {
    const hash = await hashPassword(password, local.id);
    if (hash === local.passwordHash) {
      try {
        const status = await fetch(`/api/account/status?email=${encodeURIComponent(local.email)}`);
        const json = await status.json();
        if (json?.disabled) return null;
      } catch {
        /* offline */
      }
      localStorage.setItem(SESSION_KEY, local.id);
      pingLastSeen(toPublic(local));
      return toPublic(local);
    }
  }
  try {
    const res = await fetch("/api/account/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: normalized, password }),
    });
    const json = await res.json();
    if (!json?.ok || !json.user?.id) return null;
    const passwordHash = await hashPassword(password, json.user.id);
    return persistSession({
      id: json.user.id,
      name: json.user.name,
      email: json.user.email,
      passwordHash,
      province: json.user.province || "",
      marketingConsent: Boolean(json.user.marketingConsent),
      createdAt: json.user.createdAt || new Date().toISOString(),
      savedSearches: local?.savedSearches || [],
      clicks: local?.clicks || [],
      emailVerified: true,
    });
  } catch {
    return null;
  }
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
  const pub = toPublic(users[i]);
  fetch("/api/account/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id: pub.id,
      name: pub.name,
      email: pub.email,
      province: pub.province,
      marketingConsent: pub.marketingConsent,
    }),
  }).catch(() => undefined);
  return pub;
}

export async function changePassword(id: string, current: string, next: string) {
  const users = readUsers();
  const user = users.find((u) => u.id === id);
  if (!user) return { ok: false as const, error: "missing" };
  const hash = await hashPassword(current, user.id);
  if (hash !== user.passwordHash) return { ok: false as const, error: "current" };
  if (!validPassword(next)) return { ok: false as const, error: "weak" };
  user.passwordHash = await hashPassword(next, user.id);
  writeUsers(users);
  return { ok: true as const };
}

export function removeSavedSearch(userId: string, searchId: string) {
  const users = readUsers();
  const user = users.find((u) => u.id === userId);
  if (!user) return null;
  user.savedSearches = user.savedSearches.filter((s) => s.id !== searchId);
  writeUsers(users);
  return toPublic(user);
}

export function pingLastSeen(user: PublicUser) {
  fetch("/api/account/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id: user.id,
      name: user.name,
      email: user.email,
      province: user.province,
      marketingConsent: user.marketingConsent,
    }),
  }).catch(() => undefined);
}

export function deleteUser(id: string) {
  const user = readUsers().find((u) => u.id === id);
  writeUsers(readUsers().filter((u) => u.id !== id));
  const sid = localStorage.getItem(SESSION_KEY);
  if (sid === id) localStorage.removeItem(SESSION_KEY);
  if (user?.email) {
    fetch("/api/account/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: user.email }),
    }).catch(() => undefined);
  }
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
