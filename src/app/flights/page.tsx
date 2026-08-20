"use client";

import { SearchWidget } from "@/components/SearchWidget";
import { CategoryHero } from "@/components/CategoryHero";
import { useApp } from "@/context/AppContext";

export default function FlightsPage() {
  const { m } = useApp();
  return (
    <div className="pb-16">
      <CategoryHero kicker={m.nav.flights} title={m.hero.title} subtitle={m.search.canadaOnly}>
        <SearchWidget initialKind="flights" />
      </CategoryHero>
    </div>
  );
}
