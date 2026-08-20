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

export const metadata: Metadata = {
  title: {
    default: "AIRSTAY — Compare travel out of Canada",
    template: "%s · AIRSTAY",
  },
  description:
    "AIRSTAY is a Canada-outbound travel metasearch for flights, stays, cars and packages. Compare partner prices in CAD and book on Kayak, Expedia, Booking.com and more.",
  metadataBase: new URL("https://airstay.ca"),
  icons: {
    icon: "/favicon.png",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "AIRSTAY — Compare travel out of Canada",
    description: "Flights, stays, cars and packages from Canadian airports. Prices in CAD.",
    locale: "en_CA",
    alternateLocale: "fr_CA",
    type: "website",
  },
  other: {
    "geo.region": "CA",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-CA">
      <head>
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
