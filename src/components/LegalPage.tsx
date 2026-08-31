"use client";

import { useApp } from "@/context/AppContext";
import type { LegalSection } from "@/lib/legal";

export function LegalPage({
  titleEn,
  titleFr,
  updatedEn,
  updatedFr,
  sectionsEn,
  sectionsFr,
}: {
  titleEn: string;
  titleFr: string;
  updatedEn: string;
  updatedFr: string;
  sectionsEn: LegalSection[];
  sectionsFr: LegalSection[];
}) {
  const { locale, m } = useApp();
  const title = locale === "fr" ? titleFr : titleEn;
  const updated = locale === "fr" ? updatedFr : updatedEn;
  const sections = locale === "fr" ? sectionsFr : sectionsEn;

  return (
    <article className="mx-auto max-w-3xl px-4 py-8 sm:py-12">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-700">AIRSTAY</p>
      <h1 className="mt-2 text-3xl font-black text-navy md:text-4xl">{title}</h1>
      <p className="mt-2 text-sm text-navy/55">{updated}</p>
      <p className="mt-4 rounded-2xl bg-sky-50 px-4 py-3 text-sm text-navy/80">{m.legalNote}</p>
      <nav className="mt-8 rounded-2xl bg-mist p-4 text-sm">
        <ol className="space-y-1">
          {sections.map((s) => (
            <li key={s.id}>
              <a className="font-semibold text-sky-800 hover:underline" href={`#${s.id}`}>
                {s.title}
              </a>
            </li>
          ))}
        </ol>
      </nav>
      <div className="mt-8 space-y-10">
        {sections.map((s) => (
          <section key={s.id} id={s.id}>
            <h2 className="text-xl font-extrabold text-navy">{s.title}</h2>
            {s.paragraphs.map((p) => (
              <p key={p.slice(0, 40)} className="mt-3 text-[15px] leading-7 text-navy/80">
                {p}
              </p>
            ))}
          </section>
        ))}
      </div>
    </article>
  );
}
