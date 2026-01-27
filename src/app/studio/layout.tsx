import type { Metadata } from "next";
import { StudioLayoutWrapper } from "@/components/studio/StudioLayoutWrapper";

export const metadata: Metadata = {
  title: "Studio | Fit Planet",
  description:
    "Manage your gym business with Fit Planet Studio. Handle bookings, capacity, pricing, and analytics all in one place.",
};

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <StudioLayoutWrapper>{children}</StudioLayoutWrapper>;
}
