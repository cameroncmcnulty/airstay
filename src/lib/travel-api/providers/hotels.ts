import type { NormalizedOffer, SearchRequest } from "../types";
import { matchResorts, nightsBetween } from "@/data/resorts";
import { googleHotelsUrl } from "@/lib/packages";

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

  const lite = await searchLiteApi(req);
  if (lite.length) {
    providers.push("liteapi");
    offers.push(...lite);
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

async function searchLiteApi(req: SearchRequest): Promise<NormalizedOffer[]> {
  const key = process.env.LITEAPI_KEY;
  if (!key || !req.destination) return [];
  try {
    const res = await fetch("https://api.liteapi.travel/v3.0/hotels/rates", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": key,
        Accept: "application/json",
      },
      body: JSON.stringify({
        iataCode: req.destination,
        checkin: req.departDate,
        checkout: req.returnDate,
        occupancies: [{ adults: req.adults || 2, children: req.childAges || [] }],
        currency: "CAD",
        guestNationality: "CA",
        maxRatesPerHotel: 1,
      }),
    });
    if (!res.ok) return [];
    const json = (await res.json()) as { data?: Array<Record<string, unknown>> };
    const rows = json.data || [];
    return rows.slice(0, 20).map((row, i) => {
      const hotel = (row.hotel as Record<string, unknown>) || row;
      const rate = (row.roomTypes as Array<Record<string, unknown>>)?.[0] || row;
      const amount = Number(rate.retailRate ?? rate.price ?? row.price ?? 0);
      return {
        id: `lite-${String(hotel.id || i)}`,
        type: "hotel" as const,
        supplier: "liteapi",
        title: String(hotel.name || "Hotel"),
        subtitle: String(hotel.address || hotel.city || ""),
        image: Array.isArray(hotel.main_photo) ? undefined : (hotel.main_photo as string | undefined),
        price: amount > 0 ? { amount: Math.round(amount), currency: "CAD" as const, per: "package" as const } : undefined,
        deepLink: googleHotelsUrl(String(hotel.name || req.destinationName || ""), {
          kind: "stays",
          to: req.destination,
          depart: req.departDate,
          returnDate: req.returnDate,
          adults: req.adults,
        }),
        bookable: true,
        details: { raw: { id: hotel.id, stars: hotel.starRating || hotel.stars } },
      };
    });
  } catch {
    return [];
  }
}
