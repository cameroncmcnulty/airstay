"use client";

import Link from "next/link";
import { TreePalm } from "lucide-react";
import { useApp } from "@/context/AppContext";

export default function PackagesPage() {
  const { m } = useApp();
  return (
    <div className="mx-auto max-w-xl px-4 py-20 text-center">
      <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-sky-50 text-sky">
        <TreePalm className="h-8 w-8" />
      </span>
      <p className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-sky-700">{m.nav.packages}</p>
      <h1 className="mt-2 text-3xl font-black text-navy">{m.comingSoon.title}</h1>
      <p className="mt-3 text-navy/65">{m.comingSoon.body}</p>
      <div className="mt-8 flex flex-wrap justify-center gap-2">
        <Link href="/flights" className="rounded-full bg-sky px-5 py-2.5 text-sm font-bold text-white">
          {m.nav.flights}
        </Link>
        <Link href="/stays" className="rounded-full border border-navy/15 px-5 py-2.5 text-sm font-bold text-navy">
          {m.nav.stays}
        </Link>
        <Link href="/cars" className="rounded-full border border-navy/15 px-5 py-2.5 text-sm font-bold text-navy">
          {m.nav.cars}
        </Link>
      </div>
    </div>
  );
}
