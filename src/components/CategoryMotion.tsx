"use client";

import { useEffect } from "react";
import { Plane, Building2, Car, Smartphone } from "lucide-react";
import type { SearchKind } from "@/lib/deeplinks";

const MAIN = {
  flights: Plane,
  stays: Building2,
  cars: Car,
  packages: Smartphone,
  esim: Smartphone,
} as const;

export function CategoryMotion({
  kind,
  play,
  playKey,
  className,
  onDone,
}: {
  kind: SearchKind;
  play: boolean;
  playKey: number;
  className: string;
  onDone: () => void;
}) {
  const Icon = MAIN[kind] || Smartphone;

  useEffect(() => {
    if (!play) return;
    const t = window.setTimeout(onDone, 1100);
    return () => window.clearTimeout(t);
  }, [play, playKey, onDone]);

  const waves = kind === "esim";

  return (
    <span key={playKey} className={`cat-scene ${play ? "is-play" : ""}`} aria-hidden>
      {play && kind === "flights" && <span className="cat-wake" />}
      {play && kind === "stays" && (
        <>
          <span className="cat-z cat-z1">z</span>
          <span className="cat-z cat-z2">z</span>
          <span className="cat-z cat-z3">z</span>
        </>
      )}
      {play && kind === "cars" && <Building2 className={`${className} cat-fx cat-hotel-bg`} strokeWidth={2.4} />}
      {play && waves && (
        <>
          <span className="cat-wave cat-wave1" />
          <span className="cat-wave cat-wave2" />
          <span className="cat-wave cat-wave3" />
        </>
      )}
      <Icon className={`${className} cat-icon cat-main cat-${kind}`} strokeWidth={2.4} />
    </span>
  );
}
