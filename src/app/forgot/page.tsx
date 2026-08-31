"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { completeReset, requestAccountOtp, validEmail, validPassword } from "@/lib/auth";
import { useApp } from "@/context/AppContext";

export default function ForgotPage() {
  const { m, refreshUser } = useApp();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [needOtp, setNeedOtp] = useState(false);
  const [emailHint, setEmailHint] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  function otpError(code?: string) {
    if (code === "mail") return m.auth.errorMail;
    if (code === "rate") return m.auth.errorRate;
    if (code === "tries") return m.auth.errorOtpTries;
    if (code === "weak") return m.auth.errorPass;
    return m.auth.errorOtp;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!needOtp) {
      if (!validEmail(email)) return setError(m.auth.errorEmail);
      setBusy(true);
      const res = await requestAccountOtp(email, "reset");
      setBusy(false);
      if (!res.ok && res.error === "rate") return setError(m.auth.errorRate);
      setEmailHint(res.emailHint || email);
      setNeedOtp(true);
      setOtp("");
      return;
    }
    if (otp.length !== 6) return setError(m.auth.errorOtp);
    if (!validPassword(password)) return setError(m.auth.errorPass);
    if (password !== confirm) return setError(m.auth.errorMatch);
    setBusy(true);
    const res = await completeReset(email, otp, password);
    setBusy(false);
    if (!res.ok) return setError(otpError(res.error));
    refreshUser();
    router.push("/account");
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-8 sm:py-12">
      <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-sky-700">{m.brand}</p>
      <h1 className="mt-2 text-3xl font-black text-navy">{needOtp ? m.auth.otpTitle : m.auth.forgotTitle}</h1>
      <p className="mt-2 text-sm text-navy/65">
        {needOtp ? m.auth.otpSub.replace("{email}", emailHint || email) : m.auth.forgotSub}
      </p>
      <form onSubmit={onSubmit} className="mt-8 space-y-4 rounded-card bg-white p-5 shadow-card ring-1 ring-navy/5 sm:p-6">
        {!needOtp ? (
          <label className="block text-xs font-bold uppercase tracking-wide text-navy/50">
            {m.auth.email}
            <input className="field mt-1" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
          </label>
        ) : (
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
            <label className="block text-xs font-bold uppercase tracking-wide text-navy/50">
              {m.account.newPassword}
              <input className="field mt-1" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="new-password" />
            </label>
            <label className="block text-xs font-bold uppercase tracking-wide text-navy/50">
              {m.auth.confirmPassword}
              <input className="field mt-1" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required autoComplete="new-password" />
            </label>
          </>
        )}
        {error && <p className="text-sm font-semibold text-red-600">{error}</p>}
        <button disabled={busy} className="btn-primary w-full disabled:opacity-60">
          {needOtp ? m.auth.forgotSubmit : m.auth.forgotSend}
        </button>
        {needOtp && (
          <>
            <button
              type="button"
              className="w-full text-sm font-bold text-sky-700"
              disabled={busy}
              onClick={async () => {
                setBusy(true);
                setError("");
                await requestAccountOtp(email, "reset");
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
        )}
      </form>
      <p className="mt-4 text-sm text-navy/60">
        <Link href="/login" className="font-bold text-sky-700">
          {m.nav.signIn}
        </Link>
      </p>
    </div>
  );
}
