"use client";

import { Plane, Building2, Car, TreePalm, Briefcase } from "lucide-react";
import type { SearchKind } from "@/lib/deeplinks";

export function CategoryMotion({
  kind,
  play,
  playKey,
  className,
}: {
  kind: SearchKind;
  play: boolean;
  playKey: number;
  className: string;
}) {
  const cls = `${className} cat-icon`;
  return (
    <span key={playKey} className={`cat-scene ${play ? "is-play" : ""}`} aria-hidden>
      {kind === "flights" && (
        <>
          <span className="cat-wake" />
          <Plane className={`${cls} cat-plane`} />
        </>
      )}
      {kind === "stays" && (
        <>
          <span className="cat-window cat-window-a" />
          <span className="cat-window cat-window-b" />
          <Building2 className={`${cls} cat-hotel`} />
        </>
      )}
      {kind === "cars" && (
        <>
          <Building2 className={`${cls} cat-hotel-bg`} />
          <Car className={`${cls} cat-car`} />
        </>
      )}
      {kind === "packages" && (
        <>
          <TreePalm className={`${cls} cat-palm`} />
          <Briefcase className={`${cls} cat-bag`} />
        </>
      )}
    </span>
  );
}
