"use client";

import { SearchWidget } from "@/components/SearchWidget";
import { CategoryHero } from "@/components/CategoryHero";
import { HowItWorks, TrustStrip } from "@/components/HowItWorks";
import { useApp } from "@/context/AppContext";

export default function StaysPage() {
  const { m } = useApp();
  return (
    <div className="pb-16">
      <CategoryHero kicker={m.nav.stays} title={m.pages.staysTitle} subtitle={m.pages.staysSub}>
        <SearchWidget initialKind="stays" embedded />
      </CategoryHero>
      <div className="mt-12 space-y-14 sm:mt-16 sm:space-y-20">
        <TrustStrip />
        <HowItWorks />
      </div>
    </div>
  );
}
