import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import QRCode from "qrcode";
import { requireUser } from "@/server/session";
import { listUserBookings } from "@/server/modules/bookings";
import { passportStamps } from "@/server/modules/checkins";
import { PassesView } from "@/components/pass/PassesView";

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await getTranslations("wallet"))("title") };
}

export default async function PassesPage() {
  const user = await requireUser("/app/passes");
  const [bookings, stamps] = await Promise.all([listUserBookings(user._id), passportStamps(user._id)]);
  const wallet = bookings.filter((b) => b.isActive || b.isUpcoming);
  const qr = Object.fromEntries(
    await Promise.all(
      wallet.map(async (b) => [b.code, await QRCode.toString(b.code, { type: "svg", margin: 0, errorCorrectionLevel: "M", color: { dark: "#1c2550", light: "#ffffff00" } })] as const),
    ),
  );
  return <PassesView bookings={bookings} stampList={stamps} qr={qr} />;
}
