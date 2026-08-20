import type { NormalizedOffer, SearchRequest } from "../types";
import { matchResorts, nightsBetween } from "@/data/resorts";
import { duffelConfigured, searchStays } from "@/lib/duffel";
import { queryToParams } from "@/lib/deeplinks";

export async function searchHotels(req: SearchRequest) {
  const providers: string[] = [];
  const offers: NormalizedOffer[] = [];
  const nights = nightsBetween(req.departDate, req.returnDate);
  const q = {
    kind: "stays" as const,
    to: req.destination,
    toCity: req.destinationName,
    depart: req.departDate,
    returnDate: req.returnDate,
    adults: req.adults,
    children: req.children,
    childAges: req.childAges,
    rooms: req.rooms,
  };

  if (duffelConfigured()) {
    const stays = await searchStays(q).catch(() => []);
    if (stays.length) {
      providers.push("duffel");
      for (const h of stays) {
        offers.push({
          id: h.searchResultId,
          type: "hotel",
          supplier: "duffel",
          supplierOfferId: h.searchResultId,
          title: h.name,
          subtitle: `${h.stars}★ · ${h.city} · ${h.board || "Stay"}`,
          image: h.image,
          imageAlt: h.name,
          price: { amount: h.stayCad, currency: "CAD", per: "package" },
          deepLink: `/book?${queryToParams(q)}&stayId=${encodeURIComponent(h.searchResultId)}&accId=${encodeURIComponent(h.accommodationId)}&hotel=${encodeURIComponent(h.name)}`,
          bookable: true,
          details: {
            stayResultId: h.searchResultId,
            accommodationId: h.accommodationId,
            board: h.board,
            reviewScore: h.reviewScore,
          },
        });
      }
      return { offers, providers };
    }
  }

  const resorts = matchResorts({ to: req.destination, toCity: req.destinationName });
  if (resorts.length) {
    providers.push("airstay-inventory");
    for (const r of resorts) {
      offers.push({
        id: `hotel-${r.id}`,
        type: "hotel",
        supplier: "airstay-inventory",
        title: r.name,
        subtitle: `${r.stars}★ · ${r.area} · ${nights} nights · all-inclusive`,
        image: r.image,
        imageAlt: r.imageAlt,
        deepLink: `/results?${queryToParams(q)}`,
        bookable: false,
        details: {
          stars: r.stars,
          board: r.board,
          vibe: r.vibe,
          amenities: r.amenities,
          nights,
          area: r.area,
          areaFr: r.areaFr,
          blurb: r.blurb,
          blurbFr: r.blurbFr,
        },
      });
    }
  }

  return { offers, providers };
}
