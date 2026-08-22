"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  Activity,
  Hotel,
  Plane,
  RefreshCw,
  Shield,
  LogOut,
  Database,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

type Overview = {
  generatedAt: string;
  providers: { travelpayouts: boolean };
  env: { travelpayoutsToken: boolean; travelpayoutsMarker: string; adminPassword: boolean };
  stats: { searches: number; bookings: number; offers: number };
  searches: Array<{
    id: string;
    at: string;
    kind: string;
    origin?: string;
    destination?: string;
    depart?: string;
    results: number;
    source?: string;
  }>;
  bookings: Array<{
    id: string;
    status: string;
    createdAt: string;
    contactEmail: string;
    offer: { title: string; supplier: string };
  }>;
};

type Ping = {
  ok: boolean;
  elapsedMs?: number;
  error?: string;
  flights?: { count: number; sample: Array<{ name?: string; priceCad?: number }>; error: string | null };
};

export default function AdminPage() {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [data, setData] = useState<Overview | null>(null);
  const [ping, setPing] = useState<Ping | null>(null);
  const [busy, setBusy] = useState(false);

  async function load() {
    const res = await fetch("/api/admin/overview", { cache: "no-store" });
    if (res.status === 401) {
      setAuthed(false);
      setData(null);
      return;
    }
    const json = await res.json();
    if (json.ok) {
      setAuthed(true);
      setData(json);
    } else setAuthed(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function onLogin(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    const json = await res.json();
    setBusy(false);
    if (!json.ok) {
      setError(json.error || "Login failed");
      return;
    }
    setPassword("");
    await load();
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    setAuthed(false);
    setData(null);
  }

  async function runPing() {
    setBusy(true);
    const res = await fetch("/api/admin/ping", { method: "POST" });
    const json = await res.json();
    setPing(json);
    setBusy(false);
    await load();
  }

  if (authed === null) {
    return <div className="relative z-10 grid min-h-screen place-items-center bg-navy text-white/70">Loading admin…</div>;
  }

  if (!authed) {
    return (
      <div className="relative z-10 grid min-h-screen place-items-center bg-navy px-4">
        <form onSubmit={onLogin} className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-card">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-700">AIRSTAY</p>
          <h1 className="mt-2 text-2xl font-black text-navy">Admin sign in</h1>
          <p className="mt-1 text-sm text-navy/60">Staff only. Uses ADMIN_PASSWORD from the server environment.</p>
          <label className="mt-5 block text-xs font-bold uppercase tracking-wide text-navy/50">
            Password
            <input
              className="field mt-1"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </label>
          {error && <p className="mt-3 text-sm font-semibold text-red-600">{error}</p>}
          <button disabled={busy} className="mt-5 w-full rounded-full bg-navy py-3 text-sm font-bold text-white disabled:opacity-60">
            {busy ? "Checking…" : "Enter dashboard"}
          </button>
        </form>
      </div>
    );
  }

  const tpOn = Boolean(data?.providers.travelpayouts);

  return (
    <div className="relative z-10 min-h-screen bg-[#071428] text-white">
      <header className="border-b border-white/10 px-4 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-sky-300">AIRSTAY ops</p>
            <h1 className="text-xl font-black">Admin dashboard</h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => load()}
              className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 text-xs font-bold"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Refresh
            </button>
            <button type="button" onClick={logout} className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 text-xs font-bold text-navy">
              <LogOut className="h-3.5 w-3.5" />
              Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl space-y-6 px-4 py-8">
        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Stat icon={Shield} label="Travelpayouts" value={tpOn ? "Live" : "Off"} ok={tpOn} />
          <Stat icon={Plane} label="Marker" value={data?.env.travelpayoutsMarker || "564250"} ok />
          <Stat icon={Activity} label="Searches (this instance)" value={String(data?.stats.searches ?? 0)} />
          <Stat icon={Hotel} label="Bookings (this instance)" value={String(data?.stats.bookings ?? 0)} />
        </section>

        <section className="rounded-3xl bg-white/5 p-5 ring-1 ring-white/10">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-black">Provider ping</h2>
              <p className="text-sm text-white/60">Runs YYZ → CUN through Travelpayouts cheap/week/calendar fares.</p>
            </div>
            <button
              type="button"
              onClick={runPing}
              disabled={busy}
              className="rounded-full bg-sky px-4 py-2 text-sm font-bold disabled:opacity-60"
            >
              {busy ? "Pinging…" : "Ping Travelpayouts"}
            </button>
          </div>
          {ping && (
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <PingCard title="Flights" count={ping.flights?.count} error={ping.flights?.error || ping.error} sample={ping.flights?.sample?.map((s) => `${s.name || "Fare"} · $${s.priceCad}`)} />
            </div>
          )}
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          <div className="overflow-hidden rounded-3xl bg-white/5 ring-1 ring-white/10">
            <div className="flex items-center gap-2 border-b border-white/10 px-5 py-4">
              <Database className="h-4 w-4 text-sky-300" />
              <h2 className="font-black">Recent searches</h2>
            </div>
            <div className="max-h-[420px] overflow-auto">
              <table className="w-full text-left text-sm">
                <thead className="text-[11px] uppercase tracking-wide text-white/45">
                  <tr>
                    <th className="px-5 py-2">When</th>
                    <th className="px-2 py-2">Kind</th>
                    <th className="px-2 py-2">Route</th>
                    <th className="px-5 py-2">Hits</th>
                  </tr>
                </thead>
                <tbody>
                  {(data?.searches || []).length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-5 py-6 text-white/45">
                        No searches on this server instance yet.
                      </td>
                    </tr>
                  )}
                  {(data?.searches || []).map((s) => (
                    <tr key={s.id} className="border-t border-white/5">
                      <td className="whitespace-nowrap px-5 py-2 text-white/70">{new Date(s.at).toLocaleString("en-CA")}</td>
                      <td className="px-2 py-2 font-semibold">{s.kind}</td>
                      <td className="px-2 py-2">
                        {s.origin || "—"} → {s.destination || "—"}
                      </td>
                      <td className="px-5 py-2">{s.results}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="overflow-hidden rounded-3xl bg-white/5 ring-1 ring-white/10">
            <div className="flex items-center gap-2 border-b border-white/10 px-5 py-4">
              <Hotel className="h-4 w-4 text-sky-300" />
              <h2 className="font-black">Stay bookings</h2>
            </div>
            <div className="max-h-[420px] overflow-auto">
              {(data?.bookings || []).length === 0 ? (
                <p className="px-5 py-6 text-sm text-white/45">No Duffel stay bookings on this instance yet.</p>
              ) : (
                <ul className="divide-y divide-white/5 text-sm">
                  {(data?.bookings || []).map((b) => (
                    <li key={b.id} className="px-5 py-3">
                      <p className="font-bold">{b.offer.title}</p>
                      <p className="text-white/55">
                        {b.id} · {b.status} · {b.contactEmail}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </section>

        <p className="text-xs text-white/40">
          Last refresh {data?.generatedAt ? new Date(data.generatedAt).toLocaleString("en-CA") : "—"}. Search and booking
          counts are per serverless instance until a database is added.
        </p>
      </div>
    </div>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
  ok,
}: {
  icon: typeof Shield;
  label: string;
  value: string;
  ok?: boolean;
}) {
  return (
    <div className="rounded-3xl bg-white/5 p-4 ring-1 ring-white/10">
      <div className="flex items-center justify-between">
        <Icon className="h-4 w-4 text-sky-300" />
        {ok != null && (ok ? <CheckCircle2 className="h-4 w-4 text-emerald-400" /> : <AlertTriangle className="h-4 w-4 text-amber-300" />)}
      </div>
      <p className="mt-3 text-xs font-bold uppercase tracking-wide text-white/45">{label}</p>
      <p className="mt-1 text-lg font-black">{value}</p>
    </div>
  );
}

function PingCard({
  title,
  count,
  error,
  sample,
}: {
  title: string;
  count?: number;
  error?: string | null;
  sample?: string[];
}) {
  return (
    <div className="rounded-2xl bg-black/20 p-4">
      <p className="text-xs font-bold uppercase tracking-wide text-white/45">{title}</p>
      <p className="mt-1 text-2xl font-black">{count ?? 0}</p>
      {error && <p className="mt-2 text-sm text-amber-200">{error}</p>}
      <ul className="mt-2 space-y-1 text-sm text-white/70">
        {(sample || []).map((row) => (
          <li key={row}>{row}</li>
        ))}
      </ul>
    </div>
  );
}
