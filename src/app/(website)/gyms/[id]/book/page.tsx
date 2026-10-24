import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { CheckoutForm } from "@/components/booking/CheckoutForm";
import { getPublicGymProfile } from "@/server/modules/gyms";
import { MAX_DAYS_AHEAD } from "@/server/modules/bookings";
import { getSessionUser } from "@/server/session";
import { env, features } from "@/server/env";
import { addDays, daysBetween, isIsoDate, todayIn } from "@/lib/dates";
import { isPassType } from "@/lib/passes";

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await getTranslations("gym"))("bookPass") };
}

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ pass?: string; date?: string; cancelled?: string }>;
};

export default async function BookPage({ params, searchParams }: Props) {
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const profile = await getPublicGymProfile(id);
  if (!profile) notFound();

  const user = await getSessionUser();
  if (!user) {
    const back = `/gyms/${profile.gym.slug}/book${query.pass ? `?pass=${query.pass}` : ""}`;
    redirect(`/login?next=${encodeURIComponent(back)}`);
  }

  const today = todayIn(profile.gym.timezone);
  const wanted = query.date && isIsoDate(query.date) ? query.date : today;
  const offset = daysBetween(today, wanted);
  const initialDate = offset >= 0 && offset <= MAX_DAYS_AHEAD ? wanted : today;

  return (
    <div className="px-4 pt-4 sm:px-6 lg:px-8">
      <CheckoutForm
        gym={profile.gym}
        today={today}
        maxDaysAhead={MAX_DAYS_AHEAD}
        initialPass={isPassType(query.pass) ? query.pass : "day"}
        initialDate={initialDate || addDays(today, 0)}
        holder={{ name: user.name ?? "", phone: user.phone ?? "" }}
        onlineEnabled={features.onlinePayments}
        onlineProvider={env.payments.provider}
        deskEnabled={env.payments.allowPayAtDesk}
        cancelled={query.cancelled === "1"}
      />
    </div>
  );
}
