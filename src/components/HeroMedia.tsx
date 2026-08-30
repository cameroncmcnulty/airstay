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
            ? "bg-gradient-to-b from-navy/70 via-navy/40 to-transparent"
            : "bg-gradient-to-b from-navy/70 via-navy/30 to-transparent"
        }`}
      />
      <div className="absolute inset-x-0 bottom-0 h-[48%] bg-gradient-to-b from-transparent via-mist/75 to-mist" />
    </div>
  );
}
