import type { NormalizedOffer, SearchRequest } from "../types";
import { buildPartnerOffers } from "@/lib/deeplinks";

export async function searchCars(req: SearchRequest) {
  const partners = buildPartnerOffers({
    kind: "cars",
    to: req.destination,
    toCity: req.destinationName,
    depart: req.departDate,
    returnDate: req.returnDate,
    adults: req.adults,
  });
  const offers: NormalizedOffer[] = partners.map((p) => ({
    id: `car-${p.id}`,
    type: "car",
    supplier: p.partner.toLowerCase().replace(/\s+/g, "-"),
    title: p.partner,
    subtitle: p.tagline,
    deepLink: p.url,
    bookable: true,
    details: { fulfillment: "supplier" },
  }));
  return { offers, providers: ["deeplink"] };
}
