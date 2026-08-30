"use client";

import { useEffect, useState } from "react";

const WAVE_A =
  "M0,62 C200,108 400,16 600,62 C800,108 1000,16 1200,62 C1400,108 1600,16 1800,62 C2000,108 2200,16 2400,62 L2400,120 L0,120 Z";
const WAVE_B =
  "M0,48 C150,8 350,96 600,48 C850,0 1050,92 1200,48 C1350,8 1550,96 1800,48 C2050,0 2250,92 2400,48 L2400,120 L0,120 Z";
const WAVE_C =
  "M0,78 C180,48 420,104 600,78 C780,52 1020,104 1200,78 C1380,48 1620,104 1800,78 C1980,52 2220,104 2400,78 L2400,120 L0,120 Z";

function WaveLayer({
  className,
  d,
  fill,
}: {
  className: string;
  d: string;
  fill: string;
}) {
  return (
    <svg className={className} viewBox="0 0 2400 120" preserveAspectRatio="none" aria-hidden>
      <path d={d} fill={fill} />
    </svg>
  );
}

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
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
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
      <div
        className={`absolute inset-x-0 bottom-0 bg-gradient-to-b from-transparent via-mist/30 to-mist/15 ${
          compact ? "h-[55%]" : "h-[40%]"
        }`}
      />
      <div className={`hero-waves ${compact ? "hero-waves-compact" : ""} ${reduce ? "is-still" : ""}`}>
        <WaveLayer className="hero-wave hero-wave-a" d={WAVE_A} fill="rgba(214,231,246,0.72)" />
        <WaveLayer className="hero-wave hero-wave-b" d={WAVE_B} fill="rgba(243,246,251,0.86)" />
        <WaveLayer className="hero-wave hero-wave-c" d={WAVE_C} fill="#f3f6fb" />
        <div className="hero-wave-shore" />
      </div>
    </div>
  );
}
