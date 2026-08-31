"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { signIn } from "@/lib/auth";
import { useApp } from "@/context/AppContext";

export default function LoginPage() {
  const { m, refreshUser } = useApp();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const user = await signIn(email, password);
    setBusy(false);
    if (!user) return setError(m.auth.errorCreds);
    refreshUser();
    router.push("/account");
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-8 sm:py-12">
      <h1 className="text-3xl font-black text-navy">{m.auth.signInTitle}</h1>
      <p className="mt-2 text-sm text-navy/65">{m.auth.signInSub}</p>
      <form onSubmit={onSubmit} className="mt-8 space-y-4 rounded-card bg-white p-6 shadow-card ring-1 ring-navy/5">
        <label className="block text-xs font-bold uppercase tracking-wide text-navy/50">
          {m.auth.email}
          <input className="field mt-1" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
        </label>
        <label className="block text-xs font-bold uppercase tracking-wide text-navy/50">
          {m.auth.password}
          <input className="field mt-1" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" />
        </label>
        {error && <p className="text-sm font-semibold text-red-600">{error}</p>}
        <button disabled={busy} className="w-full rounded-full bg-navy py-3 text-sm font-bold text-white disabled:opacity-60">
          {m.auth.submitSignIn}
        </button>
      </form>
      <p className="mt-4 text-sm text-navy/60">
        {m.auth.need}{" "}
        <Link href="/signup" className="font-bold text-sky-700">
          {m.nav.createAccount}
        </Link>
      </p>
    </div>
  );
}
