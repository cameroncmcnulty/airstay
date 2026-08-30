"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { t, type Locale, type Messages } from "@/lib/i18n";
import { currentUser, signOut as authSignOut, type PublicUser } from "@/lib/auth";
import { readConsent, writeConsent, type ConsentState } from "@/lib/consent";
import type { PublicSettings } from "@/lib/site-public";
import type { GeoOrigin } from "@/lib/hubs";

type AppContextValue = {
  locale: Locale;
  setLocale: (l: Locale) => void;
  m: Messages;
  user: PublicUser | null;
  ready: boolean;
  refreshUser: () => void;
  signOut: () => void;
  consent: ConsentState | null;
  setConsent: (c: { analytics: boolean; marketing: boolean }) => void;
  settings: PublicSettings | null;
  origin: GeoOrigin | null;
};

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");
  const [user, setUser] = useState<PublicUser | null>(null);
  const [ready, setReady] = useState(false);
  const [consent, setConsentState] = useState<ConsentState | null>(null);
  const [settings, setSettings] = useState<PublicSettings | null>(null);
  const [origin, setOrigin] = useState<GeoOrigin | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("airstay.locale") as Locale | null;
    if (stored === "fr" || stored === "en") {
      setLocaleState(stored);
      document.documentElement.lang = stored === "fr" ? "fr-CA" : "en-CA";
    }
    setUser(currentUser());
    setConsentState(readConsent());
    setReady(true);
    fetch("/api/settings")
      .then((r) => r.json())
      .then((d) => {
        if (d?.settings) setSettings(d.settings as PublicSettings);
      })
      .catch(() => undefined);
    try {
      const cached = sessionStorage.getItem("airstay.origin.v1");
      if (cached) setOrigin(JSON.parse(cached) as GeoOrigin);
    } catch {
      /* ignore */
    }
    fetch("/api/geo")
      .then((r) => r.json())
      .then((d) => {
        if (!d?.origin?.code) return;
        const next = d.origin as GeoOrigin;
        setOrigin(next);
        try {
          sessionStorage.setItem("airstay.origin.v1", JSON.stringify(next));
        } catch {
          /* ignore */
        }
      })
      .catch(() => undefined);
  }, []);

  const setLocale = (l: Locale) => {
    setLocaleState(l);
    localStorage.setItem("airstay.locale", l);
    document.documentElement.lang = l === "fr" ? "fr-CA" : "en-CA";
  };

  const refreshUser = () => setUser(currentUser());
  const signOut = () => {
    authSignOut();
    setUser(null);
  };
  const setConsent = (c: { analytics: boolean; marketing: boolean }) => {
    setConsentState(writeConsent(c));
  };

  const value = useMemo(
    () => ({ locale, setLocale, m: t[locale] as Messages, user, ready, refreshUser, signOut, consent, setConsent, settings, origin }),
    [locale, user, ready, consent, settings, origin]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
