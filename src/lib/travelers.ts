import type { SearchQuery } from "@/lib/deeplinks";

export type TravelerParty = {
  id: string;
  name: string;
  adults: number;
  children: number;
  childAges: number[];
  cabin?: SearchQuery["cabin"];
  rooms?: number;
};

export type SearchPrefs = {
  homeAirport?: string;
  cabin?: SearchQuery["cabin"];
  autoPrefill?: boolean;
  defaultPartyId?: string;
};

export const PREFILL_KEY = "airstay.prefillParty";
export const MAX_PARTIES = 6;

export function normalizeParty(input: Partial<TravelerParty> & { name: string }): TravelerParty {
  const adults = Math.min(9, Math.max(1, Number(input.adults) || 1));
  const children = Math.min(8, Math.max(0, Number(input.children) || 0));
  const ages = (input.childAges || [])
    .map((n) => Number(n))
    .filter((n) => Number.isFinite(n) && n >= 0 && n <= 17)
    .slice(0, children);
  while (ages.length < children) ages.push(2);
  return {
    id: input.id || crypto.randomUUID(),
    name: input.name.trim().slice(0, 40) || "Group",
    adults,
    children,
    childAges: ages,
    cabin: input.cabin,
    rooms: Math.min(8, Math.max(1, Number(input.rooms) || 1)),
  };
}

export function queuePrefill(party: TravelerParty) {
  try {
    sessionStorage.setItem(PREFILL_KEY, JSON.stringify(party));
  } catch {
    /* ignore */
  }
}

export function consumePrefill(): TravelerParty | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(PREFILL_KEY);
    if (!raw) return null;
    sessionStorage.removeItem(PREFILL_KEY);
    return normalizeParty(JSON.parse(raw));
  } catch {
    return null;
  }
}

export function partyHref(party: TravelerParty, from?: string) {
  const p = new URLSearchParams();
  p.set("kind", "flights");
  if (from) p.set("from", from);
  p.set("adults", String(party.adults));
  if (party.children) p.set("children", String(party.children));
  if (party.childAges.length) p.set("childAges", party.childAges.join(","));
  if (party.cabin) p.set("cabin", party.cabin);
  if (party.rooms) p.set("rooms", String(party.rooms));
  p.set("prefill", party.id);
  return `/results?${p.toString()}`;
}
