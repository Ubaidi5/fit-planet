import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { default: "Studio", template: "%s · Fit Planet Studio" },
  description: "Run your gym on Fit Planet: bookings, check-ins, pricing and revenue in one place.",
};

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return children;
}
