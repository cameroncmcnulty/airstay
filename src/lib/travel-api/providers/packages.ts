import type { NormalizedOffer, SearchRequest } from "../types";
import { searchPackages as searchResortPackages } from "@/lib/packages";
import { searchFlights } from "./flights";

export async function searchPackages(req: SearchRequest) {
  const providers: string[] = [];
  const flights = await searchFlights(req);
  flights.providers.forEach((p) => providers.push(p));
  const cheapest = flights.offers.find((o) => o.price)?.price?.amount;

  const packages = await searchResortPackages(
    {
      kind: "packages",
      from: req.origin,
      to: req.destination,
      toCity: req.destinationName,
      depart: req.departDate,
      returnDate: req.returnDate,
      adults: req.adults,
      children: req.children,
      childAges: req.childAges,
      rooms: req.rooms,
    },
    []
  );
  if (packages.some((p) => p.stayResultId)) providers.push("duffel");
  else if (packages.length) providers.push("airstay-inventory");

  const offers: NormalizedOffer[] = packages.map((p) => ({
    id: `pkg-${p.id}`,
    type: "package",
    supplier: p.stayResultId ? "duffel" : "airstay-packages",
    supplierOfferId: p.stayResultId,
    title: p.name,
    subtitle: `${p.stars}★ · ${p.area} · ${p.nights} nights · ${p.board}`,
    image: p.image,
    imageAlt: p.imageAlt,
    price:
      p.packageCad != null
        ? { amount: p.packageCad, currency: "CAD", per: "package" }
        : cheapest != null
          ? { amount: cheapest, currency: "CAD", per: "person" }
          : undefined,
    deepLink: p.url,
    bookable: Boolean(p.stayResultId),
    details: {
      nights: p.nights,
      vibe: p.vibe,
      amenities: p.amenities,
      area: p.area,
      areaFr: p.areaFr,
      blurb: p.blurb,
      blurbFr: p.blurbFr,
      stars: p.stars,
      stayCad: p.stayCad,
      flightsUrl: p.flightsUrl,
      flightFromCad: p.flightFromCad ?? cheapest,
      stayResultId: p.stayResultId,
    },
  }));

  return { offers, providers: [...new Set(providers)] };
}
