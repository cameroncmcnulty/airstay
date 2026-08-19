"use client";

import { useApp } from "@/context/AppContext";

export default function AboutPage() {
  const { m } = useApp();
  return (
    <article className="mx-auto max-w-3xl px-4 py-14">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-700">AIRSTAY</p>
      <h1 className="mt-2 text-3xl font-black text-navy md:text-4xl">{m.about.title}</h1>
      <p className="mt-4 text-lg leading-8 text-navy/75">{m.about.body}</p>
      <p className="mt-4 leading-7 text-navy/70">{m.footer.notAgency}</p>
      <p className="mt-4 leading-7 text-navy/70">{m.partners.note}</p>
    </article>
  );
}
