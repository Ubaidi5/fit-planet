import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { HiArrowUpRight } from "react-icons/hi2";
import { Reveal } from "@/components/motion/Reveal";
import { Accent } from "@/components/sections/SectionHeading";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { cityCode } from "@/lib/data/cities";
import { countryName, formatMoney } from "@/lib/i18n/format";
import { getRegion } from "@/lib/i18n/server";
import { cityPath, jsonLd } from "@/lib/seo";
import { env } from "@/server/env";
import { cityDirectory } from "@/server/modules/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const [t, rows] = await Promise.all([getTranslations("cityPages.hub"), cityDirectory()]);
  const description = t("metaDescription", { count: rows.length });
  return {
    title: t("meta"),
    description,
    alternates: { canonical: "/gyms/in" },
    openGraph: { type: "website", title: t("meta"), description, url: "/gyms/in" },
  };
}

export default async function CitiesPage() {
  const [t, rows, region] = await Promise.all([getTranslations("cityPages"), cityDirectory(), getRegion()]);
  const country = region.code.slice(0, 2);

  // The viewer's own country first, then the rest by size
  const countries = new Map<string, typeof rows>();
  for (const row of rows) countries.set(row.country, [...(countries.get(row.country) ?? []), row]);
  const groups = [...countries].sort(([a, ra], [b, rb]) => Number(b === country) - Number(a === country) || rb.length - ra.length);

  const structured = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: t("hub.meta"),
    numberOfItems: rows.length,
    itemListElement: rows.map((row, index) => ({ "@type": "ListItem", position: index + 1, url: `${env.appUrl}${cityPath(row.city)}`, name: t("gymsInCity", { city: row.city }) })),
  };

  return (
    <main className="min-h-screen pb-20 lg:pb-28">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(structured) }} />
      <section className="relative isolate overflow-hidden">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-dot-grid [mask-image:radial-gradient(ellipse_60%_80%_at_50%_0%,black,transparent)]" />
          <div className="absolute -top-40 end-[10%] size-[26rem] rounded-full bg-volt/30 blur-3xl" />
        </div>
        <div className="mx-auto max-w-7xl px-4 pt-8 pb-10 sm:px-6 sm:pt-12 lg:px-8">
          <Breadcrumbs items={[{ label: t("home"), href: "/" }, { label: t("cities"), href: "/gyms/in" }]} label={t("trail")} />
          <p className="mt-8 animate-fade-up font-mono text-[12px] tracking-[0.16em] text-emerald-700 uppercase">
            {t("hub.eyebrow")} · {t("hub.cities", { count: rows.length })}
          </p>
          <h1 className="mt-3 max-w-3xl animate-fade-up text-4xl leading-[1.05] font-semibold tracking-[-0.04em] text-ink text-balance-safe [animation-delay:80ms] sm:text-5xl lg:text-6xl">
            {t.rich("hub.title", { accent: (c) => <Accent>{c}</Accent> })}
          </h1>
          <p className="mt-4 max-w-2xl animate-fade-up text-lg leading-relaxed text-gray-600 [animation-delay:160ms]">{t("hub.lead")}</p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl space-y-12 px-4 sm:px-6 lg:px-8">
        {groups.map(([code, cities]) => (
          <section key={code} aria-labelledby={`country-${code}`}>
            <h2 id={`country-${code}`} className="flex items-center gap-3 border-b border-dashed border-gray-900/15 pb-3 text-xl font-semibold tracking-[-0.02em] text-ink">
              <span className="rounded-full bg-ink px-2 py-0.5 font-mono text-[11px] tracking-[0.12em] text-volt">{code}</span>
              {countryName(code, region.locale)}
            </h2>
            <ul className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {cities.map((row, index) => (
                <Reveal as="li" key={row.city} delay={(index % 4) * 60} className="flex">
                  <Link
                    href={cityPath(row.city)}
                    className="group flex w-full flex-col rounded-4xl border border-gray-900/[0.06] bg-surface p-6 shadow-soft transition-all duration-500 ease-out-expo hover:-translate-y-1 hover:shadow-lift"
                  >
                    <span className="flex items-start justify-between gap-3">
                      <span className="font-mono text-4xl font-medium tracking-[0.04em] text-ink">{cityCode(row.city)}</span>
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-canvas text-gray-700 transition-all duration-500 ease-out-expo group-hover:rotate-45 group-hover:bg-ink group-hover:text-white rtl:-scale-x-100">
                        <HiArrowUpRight className="size-4" />
                      </span>
                    </span>
                    <span className="mt-6 text-[17px] font-semibold tracking-tight text-ink">{t("gymsInCity", { city: row.city })}</span>
                    <span className="mt-auto pt-5">
                      <span className="flex items-center justify-between gap-3 border-t border-gray-900/[0.06] pt-3.5 text-sm text-gray-500">
                        <span className="tabular-nums">{t("hub.gyms", { count: row.count })}</span>
                        {row.dayFrom > 0 && (
                          <span className="font-medium text-gray-700 tabular-nums">{t("hub.from", { price: formatMoney(row.dayFrom, row.currency, region.locale) })}</span>
                        )}
                      </span>
                    </span>
                  </Link>
                </Reveal>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </main>
  );
}
