"use client";

import { VacationPackages } from "@/components/VacationPackages";
import { CategoryHero } from "@/components/CategoryHero";
import { HowItWorks, TrustStrip } from "@/components/HowItWorks";
import { useApp } from "@/context/AppContext";

export default function PackagesPage() {
  const { m } = useApp();
  return (
    <div className="pb-16">
      <CategoryHero kicker={m.nav.packages} title={m.pages.packagesTitle} subtitle={m.pages.packagesSub}>
        <VacationPackages compact />
      </CategoryHero>
      <div className="mt-12 space-y-14 sm:mt-16 sm:space-y-20">
        <TrustStrip />
        <HowItWorks />
      </div>
    </div>
  );
}
