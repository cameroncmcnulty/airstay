"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { t, type Locale, type Messages } from "@/lib/i18n";
import { currentUser, signOut as authSignOut, type PublicUser } from "@/lib/auth";
import { readConsent, writeConsent, type ConsentState } from "@/lib/consent";

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
};

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");
  const [user, setUser] = useState<PublicUser | null>(null);
  const [ready, setReady] = useState(false);
  const [consent, setConsentState] = useState<ConsentState | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("airstay.locale") as Locale | null;
    if (stored === "fr" || stored === "en") setLocaleState(stored);
    setUser(currentUser());
    setConsentState(readConsent());
    setReady(true);
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
    () => ({ locale, setLocale, m: t[locale] as Messages, user, ready, refreshUser, signOut, consent, setConsent }),
    [locale, user, ready, consent]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
