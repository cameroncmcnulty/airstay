import type { SearchQuery } from "@/lib/deeplinks";

export type LiteHotelRate = {
  hotelId: string;
  name: string;
  address: string;
  city: string;
  image?: string;
  thumbnail?: string;
  stars?: number;
  rating?: number;
  reviewCount?: number;
  roomName?: string;
  boardName?: string;
  boardType?: string;
  stayCad: number;
  publicCad?: number;
  refundable?: boolean;
  adultsOnly?: boolean;
};

const CITY: Record<string, { city: string; country: string }> = {
  CUN: { city: "Cancun", country: "MX" },
  PVR: { city: "Puerto Vallarta", country: "MX" },
  SJD: { city: "Cabo San Lucas", country: "MX" },
  CZM: { city: "Cozumel", country: "MX" },
  MID: { city: "Merida", country: "MX" },
  HUX: { city: "Huatulco", country: "MX" },
  ACA: { city: "Acapulco", country: "MX" },
  ZLO: { city: "Manzanillo", country: "MX" },
  MEX: { city: "Mexico City", country: "MX" },
  CUN2: { city: "Playa del Carmen", country: "MX" },
};

function money(v: unknown): number {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (Array.isArray(v) && v[0] && typeof v[0] === "object" && v[0] !== null && "amount" in v[0]) {
    return Number((v[0] as { amount: number }).amount) || 0;
  }
  if (v && typeof v === "object" && "amount" in v) return Number((v as { amount: number }).amount) || 0;
  return 0;
}

function place(q: SearchQuery) {
  const code = (q.to || "").toUpperCase();
  if (CITY[code]) return CITY[code];
  const name = (q.toCity || "").trim();
  if (/cancun|cancún|mujeres|playa|tulum|riviera/i.test(name + " " + code)) return { city: "Cancun", country: "MX" };
  if (/vallarta|nayarit/i.test(name)) return { city: "Puerto Vallarta", country: "MX" };
  if (/cabo|lucas/i.test(name)) return { city: "Cabo San Lucas", country: "MX" };
  if (name) return { city: name, country: "MX" };
  return null;
}

export async function searchLiteRates(q: SearchQuery, opts?: { allInclusive?: boolean; limit?: number }): Promise<LiteHotelRate[]> {
  const key = process.env.LITEAPI_KEY;
  if (!key) return [];
  const loc = place(q);
  if (!loc || !q.depart || !q.returnDate) return [];

  const body: Record<string, unknown> = {
    cityName: loc.city,
    countryCode: loc.country,
    checkin: q.depart,
    checkout: q.returnDate,
    currency: "CAD",
    guestNationality: "CA",
    occupancies: [{ adults: q.adults || 2, children: q.childAges || [] }],
    maxRatesPerHotel: 1,
    limit: opts?.limit ?? 24,
    timeout: 12,
    includeHotelData: true,
    sort: [{ field: "price", direction: "ascending" }],
  };
  if (opts?.allInclusive !== false) body.boardType = "AI";

  const res = await fetch("https://api.liteapi.travel/v3.0/hotels/rates", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-API-Key": key,
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) return [];
  const json = (await res.json()) as {
    data?: Array<Record<string, unknown>>;
    hotels?: Array<Record<string, unknown>>;
  };
  const hotels = new Map((json.hotels || []).map((h) => [String(h.id), h]));
  const out: LiteHotelRate[] = [];
  for (const row of json.data || []) {
    const id = String(row.hotelId || "");
    const hotel = hotels.get(id) || {};
    const room = Array.isArray(row.roomTypes) ? (row.roomTypes[0] as Record<string, unknown>) : undefined;
    const rate = Array.isArray(room?.rates) ? (room.rates[0] as Record<string, unknown>) : undefined;
    const retail = (rate?.retailRate as Record<string, unknown> | undefined) || {};
    const stayCad = money(room?.offerRetailRate) || money(retail.total);
    if (!id || stayCad <= 0) continue;
    const board = String(rate?.boardName || rate?.boardType || "");
    const name = String(hotel.name || "Hotel");
    out.push({
      hotelId: id,
      name,
      address: String(hotel.address || ""),
      city: String(hotel.city_name || loc.city),
      image: (hotel.main_photo as string) || undefined,
      thumbnail: (hotel.thumbnail as string) || undefined,
      stars: hotel.stars != null ? Number(hotel.stars) : undefined,
      rating: hotel.rating != null ? Number(hotel.rating) : undefined,
      reviewCount: hotel.review_count != null ? Number(hotel.review_count) : undefined,
      roomName: String(rate?.name || room?.name || ""),
      boardName: board,
      boardType: String(rate?.boardType || ""),
      stayCad: Math.round(stayCad),
      publicCad: money(room?.suggestedSellingPrice) || money(retail.suggestedSellingPrice) || undefined,
      refundable: String((rate?.cancellationPolicies as { refundableTag?: string } | undefined)?.refundableTag || "") === "RFN",
      adultsOnly: /adult/i.test(name),
    });
  }
  return out.sort((a, b) => a.stayCad - b.stayCad);
}
