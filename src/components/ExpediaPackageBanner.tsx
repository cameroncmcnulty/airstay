"use client";

import { useEffect, useRef } from "react";

const BANNERS_URL = "https://creator.expediagroup.com/products/banners";
const ORIGINS = [
  "https://creator.expediagroup.com",
  "https://creatorexpediagroupcom.staging.exp-test.net",
];

const SIZES: Record<string, { w: number; h: number }> = {
  leaderboard: { w: 728, h: 90 },
  "medium-rectangle": { w: 300, h: 250 },
};

function instanceId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

export function ExpediaPackageBanner({
  layout = "leaderboard",
  image = "resort",
  message = "find-perfect-getaway-package",
}: {
  layout?: "leaderboard" | "medium-rectangle";
  image?: string;
  message?: string;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const size = SIZES[layout] || SIZES.leaderboard;

  useEffect(() => {
    const host = hostRef.current;
    if (!host || host.querySelector("iframe")) return;

    const instance = instanceId();
    host.setAttribute("data-instance", instance);

    const params = new URLSearchParams({
      program: "ca-expedia",
      layout,
      image,
      message,
      link: "packages",
      network: "pz",
      camref: "1110lLNKz",
      instance,
    });

    const frame = document.createElement("iframe");
    frame.className = "eg-affiliate-banners-frame";
    frame.title = "Vacation Packages by Expedia";
    frame.src = `${BANNERS_URL}?${params.toString()}`;
    frame.setAttribute("scrolling", "no");
    frame.style.width = `${size.w}px`;
    frame.style.height = `${size.h}px`;
    frame.style.margin = "0";
    frame.style.border = "none";
    frame.style.display = "block";
    host.appendChild(frame);

    function onMessage(event: MessageEvent) {
      if (!ORIGINS.includes(event.origin)) return;
      const data = event.data as {
        type?: string;
        meta?: { instance?: string };
        payload?: { frame?: { style?: { width?: string; height?: string } } };
      };
      if (data?.type !== "eg-affiliate-banners/resize") return;
      if (data.meta?.instance !== instance) return;
      const w = data.payload?.frame?.style?.width;
      const h = data.payload?.frame?.style?.height;
      if (w) frame.style.width = w;
      if (h) frame.style.height = h;
    }

    window.addEventListener("message", onMessage);
    return () => {
      window.removeEventListener("message", onMessage);
      frame.remove();
    };
  }, [layout, image, message, size.w, size.h]);

  return (
    <div
      ref={hostRef}
      className="eg-affiliate-banners"
      data-program="ca-expedia"
      data-network="pz"
      data-layout={layout}
      data-image={image}
      data-message={message}
      data-camref="1110lLNKz"
      data-pubref=""
      data-link="packages"
      style={{ width: size.w, height: size.h }}
    />
  );
}
