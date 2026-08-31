/**
 * 766682 = partner marker (from your tpx.li links).
 * 564250 = project / trs. Never send 564250 as marker — Airalo/Impact rejects it.
 */
function partnerMarker() {
  const m = (process.env.TRAVELPAYOUTS_MARKER || "").trim();
  if (m && m !== "564250") return m;
  return "766682";
}

export const TP_MARKER = partnerMarker();
export const TP_TRS = process.env.TRAVELPAYOUTS_TRS || "564250";

type Brand = {
  short: string;
  campaign: number;
  p: number;
  hosts: string[];
  home: string;
};

export const TP_BRANDS = {
  airalo: { short: "https://airalo.tpx.li/jM2n8Qvr", campaign: 541, p: 8310, hosts: ["airalo.com"], home: "https://airalo.com" },
  aviasales: { short: "https://aviasales.tpx.li/GAEX5Ehz", campaign: 100, p: 4114, hosts: ["aviasales.com", "aviasales.ru"], home: "https://www.aviasales.com" },
  yesim: { short: "https://yesim.tpx.li/S0EdIOgu", campaign: 224, p: 5998, hosts: ["yesim.tech", "yesim.app"], home: "https://yesim.tech" },
  saily: { short: "https://saily.tpx.li/RCcs7dny", campaign: 629, p: 8979, hosts: ["saily.com"], home: "https://saily.com" },
  drimsim: { short: "https://drimsim.tpx.li/FbLqFVQs", campaign: 102, p: 2762, hosts: ["drimsim.com", "w1.drimsim.com"], home: "https://w1.drimsim.com" },
  klook: { short: "https://klook.tpx.li/jDGzJzdr", campaign: 137, p: 4110, hosts: ["klook.com"], home: "https://www.klook.com" },
  kiwitaxi: { short: "https://kiwitaxi.tpx.li/eF7SwuGu", campaign: 1, p: 647, hosts: ["kiwitaxi.com"], home: "https://kiwitaxi.com" },
  localrent: { short: "https://localrent.tpx.li/Xm3gs8Rn", campaign: 87, p: 2043, hosts: ["localrent.com"], home: "https://localrent.com/en" },
  welcomepickups: { short: "https://tpx.li/sZCogj51", campaign: 627, p: 8919, hosts: ["welcomepickups.com"], home: "https://welcomepickups.com" },
  tiqets: { short: "https://tiqets.tpx.li/r9VhA92Q", campaign: 89, p: 2074, hosts: ["tiqets.com"], home: "https://www.tiqets.com" },
  gettransfer: { short: "https://gettransfer.tpx.li/ITXyPqC0", campaign: 147, p: 4439, hosts: ["gettransfer.com"], home: "https://gettransfer.com" },
  getrentacar: { short: "https://getrentacar.tpx.li/95nURS2D", campaign: 222, p: 5996, hosts: ["getrentacar.com"], home: "https://getrentacar.com" },
  airhelp: { short: "https://airhelp.tpx.li/0L8Sylnr", campaign: 120, p: 9139, hosts: ["airhelp.com"], home: "https://www.airhelp.com" },
  gocity: { short: "https://gocity.tpx.li/e3gpogq7", campaign: 62, p: 1942, hosts: ["gocity.com"], home: "https://gocity.com" },
  ektatraveling: { short: "https://ektatraveling.tpx.li/J5xb029K", campaign: 225, p: 5869, hosts: ["ektatraveling.com"], home: "https://ektatraveling.com" },
  economybookings: { short: "https://economybookings.tpx.li/rT43cxre", campaign: 10, p: 2018, hosts: ["economybookings.com"], home: "https://www.economybookings.com" },
  bikesbooking: { short: "https://bikesbooking.tpx.li/9md2L3sa", campaign: 57, p: 1767, hosts: ["bikesbooking.com"], home: "https://bikesbooking.com" },
  qeeq: { short: "https://qeeq.tpx.li/MfyqLITr", campaign: 172, p: 4845, hosts: ["qeeq.com"], home: "https://qeeq.com" },
  wegotrip: { short: "https://wegotrip.tpx.li/YJSQ01bC", campaign: 150, p: 4487, hosts: ["wegotrip.com"], home: "https://wegotrip.com" },
  autoeurope: { short: "https://autoeurope.tpx.li/2bPGZuxm", campaign: 143, p: 4354, hosts: ["autoeurope.eu", "autoeurope.com"], home: "https://www.autoeurope.eu" },
  radicalstorage: { short: "https://radicalstorage.tpx.li/pqUOepsS", campaign: 209, p: 5867, hosts: ["radicalstorage.com"], home: "https://radicalstorage.com" },
  intui: { short: "https://intui.tpx.li/8wpGiBFG", campaign: 22, p: 657, hosts: ["intui.travel"], home: "https://intui.travel" },
  compensair: { short: "https://compensair.tpx.li/O1eIfSWz", campaign: 86, p: 4129, hosts: ["compensair.com"], home: "https://compensair.com" },
  kkday: { short: "https://kkday.tpx.li/lRXSVINx", campaign: 633, p: 9074, hosts: ["kkday.com"], home: "https://www.kkday.com" },
} as const;

export type TpBrand = keyof typeof TP_BRANDS;

function hostOf(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return "";
  }
}

function brandForHost(host: string): TpBrand | undefined {
  const h = host.replace(/^www\./, "").toLowerCase();
  return (Object.keys(TP_BRANDS) as TpBrand[]).find((key) =>
    TP_BRANDS[key].hosts.some((x) => h === x || h.endsWith(`.${x}`))
  );
}

function normalizeDest(url: string, brand: TpBrand) {
  try {
    const u = new URL(url);
    if (brand === "airalo") {
      const m = u.pathname.match(/^\/([a-z0-9-]+-esim)(?:\/.*)?$/i);
      if (m) {
        u.pathname = `/${m[1]}`;
        u.search = "";
        u.hash = "";
      }
    }
    let out = u.toString();
    if (out.endsWith("/") && u.pathname !== "/") out = out.slice(0, -1);
    return out;
  } catch {
    return url;
  }
}

/** Travelpayouts click → brand page. Uses the official tp.media template from your short links. */
export function tpTrack(brand: TpBrand, dest?: string) {
  const b = TP_BRANDS[brand];
  const target = normalizeDest(dest || b.home, brand);
  const params = new URLSearchParams({
    campaign_id: String(b.campaign),
    marker: TP_MARKER,
    p: String(b.p),
    trs: TP_TRS,
    sub_id: "airstay.ca",
    u: target,
  });
  return `https://tp.media/r?${params.toString()}`;
}

/** If the URL is a Travelpayouts brand we have a short link for, wrap it. Otherwise leave it. */
export function tpWrap(url?: string) {
  if (!url || url === "#") return url || "#";
  if (url.includes("tpx.li") || url.includes("tp.media/r?")) return url;
  const brand = brandForHost(hostOf(url));
  if (!brand) return url;
  return tpTrack(brand, url);
}

export function tpMediaUrl(brand: TpBrand, dest?: string) {
  const b = TP_BRANDS[brand];
  const params = new URLSearchParams({
    campaign_id: String(b.campaign),
    marker: TP_MARKER,
    p: String(b.p),
    trs: TP_TRS,
    sub_id: "airstay.ca",
    u: dest || b.home,
  });
  return `https://tp.media/r?${params.toString()}`;
}
