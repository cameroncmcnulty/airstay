import type { SearchQuery } from "@/lib/deeplinks";
import { matchResorts, nightsBetween, type Resort } from "@/data/resorts";
import { searchLive, type LiveOffer } from "@/lib/live-search";
import { searchLiteRates } from "@/lib/liteapi";

export type PackageOffer = {
  id: string;
  kind: "packages";
  name: string;
  area: string;
  areaFr: string;
  image: string;
  imageAlt: string;
  imageAltFr: string;
  stars: number;
  vibe: Resort["vibe"];
  board: "all-inclusive";
  amenities: Resort["amenities"];
  blurb: string;
  blurbFr: string;
  nights: number;
  flightFromCad?: number;
  stayCad?: number;
  url: string;
  googleUrl: string;
  bookingUrl: string;
  kayakUrl: string;
  sunwingUrl: string;
  flightsUrl?: string;
  live: true;
};

const BOOKING_SLUG: Record<string, string> = {
  "moon-palace-cancun": "moon-palace-golf-spa-resort",
  "hyatt-ziva-cancun": "hyatt-ziva-cancun",
  "riu-cancun": "riu-cancun",
  "live-aqua-cancun": "live-aqua-cancun",
  "le-blanc-cancun": "le-blanc-spa-resort-cancun",
  "secrets-vine-cancun": "secrets-the-vine-cancun",
  "excellence-playa-mujeres": "excellence-playa-mujeres",
  "atelier-playa-mujeres": "atelier-playa-mujeres",
  "iberostar-cancun": "iberostar-cancun",
  "xcaret-mexico": "hotel-xcaret-mexico",
  "hard-rock-riviera": "hard-rock-hotel-riviera-maya",
  "barcelo-maya": "barcelo-maya-palace",
  "valentin-imperial": "valentin-imperial-maya",
  "grand-palladium-white": "grand-palladium-white-sand-resort-and-spa",
  "hyatt-ziva-vallarta": "hyatt-ziva-puerto-vallarta",
  "secrets-vallarta": "secrets-vallarta-bay-puerto-vallarta",
  "marriott-vallarta": "marriott-puerto-vallarta-resort-and-spa",
  "hyatt-ziva-cabo": "hyatt-ziva-los-cabos",
  "riu-santa-fe": "riu-santa-fe-los-cabos",
  "pueblo-bonito-sunset": "pueblo-bonito-sunset-beach",
};

const KAYAK_PLACE: Record<Resort["region"], string> = {
  cancun: "Cancun,Mexico",
  riviera: "Playa-del-Carmen,Mexico",
  vallarta: "Puerto-Vallarta,Mexico",
  cabo: "Cabo-San-Lucas,Mexico",
};

const SUNWING: Record<Resort["region"], string> = {
  cancun: "https://www.sunwing.ca/en/destinations/mexico/cancun",
  riviera: "https://www.sunwing.ca/en/destinations/mexico/riviera-maya",
  vallarta: "https://www.sunwing.ca/en/destinations/mexico/puerto-vallarta",
  cabo: "https://www.sunwing.ca/en/destinations/mexico/los-cabos",
};

function kayakHotelName(name: string) {
  return name.replace(/[úü]/g, "u").replace(/[á]/g, "a").replace(/[é]/g, "e").replace(/[í]/g, "i").replace(/[ó]/g, "o").replace(/[^A-Za-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function googleHotelsUrl(name: string, q: SearchQuery) {
  const params = new URLSearchParams({
    q: `${name} all inclusive`,
    hl: "en-CA",
    gl: "CA",
    curr: "CAD",
  });
  if (q.depart) params.set("start_date", q.depart);
  if (q.returnDate) params.set("end_date", q.returnDate);
  return `https://www.google.com/travel/hotels?${params.toString()}`;
}

export function googlePackageUrl(name: string, q: SearchQuery) {
  const origin = q.from ? ` from ${q.from}` : " from Canada";
  const when = q.depart ? ` ${q.depart}` : "";
  return `https://www.google.com/travel/search?q=${encodeURIComponent(`${name} all inclusive package${origin}${when}`)}&hl=en-CA&gl=CA&curr=CAD`;
}

function bookingHotelUrl(id: string, q: SearchQuery) {
  const slug = BOOKING_SLUG[id];
  const adults = String(q.adults ?? 2);
  if (!slug) {
    return `https://www.booking.com/searchresults.en-gb.html?ss=${encodeURIComponent(id)}&checkin=${q.depart || ""}&checkout=${q.returnDate || ""}&group_adults=${adults}&no_rooms=${q.rooms || 1}&selected_currency=CAD`;
  }
  const params = new URLSearchParams({
    checkin: q.depart || "",
    checkout: q.returnDate || "",
    group_adults: adults,
    selected_currency: "CAD",
  });
  return `https://www.booking.com/hotel/mx/${slug}.html?${params.toString()}`;
}

function kayakUrl(r: Resort, q: SearchQuery) {
  const adults = q.adults ?? 2;
  const place = KAYAK_PLACE[r.region];
  const hotel = kayakHotelName(r.name);
  const checkin = q.depart || "";
  const checkout = q.returnDate || "";
  if (checkin && checkout) {
    return `https://www.kayak.com/hotels/${hotel},${place}/${checkin}/${checkout}/${adults}adults`;
  }
  return `https://www.kayak.com/hotels/${place}`;
}

function flightsUrl(q: SearchQuery) {
  if (!q.from || !q.to || !q.depart) return undefined;
  if (q.returnDate) return `https://www.kayak.com/flights/${q.from}-${q.to}/${q.depart}/${q.returnDate}`;
  return `https://www.kayak.com/flights/${q.from}-${q.to}/${q.depart}`;
}

export async function searchPackages(q: SearchQuery, flights?: LiveOffer[]): Promise<PackageOffer[]> {
  const nights = nightsBetween(q.depart, q.returnDate);
  const liveFlights = flights ?? (q.from ? await searchLive({ ...q, kind: "flights" }) : []);
  const flightFrom = liveFlights[0]?.priceCad;
  const liveHotels = await searchLiteRates(q, { allInclusive: true, limit: 24 }).catch(() => []);
  if (liveHotels.length) {
    return liveHotels.map((h) => ({
      id: `lite-${h.hotelId}`,
      kind: "packages" as const,
      name: h.name,
      area: h.address || h.city,
      areaFr: h.address || h.city,
      image: h.image || h.thumbnail || "https://images.unsplash.com/photo-1510097467424-192d713fd8b2?auto=format&fit=crop&w=1600&q=80",
      imageAlt: h.name,
      imageAltFr: h.name,
      stars: Math.round(h.stars || 4),
      vibe: h.adultsOnly ? ("adults" as const) : ("family" as const),
      board: "all-inclusive" as const,
      amenities: (h.adultsOnly ? ["meals", "beach", "pools", "adults"] : ["meals", "beach", "pools", "kids"]) as Resort["amenities"],
      blurb: [h.roomName, h.boardName, h.refundable ? "Refundable" : null].filter(Boolean).join(" · "),
      blurbFr: [h.roomName, h.boardName].filter(Boolean).join(" · "),
      nights,
      flightFromCad: flightFrom,
      stayCad: h.stayCad,
      url: googlePackageUrl(h.name, q),
      googleUrl: googleHotelsUrl(h.name, q),
      bookingUrl: `https://www.booking.com/searchresults.en-gb.html?ss=${encodeURIComponent(h.name)}&checkin=${q.depart || ""}&checkout=${q.returnDate || ""}&group_adults=${q.adults ?? 2}&selected_currency=CAD`,
      kayakUrl: `https://www.kayak.com/hotels/${encodeURIComponent(h.city)},Mexico/${q.depart || ""}/${q.returnDate || ""}/${q.adults ?? 2}adults`,
      sunwingUrl: "https://www.sunwing.ca/en/destinations/mexico/cancun",
      flightsUrl: q.from && q.to && q.depart ? `https://www.kayak.com/flights/${q.from}-${q.to}/${q.depart}${q.returnDate ? `/${q.returnDate}` : ""}` : undefined,
      live: true as const,
    }));
  }
  const resorts = matchResorts(q);
  if (!resorts.length) return [];
  return resorts.map((r) => ({
    id: r.id,
    kind: "packages",
    name: r.name,
    area: r.area,
    areaFr: r.areaFr,
    image: r.image,
    imageAlt: r.imageAlt,
    imageAltFr: r.imageAltFr,
    stars: r.stars,
    vibe: r.vibe,
    board: "all-inclusive",
    amenities: r.amenities,
    blurb: r.blurb,
    blurbFr: r.blurbFr,
    nights,
    flightFromCad: flightFrom,
    url: googlePackageUrl(r.name, q),
    googleUrl: googleHotelsUrl(r.name, q),
    bookingUrl: bookingHotelUrl(r.id, q),
    kayakUrl: kayakUrl(r, q),
    sunwingUrl: SUNWING[r.region],
    flightsUrl: flightsUrl(q),
    live: true,
  }));
}
