"use client";

import { SearchWidget } from "@/components/SearchWidget";
import { CategoryHero } from "@/components/CategoryHero";
import { HowItWorks, TrustStrip } from "@/components/HowItWorks";
import { PopularDestGrid } from "@/components/PopularDestGrid";
import { useApp } from "@/context/AppContext";

export default function CarsPage() {
  const { m } = useApp();
  return (
    <div className="pb-16">
      <CategoryHero kicker={m.nav.cars} title={m.pages.carsTitle} subtitle={m.pages.carsSub}>
        <SearchWidget initialKind="cars" embedded />
      </CategoryHero>
      <div className="mt-12 space-y-14 sm:mt-16 sm:space-y-20">
        <TrustStrip />
        <PopularDestGrid kind="cars" />
        <HowItWorks />
      </div>
    </div>
  );
}
