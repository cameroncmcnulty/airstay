"use client";

import { useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { expediaPackagesUrl } from "@/lib/partners";

const SCRIPT_SRC = "https://creator.expediagroup.com/products/banners/assets/eg-affiliate-banners.js";

export function ExpediaPackageBanner({
  image = "resort",
  message = "find-perfect-getaway-package",
}: {
  image?: string;
  message?: string;
}) {
  const { consent, m } = useApp();
  const href = expediaPackagesUrl();

  useEffect(() => {
    if (!consent?.marketing) return;
    document.querySelectorAll("script.eg-affiliate-banners-script").forEach((node) => node.remove());
    const s = document.createElement("script");
    s.className = "eg-affiliate-banners-script";
    s.async = true;
    s.src = SCRIPT_SRC;
    document.body.appendChild(s);
    return () => {
      s.remove();
    };
  }, [consent?.marketing]);

  if (!consent?.marketing) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer sponsored"
        className="grid min-h-[250px] w-full max-w-[300px] place-items-center rounded-xl bg-gradient-to-br from-sky-50 to-mist px-4 text-center ring-1 ring-navy/10"
      >
        <span>
          <span className="text-[11px] font-black uppercase tracking-[0.18em] text-sky-700">{m.ad.kicker}</span>
          <span className="mt-2 block text-lg font-black text-navy">{m.ad.title}</span>
          <span className="mt-3 inline-flex rounded-full bg-sky px-3 py-1.5 text-xs font-bold text-white">{m.ad.cta}</span>
        </span>
      </a>
    );
  }

  return (
    <div className="flex min-h-[250px] w-full max-w-[300px] items-center justify-center">
      <div
        className="eg-affiliate-banners"
        data-program="ca-expedia"
        data-network="pz"
        data-layout="medium-rectangle"
        data-image={image}
        data-message={message}
        data-camref="1110lLNKz"
        data-pubref=""
        data-link="packages"
      />
    </div>
  );
}
