import type { Destination } from "./airports";

function d(
  code: string,
  city: string,
  country: string,
  countryFr: string,
  cityFr?: string,
  name?: string,
  aliases?: string[]
): Destination {
  return { code, city, cityFr: cityFr || city, country, countryFr, name, aliases };
}

const US = "United States";
const USF = "États-Unis";
const MX = "Mexico";
const MXF = "Mexique";
const UK = "United Kingdom";
const UKF = "Royaume-Uni";
const FR = "France";
const IT = "Italy";
const ITF = "Italie";
const ES = "Spain";
const ESF = "Espagne";
const DE = "Germany";
const DEF = "Allemagne";
const PT = "Portugal";
const CN = "China";
const CNF = "Chine";
const IN = "India";
const INF = "Inde";
const JP = "Japan";
const JPF = "Japon";
const AU = "Australia";
const AUF = "Australie";
const BR = "Brazil";
const BRF = "Brésil";
const DO = "Dominican Republic";
const DOF = "République dominicaine";
const CU = "Cuba";
const TH = "Thailand";
const THF = "Thaïlande";
const PH = "Philippines";
const AE = "United Arab Emirates";
const AEF = "Émirats arabes unis";
const CR = "Costa Rica";
const CO = "Colombia";
const COF = "Colombie";
const GR = "Greece";
const GRF = "Grèce";
const NL = "Netherlands";
const NLF = "Pays-Bas";
const CH = "Switzerland";
const CHF = "Suisse";
const IE = "Ireland";
const IEF = "Irlande";
const TR = "Turkey";
const TRF = "Turquie";
const PL = "Poland";
const PLF = "Pologne";
const ZA = "South Africa";
const ZAF = "Afrique du Sud";
const NZ = "New Zealand";
const NZF = "Nouvelle-Zélande";
const VN = "Vietnam";
const VNF = "Viêt Nam";
const ID = "Indonesia";
const IDF = "Indonésie";
const MY = "Malaysia";
const MYF = "Malaisie";
const EG = "Egypt";
const EGF = "Égypte";
const MA = "Morocco";
const MAF = "Maroc";
const IL = "Israel";
const ILF = "Israël";
const QA = "Qatar";
const SA = "Saudi Arabia";
const SAF = "Arabie saoudite";
const KR = "South Korea";
const KRF = "Corée du Sud";
const TW = "Taiwan";
const TWF = "Taïwan";
const SG = "Singapore";
const SGF = "Singapour";
const HK = "Hong Kong";
const PE = "Peru";
const PEF = "Pérou";
const AR = "Argentina";
const ARF = "Argentine";
const CL = "Chile";
const CLF = "Chili";
const EC = "Ecuador";
const ECF = "Équateur";
const PA = "Panama";
const JM = "Jamaica";
const JMF = "Jamaïque";
const BS = "Bahamas";
const PR = "Puerto Rico";
const PRF = "Porto Rico";
const BB = "Barbados";
const BBF = "Barbade";
const AT = "Austria";
const ATF = "Autriche";
const BE = "Belgium";
const BEF = "Belgique";
const DK = "Denmark";
const DKF = "Danemark";
const SE = "Sweden";
const SEF = "Suède";
const NO = "Norway";
const NOF = "Norvège";
const FI = "Finland";
const FIF = "Finlande";
const CZ = "Czechia";
const CZF = "Tchéquie";
const HU = "Hungary";
const HUF = "Hongrie";
const IS = "Iceland";
const ISF = "Islande";
const HR = "Croatia";
const HRF = "Croatie";
const RO = "Romania";
const ROF = "Roumanie";
const BG = "Bulgaria";
const BGF = "Bulgarie";
const RS = "Serbia";
const RSF = "Serbie";
const UA = "Ukraine";
const UAF = "Ukraine";
const NG = "Nigeria";
const NGF = "Nigéria";
const KE = "Kenya";
const GH = "Ghana";
const ET = "Ethiopia";
const ETF = "Éthiopie";
const TZ = "Tanzania";
const TZF = "Tanzanie";
const MU = "Mauritius";
const MUF = "Maurice";
const MV = "Maldives";
const MVF = "Maldives";
const LK = "Sri Lanka";
const LKF = "Sri Lanka";
const NP = "Nepal";
const NPF = "Népal";
const PK = "Pakistan";
const BD = "Bangladesh";
const KH = "Cambodia";
const KHF = "Cambodge";
const LA = "Laos";
const MM = "Myanmar";
const FJ = "Fiji";
const FJF = "Fidji";
const PF = "French Polynesia";
const PFF = "Polynésie française";
const NC = "New Caledonia";
const NCF = "Nouvelle-Calédonie";
const GT = "Guatemala";
const HN = "Honduras";
const NI = "Nicaragua";
const SV = "El Salvador";
const BZ = "Belize";
const BO = "Bolivia";
const BOF = "Bolivie";
const PY = "Paraguay";
const UY = "Uruguay";
const VE = "Venezuela";
const GY = "Guyana";
const GF = "French Guiana";
const GFF = "Guyane";
const TT = "Trinidad and Tobago";
const TTF = "Trinité-et-Tobago";
const LC = "Saint Lucia";
const LCF = "Sainte-Lucie";
const GD = "Grenada";
const GDF = "Grenade";
const AG = "Antigua and Barbuda";
const AGF = "Antigua-et-Barbuda";
const KN = "Saint Kitts and Nevis";
const KNF = "Saint-Christophe-et-Niévès";
const VC = "Saint Vincent";
const KY = "Cayman Islands";
const KYF = "Îles Caïmans";
const TC = "Turks and Caicos";
const TCF = "Îles Turques-et-Caïques";
const AW = "Aruba";
const CW = "Curaçao";
const BQ = "Bonaire";
const SX = "Sint Maarten";
const GP = "Guadeloupe";
const MQ = "Martinique";
const HT = "Haiti";
const HTF = "Haïti";
const RU = "Russia";
const RUF = "Russie";
const KZ = "Kazakhstan";
const UZ = "Uzbekistan";
const UZF = "Ouzbékistan";
const GE = "Georgia";
const GEF = "Géorgie";
const AM = "Armenia";
const AMF = "Arménie";
const AZ = "Azerbaijan";
const AZF = "Azerbaïdjan";
const JO = "Jordan";
const JOF = "Jordanie";
const LB = "Lebanon";
const LBF = "Liban";
const CY = "Cyprus";
const CYF = "Chypre";
const MT = "Malta";
const MTF = "Malte";
const LU = "Luxembourg";
const EE = "Estonia";
const EEF = "Estonie";
const LV = "Latvia";
const LVF = "Lettonie";
const LT = "Lithuania";
const LTF = "Lituanie";
const SK = "Slovakia";
const SKF = "Slovaquie";
const SI = "Slovenia";
const SIF = "Slovénie";
const BA = "Bosnia and Herzegovina";
const BAF = "Bosnie-Herzégovine";
const ME = "Montenegro";
const MEF = "Monténégro";
const AL = "Albania";
const ALF = "Albanie";
const MK = "North Macedonia";
const MKF = "Macédoine du Nord";
const MD = "Moldova";
const MDF = "Moldavie";
const BY = "Belarus";
const BYF = "Biélorussie";
const TN = "Tunisia";
const TNF = "Tunisie";
const DZ = "Algeria";
const DZF = "Algérie";
const SN = "Senegal";
const SNF = "Sénégal";
const CI = "Côte d'Ivoire";
const RW = "Rwanda";
const UG = "Uganda";
const UGF = "Ouganda";
const MZ = "Mozambique";
const NA = "Namibia";
const NAF = "Namibie";
const BW = "Botswana";
const ZW = "Zimbabwe";
const ZM = "Zambia";
const ZMF = "Zambie";
const RE = "Réunion";
const SC = "Seychelles";
const KW = "Kuwait";
const KWF = "Koweït";
const BH = "Bahrain";
const BHF = "Bahreïn";
const OM = "Oman";
const IQ = "Iraq";
const IR = "Iran";
const AF = "Afghanistan";
const MN = "Mongolia";
const MNF = "Mongolie";
const MO = "Macau";
const MOF = "Macao";
const BN = "Brunei";
const PG = "Papua New Guinea";
const PGF = "Papouasie-Nouvelle-Guinée";
const WS = "Samoa";
const TO = "Tonga";
const GU = "Guam";
const MP = "Northern Mariana Islands";
const MPF = "Mariannes du Nord";
const AS = "American Samoa";
const ASF = "Samoa américaines";
export const WORLD_PASSENGER_AIRPORTS: Destination[] = [
  d("ATL", "Atlanta", US, USF, "Atlanta", "Hartsfield-Jackson"),
  d("ANC", "Anchorage", US, USF, "Anchorage", "Ted Stevens"),
  d("AUS", "Austin", US, USF),
  d("BWI", "Baltimore", US, USF, "Baltimore", "Thurgood Marshall"),
  d("BOS", "Boston", US, USF, "Boston", "Logan"),
  d("BUF", "Buffalo", US, USF),
  d("BUR", "Burbank", US, USF, "Burbank", "Hollywood Burbank"),
  d("CLT", "Charlotte", US, USF, "Charlotte", "Douglas International"),
  d("MDW", "Chicago", US, USF, "Chicago", "Midway", ["chicago"]),
  d("ORD", "Chicago", US, USF, "Chicago", "O'Hare", ["chicago"]),
  d("CVG", "Cincinnati", US, USF),
  d("CLE", "Cleveland", US, USF),
  d("CMH", "Columbus", US, USF),
  d("DAL", "Dallas", US, USF, "Dallas", "Love Field"),
  d("DFW", "Dallas", US, USF, "Dallas", "Dallas/Fort Worth"),
  d("DEN", "Denver", US, USF),
  d("DTW", "Detroit", US, USF, "Detroit", "Wayne County"),
  d("FLL", "Fort Lauderdale", US, USF),
  d("RSW", "Fort Myers", US, USF, "Fort Myers", "Southwest Florida"),
  d("BDL", "Hartford", US, USF, "Hartford", "Bradley"),
  d("IAH", "Houston", US, USF, "Houston", "George Bush Intercontinental"),
  d("HOU", "Houston", US, USF, "Houston", "Hobby"),
  d("IND", "Indianapolis", US, USF),
  d("JAX", "Jacksonville", US, USF),
  d("MCI", "Kansas City", US, USF),
  d("SNA", "Orange County", US, USF, "Orange County", "John Wayne", ["santa ana"]),
  d("LAS", "Las Vegas", US, USF),
  d("LAX", "Los Angeles", US, USF),
  d("SDF", "Louisville", US, USF),
  d("MEM", "Memphis", US, USF),
  d("MIA", "Miami", US, USF),
  d("MSP", "Minneapolis", US, USF, "Minneapolis", "St. Paul"),
  d("BNA", "Nashville", US, USF),
  d("MSY", "New Orleans", US, USF),
  d("JFK", "New York", US, USF, "New York", "John F. Kennedy", ["nyc"]),
  d("LGA", "New York", US, USF, "New York", "LaGuardia", ["nyc"]),
  d("EWR", "Newark", US, USF, "Newark", "Newark Liberty", ["nyc"]),
  d("OAK", "Oakland", US, USF),
  d("OKC", "Oklahoma City", US, USF),
  d("MCO", "Orlando", US, USF),
  d("SFB", "Orlando", US, USF, "Orlando", "Sanford"),
  d("PSP", "Palm Springs", US, USF),
  d("PHL", "Philadelphia", US, USF),
  d("PHX", "Phoenix", US, USF, "Phoenix", "Sky Harbor"),
  d("PIT", "Pittsburgh", US, USF),
  d("PWM", "Portland", US, USF, "Portland", "Portland Jetport", ["maine"]),
  d("PDX", "Portland", US, USF, "Portland", "Portland International"),
  d("PVD", "Providence", US, USF),
  d("RDU", "Raleigh-Durham", US, USF),
  d("SMF", "Sacramento", US, USF),
  d("SLC", "Salt Lake City", US, USF),
  d("SAT", "San Antonio", US, USF),
  d("SAN", "San Diego", US, USF),
  d("SFO", "San Francisco", US, USF),
  d("SJC", "San Jose", US, USF, "San Jose", "Norman Y. Mineta"),
  d("SEA", "Seattle", US, USF, "Seattle", "Sea-Tac"),
  d("GEG", "Spokane", US, USF),
  d("STL", "St. Louis", US, USF, "St. Louis", "Lambert"),
  d("TPA", "Tampa", US, USF),
  d("TUL", "Tulsa", US, USF),
  d("IAD", "Washington", US, USF, "Washington", "Dulles", ["dc", "was"]),
  d("DCA", "Washington", US, USF, "Washington", "Reagan National", ["dc", "was"]),
  d("PBI", "West Palm Beach", US, USF),
  d("HNL", "Honolulu", US, USF),
  d("OGG", "Maui", US, USF, "Maui", "Kahului"),
  d("KOA", "Kona", US, USF),
  d("LIH", "Lihue", US, USF, "Lihue", "Lihue", ["kauai"]),
  d("ITO", "Hilo", US, USF),
  d("SJU", "San Juan", US, USF, "San Juan", "Luis Muñoz Marín"),
  d("STT", "St. Thomas", US, USF, "Saint-Thomas"),
  d("STX", "St. Croix", US, USF, "Sainte-Croix"),
  d("BZN", "Bozeman", US, USF),
  d("RNO", "Reno", US, USF),
  d("BOI", "Boise", US, USF),
  d("ABQ", "Albuquerque", US, USF),
  d("ELP", "El Paso", US, USF),
  d("OMA", "Omaha", US, USF),
  d("RIC", "Richmond", US, USF),
  d("ORF", "Norfolk", US, USF),
  d("CHS", "Charleston", US, USF),
  d("SAV", "Savannah", US, USF),
  d("MYR", "Myrtle Beach", US, USF),
  d("BHM", "Birmingham", US, USF),
  d("HSV", "Huntsville", US, USF),
  d("TYS", "Knoxville", US, USF),
  d("GRR", "Grand Rapids", US, USF),
  d("MKE", "Milwaukee", US, USF),
  d("DSM", "Des Moines", US, USF),
  d("MSN", "Madison", US, USF),
  d("SYR", "Syracuse", US, USF),
  d("ROC", "Rochester", US, USF),
  d("ALB", "Albany", US, USF),
  d("BTV", "Burlington", US, USF),
  d("MHT", "Manchester", US, USF),
  d("COS", "Colorado Springs", US, USF),
  d("FAT", "Fresno", US, USF),
  d("ONT", "Ontario", US, USF),
  d("LGB", "Long Beach", US, USF),
  d("SBA", "Santa Barbara", US, USF),
  d("EYW", "Key West", US, USF),
  d("SRQ", "Sarasota", US, USF),
  d("PIE", "St. Petersburg", US, USF, "St. Petersburg", "Clearwater"),
  d("MLB", "Melbourne", US, USF),
  d("DAB", "Daytona Beach", US, USF),
  d("GSP", "Greenville", US, USF),
  d("GSO", "Greensboro", US, USF),
  d("XNA", "Bentonville", US, USF, "Bentonville", "Northwest Arkansas"),
  d("LIT", "Little Rock", US, USF),
  d("TUS", "Tucson", US, USF),
  d("FAI", "Fairbanks", US, USF),
  d("JNU", "Juneau", US, USF),
  d("KTN", "Ketchikan", US, USF),
  d("BIL", "Billings", US, USF),
  d("MSO", "Missoula", US, USF),
  d("FCA", "Kalispell", US, USF, "Kalispell", "Glacier Park"),
  d("JAC", "Jackson", US, USF, "Jackson", "Jackson Hole"),
  d("ASE", "Aspen", US, USF),
  d("EGE", "Eagle", US, USF, "Eagle", "Vail/Eagle"),
  d("HDN", "Hayden", US, USF, "Hayden", "Steamboat Springs"),
  d("GJT", "Grand Junction", US, USF),
  d("DRO", "Durango", US, USF),

  d("CUN", "Cancún", MX, MXF),
  d("MEX", "Mexico City", MX, MXF, "Mexico", "Benito Juárez"),
  d("GDL", "Guadalajara", MX, MXF),
  d("MTY", "Monterrey", MX, MXF),
  d("PVR", "Puerto Vallarta", MX, MXF),
  d("SJD", "Los Cabos", MX, MXF),
  d("CZM", "Cozumel", MX, MXF),
  d("HUX", "Huatulco", MX, MXF),
  d("ACA", "Acapulco", MX, MXF),
  d("ZIH", "Ixtapa", MX, MXF, "Ixtapa", "Ixtapa-Zihuatanejo"),
  d("MID", "Mérida", MX, MXF),
  d("TIJ", "Tijuana", MX, MXF),
  d("BJX", "León", MX, MXF, "León", "Guanajuato"),
  d("QRO", "Querétaro", MX, MXF),
  d("PBC", "Puebla", MX, MXF),
  d("CUU", "Chihuahua", MX, MXF),
  d("CJS", "Ciudad Juárez", MX, MXF),
  d("VER", "Veracruz", MX, MXF),
  d("OAX", "Oaxaca", MX, MXF),
  d("TAP", "Tapachula", MX, MXF),
  d("VSA", "Villahermosa", MX, MXF),
  d("CME", "Ciudad del Carmen", MX, MXF),
  d("NLU", "Mexico City", MX, MXF, "Mexico", "Felipe Ángeles"),
  d("TLC", "Toluca", MX, MXF),
  d("CPE", "Campeche", MX, MXF),
  d("CTM", "Chetumal", MX, MXF),
  d("PXM", "Puerto Escondido", MX, MXF),
  d("ZLO", "Manzanillo", MX, MXF),
  d("MLM", "Morelia", MX, MXF),
  d("AGU", "Aguascalientes", MX, MXF),
  d("SLP", "San Luis Potosí", MX, MXF),
  d("TRC", "Torreón", MX, MXF),
  d("HMO", "Hermosillo", MX, MXF),
  d("CUL", "Culiacán", MX, MXF),
  d("MZT", "Mazatlán", MX, MXF),
  d("LAP", "La Paz", MX, MXF),

  d("HAV", "Havana", CU, CU, "La Havane"),
  d("VRA", "Varadero", CU, CU),
  d("CCC", "Cayo Coco", CU, CU),
  d("HOG", "Holguín", CU, CU),
  d("SNU", "Santa Clara", CU, CU),
  d("GER", "Nueva Gerona", CU, CU),
  d("CMW", "Camagüey", CU, CU),
  d("SCU", "Santiago de Cuba", CU, CU),
  d("PUJ", "Punta Cana", DO, DOF),
  d("POP", "Puerto Plata", DO, DOF),
  d("SDQ", "Santo Domingo", DO, DOF, "Saint-Domingue"),
  d("STI", "Santiago", DO, DOF),
  d("AZS", "El Catey", DO, DOF, "El Catey", "Samaná"),
  d("LRM", "La Romana", DO, DOF),
  d("MBJ", "Montego Bay", JM, JMF),
  d("KIN", "Kingston", JM, JMF),
  d("NAS", "Nassau", BS, BS, "Nassau", "Lynden Pindling"),
  d("FPO", "Freeport", BS, BS),
  d("GGT", "George Town", BS, BS, "George Town", "Exuma"),
  d("ELH", "North Eleuthera", BS, BS),
  d("MHH", "Marsh Harbour", BS, BS),
  d("AUA", "Aruba", AW, AW, "Aruba", "Queen Beatrix"),
  d("CUR", "Curaçao", CW, CW),
  d("BON", "Bonaire", BQ, BQ),
  d("SXM", "Sint Maarten", SX, SX, "Saint-Martin", "Princess Juliana"),
  d("SBH", "St. Barthélemy", GP, GP, "Saint-Barthélemy"),
  d("EIS", "Tortola", "British Virgin Islands", "Îles Vierges britanniques"),
  d("UVF", "Vieux Fort", LC, LCF, "Vieux Fort", "Hewanorra"),
  d("SLU", "Castries", LC, LCF),
  d("BGI", "Bridgetown", BB, BBF, "Bridgetown", "Grantley Adams"),
  d("GND", "St. George's", GD, GDF, "Saint-Georges"),
  d("POS", "Port of Spain", TT, TTF),
  d("TAB", "Tobago", TT, TTF),
  d("ANU", "St. John's", AG, AGF, "Saint-Jean", "V.C. Bird"),
  d("SKB", "Basseterre", KN, KNF),
  d("SVD", "Kingstown", VC, VC),
  d("DOM", "Roseau", "Dominica", "Dominique"),
  d("PTP", "Pointe-à-Pitre", GP, GP),
  d("FDF", "Fort-de-France", MQ, MQ),
  d("CAY", "Cayenne", GF, GFF),
  d("GCM", "Grand Cayman", KY, KYF),
  d("PLS", "Providenciales", TC, TCF),
  d("GDT", "Cockburn Town", TC, TCF, "Cockburn Town", "JAGS McCartney"),
  d("PAP", "Port-au-Prince", HT, HTF),
  d("CAP", "Cap-Haïtien", HT, HTF),

  d("SJO", "San José", CR, CR),
  d("LIR", "Liberia", CR, CR, "Liberia", "Guanacaste"),
  d("PTY", "Panama City", PA, PA, "Panama", "Tocumen"),
  d("GUA", "Guatemala City", GT, GT, "Guatemala"),
  d("SAP", "San Pedro Sula", HN, HN),
  d("TGU", "Tegucigalpa", HN, HN),
  d("MGA", "Managua", NI, NI),
  d("SAL", "San Salvador", SV, SV),
  d("BZE", "Belize City", BZ, BZ),
  d("BOG", "Bogotá", CO, COF),
  d("MDE", "Medellín", CO, COF),
  d("CTG", "Cartagena", CO, COF, "Carthagène"),
  d("CLO", "Cali", CO, COF),
  d("BAQ", "Barranquilla", CO, COF),
  d("SMR", "Santa Marta", CO, COF),
  d("LIM", "Lima", PE, PEF, "Lima", "Jorge Chávez"),
  d("CUZ", "Cusco", PE, PEF),
  d("UIO", "Quito", EC, ECF),
  d("GYE", "Guayaquil", EC, ECF),
  d("GPS", "Baltra", EC, ECF, "Baltra", "Galápagos"),
  d("GIG", "Rio de Janeiro", BR, BRF, "Rio de Janeiro", "Galeão"),
  d("SDU", "Rio de Janeiro", BR, BRF, "Rio de Janeiro", "Santos Dumont"),
  d("GRU", "São Paulo", BR, BRF, "São Paulo", "Guarulhos"),
  d("CGH", "São Paulo", BR, BRF, "São Paulo", "Congonhas"),
  d("BSB", "Brasília", BR, BRF),
  d("SSA", "Salvador", BR, BRF),
  d("FOR", "Fortaleza", BR, BRF),
  d("REC", "Recife", BR, BRF),
  d("POA", "Porto Alegre", BR, BRF),
  d("CWB", "Curitiba", BR, BRF),
  d("BEL", "Belém", BR, BRF),
  d("MAO", "Manaus", BR, BRF),
  d("FLN", "Florianópolis", BR, BRF),
  d("EZE", "Buenos Aires", AR, ARF, "Buenos Aires", "Ezeiza", ["bue"]),
  d("AEP", "Buenos Aires", AR, ARF, "Buenos Aires", "Aeroparque", ["bue"]),
  d("SCL", "Santiago", CL, CLF, "Santiago", "Arturo Merino Benítez"),
  d("VVI", "Santa Cruz", BO, BOF),
  d("LPB", "La Paz", BO, BOF),
  d("ASU", "Asunción", PY, PY),
  d("MVD", "Montevideo", UY, UY),
  d("CCS", "Caracas", VE, VE),
  d("GEO", "Georgetown", GY, GY),
  d("PBM", "Paramaribo", "Suriname", "Suriname"),

  d("LHR", "London", UK, UKF, "Londres", "Heathrow", ["lon", "london"]),
  d("LGW", "London", UK, UKF, "Londres", "Gatwick", ["lon", "london"]),
  d("STN", "London", UK, UKF, "Londres", "Stansted", ["lon"]),
  d("LTN", "London", UK, UKF, "Londres", "Luton", ["lon"]),
  d("LCY", "London", UK, UKF, "Londres", "City", ["lon"]),
  d("MAN", "Manchester", UK, UKF),
  d("EDI", "Edinburgh", UK, UKF, "Édimbourg"),
  d("GLA", "Glasgow", UK, UKF),
  d("BHX", "Birmingham", UK, UKF),
  d("BRS", "Bristol", UK, UKF),
  d("NCL", "Newcastle", UK, UKF),
  d("LPL", "Liverpool", UK, UKF),
  d("BFS", "Belfast", UK, UKF, "Belfast", "International"),
  d("BHD", "Belfast", UK, UKF, "Belfast", "City"),
  d("CWL", "Cardiff", UK, UKF),
  d("ABZ", "Aberdeen", UK, UKF),
  d("INV", "Inverness", UK, UKF),
  d("NWI", "Norwich", UK, UKF),
  d("EXT", "Exeter", UK, UKF),
  d("SOU", "Southampton", UK, UKF),
  d("DUB", "Dublin", IE, IEF),
  d("ORK", "Cork", IE, IEF),
  d("SNN", "Shannon", IE, IEF),
  d("KIR", "Kerry", IE, IEF),
  d("NOC", "Knock", IE, IEF, "Knock", "Ireland West"),
  d("CDG", "Paris", FR, FR, "Paris", "Charles de Gaulle", ["par", "paris"]),
  d("ORY", "Paris", FR, FR, "Paris", "Orly", ["par"]),
  d("BVA", "Paris", FR, FR, "Paris", "Beauvais", ["par"]),
  d("NCE", "Nice", FR, FR),
  d("LYS", "Lyon", FR, FR),
  d("MRS", "Marseille", FR, FR),
  d("TLS", "Toulouse", FR, FR),
  d("BOD", "Bordeaux", FR, FR),
  d("NTE", "Nantes", FR, FR),
  d("SXB", "Strasbourg", FR, FR),
  d("LIL", "Lille", FR, FR),
  d("MPL", "Montpellier", FR, FR),
  d("BIQ", "Biarritz", FR, FR),
  d("PGF", "Perpignan", FR, FR),
  d("AJA", "Ajaccio", FR, FR),
  d("BIA", "Bastia", FR, FR),
  d("FCO", "Rome", IT, ITF, "Rome", "Fiumicino", ["rom", "rome"]),
  d("CIA", "Rome", IT, ITF, "Rome", "Ciampino", ["rom"]),
  d("MXP", "Milan", IT, ITF, "Milan", "Malpensa"),
  d("LIN", "Milan", IT, ITF, "Milan", "Linate"),
  d("BGY", "Milan", IT, ITF, "Milan", "Bergamo Orio al Serio"),
  d("VCE", "Venice", IT, ITF, "Venise", "Marco Polo"),
  d("TSF", "Venice", IT, ITF, "Venise", "Treviso"),
  d("NAP", "Naples", IT, ITF, "Naples"),
  d("BLQ", "Bologna", IT, ITF, "Bologne"),
  d("CTA", "Catania", IT, ITF),
  d("PMO", "Palermo", IT, ITF, "Palerme"),
  d("PSA", "Pisa", IT, ITF),
  d("FLR", "Florence", IT, ITF, "Florence"),
  d("TRN", "Turin", IT, ITF),
  d("BRI", "Bari", IT, ITF),
  d("GOA", "Genoa", IT, ITF, "Gênes"),
  d("VRN", "Verona", IT, ITF),
  d("CAG", "Cagliari", IT, ITF),
  d("OLB", "Olbia", IT, ITF),
  d("BCN", "Barcelona", ES, ESF, "Barcelone"),
  d("MAD", "Madrid", ES, ESF, "Madrid", "Adolfo Suárez"),
  d("AGP", "Málaga", ES, ESF),
  d("PMI", "Palma", ES, ESF, "Palma", "Palma de Mallorca"),
  d("IBZ", "Ibiza", ES, ESF),
  d("ALC", "Alicante", ES, ESF),
  d("VLC", "Valencia", ES, ESF, "Valence"),
  d("SVQ", "Seville", ES, ESF, "Séville"),
  d("BIO", "Bilbao", ES, ESF),
  d("TFN", "Tenerife", ES, ESF, "Tenerife", "Norte"),
  d("TFS", "Tenerife", ES, ESF, "Tenerife", "Sur"),
  d("LPA", "Las Palmas", ES, ESF, "Las Palmas", "Gran Canaria"),
  d("ACE", "Lanzarote", ES, ESF),
  d("FUE", "Fuerteventura", ES, ESF),
  d("SCQ", "Santiago de Compostela", ES, ESF),
  d("GRO", "Girona", ES, ESF),
  d("REU", "Reus", ES, ESF),
  d("OPO", "Porto", PT, PT),
  d("LIS", "Lisbon", PT, PT, "Lisbonne", "Humberto Delgado"),
  d("FAO", "Faro", PT, PT),
  d("FNC", "Funchal", PT, PT, "Funchal", "Madeira", ["madeira"]),
  d("PDL", "Ponta Delgada", PT, PT, "Ponta Delgada", "Azores", ["azores", "acores"]),
  d("TER", "Terceira", PT, PT, "Terceira", "Lajes"),
  d("HOR", "Horta", PT, PT),
  d("AMS", "Amsterdam", NL, NLF, "Amsterdam", "Schiphol"),
  d("RTM", "Rotterdam", NL, NLF),
  d("EIN", "Eindhoven", NL, NLF),
  d("FRA", "Frankfurt", DE, DEF, "Francfort"),
  d("MUC", "Munich", DE, DEF),
  d("DUS", "Düsseldorf", DE, DEF),
  d("HAM", "Hamburg", DE, DEF, "Hambourg"),
  d("BER", "Berlin", DE, DEF, "Berlin", "Brandenburg"),
  d("CGN", "Cologne", DE, DEF, "Cologne", "Cologne Bonn"),
  d("STR", "Stuttgart", DE, DEF),
  d("HAJ", "Hanover", DE, DEF, "Hanovre"),
  d("NUE", "Nuremberg", DE, DEF, "Nuremberg"),
  d("LEJ", "Leipzig", DE, DEF),
  d("DTM", "Dortmund", DE, DEF),
  d("FMM", "Memmingen", DE, DEF),
  d("BRU", "Brussels", BE, BEF, "Bruxelles"),
  d("CRL", "Brussels", BE, BEF, "Bruxelles", "Charleroi"),
  d("LGG", "Liège", BE, BEF),
  d("ANR", "Antwerp", BE, BEF, "Anvers"),
  d("ZRH", "Zurich", CH, CHF),
  d("GVA", "Geneva", CH, CHF, "Genève"),
  d("BSL", "Basel", CH, CHF, "Bâle", "EuroAirport"),
  d("VIE", "Vienna", AT, ATF, "Vienne"),
  d("SZG", "Salzburg", AT, ATF),
  d("INN", "Innsbruck", AT, ATF),
  d("CPH", "Copenhagen", DK, DKF, "Copenhague"),
  d("BLL", "Billund", DK, DKF),
  d("AAL", "Aalborg", DK, DKF),
  d("ARN", "Stockholm", SE, SEF, "Stockholm", "Arlanda"),
  d("BMA", "Stockholm", SE, SEF, "Stockholm", "Bromma"),
  d("NYO", "Stockholm", SE, SEF, "Stockholm", "Skavsta"),
  d("GOT", "Gothenburg", SE, SEF, "Göteborg"),
  d("OSL", "Oslo", NO, NOF),
  d("BGO", "Bergen", NO, NOF),
  d("SVG", "Stavanger", NO, NOF),
  d("TRD", "Trondheim", NO, NOF),
  d("HEL", "Helsinki", FI, FIF),
  d("TMP", "Tampere", FI, FIF),
  d("OUL", "Oulu", FI, FIF),
  d("KEF", "Reykjavík", IS, ISF, "Reykjavík", "Keflavík"),
  d("RKV", "Reykjavík", IS, ISF),
  d("ATH", "Athens", GR, GRF, "Athènes"),
  d("SKG", "Thessaloniki", GR, GRF, "Thessalonique"),
  d("HER", "Heraklion", GR, GRF, "Héraklion"),
  d("JTR", "Santorini", GR, GRF),
  d("CFU", "Corfu", GR, GRF, "Corfou"),
  d("ZTH", "Zakynthos", GR, GRF),
  d("RHO", "Rhodes", GR, GRF, "Rhodes"),
  d("CHQ", "Chania", GR, GRF, "La Canée"),
  d("KGS", "Kos", GR, GRF),
  d("JMK", "Mykonos", GR, GRF),
  d("IST", "Istanbul", TR, TRF, "Istanbul"),
  d("SAW", "Istanbul", TR, TRF, "Istanbul", "Sabiha Gökçen"),
  d("AYT", "Antalya", TR, TRF),
  d("ADB", "Izmir", TR, TRF, "Izmir"),
  d("ESB", "Ankara", TR, TRF),
  d("BJV", "Bodrum", TR, TRF),
  d("DLM", "Dalaman", TR, TRF),
  d("WAW", "Warsaw", PL, PLF, "Varsovie"),
  d("KRK", "Kraków", PL, PLF, "Cracovie"),
  d("GDN", "Gdańsk", PL, PLF),
  d("WRO", "Wrocław", PL, PLF),
  d("KTW", "Katowice", PL, PLF),
  d("POZ", "Poznań", PL, PLF),
  d("PRG", "Prague", CZ, CZF),
  d("BRQ", "Brno", CZ, CZF),
  d("BUD", "Budapest", HU, HUF),
  d("OTP", "Bucharest", RO, ROF, "Bucarest"),
  d("CLJ", "Cluj-Napoca", RO, ROF),
  d("SOF", "Sofia", BG, BGF),
  d("VAR", "Varna", BG, BGF),
  d("BEG", "Belgrade", RS, RSF, "Belgrade"),
  d("ZAG", "Zagreb", HR, HRF),
  d("SPU", "Split", HR, HRF),
  d("DBV", "Dubrovnik", HR, HRF),
  d("ZAD", "Zadar", HR, HRF),
  d("PUY", "Pula", HR, HRF),
  d("LJU", "Ljubljana", SI, SIF),
  d("SJJ", "Sarajevo", BA, BAF),
  d("TGD", "Podgorica", ME, MEF),
  d("TIV", "Tivat", ME, MEF),
  d("TIA", "Tirana", AL, ALF),
  d("SKP", "Skopje", MK, MKF),
  d("KIV", "Chișinău", MD, MDF),
  d("RIX", "Riga", LV, LVF),
  d("TLL", "Tallinn", EE, EEF),
  d("VNO", "Vilnius", LT, LTF),
  d("KUN", "Kaunas", LT, LTF),
  d("BTS", "Bratislava", SK, SKF),
  d("KSC", "Košice", SK, SKF),
  d("LUX", "Luxembourg", LU, LU),
  d("MLA", "Malta", MT, MTF, "Malte"),
  d("LCA", "Larnaca", CY, CYF, "Larnaca"),
  d("PFO", "Paphos", CY, CYF, "Paphos"),
  d("KBP", "Kyiv", UA, UAF, "Kiev", "Boryspil"),
  d("IEV", "Kyiv", UA, UAF, "Kiev", "Zhuliany"),
  d("ODS", "Odesa", UA, UAF),
  d("MSQ", "Minsk", BY, BYF),
  d("SVO", "Moscow", RU, RUF, "Moscou", "Sheremetyevo"),
  d("DME", "Moscow", RU, RUF, "Moscou", "Domodedovo"),
  d("VKO", "Moscow", RU, RUF, "Moscou", "Vnukovo"),
  d("LED", "St. Petersburg", RU, RUF, "Saint-Pétersbourg"),
  d("TBS", "Tbilisi", GE, GEF),
  d("EVN", "Yerevan", AM, AMF),
  d("GYD", "Baku", AZ, AZF, "Bakou"),
  d("NQZ", "Astana", KZ, KZ),
  d("ALA", "Almaty", KZ, KZ),
  d("TAS", "Tashkent", UZ, UZF, "Tachkent"),

  d("DXB", "Dubai", AE, AEF, "Dubaï"),
  d("DWC", "Dubai", AE, AEF, "Dubaï", "Al Maktoum"),
  d("AUH", "Abu Dhabi", AE, AEF, "Abou Dabi"),
  d("SHJ", "Sharjah", AE, AEF, "Charjah"),
  d("DOH", "Doha", QA, QA, "Doha", "Hamad"),
  d("RUH", "Riyadh", SA, SAF, "Riyad"),
  d("JED", "Jeddah", SA, SAF, "Djeddah"),
  d("DMM", "Dammam", SA, SAF),
  d("MED", "Medina", SA, SAF, "Médine"),
  d("KWI", "Kuwait City", KW, KWF, "Koweït"),
  d("BAH", "Bahrain", BH, BHF, "Bahreïn"),
  d("MCT", "Muscat", OM, OM, "Mascate"),
  d("TLV", "Tel Aviv", IL, ILF, "Tel Aviv", "Ben Gurion"),
  d("AMM", "Amman", JO, JOF),
  d("BEY", "Beirut", LB, LBF, "Beyrouth"),
  d("CAI", "Cairo", EG, EGF, "Le Caire"),
  d("HRG", "Hurghada", EG, EGF),
  d("SSH", "Sharm El Sheikh", EG, EGF),
  d("LXR", "Luxor", EG, EGF, "Louxor"),
  d("CMN", "Casablanca", MA, MAF),
  d("RAK", "Marrakech", MA, MAF),
  d("AGA", "Agadir", MA, MAF),
  d("TNG", "Tangier", MA, MAF, "Tanger"),
  d("FEZ", "Fes", MA, MAF, "Fès"),
  d("RBA", "Rabat", MA, MAF),
  d("TUN", "Tunis", TN, TNF),
  d("DJE", "Djerba", TN, TNF),
  d("MIR", "Monastir", TN, TNF),
  d("ALG", "Algiers", DZ, DZF, "Alger"),
  d("ORN", "Oran", DZ, DZF),
  d("BGW", "Baghdad", IQ, IQ, "Bagdad"),
  d("EBL", "Erbil", IQ, IQ),
  d("IKA", "Tehran", IR, IR, "Téhéran"),
  d("KBL", "Kabul", AF, AF, "Kaboul"),

  d("JNB", "Johannesburg", ZA, ZAF),
  d("CPT", "Cape Town", ZA, ZAF, "Le Cap"),
  d("DUR", "Durban", ZA, ZAF),
  d("NBO", "Nairobi", KE, KE),
  d("MBA", "Mombasa", KE, KE),
  d("ADD", "Addis Ababa", ET, ETF, "Addis-Abeba"),
  d("DAR", "Dar es Salaam", TZ, TZF),
  d("JRO", "Kilimanjaro", TZ, TZF),
  d("ZNZ", "Zanzibar", TZ, TZF),
  d("EBB", "Entebbe", UG, UGF),
  d("KGL", "Kigali", RW, RW),
  d("LOS", "Lagos", NG, NGF),
  d("ABV", "Abuja", NG, NGF),
  d("ACC", "Accra", GH, GH),
  d("DSS", "Dakar", SN, SNF),
  d("ABJ", "Abidjan", CI, CI),
  d("MPM", "Maputo", MZ, MZ),
  d("WDH", "Windhoek", NA, NAF),
  d("GBE", "Gaborone", BW, BW),
  d("HRE", "Harare", ZW, ZW),
  d("LUN", "Lusaka", ZM, ZMF),
  d("MRU", "Port Louis", MU, MUF, "Port-Louis"),
  d("SEZ", "Mahé", SC, SC, "Mahé", "Seychelles"),
  d("RUN", "Saint-Denis", RE, RE),
  d("TNR", "Antananarivo", "Madagascar", "Madagascar"),
  d("SID", "Espargos", "Cape Verde", "Cap-Vert", "Espargos", "Sal"),

  d("DEL", "Delhi", IN, INF, "Delhi", "Indira Gandhi"),
  d("BOM", "Mumbai", IN, INF),
  d("BLR", "Bengaluru", IN, INF),
  d("MAA", "Chennai", IN, INF),
  d("HYD", "Hyderabad", IN, INF),
  d("CCU", "Kolkata", IN, INF),
  d("COK", "Kochi", IN, INF),
  d("GOI", "Goa", IN, INF, "Goa", "Dabolim"),
  d("GOX", "Goa", IN, INF, "Goa", "Mopa"),
  d("PNQ", "Pune", IN, INF),
  d("AMD", "Ahmedabad", IN, INF),
  d("JAI", "Jaipur", IN, INF),
  d("LKO", "Lucknow", IN, INF),
  d("TRV", "Thiruvananthapuram", IN, INF),
  d("GAU", "Guwahati", IN, INF),
  d("SXR", "Srinagar", IN, INF),
  d("ATQ", "Amritsar", IN, INF),
  d("IXC", "Chandigarh", IN, INF),
  d("VNS", "Varanasi", IN, INF),
  d("NAG", "Nagpur", IN, INF),
  d("CMB", "Colombo", LK, LKF),
  d("KTM", "Kathmandu", NP, NPF, "Katmandou"),
  d("DAC", "Dhaka", BD, BD, "Dacca"),
  d("KHI", "Karachi", PK, PK),
  d("LHE", "Lahore", PK, PK),
  d("ISB", "Islamabad", PK, PK),
  d("MLE", "Malé", MV, MVF, "Malé", "Velana", ["maldives"]),
  d("BKK", "Bangkok", TH, THF, "Bangkok", "Suvarnabhumi"),
  d("DMK", "Bangkok", TH, THF, "Bangkok", "Don Mueang"),
  d("HKT", "Phuket", TH, THF),
  d("CNX", "Chiang Mai", TH, THF),
  d("USM", "Koh Samui", TH, THF),
  d("UTP", "Pattaya", TH, THF, "Pattaya", "U-Tapao"),
  d("SGN", "Ho Chi Minh City", VN, VNF, "Hô Chi Minh-Ville"),
  d("HAN", "Hanoi", VN, VNF, "Hanoï"),
  d("DAD", "Da Nang", VN, VNF, "Đà Nẵng"),
  d("PNH", "Phnom Penh", KH, KHF),
  d("REP", "Siem Reap", KH, KHF),
  d("VTE", "Vientiane", LA, LA),
  d("RGN", "Yangon", MM, MM),
  d("KUL", "Kuala Lumpur", MY, MYF),
  d("PEN", "Penang", MY, MYF),
  d("BKI", "Kota Kinabalu", MY, MYF),
  d("SIN", "Singapore", SG, SGF, "Singapour", "Changi"),
  d("CGK", "Jakarta", ID, IDF),
  d("DPS", "Denpasar", ID, IDF, "Denpasar", "Ngurah Rai", ["bali"]),
  d("SUB", "Surabaya", ID, IDF),
  d("UPG", "Makassar", ID, IDF),
  d("LOP", "Praya", ID, IDF, "Praya", "Lombok"),
  d("MNL", "Manila", PH, PH, "Manille", "Ninoy Aquino"),
  d("CEB", "Cebu", PH, PH),
  d("CRK", "Clark", PH, PH, "Clark", "Diosdado Macapagal"),
  d("DVO", "Davao", PH, PH),
  d("BWN", "Bandar Seri Begawan", BN, BN),
  d("HKG", "Hong Kong", HK, HK),
  d("MFM", "Macau", MO, MOF, "Macao"),
  d("TPE", "Taipei", TW, TWF, "Taipei", "Taoyuan"),
  d("TSA", "Taipei", TW, TWF, "Taipei", "Songshan"),
  d("KHH", "Kaohsiung", TW, TWF),
  d("PEK", "Beijing", CN, CNF, "Pékin", "Capital"),
  d("PKX", "Beijing", CN, CNF, "Pékin", "Daxing"),
  d("PVG", "Shanghai", CN, CNF, "Shanghai", "Pudong"),
  d("SHA", "Shanghai", CN, CNF, "Shanghai", "Hongqiao"),
  d("CAN", "Guangzhou", CN, CNF),
  d("SZX", "Shenzhen", CN, CNF),
  d("CTU", "Chengdu", CN, CNF),
  d("TFU", "Chengdu", CN, CNF, "Chengdu", "Tianfu"),
  d("HGH", "Hangzhou", CN, CNF),
  d("XIY", "Xi'an", CN, CNF),
  d("CKG", "Chongqing", CN, CNF),
  d("WUH", "Wuhan", CN, CNF),
  d("CSX", "Changsha", CN, CNF),
  d("NKG", "Nanjing", CN, CNF),
  d("TAO", "Qingdao", CN, CNF),
  d("XMN", "Xiamen", CN, CNF),
  d("KMG", "Kunming", CN, CNF),
  d("URC", "Ürümqi", CN, CNF),
  d("HAK", "Haikou", CN, CNF),
  d("SYX", "Sanya", CN, CNF),
  d("ICN", "Seoul", KR, KRF, "Séoul", "Incheon"),
  d("GMP", "Seoul", KR, KRF, "Séoul", "Gimpo"),
  d("PUS", "Busan", KR, KRF, "Pusan"),
  d("CJU", "Jeju", KR, KRF),
  d("NRT", "Tokyo", JP, JPF, "Tokyo", "Narita", ["tyo", "tokyo"]),
  d("HND", "Tokyo", JP, JPF, "Tokyo", "Haneda", ["tyo", "tokyo"]),
  d("KIX", "Osaka", JP, JPF, "Osaka", "Kansai"),
  d("ITM", "Osaka", JP, JPF, "Osaka", "Itami"),
  d("NGO", "Nagoya", JP, JPF, "Nagoya", "Chubu"),
  d("FUK", "Fukuoka", JP, JPF),
  d("CTS", "Sapporo", JP, JPF, "Sapporo", "New Chitose"),
  d("OKA", "Naha", JP, JPF, "Naha", "Okinawa", ["okinawa"]),
  d("KOJ", "Kagoshima", JP, JPF),
  d("HIJ", "Hiroshima", JP, JPF),
  d("SDJ", "Sendai", JP, JPF),
  d("UBN", "Ulaanbaatar", MN, MNF, "Oulan-Bator"),

  d("SYD", "Sydney", AU, AUF),
  d("MEL", "Melbourne", AU, AUF),
  d("BNE", "Brisbane", AU, AUF),
  d("PER", "Perth", AU, AUF),
  d("ADL", "Adelaide", AU, AUF),
  d("OOL", "Gold Coast", AU, AUF),
  d("CNS", "Cairns", AU, AUF),
  d("HBA", "Hobart", AU, AUF),
  d("DRW", "Darwin", AU, AUF),
  d("CBR", "Canberra", AU, AUF),
  d("AKL", "Auckland", NZ, NZF),
  d("WLG", "Wellington", NZ, NZF),
  d("CHC", "Christchurch", NZ, NZF),
  d("ZQN", "Queenstown", NZ, NZF),
  d("NAN", "Nadi", FJ, FJF),
  d("SUV", "Suva", FJ, FJF),
  d("PPT", "Papeete", PF, PFF, "Papeete", "Faa'a", ["tahiti"]),
  d("NOU", "Nouméa", NC, NCF),
  d("APW", "Apia", WS, WS),
  d("TBU", "Nuku'alofa", TO, TO),
  d("POM", "Port Moresby", PG, PGF),
  d("GUM", "Guam", GU, GU, "Guam", "Antonio B. Won Pat"),
  d("SPN", "Saipan", MP, MPF),
  d("PPG", "Pago Pago", AS, ASF),
];
