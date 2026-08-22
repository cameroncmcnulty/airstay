import { randomUUID } from "crypto";
import type { Booking, BookingPassenger, NormalizedOffer, SearchRequest, SearchResponse } from "./types";
import { getOffer, putBooking, putOffers, logSearch } from "./store";
import { searchFlights } from "./providers/flights";
import { searchHotels } from "./providers/hotels";
import { searchCars } from "./providers/cars";

export async function runSearch(req: SearchRequest): Promise<SearchResponse> {
  const started = Date.now();
  const providers = new Set<string>();
  let offers: NormalizedOffer[] = [];

  if (req.type === "flight") {
    const r = await searchFlights(req);
    offers = r.offers;
    r.providers.forEach((p) => providers.add(p));
  } else if (req.type === "hotel") {
    const r = await searchHotels(req);
    offers = r.offers;
    r.providers.forEach((p) => providers.add(p));
  } else if (req.type === "car") {
    const r = await searchCars(req);
    offers = r.offers;
    r.providers.forEach((p) => providers.add(p));
  } else {
    offers = [];
  }

  putOffers(offers);
  logSearch({
    kind: req.type,
    origin: req.origin,
    destination: req.destination || req.destinationName,
    depart: req.departDate,
    returnDate: req.returnDate,
    adults: req.adults,
    results: offers.length,
    providers: [...providers],
    source: [...providers].join(","),
  });
  return {
    success: true,
    data: {
      searchId: randomUUID(),
      currency: "CAD",
      offers,
    },
    meta: {
      elapsedMs: Date.now() - started,
      providers: [...providers],
      generatedAt: new Date().toISOString(),
    },
  };
}

export function createBooking(input: {
  offerId: string;
  offer?: NormalizedOffer;
  passengers: BookingPassenger[];
  contactEmail: string;
}) {
  if (input.offer) putOffers([input.offer]);
  const offer = getOffer(input.offerId) || input.offer;
  if (!offer) {
    return { success: false as const, error: { code: "offer_not_found", message: "Offer expired or unknown. Search again." } };
  }
  if (!input.passengers?.[0]?.firstName || !input.passengers[0].lastName || !input.contactEmail) {
    return { success: false as const, error: { code: "invalid_passengers", message: "First name, last name and email are required." } };
  }
  const booking = putBooking({
    id: `AIR-${Date.now().toString(36).toUpperCase()}-${randomUUID().slice(0, 8).toUpperCase()}`,
    status: "pending_supplier",
    createdAt: new Date().toISOString(),
    offer,
    passengers: input.passengers,
    contactEmail: input.contactEmail,
    currency: "CAD",
    total: offer.price,
    confirmationUrl: offer.deepLink,
    notes:
      "AIRSTAY is a comparison layer. Complete the booking on the Travelpayouts partner site with the same dates from this search.",
  });
  return { success: true as const, data: booking };
}
