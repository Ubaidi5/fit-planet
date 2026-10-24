import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { HiOutlineEnvelopeOpen } from "react-icons/hi2";
import { AuthShell } from "@/components/auth/AuthShell";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("auth.checkEmail");
  return { title: t("meta") };
}

export default async function CheckEmailPage() {
  const t = await getTranslations("auth.checkEmail");
  return (
    <AuthShell variant="member">
      <div className="text-center">
        <span className="mx-auto flex size-16 items-center justify-center rounded-3xl bg-volt text-ink shadow-soft">
          <HiOutlineEnvelopeOpen className="size-7" />
        </span>
        <h1 className="mt-6 text-[1.75rem] font-semibold tracking-[-0.03em] text-ink">{t("title")}</h1>
        <p className="mt-2 text-[15px] leading-relaxed text-gray-600">
          {t("text")}
        </p>
        <p className="mt-8 text-sm text-gray-500">
          {t("nothing")}{" "}
          <Link href="/login" className="font-semibold text-ink underline-offset-4 hover:underline">
            {t("retry")}
          </Link>
          .
        </p>
      </div>
    </AuthShell>
  );
}
