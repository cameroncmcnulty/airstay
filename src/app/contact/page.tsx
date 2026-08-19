"use client";

import { useState } from "react";
import { useApp } from "@/context/AppContext";

export default function ContactPage() {
  const { m } = useApp();
  const [sent, setSent] = useState(false);

  return (
    <div className="mx-auto max-w-lg px-4 py-12">
      <h1 className="text-3xl font-black text-navy">{m.contact.title}</h1>
      <p className="mt-2 text-sm text-navy/65">{m.contact.sub}</p>
      <p className="mt-3 text-sm font-semibold text-navy">
        {m.contact.privacyOfficer}:{" "}
        <a className="text-sky-700 underline" href="mailto:privacy@airstay.ca">
          privacy@airstay.ca
        </a>
      </p>
      {sent ? (
        <p className="mt-8 rounded-2xl bg-sky-50 p-4 text-sm text-navy/80">{m.contact.sent}</p>
      ) : (
        <form
          className="mt-8 space-y-4 rounded-card bg-white p-6 shadow-card ring-1 ring-navy/5"
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
          }}
        >
          <label className="block text-xs font-bold uppercase tracking-wide text-navy/50">
            {m.auth.name}
            <input className="field mt-1" required name="name" />
          </label>
          <label className="block text-xs font-bold uppercase tracking-wide text-navy/50">
            {m.auth.email}
            <input className="field mt-1" type="email" required name="email" />
          </label>
          <label className="block text-xs font-bold uppercase tracking-wide text-navy/50">
            {m.contact.message}
            <textarea className="field mt-1 min-h-32" required name="message" />
          </label>
          <button className="w-full rounded-full bg-sky py-3 text-sm font-bold text-white">{m.contact.send}</button>
        </form>
      )}
    </div>
  );
}
