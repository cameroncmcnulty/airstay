"use client";

import { LegalPage } from "@/components/LegalPage";
import { LAST_UPDATED, LAST_UPDATED_FR, termsEn, termsFr } from "@/lib/legal";

export default function TermsPage() {
  return (
    <LegalPage
      titleEn="Terms of Service"
      titleFr="Conditions d’utilisation"
      updatedEn={`Last updated: ${LAST_UPDATED}`}
      updatedFr={`Dernière mise à jour : ${LAST_UPDATED_FR}`}
      sectionsEn={termsEn}
      sectionsFr={termsFr}
    />
  );
}
