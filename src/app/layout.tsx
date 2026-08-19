import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

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
  metadataBase: new URL("https://airstay.vercel.app"),
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
      <body className={`${jakarta.variable} font-sans`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
