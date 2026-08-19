"use client";

import Link from "next/link";
import { Logo } from "./Logo";
import { useApp } from "@/context/AppContext";

export function Footer() {
  const { m } = useApp();
  const year = new Date().getFullYear();
  return (
    <footer className="mt-20 bg-navy text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-4">
        <div className="md:col-span-1">
          <div className="inline-flex rounded-2xl bg-white px-3 py-2">
            <Logo href="/" size="sm" />
          </div>
          <p className="mt-4 text-sm leading-relaxed text-white/75">{m.tagline}</p>
          <p className="mt-3 text-xs font-semibold tracking-wide text-sky-200">{m.footer.pipeda}</p>
        </div>
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-sky-200">{m.footer.product}</h2>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link className="hover:text-sky-200" href="/flights">{m.nav.flights}</Link></li>
            <li><Link className="hover:text-sky-200" href="/stays">{m.nav.stays}</Link></li>
            <li><Link className="hover:text-sky-200" href="/cars">{m.nav.cars}</Link></li>
            <li><Link className="hover:text-sky-200" href="/packages">{m.nav.packages}</Link></li>
            <li><Link className="hover:text-sky-200" href="/deals">{m.nav.deals}</Link></li>
          </ul>
        </div>
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-sky-200">{m.footer.company}</h2>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link className="hover:text-sky-200" href="/about">{m.nav.about}</Link></li>
            <li><Link className="hover:text-sky-200" href="/contact">{m.footer.contact}</Link></li>
            <li><Link className="hover:text-sky-200" href="/disclosure">{m.footer.disclosure}</Link></li>
          </ul>
        </div>
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-sky-200">{m.footer.legal}</h2>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link className="hover:text-sky-200" href="/privacy">{m.footer.privacy}</Link></li>
            <li><Link className="hover:text-sky-200" href="/terms">{m.footer.terms}</Link></li>
            <li><Link className="hover:text-sky-200" href="/cookies">{m.footer.cookies}</Link></li>
            <li><Link className="hover:text-sky-200" href="/accessibility">{m.footer.accessibility}</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-6xl space-y-3 px-4 py-6 text-xs leading-relaxed text-white/65">
          <p>{m.footer.notAgency}</p>
          <p>{m.partners.note}</p>
          <p>{m.footer.copyright.replace("{year}", String(year))}</p>
        </div>
      </div>
    </footer>
  );
}
