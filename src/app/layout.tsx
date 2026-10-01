import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, JetBrains_Mono } from "next/font/google";
import "@/styles/globals.css";
import { LocaleProvider } from "@/lib/i18n/LocaleProvider";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin", "latin-ext", "vietnamese"],
  axes: ["opsz"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin", "latin-ext", "cyrillic"],
});

export const metadata: Metadata = {
  title: {
    default: "Fit Planet · One pass for every gym on the planet",
    template: "%s · Fit Planet",
  },
  description:
    "Fit Planet is your fitness passport. Find gyms in any city, see how busy they are, book day passes in local currency and walk in with a QR code. Gym owners get bookings, capacity and payouts in one studio.",
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
  themeColor: "#eef0ec",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr" className="scroll-pt-24" suppressHydrationWarning>
      <body
        className={`${bricolage.variable} ${jetbrains.variable} font-sans antialiased`}
      >
        <LocaleProvider>{children}</LocaleProvider>
      </body>
    </html>
  );
}
