import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { HiArrowRight, HiArrowUpRight, HiMapPin, HiOutlineViewfinderCircle, HiPlus } from "react-icons/hi2";
import { GymCard } from "@/components/gyms/GymCard";
import { Reveal } from "@/components/motion/Reveal";
import { Accent, SectionHeading } from "@/components/sections/SectionHeading";
import { Breadcrumbs, type Crumb } from "@/components/seo/Breadcrumbs";
import { cityCode } from "@/lib/data/cities";
import { countryName, formatMoney, formatNumber } from "@/lib/i18n/format";
import { getRegion } from "@/lib/i18n/server";
import { cityPath, jsonLd } from "@/lib/seo";
import { cn } from "@/lib/utils";
import { env } from "@/server/env";
import type { CityLandingData } from "@/server/modules/seo";

/** Copy shared by the page body and its metadata, so the two never disagree */
export async function cityLandingCopy(data: CityLandingData) {
  const [t, region] = await Promise.all([getTranslations("cityPages"), getRegion()]);
  const what = data.category ? t(`categories.${data.category.key}.title`) : t("whatGyms");
  const whatInline = data.category ? t(`categories.${data.category.key}.inline`) : t("whatGymsInline");
  const money = (amount: number) => formatMoney(amount, data.currency, region.locale);
  const description = t("metaDescription", { count: data.gyms.length, city: data.city, price: money(data.prices.day.from) });
  return { t, region, what, whatInline, money, description, title: t("metaTitle", { what, city: data.city, price: money(data.prices.day.from) }) };
}

export async function CityLanding({ data }: { data: CityLandingData }) {
  const { t, region, what, whatInline, money } = await cityLandingCopy(data);
  const { city, gyms, category, prices } = data;
  const list = (items: string[]) => new Intl.ListFormat(region.locale, { type: "conjunction" }).format(items);
  const path = cityPath(city, category?.slug);

  const crumbs: Crumb[] = [
    { label: t("home"), href: "/" },
    { label: t("cities"), href: "/gyms/in" },
    { label: city, href: cityPath(city) },
    ...(category ? [{ label: what, href: path }] : []),
  ];

  const stats = [
    { key: "gyms", value: formatNumber(gyms.length, region.locale) },
    { key: "dayFrom", value: money(prices.day.from) },
    {
      key: "rating",
      value: data.averageRating ? formatNumber(data.averageRating, region.locale, { minimumFractionDigits: 1 }) : t("stats.ratingNone"),
      hint: data.totalReviews > 0 ? t("stats.reviews", { count: data.totalReviews }) : undefined,
    },
    { key: "open247", value: formatNumber(data.open247.length, region.locale) },
  ];

  const priceRows = (["day", "week", "month"] as const).flatMap((key) => {
    const row = prices[key];
    return row && row.from > 0 ? [{ key, ...row }] : [];
  });

  const faqs: { q: string; a: string }[] = [
    {
      q: t("faq.priceQ", { what: whatInline, city }),
      a: [
        t("faq.priceA", { from: money(prices.day.from), average: money(prices.day.average), count: gyms.length }),
        prices.week ? t("faq.weekA", { price: money(prices.week.from) }) : "",
        prices.month ? t("faq.monthA", { price: money(prices.month.from) }) : "",
      ].filter(Boolean).join(" "),
    },
    ...(category?.key === "open247"
      ? []
      : [{
          q: t("faq.open247Q", { city }),
          a: data.open247.length > 0
            ? t("faq.open247Yes", { count: data.open247.length, names: list(data.open247.slice(0, 4).map((g) => g.name)) })
            : t("faq.open247No", { city }),
        }]),
    ...(data.topRated
      ? [{
          q: t("faq.bestQ", { what: whatInline, city }),
          a: t("faq.bestA", {
            name: data.topRated.name,
            area: data.topRated.address.area || city,
            rating: formatNumber(data.topRated.rating, region.locale, { minimumFractionDigits: 1 }),
            count: data.topRated.totalReviews,
          }),
        }]
      : []),
    ...(data.areas.length > 0
      ? [{ q: t("faq.areasQ", { what: whatInline, city }), a: t("faq.areasA", { count: gyms.length, areas: list(data.areas.slice(0, 6).map((a) => a.name)) }) }]
      : []),
    { q: t("faq.membershipQ", { city }), a: t("faq.membershipA", { currency: data.currency }) },
  ];

  const structured = [
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: t("metaTitle", { what, city, price: money(prices.day.from) }),
      numberOfItems: gyms.length,
      itemListElement: gyms.slice(0, 50).map((gym, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `${env.appUrl}/gyms/${gym.slug}`,
        name: gym.name,
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((faq) => ({ "@type": "Question", name: faq.q, acceptedAnswer: { "@type": "Answer", text: faq.a } })),
    },
  ];

  return (
    <main className="min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(structured) }} />

      {/* Intro */}
      <section className="relative isolate overflow-hidden">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-dot-grid [mask-image:radial-gradient(ellipse_60%_80%_at_50%_0%,black,transparent)]" />
          <div className="absolute -top-40 end-[10%] size-[26rem] rounded-full bg-volt/30 blur-3xl" />
        </div>
        <div className="mx-auto max-w-7xl px-4 pt-8 pb-10 sm:px-6 sm:pt-12 lg:px-8 lg:pb-14">
          <Breadcrumbs items={crumbs} label={t("trail")} />

          <p className="mt-8 animate-fade-up font-mono text-[12px] tracking-[0.16em] text-emerald-700 uppercase">
            {cityCode(city)} · {countryName(data.country, region.locale)}
          </p>
          <h1 className="mt-3 max-w-4xl animate-fade-up text-4xl leading-[1.05] font-semibold tracking-[-0.04em] text-ink text-balance-safe [animation-delay:80ms] sm:text-5xl lg:text-6xl">
            {t.rich("title", { what, city, accent: (c) => <Accent>{c}</Accent> })}
          </h1>
          <p className="mt-4 max-w-2xl animate-fade-up text-lg leading-relaxed text-gray-600 [animation-delay:160ms]">
            {t("lead", { count: gyms.length, city, price: money(prices.day.from), currency: data.currency })}
          </p>

          <div className="mt-7 flex animate-fade-up flex-wrap gap-3 [animation-delay:200ms]">
            <Link
              href={`/gyms?city=${encodeURIComponent(city)}`}
              className="group inline-flex h-12 items-center gap-2 rounded-full bg-ink ps-5 pe-1.5 text-[15px] font-medium text-white transition-colors hover:bg-gray-800"
            >
              <HiOutlineViewfinderCircle className="size-5 text-volt" />
              {t("explorer")}
              <span className="flex size-9 items-center justify-center rounded-full bg-volt text-ink transition-transform duration-500 ease-out-expo group-hover:-rotate-45 rtl:rotate-180">
                <HiArrowRight className="size-4" />
              </span>
            </Link>
            <Link
              href="/register"
              className="inline-flex h-12 items-center rounded-full bg-surface px-5 text-[15px] font-medium text-ink shadow-soft ring-1 ring-gray-900/[0.08] transition-colors hover:bg-white"
            >
              {t("passport")}
            </Link>
          </div>

          <dl className="mt-10 grid max-w-3xl animate-fade-up grid-cols-2 gap-y-6 border-t border-dashed border-gray-900/15 pt-6 [animation-delay:260ms] sm:grid-cols-4">
            {stats.map((stat, index) => (
              <div
                key={stat.key}
                className={cn("flex flex-col", index % 2 === 1 && "border-s border-gray-900/[0.08] ps-5", index === 2 && "sm:border-s sm:border-gray-900/[0.08] sm:ps-5")}
              >
                <dt className="order-2 mt-1 font-mono text-[11px] leading-snug tracking-[0.08em] text-gray-500 uppercase">
                  {t(`stats.${stat.key}`)}
                  {stat.hint && <span className="block normal-case tracking-normal text-gray-400">{stat.hint}</span>}
                </dt>
                <dd className="text-2xl font-semibold tracking-tight text-ink tabular-nums sm:text-3xl">{stat.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Types */}
      {data.categories.length > 0 && (
        <nav aria-label={t("browse")} className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-mono text-[11px] font-medium tracking-[0.16em] text-gray-400 uppercase">{t("browse")}</h2>
          <ul className="-mx-4 mt-3 flex gap-2 overflow-x-auto px-4 pb-1 no-scrollbar sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
            {[{ href: cityPath(city), label: t("allTypes"), count: data.cityGymCount, active: !category }, ...data.categories.map((c) => ({
              href: cityPath(city, c.category.slug),
              label: t(`categories.${c.category.key}.title`),
              count: c.count,
              active: c.category.slug === category?.slug,
            }))].map((chip) => (
              <li key={chip.href} className="shrink-0">
                <Link
                  href={chip.href}
                  aria-current={chip.active ? "page" : undefined}
                  className={cn(
                    "inline-flex h-10 items-center gap-2 rounded-full px-4 text-sm font-medium whitespace-nowrap transition-all duration-300 ease-out-expo",
                    chip.active ? "bg-ink text-white shadow-soft" : "bg-surface text-gray-600 ring-1 ring-gray-900/[0.08] hover:text-ink",
                  )}
                >
                  {chip.label}
                  <span className={cn("font-mono text-[11px] tabular-nums", chip.active ? "text-volt" : "text-gray-400")}>{chip.count}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}

      {/* Gyms */}
      <section className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 lg:px-8 lg:pt-12">
        <div className="mb-6 flex items-baseline justify-between gap-4">
          <h2 className="text-xl font-semibold tracking-[-0.02em] text-ink sm:text-2xl">{t("listTitle")}</h2>
          <p className="shrink-0 font-mono text-[12px] tracking-[0.08em] text-gray-500 uppercase tabular-nums">{t("listCount", { count: gyms.length })}</p>
        </div>
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5 xl:grid-cols-4">
          {gyms.map((gym, index) => (
            <Reveal as="li" key={gym.id} delay={(index % 4) * 70} className="flex">
              <GymCard gym={gym} className="w-full" />
            </Reveal>
          ))}
        </ul>
      </section>

      {/* Prices + areas */}
      <section className="mx-auto mt-16 grid max-w-7xl gap-4 px-4 sm:px-6 lg:mt-24 lg:grid-cols-[1.5fr_1fr] lg:gap-5 lg:px-8">
        <Reveal className="rounded-4xl border border-gray-900/[0.06] bg-surface p-6 shadow-soft sm:p-8">
          <p className="font-mono text-[11px] font-medium tracking-[0.16em] text-emerald-700 uppercase">{t("prices.eyebrow")}</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-ink sm:text-3xl">{t("prices.title", { city })}</h2>
          <table className="mt-6 w-full text-start">
            <thead>
              <tr className="border-b border-dashed border-gray-900/15 font-mono text-[11px] tracking-[0.08em] text-gray-500 uppercase">
                <th scope="col" className="pb-3 text-start font-medium">{t("prices.pass")}</th>
                <th scope="col" className="pb-3 text-end font-medium">{t("prices.from")}</th>
                <th scope="col" className="pb-3 text-end font-medium">{t("prices.average")}</th>
              </tr>
            </thead>
            <tbody>
              {priceRows.map((row) => (
                <tr key={row.key} className="border-b border-gray-900/[0.06] last:border-0">
                  <th scope="row" className="py-4 text-start text-[15px] font-medium text-ink">{t(`prices.${row.key}`)}</th>
                  <td className="py-4 text-end text-lg font-semibold text-ink tabular-nums">{money(row.from)}</td>
                  <td className="py-4 text-end text-[15px] text-gray-600 tabular-nums">{money(row.average)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-4 text-sm text-gray-500">{t("prices.note", { count: gyms.length, currency: data.currency })}</p>
        </Reveal>

        {data.areas.length > 0 && (
          <Reveal delay={80} className="rounded-4xl border border-gray-900/[0.06] bg-surface p-6 shadow-soft sm:p-8">
            <h2 className="text-xl font-semibold tracking-[-0.02em] text-ink">{t("areas.title")}</h2>
            <ul className="mt-5 divide-y divide-gray-900/[0.06]">
              {data.areas.slice(0, 8).map((area) => (
                <li key={area.name}>
                  <Link
                    href={`/gyms?city=${encodeURIComponent(city)}&q=${encodeURIComponent(area.name)}`}
                    className="group flex items-center justify-between gap-3 py-3 text-[15px] text-gray-700 transition-colors hover:text-ink"
                  >
                    <span className="flex min-w-0 items-center gap-2">
                      <HiMapPin className="size-4 shrink-0 text-gray-400" />
                      <span className="truncate">{area.name}</span>
                    </span>
                    <span className="flex shrink-0 items-center gap-2 font-mono text-[12px] text-gray-400 tabular-nums">
                      {t("areas.count", { count: area.count })}
                      <HiArrowUpRight className="size-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 rtl:-scale-x-100" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </Reveal>
        )}
      </section>

      {/* FAQ */}
      <section className="mx-auto mt-16 grid max-w-7xl gap-8 px-4 sm:px-6 lg:mt-24 lg:grid-cols-[1fr_1.5fr] lg:gap-16 lg:px-8">
        <SectionHeading align="left" eyebrow={t("faq.eyebrow")} title={t("faq.title")} />
        <div className="divide-y divide-gray-900/[0.08] border-y border-gray-900/[0.08]">
          {faqs.map((faq, index) => (
            <details key={faq.q} open={index === 0} className="group py-1">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-start text-[17px] font-medium text-ink [&::-webkit-details-marker]:hidden">
                {faq.q}
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-surface text-gray-600 ring-1 ring-gray-900/[0.08] transition-transform duration-300 group-open:rotate-45">
                  <HiPlus className="size-4" />
                </span>
              </summary>
              <p className="pe-12 pb-5 text-[15px] leading-relaxed text-gray-600">{faq.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Other cities */}
      <section className="mx-auto mt-16 max-w-7xl px-4 pb-20 sm:px-6 lg:mt-24 lg:px-8 lg:pb-28">
        {data.otherCities.length > 0 && (
          <nav aria-label={t("otherCities")}>
            <h2 className="text-xl font-semibold tracking-[-0.02em] text-ink">{t("otherCities")}</h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {data.otherCities.slice(0, 12).map((other) => (
                <li key={`${other.country}-${other.city}`}>
                  <Link
                    href={cityPath(other.city)}
                    className="group inline-flex items-center gap-1.5 rounded-full border border-gray-900/[0.07] bg-surface/70 py-1 ps-1.5 pe-3 text-[13px] text-gray-600 transition-colors hover:border-gray-300 hover:text-ink"
                  >
                    <span className="rounded-full bg-gray-100 px-1.5 py-px font-mono text-[10px] tracking-[0.08em] text-gray-500 transition-colors group-hover:bg-volt group-hover:text-ink">
                      {cityCode(other.city)}
                    </span>
                    {t("gymsInCity", { city: other.city })}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/gyms/in" className="inline-flex h-[30px] items-center gap-1 rounded-full px-3 text-[13px] font-medium text-ink underline decoration-gray-300 underline-offset-4 hover:decoration-ink">
                  {t("allCities")}
                </Link>
              </li>
            </ul>
          </nav>
        )}
      </section>
    </main>
  );
}
