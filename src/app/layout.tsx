import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

const travelpayoutsLoader = `(function () {
var script = document.createElement("script");
script.async = 1;
script.setAttribute("data-cmp-ab","2");
script.src = 'https://tp-em.com/NTY0MjUw.js?t=564250';
document.head.appendChild(script);
})();`;

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

const siteTitle = "AIRSTAY — Canadian travel. No booking fees.";
const siteDescription =
  "Flights, hotels and cars from Canada — in CAD, with zero AIRSTAY booking fees. Made by Canadians, for Canadians.";

export const metadata: Metadata = {
  title: {
    default: siteTitle,
    template: "%s · AIRSTAY",
  },
  description: siteDescription,
  applicationName: "AIRSTAY",
  metadataBase: new URL("https://airstay.ca"),
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.png", sizes: "64x64", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  openGraph: {
    title: siteTitle,
    description: "Canadian travel in CAD. No booking fees from AIRSTAY.",
    url: "https://airstay.ca",
    siteName: "AIRSTAY",
    locale: "en_CA",
    alternateLocale: "fr_CA",
    type: "website",
    images: [
      {
        url: "https://airstay.ca/og.jpg?v=4",
        width: 1200,
        height: 630,
        alt: "AIRSTAY — Canada's choice to compare flights, hotels and car rentals",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: "Canadian travel in CAD. No booking fees from AIRSTAY.",
    images: ["https://airstay.ca/og.jpg?v=4"],
  },
  other: {
    "geo.region": "CA",
    "og:image:secure_url": "https://airstay.ca/og.jpg?v=4",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-CA">
      <head>
        <link rel="image_src" href="https://airstay.ca/og.jpg?v=4" />
        <script
          data-cmp-ab="2"
          data-no-defer="1"
          dangerouslySetInnerHTML={{ __html: travelpayoutsLoader }}
        />
      </head>
      <body className={`${jakarta.variable} font-sans`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
