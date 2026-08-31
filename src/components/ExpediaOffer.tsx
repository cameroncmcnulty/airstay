"use client";

import { BadgeDollarSign, Plane, Building2, ExternalLink } from "lucide-react";
import { ExpediaPackageBanner } from "@/components/ExpediaPackageBanner";
import { DEST_PHOTOS } from "@/lib/deals";
import { expediaPackagesUrl } from "@/lib/partners";
import { useApp } from "@/context/AppContext";

export function ExpediaOffer() {
  const { m } = useApp();
  const href = expediaPackagesUrl();
  const points = [
    { icon: Plane, t: m.ad.point1 },
    { icon: Building2, t: m.ad.point2 },
    { icon: BadgeDollarSign, t: m.ad.point3 },
  ];

  return (
    <section className="mx-auto max-w-6xl px-4">
      <article className="overflow-hidden rounded-[1.7rem] bg-white shadow-card ring-1 ring-navy/8">
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="group relative block min-h-[15.5rem] overflow-hidden px-5 py-7 text-white transition hover:brightness-[1.04] sm:min-h-[17rem] sm:px-10 sm:py-10"
        >
          <img src={DEST_PHOTOS.CUN} alt="" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/82 to-sky/40" />
          <div className="absolute inset-y-0 right-0 hidden w-1/3 bg-gradient-to-l from-sky/30 to-transparent lg:block" />
          <div className="relative max-w-xl">
            <p className="text-[11px] font-black uppercase tracking-[0.22em] text-sky-200">{m.brand}</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">{m.ad.storyTitle}</h2>
            <p className="mt-3 text-sm leading-relaxed text-white/88 sm:text-base">{m.ad.storyBody}</p>
            <ul className="mt-5 flex flex-wrap gap-2">
              {points.map((p) => (
                <li
                  key={p.t}
                  className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-xs font-bold text-white ring-1 ring-white/25"
                >
                  <p.icon className="h-3.5 w-3.5" strokeWidth={2.4} />
                  {p.t}
                </li>
              ))}
            </ul>
            <span className="btn-primary mt-6 min-h-12 w-full sm:w-auto">
              {m.ad.cta}
              <ExternalLink className="h-4 w-4" />
            </span>
          </div>
        </a>
        <div className="grid items-center gap-4 bg-mist/70 px-4 py-5 sm:px-8 lg:grid-cols-[minmax(16rem,20rem)_minmax(0,1fr)]">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-navy/40">{m.ad.kicker}</p>
            <h3 className="mt-1 text-lg font-extrabold text-navy">{m.ad.title}</h3>
            <p className="mt-1 max-w-sm text-[12px] font-medium leading-relaxed text-navy/55">{m.ad.note}</p>
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="btn-primary mt-4 min-h-12 w-full sm:w-auto"
            >
              {m.packages.partnerCta}
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
          <div className="flex min-w-0 justify-center">
            <div className="w-full max-w-[728px] overflow-hidden rounded-2xl bg-white p-1.5 shadow-lift ring-2 ring-sky sm:p-2">
              <div className="eg-leaderboard-fit">
                <div className="eg-leaderboard-inner">
                  <ExpediaPackageBanner layout="leaderboard" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>
    </section>
  );
}
