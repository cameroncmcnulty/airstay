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
  Car,
  MousePointerClick,
  MapPin,
  Users,
  Settings,
} from "lucide-react";

type Mix = { flights: number; stays: number; cars: number };
type DestRow = {
  code: string;
  city: string;
  country: string;
  total: number;
  flights: number;
  stays: number;
  cars: number;
};

type Analytics = {
  selectedMonth: string;
  months: string[];
  totals: { searches: number; outbounds: number; uniqueDests: number; topKind: string };
  mixAll: Mix;
  bookedAll: Mix;
  byMonth: Array<{ month: string; searches: number; outbounds: number; mix: Mix; booked: Mix }>;
  daily: Array<{ day: string; searches: number; outbounds: number }>;
  topDestinationsMonth: DestRow[];
  topDestinationsAll: DestRow[];
  topBookedMonth: DestRow[];
  topPartners: Array<{ name: string; count: number }>;
  monthSearchCount: number;
  monthOutboundCount: number;
};

type Overview = {
  generatedAt: string;
  providers: { travelpayouts: boolean };
  env: {
    travelpayoutsToken: boolean;
    travelpayoutsMarker: string;
    adminPassword: boolean;
    adminUsername?: boolean;
    adminEmail?: string;
    mail?: boolean;
    aria?: boolean;
  };
  stats: { searches: number; bookings: number; offers: number };
  analytics?: Analytics;
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
};

type Ping = {
  ok: boolean;
  elapsedMs?: number;
  error?: string;
  flights?: { count: number; sample: Array<{ name?: string; priceCad?: number }>; error: string | null };
};

const KIND_COLOR = { flights: "#4381C7", stays: "#7BB3E1", cars: "#071840" };
const KIND_LABEL = { flights: "Flights", stays: "Hotels", cars: "Cars" };

export default function AdminPage() {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [needOtp, setNeedOtp] = useState(false);
  const [emailHint, setEmailHint] = useState("");
  const [emailSent, setEmailSent] = useState(true);
  const [error, setError] = useState("");
  const [data, setData] = useState<Overview | null>(null);
  const [ping, setPing] = useState<Ping | null>(null);
  const [busy, setBusy] = useState(false);
  const [month, setMonth] = useState<string>("");
  const [tab, setTab] = useState<"overview" | "users" | "settings">("overview");
  const [users, setUsers] = useState<
    Array<{
      id: string;
      name: string;
      email: string;
      province: string;
      marketingConsent: boolean;
      createdAt: string;
      lastSeen: string;
      disabled: boolean;
      notes: string;
    }>
  >([]);
  const [userQuery, setUserQuery] = useState("");
  const [settings, setSettings] = useState({
    chatEnabled: true,
    maintenance: false,
    banner: "",
    contactEmail: "hello@airstay.ca",
    supportHours: "Daily 8am–10pm ET",
    defaultFrom: "YYZ",
    announceFr: "",
  });
  const [savedMsg, setSavedMsg] = useState("");

  async function load(nextMonth?: string) {
    const q = nextMonth || month;
    const res = await fetch(`/api/admin/overview${q ? `?month=${q}` : ""}`, { cache: "no-store" });
    if (res.status === 401) {
      setAuthed(false);
      setData(null);
      return;
    }
    const json = await res.json();
    if (json.ok) {
      setAuthed(true);
      setData(json);
      if (!month && json.analytics?.selectedMonth) setMonth(json.analytics.selectedMonth);
    } else setAuthed(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onLogin(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    if (needOtp) {
      const res = await fetch("/api/admin/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: otp }),
      });
      const json = await res.json();
      setBusy(false);
      if (!json.ok) {
        setError(json.error || "That code is incorrect.");
        return;
      }
      setOtp("");
      setNeedOtp(false);
      await load();
      return;
    }
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const json = await res.json();
    setBusy(false);
    if (!json.ok) {
      setError(json.error || "Login failed");
      return;
    }
    setPassword("");
    setNeedOtp(true);
    setEmailSent(Boolean(json.emailSent));
    setEmailHint(json.emailHint || "airstaytravel@gmail.com");
    if (!json.emailSent && json.mailError) setError(json.mailError);
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    setAuthed(false);
    setData(null);
  }

  async function loadUsers() {
    const res = await fetch("/api/admin/users", { cache: "no-store" });
    const json = await res.json();
    if (json.ok) setUsers(json.users || []);
  }

  async function loadSettings() {
    const res = await fetch("/api/admin/settings", { cache: "no-store" });
    const json = await res.json();
    if (json.ok && json.settings) setSettings((s) => ({ ...s, ...json.settings }));
  }

  async function saveSettings() {
    setBusy(true);
    const res = await fetch("/api/admin/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    setBusy(false);
    if (res.ok) setSavedMsg("Settings saved.");
  }

  async function patchUser(id: string, patch: Record<string, unknown>) {
    await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...patch }),
    });
    await loadUsers();
  }

  async function deleteUser(id: string) {
    if (!window.confirm("Delete this member from the admin list? They can still have a local browser account.")) return;
    await fetch(`/api/admin/users?id=${encodeURIComponent(id)}`, { method: "DELETE" });
    await loadUsers();
  }

  function exportUsers() {
    const rows = [
      ["name", "email", "province", "joined", "lastSeen", "status", "marketing", "notes"],
      ...users.map((u) => [
        u.name,
        u.email,
        u.province,
        u.createdAt,
        u.lastSeen,
        u.disabled ? "disabled" : "active",
        u.marketingConsent ? "yes" : "no",
        u.notes.replace(/\n/g, " "),
      ]),
    ];
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "airstay-members.csv";
    a.click();
    URL.revokeObjectURL(url);
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
          <p className="mt-1 text-sm text-navy/60">
            {needOtp
              ? emailSent
                ? `We sent a 6-digit code to ${emailHint}.`
                : "Email is not sending yet. Enter your backup code to get in."
              : "Staff only. Username, password, then an email code."}
          </p>
          {!needOtp && (
            <label className="mt-5 block text-xs font-bold uppercase tracking-wide text-navy/50">
              Username
              <input
                className="field mt-1"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                required
              />
            </label>
          )}
          {!needOtp && (
            <label className="mt-4 block text-xs font-bold uppercase tracking-wide text-navy/50">
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
          )}
          {needOtp && (
            <label className="mt-5 block text-xs font-bold uppercase tracking-wide text-navy/50">
              {emailSent ? "Email code or backup code" : "Backup code"}
              <input
                className="field mt-1 tracking-wide"
                autoComplete="one-time-code"
                maxLength={24}
                value={otp}
                onChange={(e) => setOtp(e.target.value.toUpperCase())}
                required
              />
            </label>
          )}
          {error && <p className="mt-3 text-sm font-semibold text-red-600">{error}</p>}
          <button disabled={busy} className="mt-5 w-full rounded-full bg-navy py-3 text-sm font-bold text-white disabled:opacity-60">
            {busy ? "Please wait…" : needOtp ? "Verify code" : "Send login code"}
          </button>
          {needOtp && (
            <button
              type="button"
              className="mt-3 w-full text-sm font-semibold text-navy/60"
              onClick={() => {
                setNeedOtp(false);
                setOtp("");
                setError("");
              }}
            >
              Back to username and password
            </button>
          )}
        </form>
      </div>
    );
  }

  const a = data?.analytics;
  const tpOn = Boolean(data?.providers.travelpayouts);
  const topKind = a?.totals.topKind || "flights";

  return (
    <div className="relative z-10 min-h-screen bg-[#071428] text-white">
      <header className="border-b border-white/10 px-4 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-sky-300">AIRSTAY ops</p>
            <h1 className="text-xl font-black">Admin dashboard</h1>
          </div>
          <div className="flex items-center gap-2">
            <label className="hidden text-xs font-bold text-white/50 sm:block">
              Month
              <select
                className="ml-2 rounded-full bg-white/10 px-3 py-2 text-xs font-bold text-white"
                value={month}
                onChange={(e) => {
                  setMonth(e.target.value);
                  load(e.target.value);
                }}
              >
                {(a?.months || []).map((m) => (
                  <option key={m} value={m} className="text-navy">
                    {labelMonth(m)}
                  </option>
                ))}
              </select>
            </label>
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
        <nav className="flex flex-wrap gap-2">
          {(
            [
              { id: "overview" as const, label: "Overview", icon: Activity },
              { id: "users" as const, label: "Members", icon: Users },
              { id: "settings" as const, label: "Settings", icon: Settings },
            ] as const
          ).map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setTab(item.id);
                if (item.id === "users") loadUsers();
                if (item.id === "settings") loadSettings();
              }}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold ${
                tab === item.id ? "bg-white text-navy" : "bg-white/10 text-white/80 hover:bg-white/15"
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </button>
          ))}
        </nav>

        {tab === "users" && (
          <section className="overflow-hidden rounded-3xl bg-white/5 ring-1 ring-white/10">
            <div className="flex flex-wrap items-end justify-between gap-3 border-b border-white/10 px-5 py-4">
              <div>
                <h2 className="font-black">Member accounts</h2>
                <p className="text-sm text-white/50">
                  {users.length} {users.length === 1 ? "member" : "members"}. Disable blocks sign-in. Notes stay on this server.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <input
                  className="field w-56 bg-white text-navy"
                  placeholder="Search name or email"
                  value={userQuery}
                  onChange={(e) => setUserQuery(e.target.value)}
                />
                <button type="button" onClick={exportUsers} className="rounded-full bg-white/10 px-3 py-2 text-xs font-bold">
                  Export CSV
                </button>
              </div>
            </div>
            {users.length === 0 ? (
              <p className="px-5 py-8 text-sm text-white/45">No members yet. New sign-ups appear here.</p>
            ) : (
              <div className="max-h-[640px] overflow-auto">
                <table className="w-full text-left text-sm">
                  <thead className="text-[11px] uppercase tracking-wide text-white/45">
                    <tr>
                      <th className="px-5 py-2">Member</th>
                      <th className="px-2 py-2">Province</th>
                      <th className="px-2 py-2">Joined</th>
                      <th className="px-2 py-2">Last seen</th>
                      <th className="px-2 py-2">Deals</th>
                      <th className="px-2 py-2">Status</th>
                      <th className="px-5 py-2"> </th>
                    </tr>
                  </thead>
                  <tbody>
                    {users
                      .filter((u) => {
                        const q = userQuery.trim().toLowerCase();
                        if (!q) return true;
                        return `${u.name} ${u.email} ${u.province}`.toLowerCase().includes(q);
                      })
                      .map((u) => (
                      <tr key={u.id} className="border-t border-white/5 align-top">
                        <td className="px-5 py-3">
                          <p className="font-bold">{u.name}</p>
                          <p className="text-white/50">{u.email}</p>
                          <textarea
                            className="mt-2 w-full rounded-xl bg-black/30 px-2 py-1.5 text-xs text-white/80 outline-none ring-1 ring-white/10"
                            rows={2}
                            defaultValue={u.notes}
                            placeholder="Staff notes"
                            onBlur={(e) => {
                              if (e.target.value !== u.notes) patchUser(u.id, { notes: e.target.value });
                            }}
                          />
                        </td>
                        <td className="px-2 py-3">{u.province || "—"}</td>
                        <td className="px-2 py-3 text-white/70">{new Date(u.createdAt).toLocaleDateString("en-CA")}</td>
                        <td className="px-2 py-3 text-white/70">{new Date(u.lastSeen).toLocaleDateString("en-CA")}</td>
                        <td className="px-2 py-3">{u.marketingConsent ? "On" : "Off"}</td>
                        <td className="px-2 py-3">{u.disabled ? "Disabled" : "Active"}</td>
                        <td className="px-5 py-3 text-right">
                          <div className="flex flex-col items-end gap-1">
                            <button
                              type="button"
                              className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold"
                              onClick={() => patchUser(u.id, { disabled: !u.disabled })}
                            >
                              {u.disabled ? "Enable" : "Disable"}
                            </button>
                            <button
                              type="button"
                              className="rounded-full px-3 py-1 text-xs font-bold text-rose-200 hover:bg-rose-500/20"
                              onClick={() => deleteUser(u.id)}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}

        {tab === "settings" && (
          <section className="rounded-3xl bg-white/5 p-5 ring-1 ring-white/10">
            <h2 className="font-black">Website settings</h2>
            <p className="text-sm text-white/50">Toggles and public copy that shape the live site.</p>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <label className="flex items-center justify-between rounded-2xl bg-black/20 px-4 py-3 text-sm font-semibold">
                Aria chat
                <input
                  type="checkbox"
                  className="accent-sky h-4 w-4"
                  checked={settings.chatEnabled}
                  onChange={(e) => setSettings({ ...settings, chatEnabled: e.target.checked })}
                />
              </label>
              <label className="flex items-center justify-between rounded-2xl bg-black/20 px-4 py-3 text-sm font-semibold">
                Maintenance banner
                <input
                  type="checkbox"
                  className="accent-sky h-4 w-4"
                  checked={settings.maintenance}
                  onChange={(e) => setSettings({ ...settings, maintenance: e.target.checked })}
                />
              </label>
              <label className="block text-xs font-bold uppercase tracking-wide text-white/45 md:col-span-2">
                Site banner (English)
                <input
                  className="field mt-1 bg-white text-navy"
                  value={settings.banner}
                  onChange={(e) => setSettings({ ...settings, banner: e.target.value })}
                  placeholder="Optional note at the top of the site"
                />
              </label>
              <label className="block text-xs font-bold uppercase tracking-wide text-white/45 md:col-span-2">
                Site banner (French)
                <input
                  className="field mt-1 bg-white text-navy"
                  value={settings.announceFr}
                  onChange={(e) => setSettings({ ...settings, announceFr: e.target.value })}
                  placeholder="Note facultative en haut du site"
                />
              </label>
              <label className="block text-xs font-bold uppercase tracking-wide text-white/45">
                Contact email
                <input
                  className="field mt-1 bg-white text-navy"
                  value={settings.contactEmail}
                  onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                />
              </label>
              <label className="block text-xs font-bold uppercase tracking-wide text-white/45">
                Default from airport
                <input
                  className="field mt-1 bg-white text-navy"
                  value={settings.defaultFrom}
                  maxLength={3}
                  onChange={(e) => setSettings({ ...settings, defaultFrom: e.target.value.toUpperCase() })}
                />
              </label>
              <label className="block text-xs font-bold uppercase tracking-wide text-white/45 md:col-span-2">
                Support hours
                <input
                  className="field mt-1 bg-white text-navy"
                  value={settings.supportHours}
                  onChange={(e) => setSettings({ ...settings, supportHours: e.target.value })}
                />
              </label>
            </div>
            <div className="mt-6 rounded-2xl bg-black/20 p-4 text-sm text-white/70">
              <p className="font-bold text-white">Aria</p>
              <p className="mt-1">
                {data?.env.aria
                  ? "Live AI is on (XAI_API_KEY). Aria streams answers with travel knowledge and web search."
                  : "Fallback mode: add XAI_API_KEY on Vercel so Aria uses Grok. Until then she still answers from AIRSTAY’s travel notes."}
              </p>
            </div>
            <div className="mt-5 flex items-center gap-3">
              <button type="button" onClick={saveSettings} disabled={busy} className="rounded-full bg-sky px-5 py-2 text-sm font-bold disabled:opacity-60">
                Save settings
              </button>
              {savedMsg && <p className="text-sm text-emerald-300">{savedMsg}</p>}
            </div>
          </section>
        )}

        {tab === "overview" && (
          <>
        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Stat icon={Activity} label="Searches" value={String(a?.totals.searches ?? 0)} />
          <Stat icon={MousePointerClick} label="Partner click-throughs" value={String(a?.totals.outbounds ?? 0)} />
          <Stat icon={MapPin} label="Destinations searched" value={String(a?.totals.uniqueDests ?? 0)} />
          <Stat
            icon={topKind === "stays" ? Hotel : topKind === "cars" ? Car : Plane}
            label="Most searched"
            value={KIND_LABEL[topKind as keyof typeof KIND_LABEL] || "—"}
            ok={tpOn}
          />
        </section>

        <section className="grid gap-4 lg:grid-cols-3">
          <div className="rounded-3xl bg-white/5 p-5 ring-1 ring-white/10 lg:col-span-2">
            <h2 className="font-black">Searches by product · last 12 months</h2>
            <p className="text-sm text-white/50">What people compare on AIRSTAY, so you can lean into demand.</p>
            <StackedBars
              rows={(a?.byMonth || []).map((row) => ({
                label: row.month.slice(5),
                flights: row.mix.flights,
                stays: row.mix.stays,
                cars: row.mix.cars,
              }))}
            />
            <Legend />
          </div>
          <div className="rounded-3xl bg-white/5 p-5 ring-1 ring-white/10">
            <h2 className="font-black">Click-through mix</h2>
            <p className="text-sm text-white/50">Users who left for a partner checkout.</p>
            <Donut mix={a?.bookedAll || { flights: 0, stays: 0, cars: 0 }} />
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          <DestChart
            title={`Top 10 destinations · ${labelMonth(a?.selectedMonth || month)}`}
            subtitle="Most searched this month. Use this to feature deals and homepage tiles."
            rows={a?.topDestinationsMonth || []}
          />
          <DestChart
            title="Top destinations · all time"
            subtitle="Running demand across this server’s recorded searches."
            rows={a?.topDestinationsAll || []}
          />
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-3xl bg-white/5 p-5 ring-1 ring-white/10">
            <h2 className="font-black">Last 30 days</h2>
            <p className="text-sm text-white/50">Searches vs partner click-throughs.</p>
            <Sparkline daily={a?.daily || []} />
          </div>
          <div className="rounded-3xl bg-white/5 p-5 ring-1 ring-white/10">
            <h2 className="font-black">Partners people open</h2>
            <p className="text-sm text-white/50">Click-throughs after “Continue to partner”.</p>
            {(a?.topPartners || []).length === 0 ? (
              <Empty>No partner clicks recorded yet.</Empty>
            ) : (
              <ul className="mt-4 space-y-2">
                {(a?.topPartners || []).map((p) => (
                  <li key={p.name} className="flex items-center justify-between text-sm">
                    <span className="font-semibold">{p.name}</span>
                    <span className="font-black text-sky-200">{p.count}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
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

        <section className="overflow-hidden rounded-3xl bg-white/5 ring-1 ring-white/10">
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
                      No searches on this server instance yet. They appear here as soon as people search.
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
        </section>

        <p className="text-xs text-white/40">
          Last refresh {data?.generatedAt ? new Date(data.generatedAt).toLocaleString("en-CA") : "—"}. Charts count searches
          and click-throughs. Counts persist when the filesystem is writable.
        </p>
          </>
        )}
      </div>
    </div>
  );
}

function labelMonth(ym?: string) {
  if (!ym) return "—";
  const [y, m] = ym.split("-").map(Number);
  return new Date(y, (m || 1) - 1, 1).toLocaleDateString("en-CA", { month: "long", year: "numeric" });
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

function Legend() {
  return (
    <div className="mt-3 flex flex-wrap gap-3 text-[11px] font-bold uppercase tracking-wide text-white/55">
      <span className="inline-flex items-center gap-1.5">
        <i className="h-2 w-2 rounded-full" style={{ background: KIND_COLOR.flights }} /> Flights
      </span>
      <span className="inline-flex items-center gap-1.5">
        <i className="h-2 w-2 rounded-full" style={{ background: KIND_COLOR.stays }} /> Hotels
      </span>
      <span className="inline-flex items-center gap-1.5">
        <i className="h-2 w-2 rounded-full" style={{ background: KIND_COLOR.cars }} /> Cars
      </span>
    </div>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return <p className="mt-6 text-sm text-white/45">{children}</p>;
}

function StackedBars({
  rows,
}: {
  rows: Array<{ label: string; flights: number; stays: number; cars: number }>;
}) {
  const max = Math.max(1, ...rows.map((r) => r.flights + r.stays + r.cars));
  if (rows.every((r) => r.flights + r.stays + r.cars === 0)) {
    return <Empty>No searches yet this year. Charts fill in as travellers search.</Empty>;
  }
  return (
    <div className="mt-4 flex h-48 items-end gap-2">
      {rows.map((r) => {
        const total = r.flights + r.stays + r.cars;
        const h = Math.max(total ? 8 : 2, Math.round((total / max) * 160));
        const f = total ? (r.flights / total) * h : 0;
        const s = total ? (r.stays / total) * h : 0;
        const c = total ? (r.cars / total) * h : 0;
        return (
          <div key={r.label} className="flex flex-1 flex-col items-center gap-1">
            <div className="flex h-40 w-full flex-col justify-end overflow-hidden rounded-t-lg bg-white/5">
              <div style={{ height: c, background: KIND_COLOR.cars }} />
              <div style={{ height: s, background: KIND_COLOR.stays }} />
              <div style={{ height: f, background: KIND_COLOR.flights }} />
            </div>
            <span className="text-[10px] font-bold text-white/45">{r.label}</span>
          </div>
        );
      })}
    </div>
  );
}

function Donut({ mix }: { mix: Mix }) {
  const total = mix.flights + mix.stays + mix.cars;
  if (!total) return <Empty>No click-throughs yet.</Empty>;
  const segs = [
    { key: "flights", n: mix.flights, color: KIND_COLOR.flights },
    { key: "stays", n: mix.stays, color: KIND_COLOR.stays },
    { key: "cars", n: mix.cars, color: KIND_COLOR.cars },
  ];
  let acc = 0;
  const r = 54;
  const c = 2 * Math.PI * r;
  return (
    <div className="mt-4 flex items-center gap-4">
      <svg viewBox="0 0 140 140" className="h-36 w-36 -rotate-90">
        <circle cx="70" cy="70" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="18" />
        {segs.map((s) => {
          const len = (s.n / total) * c;
          const dash = `${len} ${c - len}`;
          const offset = -acc;
          acc += len;
          return (
            <circle
              key={s.key}
              cx="70"
              cy="70"
              r={r}
              fill="none"
              stroke={s.color}
              strokeWidth="18"
              strokeDasharray={dash}
              strokeDashoffset={offset}
              strokeLinecap="butt"
            />
          );
        })}
      </svg>
      <ul className="space-y-2 text-sm">
        {segs.map((s) => (
          <li key={s.key} className="flex items-center justify-between gap-6">
            <span className="inline-flex items-center gap-2 font-semibold">
              <i className="h-2.5 w-2.5 rounded-full" style={{ background: s.color }} />
              {KIND_LABEL[s.key as keyof typeof KIND_LABEL]}
            </span>
            <span className="font-black">{s.n}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function DestChart({ title, subtitle, rows }: { title: string; subtitle: string; rows: DestRow[] }) {
  const max = Math.max(1, ...rows.map((r) => r.total));
  return (
    <div className="rounded-3xl bg-white/5 p-5 ring-1 ring-white/10">
      <h2 className="font-black">{title}</h2>
      <p className="text-sm text-white/50">{subtitle}</p>
      {rows.length === 0 ? (
        <Empty>No destinations recorded for this period.</Empty>
      ) : (
        <ul className="mt-4 space-y-3">
          {rows.map((r, i) => (
            <li key={r.code}>
              <div className="flex items-baseline justify-between text-sm">
                <p className="font-bold">
                  <span className="mr-2 text-white/35">{i + 1}</span>
                  {r.city} <span className="font-semibold text-white/45">{r.code}</span>
                </p>
                <p className="font-black text-sky-200">{r.total}</p>
              </div>
              <div className="mt-1 flex h-2 overflow-hidden rounded-full bg-white/10">
                <span className="h-full" style={{ width: `${(r.flights / max) * 100}%`, background: KIND_COLOR.flights }} />
                <span className="h-full" style={{ width: `${(r.stays / max) * 100}%`, background: KIND_COLOR.stays }} />
                <span className="h-full" style={{ width: `${(r.cars / max) * 100}%`, background: KIND_COLOR.cars }} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Sparkline({ daily }: { daily: Array<{ day: string; searches: number; outbounds: number }> }) {
  const w = 520;
  const h = 140;
  const max = Math.max(1, ...daily.map((d) => Math.max(d.searches, d.outbounds)));
  const pts = (key: "searches" | "outbounds") =>
    daily
      .map((d, i) => {
        const x = daily.length <= 1 ? w / 2 : (i / (daily.length - 1)) * w;
        const y = h - 8 - (d[key] / max) * (h - 20);
        return `${x},${y}`;
      })
      .join(" ");
  const empty = daily.every((d) => d.searches === 0 && d.outbounds === 0);
  if (empty) return <Empty>No activity in the last 30 days yet.</Empty>;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="mt-4 h-36 w-full">
      <polyline fill="none" stroke="#4381C7" strokeWidth="3" points={pts("searches")} />
      <polyline fill="none" stroke="#A9CDEC" strokeWidth="3" strokeDasharray="6 6" points={pts("outbounds")} />
    </svg>
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
