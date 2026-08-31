import { defaultDepart, defaultReturn, queryToParams, type SearchKind } from "@/lib/deeplinks";
import { CANADIAN_AIRPORTS, POPULAR_DESTINATIONS, searchDestinations, type Airport, type Destination } from "@/lib/airports";

export type AriaAction = {
  type: "search" | "page";
  href: string;
  label: string;
};

export const SITE_MAP = `AIRSTAY PAGES (use these exact relative paths)
- / — homepage search (flights, hotels, cars, eSIM)
- /flights — flight search from Canada
- /stays — hotels worldwide
- /cars — cars at the destination
- /packages — partner vacation packages (Expedia). AIRSTAY’s own packages coming soon
- /esim — eSIM data plans for the destination (Airalo, CAD)
- /about — who we are
- /contact — say hello to a human
- /account — saved searches (if they have an account)
- /login · /signup
- /privacy · /cookies · /terms · /disclosure · /accessibility
Search results: /results?kind=flights|stays|cars|esim&from=YYZ&to=CUN&toCity=Cancún&depart=YYYY-MM-DD&return=YYYY-MM-DD&adults=1
Always include from (Canadian IATA) for flights. Dates default to ~3 weeks out if the traveller did not name any.`;

function fold(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function canadianOrigin(q: string): Airport | undefined {
  const s = fold(q);
  const majors = CANADIAN_AIRPORTS.filter((a) => a.major);
  return majors.find((a) => {
    const keys = [a.code, a.city, a.cityFr].map(fold).filter((k) => k.length >= 3);
    return keys.some((k) => new RegExp(`\\b${k}\\b`, "i").test(s) || s.includes(k));
  });
}

function findDest(q: string): Destination | undefined {
  const s = fold(q);
  const popular = POPULAR_DESTINATIONS.find((d) => {
    const keys = [d.code, d.city, d.cityFr, d.country, ...(d.aliases || [])].map(fold);
    return keys.some((k) => k.length >= 3 && s.includes(k));
  });
  if (popular) return popular;
  const hits = searchDestinations(q);
  return hits[0];
}

function kindFrom(q: string): SearchKind {
  const s = fold(q);
  if (/(esim|e-sim|data.?plan|airalo|holafly|roaming|sim card)/.test(s)) return "esim";
  if (/(car|auto|drive|road.?trip|rental)/.test(s)) return "cars";
  if (/(hotel|stay|resort|all.?inclusive|tout.?inclus|airbnb|room)/.test(s)) return "stays";
  if (/(package|forfait|vacation)/.test(s)) return "packages";
  return "flights";
}

export function buildSearchHref(opts: {
  kind?: SearchKind;
  from?: string;
  to?: string;
  toCity?: string;
  locale?: "en" | "fr";
}) {
  const kind = opts.kind || "flights";
  if (kind === "packages") return "/packages";
  return `/results?${queryToParams({
    kind,
    from: opts.from || (kind === "flights" ? "YYZ" : undefined),
    to: opts.to,
    toCity: opts.toCity,
    depart: defaultDepart(),
    returnDate: defaultReturn(),
    adults: 1,
    trip: "roundtrip",
  })}`;
}

function destActions(dest: Destination, origin: Airport | undefined, kind: SearchKind, fr: boolean): AriaAction[] {
  const city = fr ? dest.cityFr : dest.city;
  const from = origin?.code;
  const actions: AriaAction[] = [];
  if (kind === "cars") {
    actions.push({
      type: "search",
      href: buildSearchHref({ kind: "cars", to: dest.code, toCity: city }),
      label: fr ? `Autos à ${city}` : `Cars in ${city}`,
    });
  } else if (kind === "stays") {
    actions.push({
      type: "search",
      href: buildSearchHref({ kind: "stays", to: dest.code, toCity: city }),
      label: fr ? `Hôtels à ${city}` : `Hotels in ${city}`,
    });
  } else if (kind === "esim") {
    actions.push({
      type: "search",
      href: buildSearchHref({ kind: "esim", to: dest.code, toCity: city }),
      label: fr ? `eSIM pour ${city}` : `eSIM for ${city}`,
    });
    actions.push({ type: "page", href: "/esim", label: fr ? "Comparer les eSIM" : "Compare eSIMs" });
  } else if (kind === "packages") {
    actions.push({ type: "page", href: "/packages", label: fr ? "Forfaits vacances" : "Vacation packages" });
    actions.push({
      type: "search",
      href: buildSearchHref({ kind: "stays", to: dest.code, toCity: city }),
      label: fr ? `Hôtels à ${city}` : `Hotels in ${city}`,
    });
  } else {
    actions.push({
      type: "search",
      href: buildSearchHref({ kind: "flights", from, to: dest.code, toCity: city }),
      label: fr ? `Vols vers ${city}` : `Flights to ${city}`,
    });
    actions.push({
      type: "search",
      href: buildSearchHref({ kind: "stays", to: dest.code, toCity: city }),
      label: fr ? `Hôtels à ${city}` : `Stay in ${city}`,
    });
  }
  if (kind === "flights" || kind === "stays") {
    actions.push({
      type: "search",
      href: buildSearchHref({ kind: "esim", to: dest.code, toCity: city }),
      label: fr ? `eSIM ${city}` : `eSIM for ${city}`,
    });
  }
  return actions;
}

export function inferActions(message: string, locale: "en" | "fr"): AriaAction[] {
  const s = fold(message);
  const actions: AriaAction[] = [];
  const fr = locale === "fr";
  if (/^(hi|hey|hello|yo|sup|salut|bonjour|allo|thanks|thank you|merci|ty|cheers|bye|ok|okay|cool|nice)\b/.test(s) && s.length < 28) {
    return [];
  }

  if (/(privacy|cookie|confidential|vie privee)/.test(s)) {
    actions.push({ type: "page", href: "/privacy", label: fr ? "Confidentialité" : "Privacy" });
    actions.push({ type: "page", href: "/cookies", label: "Cookies" });
    return unique(actions);
  }
  if (/(disclosure|affiliate|how do you make|comment .*gagne)/.test(s)) {
    actions.push({ type: "page", href: "/disclosure", label: fr ? "Divulgation" : "Disclosure" });
  }
  if (/(contact|help|humain|write|ecrire|email us)/.test(s) && /(email|write|ecrire|officer|human|humain|speak)/.test(s)) {
    actions.push({ type: "page", href: "/contact", label: fr ? "Nous écrire" : "Contact us" });
  }
  if (/(sign up|signup|create account|creer un compte|log in|login|account|saved search)/.test(s)) {
    actions.push({ type: "page", href: "/signup", label: fr ? "Créer un compte" : "Create account" });
    actions.push({ type: "page", href: "/login", label: fr ? "Connexion" : "Sign in" });
    actions.push({ type: "page", href: "/account", label: fr ? "Compte" : "Account" });
    return unique(actions).slice(0, 4);
  }
  if (/(how (does|do)|comment .*marche|what is airstay|c.?est quoi)/.test(s) || (/\bairstay\b/.test(s) && /(work|fee|frais|about)/.test(s))) {
    actions.push({ type: "page", href: "/", label: fr ? "Chercher un voyage" : "Search a trip" });
    actions.push({ type: "page", href: "/about", label: fr ? "À propos" : "About AIRSTAY" });
    actions.push({ type: "page", href: "/flights", label: fr ? "Vols" : "Flights" });
    actions.push({ type: "page", href: "/packages", label: fr ? "Forfaits" : "Packages" });
    return unique(actions).slice(0, 4);
  }
  if (/(accessibility|accessibilite|wheelchair|fauteuil)/.test(s)) {
    actions.push({ type: "page", href: "/accessibility", label: fr ? "Accessibilité" : "Accessibility" });
  }

  if (/(surprise|inspire|recommend|where should|nudge|surprend|bored|ennui)/.test(s) && !findDest(message)) {
    const month = new Date().getMonth();
    const pick =
      month >= 10 || month <= 2
        ? { to: "CUN", city: "Cancún", cityFr: "Cancún" }
        : month >= 3 && month <= 5
          ? { to: "LIS", city: "Lisbon", cityFr: "Lisbonne" }
          : month >= 6 && month <= 8
            ? { to: "LHR", city: "London", cityFr: "Londres" }
            : { to: "NRT", city: "Tokyo", cityFr: "Tokyo" };
    const city = fr ? pick.cityFr : pick.city;
    actions.push({
      type: "search",
      href: buildSearchHref({ kind: "flights", to: pick.to, toCity: city, locale }),
      label: fr ? `Vols vers ${city}` : `Flights to ${city}`,
    });
    actions.push({
      type: "search",
      href: buildSearchHref({ kind: "stays", to: pick.to, toCity: city, locale }),
      label: fr ? `Hôtels à ${city}` : `Stay in ${city}`,
    });
    actions.push({ type: "page", href: "/", label: fr ? "Chercher un voyage" : "Search a trip" });
    return unique(actions);
  }

  const dest = findDest(message);
  const origin = canadianOrigin(message);
  const kind = kindFrom(message);

  if (dest) {
    actions.push(...destActions(dest, origin, kind, fr));
  } else if (kind === "cars") {
    actions.push({ type: "page", href: "/cars", label: fr ? "Chercher une auto" : "Search cars" });
  } else if (kind === "stays") {
    actions.push({ type: "page", href: "/stays", label: fr ? "Chercher un hôtel" : "Search hotels" });
  } else if (kind === "esim") {
    actions.push({ type: "page", href: "/esim", label: fr ? "Comparer les eSIM" : "Compare eSIMs" });
  } else if (kind === "packages") {
    actions.push({ type: "page", href: "/packages", label: fr ? "Forfaits vacances" : "Vacation packages" });
    actions.push({ type: "page", href: "/flights", label: fr ? "Chercher un vol" : "Search flights" });
    actions.push({ type: "page", href: "/stays", label: fr ? "Chercher un hôtel" : "Search hotels" });
  } else if (/(flight|vol|fly|partir)/.test(s)) {
    actions.push({ type: "page", href: "/flights", label: fr ? "Chercher un vol" : "Search flights" });
  } else if (/(deal|aubaine|cheap|pas cher|budget)/.test(s)) {
    actions.push({ type: "page", href: "/", label: fr ? "Chercher un voyage" : "Search a trip" });
    actions.push({ type: "page", href: "/packages", label: fr ? "Forfaits partenaires" : "Partner packages" });
  }

  if (!actions.length) {
    actions.push({ type: "page", href: "/flights", label: fr ? "Vols" : "Flights" });
    actions.push({ type: "page", href: "/stays", label: fr ? "Hôtels" : "Hotels" });
    actions.push({ type: "page", href: "/esim", label: "eSIM" });
  }

  return unique(actions).slice(0, 4);
}

function unique(actions: AriaAction[]) {
  const seen = new Set<string>();
  return actions.filter((a) => {
    if (seen.has(a.href)) return false;
    seen.add(a.href);
    return true;
  });
}

export function formatFence(actions: AriaAction[]) {
  if (!actions.length) return "";
  return `\n\n:::aria\n${JSON.stringify({ actions })}\n:::`;
}

export function parseFence(raw: string): { text: string; actions: AriaAction[] } {
  const re = /:::aria\s*([\s\S]*?)\s*:::/g;
  const actions: AriaAction[] = [];
  let text = raw;
  let m: RegExpExecArray | null;
  const blocks: string[] = [];
  while ((m = re.exec(raw))) {
    blocks.push(m[0]);
    try {
      const json = JSON.parse(m[1]);
      const list = Array.isArray(json?.actions) ? json.actions : Array.isArray(json) ? json : [];
      for (const row of list) {
        const href = String(row.href || "");
        if (!href.startsWith("/") || href.startsWith("//")) continue;
        actions.push({ type: row.type === "page" ? "page" : "search", href, label: String(row.label || "Open").slice(0, 80) });
      }
    } catch {
      /* ignore */
    }
  }
  for (const b of blocks) text = text.replace(b, "");
  return { text: text.trim(), actions: unique(actions).slice(0, 4) };
}

export function withActions(text: string, message: string, locale: "en" | "fr") {
  const parsed = parseFence(text);
  const extra = inferActions(message, locale);
  const actions = unique([...parsed.actions, ...extra]).slice(0, 4);
  return parsed.text + formatFence(actions);
}
