"use client";

import { SearchWidget } from "@/components/SearchWidget";
import { CategoryHero } from "@/components/CategoryHero";
import { useApp } from "@/context/AppContext";

export default function PackagesPage() {
  const { m } = useApp();
  return (
    <div className="pb-16">
      <CategoryHero kicker={m.nav.packages} title={m.bubbles.packages} subtitle={m.bubbles.packagesSub}>
        <SearchWidget initialKind="packages" />
      </CategoryHero>
    </div>
  );
}
