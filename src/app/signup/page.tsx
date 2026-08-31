"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createUser, validEmail, validPassword } from "@/lib/auth";
import { useApp } from "@/context/AppContext";

const PROVINCES = ["AB", "BC", "MB", "NB", "NL", "NS", "NT", "NU", "ON", "PE", "QC", "SK", "YT"] as const;

export default function SignupPage() {
  const { m, refreshUser } = useApp();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [province, setProvince] = useState("ON");
  const [age, setAge] = useState(false);
  const [terms, setTerms] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!validEmail(email)) return setError(m.auth.errorEmail);
    if (!validPassword(password)) return setError(m.auth.errorPass);
    if (!age) return setError(m.auth.errorAge);
    if (!terms) return setError(m.auth.errorTerms);
    setBusy(true);
    const res = await createUser({ name, email, password, province, marketingConsent: marketing });
    setBusy(false);
    if (!res.ok) return setError(m.auth.errorExists);
    refreshUser();
    router.push("/account");
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-8 sm:py-12">
      <h1 className="text-3xl font-black text-navy">{m.auth.createTitle}</h1>
      <p className="mt-2 text-sm text-navy/65">{m.auth.createSub}</p>
      <form onSubmit={onSubmit} className="mt-8 space-y-4 rounded-card bg-white p-6 shadow-card ring-1 ring-navy/5">
        <label className="block text-xs font-bold uppercase tracking-wide text-navy/50">
          {m.auth.name}
          <input className="field mt-1" value={name} onChange={(e) => setName(e.target.value)} required autoComplete="name" />
        </label>
        <label className="block text-xs font-bold uppercase tracking-wide text-navy/50">
          {m.auth.email}
          <input className="field mt-1" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
        </label>
        <label className="block text-xs font-bold uppercase tracking-wide text-navy/50">
          {m.auth.password}
          <input className="field mt-1" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="new-password" />
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
        <label className="flex gap-2 text-sm text-navy/80">
          <input type="checkbox" className="mt-1 accent-navy" checked={age} onChange={(e) => setAge(e.target.checked)} />
          {m.auth.age}
        </label>
        <label className="flex gap-2 text-sm text-navy/80">
          <input type="checkbox" className="mt-1 accent-navy" checked={terms} onChange={(e) => setTerms(e.target.checked)} />
          <span>
            {m.auth.terms}{" "}
            <Link className="font-bold text-sky-700 underline" href="/terms">
              {m.footer.terms}
            </Link>
            {" · "}
            <Link className="font-bold text-sky-700 underline" href="/privacy">
              {m.footer.privacy}
            </Link>
          </span>
        </label>
        <label className="flex gap-2 text-sm text-navy/80">
          <input type="checkbox" className="mt-1 accent-sky" checked={marketing} onChange={(e) => setMarketing(e.target.checked)} />
          {m.auth.marketing}
        </label>
        {error && <p className="text-sm font-semibold text-red-600">{error}</p>}
        <button disabled={busy} className="w-full rounded-full bg-sky py-3 text-sm font-bold text-white shadow-lift disabled:opacity-60">
          {m.auth.submitCreate}
        </button>
      </form>
      <p className="mt-4 text-sm text-navy/60">
        {m.auth.have}{" "}
        <Link href="/login" className="font-bold text-sky-700">
          {m.nav.signIn}
        </Link>
      </p>
    </div>
  );
}
