import { jsonStore } from "./json-store";
import { defaultSettings, type PublicSettings, type SiteSettings } from "./site-public";

export type { PublicSettings, SiteSettings };

const store = jsonStore<SiteSettings>("settings", defaultSettings);

export function getSettings(): SiteSettings {
  return { ...defaultSettings, ...store.load() };
}

export function saveSettings(patch: Partial<SiteSettings>) {
  const next = { ...getSettings(), ...patch };
  store.save(next);
  return next;
}

export function publicSettings(): PublicSettings {
  const s = getSettings();
  return {
    chatEnabled: s.chatEnabled,
    maintenance: s.maintenance,
    banner: s.banner,
    announceFr: s.announceFr,
    contactEmail: s.contactEmail,
    supportHours: s.supportHours,
    defaultFrom: s.defaultFrom,
  };
}
