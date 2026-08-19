"use client";

import { LegalPage } from "@/components/LegalPage";
import { LAST_UPDATED, LAST_UPDATED_FR, privacyEn, privacyFr } from "@/lib/legal";

export default function PrivacyPage() {
  return (
    <LegalPage
      titleEn="Privacy Policy"
      titleFr="Politique de confidentialité"
      updatedEn={`Last updated: ${LAST_UPDATED}`}
      updatedFr={`Dernière mise à jour : ${LAST_UPDATED_FR}`}
      sectionsEn={privacyEn}
      sectionsFr={privacyFr}
    />
  );
}
