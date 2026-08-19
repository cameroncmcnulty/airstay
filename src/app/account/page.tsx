"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { deleteUser, exportUserJson, updateUser } from "@/lib/auth";
import { useApp } from "@/context/AppContext";

export default function AccountPage() {
  const { m, user, ready, refreshUser, signOut } = useApp();
  const router = useRouter();

  useEffect(() => {
    if (ready && !user) router.replace("/login");
  }, [ready, user, router]);

  if (!ready || !user) return <div className="px-4 py-16 text-center text-navy/50">…</div>;

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-black text-navy">{m.account.title}</h1>
      <p className="mt-1 text-navy/60">
        {user.name} · {user.email} · {m.province[user.province as keyof typeof m.province]}
      </p>

      <section className="mt-8 rounded-card bg-white p-6 shadow-card ring-1 ring-navy/5">
        <h2 className="font-extrabold text-navy">{m.account.saved}</h2>
        {user.savedSearches.length === 0 ? (
          <p className="mt-2 text-sm text-navy/55">{m.account.none}</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {user.savedSearches.map((s) => (
              <li key={s.id}>
                <Link href={s.href} className="block rounded-2xl bg-mist px-3 py-2 text-sm font-semibold text-navy hover:bg-sky-50">
                  {s.label}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-4 rounded-card bg-white p-6 shadow-card ring-1 ring-navy/5">
        <h2 className="font-extrabold text-navy">{m.account.privacy}</h2>
        <p className="mt-2 text-sm text-navy/65">{user.marketingConsent ? m.account.marketingOn : m.account.marketingOff}</p>
        <button
          type="button"
          className="mt-3 rounded-full border border-navy/15 px-4 py-2 text-sm font-bold text-navy"
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
              if (confirm(m.account.deleteConfirm)) {
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

      {user.clicks.length > 0 && (
        <section className="mt-4 rounded-card bg-white p-6 shadow-card ring-1 ring-navy/5">
          <h2 className="font-extrabold text-navy">{m.account.clicks}</h2>
          <ul className="mt-3 space-y-1 text-sm text-navy/70">
            {user.clicks.slice(0, 8).map((c) => (
              <li key={c.at}>
                {c.partner} · {new Date(c.at).toLocaleString()}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
