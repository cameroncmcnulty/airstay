"use client";

import { SearchWidget } from "@/components/SearchWidget";
import { CategoryHero } from "@/components/CategoryHero";
import { useApp } from "@/context/AppContext";

export default function CarsPage() {
  const { m } = useApp();
  return (
    <div className="pb-16">
      <CategoryHero kicker={m.nav.cars} title={m.bubbles.cars} subtitle={m.bubbles.carsSub}>
        <SearchWidget initialKind="cars" />
      </CategoryHero>
    </div>
  );
}
