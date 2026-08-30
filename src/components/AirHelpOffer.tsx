"use client";

import { useEffect, useRef } from "react";
import { Clock, Plane, BadgeDollarSign, ShieldCheck } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { tpTrack } from "@/lib/affiliate";

function widgetSrc(locale: string) {
  const params = new URLSearchParams({
    trs: "564250",
    shmarker: "766682.airstay",
    lang: locale === "fr" ? "fr" : "en",
    powered_by: "true",
    campaign_id: "120",
    promo_id: "8679",
  });
  return `https://tpembd.com/content?${params.toString()}`;
}

export function AirHelpOffer() {
  const { m, locale } = useApp();
  const hostRef = useRef<HTMLDivElement>(null);
  const points = [
    { icon: Clock, t: m.airhelp.point1 },
    { icon: Plane, t: m.airhelp.point2 },
    { icon: ShieldCheck, t: m.airhelp.point3 },
  ];

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    host.replaceChildren();
    const s = document.createElement("script");
    s.async = true;
    s.charset = "utf-8";
    s.src = widgetSrc(locale);
    host.appendChild(s);
    return () => {
      host.replaceChildren();
    };
  }, [locale]);

  return (
    <section className="mx-auto max-w-6xl px-4">
      <article className="overflow-hidden rounded-[1.7rem] bg-white shadow-card ring-1 ring-navy/8 lg:grid lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
        <div className="relative overflow-hidden bg-navy px-6 py-8 text-white sm:px-8 sm:py-10">
          <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-sky/25 blur-2xl" />
          <div className="absolute -bottom-10 left-10 h-32 w-32 rounded-full bg-sky/20 blur-2xl" />
          <div className="relative">
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-sky-200">{m.airhelp.kicker}</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">{m.airhelp.title}</h2>
            <p className="mt-2 inline-flex items-center gap-2 text-2xl font-black text-sky-100 sm:text-3xl">
              <BadgeDollarSign className="h-7 w-7 text-sky" strokeWidth={2.4} />
              {m.airhelp.amount}
            </p>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-white/85 sm:text-[15px]">{m.airhelp.body}</p>
            <ul className="mt-5 flex flex-wrap gap-2">
              {points.map((p) => (
                <li
                  key={p.t}
                  className="inline-flex items-center gap-1.5 rounded-full bg-white/12 px-3 py-1.5 text-xs font-bold text-white ring-1 ring-white/20"
                >
                  <p.icon className="h-3.5 w-3.5" strokeWidth={2.4} />
                  {p.t}
                </li>
              ))}
            </ul>
            <a
              href={tpTrack("airhelp")}
              target="_blank"
              rel="noopener sponsored"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-sky px-5 py-2.5 text-sm font-bold text-white shadow-lift hover:bg-sky-600"
            >
              {m.airhelp.cta}
            </a>
            <p className="mt-3 max-w-sm text-[11px] font-medium text-white/55">{m.airhelp.note}</p>
          </div>
        </div>
        <div className="flex flex-col justify-center bg-mist/70 px-5 py-6 sm:px-7">
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-navy/40">{m.ad.kicker}</p>
          <p className="mt-1 text-sm font-extrabold text-navy">{m.airhelp.widgetTitle}</p>
          <div className="mt-4 overflow-hidden rounded-xl bg-white p-3 shadow-sm ring-1 ring-navy/8">
            <div ref={hostRef} className="tp-embed min-h-[10rem] w-full overflow-hidden" />
          </div>
        </div>
      </article>
    </section>
  );
}
