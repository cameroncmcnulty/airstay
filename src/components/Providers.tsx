"use client";

import { AppProvider } from "@/context/AppContext";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { CookieBanner } from "./CookieBanner";
import { useApp } from "@/context/AppContext";

function Shell({ children }: { children: React.ReactNode }) {
  const { m } = useApp();
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-navy focus:px-4 focus:py-2 focus:text-white"
      >
        {m.skip}
      </a>
      <Header />
      <main id="main">{children}</main>
      <Footer />
      <CookieBanner />
    </>
  );
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AppProvider>
      <Shell>{children}</Shell>
    </AppProvider>
  );
}
