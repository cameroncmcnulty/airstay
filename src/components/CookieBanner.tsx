"use client";

import Link from "next/link";
import { useState } from "react";
import { useApp } from "@/context/AppContext";

export function CookieBanner() {
  const { m, consent, setConsent, ready } = useApp();
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);
  if (!ready || consent) return null;

  return (
    <div
      role="dialog"
      aria-labelledby="cookie-title"
      className="fixed bottom-[calc(4.75rem+env(safe-area-inset-bottom))] left-3 right-3 z-50 mx-auto max-w-3xl rounded-3xl bg-white p-4 shadow-card ring-1 ring-navy/10 sm:bottom-4 sm:right-24 sm:left-4 sm:p-5"
    >
      <h2 id="cookie-title" className="text-lg font-bold text-navy">
        {m.cookie.title}
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-navy/70">{m.cookie.body}</p>
      <div className="mt-4 flex flex-wrap gap-4 text-sm font-semibold text-navy">
        <label className="flex items-center gap-2">
          <input type="checkbox" checked disabled className="accent-navy" />
          {m.cookie.necessary}
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={analytics}
            onChange={(e) => setAnalytics(e.target.checked)}
            className="accent-sky"
          />
          {m.cookie.analytics}
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={marketing}
            onChange={(e) => setMarketing(e.target.checked)}
            className="accent-sky"
          />
          {m.cookie.marketing}
        </label>
      </div>
      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
        <button
          type="button"
          className="min-h-11 rounded-full bg-navy px-4 py-2.5 text-sm font-semibold text-white"
          onClick={() => setConsent({ analytics: true, marketing: true })}
        >
          {m.cookie.acceptAll}
        </button>
        <button
          type="button"
          className="min-h-11 rounded-full bg-sky px-4 py-2.5 text-sm font-semibold text-white"
          onClick={() => setConsent({ analytics, marketing })}
        >
          {m.cookie.acceptSel}
        </button>
        <button
          type="button"
          className="min-h-11 rounded-full border border-navy/15 px-4 py-2.5 text-sm font-semibold text-navy"
          onClick={() => setConsent({ analytics: false, marketing: false })}
        >
          {m.cookie.reject}
        </button>
        <Link href="/cookies" className="ml-auto text-sm font-semibold text-sky-700 underline">
          {m.cookie.policy}
        </Link>
      </div>
    </div>
  );
}
