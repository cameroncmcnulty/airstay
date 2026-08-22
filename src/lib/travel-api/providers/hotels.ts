import type { NormalizedOffer, SearchRequest } from "../types";
import { searchLive } from "@/lib/live-search";

export async function searchHotels(req: SearchRequest) {
  const live = await searchLive({
    kind: "stays",
    to: req.destination,
    toCity: req.destinationName,
    depart: req.departDate,
    returnDate: req.returnDate,
    adults: req.adults,
    children: req.children,
    childAges: req.childAges,
    rooms: req.rooms,
  });
  const offers: NormalizedOffer[] = live.map((o) => ({
    id: o.id,
    type: "hotel",
    supplier: "travelpayouts",
    title: o.partner || o.title,
    subtitle: "Dates and guests from AIRSTAY",
    deepLink: o.url,
    bookable: true,
    details: { partner: o.partner },
  }));
  return { offers, providers: offers.length ? ["travelpayouts"] : [] };
}
