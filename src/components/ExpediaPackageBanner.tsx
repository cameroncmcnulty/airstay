"use client";

import { useEffect, useRef } from "react";

const BANNERS_URL = "https://creator.expediagroup.com/products/banners";
const ORIGINS = [
  "https://creator.expediagroup.com",
  "https://creatorexpediagroupcom.staging.exp-test.net",
];

function instanceId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

export function ExpediaPackageBanner({
  image = "resort",
  message = "find-perfect-getaway-package",
}: {
  image?: string;
  message?: string;
}) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host || host.querySelector("iframe")) return;

    const instance = instanceId();
    host.setAttribute("data-instance", instance);

    const params = new URLSearchParams({
      program: "ca-expedia",
      layout: "medium-rectangle",
      image,
      message,
      link: "packages",
      network: "pz",
      camref: "1110lLNKz",
      instance,
    });

    const frame = document.createElement("iframe");
    frame.className = "eg-affiliate-banners-frame";
    frame.title = "Expedia";
    frame.src = `${BANNERS_URL}?${params.toString()}`;
    frame.setAttribute("scrolling", "no");
    frame.style.width = "300px";
    frame.style.height = "250px";
    frame.style.margin = "auto";
    frame.style.border = "none";
    frame.style.maxWidth = "100%";
    host.appendChild(frame);

    function onMessage(event: MessageEvent) {
      if (!ORIGINS.includes(event.origin)) return;
      const data = event.data as { type?: string; meta?: { instance?: string }; payload?: { frame?: { style?: { width?: string; height?: string } } } };
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
  }, [image, message]);

  return (
    <div
      ref={hostRef}
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
  );
}
