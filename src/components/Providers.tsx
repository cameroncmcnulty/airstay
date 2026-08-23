"use client";

import { usePathname } from "next/navigation";
import { AppProvider } from "@/context/AppContext";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { CookieBanner } from "./CookieBanner";
import { AriaChat } from "./AriaChat";
import { TravelpayoutsPixel } from "./TravelpayoutsPixel";
import { useApp } from "@/context/AppContext";

function Shell({ children }: { children: React.ReactNode }) {
  const { m } = useApp();
  const path = usePathname();
  const adminHost = typeof window !== "undefined" && window.location.host.startsWith("admin.");
  if (path.startsWith("/admin") || adminHost) return <>{children}</>;
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-navy focus:px-4 focus:py-2 focus:text-white"
      >
        {m.skip}
      </a>
      <SiteBanner />
      <Header />
      <main id="main">{children}</main>
      <Footer />
      <CookieBanner />
      <AriaChat />
      <TravelpayoutsPixel />
    </>
  );
}

function SiteBanner() {
  const { locale, settings } = useApp();
  if (!settings) return null;
  const copy =
    locale === "fr" && settings.announceFr
      ? settings.announceFr
      : settings.banner;
  if (!copy && !settings.maintenance) return null;
  return (
    <div className="relative z-30 bg-navy px-4 py-2 text-center text-sm font-semibold text-sky-100">
      {settings.maintenance ? (locale === "fr" ? "On polit quelques détails — la recherche marche encore." : "We’re polishing a few things — search still works.") : copy}
    </div>
  );
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AppProvider>
      <Shell>{children}</Shell>
    </AppProvider>
  );
}
