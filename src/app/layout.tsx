import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Fit Planet - Find Your Perfect Gym, Book Instantly",
  description:
    "Discover gyms near you, compare plans, and book day passes or memberships with just your phone. Your gym service broker for seamless fitness booking.",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
