export function pad2(n: number) {
  return String(n).padStart(2, "0");
}

export function toIso(d: Date) {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

export function fromIso(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, (m || 1) - 1, d || 1);
}

export function todayIso() {
  return toIso(new Date());
}

export function addDays(iso: string, n: number) {
  const d = fromIso(iso);
  d.setDate(d.getDate() + n);
  return toIso(d);
}

export function cmpIso(a: string, b: string) {
  return a.localeCompare(b);
}

export function nightsBetweenIso(a?: string, b?: string) {
  if (!a || !b) return 0;
  const ms = fromIso(b).getTime() - fromIso(a).getTime();
  return Math.max(0, Math.round(ms / 86400000));
}

export function monthLabel(year: number, month: number, locale: string) {
  return new Date(year, month, 1).toLocaleDateString(locale, { month: "long", year: "numeric" });
}

export function formatBubble(iso: string, locale: string) {
  if (!iso) return "";
  return fromIso(iso).toLocaleDateString(locale, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export function weekdayLabels(locale: string, weekStartsOn: 0 | 1) {
  const base = weekStartsOn === 1 ? 1 : 0;
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(2026, 1, 1 + base + i);
    return d.toLocaleDateString(locale, { weekday: "narrow" });
  });
}
