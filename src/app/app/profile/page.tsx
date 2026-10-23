import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import Link from "next/link";
import { HiArrowRight, HiOutlineShieldCheck } from "react-icons/hi2";
import { requireUser, initials } from "@/server/session";
import { listCities } from "@/server/modules/gyms";
import { ProfileForm } from "@/components/member/ProfileForm";

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await getTranslations("settings"))("profile") };
}

export default async function ProfilePage() {
  const user = await requireUser("/app/profile");
  const cities = (await listCities()).map((c) => c.city);
  const t = await getTranslations("settings");
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-[1.75rem] font-semibold tracking-[-0.035em] text-ink sm:text-4xl">{t("profile")}</h1>
      <p className="mt-1 text-gray-500">{t("profileLead")}</p>
      <div className="mt-6 rounded-[1.75rem] bg-surface p-5 shadow-soft ring-1 ring-gray-900/[0.05] sm:p-8">
        <ProfileForm
          cities={cities}
          initial={{
            name: user.name ?? "",
            email: user.email ?? "",
            phone: user.phone ?? "",
            homeCity: user.homeCity ?? "",
            regionCode: user.regionCode ?? "INTL",
            image: user.image ?? "",
            initials: initials(user.name),
          }}
        />
      </div>
      <Link href="/app/security" className="mt-4 flex items-center gap-4 rounded-3xl bg-surface px-5 py-4 shadow-soft ring-1 ring-gray-900/[0.05] hover:bg-white">
        <span className="flex size-10 items-center justify-center rounded-2xl bg-canvas text-ink">
          <HiOutlineShieldCheck className="size-5" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-medium text-ink">{t("security")}</span>
          <span className="block text-sm text-gray-500">{t("securityHint")}</span>
        </span>
        <HiArrowRight className="size-4 text-gray-400 rtl:rotate-180" />
      </Link>
    </div>
  );
}
