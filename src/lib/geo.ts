import type { SearchQuery } from "@/lib/deeplinks";

export type GeoPoint = {
  latitude: number;
  longitude: number;
  radius: number;
  label: string;
};

const BY_CODE: Record<string, GeoPoint> = {
  CUN: { latitude: 21.1326, longitude: -86.7463, radius: 8, label: "Cancún Hotel Zone" },
  CZM: { latitude: 20.5083, longitude: -86.9456, radius: 8, label: "Cozumel" },
  MID: { latitude: 20.9674, longitude: -89.5926, radius: 8, label: "Mérida" },
  PVR: { latitude: 20.6534, longitude: -105.2253, radius: 8, label: "Puerto Vallarta" },
  SJD: { latitude: 22.8905, longitude: -109.9167, radius: 10, label: "Los Cabos" },
  MEX: { latitude: 19.4326, longitude: -99.1332, radius: 8, label: "Mexico City" },
  HUX: { latitude: 15.767, longitude: -96.13, radius: 10, label: "Huatulco" },
  ACA: { latitude: 16.8531, longitude: -99.8237, radius: 8, label: "Acapulco" },
  ZLO: { latitude: 19.05, longitude: -104.3167, radius: 8, label: "Manzanillo" },
  PUJ: { latitude: 18.5601, longitude: -68.3725, radius: 10, label: "Punta Cana" },
  MBJ: { latitude: 18.514, longitude: -77.886, radius: 10, label: "Montego Bay" },
  CUNX: { latitude: 21.1326, longitude: -86.7463, radius: 8, label: "Cancún" },
  VRA: { latitude: 23.1566, longitude: -81.2506, radius: 10, label: "Varadero" },
  NAS: { latitude: 25.0443, longitude: -77.3504, radius: 8, label: "Nassau" },
  CUN2: { latitude: 20.6296, longitude: -87.0739, radius: 8, label: "Playa del Carmen" },
  LHR: { latitude: 51.5074, longitude: -0.1278, radius: 6, label: "London" },
  LGW: { latitude: 51.5074, longitude: -0.1278, radius: 6, label: "London" },
  CDG: { latitude: 48.8566, longitude: 2.3522, radius: 6, label: "Paris" },
  ORY: { latitude: 48.8566, longitude: 2.3522, radius: 6, label: "Paris" },
  FCO: { latitude: 41.9028, longitude: 12.4964, radius: 6, label: "Rome" },
  BCN: { latitude: 41.3874, longitude: 2.1686, radius: 6, label: "Barcelona" },
  AMS: { latitude: 52.3676, longitude: 4.9041, radius: 6, label: "Amsterdam" },
  LIS: { latitude: 38.7223, longitude: -9.1393, radius: 6, label: "Lisbon" },
  DUB: { latitude: 53.3498, longitude: -6.2603, radius: 6, label: "Dublin" },
  MAD: { latitude: 40.4168, longitude: -3.7038, radius: 6, label: "Madrid" },
  ATH: { latitude: 37.9838, longitude: 23.7275, radius: 6, label: "Athens" },
  FRA: { latitude: 50.1109, longitude: 8.6821, radius: 6, label: "Frankfurt" },
  JFK: { latitude: 40.758, longitude: -73.9855, radius: 8, label: "New York" },
  EWR: { latitude: 40.758, longitude: -73.9855, radius: 8, label: "New York" },
  LGA: { latitude: 40.758, longitude: -73.9855, radius: 8, label: "New York" },
  MIA: { latitude: 25.7617, longitude: -80.1918, radius: 8, label: "Miami" },
  LAX: { latitude: 34.0522, longitude: -118.2437, radius: 10, label: "Los Angeles" },
  MCO: { latitude: 28.5383, longitude: -81.3792, radius: 10, label: "Orlando" },
  LAS: { latitude: 36.1699, longitude: -115.1398, radius: 8, label: "Las Vegas" },
  SFO: { latitude: 37.7749, longitude: -122.4194, radius: 8, label: "San Francisco" },
  HNL: { latitude: 21.3069, longitude: -157.8583, radius: 10, label: "Honolulu" },
  NRT: { latitude: 35.6762, longitude: 139.6503, radius: 8, label: "Tokyo" },
  HND: { latitude: 35.6762, longitude: 139.6503, radius: 8, label: "Tokyo" },
  ICN: { latitude: 37.5665, longitude: 126.978, radius: 8, label: "Seoul" },
  BKK: { latitude: 13.7563, longitude: 100.5018, radius: 8, label: "Bangkok" },
  SYD: { latitude: -33.8688, longitude: 151.2093, radius: 8, label: "Sydney" },
  KEF: { latitude: 64.1466, longitude: -21.9426, radius: 8, label: "Reykjavík" },
  ZIH: { latitude: 17.641, longitude: -101.551, radius: 10, label: "Ixtapa" },
  HAV: { latitude: 23.1136, longitude: -82.3666, radius: 8, label: "Havana" },
  CCC: { latitude: 22.461, longitude: -78.328, radius: 12, label: "Cayo Coco" },
  HOG: { latitude: 20.7856, longitude: -76.315, radius: 12, label: "Holguín" },
  SNU: { latitude: 22.492, longitude: -79.943, radius: 12, label: "Santa Clara" },
  AUA: { latitude: 12.5211, longitude: -69.9683, radius: 10, label: "Aruba" },
  SJU: { latitude: 18.4655, longitude: -66.1057, radius: 8, label: "San Juan" },
  POP: { latitude: 19.757, longitude: -70.42, radius: 10, label: "Puerto Plata" },
  LIR: { latitude: 10.593, longitude: -85.544, radius: 12, label: "Guanacaste" },
  SJO: { latitude: 9.9281, longitude: -84.0907, radius: 8, label: "San José" },
  PTY: { latitude: 8.9824, longitude: -79.5199, radius: 8, label: "Panama City" },
  CTG: { latitude: 10.391, longitude: -75.4794, radius: 8, label: "Cartagena" },
  BOG: { latitude: 4.711, longitude: -74.0721, radius: 8, label: "Bogotá" },
  LIM: { latitude: -12.0464, longitude: -77.0428, radius: 8, label: "Lima" },
  GIG: { latitude: -22.9068, longitude: -43.1729, radius: 10, label: "Rio de Janeiro" },
  GRU: { latitude: -23.5505, longitude: -46.6333, radius: 10, label: "São Paulo" },
  EZE: { latitude: -34.6037, longitude: -58.3816, radius: 10, label: "Buenos Aires" },
  SCL: { latitude: -33.4489, longitude: -70.6693, radius: 8, label: "Santiago" },
};

const BY_NAME: Array<{ test: RegExp; point: GeoPoint }> = [
  { test: /canc[uú]n|hotel zone|mujeres/i, point: BY_CODE.CUN },
  { test: /playa del carmen|riviera|tulum|xcaret|carmen/i, point: { latitude: 20.6296, longitude: -87.0739, radius: 10, label: "Riviera Maya" } },
  { test: /vallarta|nayarit/i, point: BY_CODE.PVR },
  { test: /cabo|lucas/i, point: BY_CODE.SJD },
  { test: /cozumel/i, point: BY_CODE.CZM },
  { test: /punta cana|bavaro/i, point: BY_CODE.PUJ },
  { test: /varadero/i, point: BY_CODE.VRA },
  { test: /havana|havane/i, point: BY_CODE.HAV },
  { test: /cayo coco|cayo/i, point: BY_CODE.CCC },
  { test: /holgu[ií]n/i, point: BY_CODE.HOG },
  { test: /huatulco/i, point: BY_CODE.HUX },
  { test: /acapulco/i, point: BY_CODE.ACA },
  { test: /ixtapa|zihuatanejo/i, point: BY_CODE.ZIH },
  { test: /aruba/i, point: BY_CODE.AUA },
  { test: /cartagena/i, point: BY_CODE.CTG },
  { test: /rio|janeiro/i, point: BY_CODE.GIG },
  { test: /buenos aires/i, point: BY_CODE.EZE },
  { test: /lima|cusco|cuzco/i, point: BY_CODE.LIM },
  { test: /bogot[aá]/i, point: BY_CODE.BOG },
  { test: /guanacaste|liberia/i, point: BY_CODE.LIR },
  { test: /montego/i, point: BY_CODE.MBJ },
  { test: /nassau|bahamas/i, point: BY_CODE.NAS },
  { test: /london/i, point: BY_CODE.LHR },
  { test: /paris/i, point: BY_CODE.CDG },
  { test: /rome|roma/i, point: BY_CODE.FCO },
  { test: /barcelona/i, point: BY_CODE.BCN },
  { test: /new york|manhattan/i, point: BY_CODE.JFK },
  { test: /miami/i, point: BY_CODE.MIA },
  { test: /orlando/i, point: BY_CODE.MCO },
];

export function searchLocation(q: Pick<SearchQuery, "to" | "toCity">): GeoPoint | null {
  const code = (q.to || "").toUpperCase();
  if (code && BY_CODE[code]) return BY_CODE[code];
  const name = q.toCity || "";
  for (const row of BY_NAME) {
    if (row.test.test(name) || row.test.test(code)) return row.point;
  }
  return null;
}
