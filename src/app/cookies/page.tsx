"use client";

import { LegalPage } from "@/components/LegalPage";
import { LAST_UPDATED, LAST_UPDATED_FR, cookiesEn, cookiesFr } from "@/lib/legal";

export default function CookiesPage() {
  return (
    <LegalPage
      titleEn="Cookie Policy"
      titleFr="Politique de témoins"
      updatedEn={`Last updated: ${LAST_UPDATED}`}
      updatedFr={`Dernière mise à jour : ${LAST_UPDATED_FR}`}
      sectionsEn={cookiesEn}
      sectionsFr={cookiesFr}
    />
  );
}
