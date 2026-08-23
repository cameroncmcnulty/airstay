"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import {
  addDays,
  cmpIso,
  formatBubble,
  fromIso,
  monthLabel,
  nightsBetweenIso,
  toIso,
  todayIso,
  weekdayLabels,
} from "@/lib/dates";

type Mode = "range" | "single";
type Step = "start" | "end";

export function DateRangePicker({
  mode,
  start,
  end,
  locale,
  weekStartsOn = 0,
  labels,
  openOn,
  onConfirm,
  onClose,
}: {
  mode: Mode;
  start: string;
  end?: string;
  locale: string;
  weekStartsOn?: 0 | 1;
  labels: {
    start: string;
    end: string;
    nights: string;
    confirm: string;
    pickStart: string;
    pickEnd: string;
    nextDay: string;
  };
  openOn: Step;
  onConfirm: (start: string, end?: string) => void;
  onClose: () => void;
}) {
  const min = todayIso();
  const [view, setView] = useState(() => {
    const seed = start || min;
    const d = fromIso(seed);
    return { y: d.getFullYear(), m: d.getMonth() };
  });
  const [step, setStep] = useState<Step>(mode === "single" ? "start" : openOn);
  const [draftStart, setDraftStart] = useState(start || "");
  const [draftEnd, setDraftEnd] = useState(mode === "single" ? "" : end || "");
  const [hover, setHover] = useState<string | null>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const loc = locale === "fr" ? "fr-CA" : "en-CA";
  const heads = weekdayLabels(loc, weekStartsOn);
  const months = useMemo(() => {
    const first = { y: view.y, m: view.m };
    const secondM = view.m + 1;
    const second = { y: secondM > 11 ? view.y + 1 : view.y, m: secondM > 11 ? 0 : secondM };
    return [first, second];
  }, [view]);

  const previewEnd =
    mode === "range" && step === "end" && draftStart
      ? hover && cmpIso(hover, draftStart) > 0
        ? hover
        : draftEnd || addDays(draftStart, 1)
      : draftEnd;

  const canConfirm =
    mode === "single"
      ? Boolean(draftStart)
      : Boolean(draftStart && previewEnd && cmpIso(previewEnd, draftStart) > 0);

  const nights = nightsBetweenIso(draftStart, previewEnd);

  function pick(iso: string) {
    if (cmpIso(iso, min) < 0) return;
    if (mode === "single") {
      setDraftStart(iso);
      setStep("start");
      return;
    }
    if (step === "start") {
      setDraftStart(iso);
      const next = addDays(iso, 1);
      setDraftEnd(next);
      setStep("end");
      setHover(null);
      return;
    }
    if (cmpIso(iso, draftStart) <= 0) return;
    setDraftEnd(iso);
    setHover(null);
  }

  function shift(delta: number) {
    setView((v) => {
      const d = new Date(v.y, v.m + delta, 1);
      return { y: d.getFullYear(), m: d.getMonth() };
    });
  }

  function confirm() {
    if (!canConfirm || !draftStart) return;
    if (mode === "single") onConfirm(draftStart);
    else onConfirm(draftStart, previewEnd);
  }

  return (
    <div className="mt-2 overflow-hidden rounded-[1.4rem] border border-navy/10 bg-white shadow-card">
      <div className="flex items-center justify-between gap-3 border-b border-navy/5 px-4 py-3">
        <p className="text-sm font-bold text-navy">
          {mode === "single" || step === "start" ? labels.pickStart : labels.pickEnd}
        </p>
        <div className="flex items-center gap-1">
          <button type="button" className="grid h-8 w-8 place-items-center rounded-full hover:bg-mist" onClick={() => shift(-1)} aria-label="Previous month">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button type="button" className="grid h-8 w-8 place-items-center rounded-full hover:bg-mist" onClick={() => shift(1)} aria-label="Next month">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="grid gap-6 p-3 sm:grid-cols-2 sm:p-4">
        {months.map((mo) => (
          <MonthGrid
            key={`${mo.y}-${mo.m}`}
            year={mo.y}
            month={mo.m}
            locale={loc}
            weekStartsOn={weekStartsOn}
            heads={heads}
            min={min}
            step={step}
            mode={mode}
            start={draftStart}
            end={previewEnd}
            onPick={pick}
            onHover={setHover}
          />
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-navy/5 bg-mist/70 px-4 py-3">
        <div className="min-w-0 text-sm">
          {draftStart ? (
            <>
              <p className="font-extrabold text-navy">
                {formatBubble(draftStart, loc)}
                {mode === "range" && previewEnd ? ` – ${formatBubble(previewEnd, loc)}` : ""}
              </p>
              <p className="text-xs font-semibold text-navy/50">
                {mode === "range" && draftStart && !end && step === "end" && previewEnd === addDays(draftStart, 1)
                  ? labels.nextDay
                  : mode === "range"
                    ? labels.nights.replace("{n}", String(nights))
                    : labels.start}
              </p>
            </>
          ) : (
            <p className="text-sm font-semibold text-navy/50">{labels.pickStart}</p>
          )}
        </div>
        <button
          type="button"
          disabled={!canConfirm}
          onClick={confirm}
          className="inline-flex items-center gap-2 rounded-full bg-sky px-4 py-2.5 text-sm font-bold text-white shadow-lift disabled:cursor-not-allowed disabled:bg-navy/20 disabled:shadow-none"
        >
          <span className="grid h-6 w-6 place-items-center rounded-full bg-white/20">
            <Check className="h-4 w-4" strokeWidth={3} />
          </span>
          {labels.confirm}
        </button>
      </div>
    </div>
  );
}

function MonthGrid({
  year,
  month,
  locale,
  weekStartsOn,
  heads,
  min,
  step,
  mode,
  start,
  end,
  onPick,
  onHover,
}: {
  year: number;
  month: number;
  locale: string;
  weekStartsOn: 0 | 1;
  heads: string[];
  min: string;
  step: Step;
  mode: Mode;
  start: string;
  end?: string;
  onPick: (iso: string) => void;
  onHover: (iso: string | null) => void;
}) {
  const first = new Date(year, month, 1);
  const firstWeekday = first.getDay();
  const offset = (firstWeekday - weekStartsOn + 7) % 7;
  const count = new Date(year, month + 1, 0).getDate();
  const cells: Array<string | null> = [...Array(offset).fill(null), ...Array.from({ length: count }, (_, i) => toIso(new Date(year, month, i + 1)))];
  while (cells.length % 7) cells.push(null);

  return (
    <div>
      <p className="mb-2 text-center text-sm font-black capitalize text-navy">{monthLabel(year, month, locale)}</p>
      <div className="grid grid-cols-7 gap-y-1 text-center text-[11px] font-bold uppercase tracking-wide text-navy/40">
        {heads.map((h, i) => (
          <span key={`${h}-${i}`}>{h}</span>
        ))}
      </div>
      <div className="mt-1 grid grid-cols-7">
        {cells.map((iso, i) => {
          if (!iso) return <span key={`e-${i}`} />;
          const disabled =
            cmpIso(iso, min) < 0 || (mode === "range" && step === "end" && Boolean(start) && cmpIso(iso, start) <= 0);
          const isStart = iso === start;
          const isEnd = Boolean(end && iso === end);
          const inRange = Boolean(start && end && cmpIso(iso, start) > 0 && cmpIso(iso, end) < 0);
          const tentativeNext = mode === "range" && start && !end && iso === addDays(start, 1);
          return (
            <button
              key={iso}
              type="button"
              disabled={disabled}
              onClick={() => onPick(iso)}
              onMouseEnter={() => !disabled && onHover(iso)}
              onMouseLeave={() => onHover(null)}
              className={`relative h-10 text-sm font-bold ${disabled ? "cursor-not-allowed text-navy/25" : "text-navy"}`}
            >
              {inRange && <span className="absolute inset-y-1 left-0 right-0 bg-sky-100" />}
              {isStart && end && <span className="absolute inset-y-1 left-1/2 right-0 bg-sky-100" />}
              {isEnd && start && <span className="absolute inset-y-1 left-0 right-1/2 bg-sky-100" />}
              <span
                className={`relative z-[1] mx-auto grid h-9 w-9 place-items-center rounded-full ${
                  isStart || isEnd
                    ? "bg-navy text-white shadow-sm"
                    : tentativeNext
                      ? "ring-2 ring-sky text-navy"
                      : inRange
                        ? "text-sky-900"
                        : disabled
                          ? ""
                          : "hover:bg-sky-50"
                }`}
              >
                {fromIso(iso).getDate()}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function DateBubble({
  label,
  value,
  locale,
  active,
  onClick,
}: {
  label: string;
  value: string;
  locale: string;
  active?: boolean;
  onClick: () => void;
}) {
  const loc = locale === "fr" ? "fr-CA" : "en-CA";
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`field flex w-full items-center text-left ${active ? "border-sky bg-white ring-4 ring-sky/20" : ""}`}
    >
      <span className="text-base font-bold text-navy">{value ? formatBubble(value, loc) : "—"}</span>
    </button>
  );
}
