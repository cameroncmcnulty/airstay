import type { NormalizedOffer, SearchRequest } from "../types";
import { searchLive } from "@/lib/live-search";

export async function searchCars(req: SearchRequest) {
  const live = await searchLive({
    kind: "cars",
    to: req.destination,
    toCity: req.destinationName,
    depart: req.departDate,
    returnDate: req.returnDate,
    adults: req.adults,
  });
  const offers: NormalizedOffer[] = live.map((o) => ({
    id: o.id,
    type: "car",
    supplier: "travelpayouts",
    title: o.partner || o.title,
    subtitle: "Pickup dates from AIRSTAY",
    deepLink: o.url,
    bookable: true,
    details: { partner: o.partner },
  }));
  return { offers, providers: offers.length ? ["travelpayouts"] : [] };
}
