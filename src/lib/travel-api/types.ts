export type Cabin = "economy" | "premium" | "business" | "first";

export type Money = {
  amount: number;
  currency: "CAD";
  per: "person" | "room" | "day" | "package";
};

export type NormalizedOffer = {
  id: string;
  type: "flight" | "hotel" | "car" | "package";
  supplier: string;
  supplierOfferId?: string;
  title: string;
  subtitle?: string;
  image?: string;
  imageAlt?: string;
  price?: Money;
  deepLink: string;
  bookable: boolean;
  expiresAt?: string;
  details: Record<string, unknown>;
};

export type SearchRequest = {
  type: NormalizedOffer["type"];
  origin?: string;
  destination?: string;
  destinationName?: string;
  departDate?: string;
  returnDate?: string;
  adults?: number;
  children?: number;
  childAges?: number[];
  rooms?: number;
  cabin?: Cabin;
  trip?: "roundtrip" | "oneway";
};

export type SearchResponse = {
  success: true;
  data: {
    searchId: string;
    currency: "CAD";
    offers: NormalizedOffer[];
  };
  meta: {
    elapsedMs: number;
    providers: string[];
    generatedAt: string;
  };
};

export type BookingPassenger = {
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth?: string;
};

export type Booking = {
  id: string;
  status: "quoted" | "pending_supplier" | "cancelled";
  createdAt: string;
  offer: NormalizedOffer;
  passengers: BookingPassenger[];
  contactEmail: string;
  currency: "CAD";
  total?: Money;
  confirmationUrl: string;
  notes: string;
};

export type ApiError = {
  success: false;
  error: { code: string; message: string };
};
