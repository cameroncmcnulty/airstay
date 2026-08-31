"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Plane, Building2, Car, Smartphone, Search, Minus, Plus } from "lucide-react";
import { DateBubble, DateRangePicker } from "@/components/DateRangePicker";
import { useApp } from "@/context/AppContext";
import {
  getAirport,
  getDestination,
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
import { addDays } from "@/lib/dates";

const TABS: { id: SearchKind; icon: typeof Plane; labelKey: "flights" | "stays" | "cars" | "esim" }[] = [
  { id: "flights", icon: Plane, labelKey: "flights" },
  { id: "stays", icon: Building2, labelKey: "stays" },
  { id: "cars", icon: Car, labelKey: "cars" },
  { id: "esim", icon: Smartphone, labelKey: "esim" },
];

export function SearchWidget({
  initialKind = "flights",
  kind: kindProp,
  hideTabs = false,
  embedded = false,
  initial,
}: {
  initialKind?: SearchKind;
  kind?: SearchKind;
  hideTabs?: boolean;
  embedded?: boolean;
  initial?: SearchQuery;
}) {
  const { m, locale, settings, origin } = useApp();
  const router = useRouter();
  const [kindState, setKindState] = useState<SearchKind>(initial?.kind || initialKind);
  const kind = kindProp ?? kindState;
  const setKind = (next: SearchKind) => {
    if (!kindProp) setKindState(next);
  };
  const seedFrom = initial?.from ? getAirport(initial.from) : undefined;
  const seedTo = initial?.to ? getDestination(initial.to) : undefined;
  const [from, setFrom] = useState(
    seedFrom ? `${locale === "fr" ? seedFrom.cityFr : seedFrom.city} (${seedFrom.code})` : ""
  );
  const [fromCode, setFromCode] = useState(initial?.from || "");
  const [to, setTo] = useState(
    seedTo ? (locale === "fr" ? seedTo.cityFr : seedTo.city) : initial?.toCity || ""
  );
  const [toCode, setToCode] = useState(initial?.to || "");
  const [depart, setDepart] = useState(initial?.depart || defaultDepart());
  const [ret, setRet] = useState(initial?.returnDate || defaultReturn());
  const [trip, setTrip] = useState<"roundtrip" | "oneway">(initial?.trip || "roundtrip");
  const [adults, setAdults] = useState(initial?.adults || 1);
  const [children, setChildren] = useState(initial?.children || 0);
  const [childAges, setChildAges] = useState<Array<number | "">>(() => {
    const ages = [...(initial?.childAges || [])] as Array<number | "">;
    const n = initial?.children || 0;
    while (ages.length < n) ages.push("");
    return ages;
  });
  const [rooms, setRooms] = useState(initial?.rooms || 1);
  const [cabin, setCabin] = useState<SearchQuery["cabin"]>(initial?.cabin || "economy");
  const [dataPlan, setDataPlan] = useState(initial?.dataPlan || "any");
  const [fromOpen, setFromOpen] = useState(false);
  const [toOpen, setToOpen] = useState(false);
  const [calOpen, setCalOpen] = useState(false);
  const [calOn, setCalOn] = useState<"start" | "end">("start");
  const [error, setError] = useState("");
  const fromRef = useRef<HTMLLabelElement>(null);
  const toRef = useRef<HTMLLabelElement>(null);
  const calRef = useRef<HTMLDivElement>(null);
  const fromTouched = useRef(Boolean(initial?.from));

  useEffect(() => {
    if (fromTouched.current || initial?.from) return;
    const code = origin?.code || settings?.defaultFrom;
    if (!code) return;
    const ap = getAirport(code);
    if (!ap) return;
    setFrom(`${locale === "fr" ? ap.cityFr : ap.city} (${ap.code})`);
    setFromCode(ap.code);
  }, [origin?.code, settings?.defaultFrom, initial?.from, locale]);

  const fromOpts = useMemo(() => searchCanadianAirports(from), [from]);
  const toOpts = useMemo(() => searchDestinations(to), [to]);

  const rangeTrip = kind === "esim" || kind !== "flights" || trip === "roundtrip";

  useEffect(() => {
    if (!fromOpen && !toOpen && !calOpen) return;

    function onPointerDown(e: PointerEvent) {
      const target = e.target as Node;
      if (fromOpen && fromRef.current && !fromRef.current.contains(target)) {
        setFromOpen(false);
      }
      if (toOpen && toRef.current && !toRef.current.contains(target)) {
        setToOpen(false);
      }
      if (calOpen && calRef.current && !calRef.current.contains(target)) {
        setCalOpen(false);
      }
    }

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setFromOpen(false);
        setToOpen(false);
        setCalOpen(false);
      }
    }

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [fromOpen, toOpen, calOpen]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (kind === "packages") {
      router.push("/packages");
      return;
    }
    if (kind === "flights" && !fromCode) {
      setError(m.results.noOrigin);
      return;
    }
    if ((kind === "flights" || kind === "cars" || kind === "esim") && !toCode && !to) {
      setError(m.results.noTo);
      return;
    }
    if (kind !== "esim" && !toCode && !to) {
      setError(m.results.noTo);
      return;
    }
    const ages = childAges.slice(0, children);
    if (kind !== "cars" && kind !== "esim" && children > 0 && ages.some((age) => age === "")) {
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
      dataPlan: kind === "esim" ? dataPlan : undefined,
    };
    router.push(`/results?${queryToParams(q)}`);
  }

  return (
    <div className={embedded ? "" : "rounded-[1.8rem] bg-white p-3 shadow-card sm:p-5"}>
      {!hideTabs && (
      <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" role="tablist" aria-label={m.bubbles.title}>
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
                setCalOpen(false);
              }}
              className={`inline-flex shrink-0 items-center gap-2 rounded-full px-3 py-2.5 text-sm font-bold transition sm:px-4 ${
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

      {kind === "packages" ? (
        <div className={`${hideTabs ? "" : "mt-5"} rounded-2xl bg-mist px-4 py-5 text-center`}>
          <p className="text-lg font-black text-navy">{m.comingSoon.title}</p>
          <p className="mt-2 text-sm text-navy/65">{m.comingSoon.body}</p>
          <a href="/packages" className="btn-ghost mt-4 inline-flex">
            {m.packages.see}
          </a>
        </div>
      ) : (
      <form onSubmit={submit} className={`${hideTabs ? "space-y-4" : "mt-5 space-y-4"}`}>
        {kind === "flights" && (
          <div className="flex flex-wrap gap-2">
            {(["roundtrip", "oneway"] as const).map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => {
                  setTrip(opt);
                  if (opt === "oneway") setCalOpen(false);
                  if (opt === "roundtrip" && ret <= depart) setRet(addDays(depart, 7));
                }}
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
          {kind === "flights" && (
            <Field label={m.search.from} fieldRef={fromRef}>
              <input
                value={from}
                onChange={(e) => {
                  fromTouched.current = true;
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
                    title: `${locale === "fr" ? a.cityFr : a.city} (${a.code})`,
                    sub: locale === "fr" ? a.nameFr : a.name,
                    onPick: () => pickFrom(a),
                  }))}
                  emptyLabel={m.search.noMatches}
                  onClose={() => setFromOpen(false)}
                />
              )}
            </Field>
          )}

          <Field label={kind === "cars" ? m.search.pickup : kind === "stays" || kind === "esim" ? m.search.dest : m.search.to} fieldRef={toRef}>
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
              placeholder={kind === "stays" || kind === "esim" ? m.search.destPh : m.search.toPh}
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
                emptyLabel={m.search.noMatches}
                onClose={() => setToOpen(false)}
              />
            )}
          </Field>

          <div
            className="md:col-span-2"
            ref={calRef}
            onPointerDown={(e) => e.stopPropagation()}
          >
            <div className={`grid gap-3 ${rangeTrip ? "md:grid-cols-2" : ""}`}>
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-navy/50">
                  {kind === "stays" ? m.search.checkin : kind === "esim" ? m.search.coverageStart : m.search.depart}
                </p>
                <div className="mt-1">
                  <DateBubble
                    label={kind === "stays" ? m.search.checkin : kind === "esim" ? m.search.coverageStart : m.search.depart}
                    value={depart}
                    locale={locale}
                    active={calOpen && calOn === "start"}
                    onClick={() => {
                      setCalOn("start");
                      setCalOpen(true);
                      setFromOpen(false);
                      setToOpen(false);
                    }}
                  />
                </div>
              </div>
              {rangeTrip && (
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-navy/50">
                    {kind === "stays" ? m.search.checkout : kind === "cars" ? m.search.dropoff : kind === "esim" ? m.search.coverageEnd : m.search.return}
                  </p>
                  <div className="mt-1">
                    <DateBubble
                      label={kind === "stays" ? m.search.checkout : kind === "esim" ? m.search.coverageEnd : m.search.return}
                      value={ret}
                      locale={locale}
                      active={calOpen && calOn === "end"}
                      onClick={() => {
                        setCalOn("end");
                        setCalOpen(true);
                        setFromOpen(false);
                        setToOpen(false);
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
            {calOpen && (
              <DateRangePicker
                key={rangeTrip ? "range" : "single"}
                mode={rangeTrip ? "range" : "single"}
                start={depart}
                end={rangeTrip ? ret : undefined}
                locale={locale}
                weekStartsOn={locale === "fr" ? 1 : 0}
                openOn={calOn}
                labels={{
                  start: kind === "stays" ? m.search.checkin : m.search.depart,
                  end: kind === "stays" ? m.search.checkout : m.search.return,
                  nights: kind === "cars" || kind === "esim" ? m.search.days : m.search.nights,
                  confirm: m.search.confirmDates,
                  pickStart: m.search.pickStart,
                  pickEnd: m.search.pickEnd,
                  nextDay: m.search.nextDay,
                }}
                onConfirm={(s, e) => {
                  setDepart(s);
                  if (e) setRet(e);
                  else if (s >= ret) setRet(addDays(s, 7));
                  setCalOpen(false);
                }}
                onClose={() => setCalOpen(false)}
              />
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-end gap-3">
          <Stepper label={kind === "stays" ? m.search.guests : kind === "esim" ? m.search.esims : m.search.adults} value={adults} min={1} onChange={setAdults} />
          {kind !== "cars" && kind !== "esim" && (
            <Stepper label={m.search.children} value={children} min={0} onChange={setChildrenCount} />
          )}
          {kind === "stays" && <Stepper label={m.search.rooms} value={rooms} min={1} onChange={setRooms} />}
          {kind === "esim" && (
            <label className="min-w-[160px] flex-1 text-xs font-bold uppercase tracking-wide text-navy/50">
              {m.search.dataPlan}
              <select value={dataPlan} onChange={(e) => setDataPlan(e.target.value)} className="field mt-1">
                <option value="any">{m.search.dataAny}</option>
                <option value="1">1 GB</option>
                <option value="3">3 GB</option>
                <option value="5">5 GB</option>
                <option value="10">10 GB</option>
                <option value="20">20 GB</option>
                <option value="unlimited">{m.search.dataUnlimited}</option>
              </select>
            </label>
          )}
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
        {kind !== "cars" && kind !== "esim" && children > 0 && (
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
        {kind === "flights" && (
          <p className="text-xs font-medium text-navy/50">{m.search.canadaOnly}</p>
        )}
        {error && <p className="text-sm font-semibold text-red-600">{error}</p>}
      </form>
      )}
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
    fromTouched.current = true;
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
  emptyLabel,
  onClose,
}: {
  items: { key: string; title: string; sub: string; onPick: () => void }[];
  emptyLabel: string;
  onClose: () => void;
}) {
  return (
    <ul className="absolute z-20 mt-1 max-h-[min(16rem,50vh)] w-full overflow-auto rounded-2xl bg-white py-1 shadow-card ring-1 ring-navy/10">
      {items.length === 0 && <li className="px-3 py-2 text-sm text-navy/50">{emptyLabel}</li>}
      {items.map((it) => (
        <li key={it.key}>
          <button
            type="button"
            className="flex w-full flex-col px-3 py-3 text-left hover:bg-sky-50"
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
          className="grid h-11 w-11 place-items-center rounded-full bg-white text-navy shadow-sm"
          onClick={() => onChange(Math.max(min, value - 1))}
          aria-label={`Decrease ${label}`}
        >
          <Minus className="h-3.5 w-3.5" />
        </button>
        <span className="w-5 text-center text-sm font-bold text-navy">{value}</span>
        <button
          type="button"
          className="grid h-11 w-11 place-items-center rounded-full bg-white text-navy shadow-sm"
          onClick={() => onChange(value + 1)}
          aria-label={`Increase ${label}`}
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
