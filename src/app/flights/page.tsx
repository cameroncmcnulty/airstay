"use client";

import { SearchWidget } from "@/components/SearchWidget";
import { CategoryHero } from "@/components/CategoryHero";
import { HowItWorks, TrustStrip } from "@/components/HowItWorks";
import { PopularDestGrid } from "@/components/PopularDestGrid";
import { DealGrid } from "@/components/DealCard";
import { useApp } from "@/context/AppContext";

export default function FlightsPage() {
  const { m } = useApp();
  return (
    <div className="pb-16">
      <CategoryHero kicker={m.nav.flights} title={m.bubbles.flights} subtitle={m.search.canadaOnly}>
        <SearchWidget initialKind="flights" />
      </CategoryHero>
      <div className="mt-12 space-y-14 sm:mt-16 sm:space-y-20">
        <TrustStrip />
        <PopularDestGrid kind="flights" />
        <DealGrid limit={4} />
        <HowItWorks />
      </div>
    </div>
  );
}
