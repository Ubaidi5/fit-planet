import Link from "next/link";
import { getTranslations } from "next-intl/server";
import Header from "@/components/layout/Header";
import { Stamp } from "@/components/passport/Stamp";

export default async function NotFound() {
  const t = await getTranslations("errorPage");
  return (
    <>
      <Header />
      <main className="flex min-h-[70vh] items-center px-4 py-16 sm:px-6">
        <div className="mx-auto flex max-w-xl flex-col items-center text-center">
          <Stamp code="404" label={t("stampLabel")} tone="ochre" />
          <h1 className="mt-8 text-[2rem] leading-[1.05] font-semibold tracking-[-0.04em] text-balance text-ink sm:text-5xl">{t("notFoundTitle")}</h1>
          <p className="mt-4 max-w-md text-[17px] leading-relaxed text-pretty text-gray-500">{t("notFoundText")}</p>
          <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Link href="/gyms" className="flex h-12 items-center justify-center rounded-full bg-ink px-6 text-[15px] font-semibold text-white transition-colors hover:bg-gray-800">
              {t("findGyms")}
            </Link>
            <Link href="/" className="flex h-12 items-center justify-center rounded-full bg-surface px-6 text-[15px] font-semibold text-ink ring-1 ring-gray-900/[0.08] transition-colors hover:bg-white">
              {t("home")}
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
