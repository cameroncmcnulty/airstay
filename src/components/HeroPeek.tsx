"use client";

import Link from "next/link";
import { getAirport, getDestination } from "@/lib/airports";
import { DEST_PHOTOS } from "@/lib/deals";
import { defaultDepart, defaultReturn, queryToParams } from "@/lib/deeplinks";
import { useApp } from "@/context/AppContext";

type Vibe = "beach" | "city" | "pacific" | "island" | "longhaul" | "weekend";
type Season = "winter" | "spring" | "summer" | "fall";

type Peek = { code: string; photo?: string; vibe: Vibe };

const WEST = new Set(["YVR", "YYC", "YEG", "YYJ", "YLW", "YXS"]);
const EAST = new Set(["YUL", "YQB", "YHZ", "YYT", "YOW"]);

function seasonOf(month: number): Season {
  if (month === 11 || month <= 2) return "winter";
  if (month <= 5) return "spring";
  if (month <= 7) return "summer";
  return "fall";
}

function picksFor(from: string, season: Season): Peek[] {
  const region = WEST.has(from) ? "west" : EAST.has(from) ? "east" : "central";
  if (season === "winter") {
    if (region === "west") {
      return [
        { code: "PVR", vibe: "pacific" },
        { code: "CUN", vibe: "beach" },
        { code: "HNL", vibe: "island" },
        { code: "LAS", vibe: "weekend" },
      ];
    }
    if (region === "east") {
      return [
        { code: "CUN", vibe: "beach" },
        { code: "PUJ", vibe: "island" },
        { code: "MCO", vibe: "weekend" },
        { code: "LIS", vibe: "city" },
      ];
    }
    return [
      { code: "CUN", vibe: "beach" },
      { code: "PVR", vibe: "pacific" },
      { code: "MBJ", vibe: "island" },
      { code: "LAS", vibe: "weekend" },
    ];
  }
  if (season === "spring") {
    if (region === "west") {
      return [
        { code: "NRT", vibe: "longhaul" },
        { code: "LIS", vibe: "city" },
        { code: "PVR", vibe: "pacific" },
        { code: "LAS", vibe: "weekend" },
      ];
    }
    if (region === "east") {
      return [
        { code: "CDG", vibe: "city" },
        { code: "LIS", vibe: "city" },
        { code: "CUN", vibe: "beach" },
        { code: "FCO", vibe: "city" },
      ];
    }
    return [
      { code: "LIS", vibe: "city" },
      { code: "BCN", vibe: "city" },
      { code: "CUN", vibe: "beach" },
      { code: "LHR", vibe: "city" },
    ];
  }
  if (season === "summer") {
    if (region === "west") {
      return [
        { code: "HNL", vibe: "island" },
        { code: "LHR", vibe: "city" },
        { code: "KEF", vibe: "longhaul" },
        { code: "YYT", photo: "KEF", vibe: "weekend" },
      ];
    }
    if (region === "east") {
      return [
        { code: "CDG", vibe: "city" },
        { code: "FCO", vibe: "city" },
        { code: "LIS", vibe: "city" },
        { code: "KEF", vibe: "longhaul" },
      ];
    }
    return [
      { code: "LHR", vibe: "city" },
      { code: "BCN", vibe: "city" },
      { code: "KEF", vibe: "longhaul" },
      { code: "HNL", vibe: "island" },
    ];
  }
  if (region === "west") {
    return [
      { code: "NRT", vibe: "longhaul" },
      { code: "CDG", vibe: "city" },
      { code: "SJD", vibe: "pacific" },
      { code: "LAS", vibe: "weekend" },
    ];
  }
  if (region === "east") {
    return [
      { code: "FCO", vibe: "city" },
      { code: "LIS", vibe: "city" },
      { code: "CUN", vibe: "beach" },
      { code: "NRT", vibe: "longhaul" },
    ];
  }
  return [
    { code: "CDG", vibe: "city" },
    { code: "NRT", vibe: "longhaul" },
    { code: "CUN", vibe: "beach" },
    { code: "FCO", vibe: "city" },
  ];
}

export function HeroPeek({ from }: { from: string }) {
  const { m, locale, origin: geo } = useApp();
  const season = seasonOf(new Date().getMonth());
  const picks = picksFor(from, season);
  const origin = getAirport(from);
  const city = origin ? (locale === "fr" ? origin.cityFr : origin.city) : from;
  const terminal = origin ? (locale === "fr" ? origin.nameFr : origin.name) : from;
  const seasonLabel =
    season === "winter"
      ? m.hero.seasonWinter
      : season === "spring"
        ? m.hero.seasonSpring
        : season === "summer"
          ? m.hero.seasonSummer
          : m.hero.seasonFall;
  const vibeLabel = (vibe: Vibe) =>
    vibe === "beach"
      ? m.hero.vibeBeach
      : vibe === "city"
        ? m.hero.vibeCity
        : vibe === "pacific"
          ? m.hero.vibePacific
          : vibe === "island"
            ? m.hero.vibeIsland
            : vibe === "longhaul"
              ? m.hero.vibeLonghaul
              : m.hero.vibeWeekend;

  return (
    <div className="w-full max-w-md">
      <div className="mb-2 flex items-baseline justify-between gap-3 text-white">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/70">
          {geo?.source === "ip"
            ? m.hero.nearYou.replace("{airport}", `${city} (${from})`)
            : m.hero.ideas.replace("{city}", city)}
        </p>
        <p className="text-[11px] font-semibold text-sky-100/90">{seasonLabel}</p>
      </div>
      {geo?.source === "ip" && (
        <p className="mb-2 text-[11px] font-semibold text-white/65">{m.hero.fromArea} · {terminal}</p>
      )}
      <div className="grid grid-cols-2 gap-2">
        {picks.map((p) => {
          const d = getDestination(p.code);
          if (!d) return null;
          const href = `/results?${queryToParams({
            kind: "flights",
            from,
            to: d.code,
            toCity: locale === "fr" ? d.cityFr : d.city,
            depart: defaultDepart(),
            returnDate: defaultReturn(),
            adults: 1,
          })}`;
          return (
            <Link
              key={d.code}
              href={href}
              className="group relative col-span-1 min-w-0 overflow-hidden rounded-2xl bg-white/10 ring-1 ring-white/20"
            >
              <div className="relative h-[5.25rem] overflow-hidden sm:h-28">
                <img
                  src={DEST_PHOTOS[p.photo || d.code] || DEST_PHOTOS.LHR}
                  alt=""
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/20 to-transparent" />
                <div className="absolute inset-x-2 bottom-1.5 text-white sm:inset-x-3 sm:bottom-2.5">
                  <p className="text-[9px] font-semibold uppercase tracking-wider text-sky-100/90 sm:text-[11px]">
                    {vibeLabel(p.vibe)}
                  </p>
                  <p className="truncate text-xs font-black leading-tight sm:text-base">
                    {locale === "fr" ? d.cityFr : d.city}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
