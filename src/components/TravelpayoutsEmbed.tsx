"use client";

import { useEffect, useRef } from "react";
import { useApp } from "@/context/AppContext";

function widgetSrc(locale: string) {
  const params = new URLSearchParams({
    trs: "564250",
    shmarker: "766682.airstay",
    locale: locale === "fr" ? "fr" : "en",
    powered_by: "true",
    color_button: "#4381C7",
    color_focused: "#3269A8",
    secondary: "#FFFFFF",
    dark: "#11100f",
    light: "#FFFFFF",
    special: "#C4C4C4",
    border_radius: "13",
    plain: "false",
    no_labels: "true",
    promo_id: "8588",
    campaign_id: "541",
  });
  return `https://tpembd.com/content?${params.toString()}`;
}

export function TravelpayoutsEmbed() {
  const { m, locale } = useApp();
  const hostRef = useRef<HTMLDivElement>(null);

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
      <div className="mx-auto w-full max-w-3xl overflow-hidden rounded-2xl bg-white px-4 py-3 shadow-sm ring-1 ring-navy/8">
        <div className="mb-2 flex items-baseline justify-between gap-3">
          <h2 className="text-sm font-extrabold tracking-tight text-navy sm:text-base">{m.ad.hotelsTitle}</h2>
          <p className="shrink-0 text-[10px] font-semibold uppercase tracking-wide text-navy/40">{m.ad.kicker}</p>
        </div>
        <div ref={hostRef} className="tp-embed min-h-[8rem] w-full overflow-hidden" />
        <p className="mt-2 text-[11px] font-medium text-navy/45">{m.ad.hotelsNote}</p>
      </div>
    </section>
  );
}
