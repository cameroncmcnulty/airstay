import type { SearchQuery } from "@/lib/deeplinks";
import { getDestination } from "@/lib/airports";
import { nightsBetween } from "@/lib/partners";
import type { LiveOffer } from "@/lib/live-search";
import { tpTrack } from "@/lib/affiliate";

const SLUG_ALIAS: Record<string, string> = {
  usa: "united-states",
  us: "united-states",
  "united states": "united-states",
  uk: "united-kingdom",
  britain: "united-kingdom",
  "united kingdom": "united-kingdom",
  "great britain": "united-kingdom",
  korea: "south-korea",
  "south korea": "south-korea",
  "czech republic": "czechia",
  uae: "united-arab-emirates",
  "united arab emirates": "united-arab-emirates",
  vietnam: "viet-nam",
  "viet nam": "viet-nam",
  "dominican republic": "dominican-republic",
  "costa rica": "costa-rica",
  "puerto rico": "puerto-rico",
  "new zealand": "new-zealand",
  "hong kong": "hong-kong",
  "sri lanka": "sri-lanka",
  "south africa": "south-africa",
};

type AiraloPkg = {
  slug: string;
  price: number;
  title: string;
  data?: string;
  amount?: number;
  day?: number;
  is_unlimited?: boolean;
  is_stock?: boolean;
  operator?: { title?: string; networks?: { network?: string; service_type?: string }[] };
};

type AiraloCountry = {
  slug: string;
  title: string;
  apple_locale_region_code?: string;
  packages?: AiraloPkg[];
};

function slugify(s: string) {
  const raw = s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
  if (SLUG_ALIAS[raw]) return SLUG_ALIAS[raw];
  return raw.replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function tpUrl(target: string) {
  return tpTrack("airalo", target);
}

async function usdToCad() {
  try {
    const res = await fetch("https://api.frankfurter.app/latest?from=USD&to=CAD", { next: { revalidate: 86400 } });
    if (!res.ok) return 1.37;
    const json = (await res.json()) as { rates?: { CAD?: number } };
    return json.rates?.CAD || 1.37;
  } catch {
    return 1.37;
  }
}

async function fetchAiralo(slug: string): Promise<AiraloCountry | null> {
  const res = await fetch(`https://www.airalo.com/api/v2/countries/${encodeURIComponent(slug)}`, {
    headers: {
      Accept: "application/json",
      Cookie: "Airalo.currency=CAD; Airalo.locale=en",
    },
    next: { revalidate: 1800 },
  });
  if (!res.ok) return null;
  const json = (await res.json()) as AiraloCountry;
  if (!json?.packages?.length) return null;
  return json;
}

function gbOf(pkg: AiraloPkg) {
  if (pkg.is_unlimited) return 99;
  if (pkg.amount && pkg.amount > 0) return Math.round((pkg.amount / 1024) * 10) / 10;
  const m = String(pkg.data || "").match(/([\d.]+)/);
  return m ? Number(m[1]) : 0;
}

function parseDataPlan(raw?: string): number | "unlimited" | "any" {
  if (!raw || raw === "any") return "any";
  if (raw === "unlimited") return "unlimited";
  const n = Number(raw);
  return Number.isFinite(n) && n > 0 ? n : "any";
}

export async function searchEsim(q: SearchQuery): Promise<LiveOffer[]> {
  const dest = q.to ? getDestination(q.to) : undefined;
  const label = dest?.country || q.toCity || q.to || "";
  if (!label) return [];
  const slugs = Array.from(
    new Set([slugify(dest?.country || ""), slugify(dest?.city || ""), slugify(q.toCity || ""), slugify(q.to || "")].filter(Boolean))
  );
  let country: AiraloCountry | null = null;
  for (const slug of slugs) {
    try {
      country = await fetchAiralo(slug);
      if (country) break;
    } catch {
      /* try next */
    }
  }
  if (!country) return [];

  const fx = await usdToCad();
  const tripDays = Math.max(1, nightsBetween(q.depart, q.returnDate) || 7);
  const want = parseDataPlan(q.dataPlan);
  const sims = Math.max(1, q.adults || 1);

  const rows: LiveOffer[] = [];
  for (const pkg of country.packages || []) {
    if (pkg.is_stock === false) continue;
    const usd = Number(pkg.price);
    if (!usd || usd <= 0) continue;
    const days = Number(pkg.day) || 1;
    const unlimited = Boolean(pkg.is_unlimited);
    const gb = gbOf(pkg);
    if (want === "unlimited" && !unlimited) continue;
    if (typeof want === "number" && !unlimited && gb + 0.01 < want) continue;
    const cadEach = Math.max(1, Math.round(usd * fx));
    const priceCad = cadEach * sims;
    const networks = (pkg.operator?.networks || []).map((n) => [n.network, n.service_type].filter(Boolean).join(" ")).filter(Boolean);
    const href = `https://www.airalo.com/${country.slug}-esim/${pkg.slug}`;
    rows.push({
      id: `esim-airalo-${pkg.slug}`,
      source: "travelpayouts",
      kind: "esim",
      title: pkg.operator?.title || "Airalo",
      partner: "Airalo",
      partnerKey: "airalo",
      domain: "airalo.com",
      color: "#1A73E8",
      airlineName: pkg.operator?.title || "Airalo",
      priceCad,
      priceUnit: "plan",
      adults: sims,
      dataGb: unlimited ? undefined : gb,
      unlimited,
      validityDays: days,
      operator: pkg.operator?.title,
      network: networks[0],
      highlights: [
        unlimited ? "Unlimited data" : `${gb} GB`,
        `${days} days`,
        networks[0] || "Local network",
      ].filter(Boolean),
      highlightsFr: [
        unlimited ? "Données illimitées" : `${gb} Go`,
        `${days} jours`,
        networks[0] || "Réseau local",
      ].filter(Boolean),
      tagline: pkg.title,
      taglineFr: pkg.title,
      url: tpUrl(href),
      durationMin: unlimited ? 1 : Math.max(2, 120 - gb * 4),
      live: true,
    });
  }

  const covering = rows.filter((o) => (o.validityDays || 0) >= tripDays);
  const pool = covering.length ? covering : rows;
  pool.sort((a, b) => (a.priceCad || 0) - (b.priceCad || 0) || (b.dataGb || 0) - (a.dataGb || 0));
  const priced = pool.slice(0, 36);
  const slug = country.slug;
  const extras: LiveOffer[] = [
    {
      id: "esim-yesim",
      source: "travelpayouts",
      kind: "esim",
      title: "Yesim",
      partner: "Yesim",
      domain: "yesim.tech",
      tagline: "More eSIM plans on Yesim",
      taglineFr: "D’autres forfaits eSIM sur Yesim",
      url: tpTrack("yesim", `https://yesim.app/country/${slug}/`),
      live: true,
    },
    {
      id: "esim-saily",
      source: "travelpayouts",
      kind: "esim",
      title: "Saily",
      partner: "Saily",
      domain: "saily.com",
      tagline: "NordVPN’s eSIM brand",
      taglineFr: "La marque eSIM de NordVPN",
      url: tpTrack("saily", `https://saily.com/destinations/${slug}`),
      live: true,
    },
    {
      id: "esim-drimsim",
      source: "travelpayouts",
      kind: "esim",
      title: "Drimsim",
      partner: "Drimsim",
      domain: "drimsim.com",
      tagline: "Compare on Drimsim",
      taglineFr: "Comparer sur Drimsim",
      url: tpTrack("drimsim", "https://w1.drimsim.com"),
      live: true,
    },
  ];
  return [...priced, ...extras];
}
