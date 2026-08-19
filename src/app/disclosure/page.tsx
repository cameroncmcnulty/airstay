"use client";

import { LegalPage } from "@/components/LegalPage";
import { LAST_UPDATED, LAST_UPDATED_FR, disclosureEn, disclosureFr } from "@/lib/legal";

export default function DisclosurePage() {
  return (
    <LegalPage
      titleEn="Affiliate disclosure"
      titleFr="Divulgation d’affiliation"
      updatedEn={`Last updated: ${LAST_UPDATED}`}
      updatedFr={`Dernière mise à jour : ${LAST_UPDATED_FR}`}
      sectionsEn={disclosureEn}
      sectionsFr={disclosureFr}
    />
  );
}
