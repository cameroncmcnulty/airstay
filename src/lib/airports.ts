import { WORLD_PASSENGER_AIRPORTS } from "./world-airports";

export type Airport = {
  code: string;
  city: string;
  cityFr: string;
  name: string;
  nameFr: string;
  province: string;
  major?: boolean;
  country?: string;
  countryFr?: string;
};

export const CANADIAN_AIRPORTS: Airport[] = [
  { code: "YYZ", city: "Toronto", cityFr: "Toronto", name: "Toronto Pearson", nameFr: "Toronto Pearson", province: "ON", major: true },
  { code: "YVR", city: "Vancouver", cityFr: "Vancouver", name: "Vancouver International", nameFr: "Vancouver international", province: "BC", major: true },
  { code: "YUL", city: "Montreal", cityFr: "Montréal", name: "Montréal-Trudeau", nameFr: "Montréal-Trudeau", province: "QC", major: true },
  { code: "YYC", city: "Calgary", cityFr: "Calgary", name: "Calgary International", nameFr: "Calgary international", province: "AB", major: true },
  { code: "YEG", city: "Edmonton", cityFr: "Edmonton", name: "Edmonton International", nameFr: "Edmonton international", province: "AB", major: true },
  { code: "YOW", city: "Ottawa", cityFr: "Ottawa", name: "Ottawa Macdonald-Cartier", nameFr: "Ottawa Macdonald-Cartier", province: "ON", major: true },
  { code: "YHZ", city: "Halifax", cityFr: "Halifax", name: "Halifax Stanfield", nameFr: "Halifax Stanfield", province: "NS", major: true },
  { code: "YWG", city: "Winnipeg", cityFr: "Winnipeg", name: "Winnipeg Richardson", nameFr: "Winnipeg Richardson", province: "MB", major: true },
  { code: "YQB", city: "Quebec City", cityFr: "Québec", name: "Québec City Jean Lesage", nameFr: "Québec Jean-Lesage", province: "QC", major: true },
  { code: "YYJ", city: "Victoria", cityFr: "Victoria", name: "Victoria International", nameFr: "Victoria international", province: "BC", major: true },
  { code: "YYT", city: "St. John's", cityFr: "St. John's", name: "St. John's International", nameFr: "St. John's international", province: "NL", major: true },
  { code: "YLW", city: "Kelowna", cityFr: "Kelowna", name: "Kelowna International", nameFr: "Kelowna international", province: "BC", major: true },
  { code: "YXE", city: "Saskatoon", cityFr: "Saskatoon", name: "Saskatoon John G. Diefenbaker", nameFr: "Saskatoon John G. Diefenbaker", province: "SK", major: true },
  { code: "YQR", city: "Regina", cityFr: "Regina", name: "Regina International", nameFr: "Regina international", province: "SK", major: true },
  { code: "YQM", city: "Moncton", cityFr: "Moncton", name: "Greater Moncton Roméo LeBlanc", nameFr: "Grand Moncton Roméo-LeBlanc", province: "NB", major: true },
  { code: "YXX", city: "Abbotsford", cityFr: "Abbotsford", name: "Abbotsford International", nameFr: "Abbotsford international", province: "BC", major: true },
  { code: "YXU", city: "London", cityFr: "London", name: "London International", nameFr: "London international", province: "ON", major: true },
  { code: "YKF", city: "Kitchener", cityFr: "Kitchener", name: "Region of Waterloo", nameFr: "Région de Waterloo", province: "ON", major: true },
  { code: "YTZ", city: "Toronto", cityFr: "Toronto", name: "Billy Bishop", nameFr: "Billy Bishop", province: "ON", major: true },
  { code: "YYG", city: "Charlottetown", cityFr: "Charlottetown", name: "Charlottetown Airport", nameFr: "Aéroport de Charlottetown", province: "PE", major: true },
  { code: "YFC", city: "Fredericton", cityFr: "Fredericton", name: "Fredericton International", nameFr: "Fredericton international", province: "NB" },
  { code: "YSJ", city: "Saint John", cityFr: "Saint John", name: "Saint John Airport", nameFr: "Aéroport de Saint John", province: "NB" },
  { code: "YQT", city: "Thunder Bay", cityFr: "Thunder Bay", name: "Thunder Bay International", nameFr: "Thunder Bay international", province: "ON" },
  { code: "YHM", city: "Hamilton", cityFr: "Hamilton", name: "John C. Munro Hamilton", nameFr: "John C. Munro Hamilton", province: "ON" },
  { code: "YSB", city: "Sudbury", cityFr: "Sudbury", name: "Sudbury Airport", nameFr: "Aéroport de Sudbury", province: "ON" },
  { code: "YTS", city: "Timmins", cityFr: "Timmins", name: "Timmins Victor M. Power", nameFr: "Timmins Victor M. Power", province: "ON" },
  { code: "YAM", city: "Sault Ste. Marie", cityFr: "Sault Ste. Marie", name: "Sault Ste. Marie Airport", nameFr: "Aéroport de Sault Ste. Marie", province: "ON" },
  { code: "YGK", city: "Kingston", cityFr: "Kingston", name: "Kingston Norman Rogers", nameFr: "Kingston Norman Rogers", province: "ON" },
  { code: "YQG", city: "Windsor", cityFr: "Windsor", name: "Windsor International", nameFr: "Windsor international", province: "ON" },
  { code: "YZR", city: "Sarnia", cityFr: "Sarnia", name: "Sarnia Chris Hadfield", nameFr: "Sarnia Chris Hadfield", province: "ON" },
  { code: "YXL", city: "Sioux Lookout", cityFr: "Sioux Lookout", name: "Sioux Lookout Airport", nameFr: "Aéroport de Sioux Lookout", province: "ON" },
  { code: "YHD", city: "Dryden", cityFr: "Dryden", name: "Dryden Regional", nameFr: "Aéroport régional de Dryden", province: "ON" },
  { code: "YQK", city: "Kenora", cityFr: "Kenora", name: "Kenora Airport", nameFr: "Aéroport de Kenora", province: "ON" },
  { code: "YTH", city: "Thompson", cityFr: "Thompson", name: "Thompson Airport", nameFr: "Aéroport de Thompson", province: "MB" },
  { code: "YBR", city: "Brandon", cityFr: "Brandon", name: "Brandon Municipal", nameFr: "Aéroport municipal de Brandon", province: "MB" },
  { code: "YPA", city: "Prince Albert", cityFr: "Prince Albert", name: "Prince Albert Glass Field", nameFr: "Prince Albert Glass Field", province: "SK" },
  { code: "YMM", city: "Fort McMurray", cityFr: "Fort McMurray", name: "Fort McMurray International", nameFr: "Fort McMurray international", province: "AB" },
  { code: "YQU", city: "Grande Prairie", cityFr: "Grande Prairie", name: "Grande Prairie Airport", nameFr: "Aéroport de Grande Prairie", province: "AB" },
  { code: "YQL", city: "Lethbridge", cityFr: "Lethbridge", name: "Lethbridge Airport", nameFr: "Aéroport de Lethbridge", province: "AB" },
  { code: "YXH", city: "Medicine Hat", cityFr: "Medicine Hat", name: "Medicine Hat Airport", nameFr: "Aéroport de Medicine Hat", province: "AB" },
  { code: "YLL", city: "Lloydminster", cityFr: "Lloydminster", name: "Lloydminster Airport", nameFr: "Aéroport de Lloydminster", province: "AB" },
  { code: "YXC", city: "Cranbrook", cityFr: "Cranbrook", name: "Cranbrook/Canadian Rockies", nameFr: "Cranbrook/Rocheuses canadiennes", province: "BC" },
  { code: "YXS", city: "Prince George", cityFr: "Prince George", name: "Prince George Airport", nameFr: "Aéroport de Prince George", province: "BC" },
  { code: "YKA", city: "Kamloops", cityFr: "Kamloops", name: "Kamloops Airport", nameFr: "Aéroport de Kamloops", province: "BC" },
  { code: "YQQ", city: "Comox", cityFr: "Comox", name: "CFB Comox", nameFr: "BFC Comox", province: "BC" },
  { code: "YCD", city: "Nanaimo", cityFr: "Nanaimo", name: "Nanaimo Airport", nameFr: "Aéroport de Nanaimo", province: "BC" },
  { code: "YBL", city: "Campbell River", cityFr: "Campbell River", name: "Campbell River Airport", nameFr: "Aéroport de Campbell River", province: "BC" },
  { code: "YXT", city: "Terrace", cityFr: "Terrace", name: "Northwest Regional Terrace-Kitimat", nameFr: "Aéroport régional du Nord-Ouest", province: "BC" },
  { code: "YPR", city: "Prince Rupert", cityFr: "Prince Rupert", name: "Prince Rupert Airport", nameFr: "Aéroport de Prince Rupert", province: "BC" },
  { code: "YXJ", city: "Fort St. John", cityFr: "Fort St. John", name: "Fort St. John Airport", nameFr: "Aéroport de Fort St. John", province: "BC" },
  { code: "YYF", city: "Penticton", cityFr: "Penticton", name: "Penticton Airport", nameFr: "Aéroport de Penticton", province: "BC" },
  { code: "YCG", city: "Castlegar", cityFr: "Castlegar", name: "West Kootenay Regional", nameFr: "Aéroport régional de West Kootenay", province: "BC" },
  { code: "YZP", city: "Sandspit", cityFr: "Sandspit", name: "Sandspit Airport", nameFr: "Aéroport de Sandspit", province: "BC" },
  { code: "YQY", city: "Sydney", cityFr: "Sydney", name: "Sydney/J.A. Douglas McCurdy", nameFr: "Sydney/J.A. Douglas McCurdy", province: "NS" },
  { code: "YQX", city: "Gander", cityFr: "Gander", name: "Gander International", nameFr: "Gander international", province: "NL" },
  { code: "YDF", city: "Deer Lake", cityFr: "Deer Lake", name: "Deer Lake Regional", nameFr: "Aéroport régional de Deer Lake", province: "NL" },
  { code: "YYR", city: "Happy Valley-Goose Bay", cityFr: "Happy Valley-Goose Bay", name: "CFB Goose Bay", nameFr: "BFC Goose Bay", province: "NL" },
  { code: "YJT", city: "Stephenville", cityFr: "Stephenville", name: "Stephenville International", nameFr: "Stephenville international", province: "NL" },
  { code: "YGR", city: "Îles-de-la-Madeleine", cityFr: "Îles-de-la-Madeleine", name: "Îles-de-la-Madeleine Airport", nameFr: "Aéroport des Îles-de-la-Madeleine", province: "QC" },
  { code: "YBG", city: "Saguenay", cityFr: "Saguenay", name: "CFB Bagotville", nameFr: "BFC Bagotville", province: "QC" },
  { code: "YZV", city: "Sept-Îles", cityFr: "Sept-Îles", name: "Sept-Îles Airport", nameFr: "Aéroport de Sept-Îles", province: "QC" },
  { code: "YUY", city: "Rouyn-Noranda", cityFr: "Rouyn-Noranda", name: "Rouyn-Noranda Airport", nameFr: "Aéroport de Rouyn-Noranda", province: "QC" },
  { code: "YVO", city: "Val-d'Or", cityFr: "Val-d'Or", name: "Val-d'Or Airport", nameFr: "Aéroport de Val-d'Or", province: "QC" },
  { code: "YGP", city: "Gaspé", cityFr: "Gaspé", name: "Michel-Pouliot Gaspé", nameFr: "Michel-Pouliot Gaspé", province: "QC" },
  { code: "YVB", city: "Bonaventure", cityFr: "Bonaventure", name: "Bonaventure Airport", nameFr: "Aéroport de Bonaventure", province: "QC" },
  { code: "YGV", city: "Havre-Saint-Pierre", cityFr: "Havre-Saint-Pierre", name: "Havre-Saint-Pierre Airport", nameFr: "Aéroport de Havre-Saint-Pierre", province: "QC" },
  { code: "YBC", city: "Baie-Comeau", cityFr: "Baie-Comeau", name: "Baie-Comeau Airport", nameFr: "Aéroport de Baie-Comeau", province: "QC" },
  { code: "YWK", city: "Wabush", cityFr: "Wabush", name: "Wabush Airport", nameFr: "Aéroport de Wabush", province: "NL" },
  { code: "YZF", city: "Yellowknife", cityFr: "Yellowknife", name: "Yellowknife Airport", nameFr: "Aéroport de Yellowknife", province: "NT" },
  { code: "YXY", city: "Whitehorse", cityFr: "Whitehorse", name: "Erik Nielsen Whitehorse", nameFr: "Erik Nielsen Whitehorse", province: "YT" },
  { code: "YFB", city: "Iqaluit", cityFr: "Iqaluit", name: "Iqaluit Airport", nameFr: "Aéroport d'Iqaluit", province: "NU" },
  { code: "YEV", city: "Inuvik", cityFr: "Inuvik", name: "Inuvik Mike Zubko", nameFr: "Inuvik Mike Zubko", province: "NT" },
  { code: "YSM", city: "Fort Smith", cityFr: "Fort Smith", name: "Fort Smith Airport", nameFr: "Aéroport de Fort Smith", province: "NT" },
  { code: "YHY", city: "Hay River", cityFr: "Hay River", name: "Hay River/Merlyn Carter", nameFr: "Hay River/Merlyn Carter", province: "NT" },
  { code: "YVQ", city: "Norman Wells", cityFr: "Norman Wells", name: "Norman Wells Airport", nameFr: "Aéroport de Norman Wells", province: "NT" },
  { code: "YCB", city: "Cambridge Bay", cityFr: "Cambridge Bay", name: "Cambridge Bay Airport", nameFr: "Aéroport de Cambridge Bay", province: "NU" },
  { code: "YCO", city: "Kugluktuk", cityFr: "Kugluktuk", name: "Kugluktuk Airport", nameFr: "Aéroport de Kugluktuk", province: "NU" },
  { code: "YRT", city: "Rankin Inlet", cityFr: "Rankin Inlet", name: "Rankin Inlet Airport", nameFr: "Aéroport de Rankin Inlet", province: "NU" },
  { code: "YBK", city: "Baker Lake", cityFr: "Baker Lake", name: "Baker Lake Airport", nameFr: "Aéroport de Baker Lake", province: "NU" },
  { code: "YXP", city: "Pangnirtung", cityFr: "Pangnirtung", name: "Pangnirtung Airport", nameFr: "Aéroport de Pangnirtung", province: "NU" },
  { code: "YIO", city: "Pond Inlet", cityFr: "Pond Inlet", name: "Pond Inlet Airport", nameFr: "Aéroport de Pond Inlet", province: "NU" },
  { code: "YTE", city: "Kinngait", cityFr: "Kinngait", name: "Cape Dorset Airport", nameFr: "Aéroport de Cape Dorset", province: "NU" },
  { code: "YVP", city: "Kuujjuaq", cityFr: "Kuujjuaq", name: "Kuujjuaq Airport", nameFr: "Aéroport de Kuujjuaq", province: "QC" },
  { code: "YGW", city: "Kuujjuarapik", cityFr: "Kuujjuarapik", name: "Kuujjuarapik Airport", nameFr: "Aéroport de Kuujjuarapik", province: "QC" },
  { code: "YPX", city: "Puvirnituq", cityFr: "Puvirnituq", name: "Puvirnituq Airport", nameFr: "Aéroport de Puvirnituq", province: "QC" },
  { code: "YKL", city: "Schefferville", cityFr: "Schefferville", name: "Schefferville Airport", nameFr: "Aéroport de Schefferville", province: "QC" },
  { code: "YDA", city: "Dawson City", cityFr: "Dawson City", name: "Dawson City Airport", nameFr: "Aéroport de Dawson City", province: "YT" },
  { code: "YQH", city: "Watson Lake", cityFr: "Watson Lake", name: "Watson Lake Airport", nameFr: "Aéroport de Watson Lake", province: "YT" },
  { code: "YAZ", city: "Tofino", cityFr: "Tofino", name: "Tofino/Long Beach", nameFr: "Tofino/Long Beach", province: "BC" },
  { code: "YZT", city: "Port Hardy", cityFr: "Port Hardy", name: "Port Hardy Airport", nameFr: "Aéroport de Port Hardy", province: "BC" },
  { code: "YYD", city: "Smithers", cityFr: "Smithers", name: "Smithers Airport", nameFr: "Aéroport de Smithers", province: "BC" },
  { code: "YWL", city: "Williams Lake", cityFr: "Williams Lake", name: "Williams Lake Airport", nameFr: "Aéroport de Williams Lake", province: "BC" },
  { code: "YQZ", city: "Quesnel", cityFr: "Quesnel", name: "Quesnel Airport", nameFr: "Aéroport de Quesnel", province: "BC" },
  { code: "YYE", city: "Fort Nelson", cityFr: "Fort Nelson", name: "Northern Rockies Regional", nameFr: "Aéroport régional des Rocheuses du Nord", province: "BC" },
  { code: "YPW", city: "Powell River", cityFr: "Powell River", name: "Powell River Airport", nameFr: "Aéroport de Powell River", province: "BC" },
  { code: "YJQ", city: "Bella Coola", cityFr: "Bella Coola", name: "Bella Coola Airport", nameFr: "Aéroport de Bella Coola", province: "BC" },
  { code: "YQI", city: "Yarmouth", cityFr: "Yarmouth", name: "Yarmouth Airport", nameFr: "Aéroport de Yarmouth", province: "NS" },
  { code: "ZBF", city: "Bathurst", cityFr: "Bathurst", name: "Bathurst Airport", nameFr: "Aéroport de Bathurst", province: "NB" },
  { code: "YCH", city: "Miramichi", cityFr: "Miramichi", name: "Miramichi Airport", nameFr: "Aéroport de Miramichi", province: "NB" },
  { code: "YND", city: "Gatineau", cityFr: "Gatineau", name: "Gatineau-Ottawa Executive", nameFr: "Aéroport exécutif Gatineau-Ottawa", province: "QC" },
  { code: "YHU", city: "Longueuil", cityFr: "Longueuil", name: "Montréal Saint-Hubert", nameFr: "Montréal Saint-Hubert", province: "QC" },
  { code: "YMO", city: "Moosonee", cityFr: "Moosonee", name: "Moosonee Airport", nameFr: "Aéroport de Moosonee", province: "ON" },
  { code: "YRL", city: "Red Lake", cityFr: "Red Lake", name: "Red Lake Airport", nameFr: "Aéroport de Red Lake", province: "ON" },
  { code: "YPL", city: "Pickle Lake", cityFr: "Pickle Lake", name: "Pickle Lake Airport", nameFr: "Aéroport de Pickle Lake", province: "ON" },
  { code: "YFO", city: "Flin Flon", cityFr: "Flin Flon", name: "Flin Flon Airport", nameFr: "Aéroport de Flin Flon", province: "MB" },
  { code: "YQD", city: "The Pas", cityFr: "The Pas", name: "The Pas Airport", nameFr: "Aéroport de The Pas", province: "MB" },
  { code: "YYQ", city: "Churchill", cityFr: "Churchill", name: "Churchill Airport", nameFr: "Aéroport de Churchill", province: "MB" },
  { code: "YPE", city: "Peace River", cityFr: "Peace River", name: "Peace River Airport", nameFr: "Aéroport de Peace River", province: "AB" },
  { code: "YOJ", city: "High Level", cityFr: "High Level", name: "High Level Airport", nameFr: "Aéroport de High Level", province: "AB" },
  { code: "YPY", city: "Fort Chipewyan", cityFr: "Fort Chipewyan", name: "Fort Chipewyan Airport", nameFr: "Aéroport de Fort Chipewyan", province: "AB" },
  { code: "YYN", city: "Swift Current", cityFr: "Swift Current", name: "Swift Current Airport", nameFr: "Aéroport de Swift Current", province: "SK" },
  { code: "YQV", city: "Yorkton", cityFr: "Yorkton", name: "Yorkton Municipal", nameFr: "Aéroport municipal de Yorkton", province: "SK" },
  { code: "YVC", city: "La Ronge", cityFr: "La Ronge", name: "La Ronge Airport", nameFr: "Aéroport de La Ronge", province: "SK" },
  { code: "YGL", city: "Radisson", cityFr: "Radisson", name: "La Grande Rivière", nameFr: "La Grande Rivière", province: "QC" },
  { code: "YMT", city: "Chibougamau", cityFr: "Chibougamau", name: "Chibougamau/Chapais", nameFr: "Chibougamau/Chapais", province: "QC" },
  { code: "YBX", city: "Blanc-Sablon", cityFr: "Blanc-Sablon", name: "Lourdes-de-Blanc-Sablon", nameFr: "Lourdes-de-Blanc-Sablon", province: "QC" },
  { code: "YAY", city: "St. Anthony", cityFr: "St. Anthony", name: "St. Anthony Airport", nameFr: "Aéroport de St. Anthony", province: "NL" },
  { code: "YOC", city: "Old Crow", cityFr: "Old Crow", name: "Old Crow Airport", nameFr: "Aéroport d'Old Crow", province: "YT" },
  { code: "YRB", city: "Resolute", cityFr: "Resolute", name: "Resolute Bay Airport", nameFr: "Aéroport de Resolute Bay", province: "NU" },
  { code: "YAB", city: "Arctic Bay", cityFr: "Arctic Bay", name: "Arctic Bay Airport", nameFr: "Aéroport d'Arctic Bay", province: "NU" },
  { code: "YHK", city: "Gjoa Haven", cityFr: "Gjoa Haven", name: "Gjoa Haven Airport", nameFr: "Aéroport de Gjoa Haven", province: "NU" },
  { code: "YGT", city: "Igloolik", cityFr: "Igloolik", name: "Igloolik Airport", nameFr: "Aéroport d'Igloolik", province: "NU" },
  { code: "YCS", city: "Chesterfield Inlet", cityFr: "Chesterfield Inlet", name: "Chesterfield Inlet Airport", nameFr: "Aéroport de Chesterfield Inlet", province: "NU" },
  { code: "YUT", city: "Naujaat", cityFr: "Naujaat", name: "Naujaat Airport", nameFr: "Aéroport de Naujaat", province: "NU" },
  { code: "YUX", city: "Sanirajak", cityFr: "Sanirajak", name: "Hall Beach Airport", nameFr: "Aéroport de Hall Beach", province: "NU" },
  { code: "YCY", city: "Clyde River", cityFr: "Clyde River", name: "Clyde River Airport", nameFr: "Aéroport de Clyde River", province: "NU" },
  { code: "YZS", city: "Coral Harbour", cityFr: "Coral Harbour", name: "Coral Harbour Airport", nameFr: "Aéroport de Coral Harbour", province: "NU" },
  { code: "YSK", city: "Sanikiluaq", cityFr: "Sanikiluaq", name: "Sanikiluaq Airport", nameFr: "Aéroport de Sanikiluaq", province: "NU" },
  { code: "YWB", city: "Kangiqsujuaq", cityFr: "Kangiqsujuaq", name: "Kangiqsujuaq Wakeham Bay", nameFr: "Kangiqsujuaq Wakeham Bay", province: "QC" },
  { code: "YZG", city: "Salluit", cityFr: "Salluit", name: "Salluit Airport", nameFr: "Aéroport de Salluit", province: "QC" },
  { code: "YPH", city: "Inukjuak", cityFr: "Inukjuak", name: "Inukjuak Airport", nameFr: "Aéroport d'Inukjuak", province: "QC" },
  { code: "YIK", city: "Ivujivik", cityFr: "Ivujivik", name: "Ivujivik Airport", nameFr: "Aéroport d'Ivujivik", province: "QC" },
  { code: "YKG", city: "Kangirsuk", cityFr: "Kangirsuk", name: "Kangirsuk Airport", nameFr: "Aéroport de Kangirsuk", province: "QC" },
  { code: "YQC", city: "Quaqtaq", cityFr: "Quaqtaq", name: "Quaqtaq Airport", nameFr: "Aéroport de Quaqtaq", province: "QC" },
  { code: "YTQ", city: "Tasiujaq", cityFr: "Tasiujaq", name: "Tasiujaq Airport", nameFr: "Aéroport de Tasiujaq", province: "QC" },
  { code: "YNA", city: "Natashquan", cityFr: "Natashquan", name: "Natashquan Airport", nameFr: "Aéroport de Natashquan", province: "QC" },
  { code: "YHR", city: "Chevery", cityFr: "Chevery", name: "Chevery Airport", nameFr: "Aéroport de Chevery", province: "QC" },
  { code: "ZUM", city: "Churchill Falls", cityFr: "Churchill Falls", name: "Churchill Falls Airport", nameFr: "Aéroport de Churchill Falls", province: "NL" },
  { code: "YDP", city: "Nain", cityFr: "Nain", name: "Nain Airport", nameFr: "Aéroport de Nain", province: "NL" },
];

export type Destination = {
  code: string;
  city: string;
  cityFr: string;
  country: string;
  countryFr: string;
  name?: string;
  nameFr?: string;
  aliases?: string[];
};

export const POPULAR_DESTINATIONS: Destination[] = [
  { code: "CUN", city: "Cancún", cityFr: "Cancún", country: "Mexico", countryFr: "Mexique", name: "Cancún International", aliases: ["cancun"] },
  { code: "LHR", city: "London", cityFr: "Londres", country: "United Kingdom", countryFr: "Royaume-Uni", name: "Heathrow", aliases: ["london", "lon"] },
  { code: "CDG", city: "Paris", cityFr: "Paris", country: "France", countryFr: "France", name: "Charles de Gaulle", aliases: ["paris", "par"] },
  { code: "LAX", city: "Los Angeles", cityFr: "Los Angeles", country: "United States", countryFr: "États-Unis", aliases: ["la"] },
  { code: "LAS", city: "Las Vegas", cityFr: "Las Vegas", country: "United States", countryFr: "États-Unis", name: "Harry Reid International" },
  { code: "MCO", city: "Orlando", cityFr: "Orlando", country: "United States", countryFr: "États-Unis", name: "Orlando International" },
  { code: "PUJ", city: "Punta Cana", cityFr: "Punta Cana", country: "Dominican Republic", countryFr: "République dominicaine" },
  { code: "PVR", city: "Puerto Vallarta", cityFr: "Puerto Vallarta", country: "Mexico", countryFr: "Mexique", name: "Gustavo Díaz Ordaz" },
  { code: "JFK", city: "New York", cityFr: "New York", country: "United States", countryFr: "États-Unis", name: "John F. Kennedy", aliases: ["nyc", "new york"] },
  { code: "MIA", city: "Miami", cityFr: "Miami", country: "United States", countryFr: "États-Unis" },
  { code: "FLL", city: "Fort Lauderdale", cityFr: "Fort Lauderdale", country: "United States", countryFr: "États-Unis", name: "Hollywood International" },
  { code: "SJD", city: "Los Cabos", cityFr: "Los Cabos", country: "Mexico", countryFr: "Mexique", name: "Los Cabos International", aliases: ["cabo", "san jose del cabo"] },
  { code: "PHX", city: "Phoenix", cityFr: "Phoenix", country: "United States", countryFr: "États-Unis", name: "Sky Harbor" },
  { code: "TPA", city: "Tampa", cityFr: "Tampa", country: "United States", countryFr: "États-Unis" },
  { code: "NRT", city: "Tokyo", cityFr: "Tokyo", country: "Japan", countryFr: "Japon", name: "Narita", aliases: ["tokyo", "tyo"] },
  { code: "MNL", city: "Manila", cityFr: "Manille", country: "Philippines", countryFr: "Philippines", name: "Ninoy Aquino" },
  { code: "DEL", city: "Delhi", cityFr: "Delhi", country: "India", countryFr: "Inde", name: "Indira Gandhi" },
  { code: "BKK", city: "Bangkok", cityFr: "Bangkok", country: "Thailand", countryFr: "Thaïlande", name: "Suvarnabhumi" },
  { code: "FCO", city: "Rome", cityFr: "Rome", country: "Italy", countryFr: "Italie", name: "Fiumicino", aliases: ["rome", "rom"] },
  { code: "BCN", city: "Barcelona", cityFr: "Barcelone", country: "Spain", countryFr: "Espagne" },
  { code: "AMS", city: "Amsterdam", cityFr: "Amsterdam", country: "Netherlands", countryFr: "Pays-Bas", name: "Schiphol" },
  { code: "FRA", city: "Frankfurt", cityFr: "Francfort", country: "Germany", countryFr: "Allemagne" },
  { code: "DUB", city: "Dublin", cityFr: "Dublin", country: "Ireland", countryFr: "Irlande" },
  { code: "MEX", city: "Mexico City", cityFr: "Mexico", country: "Mexico", countryFr: "Mexique", name: "Benito Juárez" },
  { code: "MBJ", city: "Montego Bay", cityFr: "Montego Bay", country: "Jamaica", countryFr: "Jamaïque", name: "Sangster" },
  { code: "VRA", city: "Varadero", cityFr: "Varadero", country: "Cuba", countryFr: "Cuba", name: "Juan Gualberto Gómez" },
  { code: "SFO", city: "San Francisco", cityFr: "San Francisco", country: "United States", countryFr: "États-Unis" },
  { code: "ICN", city: "Seoul", cityFr: "Séoul", country: "South Korea", countryFr: "Corée du Sud", name: "Incheon" },
  { code: "LIS", city: "Lisbon", cityFr: "Lisbonne", country: "Portugal", countryFr: "Portugal", name: "Humberto Delgado" },
  { code: "HNL", city: "Honolulu", cityFr: "Honolulu", country: "United States", countryFr: "États-Unis", name: "Daniel K. Inouye", aliases: ["hawaii", "oahu"] },
];

const MORE_DESTINATIONS: Destination[] = [
  { code: "EWR", city: "Newark", cityFr: "Newark", country: "United States", countryFr: "États-Unis" },
  { code: "LGA", city: "New York", cityFr: "New York", country: "United States", countryFr: "États-Unis" },
  { code: "ORD", city: "Chicago", cityFr: "Chicago", country: "United States", countryFr: "États-Unis" },
  { code: "ATL", city: "Atlanta", cityFr: "Atlanta", country: "United States", countryFr: "États-Unis" },
  { code: "BOS", city: "Boston", cityFr: "Boston", country: "United States", countryFr: "États-Unis" },
  { code: "SEA", city: "Seattle", cityFr: "Seattle", country: "United States", countryFr: "États-Unis" },
  { code: "PHX", city: "Phoenix", cityFr: "Phoenix", country: "United States", countryFr: "États-Unis" },
  { code: "DEN", city: "Denver", cityFr: "Denver", country: "United States", countryFr: "États-Unis" },
  { code: "DFW", city: "Dallas", cityFr: "Dallas", country: "United States", countryFr: "États-Unis" },
  { code: "IAH", city: "Houston", cityFr: "Houston", country: "United States", countryFr: "États-Unis" },
  { code: "TPA", city: "Tampa", cityFr: "Tampa", country: "United States", countryFr: "États-Unis" },
  { code: "RSW", city: "Fort Myers", cityFr: "Fort Myers", country: "United States", countryFr: "États-Unis" },
  { code: "SAN", city: "San Diego", cityFr: "San Diego", country: "United States", countryFr: "États-Unis" },
  { code: "HND", city: "Tokyo", cityFr: "Tokyo", country: "Japan", countryFr: "Japon" },
  { code: "KIX", city: "Osaka", cityFr: "Osaka", country: "Japan", countryFr: "Japon" },
  { code: "HKG", city: "Hong Kong", cityFr: "Hong Kong", country: "Hong Kong", countryFr: "Hong Kong" },
  { code: "SIN", city: "Singapore", cityFr: "Singapour", country: "Singapore", countryFr: "Singapour" },
  { code: "TPE", city: "Taipei", cityFr: "Taipei", country: "Taiwan", countryFr: "Taïwan" },
  { code: "PEK", city: "Beijing", cityFr: "Pékin", country: "China", countryFr: "Chine" },
  { code: "PVG", city: "Shanghai", cityFr: "Shanghai", country: "China", countryFr: "Chine" },
  { code: "BOM", city: "Mumbai", cityFr: "Mumbai", country: "India", countryFr: "Inde" },
  { code: "BLR", city: "Bengaluru", cityFr: "Bengaluru", country: "India", countryFr: "Inde" },
  { code: "LGW", city: "London", cityFr: "Londres", country: "United Kingdom", countryFr: "Royaume-Uni" },
  { code: "MAN", city: "Manchester", cityFr: "Manchester", country: "United Kingdom", countryFr: "Royaume-Uni" },
  { code: "EDI", city: "Edinburgh", cityFr: "Édimbourg", country: "United Kingdom", countryFr: "Royaume-Uni" },
  { code: "MXP", city: "Milan", cityFr: "Milan", country: "Italy", countryFr: "Italie" },
  { code: "VCE", city: "Venice", cityFr: "Venise", country: "Italy", countryFr: "Italie" },
  { code: "NCE", city: "Nice", cityFr: "Nice", country: "France", countryFr: "France" },
  { code: "LYS", city: "Lyon", cityFr: "Lyon", country: "France", countryFr: "France" },
  { code: "GVA", city: "Geneva", cityFr: "Genève", country: "Switzerland", countryFr: "Suisse" },
  { code: "ZRH", city: "Zurich", cityFr: "Zurich", country: "Switzerland", countryFr: "Suisse" },
  { code: "MUC", city: "Munich", cityFr: "Munich", country: "Germany", countryFr: "Allemagne" },
  { code: "BRU", city: "Brussels", cityFr: "Bruxelles", country: "Belgium", countryFr: "Belgique" },
  { code: "VIE", city: "Vienna", cityFr: "Vienne", country: "Austria", countryFr: "Autriche" },
  { code: "CPH", city: "Copenhagen", cityFr: "Copenhague", country: "Denmark", countryFr: "Danemark" },
  { code: "ARN", city: "Stockholm", cityFr: "Stockholm", country: "Sweden", countryFr: "Suède" },
  { code: "OSL", city: "Oslo", cityFr: "Oslo", country: "Norway", countryFr: "Norvège" },
  { code: "HEL", city: "Helsinki", cityFr: "Helsinki", country: "Finland", countryFr: "Finlande" },
  { code: "ATH", city: "Athens", cityFr: "Athènes", country: "Greece", countryFr: "Grèce" },
  { code: "IST", city: "Istanbul", cityFr: "Istanbul", country: "Turkey", countryFr: "Turquie" },
  { code: "DXB", city: "Dubai", cityFr: "Dubaï", country: "United Arab Emirates", countryFr: "Émirats arabes unis" },
  { code: "DOH", city: "Doha", cityFr: "Doha", country: "Qatar", countryFr: "Qatar" },
  { code: "AUH", city: "Abu Dhabi", cityFr: "Abou Dabi", country: "United Arab Emirates", countryFr: "Émirats arabes unis" },
  { code: "TLV", city: "Tel Aviv", cityFr: "Tel Aviv", country: "Israel", countryFr: "Israël" },
  { code: "CAI", city: "Cairo", cityFr: "Le Caire", country: "Egypt", countryFr: "Égypte" },
  { code: "CMN", city: "Casablanca", cityFr: "Casablanca", country: "Morocco", countryFr: "Maroc" },
  { code: "JNB", city: "Johannesburg", cityFr: "Johannesburg", country: "South Africa", countryFr: "Afrique du Sud" },
  { code: "CPT", city: "Cape Town", cityFr: "Le Cap", country: "South Africa", countryFr: "Afrique du Sud" },
  { code: "SYD", city: "Sydney", cityFr: "Sydney", country: "Australia", countryFr: "Australie" },
  { code: "MEL", city: "Melbourne", cityFr: "Melbourne", country: "Australia", countryFr: "Australie" },
  { code: "AKL", city: "Auckland", cityFr: "Auckland", country: "New Zealand", countryFr: "Nouvelle-Zélande" },
  { code: "DPS", city: "Denpasar", cityFr: "Denpasar", country: "Indonesia", countryFr: "Indonésie" },
  { code: "KUL", city: "Kuala Lumpur", cityFr: "Kuala Lumpur", country: "Malaysia", countryFr: "Malaisie" },
  { code: "SGN", city: "Ho Chi Minh City", cityFr: "Hô Chi Minh-Ville", country: "Vietnam", countryFr: "Viêt Nam" },
  { code: "HAN", city: "Hanoi", cityFr: "Hanoï", country: "Vietnam", countryFr: "Viêt Nam" },
  { code: "CEB", city: "Cebu", cityFr: "Cebu", country: "Philippines", countryFr: "Philippines" },
  { code: "HKT", city: "Phuket", cityFr: "Phuket", country: "Thailand", countryFr: "Thaïlande" },
  { code: "CZM", city: "Cozumel", cityFr: "Cozumel", country: "Mexico", countryFr: "Mexique" },
  { code: "HUX", city: "Huatulco", cityFr: "Huatulco", country: "Mexico", countryFr: "Mexique" },
  { code: "ACA", city: "Acapulco", cityFr: "Acapulco", country: "Mexico", countryFr: "Mexique" },
  { code: "ZIH", city: "Ixtapa", cityFr: "Ixtapa", country: "Mexico", countryFr: "Mexique" },
  { code: "MID", city: "Mérida", cityFr: "Mérida", country: "Mexico", countryFr: "Mexique" },
  { code: "GDL", city: "Guadalajara", cityFr: "Guadalajara", country: "Mexico", countryFr: "Mexique" },
  { code: "MTY", city: "Monterrey", cityFr: "Monterrey", country: "Mexico", countryFr: "Mexique" },
  { code: "HAV", city: "Havana", cityFr: "La Havane", country: "Cuba", countryFr: "Cuba" },
  { code: "CCC", city: "Cayo Coco", cityFr: "Cayo Coco", country: "Cuba", countryFr: "Cuba" },
  { code: "HOG", city: "Holguín", cityFr: "Holguín", country: "Cuba", countryFr: "Cuba" },
  { code: "AUA", city: "Aruba", cityFr: "Aruba", country: "Aruba", countryFr: "Aruba" },
  { code: "CUR", city: "Curaçao", cityFr: "Curaçao", country: "Curaçao", countryFr: "Curaçao" },
  { code: "SJU", city: "San Juan", cityFr: "San Juan", country: "Puerto Rico", countryFr: "Porto Rico" },
  { code: "POP", city: "Puerto Plata", cityFr: "Puerto Plata", country: "Dominican Republic", countryFr: "République dominicaine" },
  { code: "SDQ", city: "Santo Domingo", cityFr: "Saint-Domingue", country: "Dominican Republic", countryFr: "République dominicaine" },
  { code: "BGI", city: "Bridgetown", cityFr: "Bridgetown", country: "Barbados", countryFr: "Barbade" },
  { code: "KIN", city: "Kingston", cityFr: "Kingston", country: "Jamaica", countryFr: "Jamaïque" },
  { code: "GCM", city: "Grand Cayman", cityFr: "Grand Cayman", country: "Cayman Islands", countryFr: "Îles Caïmans" },
  { code: "PLS", city: "Providenciales", cityFr: "Providenciales", country: "Turks and Caicos", countryFr: "Îles Turques-et-Caïques" },
  { code: "LIR", city: "Liberia", cityFr: "Liberia", country: "Costa Rica", countryFr: "Costa Rica" },
  { code: "SJO", city: "San José", cityFr: "San José", country: "Costa Rica", countryFr: "Costa Rica" },
  { code: "PTY", city: "Panama City", cityFr: "Panama", country: "Panama", countryFr: "Panama" },
  { code: "CTG", city: "Cartagena", cityFr: "Carthagène", country: "Colombia", countryFr: "Colombie" },
  { code: "BOG", city: "Bogotá", cityFr: "Bogotá", country: "Colombia", countryFr: "Colombie" },
  { code: "MDE", city: "Medellín", cityFr: "Medellín", country: "Colombia", countryFr: "Colombie" },
  { code: "LIM", city: "Lima", cityFr: "Lima", country: "Peru", countryFr: "Pérou" },
  { code: "UIO", city: "Quito", cityFr: "Quito", country: "Ecuador", countryFr: "Équateur" },
  { code: "GIG", city: "Rio de Janeiro", cityFr: "Rio de Janeiro", country: "Brazil", countryFr: "Brésil" },
  { code: "GRU", city: "São Paulo", cityFr: "São Paulo", country: "Brazil", countryFr: "Brésil" },
  { code: "EZE", city: "Buenos Aires", cityFr: "Buenos Aires", country: "Argentina", countryFr: "Argentine" },
  { code: "SCL", city: "Santiago", cityFr: "Santiago", country: "Chile", countryFr: "Chili" },
  { code: "KEF", city: "Reykjavík", cityFr: "Reykjavík", country: "Iceland", countryFr: "Islande" },
  { code: "WAW", city: "Warsaw", cityFr: "Varsovie", country: "Poland", countryFr: "Pologne" },
  { code: "PRG", city: "Prague", cityFr: "Prague", country: "Czechia", countryFr: "Tchéquie" },
  { code: "BUD", city: "Budapest", cityFr: "Budapest", country: "Hungary", countryFr: "Hongrie" },
  { code: "OPO", city: "Porto", cityFr: "Porto", country: "Portugal", countryFr: "Portugal" },
  { code: "ORY", city: "Paris", cityFr: "Paris", country: "France", countryFr: "France" },
  { code: "STN", city: "London", cityFr: "Londres", country: "United Kingdom", countryFr: "Royaume-Uni" },
  { code: "OGG", city: "Maui", cityFr: "Maui", country: "United States", countryFr: "États-Unis" },
  { code: "KOA", city: "Kona", cityFr: "Kona", country: "United States", countryFr: "États-Unis" },
];

function canadianAsDestinations(): Destination[] {
  return CANADIAN_AIRPORTS.map((a) => ({
    code: a.code,
    city: a.city,
    cityFr: a.cityFr,
    country: "Canada",
    countryFr: "Canada",
    name: a.name,
    nameFr: a.nameFr,
  }));
}

function uniqueDestinations(...lists: Destination[][]): Destination[] {
  const seen = new Set<string>();
  const out: Destination[] = [];
  for (const list of lists) {
    for (const d of list) {
      const code = d.code.toUpperCase();
      if (seen.has(code)) continue;
      seen.add(code);
      out.push(d);
    }
  }
  return out;
}

export const ALL_DESTINATIONS: Destination[] = uniqueDestinations(
  POPULAR_DESTINATIONS,
  MORE_DESTINATIONS,
  WORLD_PASSENGER_AIRPORTS,
  canadianAsDestinations()
);

export const FEATURED_DESTINATIONS = POPULAR_DESTINATIONS.slice(0, 16).map((d) => d.code);

function destToOrigin(d: Destination): Airport {
  return {
    code: d.code,
    city: d.city,
    cityFr: d.cityFr,
    name: d.name || d.city,
    nameFr: d.nameFr || d.cityFr,
    province: d.country,
    country: d.country,
    countryFr: d.countryFr,
  };
}

const CANADIAN_CODES = new Set(CANADIAN_AIRPORTS.map((a) => a.code.toUpperCase()));

export const WORLD_ORIGIN_AIRPORTS: Airport[] = ALL_DESTINATIONS.filter(
  (d) => !CANADIAN_CODES.has(d.code.toUpperCase())
).map(destToOrigin);

function haystackAirport(a: Airport) {
  return [a.code, a.city, a.cityFr, a.name, a.nameFr, a.province, a.country, a.countryFr].filter(
    (x): x is string => Boolean(x)
  );
}

function haystackDestination(d: Destination) {
  return [d.code, d.city, d.cityFr, d.country, d.countryFr, d.name, d.nameFr, ...(d.aliases || [])].filter(
    (x): x is string => Boolean(x)
  );
}

function matches(keys: string[], s: string) {
  return keys.some((k) => k.toLowerCase().includes(s));
}

function rankScore(keys: string[], s: string) {
  const lower = keys.map((k) => k.toLowerCase());
  const code = lower[0] || "";
  if (code === s) return 0;
  if (code.startsWith(s)) return 1;
  if (lower.some((k) => k === s)) return 2;
  if (lower.some((k) => k.startsWith(s))) return 3;
  return 4;
}

export function searchCanadianAirports(q: string): Airport[] {
  const s = q
    .replace(/\([^)]*\)/g, " ")
    .trim()
    .toLowerCase();
  if (!s) return CANADIAN_AIRPORTS.filter((a) => a.major);
  return CANADIAN_AIRPORTS.filter((a) => matches(haystackAirport(a), s))
    .sort((a, b) => rankScore(haystackAirport(a), s) - rankScore(haystackAirport(b), s))
    .slice(0, 20);
}

/** Empty query: Canadian majors. Typed query: Canada first, then the rest of the world. */
export function searchOriginAirports(q: string): Airport[] {
  const s = q
    .replace(/\([^)]*\)/g, " ")
    .trim()
    .toLowerCase();
  if (!s) return CANADIAN_AIRPORTS.filter((a) => a.major);
  const canadian = searchCanadianAirports(s);
  const world = WORLD_ORIGIN_AIRPORTS.filter((a) => matches(haystackAirport(a), s)).sort(
    (a, b) => rankScore(haystackAirport(a), s) - rankScore(haystackAirport(b), s)
  );
  const seen = new Set(canadian.map((a) => a.code.toUpperCase()));
  const out = [...canadian];
  for (const a of world) {
    if (seen.has(a.code.toUpperCase())) continue;
    seen.add(a.code.toUpperCase());
    out.push(a);
    if (out.length >= 20) break;
  }
  return out;
}

export function searchDestinations(q: string): Destination[] {
  const s = q.trim().toLowerCase();
  if (!s) return POPULAR_DESTINATIONS;
  return ALL_DESTINATIONS.filter((d) => matches(haystackDestination(d), s))
    .sort((a, b) => rankScore(haystackDestination(a), s) - rankScore(haystackDestination(b), s))
    .slice(0, 20);
}

export function getAirport(code: string) {
  const c = code.toUpperCase();
  const local = CANADIAN_AIRPORTS.find((a) => a.code === c);
  if (local) return local;
  const world = WORLD_ORIGIN_AIRPORTS.find((a) => a.code.toUpperCase() === c);
  if (world) return world;
  const dest = ALL_DESTINATIONS.find((d) => d.code.toUpperCase() === c);
  return dest ? destToOrigin(dest) : undefined;
}

export function getDestination(code: string) {
  const c = code.toUpperCase();
  return ALL_DESTINATIONS.find((d) => d.code === c);
}

export function isCanadianAirport(code: string) {
  return CANADIAN_AIRPORTS.some((a) => a.code.toUpperCase() === code.toUpperCase());
}
