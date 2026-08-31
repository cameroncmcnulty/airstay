"use client";

import Link from "next/link";
import { Plane, Building2, ExternalLink, TreePalm } from "lucide-react";
import { ExpediaPackageBanner } from "@/components/ExpediaPackageBanner";
import { expediaPackagesUrl } from "@/lib/partners";
import { useApp } from "@/context/AppContext";

export function VacationPackages({ compact = false }: { compact?: boolean }) {
  const { m } = useApp();
  const href = expediaPackagesUrl();

  return (
    <div className={compact ? "" : "mx-auto max-w-6xl px-4"}>
      <div className="grid gap-4 lg:grid-cols-2">
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="group flex min-h-[11rem] flex-col justify-between rounded-[1.5rem] bg-navy p-5 text-white shadow-card ring-2 ring-sky transition hover:-translate-y-0.5 hover:shadow-lift sm:p-6"
        >
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.18em] text-sky-200">{m.ad.kicker}</p>
            <h2 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">{m.ad.title}</h2>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-white/80">{m.ad.note}</p>
          </div>
          <span className="btn-primary mt-5 w-full min-h-12 sm:w-auto">
            {m.packages.partnerCta}
            <ExternalLink className="h-4 w-4" />
          </span>
        </a>

        <div className="flex flex-col items-center justify-between rounded-[1.5rem] bg-mist p-4 ring-2 ring-sky/70 sm:p-5">
          <p className="mb-3 text-center text-[11px] font-black uppercase tracking-[0.16em] text-navy/45">
            {m.packages.bannerHint}
          </p>
          <div className="eg-mrec-fit">
            <div className="eg-mrec-inner">
              <ExpediaPackageBanner layout="medium-rectangle" />
            </div>
          </div>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="btn-primary mt-4 w-full min-h-12"
          >
            {m.ad.cta}
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </div>

      <div className="mt-5 rounded-[1.5rem] bg-mist p-4 ring-1 ring-navy/8 sm:p-5">
        <p className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.18em] text-navy/40">
          <TreePalm className="h-3.5 w-3.5 text-sky" />
          {m.packages.kicker}
        </p>
        <h3 className="mt-2 text-lg font-black text-navy sm:text-xl">{m.packages.title}</h3>
        <p className="mt-1 text-sm leading-relaxed text-navy/60">{m.packages.subtitle}</p>
        <p className="mt-4 text-[11px] font-bold uppercase tracking-[0.16em] text-navy/40">{m.packages.diyTitle}</p>
        <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3">
          <Link
            href="/flights"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-navy px-5 py-3 text-sm font-bold text-white shadow-card transition hover:-translate-y-0.5 hover:bg-sky hover:shadow-lift"
          >
            <Plane className="h-4 w-4" />
            {m.packages.diyFlights}
          </Link>
          <Link
            href="/stays"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-navy px-5 py-3 text-sm font-bold text-white shadow-card transition hover:-translate-y-0.5 hover:bg-sky hover:shadow-lift"
          >
            <Building2 className="h-4 w-4" />
            {m.packages.diyStays}
          </Link>
        </div>
        <p className="mt-3 text-[11px] font-medium text-navy/45">{m.packages.note}</p>
      </div>
    </div>
  );
}
