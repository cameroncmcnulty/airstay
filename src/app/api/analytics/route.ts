import { NextRequest, NextResponse } from "next/server";
import { recordEvent } from "@/lib/analytics";
import { getDestination } from "@/lib/airports";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const type = body?.type === "outbound" ? "outbound" : "search";
    const kind = String(body?.kind || "");
    if (!["flights", "stays", "cars", "packages", "esim"].includes(kind)) {
      return NextResponse.json({ ok: false, error: "bad_kind" }, { status: 400 });
    }
    const dest = typeof body.destination === "string" ? getDestination(body.destination) : undefined;
    const event = recordEvent({
      type,
      kind,
      origin: typeof body.origin === "string" ? body.origin : undefined,
      destination: typeof body.destination === "string" ? body.destination : undefined,
      destCity: typeof body.destCity === "string" ? body.destCity : dest?.city,
      destCountry: typeof body.destCountry === "string" ? body.destCountry : dest?.country,
      partner: typeof body.partner === "string" ? body.partner.slice(0, 80) : undefined,
      depart: typeof body.depart === "string" ? body.depart : undefined,
      returnDate: typeof body.returnDate === "string" ? body.returnDate : undefined,
      adults: Number(body.adults) || undefined,
      results: Number(body.results) || undefined,
    });
    return NextResponse.json({ ok: true, id: event.id });
  } catch {
    return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
  }
}
