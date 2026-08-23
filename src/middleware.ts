import { NextRequest, NextResponse } from "next/server";

function hostOf(req: NextRequest) {
  return (req.headers.get("host") || "").split(":")[0].toLowerCase();
}

function isAdminHost(host: string) {
  return host === "admin.airstay.ca" || host === "admin.localhost" || host.startsWith("admin.");
}

export function middleware(req: NextRequest) {
  const host = hostOf(req);
  const { pathname } = req.nextUrl;
  const prod = process.env.NODE_ENV === "production";

  if (prod && !isAdminHost(host) && pathname.startsWith("/admin")) {
    const dest = new URL("https://admin.airstay.ca/");
    return NextResponse.redirect(dest);
  }

  if (!isAdminHost(host)) return NextResponse.next();

  if (pathname.startsWith("/api/") || pathname.startsWith("/_next") || pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  const url = req.nextUrl.clone();
  if (
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/apple-touch") ||
    pathname.startsWith("/icon") ||
    pathname.startsWith("/logo") ||
    pathname.startsWith("/og.") ||
    pathname.startsWith("/site.webmanifest")
  ) {
    return NextResponse.next();
  }

  if (pathname === "/" || pathname === "") {
    url.pathname = "/admin";
    return NextResponse.rewrite(url);
  }

  url.pathname = "/admin";
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
