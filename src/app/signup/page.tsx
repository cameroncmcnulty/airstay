"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { completeSignup, requestAccountOtp, validEmail, validPassword } from "@/lib/auth";
import { useApp } from "@/context/AppContext";

const PROVINCES = ["AB", "BC", "MB", "NB", "NL", "NS", "NT", "NU", "ON", "PE", "QC", "SK", "YT"] as const;

export default function SignupPage() {
  const { m, refreshUser } = useApp();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [province, setProvince] = useState("ON");
  const [age, setAge] = useState(false);
  const [terms, setTerms] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const [otp, setOtp] = useState("");
  const [needOtp, setNeedOtp] = useState(false);
  const [emailHint, setEmailHint] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  function otpError(code?: string) {
    if (code === "exists") return m.auth.errorExists;
    if (code === "mail") return m.auth.errorMail;
    if (code === "rate") return m.auth.errorRate;
    if (code === "tries") return m.auth.errorOtpTries;
    if (code === "expired") return m.auth.errorOtp;
    if (code === "otp" || code === "weak") return code === "weak" ? m.auth.errorPass : m.auth.errorOtp;
    return m.auth.errorMail;
  }

  async function sendCode() {
    const res = await requestAccountOtp(email, "signup");
    if (!res.ok) {
      setError(otpError(res.error));
      return false;
    }
    setEmailHint(res.emailHint || email);
    setNeedOtp(true);
    return true;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (needOtp) {
      setBusy(true);
      const res = await completeSignup({
        name,
        email,
        password,
        province,
        marketingConsent: marketing,
        code: otp,
      });
      setBusy(false);
      if (!res.ok) return setError(otpError(res.error));
      refreshUser();
      router.push("/account");
      return;
    }
    if (name.trim().length < 2) return setError(m.auth.errorName);
    if (!validEmail(email)) return setError(m.auth.errorEmail);
    if (!validPassword(password)) return setError(m.auth.errorPass);
    if (password !== confirm) return setError(m.auth.errorMatch);
    if (!age) return setError(m.auth.errorAge);
    if (!terms) return setError(m.auth.errorTerms);
    setBusy(true);
    const sent = await sendCode();
    setBusy(false);
    if (sent) setOtp("");
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-8 sm:py-12">
      <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-sky-700">{m.brand}</p>
      <h1 className="mt-2 text-3xl font-black text-navy">{needOtp ? m.auth.otpTitle : m.auth.createTitle}</h1>
      <p className="mt-2 text-sm text-navy/65">
        {needOtp ? m.auth.otpSub.replace("{email}", emailHint || email) : m.auth.createSub}
      </p>
      <form onSubmit={onSubmit} className="mt-8 space-y-4 rounded-card bg-white p-5 shadow-card ring-1 ring-navy/5 sm:p-6">
        {needOtp ? (
          <>
            <label className="block text-xs font-bold uppercase tracking-wide text-navy/50">
              {m.auth.otpLabel}
              <input
                className="field mt-1 tracking-[0.24em]"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                required
              />
            </label>
            {error && <p className="text-sm font-semibold text-red-600">{error}</p>}
            <button disabled={busy || otp.length !== 6} className="btn-primary w-full disabled:opacity-60">
              {m.auth.otpSubmit}
            </button>
            <button
              type="button"
              className="w-full text-sm font-bold text-sky-700"
              disabled={busy}
              onClick={async () => {
                setBusy(true);
                setError("");
                await sendCode();
                setBusy(false);
              }}
            >
              {m.auth.otpResend}
            </button>
            <button
              type="button"
              className="w-full text-sm font-semibold text-navy/55"
              onClick={() => {
                setNeedOtp(false);
                setOtp("");
                setError("");
              }}
            >
              {m.auth.otpBack}
            </button>
          </>
        ) : (
          <>
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
              <input
                className="field mt-1"
                type={show ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
              />
            </label>
            <label className="block text-xs font-bold uppercase tracking-wide text-navy/50">
              {m.auth.confirmPassword}
              <input
                className="field mt-1"
                type={show ? "text" : "password"}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                autoComplete="new-password"
              />
            </label>
            <button type="button" className="text-xs font-bold text-sky-700" onClick={() => setShow((v) => !v)}>
              {show ? m.auth.hidePassword : m.auth.showPassword}
            </button>
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
              <input type="checkbox" className="mt-1 h-4 w-4 accent-navy" checked={age} onChange={(e) => setAge(e.target.checked)} />
              {m.auth.age}
            </label>
            <label className="flex gap-2 text-sm text-navy/80">
              <input type="checkbox" className="mt-1 h-4 w-4 accent-navy" checked={terms} onChange={(e) => setTerms(e.target.checked)} />
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
              <input type="checkbox" className="mt-1 h-4 w-4 accent-sky" checked={marketing} onChange={(e) => setMarketing(e.target.checked)} />
              {m.auth.marketing}
            </label>
            {error && <p className="text-sm font-semibold text-red-600">{error}</p>}
            <button disabled={busy} className="btn-primary w-full disabled:opacity-60">
              {m.auth.submitCreate}
            </button>
          </>
        )}
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
