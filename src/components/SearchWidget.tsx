"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Plane, Building2, Car, TreePalm, Search, Minus, Plus } from "lucide-react";
import { useApp } from "@/context/AppContext";
import {
  searchCanadianAirports,
  searchDestinations,
  type Airport,
  type Destination,
} from "@/lib/airports";
import {
  defaultDepart,
  defaultReturn,
  queryToParams,
  type SearchKind,
  type SearchQuery,
} from "@/lib/deeplinks";

const TABS: { id: SearchKind; icon: typeof Plane; labelKey: "flights" | "stays" | "cars" | "packages" }[] = [
  { id: "flights", icon: Plane, labelKey: "flights" },
  { id: "stays", icon: Building2, labelKey: "stays" },
  { id: "cars", icon: Car, labelKey: "cars" },
  { id: "packages", icon: TreePalm, labelKey: "packages" },
];

export function SearchWidget({
  initialKind = "flights",
  kind: kindProp,
  hideTabs = false,
  embedded = false,
}: {
  initialKind?: SearchKind;
  kind?: SearchKind;
  hideTabs?: boolean;
  embedded?: boolean;
}) {
  const { m, locale } = useApp();
  const router = useRouter();
  const [kindState, setKindState] = useState<SearchKind>(initialKind);
  const kind = kindProp ?? kindState;
  const setKind = (next: SearchKind) => {
    if (!kindProp) setKindState(next);
  };
  const [from, setFrom] = useState("");
  const [fromCode, setFromCode] = useState("");
  const [to, setTo] = useState("");
  const [toCode, setToCode] = useState("");
  const [depart, setDepart] = useState(defaultDepart());
  const [ret, setRet] = useState(defaultReturn());
  const [trip, setTrip] = useState<"roundtrip" | "oneway">("roundtrip");
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [childAges, setChildAges] = useState<Array<number | "">>([]);
  const [rooms, setRooms] = useState(1);
  const [cabin, setCabin] = useState<SearchQuery["cabin"]>("economy");
  const [fromOpen, setFromOpen] = useState(false);
  const [toOpen, setToOpen] = useState(false);
  const [error, setError] = useState("");
  const fromRef = useRef<HTMLLabelElement>(null);
  const toRef = useRef<HTMLLabelElement>(null);

  const fromOpts = useMemo(() => searchCanadianAirports(from), [from]);
  const toOpts = useMemo(() => searchDestinations(to), [to]);

  useEffect(() => {
    if (!fromOpen && !toOpen) return;

    function onPointerDown(e: PointerEvent) {
      const target = e.target as Node;
      if (fromOpen && fromRef.current && !fromRef.current.contains(target)) {
        setFromOpen(false);
      }
      if (toOpen && toRef.current && !toRef.current.contains(target)) {
        setToOpen(false);
      }
    }

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setFromOpen(false);
        setToOpen(false);
      }
    }

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [fromOpen, toOpen]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if ((kind === "flights" || kind === "packages") && !fromCode) {
      setError(m.results.noOrigin);
      return;
    }
    const ages = childAges.slice(0, children);
    if (kind !== "cars" && children > 0 && ages.some((age) => age === "")) {
      setError(m.search.errorChildAges);
      return;
    }
    setError("");
    const q: SearchQuery = {
      kind,
      from: fromCode || undefined,
      to: toCode || undefined,
      toCity: to || undefined,
      depart,
      returnDate: trip === "oneway" && kind === "flights" ? undefined : ret,
      adults,
      children,
      childAges: ages.filter((age): age is number => age !== ""),
      rooms,
      cabin,
      trip: kind === "flights" ? trip : "roundtrip",
    };
    router.push(`/results?${queryToParams(q)}`);
  }

  return (
    <div className={embedded ? "" : "rounded-[1.8rem] bg-white p-3 shadow-card sm:p-5"}>
      {!hideTabs && (
      <div className="flex flex-wrap gap-2" role="tablist" aria-label={m.bubbles.title}>
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const active = kind === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => {
                setKind(tab.id);
                setError("");
                setFromOpen(false);
                setToOpen(false);
              }}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-bold transition ${
                active
                  ? "bg-navy text-white shadow-bubble"
                  : "bg-mist text-navy/70 hover:bg-sky-50"
              }`}
            >
              <span className={`grid h-8 w-8 place-items-center rounded-full ${active ? "bg-white/15" : "bg-white"}`}>
                <Icon className={`h-4 w-4 ${active ? "text-white" : "text-sky"}`} />
              </span>
              {m.nav[tab.labelKey]}
            </button>
          );
        })}
      </div>
      )}

      <form onSubmit={submit} className={`${hideTabs ? "space-y-4" : "mt-5 space-y-4"}`}>
        {kind === "flights" && (
          <div className="flex flex-wrap gap-2">
            {(["roundtrip", "oneway"] as const).map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => setTrip(opt)}
                className={`rounded-full px-3 py-1.5 text-xs font-bold ${
                  trip === opt ? "bg-sky-100 text-navy" : "text-navy/60"
                }`}
              >
                {opt === "roundtrip" ? m.search.roundtrip : m.search.oneway}
              </button>
            ))}
          </div>
        )}

        <div className="grid gap-3 md:grid-cols-2">
          {(kind === "flights" || kind === "packages") && (
            <Field label={m.search.from} fieldRef={fromRef}>
              <input
                value={from}
                onChange={(e) => {
                  setFrom(e.target.value);
                  setFromCode("");
                  setFromOpen(true);
                  setToOpen(false);
                }}
                onFocus={() => {
                  setFromOpen(true);
                  setToOpen(false);
                }}
                placeholder={m.search.fromPh}
                className="field"
                autoComplete="off"
                aria-autocomplete="list"
                aria-expanded={fromOpen}
              />
              {fromOpen && (
                <Suggest
                  items={fromOpts.map((a) => ({
                    key: a.code,
                    title: `${a.city} (${a.code})`,
                    sub: locale === "fr" ? a.nameFr : a.name,
                    onPick: () => pickFrom(a),
                  }))}
                  onClose={() => setFromOpen(false)}
                />
              )}
            </Field>
          )}

          <Field label={kind === "cars" ? m.search.pickup : kind === "stays" ? m.search.dest : m.search.to} fieldRef={toRef}>
            <input
              value={to}
              onChange={(e) => {
                setTo(e.target.value);
                setToCode("");
                setToOpen(true);
                setFromOpen(false);
              }}
              onFocus={() => {
                setToOpen(true);
                setFromOpen(false);
              }}
              placeholder={kind === "stays" ? m.search.destPh : m.search.toPh}
              className="field"
              autoComplete="off"
              aria-expanded={toOpen}
            />
            {toOpen && (
              <Suggest
                items={toOpts.map((d) => ({
                  key: d.code,
                  title: `${locale === "fr" ? d.cityFr : d.city} (${d.code})`,
                  sub: locale === "fr" ? d.countryFr : d.country,
                  onPick: () => pickTo(d),
                }))}
                onClose={() => setToOpen(false)}
              />
            )}
          </Field>

          <Field label={kind === "stays" ? m.search.checkin : m.search.depart}>
            <input type="date" value={depart} onChange={(e) => setDepart(e.target.value)} className="field" required />
          </Field>
          {(kind !== "flights" || trip === "roundtrip") && (
            <Field label={kind === "stays" ? m.search.checkout : m.search.return}>
              <input type="date" value={ret} min={depart} onChange={(e) => setRet(e.target.value)} className="field" required />
            </Field>
          )}
        </div>

        <div className="flex flex-wrap items-end gap-3">
          <Stepper label={kind === "stays" ? m.search.guests : m.search.adults} value={adults} min={1} onChange={setAdults} />
          {kind !== "cars" && (
            <Stepper label={m.search.children} value={children} min={0} onChange={setChildrenCount} />
          )}
          {kind === "stays" && <Stepper label={m.search.rooms} value={rooms} min={1} onChange={setRooms} />}
          {kind === "flights" && (
            <label className="min-w-[160px] flex-1 text-xs font-bold uppercase tracking-wide text-navy/50">
              {m.search.cabin}
              <select
                value={cabin}
                onChange={(e) => setCabin(e.target.value as SearchQuery["cabin"])}
                className="field mt-1"
              >
                <option value="economy">{m.search.economy}</option>
                <option value="premium">{m.search.premium}</option>
                <option value="business">{m.search.business}</option>
                <option value="first">{m.search.first}</option>
              </select>
            </label>
          )}
          <button
            type="submit"
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-sky px-6 py-3.5 text-sm font-bold text-white shadow-lift hover:bg-sky-600 md:flex-none"
          >
            <Search className="h-4 w-4" />
            {m.search.search}
          </button>
        </div>
        {kind !== "cars" && children > 0 && (
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-navy/50">{m.search.childAgesHint}</p>
            <div className="mt-2 grid gap-2 sm:grid-cols-2 md:grid-cols-4">
              {childAges.map((age, i) => (
                <label key={i} className="text-xs font-bold uppercase tracking-wide text-navy/50">
                  {m.search.childAge.replace("{n}", String(i + 1))}
                  <select
                    className="field mt-1"
                    value={age}
                    required
                    onChange={(e) => {
                      const next = [...childAges];
                      next[i] = e.target.value === "" ? "" : Number(e.target.value);
                      setChildAges(next);
                    }}
                  >
                    <option value="">{m.search.childAgePh}</option>
                    {Array.from({ length: 18 }, (_, n) => (
                      <option key={n} value={n}>
                        {n === 0 ? m.search.underOne : n === 1 ? m.search.yearOld : m.search.yearsOld.replace("{n}", String(n))}
                      </option>
                    ))}
                  </select>
                </label>
              ))}
            </div>
          </div>
        )}
        {(kind === "flights" || kind === "packages") && (
          <p className="text-xs font-medium text-navy/50">{m.search.canadaOnly}</p>
        )}
        {error && <p className="text-sm font-semibold text-red-600">{error}</p>}
      </form>
    </div>
  );

  function setChildrenCount(n: number) {
    setChildren(n);
    setChildAges((prev) => {
      const next = prev.slice(0, n);
      while (next.length < n) next.push("");
      return next;
    });
  }

  function pickFrom(a: Airport) {
    setFrom(`${locale === "fr" ? a.cityFr : a.city} (${a.code})`);
    setFromCode(a.code);
    setFromOpen(false);
  }
  function pickTo(d: Destination) {
    setTo(locale === "fr" ? d.cityFr : d.city);
    setToCode(d.code);
    setToOpen(false);
  }
}

function Field({
  label,
  children,
  fieldRef,
}: {
  label: string;
  children: React.ReactNode;
  fieldRef?: React.Ref<HTMLLabelElement>;
}) {
  return (
    <label ref={fieldRef} className="relative block text-xs font-bold uppercase tracking-wide text-navy/50">
      {label}
      <div className="relative mt-1">{children}</div>
    </label>
  );
}

function Suggest({
  items,
  onClose,
}: {
  items: { key: string; title: string; sub: string; onPick: () => void }[];
  onClose: () => void;
}) {
  return (
    <ul className="absolute z-20 mt-1 max-h-64 w-full overflow-auto rounded-2xl border border-navy/10 bg-white py-1 shadow-card">
      {items.map((it) => (
        <li key={it.key}>
          <button
            type="button"
            className="flex w-full flex-col px-3 py-2 text-left hover:bg-sky-50"
            onMouseDown={(e) => {
              e.preventDefault();
              it.onPick();
              onClose();
            }}
          >
            <span className="text-sm font-semibold text-navy">{it.title}</span>
            <span className="text-xs text-navy/50">{it.sub}</span>
          </button>
        </li>
      ))}
    </ul>
  );
}

function Stepper({
  label,
  value,
  min,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  onChange: (n: number) => void;
}) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-wide text-navy/50">{label}</p>
      <div className="mt-1 flex items-center gap-2 rounded-full bg-mist px-2 py-1.5">
        <button
          type="button"
          className="grid h-8 w-8 place-items-center rounded-full bg-white text-navy shadow-sm"
          onClick={() => onChange(Math.max(min, value - 1))}
          aria-label={`Decrease ${label}`}
        >
          <Minus className="h-3.5 w-3.5" />
        </button>
        <span className="w-5 text-center text-sm font-bold text-navy">{value}</span>
        <button
          type="button"
          className="grid h-8 w-8 place-items-center rounded-full bg-white text-navy shadow-sm"
          onClick={() => onChange(value + 1)}
          aria-label={`Increase ${label}`}
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
