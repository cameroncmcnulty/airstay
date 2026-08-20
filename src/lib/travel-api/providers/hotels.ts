import type { NormalizedOffer, SearchRequest } from "../types";
import { matchResorts, nightsBetween } from "@/data/resorts";
import { googleHotelsUrl } from "@/lib/packages";
import { searchLiteRates } from "@/lib/liteapi";

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
    rooms: req.rooms,
  };

  const liteHotels = await searchLiteRates(
    {
      kind: "stays",
      to: req.destination,
      toCity: req.destinationName,
      depart: req.departDate,
      returnDate: req.returnDate,
      adults: req.adults,
      childAges: req.childAges,
    },
    { allInclusive: true, limit: 24 }
  ).catch(() => []);
  if (liteHotels.length) {
    providers.push("liteapi");
    for (const h of liteHotels) {
      offers.push({
        id: `lite-${h.hotelId}`,
        type: "hotel",
        supplier: "liteapi",
        title: h.name,
        subtitle: `${h.stars || ""}★ · ${h.city} · ${h.boardName || "All Inclusive"}`,
        image: h.image,
        imageAlt: h.name,
        price: { amount: h.stayCad, currency: "CAD", per: "package" },
        deepLink: googleHotelsUrl(h.name, q),
        bookable: true,
        details: { hotelId: h.hotelId, roomName: h.roomName, rating: h.rating, refundable: h.refundable },
      });
    }
  }

  const resorts = liteHotels.length ? [] : matchResorts({ to: req.destination, toCity: req.destinationName });
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
        deepLink: googleHotelsUrl(r.name, q),
        bookable: true,
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
