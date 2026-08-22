"use client";

import { Search, Scale, BadgeCheck } from "lucide-react";
import { useApp } from "@/context/AppContext";

export function HowItWorks() {
  const { m } = useApp();
  const steps = [
    { icon: Search, t: m.how.s1t, d: m.how.s1d },
    { icon: Scale, t: m.how.s2t, d: m.how.s2d },
    { icon: BadgeCheck, t: m.how.s3t, d: m.how.s3d },
  ];
  return (
    <section className="mx-auto max-w-6xl px-4">
      <h2 className="text-2xl font-extrabold text-navy md:text-3xl">{m.how.title}</h2>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {steps.map((s, i) => (
          <div key={s.t} className="relative overflow-hidden rounded-card bg-white p-6 shadow-card ring-1 ring-navy/5">
            <p className="text-[11px] font-black tracking-[0.22em] text-sky-700">{String(i + 1).padStart(2, "0")}</p>
            <span className="mt-3 grid h-11 w-11 place-items-center rounded-2xl bg-sky-50 text-sky">
              <s.icon className="h-5 w-5" />
            </span>
            <h3 className="mt-4 text-lg font-extrabold text-navy">{s.t}</h3>
            <p className="mt-1 text-sm leading-relaxed text-navy/60">{s.d}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function TrustStrip() {
  const { m } = useApp();
  const items = [m.trust.cad, m.trust.canada, m.trust.fee, m.trust.privacy];
  return (
    <div className="mx-auto max-w-6xl px-4">
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
        {items.map((item) => (
          <span
            key={item}
            className="rounded-full bg-white/90 px-3 py-1.5 text-xs font-bold text-navy shadow-sm ring-1 ring-navy/10 sm:px-4 sm:text-sm"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
