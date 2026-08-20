import type { SearchQuery } from "@/lib/deeplinks";
import { matchResorts, nightsBetween, type Resort } from "@/data/resorts";
import { searchLive, type LiveOffer } from "@/lib/live-search";

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
  url: string;
  bookingUrl: string;
  live: true;
};

function hotelUrl(name: string, area: string, q: SearchQuery) {
  const dest = encodeURIComponent(`${name}, ${area}`);
  const checkin = q.depart || "";
  const checkout = q.returnDate || "";
  const adults = q.adults ?? 2;
  return `https://www.booking.com/searchresults.html?ss=${dest}&checkin=${checkin}&checkout=${checkout}&group_adults=${adults}&no_rooms=${q.rooms || 1}&selected_currency=CAD&nflt=mealplan%3Dall_inclusive`;
}

function packageUrl(name: string, q: SearchQuery) {
  const origin = q.from || "YYZ";
  const city = encodeURIComponent(q.toCity || name);
  if (q.from) {
    return `https://www.expedia.ca/PackageSearch?packageType=fh&origin=${origin}&destination=${city}&fromDate=${q.depart || ""}&toDate=${q.returnDate || ""}&adults=${q.adults ?? 2}`;
  }
  return hotelUrl(name, q.toCity || "Mexico", q);
}

export async function searchPackages(q: SearchQuery, flights?: LiveOffer[]): Promise<PackageOffer[]> {
  const resorts = matchResorts(q);
  if (!resorts.length) return [];
  const nights = nightsBetween(q.depart, q.returnDate);
  const liveFlights = flights ?? (q.from ? await searchLive({ ...q, kind: "flights" }) : []);
  const flightFrom = liveFlights[0]?.priceCad;
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
    board: r.board,
    amenities: r.amenities,
    blurb: r.blurb,
    blurbFr: r.blurbFr,
    nights,
    flightFromCad: flightFrom,
    url: packageUrl(r.name, q),
    bookingUrl: hotelUrl(r.name, r.area, q),
    live: true,
  }));
}
