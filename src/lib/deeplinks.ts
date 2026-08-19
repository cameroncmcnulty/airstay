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
  rooms?: number;
  cabin?: "economy" | "premium" | "business" | "first";
  trip?: "roundtrip" | "oneway";
};

export type PartnerOffer = {
  id: string;
  partner: string;
  tagline: string;
  taglineFr: string;
  priceCad: number;
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

export function buildPartnerOffers(q: SearchQuery): PartnerOffer[] {
  const adults = q.adults ?? 1;
  const children = q.children ?? 0;
  const rooms = q.rooms ?? 1;
  const depart = q.depart || defaultDepart();
  const ret = q.returnDate || defaultReturn();
  const from = (q.from || "YYZ").toUpperCase();
  const to = (q.to || "LHR").toUpperCase();
  const city = encodeURIComponent(q.toCity || to);
  const seed = hash(`${q.kind}-${from}-${to}-${depart}-${ret}-${adults}`);

  if (q.kind === "flights") {
    const base = 420 + (seed % 380);
    const kayak =
      q.trip === "oneway"
        ? `https://www.kayak.ca/flights/${from}-${to}/${depart}`
        : `https://www.kayak.ca/flights/${from}-${to}/${depart}/${ret}`;
    const sky =
      q.trip === "oneway"
        ? `https://www.skyscanner.ca/transport/flights/${from.toLowerCase()}/${to.toLowerCase()}/${yymmdd(depart)}/`
        : `https://www.skyscanner.ca/transport/flights/${from.toLowerCase()}/${to.toLowerCase()}/${yymmdd(depart)}/${yymmdd(ret)}/`;
    const expedia =
      q.trip === "oneway"
        ? `https://www.expedia.ca/Flights-Search?trip=oneway&leg1=from:${from},to:${to},departure:${mdY(depart)}TANYT&passengers=adults:${adults},children:${children}&mode=search`
        : `https://www.expedia.ca/Flights-Search?trip=roundtrip&leg1=from:${from},to:${to},departure:${mdY(depart)}TANYT&leg2=from:${to},to:${from},departure:${mdY(ret)}TANYT&passengers=adults:${adults},children:${children}&mode=search`;
    const google = `https://www.google.com/travel/flights?hl=en-CA&curr=CAD&q=Flights%20to%20${to}%20from%20${from}%20on%20${depart}${q.trip === "oneway" ? "" : `%20through%20${ret}`}`;
    const ac = `https://www.aircanada.com/ca/en/aco/home.html#/aco/flights?org0=${from}&dest0=${to}&departureDate0=${depart}${q.trip === "oneway" ? "" : `&org1=${to}&dest1=${from}&departureDate1=${ret}`}&adt=${adults}`;
    const wj = `https://www.westjet.com/en-ca`;

    return [
      offer("kayak", "Kayak", "Compare 100+ sites", "Comparez plus de 100 sites", Math.round(base * 0.97), kayak),
      offer("skyscanner", "Skyscanner", "Everywhere, every airline", "Partout, toutes compagnies", Math.round(base * 1.02), sky),
      offer("expedia", "Expedia", "Flights from Canada", "Vols au départ du Canada", Math.round(base * 1.08), expedia),
      offer("google", "Google Flights", "Calendar view in CAD", "Calendrier en $ CA", Math.round(base * 0.99), google),
      offer("aircanada", "Air Canada", "Aeroplan eligible", "Admissible Aéroplan", Math.round(base * 1.18), ac),
      offer("westjet", "WestJet", "WestJet Rewards", "Récompenses WestJet", Math.round(base * 1.15), wj),
    ];
  }

  if (q.kind === "stays") {
    const night = 140 + (seed % 220);
    const booking = `https://www.booking.com/searchresults.html?ss=${city}&checkin=${depart}&checkout=${ret}&group_adults=${adults}&no_rooms=${rooms}&selected_currency=CAD`;
    const expedia = `https://www.expedia.ca/Hotel-Search?destination=${city}&startDate=${depart}&endDate=${ret}&rooms=${rooms}&adults=${adults}`;
    const hotels = `https://www.hotels.com/Hotel-Search?destination=${city}&startDate=${depart}&endDate=${ret}&d1=${depart}&d2=${ret}&adults=${adults}`;
    const airbnb = `https://www.airbnb.ca/s/${city}/homes?checkin=${depart}&checkout=${ret}&adults=${adults}`;
    const kayak = `https://www.kayak.ca/hotels/${city}/${depart}/${ret}/${adults}adults`;
    return [
      offer("booking", "Booking.com", "Free cancellation options", "Options d'annulation gratuite", night, booking),
      offer("expedia", "Expedia", "Member prices in CAD", "Prix membres en $ CA", Math.round(night * 1.04), expedia),
      offer("hotels", "Hotels.com", "Collect 10-night rewards", "Récompenses 10 nuits", Math.round(night * 1.06), hotels),
      offer("airbnb", "Airbnb", "Homes & unique stays", "Logements et séjours uniques", Math.round(night * 0.92), airbnb),
      offer("kayak", "Kayak", "Compare hotel sites", "Comparez les sites d'hôtels", Math.round(night * 0.98), kayak),
    ];
  }

  if (q.kind === "cars") {
    const day = 36 + (seed % 42);
    const pickup = q.toCity || to;
    const kayak = `https://www.kayak.ca/cars/${to}-${encodeURIComponent(pickup)}/${depart}/${ret}`;
    const rental = `https://www.rentalcars.com/SearchResults#dropLocation=${encodeURIComponent(pickup)}&pickupLocation=${encodeURIComponent(pickup)}&pickupDate=${depart}&dropDate=${ret}`;
    const expedia = `https://www.expedia.ca/carsearch?locn=${encodeURIComponent(pickup)}&date1=${depart}&date2=${ret}`;
    const discover = `https://www.discovercars.com/en-ca/search?pickup=${encodeURIComponent(pickup)}&from=${depart}&to=${ret}`;
    return [
      offer("kayak", "Kayak", "Compare rental brands", "Comparez les enseignes", day, kayak),
      offer("rentalcars", "Rentalcars.com", "Pay now or later", "Payez maintenant ou plus tard", Math.round(day * 1.05), rental),
      offer("expedia", "Expedia", "Add to a trip", "Ajoutez à un voyage", Math.round(day * 1.1), expedia),
      offer("discover", "Discover Cars", "Full-to-full options", "Plein à plein", Math.round(day * 0.96), discover),
    ];
  }

  const pack = 1180 + (seed % 620);
  const expedia = `https://www.expedia.ca/PackageSearch?packageType=fh&origin=${from}&destination=${city}&fromDate=${depart}&toDate=${ret}&adults=${adults}`;
  const kayak = `https://www.kayak.ca/horizon/sem/flights/packages/${from}-${to}/${depart}/${ret}`;
  const sunwing = `https://www.sunwing.ca/en/`;
  const airtransat = `https://www.airtransat.com/en-CA`;
  return [
    offer("expedia", "Expedia", "Flight + hotel together", "Vol + hôtel ensemble", pack, expedia),
    offer("kayak", "Kayak", "Package comparison", "Comparaison de forfaits", Math.round(pack * 0.97), kayak),
    offer("sunwing", "Sunwing", "Canadian vacation packages", "Forfaits vacances canadiens", Math.round(pack * 1.12), sunwing),
    offer("airtransat", "Air Transat", "Transat packages", "Forfaits Transat", Math.round(pack * 1.08), airtransat),
  ];
}

function offer(
  id: string,
  partner: string,
  tagline: string,
  taglineFr: string,
  priceCad: number,
  url: string
): PartnerOffer {
  return { id, partner, tagline, taglineFr, priceCad, url: addParams(url), sponsored: true };
}

function hash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
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
    rooms: Number(sp.get("rooms") || 1),
    cabin: (sp.get("cabin") as SearchQuery["cabin"]) || "economy",
    trip: (sp.get("trip") as SearchQuery["trip"]) || "roundtrip",
  };
}
