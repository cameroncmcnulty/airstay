"use client";

import { useEffect, useState } from "react";

export function HeroMedia({ compact = false }: { compact?: boolean }) {
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduce(mq.matches);
    const onChange = () => setReduce(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${compact ? "" : ""}`} aria-hidden>
      <img
        src="/hero.jpg"
        alt=""
        className={`absolute inset-0 h-full w-full object-cover ${reduce ? "" : "hero-still"}`}
      />
      <div
        className={`absolute inset-0 ${
          compact
            ? "bg-gradient-to-b from-navy/70 via-navy/45 to-mist"
            : "bg-gradient-to-b from-navy/55 via-navy/25 to-navy/80"
        }`}
      />
    </div>
  );
}
