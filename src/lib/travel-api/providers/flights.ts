import type { NormalizedOffer, SearchRequest } from "../types";
import { searchLive } from "@/lib/live-search";

export async function searchFlights(req: SearchRequest) {
  const live = await searchLive({
    kind: "flights",
    from: req.origin,
    to: req.destination,
    toCity: req.destinationName,
    depart: req.departDate,
    returnDate: req.returnDate,
    adults: req.adults,
    children: req.children,
    childAges: req.childAges,
    cabin: req.cabin,
    trip: req.trip,
  });
  const offers: NormalizedOffer[] = live.map((o) => ({
    id: o.id,
    type: "flight",
    supplier: o.source,
    title: o.airlineName || o.title,
    subtitle: [o.airline && o.flightNumber ? `${o.airline}${o.flightNumber}` : null, o.stops === 0 ? "Non-stop" : o.stops != null ? `${o.stops} stop(s)` : null]
      .filter(Boolean)
      .join(" · "),
    price: { amount: o.priceCad, currency: "CAD", per: "person" },
    deepLink: o.url,
    bookable: true,
    details: {
      airline: o.airline,
      flightNumber: o.flightNumber,
      stops: o.stops,
      departAt: o.departAt,
      returnAt: o.returnAt,
      durationMin: o.durationMin,
    },
  }));
  const providers = [...new Set(live.map((o) => o.source))];
  return { offers, providers };
}
