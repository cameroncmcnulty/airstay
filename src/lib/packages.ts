import { queryToParams, type SearchQuery } from "@/lib/deeplinks";
import { matchResorts, nightsBetween, type Resort } from "@/data/resorts";
import { searchLive, aviasalesUrl, type LiveOffer } from "@/lib/live-search";
import { duffelConfigured, searchStays } from "@/lib/duffel";

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
  board: string;
  amenities: Resort["amenities"];
  blurb: string;
  blurbFr: string;
  nights: number;
  flightFromCad?: number;
  stayCad?: number;
  packageCad?: number;
  url: string;
  flightsUrl?: string;
  stayResultId?: string;
  accommodationId?: string;
  live: true;
};

const FALLBACK_IMG = "https://images.unsplash.com/photo-1510097467424-192d713fd8b2?auto=format&fit=crop&w=1600&q=80";

function vibeFrom(name: string, adultsOnly: boolean): Resort["vibe"] {
  if (adultsOnly || /adult|secrets|excellence|le blanc|live aqua/i.test(name)) return "adults";
  if (/palace|ritz|atelier|four seasons|grand hyatt|waldorf/i.test(name)) return "luxury";
  return "family";
}

function amenitiesFrom(list: string[], adultsOnly: boolean): Resort["amenities"] {
  const out: Resort["amenities"] = ["meals"];
  const blob = list.join(" ").toLowerCase();
  if (/beach/.test(blob)) out.push("beach");
  else out.push("beach");
  if (/pool/.test(blob)) out.push("pools");
  else out.push("pools");
  if (/spa/.test(blob)) out.push("spa");
  if (adultsOnly) out.push("adults");
  else out.push("kids");
  return out;
}

function bookUrl(q: SearchQuery, extra: Record<string, string>) {
  const p = new URLSearchParams(queryToParams({ ...q, kind: q.kind === "stays" ? "stays" : "packages" }));
  for (const [k, v] of Object.entries(extra)) {
    if (v) p.set(k, v);
  }
  return `/book?${p.toString()}`;
}

export async function searchPackages(q: SearchQuery, flights?: LiveOffer[]): Promise<PackageOffer[]> {
  const nights = nightsBetween(q.depart, q.returnDate);
  const liveFlights = flights ?? (q.from ? await searchLive({ ...q, kind: "flights" }) : []);
  const flightFrom = liveFlights[0]?.priceCad;
  const flightsUrl = aviasalesUrl(q);
  const adults = Math.max(1, q.adults || 1);

  if (duffelConfigured() && q.depart && q.returnDate) {
    const stays = await searchStays(q).catch(() => []);
    if (stays.length) {
      return stays.slice(0, 24).map((h) => {
        const packageCad = h.stayCad + (flightFrom ? flightFrom * adults : 0);
        return {
          id: h.searchResultId,
          kind: "packages" as const,
          name: h.name,
          area: h.address || h.city,
          areaFr: h.address || h.city,
          image: h.image || FALLBACK_IMG,
          imageAlt: h.name,
          imageAltFr: h.name,
          stars: h.stars,
          vibe: vibeFrom(h.name, h.adultsOnly),
          board: h.board || "Stay",
          amenities: amenitiesFrom(h.amenities, h.adultsOnly),
          blurb: [h.board, h.reviewScore ? `${h.reviewScore}/10` : null, h.description?.slice(0, 140)]
            .filter(Boolean)
            .join(" · "),
          blurbFr: [h.board, h.description?.slice(0, 140)].filter(Boolean).join(" · "),
          nights,
          flightFromCad: flightFrom,
          stayCad: h.stayCad,
          packageCad: flightFrom ? packageCad : h.stayCad,
          url: bookUrl(q, {
            stayId: h.searchResultId,
            accId: h.accommodationId,
            hotel: h.name,
            stayCad: String(h.stayCad),
            flights: flightsUrl || "",
          }),
          flightsUrl,
          stayResultId: h.searchResultId,
          accommodationId: h.accommodationId,
          live: true as const,
        };
      });
    }
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
    packageCad: flightFrom ? flightFrom * adults : undefined,
    url: flightsUrl || "/",
    flightsUrl,
    live: true,
  }));
}
