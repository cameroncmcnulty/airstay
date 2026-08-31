"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Bookmark, Check, Trash2, Users } from "lucide-react";
import {
  changePassword,
  deleteUser,
  exportUserJson,
  removeSavedSearch,
  removeTravelerParty,
  updateSearchPrefs,
  updateUser,
  upsertTravelerParty,
  validPassword,
} from "@/lib/auth";
import { CANADIAN_AIRPORTS, getAirport } from "@/lib/airports";
import { normalizeParty, queuePrefill, type TravelerParty } from "@/lib/travelers";
import { useApp } from "@/context/AppContext";

const PROVINCES = ["AB", "BC", "MB", "NB", "NL", "NS", "NT", "NU", "ON", "PE", "QC", "SK", "YT"] as const;

const NAV = [
  { id: "travelers", key: "navTravelers" as const },
  { id: "trips", key: "navTrips" as const },
  { id: "defaults", key: "navDefaults" as const },
  { id: "profile", key: "navProfile" as const },
  { id: "security", key: "navSecurity" as const },
  { id: "privacy", key: "navPrivacy" as const },
];

export default function AccountPage() {
  const { m, user, ready, refreshUser, signOut, locale } = useApp();
  const router = useRouter();
  const [name, setName] = useState("");
  const [province, setProvince] = useState("ON");
  const [profileMsg, setProfileMsg] = useState("");
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [passMsg, setPassMsg] = useState("");
  const [passErr, setPassErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [editing, setEditing] = useState<TravelerParty | null>(null);
  const [groupMsg, setGroupMsg] = useState("");
  const [homeAirport, setHomeAirport] = useState("");
  const [cabin, setCabin] = useState("economy");
  const [autoPrefill, setAutoPrefill] = useState(true);
  const [prefsMsg, setPrefsMsg] = useState("");

  useEffect(() => {
    if (ready && !user) router.replace("/login");
  }, [ready, user, router]);

  useEffect(() => {
    if (!user) return;
    setName(user.name);
    setProvince(user.province || "ON");
    setHomeAirport(user.searchPrefs?.homeAirport || "");
    setCabin(user.searchPrefs?.cabin || "economy");
    setAutoPrefill(user.searchPrefs?.autoPrefill !== false);
  }, [user]);

  if (!ready || !user) return <div className="px-4 py-16 text-center text-navy/50">…</div>;

  const joined = new Date(user.createdAt).toLocaleDateString(undefined, { month: "long", year: "numeric" });
  const parties = user.travelerParties || [];
  const defaultId = user.searchPrefs?.defaultPartyId;

  function summarize(p: TravelerParty) {
    if (!p.children) return m.account.partyAdultsOnly.replace("{n}", String(p.adults));
    return m.account.partySummary.replace("{adults}", String(p.adults)).replace("{children}", String(p.children));
  }

  async function saveProfile() {
    if (!user) return;
    if (name.trim().length < 2) return;
    setBusy(true);
    updateUser(user.id, { name: name.trim(), province });
    refreshUser();
    setBusy(false);
    setProfileMsg(m.account.savedProfile);
  }

  async function onPassword(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setPassErr("");
    setPassMsg("");
    if (next !== confirmPw) return setPassErr(m.auth.errorMatch);
    if (!validPassword(next)) return setPassErr(m.auth.errorPass);
    setBusy(true);
    const res = await changePassword(user.id, current, next);
    setBusy(false);
    if (!res.ok) return setPassErr(res.error === "current" ? m.account.errorCurrent : m.auth.errorPass);
    setCurrent("");
    setNext("");
    setConfirmPw("");
    setPassMsg(m.account.passwordChanged);
  }

  function saveGroup(party: TravelerParty, makeDefault: boolean) {
    if (!user) return;
    const res = upsertTravelerParty(user.id, party);
    if (res && "error" in res && res.error === "max") {
      setGroupMsg(m.account.maxGroups);
      return;
    }
    if (makeDefault) updateSearchPrefs(user.id, { defaultPartyId: party.id, autoPrefill: true });
    refreshUser();
    setEditing(null);
    setGroupMsg(m.account.groupSaved);
  }

  function useGroup(p: TravelerParty) {
    if (!user) return;
    queuePrefill(p);
    const home = user.searchPrefs?.homeAirport;
    router.push(home ? `/flights` : "/#search");
  }

  function savePrefs() {
    if (!user) return;
    const code = homeAirport.trim().toUpperCase();
    updateSearchPrefs(user.id, {
      homeAirport: code.length === 3 ? code : undefined,
      cabin: cabin as TravelerParty["cabin"],
      autoPrefill,
    });
    refreshUser();
    setPrefsMsg(m.account.prefsSaved);
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:py-12">
      <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-sky-700">{m.account.kicker}</p>
      <h1 className="mt-2 text-3xl font-black text-navy">{m.account.title}</h1>
      <p className="mt-1 text-sm text-navy/60">
        {m.account.joined.replace("{date}", joined)}
        {user.emailVerified ? ` · ${m.account.verified}` : ""}
      </p>

      <nav className="-mx-4 mt-6 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {NAV.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className="shrink-0 rounded-full bg-white px-3 py-2 text-xs font-bold text-navy ring-1 ring-navy/10"
          >
            {m.account[item.key]}
          </a>
        ))}
      </nav>

      <section className="mt-6 grid gap-3 sm:grid-cols-3">
        <div className="rounded-card bg-white p-4 shadow-card ring-1 ring-navy/5">
          <p className="text-[11px] font-bold uppercase tracking-wide text-navy/40">{m.account.travelers}</p>
          <p className="mt-1 text-2xl font-black text-navy">{parties.length}</p>
        </div>
        <div className="rounded-card bg-white p-4 shadow-card ring-1 ring-navy/5">
          <p className="text-[11px] font-bold uppercase tracking-wide text-navy/40">{m.account.trips}</p>
          <p className="mt-1 text-2xl font-black text-navy">{user.savedSearches.length}</p>
        </div>
        <div className="rounded-card bg-white p-4 shadow-card ring-1 ring-navy/5">
          <p className="text-[11px] font-bold uppercase tracking-wide text-navy/40">{m.account.clicks}</p>
          <p className="mt-1 text-2xl font-black text-navy">{user.clicks.length}</p>
        </div>
      </section>

      <section id="travelers" className="mt-6 scroll-mt-24 rounded-card bg-white p-5 shadow-card ring-1 ring-navy/5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="font-extrabold text-navy">{m.account.travelers}</h2>
            <p className="mt-1 text-sm text-navy/55">{m.account.travelersSub}</p>
          </div>
          <button
            type="button"
            className="btn-primary"
            onClick={() =>
              setEditing(
                normalizeParty({
                  name: "",
                  adults: 2,
                  children: 0,
                  childAges: [],
                })
              )
            }
          >
            {m.account.addGroup}
          </button>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {[
            { name: m.account.presetSolo, adults: 1, children: 0, childAges: [] as number[] },
            { name: m.account.presetCouple, adults: 2, children: 0, childAges: [] },
            { name: m.account.presetFamily, adults: 2, children: 2, childAges: [8, 5] },
          ].map((p) => (
            <button
              key={p.name}
              type="button"
              className="rounded-full bg-mist px-3 py-1.5 text-xs font-bold text-navy ring-1 ring-navy/10"
              onClick={() => setEditing(normalizeParty(p))}
            >
              + {p.name}
            </button>
          ))}
        </div>
        {groupMsg && <p className="mt-3 text-sm font-semibold text-emerald-700">{groupMsg}</p>}
        {editing && (
          <PartyForm
            party={editing}
            m={m}
            defaultOn={defaultId === editing.id}
            onCancel={() => setEditing(null)}
            onSave={saveGroup}
          />
        )}
        {parties.length === 0 && !editing ? (
          <p className="mt-4 text-sm text-navy/55">{m.account.noGroups}</p>
        ) : (
          <ul className="mt-4 space-y-2">
            {parties.map((p) => (
              <li key={p.id} className="flex flex-wrap items-center gap-2 rounded-2xl bg-mist px-3 py-3">
                <Users className="h-4 w-4 shrink-0 text-sky" />
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-navy">
                    {p.name}{" "}
                    {defaultId === p.id && (
                      <span className="ml-1 rounded-full bg-navy px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-white">
                        {m.account.defaultOn}
                      </span>
                    )}
                  </p>
                  <p className="text-xs font-semibold text-navy/50">{summarize(p)}</p>
                </div>
                <button type="button" className="rounded-full bg-navy px-3 py-1.5 text-xs font-bold text-white" onClick={() => useGroup(p)}>
                  {m.account.useGroup}
                </button>
                <button type="button" className="text-xs font-bold text-sky-700" onClick={() => setEditing(p)}>
                  {m.account.editGroup}
                </button>
                <button
                  type="button"
                  className="grid h-9 w-9 place-items-center rounded-full text-navy/40 hover:bg-white hover:text-red-700"
                  aria-label={m.account.remove}
                  onClick={() => {
                    removeTravelerParty(user.id, p.id);
                    refreshUser();
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section id="trips" className="mt-4 scroll-mt-24 rounded-card bg-white p-5 shadow-card ring-1 ring-navy/5 sm:p-6">
        <h2 className="font-extrabold text-navy">{m.account.trips}</h2>
        <p className="mt-1 text-sm text-navy/55">{m.account.tripsSub}</p>
        {user.savedSearches.length === 0 ? (
          <p className="mt-3 text-sm text-navy/55">{m.account.none}</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {user.savedSearches.map((s) => {
              const fromAp = s.from ? getAirport(s.from) : undefined;
              const fromLabel = fromAp ? (locale === "fr" ? fromAp.cityFr : fromAp.city) : s.from;
              return (
                <li key={s.id} className="flex items-center gap-2 rounded-2xl bg-mist px-3 py-3">
                  <Bookmark className="h-4 w-4 shrink-0 text-sky" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-bold text-navy">{s.label}</p>
                    <p className="text-xs font-semibold text-navy/45">
                      {[s.kind, fromLabel, s.toCity || s.to, s.adults ? `${s.adults}+${s.children || 0}` : ""]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                  </div>
                  <Link href={s.href} className="rounded-full bg-navy px-3 py-1.5 text-xs font-bold text-white">
                    {m.account.searchNow}
                  </Link>
                  <button
                    type="button"
                    className="grid h-9 w-9 place-items-center rounded-full text-navy/40 hover:bg-white hover:text-red-700"
                    aria-label={m.account.remove}
                    onClick={() => {
                      removeSavedSearch(user.id, s.id);
                      refreshUser();
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section id="defaults" className="mt-4 scroll-mt-24 rounded-card bg-white p-5 shadow-card ring-1 ring-navy/5 sm:p-6">
        <h2 className="font-extrabold text-navy">{m.account.defaults}</h2>
        <p className="mt-1 text-sm text-navy/55">{m.account.defaultsSub}</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <label className="block text-xs font-bold uppercase tracking-wide text-navy/50">
            {m.account.homeAirport}
            <select className="field mt-1" value={homeAirport} onChange={(e) => setHomeAirport(e.target.value)}>
              <option value="">{m.account.homeAirportPh}</option>
              {CANADIAN_AIRPORTS.filter((a) => a.major).map((a) => (
                <option key={a.code} value={a.code}>
                  {locale === "fr" ? a.cityFr : a.city} ({a.code})
                </option>
              ))}
            </select>
          </label>
          <label className="block text-xs font-bold uppercase tracking-wide text-navy/50">
            {m.account.cabinPref}
            <select className="field mt-1" value={cabin} onChange={(e) => setCabin(e.target.value)}>
              <option value="economy">{m.search.economy}</option>
              <option value="premium">{m.search.premium}</option>
              <option value="business">{m.search.business}</option>
              <option value="first">{m.search.first}</option>
            </select>
          </label>
        </div>
        <label className="mt-4 flex items-center justify-between gap-3 rounded-2xl bg-mist px-4 py-3 text-sm font-semibold text-navy">
          {m.account.autoPrefill}
          <input type="checkbox" className="h-4 w-4 accent-sky" checked={autoPrefill} onChange={(e) => setAutoPrefill(e.target.checked)} />
        </label>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button type="button" className="btn-primary" onClick={savePrefs}>
            {m.account.saveProfile}
          </button>
          {prefsMsg && <p className="text-sm font-semibold text-emerald-700">{prefsMsg}</p>}
        </div>
      </section>

      <section id="profile" className="mt-4 scroll-mt-24 rounded-card bg-white p-5 shadow-card ring-1 ring-navy/5 sm:p-6">
        <h2 className="font-extrabold text-navy">{m.account.profile}</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <label className="block text-xs font-bold uppercase tracking-wide text-navy/50">
            {m.auth.name}
            <input className="field mt-1" value={name} onChange={(e) => setName(e.target.value)} />
          </label>
          <label className="block text-xs font-bold uppercase tracking-wide text-navy/50">
            {m.auth.province}
            <select className="field mt-1" value={province} onChange={(e) => setProvince(e.target.value)}>
              {PROVINCES.map((p) => (
                <option key={p} value={p}>
                  {m.province[p]}
                </option>
              ))}
            </select>
          </label>
        </div>
        <p className="mt-3 text-sm text-navy/50">{user.email}</p>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button type="button" className="btn-primary" disabled={busy} onClick={saveProfile}>
            {m.account.saveProfile}
          </button>
          {profileMsg && <p className="text-sm font-semibold text-emerald-700">{profileMsg}</p>}
        </div>
      </section>

      <section id="security" className="mt-4 scroll-mt-24 rounded-card bg-white p-5 shadow-card ring-1 ring-navy/5 sm:p-6">
        <h2 className="font-extrabold text-navy">{m.account.security}</h2>
        <form onSubmit={onPassword} className="mt-4 space-y-3">
          <label className="block text-xs font-bold uppercase tracking-wide text-navy/50">
            {m.account.currentPassword}
            <input className="field mt-1" type="password" value={current} onChange={(e) => setCurrent(e.target.value)} autoComplete="current-password" required />
          </label>
          <label className="block text-xs font-bold uppercase tracking-wide text-navy/50">
            {m.account.newPassword}
            <input className="field mt-1" type="password" value={next} onChange={(e) => setNext(e.target.value)} autoComplete="new-password" required />
          </label>
          <label className="block text-xs font-bold uppercase tracking-wide text-navy/50">
            {m.auth.confirmPassword}
            <input className="field mt-1" type="password" value={confirmPw} onChange={(e) => setConfirmPw(e.target.value)} autoComplete="new-password" required />
          </label>
          {passErr && <p className="text-sm font-semibold text-red-600">{passErr}</p>}
          {passMsg && <p className="text-sm font-semibold text-emerald-700">{passMsg}</p>}
          <button type="submit" className="btn-ghost" disabled={busy}>
            {m.account.changePassword}
          </button>
        </form>
      </section>

      <section className="mt-4 rounded-card bg-white p-5 shadow-card ring-1 ring-navy/5 sm:p-6">
        <h2 className="font-extrabold text-navy">{m.account.clicks}</h2>
        {user.clicks.length === 0 ? (
          <p className="mt-2 text-sm text-navy/55">{m.account.noneClicks}</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {user.clicks.slice(0, 12).map((c) => (
              <li key={c.at} className="flex items-center justify-between gap-3 rounded-2xl bg-mist px-3 py-2 text-sm">
                <span className="min-w-0 truncate font-semibold text-navy">{c.partner}</span>
                <span className="shrink-0 text-[11px] font-semibold text-navy/45">{new Date(c.at).toLocaleString()}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section id="privacy" className="mt-4 scroll-mt-24 rounded-card bg-white p-5 shadow-card ring-1 ring-navy/5 sm:p-6">
        <h2 className="font-extrabold text-navy">{m.account.privacy}</h2>
        <p className="mt-2 text-sm text-navy/65">{user.marketingConsent ? m.account.marketingOn : m.account.marketingOff}</p>
        <button
          type="button"
          className="btn-ghost mt-3"
          onClick={() => {
            updateUser(user.id, {
              marketingConsent: !user.marketingConsent,
              marketingConsentAt: !user.marketingConsent ? new Date().toISOString() : undefined,
            });
            refreshUser();
          }}
        >
          {user.marketingConsent ? m.account.marketingOff : m.account.marketingOn}
        </button>
        <div className="mt-4 flex flex-wrap gap-2">
          <button type="button" className="rounded-full bg-navy px-4 py-2 text-sm font-bold text-white" onClick={() => exportUserJson(user)}>
            {m.account.export}
          </button>
          <button
            type="button"
            className="rounded-full px-4 py-2 text-sm font-bold text-navy"
            onClick={() => {
              signOut();
              router.push("/");
            }}
          >
            {m.nav.signOut}
          </button>
        </div>
        <div className="mt-6 rounded-2xl bg-red-50 px-4 py-4 ring-1 ring-red-100">
          <p className="font-extrabold text-red-800">{m.account.danger}</p>
          <p className="mt-1 text-sm text-red-700/80">{m.account.dangerSub}</p>
          <button
            type="button"
            className="mt-3 rounded-full border border-red-200 bg-white px-4 py-2 text-sm font-bold text-red-700"
            onClick={() => {
              if (window.confirm(m.account.deleteConfirm)) {
                deleteUser(user.id);
                signOut();
                router.push("/");
              }
            }}
          >
            {m.account.delete}
          </button>
        </div>
      </section>
    </div>
  );
}

function PartyForm({
  party,
  m,
  defaultOn,
  onCancel,
  onSave,
}: {
  party: TravelerParty;
  m: ReturnType<typeof useApp>["m"];
  defaultOn: boolean;
  onCancel: () => void;
  onSave: (party: TravelerParty, makeDefault: boolean) => void;
}) {
  const [draft, setDraft] = useState(party);
  const [asDefault, setAsDefault] = useState(defaultOn || !party.name);

  useEffect(() => {
    setDraft(party);
    setAsDefault(defaultOn || !party.name);
  }, [party, defaultOn]);

  function setChildren(n: number) {
    const children = Math.max(0, Math.min(8, n));
    const childAges = [...draft.childAges].slice(0, children);
    while (childAges.length < children) childAges.push(2);
    setDraft({ ...draft, children, childAges });
  }

  return (
    <form
      className="mt-4 space-y-3 rounded-2xl bg-mist p-4 ring-1 ring-navy/10"
      onSubmit={(e) => {
        e.preventDefault();
        if (!draft.name.trim()) return;
        onSave(normalizeParty(draft), asDefault);
      }}
    >
      <label className="block text-xs font-bold uppercase tracking-wide text-navy/50">
        {m.account.groupName}
        <input
          className="field mt-1 bg-white"
          value={draft.name}
          placeholder={m.account.groupNamePh}
          onChange={(e) => setDraft({ ...draft, name: e.target.value })}
          required
        />
      </label>
      <div className="grid grid-cols-2 gap-3">
        <label className="text-xs font-bold uppercase tracking-wide text-navy/50">
          {m.search.adults}
          <input
            className="field mt-1 bg-white"
            type="number"
            min={1}
            max={9}
            value={draft.adults}
            onChange={(e) => setDraft({ ...draft, adults: Number(e.target.value) || 1 })}
          />
        </label>
        <label className="text-xs font-bold uppercase tracking-wide text-navy/50">
          {m.search.children}
          <input
            className="field mt-1 bg-white"
            type="number"
            min={0}
            max={8}
            value={draft.children}
            onChange={(e) => setChildren(Number(e.target.value) || 0)}
          />
        </label>
      </div>
      {draft.children > 0 && (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {draft.childAges.map((age, i) => (
            <label key={i} className="text-xs font-bold uppercase tracking-wide text-navy/50">
              {m.search.childAge.replace("{n}", String(i + 1))}
              <select
                className="field mt-1 bg-white"
                value={age}
                onChange={(e) => {
                  const childAges = [...draft.childAges];
                  childAges[i] = Number(e.target.value);
                  setDraft({ ...draft, childAges });
                }}
              >
                {Array.from({ length: 18 }, (_, n) => (
                  <option key={n} value={n}>
                    {n === 0 ? m.search.underOne : n === 1 ? m.search.yearOld : m.search.yearsOld.replace("{n}", String(n))}
                  </option>
                ))}
              </select>
            </label>
          ))}
        </div>
      )}
      <label className="flex items-center gap-2 text-sm font-semibold text-navy">
        <input type="checkbox" className="accent-sky" checked={asDefault} onChange={(e) => setAsDefault(e.target.checked)} />
        {m.account.setDefault}
      </label>
      <div className="flex flex-wrap gap-2">
        <button type="submit" className="btn-primary">
          <Check className="h-4 w-4" />
          {m.account.saveProfile}
        </button>
        <button type="button" className="btn-ghost" onClick={onCancel}>
          {m.account.cancel}
        </button>
      </div>
    </form>
  );
}
