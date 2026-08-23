import type { Booking, NormalizedOffer } from "./types";

const offers = new Map<string, NormalizedOffer>();
const bookings = new Map<string, Booking>();

export type SearchLog = {
  id: string;
  at: string;
  kind: string;
  origin?: string;
  destination?: string;
  depart?: string;
  returnDate?: string;
  adults?: number;
  results: number;
  providers: string[];
  source?: string;
};

const searches: SearchLog[] = [];

export function putOffers(list: NormalizedOffer[]) {
  for (const offer of list) offers.set(offer.id, offer);
}

export function getOffer(id: string) {
  return offers.get(id);
}

export function putBooking(booking: Booking) {
  bookings.set(booking.id, booking);
  return booking;
}

export function getBooking(id: string) {
  return bookings.get(id);
}

export function listBookings() {
  return [...bookings.values()].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function logSearch(entry: Omit<SearchLog, "id" | "at">) {
  searches.unshift({
    id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    at: new Date().toISOString(),
    ...entry,
  });
  if (searches.length > 250) searches.length = 250;
}

export function listSearches() {
  return searches;
}

export function stats() {
  return {
    searches: searches.length,
    bookings: bookings.size,
    offers: offers.size,
  };
}
