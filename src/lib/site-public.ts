export type SiteSettings = {
  chatEnabled: boolean;
  maintenance: boolean;
  banner: string;
  contactEmail: string;
  supportHours: string;
  defaultFrom: string;
  announceFr: string;
};

export type PublicSettings = {
  chatEnabled: boolean;
  maintenance: boolean;
  banner: string;
  announceFr: string;
  contactEmail: string;
  supportHours: string;
  defaultFrom: string;
};

export const defaultSettings: SiteSettings = {
  chatEnabled: true,
  maintenance: false,
  banner: "",
  contactEmail: "hello@airstay.ca",
  supportHours: "Daily 8am–10pm ET",
  defaultFrom: "YYZ",
  announceFr: "",
};
