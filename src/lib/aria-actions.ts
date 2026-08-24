import { defaultDepart, defaultReturn, queryToParams, type SearchKind } from "@/lib/deeplinks";
import { CANADIAN_AIRPORTS, POPULAR_DESTINATIONS, searchDestinations, type Airport, type Destination } from "@/lib/airports";

export type AriaAction = {
  type: "search" | "page";
  href: string;
  label: string;
};

export const SITE_MAP = `AIRSTAY PAGES (use these exact relative paths)
- / — homepage search (flights, hotels, cars)
- /flights — flight search from Canada
- /stays — hotels worldwide
- /cars — cars at the destination
- /packages — vacation packages (coming soon)
- /deals — featured CAD finds
- /about — who we are
- /contact — say hello
- /account — saved searches (if they have an account)
- /login · /signup
Search results: /results?kind=flights|stays|cars&from=YYZ&to=CUN&toCity=Cancún&depart=YYYY-MM-DD&return=YYYY-MM-DD&adults=1
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

export function inferActions(message: string, locale: "en" | "fr"): AriaAction[] {
  const s = fold(message);
  const actions: AriaAction[] = [];
  const fr = locale === "fr";

  if (/(how (does|do)|comment .*marche|what is airstay|c.?est quoi)/.test(s) || /\bairstay\b/.test(s) && /(work|fee|frais|about)/.test(s)) {
    actions.push({ type: "page", href: "/", label: fr ? "Chercher un voyage" : "Search a trip" });
    actions.push({ type: "page", href: "/about", label: fr ? "À propos" : "About AIRSTAY" });
    return actions;
  }
  if (/(deal|aubaine|cheap|pas cher)/.test(s)) {
    actions.push({ type: "page", href: "/deals", label: fr ? "Voir les aubaines" : "See deals" });
  }
  if (/(surprise|inspire|recommend|where should|nudge|surprend)/.test(s) && !findDest(message)) {
    const month = new Date().getMonth();
    const pick =
      month >= 10 || month <= 2
        ? { to: "CUN", city: "Cancún", cityFr: "Cancún" }
        : month >= 3 && month <= 5
          ? { to: "LIS", city: "Lisbon", cityFr: "Lisbonne" }
          : { to: "LHR", city: "London", cityFr: "Londres" };
    const city = fr ? pick.cityFr : pick.city;
    actions.push({
      type: "search",
      href: buildSearchHref({ kind: "flights", to: pick.to, toCity: city, locale }),
      label: fr ? `Vols vers ${city}` : `Flights to ${city}`,
    });
    actions.push({ type: "page", href: "/deals", label: fr ? "Aubaines du moment" : "Today’s deals" });
    return unique(actions);
  }
  if (/(contact|help|humain|privacy|vie privee)/.test(s) && /(email|write|ecrire|officer)/.test(s)) {
    actions.push({ type: "page", href: "/contact", label: fr ? "Nous écrire" : "Contact us" });
  }

  const dest = findDest(message);
  const origin = canadianOrigin(message);
  const kind = kindFrom(message);

  if (dest && kind === "packages") {
    actions.push({ type: "page", href: "/packages", label: fr ? "Forfaits — bientôt" : "Packages — coming soon" });
    actions.push({
      type: "search",
      href: buildSearchHref({ kind: "stays", to: dest.code, toCity: fr ? dest.cityFr : dest.city, locale }),
      label: fr ? `Hôtels à ${dest.cityFr}` : `Hotels in ${dest.city}`,
    });
    return unique(actions);
  }

  if (dest) {
    const city = fr ? dest.cityFr : dest.city;
    const from = origin?.code;
    if (kind === "cars") {
      actions.push({
        type: "search",
        href: buildSearchHref({ kind: "cars", to: dest.code, toCity: city, locale }),
        label: fr ? `Autos à ${city}` : `Cars in ${city}`,
      });
    } else if (kind === "stays") {
      actions.push({
        type: "search",
        href: buildSearchHref({ kind: "stays", to: dest.code, toCity: city, locale }),
        label: fr ? `Hôtels à ${city}` : `Hotels in ${city}`,
      });
    } else {
      actions.push({
        type: "search",
        href: buildSearchHref({ kind: "flights", from, to: dest.code, toCity: city, locale }),
        label: fr ? `Vols vers ${city}` : `Flights to ${city}`,
      });
      actions.push({
        type: "search",
        href: buildSearchHref({ kind: "stays", to: dest.code, toCity: city, locale }),
        label: fr ? `Hôtels à ${city}` : `Stay in ${city}`,
      });
    }
  } else if (kind === "cars") {
    actions.push({ type: "page", href: "/cars", label: fr ? "Chercher une auto" : "Search cars" });
  } else if (kind === "stays") {
    actions.push({ type: "page", href: "/stays", label: fr ? "Chercher un hôtel" : "Search hotels" });
  } else if (/(flight|vol|fly|partir)/.test(s)) {
    actions.push({ type: "page", href: "/flights", label: fr ? "Chercher un vol" : "Search flights" });
  }

  return unique(actions).slice(0, 3);
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
  const extra = parsed.actions.length ? [] : inferActions(message, locale);
  const actions = unique([...parsed.actions, ...extra]).slice(0, 3);
  return parsed.text + formatFence(actions);
}
