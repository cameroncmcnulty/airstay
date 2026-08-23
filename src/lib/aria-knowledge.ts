export type Locale = "en" | "fr";

type Guide = {
  id: string;
  codes: string[];
  names: string[];
  tags: string[];
  region: string;
  en: string;
  fr: string;
};

type Topic = {
  id: string;
  tags: string[];
  en: string;
  fr: string;
};

const GUIDES: Guide[] = [
  {
    id: "cancun",
    codes: ["CUN"],
    names: ["cancun", "cancún", "riviera maya", "tulum", "playa del carmen", "isla mujeres"],
    tags: ["mexico", "beach", "sun", "all-inclusive", "winter", "caribbean", "reef", "family"],
    region: "Mexico · Caribbean coast",
    en: "Cancún / Riviera Maya: Canada’s winter default. Powder sand, reef snorkelling, easy all-inclusives, Isla Mujeres by ferry, Tulum ruins over the water. Peak Dec–March and March break. Hurricane watch roughly June–November. Directs from YYZ/YUL/YYC often ~4–5 hours. Couples who want quieter nights often slide down to Puerto Morelos or a adults-leaning resort.",
    fr: "Cancún / Riviera Maya : le classique soleil des Canadiens. Sable poudre, récif, tout-inclus faciles, ferry vers Isla Mujeres, ruines de Tulum. Haute saison déc.–mars et relâche. Ouragans surtout juin–novembre. Directs YYZ/YUL/YYC ~4–5 h.",
  },
  {
    id: "vallarta",
    codes: ["PVR"],
    names: ["puerto vallarta", "vallarta", "sayulita", "nuevo vallarta"],
    tags: ["mexico", "pacific", "couples", "malecón", "food", "sun"],
    region: "Mexico · Pacific",
    en: "Puerto Vallarta: Pacific, malecón sunsets, more soul than Cancún. Great for couples and food. Hills + old town + beach towns up the coast (Sayulita is a bounce). Directs from several Canadian cities in winter. Less reef, more bay. May–October is rainier; evenings stay warm.",
    fr: "Puerto Vallarta : Pacifique, malecón, plus d’âme que Cancún. Idéal couples et tables. Directs canadiens en hiver. Moins de récif, plus de baie. Mai–octobre plus humide.",
  },
  {
    id: "cabos",
    codes: ["SJD"],
    names: ["los cabos", "cabo", "san jose del cabo", "cabo san lucas"],
    tags: ["mexico", "desert", "luxury", "whales", "pacific", "couples"],
    region: "Mexico · Baja",
    en: "Los Cabos: desert-meets-sea, pricier, dramatic rock arches. Whale watching in winter. Corridor hotels vs Cabo San Lucas nightlife vs San José del Cabo art streets. Direct winter lifts from Canada. Bring reef-safe sunscreen and a layer for desert nights.",
    fr: "Los Cabos : désert et mer, un cran plus cher, arche emblématique. Baleines en hiver. Hôtels du corridor, soirées à Cabo San Lucas, ruelles d’art à San José.",
  },
  {
    id: "puntacana",
    codes: ["PUJ"],
    names: ["punta cana", "bavaro", "dominican", "cap cana"],
    tags: ["caribbean", "all-inclusive", "beach", "family", "sun", "dr"],
    region: "Dominican Republic",
    en: "Punta Cana: big-resort Caribbean. Beaches, buffet breakfasts, kids’ clubs. Santo Domingo is a culture day if you want colonial streets. Directs from YYZ/YUL are common. Hurricane season similar to the rest of the Atlantic basin. Ask for a room near the pool if mobility matters — these properties are huge.",
    fr: "Punta Cana : Caraïbes tout-inclus à grande échelle. Plages, clubs enfants. Saint-Domingue pour une journée coloniale. Directs YYZ/YUL fréquents.",
  },
  {
    id: "varadero",
    codes: ["VRA", "HAV"],
    names: ["varadero", "cuba", "havana", "la havane"],
    tags: ["cuba", "caribbean", "sun", "snowbird", "beach", "simple"],
    region: "Cuba",
    en: "Varadero: 20 km of beach, simple, popular with Canadian snowbirds. Havana is a different trip — music, crumbling glamour, a day or overnight. Check current entry and insurance rules; they change. Cash planning matters more here than in Mexico. Winter is prime.",
    fr: "Varadero : 20 km de plage, simple, chouchou des snowbirds. La Havane, c’est un autre voyage. Vérifiez les règles d’entrée et d’assurance — elles bougent. L’hiver est roi.",
  },
  {
    id: "jamaica",
    codes: ["MBJ"],
    names: ["jamaica", "jamaïque", "montego bay", "negril", "ocho rios"],
    tags: ["caribbean", "reggae", "all-inclusive", "couples", "beach"],
    region: "Jamaica",
    en: "Jamaica: Montego Bay is the usual Canadian gateway. Negril for seven-mile sunsets, Ocho Rios for families, quieter coves if you skip the biggest resorts. Jerk, waterfalls, reggae. Direct winter flights from YYZ/YUL. Use licensed taxis or hotel transfers after dark.",
    fr: "Jamaïque : Montego Bay est la porte d’entrée. Negril pour les couchers de soleil, Ocho Rios en famille. Vols d’hiver depuis YYZ/YUL.",
  },
  {
    id: "florida",
    codes: ["MIA", "FLL", "MCO", "TPA"],
    names: ["florida", "floride", "miami", "orlando", "fort lauderdale", "tampa", "disney"],
    tags: ["usa", "family", "theme park", "beach", "drive", "sun"],
    region: "United States · Florida",
    en: "Florida: Orlando for parks, Miami for vibe, Fort Lauderdale for a calmer beach + cruise port, Tampa/St. Pete for a drive-and-stay. Canadians can fly or road-trip. Shoulder (April–May, Sept–Oct) is kinder on queues and humidity. Parks need a plan; beaches need reef-safe lotion.",
    fr: "Floride : Orlando pour les parcs, Miami pour le rythme, Fort Lauderdale plus calme, Tampa en mode route. Les épaules avril–mai et sept.–oct. sont plus douces.",
  },
  {
    id: "vegas",
    codes: ["LAS"],
    names: ["vegas", "las vegas", "strip"],
    tags: ["usa", "nightlife", "shows", "weekend", "canyon"],
    region: "United States · Nevada",
    en: "Las Vegas: the Strip is a walkable spectacle; off-Strip is quieter and often better value. Shows, pools, a Grand Canyon day trip. Directs from major Canadian cities. Summer is furnace-hot — spring and fall feel human. Budget the resort fees; they show up at checkout.",
    fr: "Las Vegas : le Strip est un spectacle à pied; hors-Strip plus calme. Spectacles, piscines, Canyon en journée. L’été brûle — printemps et automne plus humains.",
  },
  {
    id: "nyc",
    codes: ["JFK", "EWR", "LGA"],
    names: ["new york", "nyc", "manhattan", "brooklyn"],
    tags: ["usa", "city", "broadway", "weekend", "food", "culture"],
    region: "United States · New York",
    en: "New York: JFK, Newark or LaGuardia — pick based on where you sleep. Walk neighbourhoods, Broadway, food. Shoulder seasons (April–June, Sept–Nov) beat August humidity and January wind. Subway + walking wins; a car is a headache in Manhattan.",
    fr: "New York : JFK, Newark ou LaGuardia selon le quartier. Broadway, bouffe, marches. Avril–juin et sept.–nov. battent l’humidité d’août et le vent de janvier.",
  },
  {
    id: "hawaii",
    codes: ["HNL", "OGG"],
    names: ["hawaii", "hawaï", "honolulu", "maui", "oahu", "kauai"],
    tags: ["usa", "pacific", "beach", "honeymoon", "islands"],
    region: "United States · Hawaiʻi",
    en: "Hawaiʻi: Oʻahu for city + beaches, Maui for honeymoon pace, Kauaʻi for green drama. From Canada you often connect on the West Coast; YVR is the kindest hop. Trade winds, reef-safe sunscreen (it’s the law on many islands), island-hopping if you have 10+ days.",
    fr: "Hawaï : Oʻahu ville et plages, Maui plus lune de miel, Kauaʻi verdoyant. YVR est le saut le plus doux. Crème récif-safe, alizés, saut d’île si vous avez 10+ jours.",
  },
  {
    id: "london",
    codes: ["LHR", "LGW", "LCY", "STN"],
    names: ["london", "londres", "england", "uk", "britain"],
    tags: ["europe", "city", "culture", "shoulder", "theatre"],
    region: "United Kingdom",
    en: "London: Heathrow is the long-haul default; Gatwick and City suit certain neighbourhoods. Contactless on the Tube. Theatre, parks, day trips to Bath, Oxford, the Cotswolds. Directs from YYZ/YUL/YVR. April–June and September–October are the sweet light. Pack a rain layer year-round.",
    fr: "Londres : Heathrow pour le long-courrier. Contactless dans le métro. Théâtre, parcs, Bath ou Oxford en journée. Directs YYZ/YUL/YVR. Avril–juin et sept.–oct. pour la lumière.",
  },
  {
    id: "paris",
    codes: ["CDG", "ORY"],
    names: ["paris", "france"],
    tags: ["europe", "city", "food", "museums", "romance"],
    region: "France",
    en: "Paris: CDG is the usual arrival; Orly can be closer to the Left Bank. Arrondissements each have a mood. Museum pass if you’ll queue-hop. August can be hot and half-shuttered; May and September glow. Walk, Metro, a day in Versailles or Champagne if you have the extra night.",
    fr: "Paris : CDG en général, Orly parfois plus près. Chaque arrondissement a son humeur. Mai et septembre rayonnent; août peut être chaud et calme.",
  },
  {
    id: "rome",
    codes: ["FCO"],
    names: ["rome", "italy", "italie", "amalfi", "florence"],
    tags: ["europe", "history", "food", "shoulder"],
    region: "Italy",
    en: "Rome: Fiumicino arrival, historic core on foot. Pair with Florence or a train to the coast if you have 10 days. Spring and fall beat August heat. Reservations for the big sites. Italians eat late; gelato is a food group.",
    fr: "Rome : Fiumicino, centre à pied. Florence ou la côte en train si vous avez 10 jours. Printemps et automne battent la chaleur d’août.",
  },
  {
    id: "barcelona",
    codes: ["BCN"],
    names: ["barcelona", "barcelone", "spain", "espagne"],
    tags: ["europe", "beach", "city", "gaudi", "food"],
    region: "Spain",
    en: "Barcelona: city + beach in one. Gaudí, tapas, late dinners. Shoulder seasons avoid the crush. Pickpocket-aware on La Rambla; neighbourhoods like Gràcia and Poblenou feel more local. Easy train to the Costa Brava or wine country.",
    fr: "Barcelone : ville et plage. Gaudí, tapas, dîners tardifs. Les épaules évitent la foule. Gràcia et Poblenou plus locaux.",
  },
  {
    id: "lisbon",
    codes: ["LIS", "OPO"],
    names: ["lisbon", "lisbonne", "porto", "portugal"],
    tags: ["europe", "value", "hills", "food", "azores"],
    region: "Portugal",
    en: "Lisbon & Porto: hills, trams, pastel de nata, kind prices from Canada. Sometimes via the Azores. Spring and fall are gorgeous; August is busy. Wear shoes with grip. Pair both cities by train if you have a week.",
    fr: "Lisbonne et Porto : collines, trams, pastéis, budget ami. Parfois via les Açores. Printemps et automne superbes. Les deux villes se relient en train.",
  },
  {
    id: "amsterdam",
    codes: ["AMS"],
    names: ["amsterdam", "netherlands", "holland"],
    tags: ["europe", "city", "bikes", "museums"],
    region: "Netherlands",
    en: "Amsterdam: Schiphol is a dream connection hub. Bikes, canals, museums. April tulips in the countryside. Pack for drizzle. Directs from YYZ. Great as a 4-night city or a launch pad to Belgium and Germany by train.",
    fr: "Amsterdam : Schiphol est un hub rêvé. Vélos, canaux, musées. Tulipes en avril. Directs YYZ. Idéal 4 nuits ou tremplin train vers la Belgique.",
  },
  {
    id: "tokyo",
    codes: ["NRT", "HND"],
    names: ["tokyo", "japan", "japon", "kyoto", "osaka", "osaka"],
    tags: ["asia", "sakura", "food", "trains", "culture", "cherry"],
    region: "Japan",
    en: "Japan: late March–April for sakura, November for maples, summer hot and festival-heavy. Haneda is closer to central Tokyo than Narita. Suica/Pasmo (or the phone wallet) for trains. Day trips: Hakone, Kamakura, Nikkō. Kyoto is the temple counterweight. West-coast departures (YVR) are kinder; 10–13 hours is typical.",
    fr: "Japon : fin mars–avril sakura, novembre érables, été chaud et festival. Haneda plus près du centre que Narita. Suica/Pasmo. Hakone, Kamakura, Nikkō en journée. YVR est le départ le plus doux.",
  },
  {
    id: "seoul",
    codes: ["ICN"],
    names: ["seoul", "séoul", "korea", "corée"],
    tags: ["asia", "food", "city", "kpop", "shopping"],
    region: "South Korea",
    en: "Seoul: Incheon is one of the world’s smoother airports. Palaces, K-food, nightlife in Hongdae, shopping in Myeongdong, a DMZ day if that’s your curiosity. Spring and fall are gold. Combine with Japan if you have two weeks.",
    fr: "Séoul : Incheon est un aéroport fluide. Palais, street food, Hongdae, Myeongdong. Printemps et automne en or. Combinable avec le Japon.",
  },
  {
    id: "bangkok",
    codes: ["BKK"],
    names: ["bangkok", "thailand", "thaïlande", "phuket", "chiang mai"],
    tags: ["asia", "value", "food", "temples", "islands"],
    region: "Thailand",
    en: "Bangkok: heat, temples, boats, some of the best eating on earth. Pair with Chiang Mai (north, cooler, temples) or islands (Phuket, Koh Samui) depending on beach vs culture. Canada–Thailand is a long haul — plan a lie-flat dream or a West Coast stop. Nov–Feb is the classic dry window for the south.",
    fr: "Bangkok : chaleur, temples, bateaux, tables incroyables. Chiang Mai au nord ou îles au sud. Nov.–fév. pour le sud au sec. Long-courrier depuis le Canada.",
  },
  {
    id: "mexico-city",
    codes: ["MEX"],
    names: ["mexico city", "cdmx", "mexico"],
    tags: ["mexico", "city", "food", "culture", "altitude"],
    region: "Mexico · Central",
    en: "Mexico City: high-altitude megalopolis, world-class food, museums, neighbourhoods (Roma, Condesa, Coyoacán). Not a beach trip. Directs from YYZ/YVR/YUL. Drink more water than you think; take day one slow. Street food is a joy if you follow busy stalls.",
    fr: "Mexico : métropole en altitude, tables mondiales, musées, Roma/Condesa/Coyoacán. Pas une plage. Directs YYZ/YVR/YUL. Ralentissez le jour 1.",
  },
  {
    id: "rockies",
    codes: ["YYC", "YVR"],
    names: ["banff", "lake louise", "jasper", "whistler", "rockies", "calgary stampede"],
    tags: ["canada", "mountains", "ski", "summer", "road"],
    region: "Canada · Rockies & West",
    en: "Canadian Rockies & West: Calgary for Banff/Lake Louise (and Stampede in July). Vancouver for ferries to the Island, spring cherry blossoms, Whistler as a mountain add-on. Summer hiking and winter skiing. Book parks and parking early in peak July–August.",
    fr: "Rocheuses et Ouest : Calgary pour Banff/Lake Louise (Stampede en juillet). Vancouver, traversiers, cerisiers au printemps, Whistler. Réservez parcs et stationnement en juillet–août.",
  },
  {
    id: "east-canada",
    codes: ["YHZ", "YYT", "YQB", "YYG"],
    names: ["halifax", "newfoundland", "quebec city", "charlottetown", "pei", "maritimes"],
    tags: ["canada", "east", "lobster", "coast", "fall"],
    region: "Canada · East",
    en: "East Coast Canada: Halifax as a hub, Newfoundland for drama and kindness, Québec City for stone walls and winter magic, PEI for beaches and red roads. September is chef’s-kiss. Drive if you can; distances look small and feel bigger.",
    fr: "Est du Canada : Halifax en hub, Terre-Neuve pour le grand large, Québec pour les fortifs, Î.-P.-É. pour les routes rouges. Septembre est parfait.",
  },
];

const TOPICS: Topic[] = [
  {
    id: "airstay",
    tags: ["airstay", "how", "fee", "frais", "booking", "compare", "cad", "canadian", "aria", "who"],
    en: "AIRSTAY is a Canadian site for flights, hotels and cars — priced in CAD, with no booking fee from us. Made by Canadians, for Canadians. Search here, then finish with the airline, hotel or car company you choose. Packages are coming soon. I’m Aria, your AI travel expert in the corner.",
    fr: "AIRSTAY, c’est un site canadien pour vols, hôtels et autos — en $ CA, sans frais de réservation de notre part. Par des Canadiens, pour des Canadiens. Vous cherchez ici, vous terminez chez la marque choisie. Les forfaits arrivent. Je suis Aria, l’experte voyage IA.",
  },
  {
    id: "seasons",
    tags: ["winter", "summer", "february", "march", "break", "hurricane", "shoulder", "best time", "quand", "saison", "février", "soleil"],
    en: "Canadian rhythm: winter (Dec–March) = sun (Mexico, Caribbean, Florida, Arizona, Vegas). March break books out first. Shoulder for Europe is April–June and September–October. Japan: sakura late March–April, maples in November. Atlantic hurricane watch ~June–November. July–August is Europe + Rockies + family Florida.",
    fr: "Rythme canadien : hiver = soleil (Mexique, Caraïbes, Floride). Relâche de mars part vite. Europe : avril–juin et sept.–oct. Japon : sakura fin mars–avril. Ouragans atlantiques ~juin–novembre.",
  },
  {
    id: "flights",
    tags: ["flight", "vol", "nonstop", "direct", "jet lag", "yyz", "yvr", "yul", "yyc", "duration"],
    en: "Typical times from Toronto: Cancún ~4.5h, London ~7h, Paris ~7.5h, Calgary ~4h, Vancouver ~5h, Tokyo ~13h (often via the west). Vancouver is kinder to Asia and Hawaiʻi. Montreal loves Paris and the sun. Eastbound jet lag is harder — morning light at destination, hydrate, skip the third movie.",
    fr: "Depuis Toronto : Cancún ~4,5 h, Londres ~7 h, Paris ~7,5 h, Tokyo ~13 h. Vancouver est plus doux pour l’Asie et Hawaï. Montréal aime Paris et le soleil. Le décalage vers l’est est plus dur — lumière du matin, hydratez-vous.",
  },
  {
    id: "visa",
    tags: ["visa", "passport", "passeport", "esta", "eta", "entry", "schengen"],
    en: "A valid Canadian passport is the foundation. Many sun destinations are visa-free for short trips, but rules move — always confirm on the official government site of the country you visit (travel.gc.ca is a good Canadian starting point). US travel: passport for flights; driving rules can differ. Schengen short stays are typically 90 days in 180 — not legal advice. I never invent a visa as a fact.",
    fr: "Passeport canadien valide, c’est la base. Beaucoup de destinations soleil sont sans visa pour un court séjour, mais les règles bougent — confirmez sur le site officiel (travel.gc.ca est un bon départ). Je n’invente jamais un visa.",
  },
  {
    id: "pack",
    tags: ["pack", "valise", "baggage", "bagage", "what to bring", "sunscreen"],
    en: "Carry-on core: meds, charger, battery pack, a layer for the plane, one nicer outfit. Winter-sun: reef-safe sunscreen, insect evening spray in the Caribbean, light sweater for aggressive AC. Europe spring: rain jacket. Universal adaptor. Kids: snacks, tablet downloaded, a spare shirt.",
    fr: "Cabine : médicaments, chargeur, batterie, une couche pour l’avion, une tenue un peu chic. Soleil d’hiver : crème récif-safe, anti-moustiques le soir, chandail pour la climatisation. Europe : coupe-vent. Adaptateur universel.",
  },
  {
    id: "money",
    tags: ["cad", "money", "argent", "fx", "tip", "currency", "dollar"],
    en: "AIRSTAY shows CAD. Cards with no foreign-fee are gold — tell your bank you’re travelling. A little local cash (or USD in parts of the Caribbean) as backup. All-inclusives still like tips in cash. Check whether the hotel quotes USD then converts.",
    fr: "AIRSTAY affiche en $ CA. Une carte sans frais de change, c’est de l’or. Un peu de cash local (ou $ US aux Caraïbes) en secours. Les tout-inclus aiment encore les pourboires en espèces.",
  },
  {
    id: "family",
    tags: ["kids", "family", "enfants", "family", "stroller", "bébé"],
    en: "Families: direct flights when you can, seats together, red-eyes sometimes work for toddlers who sleep. All-inclusives with kids’ clubs (Cancún, Punta Cana, Jamaica, Orlando) reduce dinner negotiations. Ask airlines about bassinets and hotels about cribs early.",
    fr: "Familles : directs si possible, sièges ensemble. Tout-inclus avec clubs enfants (Cancún, Punta Cana, Jamaïque, Orlando). Berceaux et nacelles : demandez tôt.",
  },
  {
    id: "safety",
    tags: ["safe", "safety", "sécurité", "danger"],
    en: "Neighbourhoods matter more than country stereotypes. Use hotel/official transfers after dark in new cities, keep a photo of your passport, don’t flash jewellery on the beach. Travel.gc.ca advisories are the official Canadian view. I’m cautious, not alarmist.",
    fr: "Le quartier compte plus que le cliché du pays. Transferts officiels le soir, photo du passeport, pas de bijoux à la plage. Les conseillers de travel.gc.ca font foi.",
  },
  {
    id: "cars",
    tags: ["car", "auto", "drive", "road trip", "insurance"],
    en: "Cars on AIRSTAY: search pick-up at the destination, compare, finish with the rental brand. International driving permits are sometimes asked outside North America. Photograph the car before you leave the lot. In Mexico and the Caribbean, prepaid full cover often saves an argument.",
    fr: "Autos sur AIRSTAY : cherchez la prise en charge à destination, comparez, terminez chez le loueur. Photo du véhicule avant de partir. Couverture complète prépayée utile au Mexique et aux Caraïbes.",
  },
  {
    id: "hotels",
    tags: ["hotel", "hôtel", "resort", "all-inclusive", "tout-inclus", "stay"],
    en: "Hotels: beach resorts vs city boutique vs apartment-with-kitchen. All-inclusive shines for families and first-time sun. City trips often eat better (and cheaper) outside the hotel. Check location on the map, not just the star rating. AIRSTAY never adds a booking fee.",
    fr: "Hôtels : complexe plage, boutique en ville, ou appart avec cuisine. Le tout-inclus brille en famille. En ville, on mange souvent mieux dehors. Regardez la carte, pas seulement les étoiles.",
  },
];

function tokens(q: string) {
  return q
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .split(/[^a-z0-9+]+/)
    .filter((w) => w.length > 1);
}

function score(hay: string[], qTokens: string[]) {
  let n = 0;
  for (const t of qTokens) {
    if (hay.some((h) => h === t || h.includes(t) || t.includes(h))) n += 1;
  }
  return n;
}

export function retrieveGuides(message: string, limit = 3): Guide[] {
  const q = tokens(message);
  return GUIDES.map((g) => ({
    g,
    s: score([...g.codes.map((c) => c.toLowerCase()), ...g.names, ...g.tags, g.region.toLowerCase()], q),
  }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s)
    .slice(0, limit)
    .map((x) => x.g);
}

export function retrieveTopics(message: string): Topic[] {
  const q = tokens(message);
  return TOPICS.map((t) => ({ t, s: score(t.tags, q) }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s)
    .slice(0, 3)
    .map((x) => x.t);
}

export function knowledgeBlock(message: string, locale: Locale) {
  const guides = retrieveGuides(message);
  const topics = retrieveTopics(message);
  const lang = locale === "fr" ? "fr" : "en";
  const bits: string[] = [];
  for (const g of guides) bits.push(`[${g.region} · ${g.codes.join("/")}] ${g[lang]}`);
  for (const t of topics) bits.push(`[${t.id}] ${t[lang]}`);
  return bits.join("\n");
}

export function fallbackAria(message: string, locale: Locale) {
  const fr = locale === "fr";
  const guides = retrieveGuides(message, 2);
  const topics = retrieveTopics(message);
  const parts: string[] = [];
  if (guides.length) parts.push(guides.map((g) => (fr ? g.fr : g.en)).join("\n\n"));
  const extra = topics.filter((t) => t.id !== "airstay" || !guides.length);
  if (extra.length) parts.push(extra.map((t) => (fr ? t.fr : t.en)).join("\n\n"));
  if (!parts.length) {
    return fr
      ? "Je suis Aria, l’experte voyage IA d’AIRSTAY. Parle-moi d’une ville, d’une saison, d’un budget ou d’un « j’ai besoin de chaleur ». On cherche en $ CA, sans frais de réservation de notre part. Où est-ce qu’on vise ?"
      : "I’m Aria, AIRSTAY’s AI travel expert. Throw me a city, a season, a budget, or a ‘I just need heat.’ We search in CAD, with no booking fee from us. Where are we aiming?";
  }
  const closer = fr
    ? "Tu veux que je t’oriente vols, hôtel ou auto — ou on affine la vibe ?"
    : "Want me to point you at flights, a stay, or a car — or shall we sharpen the vibe?";
  return `${parts.join("\n\n")}\n\n${closer}`;
}

export const GEO_CHEATSHEET = `GEO FROM CANADA (typical, not live ATC)
- Toronto (YYZ/YTZ) Eastern. Montreal (YUL) Eastern. Ottawa (YOW) Eastern. Halifax (YHZ) Atlantic. St. John's (YYT) Newfoundland (UTC−3:30). Winnipeg (YWG) Central. Calgary/Edmonton Mountain. Vancouver (YVR) Pacific.
- Mexico Caribbean (Cancún) usually Eastern-like in winter; Mexico Pacific often Mountain. UK 4–5h ahead of Toronto depending on DST. Japan 13–14h ahead of Toronto.
- Flight feel: sun dests 4–6h from central Canada; London/Paris ~7h from YYZ/YUL; West Coast–Tokyo overnight; East Coast–Asia is a two-step.
- Continents: North America, Caribbean basin, Europe, East Asia, Southeast Asia, South America (Cartagena, Lima, Rio — longer, often 1-stop).
- Hurricane Atlantic: ~1 June–30 Nov, peak Aug–Oct. Pacific Mexico rainier summer. Europe August holidays. Japanese rainy season ~June, typhoons late summer.
Always treat live weather, strikes and visa pages as authority over this sheet.`;
