"use client";

import { SearchWidget } from "@/components/SearchWidget";
import { CategoryHero } from "@/components/CategoryHero";
import { HowItWorks, TrustStrip } from "@/components/HowItWorks";
import { useApp } from "@/context/AppContext";

export default function EsimPage() {
  const { m } = useApp();
  return (
    <div className="pb-16">
      <CategoryHero kicker={m.nav.esim} title={m.pages.esimTitle} subtitle={m.pages.esimSub}>
        <SearchWidget initialKind="esim" embedded />
      </CategoryHero>
      <div className="mt-12 space-y-14 sm:mt-16 sm:space-y-20">
        <TrustStrip />
        <HowItWorks />
      </div>
    </div>
  );
}
