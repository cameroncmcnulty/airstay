"use client";

import { useEffect } from "react";
import { useApp } from "@/context/AppContext";

export function TravelpayoutsPixel() {
  const { consent } = useApp();
  useEffect(() => {
    if (!consent?.marketing) return;
    if (document.querySelector("script[data-airstay-tp]")) return;
    const s = document.createElement("script");
    s.async = true;
    s.setAttribute("data-airstay-tp", "1");
    s.setAttribute("data-cmp-ab", "2");
    s.src = "https://tp-em.com/NTY0MjUw.js?t=564250";
    document.head.appendChild(s);
  }, [consent?.marketing]);
  return null;
}
