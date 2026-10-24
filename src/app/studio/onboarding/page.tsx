import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Logo } from "@/components/brand/Logo";
import { GymEditor } from "@/components/studio/GymEditor";
import { emptyGymValues } from "@/components/studio/gym-form-values";
import { getOwnerContext } from "@/server/session";

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await getTranslations("studio.onboarding"))("meta") };
}
export const dynamic = "force-dynamic";

export default async function OnboardingPage({ searchParams }: { searchParams: Promise<{ another?: string }> }) {
  const { user, gyms } = await getOwnerContext();
  if (!user) redirect("/studio/login?next=/studio/onboarding");
  const { another } = await searchParams;
  const t = await getTranslations("studio.onboarding");
  if (gyms.length > 0 && !another) redirect("/studio/dashboard");

  return (
    <div className="min-h-screen">
      <header className="mx-auto flex h-18 max-w-3xl items-center justify-between px-4 sm:px-6">
        <Logo href="/" tag="Studio" />
        <span className="text-sm text-gray-500">{t("time")}</span>
      </header>
      <main className="mx-auto max-w-3xl px-4 pt-4 sm:px-6">
        <p className="font-mono text-[11px] tracking-[0.16em] text-emerald-700 uppercase">{t("eyebrow")}</p>
        <h1 className="mt-2 text-[1.75rem] leading-tight font-semibold tracking-[-0.035em] text-ink sm:text-4xl">
          {user.name ? t("titleNamed", { name: user.name.split(" ")[0] }) : t("title")}
        </h1>
        <p className="mt-2 mb-8 text-[15px] text-gray-600">{t("lead")}</p>
        <GymEditor mode="onboarding" initial={emptyGymValues()} />
      </main>
    </div>
  );
}
