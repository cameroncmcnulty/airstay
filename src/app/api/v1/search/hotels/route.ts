import { NextRequest } from "next/server";
import { handleSearch } from "@/lib/travel-api/http";

export const runtime = "nodejs";

export function POST(req: NextRequest) {
  return handleSearch(req, "hotel");
}
