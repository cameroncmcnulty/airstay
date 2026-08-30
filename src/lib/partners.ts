import type { SearchQuery } from "@/lib/deeplinks";
import { cityCode } from "@/lib/iata-cities";
import { getAirport, getDestination } from "@/lib/airports";

export type PartnerKey =
  | "aviasales"
  | "kayak"
  | "skyscanner"
  | "expedia"
  | "google"
  | "booking"
  | "hotels"
  | "agoda"
  | "discover"
  | "rentalcars"
  | "airalo";

export type PartnerMeta = {
  key: PartnerKey;
  name: string;
  domain: string;
  color: string;
  tagline: string;
  taglineFr: string;
  highlights: string[];
  highlightsFr: string[];
};

export const PARTNER_META: Record<PartnerKey, PartnerMeta> = {
  aviasales: {
    key: "aviasales",
    name: "Aviasales",
    domain: "aviasales.com",
    color: "#E6533C",
    tagline: "Live fares with your dates already applied",
    taglineFr: "Tarifs en direct, dates déjà appliquées",
    highlights: ["CAD prices", "Airline checkout"],
    highlightsFr: ["Prix en $ CA", "Paiement chez la compagnie"],
  },
  kayak: {
    key: "kayak",
    name: "Kayak",
    domain: "kayak.com",
    color: "#FF690F",
    tagline: "Compare dozens of sites in one search",
    taglineFr: "Comparez des dizaines de sites en une recherche",
    highlights: ["Canada site", "Your dates filled"],
    highlightsFr: ["Site Canada", "Dates remplies"],
  },
  skyscanner: {
    key: "skyscanner",
    name: "Skyscanner",
    domain: "skyscanner.ca",
    color: "#0770E3",
    tagline: "Canadian search with CAD results",
    taglineFr: "Recherche canadienne, résultats en $ CA",
    highlights: ["CAD", "IATA airport pickup"],
    highlightsFr: ["$ CA", "Prise en charge IATA"],
  },
  expedia: {
    key: "expedia",
    name: "Expedia",
    domain: "expedia.ca",
    color: "#FBC408",
    tagline: "Packages, cars and hotels on Expedia.ca",
    taglineFr: "Forfaits, autos et hôtels sur Expedia.ca",
    highlights: ["Expedia.ca", "Airport pickup"],
    highlightsFr: ["Expedia.ca", "Prise en charge aéroport"],
  },
  google: {
    key: "google",
    name: "Google Flights",
    domain: "google.com",
    color: "#4285F4",
    tagline: "Calendar view of fares in CAD",
    taglineFr: "Calendrier des tarifs en $ CA",
    highlights: ["CAD", "Flexible dates"],
    highlightsFr: ["$ CA", "Dates flexibles"],
  },
  booking: {
    key: "booking",
    name: "Booking.com",
    domain: "booking.com",
    color: "#003580",
    tagline: "Hotels and homes with free-cancellation filters",
    taglineFr: "Hôtels et logements, filtres d’annulation gratuite",
    highlights: ["CAD", "Guest details applied"],
    highlightsFr: ["$ CA", "Voyageurs appliqués"],
  },
  hotels: {
    key: "hotels",
    name: "Hotels.com",
    domain: "hotels.com",
    color: "#D32F2F",
    tagline: "Rewards nights on qualifying stays",
    taglineFr: "Nuits récompenses sur les séjours admissibles",
    highlights: ["CAD", "Your stay dates"],
    highlightsFr: ["$ CA", "Vos dates de séjour"],
  },
  agoda: {
    key: "agoda",
    name: "Agoda",
    domain: "agoda.com",
    color: "#5C2D91",
    tagline: "Strong on Asia and beach resorts",
    taglineFr: "Fort en Asie et stations balnéaires",
    highlights: ["CAD", "Your dates"],
    highlightsFr: ["$ CA", "Vos dates"],
  },
  discover: {
    key: "discover",
    name: "Discover Cars",
    domain: "discovercars.com",
    color: "#00A3E0",
    tagline: "Airport counters and full-coverage options",
    taglineFr: "Comptoirs d’aéroport et options de couverture",
    highlights: ["Airport pickup 10:00", "Age 30 default"],
    highlightsFr: ["Aéroport 10 h", "Âge 30 par défaut"],
  },
  rentalcars: {
    key: "rentalcars",
    name: "Rentalcars.com",
    domain: "rentalcars.com",
    color: "#7B1FA2",
    tagline: "Major brands at the airport",
    taglineFr: "Grandes enseignes à l’aéroport",
    highlights: ["Airport IATA", "Driver age 30"],
    highlightsFr: ["IATA aéroport", "Âge 30"],
  },
  airalo: {
    key: "airalo",
    name: "Airalo",
    domain: "airalo.com",
    color: "#1A73E8",
    tagline: "eSIM plans with local networks",
    taglineFr: "Forfaits eSIM sur réseaux locaux",
    highlights: ["Install before you fly", "CAD on Airalo"],
    highlightsFr: ["Installer avant le vol", "$ CA sur Airalo"],
  },
};

const MARKER = process.env.TRAVELPAYOUTS_MARKER || "564250";

function fold(s: string) {
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function parts(iso?: string) {
  const [y, m, d] = (iso || "").split("-");
  return { y, m, d, yymmdd: y && m && d ? `${y.slice(2)}${m}${d}` : "" };
}

function aviaStamp(iso?: string) {
  if (!iso) return "";
  const [, m, d] = iso.split("-");
  return `${d}${m}`;
}

function tripClass(cabin?: SearchQuery["cabin"]) {
  if (cabin === "business") return "C";
  if (cabin === "first") return "F";
  if (cabin === "premium") return "W";
  return "Y";
}

function aviaClass(cabin?: SearchQuery["cabin"]) {
  if (cabin === "business") return "1";
  if (cabin === "first") return "2";
  return "0";
}

export function nightsBetween(a?: string, b?: string) {
  if (!a || !b) return 1;
  const ms = Date.parse(`${b}T12:00:00`) - Date.parse(`${a}T12:00:00`);
  if (!Number.isFinite(ms) || ms <= 0) return 1;
  return Math.max(1, Math.round(ms / 86400000));
}

export function iataOf(q: SearchQuery, side: "from" | "to") {
  if (side === "from") return (q.from || "").toUpperCase();
  return (q.to || "").toUpperCase();
}

export function cityLabel(q: SearchQuery, locale: "en" | "fr" = "en") {
  const dest = getDestination(q.to || "");
  if (dest) return locale === "fr" ? dest.cityFr : dest.city;
  if (q.toCity) return q.toCity;
  const origin = getAirport(q.from || "");
  if (origin && !q.to) return locale === "fr" ? origin.cityFr : origin.city;
  return q.to || "";
}

export function countryLabel(q: SearchQuery, locale: "en" | "fr" = "en") {
  const dest = getDestination(q.to || "");
  if (dest) return locale === "fr" ? dest.countryFr : dest.country;
  return "";
}

function kayakPlace(code: string, city: string, country: string) {
  if (code && code.length === 3) return `${code}-a1200`;
  const bits = [city, country].filter(Boolean).map(fold);
  return bits.join(",") || undefined;
}

function kayakHotelPlace(city: string, country: string) {
  const c = fold(city || "Cancun");
  const n = fold(country || "");
  return n ? `${c},${n}` : c;
}

const DISCOVER_PATH: Record<string, string> = {
  CUN: "mexico/cancun-airport",
  PVR: "mexico/puerto-vallarta-airport",
  SJD: "mexico/los-cabos-san-jose-del-cabo-airport",
  MEX: "mexico/mexico-city-airport",
  GDL: "mexico/guadalajara-airport",
  CZM: "mexico/cozumel-airport",
  HUX: "mexico/huatulco-airport",
  MID: "mexico/merida-airport",
  PUJ: "dominican-republic/punta-cana-airport",
  SDQ: "dominican-republic/santo-domingo-airport",
  POP: "dominican-republic/puerto-plata-airport",
  MBJ: "jamaica/montego-bay-airport",
  KIN: "jamaica/kingston-airport",
  NAS: "bahamas/nassau-airport",
  HAV: "cuba/havana-airport",
  VRA: "cuba/varadero-airport",
  CCC: "cuba/cayo-coco-airport",
  AUA: "aruba/oranjestad-airport",
  CUR: "curacao/willemstad-airport",
  SJU: "puerto-rico/san-juan-airport",
  BGI: "barbados/bridgetown-airport",
  GCM: "cayman-islands/grand-cayman-airport",
  PLS: "turks-and-caicos/providenciales-airport",
  SXM: "sint-maarten/princess-juliana-airport",
  LIR: "costa-rica/liberia-airport",
  SJO: "costa-rica/san-jose-airport",
  LHR: "united-kingdom/london-heathrow-airport",
  LGW: "united-kingdom/london-gatwick-airport",
  STN: "united-kingdom/london-stansted-airport",
  MAN: "united-kingdom/manchester-airport",
  EDI: "united-kingdom/edinburgh-airport",
  DUB: "ireland/dublin-airport",
  CDG: "france/paris-charles-de-gaulle-airport",
  ORY: "france/paris-orly-airport",
  NCE: "france/nice-airport",
  FCO: "italy/rome-fiumicino-airport",
  MXP: "italy/milan-malpensa-airport",
  VCE: "italy/venice-airport",
  BCN: "spain/barcelona-airport",
  MAD: "spain/madrid-barajas-airport",
  AGP: "spain/malaga-airport",
  PMI: "spain/palma-de-mallorca-airport",
  LIS: "portugal/lisbon-airport",
  OPO: "portugal/porto-airport",
  AMS: "netherlands/amsterdam-schiphol-airport",
  FRA: "germany/frankfurt-airport",
  MUC: "germany/munich-airport",
  BER: "germany/berlin-brandenburg-airport",
  ZRH: "switzerland/zurich-airport",
  GVA: "switzerland/geneva-airport",
  VIE: "austria/vienna-airport",
  CPH: "denmark/copenhagen-airport",
  ARN: "sweden/stockholm-arlanda-airport",
  OSL: "norway/oslo-airport",
  HEL: "finland/helsinki-airport",
  ATH: "greece/athens-airport",
  IST: "turkey/istanbul-airport",
  KEF: "iceland/reykjavik-keflavik-airport",
  WAW: "poland/warsaw-airport",
  PRG: "czechia/prague-airport",
  BUD: "hungary/budapest-airport",
  MCO: "usa-florida/orlando-international-airport",
  MIA: "usa-florida/miami-airport",
  FLL: "usa-florida/fort-lauderdale-airport",
  TPA: "usa-florida/tampa-airport",
  RSW: "usa-florida/fort-myers-airport",
  LAX: "usa-california/los-angeles-airport",
  SFO: "usa-california/san-francisco-airport",
  SAN: "usa-california/san-diego-airport",
  LAS: "usa-nevada/las-vegas-airport",
  JFK: "usa-new-york/new-york-jfk-airport",
  EWR: "usa-new-jersey/newark-airport",
  LGA: "usa-new-york/new-york-laguardia-airport",
  ORD: "usa-illinois/chicago-ohare-airport",
  PHX: "usa-arizona/phoenix-airport",
  HNL: "usa-hawaii/honolulu-airport",
  OGG: "usa-hawaii/kahului-maui-airport",
  SEA: "usa-washington/seattle-airport",
  BOS: "usa-massachusetts/boston-logan-airport",
  ATL: "usa-georgia/atlanta-airport",
  DFW: "usa-texas/dallas-fort-worth-airport",
  IAH: "usa-texas/houston-intercontinental-airport",
  DEN: "usa-colorado/denver-airport",
  YYZ: "canada/toronto-pearson-airport",
  YVR: "canada/vancouver-airport",
  YUL: "canada/montreal-trudeau-airport",
  YYC: "canada/calgary-airport",
  YEG: "canada/edmonton-airport",
  YOW: "canada/ottawa-airport",
  YHZ: "canada/halifax-airport",
  NRT: "japan/tokyo-narita-airport",
  HND: "japan/tokyo-haneda-airport",
  ICN: "south-korea/seoul-incheon-airport",
  BKK: "thailand/bangkok-suvarnabhumi-airport",
  HKT: "thailand/phuket-airport",
  MNL: "philippines/manila-airport",
  SIN: "singapore/singapore-changi-airport",
  HKG: "hong-kong/hong-kong-airport",
  DXB: "united-arab-emirates/dubai-airport",
  AUH: "united-arab-emirates/abu-dhabi-airport",
  DOH: "qatar/doha-hamad-airport",
  DEL: "india/delhi-airport",
  BOM: "india/mumbai-airport",
  SYD: "australia/sydney-airport",
  MEL: "australia/melbourne-airport",
  AKL: "new-zealand/auckland-airport",
  CPT: "south-africa/cape-town-airport",
  JNB: "south-africa/johannesburg-airport",
  GIG: "brazil/rio-de-janeiro-galeao-airport",
  GRU: "brazil/sao-paulo-guarulhos-airport",
  EZE: "argentina/buenos-aires-ezeiza-airport",
  LIM: "peru/lima-airport",
  BOG: "colombia/bogota-airport",
};

function discoverPath(code: string) {
  return DISCOVER_PATH[code];
}

function dmY(iso?: string) {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

export function aviasalesUrl(q: SearchQuery) {
  const origin = cityCode(q.from) || q.from;
  const dest = cityCode(q.to) || q.to;
  if (!origin || !dest || !q.depart) return undefined;
  const adults = Math.max(1, q.adults || 1);
  const children = q.children || 0;
  const path =
    q.trip === "oneway" || !q.returnDate
      ? `${origin}${aviaStamp(q.depart)}${dest}${adults}`
      : `${origin}${aviaStamp(q.depart)}${dest}${aviaStamp(q.returnDate)}${adults}`;
  const params = new URLSearchParams({
    marker: MARKER,
    currency: "cad",
    locale: "en",
    adults: String(adults),
    children: String(children),
    infants: "0",
    trip_class: aviaClass(q.cabin),
    utm_source: "airstay",
  });
  return `https://www.aviasales.com/search/${path}?${params.toString()}`;
}

export function kayakFlightsUrl(q: SearchQuery) {
  const origin = iataOf(q, "from");
  const dest = iataOf(q, "to");
  if (!origin || !dest || !q.depart) return undefined;
  const cabin = tripClass(q.cabin);
  const adults = Math.max(1, q.adults || 1);
  const children = q.children || 0;
  const path =
    q.trip === "oneway" || !q.returnDate
      ? `${origin}-${dest}/${q.depart}`
      : `${origin}-${dest}/${q.depart}/${q.returnDate}`;
  const params = new URLSearchParams({
    sort: "bestflight_a",
    fs: "cfc=1",
    adults: String(adults),
  });
  if (children) params.set("children", String(children));
  if (cabin !== "Y") params.set("cabin", cabin);
  return `https://www.ca.kayak.com/flights/${path}?${params.toString()}`;
}

export function skyscannerFlightsUrl(q: SearchQuery) {
  const origin = (iataOf(q, "from") || "").toLowerCase();
  const dest = (iataOf(q, "to") || "").toLowerCase();
  if (!origin || !dest || !q.depart) return undefined;
  const out = parts(q.depart).yymmdd;
  const back = q.trip === "oneway" || !q.returnDate ? "" : parts(q.returnDate).yymmdd;
  const cabin =
    q.cabin === "business" ? "business" : q.cabin === "first" ? "first" : q.cabin === "premium" ? "premiumeconomy" : "economy";
  const adults = Math.max(1, q.adults || 1);
  const base = back
    ? `https://www.skyscanner.ca/transport/flights/${origin}/${dest}/${out}/${back}/`
    : `https://www.skyscanner.ca/transport/flights/${origin}/${dest}/${out}/`;
  const params = new URLSearchParams({
    adultsv2: String(adults),
    cabinclass: cabin,
    rtn: back ? "1" : "0",
    preferdirects: "false",
    outboundaltsenabled: "false",
    inboundaltsenabled: "false",
    ref: "airstay",
  });
  const ages = (q.childAges || []).filter((n) => n >= 2).join("|");
  if (ages) params.set("childrenv2", ages);
  else if (q.children) params.set("childrenv2", Array.from({ length: q.children }, () => "8").join("|"));
  return `${base}?${params.toString()}`;
}

export function googleFlightsUrl(q: SearchQuery) {
  const origin = getAirport(q.from || "");
  const dest = getDestination(q.to || "");
  const fromName = origin?.city || q.from || "";
  const toName = dest?.city || q.toCity || q.to || "";
  if (!fromName || !toName || !q.depart) return undefined;
  const bits = [`Flights from ${fromName} to ${toName} on ${q.depart}`];
  if (q.returnDate && q.trip !== "oneway") bits.push(`through ${q.returnDate}`);
  const params = new URLSearchParams({
    hl: "en-CA",
    curr: "CAD",
    q: bits.join(" "),
  });
  return `https://www.google.ca/travel/flights?${params.toString()}`;
}

export function expediaFlightsUrl(q: SearchQuery) {
  const origin = iataOf(q, "from");
  const dest = iataOf(q, "to");
  if (!origin || !dest || !q.depart) return undefined;
  const params = new URLSearchParams({
    trip: q.trip === "oneway" || !q.returnDate ? "oneway" : "roundtrip",
    leg1: `from:${origin},to:${dest},departure:${q.depart}TANYT`,
    passengers: `adults:${Math.max(1, q.adults || 1)},children:${q.children || 0},infantinlap:N`,
    mode: "search",
    options: "0",
  });
  if (q.returnDate && q.trip !== "oneway") {
    params.set("leg2", `from:${dest},to:${origin},departure:${q.returnDate}TANYT`);
  }
  return `https://www.expedia.ca/Flights-Search?${params.toString()}`;
}

export function bookingHotelsUrl(q: SearchQuery) {
  const dest = getDestination(q.to || "");
  const ss = dest ? `${dest.city}, ${dest.country}` : q.toCity || q.to || "";
  const adults = String(Math.max(1, q.adults || 2));
  const children = q.children || 0;
  const rooms = String(q.rooms || 1);
  const params = new URLSearchParams({
    ss,
    ssne: dest?.city || ss,
    ssne_untouched: dest?.city || ss,
    checkin: q.depart || "",
    checkout: q.returnDate || "",
    group_adults: adults,
    group_children: String(children),
    no_rooms: rooms,
    selected_currency: "CAD",
    lang: "en-ca",
    dest_type: "city",
    nflt: "",
  });
  (q.childAges || []).forEach((age) => params.append("age", String(age)));
  return `https://www.booking.com/searchresults.html?${params.toString()}`;
}

export function kayakHotelsUrl(q: SearchQuery) {
  const dest = getDestination(q.to || "");
  const place = kayakHotelPlace(dest?.city || q.toCity || q.to || "Cancun", dest?.country || "");
  const adults = Math.max(1, q.adults || 2);
  const rooms = q.rooms || 1;
  const children = q.children || 0;
  let path = `${place}/${q.depart || ""}/${q.returnDate || q.depart || ""}/${adults}adults`;
  if (rooms > 1) path += `/${rooms}rooms`;
  if (children) path += `/${children}children`;
  return `https://www.ca.kayak.com/hotels/${path}`;
}

export function expediaHotelsUrl(q: SearchQuery) {
  const dest = getDestination(q.to || "");
  const destination = dest ? `${dest.city}, ${dest.country}` : q.toCity || q.to || "";
  const params = new URLSearchParams({
    destination,
    startDate: q.depart || "",
    endDate: q.returnDate || "",
    d1: q.depart || "",
    d2: q.returnDate || "",
    adults: String(Math.max(1, q.adults || 2)),
    rooms: String(q.rooms || 1),
  });
  if (q.children) params.set("children", String(q.children));
  return `https://www.expedia.ca/Hotel-Search?${params.toString()}`;
}

export function hotelsComUrl(q: SearchQuery) {
  const dest = getDestination(q.to || "");
  const destination = dest ? `${dest.city}, ${dest.country}` : q.toCity || q.to || "";
  const params = new URLSearchParams({
    destination,
    startDate: q.depart || "",
    endDate: q.returnDate || "",
    d1: q.depart || "",
    d2: q.returnDate || "",
    adults: String(Math.max(1, q.adults || 2)),
    rooms: String(q.rooms || 1),
    sort: "RECOMMENDED",
    locale: "en_CA",
    pos: "HCOM_CA",
  });
  return `https://ca.hotels.com/Hotel-Search?${params.toString()}`;
}

export function agodaUrl(q: SearchQuery) {
  const dest = getDestination(q.to || "");
  const text = dest ? `${dest.city}, ${dest.country}` : q.toCity || q.to || "";
  const los = nightsBetween(q.depart, q.returnDate);
  const params = new URLSearchParams({
    textToSearch: text,
    checkIn: q.depart || "",
    checkOut: q.returnDate || "",
    los: String(los),
    rooms: String(q.rooms || 1),
    adults: String(Math.max(1, q.adults || 2)),
    children: String(q.children || 0),
    currency: "CAD",
    locale: "en-ca",
    origin: "CA",
  });
  return `https://www.agoda.com/search?${params.toString()}`;
}

export function kayakCarsUrl(q: SearchQuery) {
  const code = iataOf(q, "to");
  const dest = getDestination(code);
  const place = kayakPlace(code, dest?.city || q.toCity || "", dest?.country || "");
  const pickup = q.depart || "";
  const drop = q.returnDate || q.depart || "";
  if (!place || !pickup) return undefined;
  return `https://www.ca.kayak.com/cars/${place}/${pickup}/${drop}`;
}

export function skyscannerCarsUrl(q: SearchQuery) {
  const code = iataOf(q, "to");
  if (!code || !q.depart) return undefined;
  const pickupTime = `${q.depart}T10:00`;
  const dropoffTime = `${q.returnDate || q.depart}T10:00`;
  const params = new URLSearchParams({
    pickupPlace: code,
    dropoffPlace: code,
    pickupTime,
    dropoffTime,
    driverAge: "30",
    market: "CA",
    locale: "en-CA",
    currency: "CAD",
  });
  return `https://www.skyscanner.ca/g/referrals/v1/cars/day-view?${params.toString()}`;
}

export const EXPEDIA_CAMREF = "1110lLNKz";

export function expediaPackagesUrl() {
  return `https://www.expedia.ca/Vacation-Packages?camref=${EXPEDIA_CAMREF}`;
}

export function expediaCarsUrl(q: SearchQuery) {
  const code = iataOf(q, "to");
  if (!code || !q.depart) return undefined;
  const drop = q.returnDate || q.depart;
  const params = new URLSearchParams({
    PickUpLoc: code,
    DropOffLoc: code,
    DiffDropLoc: "0",
    PickUpTime: "10AM",
    DropTime: "10AM",
    Class: "NoPreference",
  });
  return `https://www.expedia.ca/go/car/search/Airport/${q.depart}/${drop}?${params.toString()}`;
}

export function discoverCarsUrl(q: SearchQuery) {
  const code = iataOf(q, "to");
  const dest = getDestination(code);
  const pickup = q.depart || "";
  const drop = q.returnDate || q.depart || "";
  const path = discoverPath(code);
  if (path && pickup) {
    const params = new URLSearchParams({
      pickupDate: dmY(pickup),
      dropoffDate: dmY(drop),
      pickupTime: "10:00",
      dropoffTime: "10:00",
    });
    return `https://www.discovercars.com/${path}?${params.toString()}`;
  }
  const params = new URLSearchParams({
    pickupLocation: dest ? `${dest.city} Airport (${code})` : code || q.toCity || "",
    dropoffLocation: dest ? `${dest.city} Airport (${code})` : code || q.toCity || "",
    pickupDate: pickup,
    dropoffDate: drop,
    pickupTime: "10:00",
    dropoffTime: "10:00",
  });
  return `https://www.discovercars.com/?${params.toString()}`;
}

export function rentalcarsUrl(q: SearchQuery) {
  const code = iataOf(q, "to");
  const dest = getDestination(code);
  const pickup = parts(q.depart);
  const drop = parts(q.returnDate || q.depart);
  const locationName = dest ? `${dest.city} Airport (${code})` : code ? `${code} Airport` : q.toCity || "";
  const params = new URLSearchParams({
    locationName,
    pickupIATACode: code,
    dropoffIATACode: code,
    puYear: pickup.y || "",
    puMonth: pickup.m || "",
    puDay: pickup.d || "",
    puHour: "10",
    puMinute: "00",
    doYear: drop.y || "",
    doMonth: drop.m || "",
    doDay: drop.d || "",
    doHour: "10",
    doMinute: "00",
    driversAge: "30",
    filterTo: "1",
  });
  return `https://www.rentalcars.com/en/search-results/?${params.toString()}`;
}

const CARIBBEAN = new Set([
  "CUN", "PUJ", "PVR", "SJD", "MBJ", "VRA", "NAS", "AUA", "CUR", "SJU", "HAV", "CCC", "HOG", "CZM", "HUX", "MID", "GCM", "PLS", "BGI", "KIN", "POP", "SDQ", "LIR", "SJO",
]);
const US_SUN = new Set(["MCO", "MIA", "FLL", "LAS", "LAX", "PHX", "TPA", "RSW", "HNL", "OGG", "SFO", "SAN"]);
const EUROPE = new Set(["LHR", "CDG", "FCO", "BCN", "AMS", "FRA", "DUB", "LIS", "MAD", "MUC", "ZRH", "GVA", "VIE", "CPH", "ATH", "KEF", "EDI", "MAN", "OPO", "PRG", "BUD"]);
const ASIA = new Set(["NRT", "HND", "ICN", "MNL", "DEL", "BKK", "SIN", "HKG", "TPE", "HKT", "BOM", "BLR"]);

export function typicalStayRange(code: string): [number, number] {
  const c = code.toUpperCase();
  if (CARIBBEAN.has(c)) return [165, 390];
  if (US_SUN.has(c)) return [185, 420];
  if (EUROPE.has(c)) return [210, 480];
  if (ASIA.has(c)) return [120, 280];
  return [155, 360];
}

export function typicalCarRange(code: string): [number, number] {
  const c = code.toUpperCase();
  if (CARIBBEAN.has(c)) return [42, 88];
  if (US_SUN.has(c)) return [48, 105];
  if (EUROPE.has(c)) return [52, 118];
  if (ASIA.has(c)) return [38, 82];
  return [45, 95];
}

export function partnerFavicon(domain: string) {
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
}

export function airlineLogo(code?: string) {
  if (!code) return undefined;
  return `https://pics.avs.io/al_square/96/96/${code.toUpperCase()}.png`;
}
