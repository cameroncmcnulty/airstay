"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Menu, X, UserRound } from "lucide-react";
import { Logo } from "./Logo";
import { useApp } from "@/context/AppContext";

const LINKS = [
  { href: "/flights", key: "flights" as const },
  { href: "/stays", key: "stays" as const },
  { href: "/cars", key: "cars" as const },
  { href: "/esim", key: "esim" as const },
  { href: "/packages", key: "packages" as const },
  { href: "/deals", key: "deals" as const },
];

export function Header() {
  const { m, locale, setLocale, user } = useApp();
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setOpen(false);
  }, [path]);

  useEffect(() => {
    if (!open) return;

    function onPointerDown(e: PointerEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <header ref={menuRef} className="sticky top-0 z-40 border-b border-navy/10 bg-white shadow-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-3 py-2 sm:gap-4 sm:px-4 sm:py-3">
        <Logo size="sm" variant="dark" />
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {LINKS.map((l) => {
            const active = path === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`rounded-full px-3 py-2 text-sm font-semibold transition ${
                  active ? "bg-navy text-white" : "text-navy hover:bg-sky-50"
                }`}
              >
                {m.nav[l.key]}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-2">
          <div className="flex rounded-full bg-mist p-0.5 text-xs font-bold" role="group" aria-label="Language">
            <button
              type="button"
              className={`rounded-full px-2.5 py-1.5 ${locale === "en" ? "bg-white text-navy shadow-sm" : "text-navy/55"}`}
              onClick={() => setLocale("en")}
              aria-pressed={locale === "en"}
            >
              EN
            </button>
            <button
              type="button"
              className={`rounded-full px-2.5 py-1.5 ${locale === "fr" ? "bg-white text-navy shadow-sm" : "text-navy/55"}`}
              onClick={() => setLocale("fr")}
              aria-pressed={locale === "fr"}
            >
              FR
            </button>
          </div>
          {user ? (
            <Link
              href="/account"
              className="hidden items-center gap-2 rounded-full bg-navy px-3 py-2 text-sm font-semibold text-white sm:inline-flex"
            >
              <UserRound className="h-4 w-4" />
              {user.name.split(" ")[0]}
            </Link>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Link href="/login" className="rounded-full px-3 py-2 text-sm font-semibold text-navy hover:bg-sky-50">
                {m.nav.signIn}
              </Link>
              <Link href="/signup" className="rounded-full bg-sky px-4 py-2 text-sm font-semibold text-white shadow-bubble">
                {m.nav.createAccount}
              </Link>
            </div>
          )}
          <button
            type="button"
            className="rounded-full p-2 text-navy hover:bg-sky-50 lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>
      {open && (
        <div className="border-t border-navy/10 bg-white px-4 py-3 lg:hidden">
          <nav className="flex flex-col gap-1">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="rounded-2xl px-3 py-3 font-semibold text-navy"
                onClick={() => setOpen(false)}
              >
                {m.nav[l.key]}
              </Link>
            ))}
            {user ? (
              <Link href="/account" className="rounded-2xl px-3 py-3 font-semibold text-navy" onClick={() => setOpen(false)}>
                {m.nav.account}
              </Link>
            ) : (
              <>
                <Link href="/login" className="rounded-2xl px-3 py-3 font-semibold text-navy" onClick={() => setOpen(false)}>
                  {m.nav.signIn}
                </Link>
                <Link href="/signup" className="rounded-2xl bg-sky px-3 py-3 font-semibold text-white" onClick={() => setOpen(false)}>
                  {m.nav.createAccount}
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
