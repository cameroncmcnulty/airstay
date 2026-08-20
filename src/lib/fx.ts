const FALLBACK: Record<string, number> = {
  CAD: 1,
  USD: 1.38,
  EUR: 1.52,
  GBP: 1.76,
  MXN: 0.074,
  JPY: 0.0093,
  AUD: 0.91,
  CHF: 1.62,
  DOP: 0.023,
  JMD: 0.0088,
};

let cache: { at: number; rates: Record<string, number> } | null = null;

export async function toCad(amount: number, currency?: string | null): Promise<number> {
  if (!Number.isFinite(amount) || amount <= 0) return 0;
  const code = (currency || "CAD").toUpperCase();
  if (code === "CAD") return Math.round(amount);
  const rate = await rateToCad(code);
  return Math.round(amount * rate);
}

async function rateToCad(code: string): Promise<number> {
  if (code === "CAD") return 1;
  const now = Date.now();
  if (!cache || now - cache.at > 12 * 60 * 60 * 1000) {
    try {
      const res = await fetch("https://api.frankfurter.app/latest?from=USD", { next: { revalidate: 43200 } });
      if (res.ok) {
        const json = (await res.json()) as { rates?: Record<string, number> };
        const usdCad = json.rates?.CAD || FALLBACK.USD;
        const rates: Record<string, number> = { USD: usdCad, CAD: 1 };
        for (const [k, v] of Object.entries(json.rates || {})) {
          if (k === "CAD") continue;
          rates[k] = usdCad / v;
        }
        cache = { at: now, rates };
      }
    } catch {
      cache = { at: now, rates: { ...FALLBACK } };
    }
  }
  const rates = cache?.rates || FALLBACK;
  if (rates[code]) return rates[code];
  if (FALLBACK[code]) return FALLBACK[code];
  return 1;
}
