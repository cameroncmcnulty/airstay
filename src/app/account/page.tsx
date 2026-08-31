"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Bookmark, Trash2 } from "lucide-react";
import { changePassword, deleteUser, exportUserJson, removeSavedSearch, updateUser, validPassword } from "@/lib/auth";
import { useApp } from "@/context/AppContext";

const PROVINCES = ["AB", "BC", "MB", "NB", "NL", "NS", "NT", "NU", "ON", "PE", "QC", "SK", "YT"] as const;

export default function AccountPage() {
  const { m, user, ready, refreshUser, signOut } = useApp();
  const router = useRouter();
  const [name, setName] = useState("");
  const [province, setProvince] = useState("ON");
  const [profileMsg, setProfileMsg] = useState("");
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [passMsg, setPassMsg] = useState("");
  const [passErr, setPassErr] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (ready && !user) router.replace("/login");
  }, [ready, user, router]);

  useEffect(() => {
    if (!user) return;
    setName(user.name);
    setProvince(user.province || "ON");
  }, [user]);

  if (!ready || !user) return <div className="px-4 py-16 text-center text-navy/50">…</div>;

  const joined = new Date(user.createdAt).toLocaleDateString(undefined, { month: "long", year: "numeric" });

  async function saveProfile() {
    if (!user) return;
    if (name.trim().length < 2) return;
    setBusy(true);
    updateUser(user.id, { name: name.trim(), province });
    refreshUser();
    setBusy(false);
    setProfileMsg(m.account.savedProfile);
  }

  async function onPassword(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setPassErr("");
    setPassMsg("");
    if (next !== confirmPw) return setPassErr(m.auth.errorMatch);
    if (!validPassword(next)) return setPassErr(m.auth.errorPass);
    setBusy(true);
    const res = await changePassword(user.id, current, next);
    setBusy(false);
    if (!res.ok) return setPassErr(res.error === "current" ? m.account.errorCurrent : m.auth.errorPass);
    setCurrent("");
    setNext("");
    setConfirmPw("");
    setPassMsg(m.account.passwordChanged);
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:py-12">
      <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-sky-700">{m.account.kicker}</p>
      <h1 className="mt-2 text-3xl font-black text-navy">{m.account.title}</h1>
      <p className="mt-1 text-sm text-navy/60">{m.account.joined.replace("{date}", joined)}</p>

      <section className="mt-6 grid gap-3 sm:grid-cols-3">
        <div className="rounded-card bg-white p-4 shadow-card ring-1 ring-navy/5">
          <p className="text-[11px] font-bold uppercase tracking-wide text-navy/40">{m.account.stats}</p>
          <p className="mt-1 text-2xl font-black text-navy">{user.savedSearches.length}</p>
          <p className="text-xs font-semibold text-navy/50">{m.account.savedCount.replace("{n}", String(user.savedSearches.length))}</p>
        </div>
        <div className="rounded-card bg-white p-4 shadow-card ring-1 ring-navy/5">
          <p className="text-[11px] font-bold uppercase tracking-wide text-navy/40">{m.account.clicks}</p>
          <p className="mt-1 text-2xl font-black text-navy">{user.clicks.length}</p>
          <p className="text-xs font-semibold text-navy/50">{m.account.clickCount.replace("{n}", String(user.clicks.length))}</p>
        </div>
        <div className="rounded-card bg-white p-4 shadow-card ring-1 ring-navy/5">
          <p className="text-[11px] font-bold uppercase tracking-wide text-navy/40">{m.auth.province}</p>
          <p className="mt-1 text-2xl font-black text-navy">{user.province || "—"}</p>
          <p className="text-xs font-semibold text-navy/50">{user.email}</p>
        </div>
      </section>

      <section className="mt-6 rounded-card bg-white p-5 shadow-card ring-1 ring-navy/5 sm:p-6">
        <h2 className="font-extrabold text-navy">{m.account.profile}</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <label className="block text-xs font-bold uppercase tracking-wide text-navy/50">
            {m.auth.name}
            <input className="field mt-1" value={name} onChange={(e) => setName(e.target.value)} />
          </label>
          <label className="block text-xs font-bold uppercase tracking-wide text-navy/50">
            {m.auth.province}
            <select className="field mt-1" value={province} onChange={(e) => setProvince(e.target.value)}>
              {PROVINCES.map((p) => (
                <option key={p} value={p}>
                  {m.province[p]}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button type="button" className="btn-primary" disabled={busy} onClick={saveProfile}>
            {m.account.saveProfile}
          </button>
          {profileMsg && <p className="text-sm font-semibold text-emerald-700">{profileMsg}</p>}
        </div>
      </section>

      <section className="mt-4 rounded-card bg-white p-5 shadow-card ring-1 ring-navy/5 sm:p-6">
        <h2 className="font-extrabold text-navy">{m.account.password}</h2>
        <form onSubmit={onPassword} className="mt-4 space-y-3">
          <label className="block text-xs font-bold uppercase tracking-wide text-navy/50">
            {m.account.currentPassword}
            <input className="field mt-1" type="password" value={current} onChange={(e) => setCurrent(e.target.value)} autoComplete="current-password" required />
          </label>
          <label className="block text-xs font-bold uppercase tracking-wide text-navy/50">
            {m.account.newPassword}
            <input className="field mt-1" type="password" value={next} onChange={(e) => setNext(e.target.value)} autoComplete="new-password" required />
          </label>
          <label className="block text-xs font-bold uppercase tracking-wide text-navy/50">
            {m.auth.confirmPassword}
            <input className="field mt-1" type="password" value={confirmPw} onChange={(e) => setConfirmPw(e.target.value)} autoComplete="new-password" required />
          </label>
          {passErr && <p className="text-sm font-semibold text-red-600">{passErr}</p>}
          {passMsg && <p className="text-sm font-semibold text-emerald-700">{passMsg}</p>}
          <button type="submit" className="btn-ghost" disabled={busy}>
            {m.account.changePassword}
          </button>
        </form>
      </section>

      <section className="mt-4 rounded-card bg-white p-5 shadow-card ring-1 ring-navy/5 sm:p-6">
        <h2 className="font-extrabold text-navy">{m.account.saved}</h2>
        {user.savedSearches.length === 0 ? (
          <p className="mt-2 text-sm text-navy/55">{m.account.none}</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {user.savedSearches.map((s) => (
              <li key={s.id} className="flex items-center gap-2 rounded-2xl bg-mist px-3 py-2">
                <Bookmark className="h-4 w-4 shrink-0 text-sky" />
                <Link href={s.href} className="min-w-0 flex-1 truncate text-sm font-semibold text-navy hover:text-sky">
                  {s.label}
                </Link>
                <Link href={s.href} className="hidden text-xs font-bold text-sky-700 sm:inline">
                  {m.account.open}
                </Link>
                <button
                  type="button"
                  className="grid h-9 w-9 place-items-center rounded-full text-navy/45 hover:bg-white hover:text-red-700"
                  aria-label={m.account.remove}
                  onClick={() => {
                    removeSavedSearch(user.id, s.id);
                    refreshUser();
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-4 rounded-card bg-white p-5 shadow-card ring-1 ring-navy/5 sm:p-6">
        <h2 className="font-extrabold text-navy">{m.account.clicks}</h2>
        {user.clicks.length === 0 ? (
          <p className="mt-2 text-sm text-navy/55">{m.account.noneClicks}</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {user.clicks.slice(0, 20).map((c) => (
              <li key={c.at} className="flex items-center justify-between gap-3 rounded-2xl bg-mist px-3 py-2 text-sm">
                <span className="min-w-0 truncate font-semibold text-navy">{c.partner}</span>
                <span className="shrink-0 text-[11px] font-semibold text-navy/45">{new Date(c.at).toLocaleString()}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-4 rounded-card bg-white p-5 shadow-card ring-1 ring-navy/5 sm:p-6">
        <h2 className="font-extrabold text-navy">{m.account.privacy}</h2>
        <p className="mt-2 text-sm text-navy/65">{user.marketingConsent ? m.account.marketingOn : m.account.marketingOff}</p>
        <button
          type="button"
          className="btn-ghost mt-3"
          onClick={() => {
            updateUser(user.id, {
              marketingConsent: !user.marketingConsent,
              marketingConsentAt: !user.marketingConsent ? new Date().toISOString() : undefined,
            });
            refreshUser();
          }}
        >
          {user.marketingConsent ? m.account.marketingOff : m.account.marketingOn}
        </button>
        <div className="mt-4 flex flex-wrap gap-2">
          <button type="button" className="rounded-full bg-navy px-4 py-2 text-sm font-bold text-white" onClick={() => exportUserJson(user)}>
            {m.account.export}
          </button>
          <button
            type="button"
            className="rounded-full border border-red-200 px-4 py-2 text-sm font-bold text-red-700"
            onClick={() => {
              if (window.confirm(m.account.deleteConfirm)) {
                deleteUser(user.id);
                signOut();
                router.push("/");
              }
            }}
          >
            {m.account.delete}
          </button>
          <button
            type="button"
            className="rounded-full px-4 py-2 text-sm font-bold text-navy"
            onClick={() => {
              signOut();
              router.push("/");
            }}
          >
            {m.nav.signOut}
          </button>
        </div>
      </section>
    </div>
  );
}
