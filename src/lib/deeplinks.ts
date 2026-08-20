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

export function buildPartnerOffers(q: SearchQuery): PartnerOffer[] {
  const adults = q.adults ?? 1;
  const children = q.children ?? 0;
  const childAges = (q.childAges && q.childAges.length ? q.childAges : Array.from({ length: children }, () => 8)).slice(
    0,
    children
  );
  const rooms = q.rooms ?? 1;
  const depart = q.depart || defaultDepart();
  const ret = q.returnDate || defaultReturn();
  const from = (q.from || "YYZ").toUpperCase();
  const to = (q.to || "LHR").toUpperCase();
  const city = encodeURIComponent(q.toCity || to);

  if (q.kind === "flights") {
    const people = kayakPeople(adults, childAges);
    const kayak =
      q.trip === "oneway"
        ? `https://www.kayak.ca/flights/${from}-${to}/${depart}/${people}`
        : `https://www.kayak.ca/flights/${from}-${to}/${depart}/${ret}/${people}`;
    const sky =
      q.trip === "oneway"
        ? `https://www.skyscanner.ca/transport/flights/${from.toLowerCase()}/${to.toLowerCase()}/${yymmdd(depart)}/`
        : `https://www.skyscanner.ca/transport/flights/${from.toLowerCase()}/${to.toLowerCase()}/${yymmdd(depart)}/${yymmdd(ret)}/`;
    const expedia =
      q.trip === "oneway"
        ? `https://www.expedia.ca/Flights-Search?trip=oneway&leg1=from:${from},to:${to},departure:${mdY(depart)}TANYT&passengers=adults:${adults},children:${children}${expediaAges(childAges)}&mode=search`
        : `https://www.expedia.ca/Flights-Search?trip=roundtrip&leg1=from:${from},to:${to},departure:${mdY(depart)}TANYT&leg2=from:${to},to:${from},departure:${mdY(ret)}TANYT&passengers=adults:${adults},children:${children}${expediaAges(childAges)}&mode=search`;
    const google = `https://www.google.com/travel/flights?hl=en-CA&curr=CAD&q=Flights%20to%20${to}%20from%20${from}%20on%20${depart}${q.trip === "oneway" ? "" : `%20through%20${ret}`}`;
    const ac = `https://www.aircanada.com/ca/en/aco/home.html#/aco/flights?org0=${from}&dest0=${to}&departureDate0=${depart}${q.trip === "oneway" ? "" : `&org1=${to}&dest1=${from}&departureDate1=${ret}`}&adt=${adults}`;
    const wj = `https://www.westjet.com/en-ca`;

    return [
      offer("kayak", "Kayak", "Compare 100+ sites", "Comparez plus de 100 sites", kayak),
      offer("skyscanner", "Skyscanner", "Everywhere, every airline", "Partout, toutes compagnies", sky),
      offer("expedia", "Expedia", "Flights from Canada", "Vols au départ du Canada", expedia),
      offer("google", "Google Flights", "Calendar view in CAD", "Calendrier en $ CA", google),
      offer("aircanada", "Air Canada", "Aeroplan eligible", "Admissible Aéroplan", ac),
      offer("westjet", "WestJet", "WestJet Rewards", "Récompenses WestJet", wj),
    ];
  }

  if (q.kind === "stays") {
    const bookingAges = childAges.map((age) => `&age=${age}`).join("");
    const booking = `https://www.booking.com/searchresults.html?ss=${city}&checkin=${depart}&checkout=${ret}&group_adults=${adults}&group_children=${children}${bookingAges}&no_rooms=${rooms}&selected_currency=CAD`;
    const expedia = `https://www.expedia.ca/Hotel-Search?destination=${city}&startDate=${depart}&endDate=${ret}&rooms=${rooms}&adults=${adults}`;
    const hotels = `https://www.hotels.com/Hotel-Search?destination=${city}&startDate=${depart}&endDate=${ret}&d1=${depart}&d2=${ret}&adults=${adults}`;
    const airbnb = `https://www.airbnb.ca/s/${city}/homes?checkin=${depart}&checkout=${ret}&adults=${adults}&children=${children}`;
    const kayak = `https://www.kayak.ca/hotels/${city}/${depart}/${ret}/${adults}adults`;
    return [
      offer("booking", "Booking.com", "Free cancellation options", "Options d'annulation gratuite", booking),
      offer("expedia", "Expedia", "Member prices in CAD", "Prix membres en $ CA", expedia),
      offer("hotels", "Hotels.com", "Collect 10-night rewards", "Récompenses 10 nuits", hotels),
      offer("airbnb", "Airbnb", "Homes & unique stays", "Logements et séjours uniques", airbnb),
      offer("kayak", "Kayak", "Compare hotel sites", "Comparez les sites d'hôtels", kayak),
    ];
  }

  if (q.kind === "cars") {
    const pickup = q.toCity || to;
    const kayak = `https://www.kayak.ca/cars/${to}-${encodeURIComponent(pickup)}/${depart}/${ret}`;
    const rental = `https://www.rentalcars.com/SearchResults#dropLocation=${encodeURIComponent(pickup)}&pickupLocation=${encodeURIComponent(pickup)}&pickupDate=${depart}&dropDate=${ret}`;
    const expedia = `https://www.expedia.ca/carsearch?locn=${encodeURIComponent(pickup)}&date1=${depart}&date2=${ret}`;
    const discover = `https://www.discovercars.com/en-ca/search?pickup=${encodeURIComponent(pickup)}&from=${depart}&to=${ret}`;
    return [
      offer("kayak", "Kayak", "Compare rental brands", "Comparez les enseignes", kayak),
      offer("rentalcars", "Rentalcars.com", "Pay now or later", "Payez maintenant ou plus tard", rental),
      offer("expedia", "Expedia", "Add to a trip", "Ajoutez à un voyage", expedia),
      offer("discover", "Discover Cars", "Full-to-full options", "Plein à plein", discover),
    ];
  }

  const expediaPkg = `https://www.expedia.ca/PackageSearch?packageType=fh&origin=${from}&destination=${city}&fromDate=${depart}&toDate=${ret}&adults=${adults}`;
  const kayakPkg = `https://www.kayak.ca/horizon/sem/flights/packages/${from}-${to}/${depart}/${ret}`;
  const sunwing = `https://www.sunwing.ca/en/`;
  const airtransat = `https://www.airtransat.com/en-CA`;
  return [
    offer("expedia", "Expedia", "Flight + hotel together", "Vol + hôtel ensemble", expediaPkg),
    offer("kayak", "Kayak", "Package comparison", "Comparaison de forfaits", kayakPkg),
    offer("sunwing", "Sunwing", "Canadian vacation packages", "Forfaits vacances canadiens", sunwing),
    offer("airtransat", "Air Transat", "Transat packages", "Forfaits Transat", airtransat),
  ];
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
