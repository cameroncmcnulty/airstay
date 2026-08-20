"use client";

import { SearchWidget } from "@/components/SearchWidget";
import { CategoryHero } from "@/components/CategoryHero";
import { useApp } from "@/context/AppContext";

export default function StaysPage() {
  const { m } = useApp();
  return (
    <div className="pb-16">
      <CategoryHero kicker={m.nav.stays} title={m.bubbles.stays} subtitle={m.bubbles.staysSub}>
        <SearchWidget initialKind="stays" />
      </CategoryHero>
    </div>
  );
}
