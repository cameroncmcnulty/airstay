import { getAirport, type Airport } from "@/lib/airports";

export type GeoOrigin = {
  code: string;
  city: string;
  cityFr: string;
  name: string;
  nameFr: string;
  source: "ip" | "fallback";
};

type Hub = { code: string; lat: number; lng: number };

/** International leisure terminals Canadians actually leave from. Billy Bishop is skipped. */
export const MAJOR_HUBS: Hub[] = [
  { code: "YYZ", lat: 43.6777, lng: -79.6248 },
  { code: "YVR", lat: 49.1947, lng: -123.1792 },
  { code: "YUL", lat: 45.4706, lng: -73.7408 },
  { code: "YYC", lat: 51.1215, lng: -114.0076 },
  { code: "YEG", lat: 53.3097, lng: -113.58 },
  { code: "YOW", lat: 45.3225, lng: -75.6692 },
  { code: "YHZ", lat: 44.8808, lng: -63.5086 },
  { code: "YWG", lat: 49.91, lng: -97.2399 },
  { code: "YQB", lat: 46.7911, lng: -71.3933 },
  { code: "YYJ", lat: 48.6469, lng: -123.4258 },
  { code: "YYT", lat: 47.6186, lng: -52.7519 },
  { code: "YLW", lat: 49.9561, lng: -119.3778 },
  { code: "YXE", lat: 52.1708, lng: -106.6997 },
  { code: "YQR", lat: 50.4319, lng: -104.665 },
  { code: "YQM", lat: 46.1122, lng: -64.6786 },
  { code: "YYG", lat: 46.29, lng: -63.1211 },
  { code: "YXU", lat: 43.0356, lng: -81.1539 },
  { code: "YXX", lat: 49.0253, lng: -122.3606 },
];

const CITY_HUB: Record<string, string> = {
  toronto: "YYZ",
  mississauga: "YYZ",
  brampton: "YYZ",
  vaughan: "YYZ",
  markham: "YYZ",
  oakville: "YYZ",
  burlington: "YYZ",
  hamilton: "YYZ",
  scarborough: "YYZ",
  etobicoke: "YYZ",
  northyork: "YYZ",
  richmondhill: "YYZ",
  ajax: "YYZ",
  pickering: "YYZ",
  whitby: "YYZ",
  oshawa: "YYZ",
  milton: "YYZ",
  brantford: "YYZ",
  kitchener: "YYZ",
  waterloo: "YYZ",
  cambridge: "YYZ",
  guelph: "YYZ",
  barrie: "YYZ",
  windsor: "YYZ",
  london: "YXU",
  vancouver: "YVR",
  burnaby: "YVR",
  richmond: "YVR",
  surrey: "YVR",
  coquitlam: "YVR",
  delta: "YVR",
  langley: "YVR",
  "newwestminster": "YVR",
  "northvancouver": "YVR",
  "westvancouver": "YVR",
  abbotsford: "YXX",
  chilliwack: "YXX",
  victoria: "YYJ",
  "saanich": "YYJ",
  nanaimo: "YVR",
  kelowna: "YLW",
  vernon: "YLW",
  penticton: "YLW",
  kamloops: "YLW",
  montreal: "YUL",
  montréal: "YUL",
  laval: "YUL",
  longueuil: "YUL",
  brossard: "YUL",
  gatineau: "YOW",
  ottawa: "YOW",
  kanata: "YOW",
  nepean: "YOW",
  orleans: "YOW",
  orléans: "YOW",
  quebec: "YQB",
  québec: "YQB",
  "quebeccity": "YQB",
  levis: "YQB",
  lévis: "YQB",
  calgary: "YYC",
  airdrie: "YYC",
  okotoks: "YYC",
  edmonton: "YEG",
  sherwoodpark: "YEG",
  stalbert: "YEG",
  "st.albert": "YEG",
  halifax: "YHZ",
  dartmouth: "YHZ",
  "bedford": "YHZ",
  winnipeg: "YWG",
  saskatoon: "YXE",
  regina: "YQR",
  moncton: "YQM",
  dieppe: "YQM",
  "saintjohn": "YQM",
  "st.john's": "YYT",
  "stjohns": "YYT",
  charlottetown: "YYG",
  seattle: "YVR",
  bellevue: "YVR",
  tacoma: "YVR",
  buffalo: "YYZ",
  niagara: "YYZ",
  "niagarafalls": "YYZ",
  detroit: "YYZ",
  "spokane": "YVR",
};

const REGION_HUB: Record<string, string> = {
  on: "YYZ",
  ontario: "YYZ",
  qc: "YUL",
  quebec: "YUL",
  québec: "YUL",
  bc: "YVR",
  "british columbia": "YVR",
  ab: "YYC",
  alberta: "YYC",
  mb: "YWG",
  manitoba: "YWG",
  sk: "YXE",
  saskatchewan: "YXE",
  ns: "YHZ",
  "nova scotia": "YHZ",
  nb: "YQM",
  "new brunswick": "YQM",
  pe: "YYG",
  pei: "YYG",
  "prince edward island": "YYG",
  nl: "YYT",
  "newfoundland and labrador": "YYT",
  "newfoundland": "YYT",
  nt: "YEG",
  "northwest territories": "YEG",
  yt: "YVR",
  yukon: "YVR",
  nu: "YOW",
  nunavut: "YOW",
  wa: "YVR",
  washington: "YVR",
  ny: "YYZ",
  "new york": "YYZ",
  mi: "YYZ",
  michigan: "YYZ",
};

export const FALLBACK_ORIGIN = originFromCode("YYZ", "fallback");

function norm(s: string) {
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "");
}

function rad(n: number) {
  return (n * Math.PI) / 180;
}

export function kmBetween(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const dLat = rad(b.lat - a.lat);
  const dLng = rad(b.lng - a.lng);
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.min(1, Math.sqrt(s)));
}

export function originFromCode(code: string, source: GeoOrigin["source"]): GeoOrigin {
  const ap = getAirport(code) as Airport | undefined;
  const hub = MAJOR_HUBS.find((h) => h.code === code);
  const use = ap || getAirport("YYZ")!;
  return {
    code: hub?.code || use.code,
    city: use.city,
    cityFr: use.cityFr,
    name: use.name,
    nameFr: use.nameFr,
    source,
  };
}

export function nearestHub(input: {
  lat?: number;
  lng?: number;
  city?: string;
  region?: string;
}): GeoOrigin {
  const lat = Number(input.lat);
  const lng = Number(input.lng);
  if (Number.isFinite(lat) && Number.isFinite(lng) && Math.abs(lat) <= 90 && Math.abs(lng) <= 180) {
    let best = MAJOR_HUBS[0];
    let bestKm = Infinity;
    for (const hub of MAJOR_HUBS) {
      const d = kmBetween({ lat, lng }, hub);
      if (d < bestKm) {
        bestKm = d;
        best = hub;
      }
    }
    return originFromCode(best.code, "ip");
  }

  const cityKey = norm(input.city || "");
  if (cityKey && CITY_HUB[cityKey]) {
    return originFromCode(CITY_HUB[cityKey], "ip");
  }

  const regionKey = (input.region || "").trim().toLowerCase();
  if (regionKey && REGION_HUB[regionKey]) {
    return originFromCode(REGION_HUB[regionKey], "ip");
  }
  const regionNorm = norm(input.region || "");
  if (regionNorm && REGION_HUB[regionNorm]) {
    return originFromCode(REGION_HUB[regionNorm], "ip");
  }

  return { ...FALLBACK_ORIGIN };
}

export function isPrivateIp(ip: string) {
  const v = ip.trim().replace(/^::ffff:/, "");
  if (!v || v === "::1" || v === "127.0.0.1") return true;
  if (v.startsWith("10.")) return true;
  if (v.startsWith("192.168.")) return true;
  if (v.startsWith("127.")) return true;
  const m = v.match(/^172\.(\d+)\./);
  if (m && Number(m[1]) >= 16 && Number(m[1]) <= 31) return true;
  return false;
}
