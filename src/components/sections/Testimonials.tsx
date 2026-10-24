import { getTranslations } from "next-intl/server";
import { Reveal } from "@/components/motion/Reveal";
import Link from "next/link";
import { initials } from "@/lib/initials";
import type { Story } from "@/server/modules/platform";
import { Accent, SectionHeading } from "./SectionHeading";

/** Needs a full row of real member reviews; until then the section stays hidden */
export default async function Testimonials({ stories }: { stories: Story[] }) {
  if (stories.length < 3) return null;
  const t = await getTranslations("stories");
  return (
    <section id="stories" className="py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow={t("eyebrow")}
          title={t.rich("title", { accent: (c) => <Accent>{c}</Accent> })}
        />

        <div className="mt-14 grid gap-4 md:grid-cols-3 lg:gap-5">
          {stories.map((item, index) => (
            <Reveal
              as="article"
              key={item.id}
              delay={index * 100}
              className="flex flex-col justify-between rounded-4xl border border-gray-900/[0.06] bg-surface p-7 shadow-soft transition-shadow duration-500 hover:shadow-lift sm:p-8"
            >
              <div>
                <span aria-hidden="true" className="block text-6xl leading-none font-bold text-volt">
                  &ldquo;
                </span>
                <blockquote className="-mt-3 line-clamp-6 text-[17px] leading-relaxed text-gray-800">
                  {item.quote}
                </blockquote>
              </div>
              <div className="mt-8 flex items-center gap-3 border-t border-gray-900/[0.06] pt-5">
                <span className="flex size-11 items-center justify-center rounded-full bg-volt-soft text-sm font-semibold text-emerald-800">
                  {initials(item.name)}
                </span>
                <div>
                  <p className="text-[15px] font-semibold text-ink">{item.name}</p>
                  <Link href={`/gyms/${item.gymSlug}`} className="text-[13px] text-gray-500 transition-colors hover:text-ink">
                    {t("at", { gym: item.gymName, city: item.city })}
                  </Link>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
