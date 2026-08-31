import type { SearchQuery } from "@/lib/deeplinks";
import { getDestination } from "@/lib/airports";
import {
  bookingHotelsUrl,
  discoverCarsUrl,
  expediaHotelsUrl,
  googleFlightsUrl,
  kayakCarsUrl,
  kayakHotelsUrl,
  type PartnerKey,
} from "@/lib/partners";

export type ScrapedFare = {
  partnerKey: PartnerKey;
  priceCad: number;
  airline?: string;
  flightNumber?: string;
  stops?: number;
  title?: string;
  url: string;
};

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36";

async function html(url: string) {
  const res = await fetch(url, {
    headers: {
      "User-Agent": UA,
      Accept: "text/html,application/xhtml+xml",
      "Accept-Language": "en-CA,en;q=0.9",
    },
    cache: "no-store",
    signal: AbortSignal.timeout(12000),
  });
  if (!res.ok) return "";
  return res.text();
}

function cadLabels(text: string, min: number, max: number) {
  return [...text.matchAll(/aria-label="([0-9]{2,5}) Canadian dollars"/g)]
    .map((m) => Number(m[1]))
    .filter((n) => n >= min && n <= max);
}

function dollarAmounts(text: string, min: number, max: number) {
  const fromCad = [...text.matchAll(/C\$\s*([0-9]{2,5}(?:,[0-9]{3})?)/g)].map((m) => Number(m[1].replace(/,/g, "")));
  const fromDollar = [...text.matchAll(/\$([0-9]{2,5}(?:,[0-9]{3})?)/g)].map((m) => Number(m[1].replace(/,/g, "")));
  return [...fromCad, ...fromDollar].filter((n) => n >= min && n <= max);
}

function flightsFromGs(gs: string) {
  try {
    return Buffer.from(gs, "base64").toString("utf8").match(/[A-Z]{2}\d{2,4}/g) || [];
  } catch {
    return [];
  }
}

function cheapest(nums: number[]) {
  if (!nums.length) return undefined;
  return Math.min(...nums);
}

async function scrapeGoogleFlights(q: SearchQuery): Promise<ScrapedFare[]> {
  const url = googleFlightsUrl(q);
  if (!url) return [];
  const text = await html(url);
  if (!text) return [];
  const re = /data-gs="([^"]+)"[^>]*aria-label="([0-9]{2,5}) Canadian dollars"/g;
  const seen = new Set<string>();
  const out: ScrapedFare[] = [];
  let match: RegExpExecArray | null;
  while ((match = re.exec(text))) {
    const priceCad = Number(match[2]);
    if (priceCad < 60 || priceCad > 9000) continue;
    const codes = flightsFromGs(match[1]);
    const first = codes[0] || "";
    const airline = first.slice(0, 2) || undefined;
    const flightNumber = first.slice(2) || undefined;
    const key = `${priceCad}-${codes.join("|")}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({
      partnerKey: "google",
      priceCad,
      airline,
      flightNumber,
      stops: codes.length > 1 ? 1 : 0,
      title: airline ? undefined : "Google Flights",
      url,
    });
    if (out.length >= 16) break;
  }
  if (!out.length) {
    const low = cheapest(cadLabels(text, 60, 9000));
    if (low) out.push({ partnerKey: "google", priceCad: low, url });
  }
  return out;
}

async function scrapeGoogleHotels(q: SearchQuery): Promise<ScrapedFare[]> {
  const dest = getDestination(q.to || "");
  const city = dest?.city || q.toCity || q.to;
  if (!city || !q.depart) return [];
  const params = new URLSearchParams({
    hl: "en-CA",
    curr: "CAD",
    q: `Hotels in ${city} ${q.depart}${q.returnDate ? ` to ${q.returnDate}` : ""}`,
  });
  const url = `https://www.google.ca/travel/hotels/${encodeURIComponent(city)}?${params.toString()}`;
  const text = await html(url);
  if (!text) return [];
  const prices = [...new Set(cadLabels(text, 40, 2500))].sort((a, b) => a - b).slice(0, 12);
  const page = bookingHotelsUrl(q) || url;
  return prices.map((priceCad, i) => ({
    partnerKey: i === 0 ? "google" : "google",
    priceCad,
    title: `${city} stay`,
    url: page,
  }));
}

async function scrapeSiteMin(url: string | undefined, partnerKey: PartnerKey, min: number, max: number): Promise<ScrapedFare[]> {
  if (!url) return [];
  const text = await html(url);
  if (!text || /captcha|cloudflare|Access Denied|Just a moment/i.test(text)) return [];
  const low = cheapest([...cadLabels(text, min, max), ...dollarAmounts(text, min, max)]);
  if (!low) return [];
  return [{ partnerKey, priceCad: low, url }];
}

export async function scrapeFares(q: SearchQuery): Promise<ScrapedFare[]> {
  const jobs: Promise<ScrapedFare[]>[] = [];
  if (q.kind === "flights") {
    jobs.push(scrapeGoogleFlights(q));
  } else if (q.kind === "stays") {
    jobs.push(scrapeGoogleHotels(q));
    jobs.push(scrapeSiteMin(kayakHotelsUrl(q), "kayak", 40, 2500));
    jobs.push(scrapeSiteMin(expediaHotelsUrl(q), "expedia", 40, 2500));
    jobs.push(scrapeSiteMin(bookingHotelsUrl(q), "booking", 40, 2500));
  } else if (q.kind === "cars") {
    jobs.push(scrapeSiteMin(kayakCarsUrl(q), "kayak", 25, 900));
    jobs.push(scrapeSiteMin(discoverCarsUrl(q), "discover", 20, 500));
  } else if (q.kind === "packages") {
    jobs.push(scrapeGoogleFlights({ ...q, kind: "flights" }));
    jobs.push(scrapeGoogleHotels({ ...q, kind: "stays" }));
  } else {
    return [];
  }
  const settled = await Promise.allSettled(jobs);
  const out: ScrapedFare[] = [];
  for (const item of settled) {
    if (item.status === "fulfilled") out.push(...item.value);
  }
  return out;
}
