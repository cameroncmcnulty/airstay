/** Aviasales/Travelpayouts usually indexes city codes, not every airport. */
const AIRPORT_TO_CITY: Record<string, string> = {
  YYZ: "YTO",
  YTZ: "YTO",
  YUL: "YMQ",
  YMX: "YMQ",
  YEG: "YEA",
  LHR: "LON",
  LGW: "LON",
  STN: "LON",
  LTN: "LON",
  LCY: "LON",
  CDG: "PAR",
  ORY: "PAR",
  BVA: "PAR",
  NRT: "TYO",
  HND: "TYO",
  FCO: "ROM",
  CIA: "ROM",
  JFK: "NYC",
  EWR: "NYC",
  LGA: "NYC",
  ICN: "SEL",
  GMP: "SEL",
  MEX: "MEX",
  CUN: "CUN",
  GRU: "SAO",
  CGH: "SAO",
  GIG: "RIO",
  SDU: "RIO",
  EZE: "BUE",
  AEP: "BUE",
  SCL: "SCL",
  HAV: "HAV",
  VRA: "VRA",
  PVR: "PVR",
  SJD: "SJD",
  PUJ: "PUJ",
};

export function cityCode(iata?: string) {
  if (!iata) return "";
  const code = iata.toUpperCase();
  return AIRPORT_TO_CITY[code] || code;
}

export function searchCodes(iata?: string) {
  const raw = (iata || "").toUpperCase();
  const city = cityCode(raw);
  return city && city !== raw ? [raw, city] : [raw].filter(Boolean);
}
