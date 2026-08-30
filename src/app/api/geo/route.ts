import { NextRequest, NextResponse } from "next/server";
import { FALLBACK_ORIGIN, isPrivateIp, nearestHub, originFromCode } from "@/lib/hubs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function header(req: NextRequest, name: string) {
  return (req.headers.get(name) || "").trim();
}

function decodeCity(raw: string) {
  if (!raw) return "";
  try {
    return decodeURIComponent(raw.replace(/\+/g, " "));
  } catch {
    return raw;
  }
}

function clientIp(req: NextRequest) {
  const xff = header(req, "x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return header(req, "x-real-ip") || header(req, "cf-connecting-ip") || header(req, "x-vercel-forwarded-for");
}

async function lookupIp(ip: string) {
  if (!ip || isPrivateIp(ip)) return null;
  try {
    const res = await fetch(`https://ipwho.is/${encodeURIComponent(ip)}?fields=success,city,region,region_code,latitude,longitude,country_code`, {
      headers: { Accept: "application/json" },
      cache: "no-store",
    });
    if (!res.ok) return null;
    const json = (await res.json()) as {
      success?: boolean;
      city?: string;
      region?: string;
      region_code?: string;
      latitude?: number;
      longitude?: number;
    };
    if (!json?.success) return null;
    return {
      lat: json.latitude,
      lng: json.longitude,
      city: json.city,
      region: json.region_code || json.region,
    };
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  const lat = Number(header(req, "x-vercel-ip-latitude") || header(req, "cf-iplatitude"));
  const lng = Number(header(req, "x-vercel-ip-longitude") || header(req, "cf-iplongitude"));
  const city = decodeCity(header(req, "x-vercel-ip-city") || header(req, "cf-ipcity"));
  const region = header(req, "x-vercel-ip-country-region") || header(req, "cf-region-code") || header(req, "cf-region");

  const hasCoords = Number.isFinite(lat) && Number.isFinite(lng) && lat !== 0 && lng !== 0;
  if (hasCoords || city || region) {
    const origin = nearestHub({
      lat: hasCoords ? lat : undefined,
      lng: hasCoords ? lng : undefined,
      city,
      region,
    });
    return NextResponse.json({ ok: true, origin });
  }

  const looked = await lookupIp(clientIp(req));
  if (looked) {
    return NextResponse.json({ ok: true, origin: nearestHub(looked) });
  }

  return NextResponse.json({ ok: true, origin: originFromCode(FALLBACK_ORIGIN.code, "fallback") });
}
