import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import "@/styles/globals.css";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: {
    default: "Fit Planet · Find your gym, book in seconds",
    template: "%s · Fit Planet",
  },
  description:
    "Fit Planet connects people with the gyms around them. Discover gyms, compare passes, book instantly and check in with a QR code. Gym owners get bookings, capacity and payouts in one studio.",
  keywords: [
    "gym",
    "fitness",
    "workout",
    "gym booking",
    "day pass",
    "gym membership",
    "fitness app",
  ],
};

export const viewport: Viewport = {
  themeColor: "#f3f1ec",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-pt-24">
      <body
        className={`${geist.variable} ${geistMono.variable} ${instrumentSerif.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
