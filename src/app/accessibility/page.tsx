"use client";

import { LegalPage } from "@/components/LegalPage";
import { LAST_UPDATED, LAST_UPDATED_FR, accessEn, accessFr } from "@/lib/legal";

export default function AccessibilityPage() {
  return (
    <LegalPage
      titleEn="Accessibility"
      titleFr="Accessibilité"
      updatedEn={`Last updated: ${LAST_UPDATED}`}
      updatedFr={`Dernière mise à jour : ${LAST_UPDATED_FR}`}
      sectionsEn={accessEn}
      sectionsFr={accessFr}
    />
  );
}
