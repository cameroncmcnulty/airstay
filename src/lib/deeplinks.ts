export type SearchKind = "flights" | "stays" | "cars" | "packages";

export type SearchQuery = {
  kind: SearchKind;
  from?: string;
  to?: string;
  toCity?: string;
  depart?: string;
  returnDate?: string;
  adults?: number;
  children?: number;
  childAges?: number[];
  rooms?: number;
  cabin?: "economy" | "premium" | "business" | "first";
  trip?: "roundtrip" | "oneway";
};

export type PartnerOffer = {
  id: string;
  partner: string;
  tagline: string;
  taglineFr: string;
  priceCad?: number;
  url: string;
  sponsored: true;
};

const UTM = "utm_source=airstay&utm_medium=deeplink&utm_campaign=canada-outbound";

function yymmdd(iso: string) {
  const [y, m, d] = iso.split("-");
  return `${y.slice(2)}${m}${d}`;
}

function mdY(iso: string) {
  const [y, m, d] = iso.split("-");
  return `${Number(m)}/${Number(d)}/${y}`;
}

function addParams(url: string) {
  return url.includes("?") ? `${url}&${UTM}` : `${url}?${UTM}`;
}

function kayakPeople(adults: number, ages: number[]) {
  const adultPart = `${adults}adults`;
  if (!ages.length) return adultPart;
  if (ages.length === 1) return `${adultPart}/1child-${ages[0]}`;
  return `${adultPart}/${ages.length}children-${ages.join("-")}`;
}

function expediaAges(ages: number[]) {
  return ages.length ? `,childages:${ages.join(",")}` : "";
}

export function buildPartnerOffers(_q: SearchQuery): PartnerOffer[] {
  return [];
}

function offer(
  id: string,
  partner: string,
  tagline: string,
  taglineFr: string,
  url: string
): PartnerOffer {
  return { id, partner, tagline, taglineFr, url: addParams(url), sponsored: true };
}

export function defaultDepart() {
  const d = new Date();
  d.setDate(d.getDate() + 21);
  return iso(d);
}

export function defaultReturn() {
  const d = new Date();
  d.setDate(d.getDate() + 28);
  return iso(d);
}

function iso(d: Date) {
  return d.toISOString().slice(0, 10);
}

export function cad(n: number) {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    maximumFractionDigits: 0,
  }).format(n);
}

export function cadFr(n: number) {
  return new Intl.NumberFormat("fr-CA", {
    style: "currency",
    currency: "CAD",
    maximumFractionDigits: 0,
  }).format(n);
}

export function queryToParams(q: SearchQuery) {
  const p = new URLSearchParams();
  p.set("kind", q.kind);
  if (q.from) p.set("from", q.from);
  if (q.to) p.set("to", q.to);
  if (q.toCity) p.set("toCity", q.toCity);
  if (q.depart) p.set("depart", q.depart);
  if (q.returnDate) p.set("return", q.returnDate);
  if (q.adults) p.set("adults", String(q.adults));
  if (q.children) p.set("children", String(q.children));
  if (q.childAges?.length) p.set("childAges", q.childAges.join(","));
  if (q.rooms) p.set("rooms", String(q.rooms));
  if (q.cabin) p.set("cabin", q.cabin);
  if (q.trip) p.set("trip", q.trip);
  return p.toString();
}

export function paramsToQuery(sp: URLSearchParams): SearchQuery {
  const kind = (sp.get("kind") as SearchKind) || "flights";
  return {
    kind,
    from: sp.get("from") || undefined,
    to: sp.get("to") || undefined,
    toCity: sp.get("toCity") || undefined,
    depart: sp.get("depart") || defaultDepart(),
    returnDate: sp.get("return") || defaultReturn(),
    adults: Number(sp.get("adults") || 1),
    children: Number(sp.get("children") || 0),
    childAges: (sp.get("childAges") || "")
      .split(",")
      .map((n) => Number(n))
      .filter((n) => Number.isFinite(n) && n >= 0 && n <= 17),
    rooms: Number(sp.get("rooms") || 1),
    cabin: (sp.get("cabin") as SearchQuery["cabin"]) || "economy",
    trip: (sp.get("trip") as SearchQuery["trip"]) || "roundtrip",
  };
}
