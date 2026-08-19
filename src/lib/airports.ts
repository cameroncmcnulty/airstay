export type Airport = {
  code: string;
  city: string;
  cityFr: string;
  name: string;
  nameFr: string;
  province: string;
};

export const CANADIAN_AIRPORTS: Airport[] = [
  { code: "YYZ", city: "Toronto", cityFr: "Toronto", name: "Toronto Pearson", nameFr: "Toronto Pearson", province: "ON" },
  { code: "YTZ", city: "Toronto", cityFr: "Toronto", name: "Billy Bishop", nameFr: "Billy Bishop", province: "ON" },
  { code: "YVR", city: "Vancouver", cityFr: "Vancouver", name: "Vancouver International", nameFr: "Vancouver international", province: "BC" },
  { code: "YUL", city: "Montreal", cityFr: "Montréal", name: "Montréal-Trudeau", nameFr: "Montréal-Trudeau", province: "QC" },
  { code: "YYC", city: "Calgary", cityFr: "Calgary", name: "Calgary International", nameFr: "Calgary international", province: "AB" },
  { code: "YEG", city: "Edmonton", cityFr: "Edmonton", name: "Edmonton International", nameFr: "Edmonton international", province: "AB" },
  { code: "YOW", city: "Ottawa", cityFr: "Ottawa", name: "Ottawa Macdonald-Cartier", nameFr: "Ottawa Macdonald-Cartier", province: "ON" },
  { code: "YHZ", city: "Halifax", cityFr: "Halifax", name: "Halifax Stanfield", nameFr: "Halifax Stanfield", province: "NS" },
  { code: "YWG", city: "Winnipeg", cityFr: "Winnipeg", name: "Winnipeg Richardson", nameFr: "Winnipeg Richardson", province: "MB" },
  { code: "YQB", city: "Quebec City", cityFr: "Québec", name: "Québec City Jean Lesage", nameFr: "Québec Jean-Lesage", province: "QC" },
  { code: "YYJ", city: "Victoria", cityFr: "Victoria", name: "Victoria International", nameFr: "Victoria international", province: "BC" },
  { code: "YQR", city: "Regina", cityFr: "Regina", name: "Regina International", nameFr: "Regina international", province: "SK" },
  { code: "YXE", city: "Saskatoon", cityFr: "Saskatoon", name: "Saskatoon John G. Diefenbaker", nameFr: "Saskatoon John G. Diefenbaker", province: "SK" },
  { code: "YQM", city: "Moncton", cityFr: "Moncton", name: "Greater Moncton Roméo LeBlanc", nameFr: "Grand Moncton Roméo-LeBlanc", province: "NB" },
  { code: "YFC", city: "Fredericton", cityFr: "Fredericton", name: "Fredericton International", nameFr: "Fredericton international", province: "NB" },
  { code: "YSJ", city: "Saint John", cityFr: "Saint John", name: "Saint John Airport", nameFr: "Aéroport de Saint John", province: "NB" },
  { code: "YYT", city: "St. John's", cityFr: "St. John's", name: "St. John's International", nameFr: "St. John's international", province: "NL" },
  { code: "YKF", city: "Kitchener", cityFr: "Kitchener", name: "Region of Waterloo", nameFr: "Région de Waterloo", province: "ON" },
  { code: "YLW", city: "Kelowna", cityFr: "Kelowna", name: "Kelowna International", nameFr: "Kelowna international", province: "BC" },
  { code: "YXX", city: "Abbotsford", cityFr: "Abbotsford", name: "Abbotsford International", nameFr: "Abbotsford international", province: "BC" },
  { code: "YXU", city: "London", cityFr: "London", name: "London International", nameFr: "London international", province: "ON" },
  { code: "YQG", city: "Windsor", cityFr: "Windsor", name: "Windsor International", nameFr: "Windsor international", province: "ON" },
  { code: "YQT", city: "Thunder Bay", cityFr: "Thunder Bay", name: "Thunder Bay International", nameFr: "Thunder Bay international", province: "ON" },
  { code: "YZF", city: "Yellowknife", cityFr: "Yellowknife", name: "Yellowknife Airport", nameFr: "Aéroport de Yellowknife", province: "NT" },
  { code: "YXY", city: "Whitehorse", cityFr: "Whitehorse", name: "Erik Nielsen Whitehorse", nameFr: "Erik Nielsen Whitehorse", province: "YT" },
  { code: "YFB", city: "Iqaluit", cityFr: "Iqaluit", name: "Iqaluit Airport", nameFr: "Aéroport d'Iqaluit", province: "NU" },
  { code: "YYG", city: "Charlottetown", cityFr: "Charlottetown", name: "Charlottetown Airport", nameFr: "Aéroport de Charlottetown", province: "PE" },
];

export type Destination = {
  code: string;
  city: string;
  cityFr: string;
  country: string;
  countryFr: string;
};

export const POPULAR_DESTINATIONS: Destination[] = [
  { code: "LHR", city: "London", cityFr: "Londres", country: "United Kingdom", countryFr: "Royaume-Uni" },
  { code: "CDG", city: "Paris", cityFr: "Paris", country: "France", countryFr: "France" },
  { code: "NRT", city: "Tokyo", cityFr: "Tokyo", country: "Japan", countryFr: "Japon" },
  { code: "FCO", city: "Rome", cityFr: "Rome", country: "Italy", countryFr: "Italie" },
  { code: "CUN", city: "Cancún", cityFr: "Cancún", country: "Mexico", countryFr: "Mexique" },
  { code: "JFK", city: "New York", cityFr: "New York", country: "United States", countryFr: "États-Unis" },
  { code: "DUB", city: "Dublin", cityFr: "Dublin", country: "Ireland", countryFr: "Irlande" },
  { code: "BCN", city: "Barcelona", cityFr: "Barcelone", country: "Spain", countryFr: "Espagne" },
  { code: "LIS", city: "Lisbon", cityFr: "Lisbonne", country: "Portugal", countryFr: "Portugal" },
  { code: "AMS", city: "Amsterdam", cityFr: "Amsterdam", country: "Netherlands", countryFr: "Pays-Bas" },
  { code: "LAX", city: "Los Angeles", cityFr: "Los Angeles", country: "United States", countryFr: "États-Unis" },
  { code: "MCO", city: "Orlando", cityFr: "Orlando", country: "United States", countryFr: "États-Unis" },
  { code: "KEF", city: "Reykjavík", cityFr: "Reykjavík", country: "Iceland", countryFr: "Islande" },
  { code: "ICN", city: "Seoul", cityFr: "Séoul", country: "South Korea", countryFr: "Corée du Sud" },
  { code: "HNL", city: "Honolulu", cityFr: "Honolulu", country: "United States", countryFr: "États-Unis" },
  { code: "MEX", city: "Mexico City", cityFr: "Mexico", country: "Mexico", countryFr: "Mexique" },
  { code: "MAD", city: "Madrid", cityFr: "Madrid", country: "Spain", countryFr: "Espagne" },
  { code: "ATH", city: "Athens", cityFr: "Athènes", country: "Greece", countryFr: "Grèce" },
  { code: "BKK", city: "Bangkok", cityFr: "Bangkok", country: "Thailand", countryFr: "Thaïlande" },
  { code: "SYD", city: "Sydney", cityFr: "Sydney", country: "Australia", countryFr: "Australie" },
  { code: "LAS", city: "Las Vegas", cityFr: "Las Vegas", country: "United States", countryFr: "États-Unis" },
  { code: "MIA", city: "Miami", cityFr: "Miami", country: "United States", countryFr: "États-Unis" },
  { code: "SFO", city: "San Francisco", cityFr: "San Francisco", country: "United States", countryFr: "États-Unis" },
  { code: "FRA", city: "Frankfurt", cityFr: "Francfort", country: "Germany", countryFr: "Allemagne" },
];

export function searchCanadianAirports(q: string): Airport[] {
  const s = q.trim().toLowerCase();
  if (!s) return CANADIAN_AIRPORTS.slice(0, 8);
  return CANADIAN_AIRPORTS.filter(
    (a) =>
      a.code.toLowerCase().includes(s) ||
      a.city.toLowerCase().includes(s) ||
      a.cityFr.toLowerCase().includes(s) ||
      a.name.toLowerCase().includes(s) ||
      a.nameFr.toLowerCase().includes(s)
  ).slice(0, 10);
}

export function searchDestinations(q: string): Destination[] {
  const s = q.trim().toLowerCase();
  if (!s) return POPULAR_DESTINATIONS.slice(0, 8);
  return POPULAR_DESTINATIONS.filter(
    (d) =>
      d.code.toLowerCase().includes(s) ||
      d.city.toLowerCase().includes(s) ||
      d.cityFr.toLowerCase().includes(s) ||
      d.country.toLowerCase().includes(s) ||
      d.countryFr.toLowerCase().includes(s)
  ).slice(0, 10);
}

export function getAirport(code: string) {
  return CANADIAN_AIRPORTS.find((a) => a.code === code);
}

export function getDestination(code: string) {
  return POPULAR_DESTINATIONS.find((d) => d.code === code);
}

export function isCanadianAirport(code: string) {
  return CANADIAN_AIRPORTS.some((a) => a.code.toUpperCase() === code.toUpperCase());
}
