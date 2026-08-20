import type { SearchQuery } from "@/lib/deeplinks";
import { searchLocation } from "@/lib/geo";
import { toCad } from "@/lib/fx";

const BASE = "https://api.duffel.com";
const VERSION = "v2";

export function duffelConfigured() {
  return Boolean(process.env.DUFFEL_ACCESS_TOKEN);
}

function token() {
  return process.env.DUFFEL_ACCESS_TOKEN || "";
}

type DuffelError = { errors?: Array<{ message?: string; title?: string; code?: string }> };

async function duffel<T>(path: string, init?: RequestInit): Promise<T> {
  const key = token();
  if (!key) throw new Error("duffel_not_configured");
  const headers: Record<string, string> = {
    Accept: "application/json",
    "Duffel-Version": VERSION,
    Authorization: `Bearer ${key}`,
    ...(init?.headers as Record<string, string> | undefined),
  };
  if (init?.body) headers["Content-Type"] = "application/json";
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers,
    cache: "no-store",
  });
  const json = (await res.json().catch(() => ({}))) as T & DuffelError;
  if (!res.ok) {
    const msg = json.errors?.[0]?.message || json.errors?.[0]?.title || `duffel_${res.status}`;
    throw new Error(msg);
  }
  return json;
}

export type DuffelStay = {
  searchResultId: string;
  accommodationId: string;
  name: string;
  description?: string;
  address: string;
  city: string;
  image?: string;
  stars: number;
  reviewScore?: number;
  reviewCount?: number;
  stayCad: number;
  currency: string;
  board?: string;
  amenities: string[];
  adultsOnly: boolean;
};

export type DuffelRate = {
  rateId: string;
  roomName: string;
  board: string;
  totalCad: number;
  totalAmount: string;
  totalCurrency: string;
  paymentType?: string;
  refundable: boolean;
  cancellation?: string;
};

export type DuffelFlight = {
  offerId: string;
  passengerIds: string[];
  airline?: string;
  airlineName?: string;
  flightNumber?: string;
  priceCad: number;
  totalCad: number;
  stops: number;
  departAt?: string;
  returnAt?: string;
  durationMin?: number;
  cabin?: string;
};

export type StayQuote = {
  quoteId: string;
  stayCad: number;
  totalAmount: string;
  totalCurrency: string;
  hotelName: string;
  roomName?: string;
  board?: string;
  checkIn: string;
  checkOut: string;
  image?: string;
  address?: string;
  cancellation?: string;
};

function asObj(v: unknown): Record<string, unknown> {
  return v && typeof v === "object" ? (v as Record<string, unknown>) : {};
}

function str(v: unknown, fallback = "") {
  return typeof v === "string" ? v : fallback;
}

function num(v: unknown) {
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? n : 0;
}

function guestsPayload(q: SearchQuery) {
  const guests: Array<{ type: "adult" | "child"; age?: number }> = [];
  const adults = Math.max(1, q.adults || 1);
  for (let i = 0; i < adults; i++) guests.push({ type: "adult" });
  const children = q.children || 0;
  const ages = q.childAges || [];
  for (let i = 0; i < children; i++) {
    const age = ages[i] ?? 8;
    guests.push({ type: "child", age });
  }
  return guests;
}

function boardLabel(board?: string) {
  switch (board) {
    case "all_inclusive":
      return "All inclusive";
    case "full_board":
      return "Full board";
    case "half_board":
      return "Half board";
    case "breakfast":
      return "Breakfast included";
    case "room_only":
      return "Room only";
    default:
      return board || "";
  }
}

function amenityTypes(acc: Record<string, unknown>) {
  const list = Array.isArray(acc.amenities) ? acc.amenities : [];
  return list.map((a) => str(asObj(a).type || asObj(a).description)).filter(Boolean);
}

function firstPhoto(acc: Record<string, unknown>) {
  const photos = Array.isArray(acc.photos) ? acc.photos : [];
  return str(asObj(photos[0]).url) || undefined;
}

function addressOf(acc: Record<string, unknown>) {
  const loc = asObj(acc.location);
  const addr = asObj(loc.address);
  return [str(addr.line_one), str(addr.city_name), str(addr.country_code)].filter(Boolean).join(", ");
}

export async function searchStays(q: SearchQuery): Promise<DuffelStay[]> {
  if (!duffelConfigured() || !q.depart || !q.returnDate) return [];
  const loc = searchLocation(q);
  if (!loc) return [];
  const json = await duffel<{ data?: { results?: unknown[] } }>("/stays/search", {
    method: "POST",
    body: JSON.stringify({
      data: {
        rooms: Math.max(1, q.rooms || 1),
        check_in_date: q.depart,
        check_out_date: q.returnDate,
        guests: guestsPayload(q),
        location: {
          radius: loc.radius,
          geographic_coordinates: { latitude: loc.latitude, longitude: loc.longitude },
        },
      },
    }),
  });
  const results = json.data?.results || [];
  const out: DuffelStay[] = [];
  for (const row of results) {
    const r = asObj(row);
    const acc = asObj(r.accommodation);
    const name = str(acc.name);
    const amount = num(r.cheapest_rate_total_amount);
    const currency = str(r.cheapest_rate_currency, "USD");
    if (!name || amount <= 0) continue;
    const rooms = Array.isArray(acc.rooms) ? acc.rooms : [];
    const firstRoom = asObj(rooms[0]);
    const rates = Array.isArray(firstRoom.rates) ? firstRoom.rates : [];
    const cheapest = asObj(rates[0]);
    const amenities = amenityTypes(acc);
    const board = str(cheapest.board_type);
    const stayCad = await toCad(amount, currency);
    out.push({
      searchResultId: str(r.id),
      accommodationId: str(acc.id),
      name,
      description: str(acc.description) || undefined,
      address: addressOf(acc),
      city: str(asObj(asObj(acc.location).address).city_name, loc.label),
      image: firstPhoto(acc),
      stars: Math.max(1, Math.min(5, Math.round(num(acc.rating) || 4))),
      reviewScore: acc.review_score != null ? num(acc.review_score) : undefined,
      reviewCount: acc.review_count != null ? num(acc.review_count) : undefined,
      stayCad,
      currency,
      board: boardLabel(board) || undefined,
      amenities,
      adultsOnly: /adult/i.test(name + " " + str(acc.description)),
    });
  }
  return out.sort((a, b) => {
    const ai = /all inclusive/i.test(`${a.name} ${a.board}`) ? 0 : 1;
    const bi = /all inclusive/i.test(`${b.name} ${b.board}`) ? 0 : 1;
    if (ai !== bi) return ai - bi;
    return a.stayCad - b.stayCad;
  });
}

export async function fetchStayRates(searchResultId: string): Promise<{
  hotelName: string;
  image?: string;
  address?: string;
  checkIn?: string;
  checkOut?: string;
  rates: DuffelRate[];
}> {
  const json = await duffel<{ data?: Record<string, unknown> }>(
    `/stays/search_results/${encodeURIComponent(searchResultId)}/actions/fetch_all_rates`,
    { method: "POST" }
  );
  const data = asObj(json.data);
  const acc = asObj(data.accommodation);
  const rooms = Array.isArray(acc.rooms) ? acc.rooms : [];
  const rates: DuffelRate[] = [];
  for (const room of rooms) {
    const rm = asObj(room);
    const roomName = str(rm.name, "Room");
    for (const rate of Array.isArray(rm.rates) ? rm.rates : []) {
      const rt = asObj(rate);
      const amount = num(rt.total_amount);
      const currency = str(rt.total_currency, "USD");
      if (!str(rt.id) || amount <= 0) continue;
      const timeline = Array.isArray(rt.cancellation_timeline) ? rt.cancellation_timeline : [];
      const first = asObj(timeline[0]);
      rates.push({
        rateId: str(rt.id),
        roomName,
        board: boardLabel(str(rt.board_type)),
        totalCad: await toCad(amount, currency),
        totalAmount: str(rt.total_amount),
        totalCurrency: currency,
        paymentType: str(rt.payment_type) || undefined,
        refundable: num(first.refund_amount) > 0,
        cancellation: str(first.before) || undefined,
      });
    }
  }
  rates.sort((a, b) => {
    const ai = /all inclusive/i.test(a.board) ? 0 : 1;
    const bi = /all inclusive/i.test(b.board) ? 0 : 1;
    if (ai !== bi) return ai - bi;
    return a.totalCad - b.totalCad;
  });
  return {
    hotelName: str(acc.name),
    image: firstPhoto(acc),
    address: addressOf(acc),
    checkIn: str(data.check_in_date) || undefined,
    checkOut: str(data.check_out_date) || undefined,
    rates,
  };
}

export async function createStayQuote(rateId: string): Promise<StayQuote> {
  const json = await duffel<{ data?: Record<string, unknown> }>("/stays/quotes", {
    method: "POST",
    body: JSON.stringify({ data: { rate_id: rateId } }),
  });
  const data = asObj(json.data);
  const acc = asObj(data.accommodation);
  const rooms = Array.isArray(acc.rooms) ? acc.rooms : [];
  const room = asObj(rooms[0]);
  const rate = asObj(Array.isArray(room.rates) ? room.rates[0] : {});
  const amount = num(data.total_amount);
  const currency = str(data.total_currency, "USD");
  return {
    quoteId: str(data.id),
    stayCad: await toCad(amount, currency),
    totalAmount: str(data.total_amount),
    totalCurrency: currency,
    hotelName: str(acc.name),
    roomName: str(room.name) || undefined,
    board: boardLabel(str(rate.board_type)) || undefined,
    checkIn: str(data.check_in_date),
    checkOut: str(data.check_out_date),
    image: firstPhoto(acc),
    address: addressOf(acc),
    cancellation: str(asObj(Array.isArray(rate.cancellation_timeline) ? rate.cancellation_timeline[0] : undefined).before) || undefined,
  };
}

export async function createStayBooking(input: {
  quoteId: string;
  email: string;
  phone: string;
  guests: Array<{ given_name: string; family_name: string; born_on?: string }>;
  specialRequests?: string;
}) {
  const json = await duffel<{ data?: Record<string, unknown> }>("/stays/bookings", {
    method: "POST",
    body: JSON.stringify({
      data: {
        quote_id: input.quoteId,
        email: input.email,
        phone_number: input.phone,
        guests: input.guests,
        accommodation_special_requests: input.specialRequests || undefined,
        metadata: { source: "airstay" },
      },
    }),
  });
  const data = asObj(json.data);
  const acc = asObj(data.accommodation);
  return {
    bookingId: str(data.id),
    reference: str(data.reference) || str(data.id),
    status: str(data.status, "confirmed"),
    hotelName: str(acc.name),
    checkIn: str(data.check_in_date),
    checkOut: str(data.check_out_date),
    email: str(data.email),
    phone: str(data.phone_number),
  };
}

function cabinClass(cabin?: SearchQuery["cabin"]) {
  if (cabin === "premium") return "premium_economy";
  if (cabin === "business") return "business";
  if (cabin === "first") return "first";
  return "economy";
}

export async function searchFlights(q: SearchQuery): Promise<DuffelFlight[]> {
  if (!duffelConfigured() || !q.from || !q.to || !q.depart) return [];
  const passengers: Array<{ type?: "adult"; age?: number }> = [];
  const adults = Math.max(1, q.adults || 1);
  for (let i = 0; i < adults; i++) passengers.push({ type: "adult" });
  const children = q.children || 0;
  const ages = q.childAges || [];
  for (let i = 0; i < children; i++) passengers.push({ age: ages[i] ?? 8 });

  const slices: Array<{ origin: string; destination: string; departure_date: string }> = [
    { origin: q.from.toUpperCase(), destination: q.to.toUpperCase(), departure_date: q.depart },
  ];
  if (q.trip !== "oneway" && q.returnDate) {
    slices.push({
      origin: q.to.toUpperCase(),
      destination: q.from.toUpperCase(),
      departure_date: q.returnDate,
    });
  }

  const json = await duffel<{ data?: { offers?: unknown[]; passengers?: unknown[] } }>(
    "/air/offer_requests?return_offers=true&supplier_timeout=8000",
    {
      method: "POST",
      body: JSON.stringify({
        data: {
          slices,
          passengers,
          cabin_class: cabinClass(q.cabin),
        },
      }),
    }
  );
  const pax = (json.data?.passengers || []).map((p) => str(asObj(p).id)).filter(Boolean);
  const offers = json.data?.offers || [];
  const paxCount = Math.max(1, passengers.length);
  const out: DuffelFlight[] = [];
  for (const row of offers.slice(0, 20)) {
    const o = asObj(row);
    const amount = num(o.total_amount);
    const currency = str(o.total_currency, "CAD");
    if (!str(o.id) || amount <= 0) continue;
    const offerSlices = Array.isArray(o.slices) ? o.slices : [];
    const firstSlice = asObj(offerSlices[0]);
    const lastSlice = asObj(offerSlices[offerSlices.length - 1] || offerSlices[0]);
    const segs = Array.isArray(firstSlice.segments) ? firstSlice.segments : [];
    const firstSeg = asObj(segs[0]);
    const owner = asObj(o.owner);
    const marketing = asObj(firstSeg.marketing_carrier);
    const airline = str(marketing.iata_code) || str(owner.iata_code);
    const airlineName = str(marketing.name) || str(owner.name) || airline;
    const totalCad = await toCad(amount, currency);
    const duration = segs.reduce((sum, s) => sum + parseIsoDuration(str(asObj(s).duration)), 0);
    const lastSegs = Array.isArray(lastSlice.segments) ? lastSlice.segments : [];
    const lastFirst = asObj(lastSegs[0]);
    out.push({
      offerId: str(o.id),
      passengerIds: pax,
      airline,
      airlineName,
      flightNumber: `${airline}${str(firstSeg.marketing_carrier_flight_number)}`.replace(/null|undefined/g, ""),
      priceCad: Math.round(totalCad / paxCount),
      totalCad,
      stops: Math.max(0, segs.length - 1),
      departAt: str(firstSeg.departing_at) || undefined,
      returnAt: str(lastFirst.departing_at) || undefined,
      durationMin: duration || undefined,
      cabin: str(o.cabin_class) || undefined,
    });
  }
  return out.sort((a, b) => a.priceCad - b.priceCad).slice(0, 12);
}

function parseIsoDuration(iso: string) {
  const m = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?/i);
  if (!m) return 0;
  return Number(m[1] || 0) * 60 + Number(m[2] || 0);
}

export function toE164(phone: string) {
  const digits = phone.replace(/[^\d+]/g, "");
  if (digits.startsWith("+") && digits.length >= 11) return digits;
  const d = digits.replace(/\D/g, "");
  if (d.length === 10) return `+1${d}`;
  if (d.length === 11 && d.startsWith("1")) return `+${d}`;
  return digits.startsWith("+") ? digits : `+${d}`;
}
