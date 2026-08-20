import type { Booking, NormalizedOffer } from "./types";

const offers = new Map<string, NormalizedOffer>();
const bookings = new Map<string, Booking>();

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
