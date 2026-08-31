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
  {
    id: "costarica",
    codes: ["SJO", "LIR"],
    names: ["costa rica", "san jose", "liberia", "tamarindo", "la fortuna", "manuel antonio"],
    tags: ["central america", "adventure", "nature", "wildlife", "pura vida"],
    region: "Costa Rica",
    en: "Costa Rica: pura vida, rainforests, sloths, volcanoes, Pacific and Caribbean coasts. Liberia (LIR) is closer to Guanacaste beaches; San José (SJO) for the centre and La Fortuna. Green season is May–November — lush, fewer crowds, afternoon showers. Directs from YYZ/YUL in high season. Pair a rainforest lodge with a beach tail.",
    fr: "Costa Rica : forêts, paresseux, volcans, deux océans. Liberia plus près des plages Guanacaste, San José pour le centre. Saison verte mai–nov. Directs YYZ/YUL en haute saison.",
  },
  {
    id: "cartagena",
    codes: ["CTG", "BOG"],
    names: ["cartagena", "colombia", "colombie", "bogota", "medellin"],
    tags: ["south america", "caribbean", "colonial", "food", "salsa"],
    region: "Colombia",
    en: "Cartagena: walled old town, heat, colour, Caribbean evenings. Bogotá is altitude and museums; Medellín is spring-forever and hills. Canada usually connects once. Pack light linen. Old-town hotels beat the high-rises if you want atmosphere.",
    fr: "Carthagène : vieille ville fortifiée, chaleur, couleur. Bogotá en altitude, Medellín au printemps éternel. Un stop depuis le Canada en général.",
  },
  {
    id: "bali",
    codes: ["DPS"],
    names: ["bali", "ubud", "canggu", "seminyak", "indonesia", "indonésie"],
    tags: ["asia", "island", "yoga", "honeymoon", "temples"],
    region: "Indonesia · Bali",
    en: "Bali: temples, rice terraces, surf towns, Ubud for green quiet. Long-haul from Canada — usually via Asia. Dry-ish April–October; rainy November–March still works if you pick lodging well. Scooter only if you’re confident. Reef-safe sunscreen.",
    fr: "Bali : temples, rizières, surf, Ubud au calme. Long-courrier via l’Asie. Plus sec avril–octobre. Scooter seulement si vous êtes à l’aise.",
  },
  {
    id: "iceland",
    codes: ["KEF"],
    names: ["iceland", "islande", "reykjavik", "blue lagoon", "golden circle"],
    tags: ["nordic", "nature", "aurora", "road", "summer"],
    region: "Iceland",
    en: "Iceland: Reykjavík as base, Golden Circle, south-coast waterfalls, summer midnight sun, winter northern lights. Directs from YYZ/YUL in season. Ring Road is a 7–10 day dream. Weather changes in ten minutes — layers, always. Book the famous lagoons ahead.",
    fr: "Islande : Reykjavík, Cercle d’or, côte sud. Soleil de minuit l’été, aurores l’hiver. Directs YYZ/YUL. La Route 1 en 7–10 jours. Couches, toujours.",
  },
  {
    id: "athens",
    codes: ["ATH"],
    names: ["athens", "athènes", "greece", "grèce", "santorini", "mykonos", "crete"],
    tags: ["europe", "islands", "history", "summer", "sea"],
    region: "Greece",
    en: "Athens: Acropolis at golden hour, then ferries to islands. Santorini for the postcard, Naxos or Milos if you want quieter. May–June and September beat August heat and prices. From Canada, often via Europe. Comfortable shoes — marble is slippery.",
    fr: "Athènes : Acropole au soleil rasant, puis ferries. Santorin pour la carte postale, Naxos ou Milos plus calmes. Mai–juin et septembre battent août.",
  },
  {
    id: "dubai",
    codes: ["DXB"],
    names: ["dubai", "dubaï", "uae", "abu dhabi"],
    tags: ["middle east", "hub", "luxury", "winter sun", "city"],
    region: "United Arab Emirates",
    en: "Dubai: winter sun (Nov–March), malls, desert, a stopover to Asia/Africa that can be the trip. Summer is brutal. Directs from YYZ. Dress codes are more relaxed than people fear, still modest in malls and mosques. Combine with Abu Dhabi if you have a spare day.",
    fr: "Dubaï : soleil d’hiver nov.–mars, désert, escale vers l’Asie. L’été brûle. Directs YYZ. Abu Dhabi si vous avez une journée.",
  },
  {
    id: "edinburgh",
    codes: ["EDI"],
    names: ["edinburgh", "édimbourg", "scotland", "écosse", "highlands"],
    tags: ["uk", "culture", "whisky", "festival", "castles"],
    region: "Scotland",
    en: "Edinburgh: castle, closes, August Festival madness, whisky, a launch pad to the Highlands. Cooler than you think even in July. Rain is a personality. Pair with Glasgow or a train to the west coast.",
    fr: "Édimbourg : château, ruelles, Festival en août, whisky, tremplin vers les Highlands. Plus frais qu’on croit. La pluie a du caractère.",
  },
  {
    id: "aruba",
    codes: ["AUA"],
    names: ["aruba", "oranjestad"],
    tags: ["caribbean", "beach", "outside hurricane", "dutch"],
    region: "Aruba",
    en: "Aruba: south of the hurricane belt, trade-wind beaches, easy English/Dutch vibe. A Canadian winter favourite when you want reliability. Directs in season from YYZ. Drier and windier than Jamaica. Good for first-time Caribbean.",
    fr: "Aruba : hors ceinture des ouragans, alizés, plages faciles. Chouchou d’hiver fiable. Directs YYZ en saison.",
  },
  {
    id: "chicago",
    codes: ["ORD", "MDW"],
    names: ["chicago", "illinois"],
    tags: ["usa", "city", "food", "architecture", "weekend"],
    region: "United States · Midwest",
    en: "Chicago: architecture river cruise, neighbourhood food, lake in summer, serious winters. Directs from most Canadian hubs. Shoulder spring and fall are the sweet spot. Walkable downtown; the L is easy.",
    fr: "Chicago : architecture, tables de quartier, lac l’été. Directs depuis les hubs canadiens. Printemps et automne en or.",
  },
  {
    id: "la",
    codes: ["LAX", "BUR", "SNA"],
    names: ["los angeles", "la", "santa monica", "hollywood", "california"],
    tags: ["usa", "city", "beach", "road", "weekend", "california"],
    region: "United States · California",
    en: "Los Angeles: sprawl with a payoff — Santa Monica/Venice for beach, Griffith for the view, tacos everywhere. LAX is a trek; give it time. Rent a car or pick one neighbourhood and stay. Spring and fall beat August heat. Pair with San Diego or Palm Springs if you have extra days.",
    fr: "Los Angeles : Santa Monica/Venice, Griffith, tacos. LAX prend du temps. Une auto, ou un quartier et on reste. Printemps et automne battent août. San Diego ou Palm Springs en extra.",
  },
  {
    id: "sanfrancisco",
    codes: ["SFO", "OAK"],
    names: ["san francisco", "sf", "bay area", "napa"],
    tags: ["usa", "city", "fog", "food", "weekend", "california"],
    region: "United States · Bay Area",
    en: "San Francisco: hills, fog, food, a jacket in July. Directs from YVR/YYZ. Walk + transit beats driving downtown. Napa/Sonoma or Big Sur if you have a car and two extra nights. Summer can be the coldest ‘summer’ Canadians ever packed for.",
    fr: "San Francisco : collines, brouillard, tables. Directs YVR/YYZ. Marche + transit. Napa ou Big Sur si vous avez une auto. Juillet peut demander une veste.",
  },
  {
    id: "sandiego",
    codes: ["SAN"],
    names: ["san diego", "la jolla", "coronado"],
    tags: ["usa", "beach", "california", "family", "mild"],
    region: "United States · San Diego",
    en: "San Diego: the easy California. Beaches, zoo, tacos, almost-always-nice weather. Great with kids. Directs from several Canadian cities. Skip a car if you stay near the water and use the trolley; rent one for La Jolla to Coronado hopping.",
    fr: "San Diego : la Californie facile. Plages, zoo, tacos, climat doux. Super en famille. Auto utile pour sauter d’une plage à l’autre.",
  },
  {
    id: "phoenix",
    codes: ["PHX", "PSP"],
    names: ["phoenix", "scottsdale", "palm springs", "arizona", "desert"],
    tags: ["usa", "sun", "winter", "golf", "desert", "spa"],
    region: "United States · Desert Southwest",
    en: "Phoenix/Scottsdale and Palm Springs: winter-sun for Canadians who want dry heat, pools, golf, cactus sunsets. Directs in season. Summer is a furnace — go Nov–April. Hydrate, SPF, a hat. A car makes the desert actually usable.",
    fr: "Phoenix/Scottsdale et Palm Springs : soleil d’hiver sec, piscines, golf. Directs en saison. L’été brûle — nov.–avril. Auto utile. Hydratez-vous.",
  },
  {
    id: "seattle",
    codes: ["SEA"],
    names: ["seattle", "washington", "pike place"],
    tags: ["usa", "city", "coffee", "weekend", "pacific"],
    region: "United States · Pacific Northwest",
    en: "Seattle: coffee, Pike Place, ferries, mountains on a clear day. Easy hop from YVR (even the train). Pack layers; drizzle is a personality. Great 3-night city with a day on the water.",
    fr: "Seattle : café, Pike Place, traversiers. Hop facile depuis YVR. Couches — la bruine a du caractère. Idéal 3 nuits.",
  },
  {
    id: "boston",
    codes: ["BOS"],
    names: ["boston", "new england", "massachusetts"],
    tags: ["usa", "city", "history", "fall", "weekend", "food"],
    region: "United States · New England",
    en: "Boston: walkable history, Fenway, oysters, fall colour in New England. Directs from YYZ/YUL. October is chef’s-kiss. A car only if you’re leaving the city for Maine or Vermont.",
    fr: "Boston : histoire à pied, Fenway, huîtres, couleurs d’octobre. Directs YYZ/YUL. Auto seulement pour le Maine ou le Vermont.",
  },
  {
    id: "nashville",
    codes: ["BNA"],
    names: ["nashville", "tennessee", "music city"],
    tags: ["usa", "music", "weekend", "food", "honkytonk"],
    region: "United States · Nashville",
    en: "Nashville: live music that isn’t a tourist trap if you wander off Broadway, hot chicken, a fun long weekend from Toronto. Directs. Comfortable shoes — you’ll stand more than you sit. Skip August humidity if you can.",
    fr: "Nashville : musique live, poulet piquant, belle fin de semaine depuis Toronto. Directs. Chaussures confort. Évitez l’humidité d’août.",
  },
  {
    id: "neworleans",
    codes: ["MSY"],
    names: ["new orleans", "nola", "louisiana"],
    tags: ["usa", "food", "music", "weekend", "culture"],
    region: "United States · New Orleans",
    en: "New Orleans: food as a personality, brass in the street, a slower stroll than you’d think. Directs from some Canadian hubs. Shoulder seasons beat summer storms. The French Quarter is a scene; Garden District and Bywater have the soul.",
    fr: "Nouvelle-Orléans : bouffe, cuivres, flânerie. Les épaules battent les orages d’été. French Quarter pour le spectacle, Garden District pour l’âme.",
  },
  {
    id: "dublin",
    codes: ["DUB"],
    names: ["dublin", "ireland", "irlande", "galway", "cork"],
    tags: ["europe", "pub", "green", "shoulder", "friendly"],
    region: "Ireland",
    en: "Dublin: pints, literature, a launch pad to the west coast and Cliffs of Moher. Directs from YYZ/YUL in season. Pack rain as a lifestyle. May–June and September are kinder. A car for the countryside; the city is walk + bus.",
    fr: "Dublin : pintes, lettres, tremplin vers l’ouest. Directs YYZ/YUL. La pluie est un mode de vie. Mai–juin et septembre plus doux. Auto pour la campagne.",
  },
  {
    id: "berlin",
    codes: ["BER"],
    names: ["berlin", "germany", "allemagne"],
    tags: ["europe", "city", "history", "nightlife", "value"],
    region: "Germany",
    en: "Berlin: history you can walk, nightlife that starts late, value vs Paris. Directs or one-stop from Canada. Summer is festival season; Christmas markets in December. Transit is excellent — skip the car. Pair with Prague or a train to Munich if you have 10 days.",
    fr: "Berlin : histoire à pied, nuits tardives, meilleur rapport que Paris. Transit excellent. Marchés de Noël en décembre. Prague ou Munich en train si vous avez 10 jours.",
  },
  {
    id: "madrid",
    codes: ["MAD"],
    names: ["madrid", "spain", "espagne", "toledo"],
    tags: ["europe", "city", "food", "art", "late"],
    region: "Spain · Madrid",
    en: "Madrid: art (Prado/Reina Sofía), late dinners, a more Spanish Spain than Barcelona’s postcard. Hot in August; May and October glow. Day trip to Toledo or Segovia. Easy high-speed to the rest of the country.",
    fr: "Madrid : musées, dîners tardifs, l’Espagne de l’intérieur. Août brûle; mai et octobre rayonnent. Tolède ou Ségovie en journée.",
  },
  {
    id: "prague",
    codes: ["PRG"],
    names: ["prague", "prague", "czech", "tchèquie"],
    tags: ["europe", "city", "value", "architecture", "beer"],
    region: "Czechia",
    en: "Prague: fairy-tale core, serious beer, kinder prices than Western Europe. One-stop from Canada. Christmas and Easter are magic and crowded. Walk the castle at opening time. Pickpockets on Charles Bridge — zippers, not paranoia.",
    fr: "Prague : cœur de conte, bière, prix plus doux. Noël et Pâques magiques et bondés. Le pont Charles, fermetures éclair, pas de panique.",
  },
  {
    id: "vienna",
    codes: ["VIE"],
    names: ["vienna", "vienne", "austria", "autriche"],
    tags: ["europe", "city", "cafe", "music", "christmas"],
    region: "Austria",
    en: "Vienna: cafés, palaces, music, Christmas markets that actually deliver. One-stop from Canada. Shoulder spring and late fall. Day trip to Bratislava or a train to Budapest. Dress a notch nicer for the opera — even the standing room.",
    fr: "Vienne : cafés, palais, musique, marchés de Noël. Printemps et fin d’automne. Bratislava ou Budapest en train. Un cran plus chic pour l’opéra.",
  },
  {
    id: "copenhagen",
    codes: ["CPH"],
    names: ["copenhagen", "copenhague", "denmark", "danemark"],
    tags: ["europe", "design", "bikes", "hygge", "food"],
    region: "Denmark",
    en: "Copenhagen: bikes, design, cardamom buns, hygge that isn’t a cliché when it rains. Summer has light for days; winter is candle season. Walk + bike + metro. Pair with a Swedish train hop if you’re curious.",
    fr: "Copenhague : vélos, design, brioches, hygge quand il pleut. Lumière l’été, bougies l’hiver. Marche + vélo + métro.",
  },
  {
    id: "singapore",
    codes: ["SIN"],
    names: ["singapore", "singapour"],
    tags: ["asia", "hub", "food", "clean", "stopover"],
    region: "Singapore",
    en: "Singapore: the world’s most useful long-haul pause — hawker food, gardens, a pool on a roof. Hot and humid always. Changi is a destination. Great 3-night stop between Canada and Australia/Bali. Tap water’s fine; chilli is a food group.",
    fr: "Singapour : la pause long-courrier parfaite — hawker, jardins, piscine sur le toit. Chaud toujours. Changi est une destination. 3 nuits vers l’Australie ou Bali.",
  },
  {
    id: "hongkong",
    codes: ["HKG"],
    names: ["hong kong", "hongkong"],
    tags: ["asia", "city", "food", "skyline", "stopover"],
    region: "Hong Kong",
    en: "Hong Kong: skyline ferry, dim sum, hikes above the towers. A vivid 4-night city or a stop toward Southeast Asia. MTR is a dream. Summer is muggy; Nov–March is the window. Check current entry rules — they move.",
    fr: "Hong Kong : traversier, dim sum, rando au-dessus des tours. 4 nuits ou escale vers l’Asie du Sud-Est. Nov.–mars plus doux. Vérifiez l’entrée — ça bouge.",
  },
  {
    id: "sydney",
    codes: ["SYD", "MEL"],
    names: ["sydney", "australia", "australie", "melbourne"],
    tags: ["oceania", "longhaul", "beach", "city", "coffee"],
    region: "Australia",
    en: "Sydney: harbour, beaches, a long-haul from Canada (usually via the Pacific). Melbourne is the food-and-culture sibling. Canadian winter = their summer — December–February is peak beach. Jet lag is real; plan a quiet day one. YVR is the kinder hop.",
    fr: "Sydney : baie, plages, long-courrier (souvent via le Pacifique). Melbourne pour la bouffe. Notre hiver = leur été. YVR est le saut le plus doux. Jour 1 calme pour le décalage.",
  },
  {
    id: "auckland",
    codes: ["AKL"],
    names: ["auckland", "new zealand", "nouvelle-zélande", "queenstown", "wellington"],
    tags: ["oceania", "nature", "road", "longhaul", "adventure"],
    region: "New Zealand",
    en: "New Zealand: Auckland as gateway, then a campervan or flights to Wellington/Queenstown. Lord-of-the-Rings landscapes, serious coffee, changeable weather. Their summer is our winter. Two islands, two weeks if you can. Drive on the left.",
    fr: "Nouvelle-Zélande : Auckland en porte, puis van ou vols vers Wellington/Queenstown. Paysages, café, météo changeante. Leur été = notre hiver. Deux îles, deux semaines. Conduite à gauche.",
  },
  {
    id: "lima",
    codes: ["LIM", "CUZ"],
    names: ["lima", "peru", "pérou", "cusco", "machu picchu"],
    tags: ["south america", "food", "andes", "altitude", "culture"],
    region: "Peru",
    en: "Lima: one of the world’s great food cities, then Andes if you’re going to Cusco/Machu Picchu. Altitude is not a personality test — slow day one in Cusco, coca tea, hydrate. Canada usually one-stops. Shoulder April–May and Sept–Oct.",
    fr: "Lima : l’une des grandes tables du monde, puis les Andes. L’altitude, on y va doucement. Un stop depuis le Canada. Épaules avril–mai et sept.–oct.",
  },
  {
    id: "riodejaneiro",
    codes: ["GIG", "GRU"],
    names: ["rio", "rio de janeiro", "brazil", "brésil", "sao paulo"],
    tags: ["south america", "beach", "carnival", "city", "music"],
    region: "Brazil",
    en: "Rio: beaches, hills, music, Carnival if you book early. São Paulo is the food-and-business giant. Canada is a long one-stop. Portuguese helps; smiles help more. Use official taxis/apps. Southern summer is Dec–March.",
    fr: "Rio : plages, collines, musique, Carnaval si vous réservez tôt. São Paulo pour la table. Un long stop depuis le Canada. Taxis officiels.",
  },
  {
    id: "marrakech",
    codes: ["RAK", "CMN"],
    names: ["marrakech", "morocco", "maroc", "casablanca", "fez"],
    tags: ["africa", "medina", "food", "desert", "culture"],
    region: "Morocco",
    en: "Marrakech: riads, souks, orange-blossom nights, a launch to the Atlas or the desert. Modest dress in medinas. Spring and fall beat summer heat. Canada one-stops via Europe. Bargain with humour; drink bottled water.",
    fr: "Marrakech : riads, souks, nuits à la fleur d’oranger. Printemps et automne. Un stop via l’Europe. Eau embouteillée, marchandage avec le sourire.",
  },
  {
    id: "capetown",
    codes: ["CPT", "JNB"],
    names: ["cape town", "south africa", "afrique du sud", "johannesburg", "kruger"],
    tags: ["africa", "wine", "nature", "longhaul", "safari"],
    region: "South Africa",
    en: "Cape Town: mountain, two oceans, wine, a safari add-on via Johannesburg or a nearby reserve. Long-haul from Canada. Their summer is our winter. Load a maps offline copy; load official safety notes from travel.gc.ca. Wine country needs a designated driver — or a tour.",
    fr: "Le Cap : montagne, deux océans, vin, safari en extra. Long-courrier. Leur été = notre hiver. Notes de travel.gc.ca. Le vignoble se fait en tournée.",
  },
  {
    id: "cairo",
    codes: ["CAI"],
    names: ["cairo", "egypt", "égypte", "luxor", "giza"],
    tags: ["africa", "history", "nile", "culture", "heat"],
    region: "Egypt",
    en: "Cairo: Giza at opening time, museum, then a Nile hop to Luxor if you can. Heat is a character in summer. Licensed guides beat hustle. Modest dress at religious sites. Confirm entry rules; they move. Shoulder Nov–Feb is the classic.",
    fr: "Le Caire : Gizeh à l’ouverture, musée, puis Louxor si possible. L’été brûle. Guides licenciés. Nov.–fév. classique. Vérifiez l’entrée.",
  },
  {
    id: "istanbul",
    codes: ["IST", "SAW"],
    names: ["istanbul", "turkey", "türkiye", "turquie"],
    tags: ["europe", "asia", "food", "history", "hub"],
    region: "Türkiye",
    en: "Istanbul: two continents, breakfast that lasts, bazaars, a hub that can be the trip. Directs or one-stop from Canada. Shoulder April–June and September. Tram + ferry > taxi in traffic. Modest dress for mosques (shawls are often lent).",
    fr: "Istanbul : deux continents, petit-déj. de roi, bazars. Épaules avril–juin et septembre. Tram + traversier. Tenue plus couverte pour les mosquées.",
  },
  {
    id: "saigon",
    codes: ["SGN", "HAN"],
    names: ["ho chi minh", "saigon", "vietnam", "hanoi", "hanoï"],
    tags: ["asia", "food", "value", "culture", "scooter"],
    region: "Vietnam",
    en: "Vietnam: Hanoi for character, Hoi An for lanterns, Saigon for energy, the food will ruin you for sandwiches at home. Long-haul from Canada. Shoulder travel beats peak heat and rain depending on north vs south (seasons flip). Grab an eSIM before you land.",
    fr: "Vietnam : Hanoï du caractère, Hoi An des lanternes, Saigon du rythme. La bouffe gâche les sandwichs d’ici. Long-courrier. Une eSIM avant d’atterrir.",
  },
  {
    id: "manila",
    codes: ["MNL"],
    names: ["manila", "manille", "philippines", "cebu", "palawan"],
    tags: ["asia", "islands", "family", "beach", "value"],
    region: "Philippines",
    en: "Manila: the gateway; the trip is islands (Cebu, Palawan, Boracay). Direct-ish long-hauls from YVR sometimes. Traffic in Manila is a boss fight — land and connect same day if you can. Typhoon watch roughly June–November.",
    fr: "Manille : la porte; le voyage, ce sont les îles (Cebu, Palawan). Trafic de boss final — correspondance le jour même si possible. Typhons ~juin–nov.",
  },
  {
    id: "delhi",
    codes: ["DEL", "BOM"],
    names: ["delhi", "india", "inde", "mumbai", "jaipur", "goa"],
    tags: ["asia", "culture", "food", "colour", "longhaul"],
    region: "India",
    en: "Delhi: chaos with a heartbeat, a Golden Triangle with Jaipur and Agra if it’s a first trip. Mumbai is the movie. Long-haul from Canada. Stomach caution is not snobbery; bottled water, busy stalls. Oct–March is the classic north India window.",
    fr: "Delhi : chaos vivant, Triangle d’or avec Jaipur et Agra. Mumbai pour le cinéma. Long-courrier. Eau embouteillée. Oct.–mars pour le nord.",
  },
  {
    id: "nassau",
    codes: ["NAS", "BGI", "SXM", "CUR"],
    names: ["bahamas", "nassau", "barbados", "st maarten", "curacao", "caribbean"],
    tags: ["caribbean", "beach", "island", "sun", "winter"],
    region: "Caribbean islands",
    en: "Island-hop thinking: Bahamas for a quick hop from the east, Barbados for a polished Caribbean, Curaçao/Aruba south of the hurricane belt, St. Maarten if you like a split-island day. Directs vary by season from YYZ/YUL. Reef-safe sunscreen; cash for taxis.",
    fr: "Îles : Bahamas en hop rapide, Barbade plus chic, Curaçao/Aruba hors ouragans. Directs selon la saison depuis YYZ/YUL.",
  },
  {
    id: "belize",
    codes: ["BZE", "PTY"],
    names: ["belize", "panama", "panama city", "bocas", "ambergris"],
    tags: ["central america", "reef", "jungle", "canal", "adventure"],
    region: "Central America · Belize & Panama",
    en: "Belize: reef, jungle, English spoken, a calmer Caribbean. Panama: canal, Casco Viejo, a hub to South America, Bocas if you want hammocks. Both are one-stop from most of Canada. Pack reef-safe lotion and bug spray for dusk.",
    fr: "Belize : récif, jungle, anglais parlé. Panama : canal, Casco Viejo, hub vers le sud. Un stop depuis le Canada. Crème récif-safe et anti-moustiques.",
  },
  {
    id: "montreal",
    codes: ["YUL", "YQB"],
    names: ["montreal", "montréal", "quebec city", "québec"],
    tags: ["canada", "city", "food", "festival", "winter", "weekend"],
    region: "Canada · Quebec",
    en: "Montréal: terrasses, festivals, the mountain, a European weekend without the jet lag. Québec City for stone walls and winter magic. Summer is alive; February is carnival and poutine as survival. Fly or train from Toronto. Pack a real winter coat if it’s actually winter.",
    fr: "Montréal : terrasses, festivals, la montagne. Québec pour les fortifs et l’hiver magique. Train depuis Toronto. Vrai manteau si c’est vraiment l’hiver.",
  },
];

const TOPICS: Topic[] = [
  {
    id: "airstay",
    tags: ["airstay", "how", "fee", "frais", "booking", "compare", "cad", "canadian", "aria", "who"],
    en: "AIRSTAY is a Canadian site for flights, hotels, cars and eSIMs — priced in CAD, with no booking fee from us. Made by Canadians, for Canadians. Search here, then finish with the airline, hotel, car company or eSIM brand you choose. Hand-picked AIRSTAY packages are coming soon; until then, partner vacation packages live on /packages. I’m Aria, your AI travel expert in the corner.",
    fr: "AIRSTAY, c’est un site canadien pour vols, hôtels, autos et eSIMs — en $ CA, sans frais de réservation de notre part. Par des Canadiens, pour des Canadiens. Vous cherchez ici, vous terminez chez la marque choisie. Les forfaits AIRSTAY arrivent; en attendant, les forfaits partenaires sont sur /packages. Je suis Aria, l’experte voyage IA.",
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
  {
    id: "chat",
    tags: ["hello", "hi", "hey", "salut", "thanks", "merci", "bye", "who", "joke", "bored", "help", "hola"],
    en: "I’m Aria — AIRSTAY’s AI travel expert. I can chat, then get you moving: beaches, cities, packing, visas at a high level, or how this site works. Point me at a vibe and I’ll open the right search.",
    fr: "Je suis Aria — experte voyage IA d’AIRSTAY. On peut jaser, puis avancer : plages, villes, valise, visas en gros, ou comment le site marche. Donnez-moi une vibe, j’ouvre la bonne recherche.",
  },
  {
    id: "budget",
    tags: ["budget", "cheap", "afford", "pas cher", "save", "économique", "deal"],
    en: "Stretch CAD: fly mid-week, shoulder seasons, one checked bag, kitchens in cities, all-inclusive when you’d eat out three times a day anyway. Lisbon, Mexico City, Varadero, and Puerto Vallarta usually play nicer than Paris or Cabos. AIRSTAY never adds a booking fee — compare, then pick.",
    fr: "Faire durer le $ CA : milieu de semaine, épaules de saison, une valise, cuisine en ville. Lisbonne, Mexico, Varadero, Vallarta plus doux que Paris ou Cabos. Aucun frais AIRSTAY.",
  },
  {
    id: "romance",
    tags: ["romantic", "honeymoon", "couple", "anniversary", "lune de miel", "amoureux"],
    en: "Couples: Vallarta and Cabos for Pacific sunsets, Paris or Lisbon for walking dinners, Kyoto in November, Bali if you have the long-haul appetite. Skip mega kids’ clubs. Book the dinner with a view on night two, not night one — you’ll be wrecked.",
    fr: "Couples : Vallarta et Cabos pour le Pacifique, Paris ou Lisbonne à pied, Kyoto en novembre, Bali si le long-courrier passe. Le dîner vue mer, soir 2, pas soir 1.",
  },
  {
    id: "food",
    tags: ["food", "eat", "restaurant", "cuisine", "bouffe", "wine", "coffee"],
    en: "Eat-first trips: Mexico City, Tokyo, Paris, Bangkok, Montreal (staycation energy), Lima if you’ll go farther. Book one splashy table; wander the rest. Markets in the morning beat a ‘food tour’ if you like wandering.",
    fr: "Voyages-goût : Mexico, Tokyo, Paris, Bangkok, Montréal, Lima plus loin. Une belle table, le reste en flânant. Les marchés le matin battent souvent le food tour.",
  },
  {
    id: "weekend",
    tags: ["weekend", "short", "3 days", "quick", "getaway", "escapade"],
    en: "Canadian long-weekends that work: NYC, Chicago, Montreal, Quebec City, Chicago, Vegas, Florida if you live east. Don’t fly farther than ~5 hours if you’re back Monday. Directs or don’t bother.",
    fr: "Fins de semaine qui marchent : NYC, Chicago, Montréal, Québec, Vegas, Floride à l’est. Pas plus de ~5 h si vous rentrez lundi. Direct, sinon laissez faire.",
  },
  {
    id: "surprise",
    tags: ["surprise", "idea", "recommend", "where should", "inspire", "random", "anywhere"],
    en: "Need a nudge? Winter: Cancún or Vallarta. Shoulder: Lisbon or London. Long-haul appetite: Tokyo via Vancouver. Mountains: Banff from Calgary. I’ll open the search — you just say the mood.",
    fr: "Un coup de pouce ? Hiver : Cancún ou Vallarta. Épaule : Lisbonne ou Londres. Long-courrier : Tokyo via Vancouver. Montagne : Banff depuis Calgary. Je lance la recherche.",
  },
  {
    id: "esim",
    tags: ["esim", "e-sim", "sim", "data", "airalo", "wifi", "roaming", "cell"],
    en: "eSIM on AIRSTAY: pick the destination, compare CAD plans, finish with Airalo. Install before you leave Wi-Fi at home. Keep your Canadian number on the physical SIM if you still need it. Europe, Mexico, US, Asia — I’ve got a page for that: /esim.",
    fr: "eSIM sur AIRSTAY : destination, forfaits en $ CA, vous terminez chez Airalo. Installez avant de quitter le Wi-Fi. L’Europe, le Mexique, les É-U, l’Asie — page /esim.",
  },
  {
    id: "jetlag",
    tags: ["jet lag", "jetlag", "sleep", "red-eye", "overnight", "décalage"],
    en: "Eastbound (Canada → Europe) is the mean one: morning light on arrival, caffeine with breakfast, no 3pm nap if you can help it. Westbound is gentler. Hydrate, skip the third movie, set your watch at takeoff. For Japan/Australia, a West Coast hop (YVR) splits the pain.",
    fr: "Vers l’est (Canada → Europe), c’est le dur : lumière du matin, café au petit-déj., pas de sieste à 15 h. Vers l’ouest, plus doux. Hydratez-vous, montre à l’heure du dest dès le décollage.",
  },
  {
    id: "airport",
    tags: ["airport", "catsa", "tsa", "security", "layover", "connection", "lounge", "aéroport"],
    en: "Canada: CATSA, liquids 100ml, arrive 2h domestic / 3h US or international. Nexus/TSA PreCheck is a personality transplant. Tight layover under 90 minutes on a different terminal is a gamble. Lounge if the wait is 3+ hours or you need a shower after a redeye.",
    fr: "Canada : CATSA, liquides 100 ml, 2 h intérieur / 3 h É-U ou international. Nexus change une vie. Correspondance < 90 min entre terminaux = pari. Salon si 3 h d’attente.",
  },
  {
    id: "insurance",
    tags: ["insurance", "assurance", "travel insurance", "medical", "cancel"],
    en: "Travel medical insurance is the unsexy essential — provincial health plans are shy abroad. Cancel-for-any-reason costs more and has rules. Credit-card coverage often needs the full trip charged to the card; read it. I’m not selling a policy; I’m nagging you to have one.",
    fr: "L’assurance médicale voyage, c’est l’essentiel sans glamour — la RAMQ/OHIP est timide à l’étranger. Les cartes couvrent parfois, avec des astérisques. Je ne vends rien; je râle pour que vous en ayez une.",
  },
  {
    id: "solo",
    tags: ["solo", "alone", "myself", "seule", "seul", "independent"],
    en: "Solo: city trips and well-run group day tours beat empty all-inclusives. Sit at bars, take walking tours day one, share tables. Lisbon, Tokyo, London, Mexico City, Montreal are easy. Tell someone your plan. I’ve got you — and the search buttons.",
    fr: "Solo : les villes et les visites du jour battent les tout-inclus vides. Comptoirs, walking tour le jour 1. Lisbonne, Tokyo, Londres, Mexico, Montréal. Prévenez quelqu’un de votre plan.",
  },
  {
    id: "whenbook",
    tags: ["when to book", "book now", "how early", "avance", "réserver", "tuesday"],
    en: "There’s no magic Tuesday anymore. Sun in winter: book as soon as March break/Christmas is a maybe. Europe summer: early spring. Shoulder and mid-week often win. Set a fare alert energy — search on AIRSTAY, don’t refresh yourself into a worse price.",
    fr: "Plus de mardi magique. Soleil d’hiver : dès que relâche/Noël est un peut-être. Été en Europe : tôt au printemps. Épaules et mi-semaine. Cherchez sur AIRSTAY plutôt que de vous rafraîchir le prix à la hausse.",
  },
  {
    id: "plugs",
    tags: ["plug", "adapter", "adaptateur", "voltage", "charger", "outlet"],
    en: "Canada/US: same plugs. Mexico/Caribbean: usually the same, pack a cheap adapter just in case. UK: chunky G. EU: C/F. Japan: two-pin like us, sometimes without the ground. A universal adapter + a USB power strip beats a suitcase of bricks.",
    fr: "Canada/É-U : mêmes prises. Mexique/Caraïbes : souvent pareil. Royaume-Uni : type G. UE : C/F. Japon : deux broches. Un adaptateur universel + une barrette USB, c’est la paix.",
  },
  {
    id: "health",
    tags: ["water", "eau", "mosquito", "moustique", "altitude", "vaccine", "vaccin", "pharmacy"],
    en: "Tap water: fine in most of Western Europe, Japan, Singapore; bottled in much of Mexico, Caribbean, North Africa, South Asia. Mosquito evenings in the tropics — cover up at dusk. Altitude (Mexico City, Cusco, Andes): slow day one. Vaccines: talk to a travel clinic, not me; I’m not your doctor.",
    fr: "Eau du robinet : OK Europe de l’Ouest, Japon, Singapour; bouteille au Mexique, Caraïbes, Afrique du Nord, Asie du Sud. Moustiques au crépuscule. Altitude : jour 1 lent. Vaccins : clinique voyage, pas moi.",
  },
  {
    id: "tipping",
    tags: ["tip", "tipping", "pourboire", "gratuity", "service"],
    en: "US: 18–22% at restaurants still the norm. Mexico: 10–15% if service isn’t included. Europe: service often included; rounding up is polite, 10% for wow. Japan: don’t tip. All-inclusives: small cash for housekeeping and bartenders still goes a long way.",
    fr: "É-U : 18–22 %. Mexique : 10–15 % si non inclus. Europe : service souvent inclus, arrondir. Japon : pas de pourboire. Tout-inclus : un peu de cash ménage et bar.",
  },
  {
    id: "ski",
    tags: ["ski", "snowboard", "whistler", "banff", "aspen", "powder"],
    en: "Ski from Canada: Whistler via YVR, Banff/Lake Louise via YYC, Tremblant from YUL/YOW. US: Colorado and Utah if you want the bigger dumps. Book lodging early for Christmas and March break. Pack layers, not a fashion show. A car at Banff helps; Whistler has buses.",
    fr: "Ski : Whistler via YVR, Banff via YYC, Tremblant via YUL. Colorado/Utah pour la poudre US. Relâche et Noël partent vite. Couches. Auto utile à Banff.",
  },
  {
    id: "scuba",
    tags: ["scuba", "snorkel", "dive", "reef", "cenote"],
    en: "Easy snorkel: Isla Mujeres, Belize barrier, Hawaiʻi, Aruba. Divers: Cozumel, Raja Ampat if you’re going far, Red Sea if the routing works. Reef-safe sunscreen is not optional. Certify before you fly if you can — pool time at home beats a rushed resort course.",
    fr: "Snorkel facile : Isla Mujeres, Belize, Hawaï, Aruba. Plongeurs : Cozumel, mer Rouge. Crème récif-safe. Certifiez chez vous si possible.",
  },
  {
    id: "accessibility",
    tags: ["wheelchair", "mobility", "accessible", "disability", "fauteuil"],
    en: "Ask before you book: step-free rooms, roll-in showers, airport assistance (request 48h+ ahead). Newer city hotels and big US/European airports are generally kinder than cobbled old towns and overwater bungalows. Direct flights reduce connection stress. Flag it in the search notes to yourself — I’ll still send you to the right AIRSTAY page.",
    fr: "Demandez avant : chambre sans marche, douche à l’italienne, assistance aéroport (48 h+). Les aéroports récents sont plus doux que les vieilles pierres. Les directs réduisent le stress.",
  },
];

function norm(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function tokens(q: string) {
  return norm(q)
    .split(/[^a-z0-9+]+/)
    .filter((w) => w.length > 1);
}

function score(hay: string[], qTokens: string[]) {
  const fields = hay.map(norm);
  let n = 0;
  for (const t of qTokens) {
    for (const h of fields) {
      if (h === t) n += 3;
      else if (t.length >= 4 && h.includes(t)) n += 2;
    }
  }
  return n;
}

export function retrieveGuides(message: string, limit = 4): Guide[] {
  const q = tokens(message);
  const ranked = GUIDES.map((g) => {
    const nameScore = score([...g.codes, ...g.names], q);
    const tagScore = score([...g.tags, g.region], q);
    return { g, nameScore, s: nameScore * 4 + tagScore };
  }).sort((a, b) => b.s - a.s);
  const named = ranked.filter((x) => x.nameScore > 0);
  const pool = named.length ? named : ranked.filter((x) => x.s >= 4);
  return pool.slice(0, limit).map((x) => x.g);
}

export function retrieveTopics(message: string): Topic[] {
  const q = tokens(message);
  const ranked = TOPICS.map((t) => ({ t, s: score(t.tags, q) }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s);
  if (/\bairstay\b/i.test(message) && !ranked.some((x) => x.t.id === "airstay")) {
    const home = TOPICS.find((t) => t.id === "airstay");
    if (home) ranked.unshift({ t: home, s: 99 });
  }
  return ranked.slice(0, 5).map((x) => x.t);
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
  const q = message.trim();
  const low = q.toLowerCase();

  if (/^(hi|hey|hello|yo|sup|salut|bonjour|allo|hey there)\b/i.test(low) && low.length < 28) {
    return fr
      ? "Salut — Aria, experte voyage AIRSTAY. Une plage, une ville, une valise trop lourde, une eSIM, ou juste « sors-moi d’ici » ?"
      : "Hey — Aria, AIRSTAY’s travel expert. A beach, a city, a packing spiral, an eSIM, or just ‘get me out of here’?";
  }
  if (/^(thanks|thank you|merci|ty|cheers)\b/i.test(low)) {
    return fr
      ? "Avec plaisir. Si le voyage change de forme, je suis dans le coin."
      : "Anytime. If the trip shapeshifts, I’m in the corner.";
  }
  if (/^(bye|goodbye|ciao|a plus|à plus|see ya)/i.test(low)) {
    return fr ? "Bon vol — même si c’est encore dans votre tête." : "Safe travels — even if they’re still in your head.";
  }
  if (/who are you|t.?.es qui|c.?est qui|what can you|que peux/i.test(low)) {
    return fr
      ? "Je suis Aria avec AIRSTAY — experte voyage IA. Plages, villes, valises, visas en gros, eSIM, forfaits partenaires, et je t’envoie au bon endroit sur le site. Je ne réserve pas : je t’oriente, tu compares en $ CA, sans frais de notre part."
      : "I’m Aria with AIRSTAY — an AI travel expert. Beaches, cities, packing, visas at a high level, eSIMs, partner packages, and I’ll send you to the right page. I don’t book: I aim, you compare in CAD, no fee from us.";
  }
  if (/\b(joke|blague|funny)\b/i.test(low)) {
    return fr
      ? "Pourquoi les avions n’ont pas de valise émotionnelle ? Parce que le décalage horaire suffit. Allez, une vraie destination maintenant ?"
      : "Why don’t planes carry emotional baggage? Jet lag already does. Okay — a real destination now?";
  }
  if (/\b(esim|e-sim|airalo|roaming|data plan)\b/i.test(low)) {
    return fr
      ? "eSIM : on compare les forfaits en $ CA, vous terminez chez Airalo. Installez-la avant de quitter le Wi-Fi à la maison. Dites-moi le pays, je vous envoie à la page."
      : "eSIM: compare CAD plans here, finish with Airalo. Install it before you leave home Wi-Fi. Tell me the country and I’ll open the page.";
  }
  if (/\b(package|forfait|all.?inclusive|tout.?inclus|expedia)\b/i.test(low) && !retrieveGuides(message, 1).length) {
    return fr
      ? "Les forfaits AIRSTAY choisis à la main arrivent bientôt. En attendant, les forfaits partenaires (Expedia) sont sur la page Forfaits — et vous pouvez aussi coupler un vol et un hôtel vous-même."
      : "Hand-picked AIRSTAY packages are coming soon. Until then, partner vacation packages (Expedia) live on the Packages page — or pair a flight and a hotel yourself.";
  }

  const guides = retrieveGuides(message, 2);
  const topics = retrieveTopics(message);
  const parts: string[] = [];
  if (guides.length) parts.push(guides.map((g) => (fr ? g.fr : g.en)).join("\n\n"));
  const extra = topics.filter((t) => {
    if (t.id === "airstay" || t.id === "chat") return !guides.length;
    if (guides.length) {
      return ["seasons", "pack", "flights", "esim", "jetlag", "visa"].includes(t.id);
    }
    return t.id !== "chat";
  });
  if (extra.length) parts.push(extra.slice(0, 2).map((t) => (fr ? t.fr : t.en)).join("\n\n"));
  if (!parts.length) {
    return fr
      ? "Dis-moi une ville, une saison, un budget, un « j’ai besoin de chaleur » — ou j’ouvre vols, hôtels, autos, eSIM, forfaits. Je t’y amène."
      : "Give me a city, a season, a budget, a ‘I just need heat’ — or I’ll open flights, hotels, cars, eSIMs, or packages. I’ve got you.";
  }
  const closer = fr
    ? "Tape un bouton si tu veux chercher ça tout de suite — ou dis-moi la vibe."
    : "Tap a button if you want to search that now — or tell me the vibe.";
  return `${parts.join("\n\n")}\n\n${closer}`;
}

export const GEO_CHEATSHEET = `GEO FROM CANADA (typical, not live ATC)
- Toronto (YYZ/YTZ) Eastern. Montreal (YUL) Eastern. Ottawa (YOW) Eastern. Halifax (YHZ) Atlantic. St. John's (YYT) Newfoundland (UTC−3:30). Winnipeg (YWG) Central. Calgary/Edmonton Mountain. Vancouver (YVR) Pacific.
- Mexico Caribbean (Cancún) usually Eastern-like in winter; Mexico Pacific often Mountain. UK 4–5h ahead of Toronto depending on DST. Japan 13–14h ahead of Toronto.
- Flight feel: sun dests 4–6h from central Canada; London/Paris ~7h from YYZ/YUL; West Coast–Tokyo overnight; East Coast–Asia is a two-step.
- Continents: North America, Caribbean basin, Europe, East Asia, Southeast Asia, South America (Cartagena, Lima, Rio — longer, often 1-stop).
- Hurricane Atlantic: ~1 June–30 Nov, peak Aug–Oct. Pacific Mexico rainier summer. Europe August holidays. Japanese rainy season ~June, typhoons late summer.
Always treat live weather, strikes and visa pages as authority over this sheet.`;
