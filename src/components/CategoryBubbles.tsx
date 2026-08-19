"use client";

import Link from "next/link";
import { Plane, Building2, Car, Sparkles } from "lucide-react";
import { useApp } from "@/context/AppContext";

const items = [
  { href: "/flights", icon: Plane, key: "flights" as const, sub: "flightsSub" as const, tint: "from-sky-50 to-white" },
  { href: "/stays", icon: Building2, key: "stays" as const, sub: "staysSub" as const, tint: "from-navy-50 to-white" },
  { href: "/cars", icon: Car, key: "cars" as const, sub: "carsSub" as const, tint: "from-sky-50 to-white" },
  { href: "/packages", icon: Sparkles, key: "packages" as const, sub: "packagesSub" as const, tint: "from-navy-50 to-white" },
];

export function CategoryBubbles() {
  const { m } = useApp();
  return (
    <section className="mx-auto max-w-6xl px-4">
      <h2 className="text-center text-2xl font-extrabold text-navy">{m.bubbles.title}</h2>
      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        {items.map((it) => {
          const Icon = it.icon;
          return (
            <Link
              key={it.href}
              href={it.href}
              className="group flex flex-col items-center rounded-[2rem] p-4 text-center"
            >
              <span
                className={`grid h-28 w-28 place-items-center rounded-full bg-gradient-to-b ${it.tint} shadow-bubble ring-1 ring-navy/5 transition group-hover:-translate-y-1 group-hover:shadow-lift md:h-32 md:w-32`}
              >
                <span className="grid h-16 w-16 place-items-center rounded-full bg-navy text-white md:h-20 md:w-20">
                  <Icon className="h-7 w-7 md:h-8 md:w-8" />
                </span>
              </span>
              <span className="mt-4 text-lg font-extrabold text-navy">{m.bubbles[it.key]}</span>
              <span className="text-sm text-navy/55">{m.bubbles[it.sub]}</span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
