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
      {!reduce && (
        <video
          className="absolute inset-0 h-full w-full scale-105 object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/hero.jpg"
        >
          <source src="/hero.mp4" type="video/mp4" />
        </video>
      )}
      {reduce && <img src="/hero.jpg" alt="" className="absolute inset-0 h-full w-full object-cover" />}
      <div className="absolute inset-0 bg-gradient-to-b from-navy/75 via-navy/55 to-mist" />
    </div>
  );
}
