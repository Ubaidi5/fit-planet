import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import Link from "next/link";
import { requireUser, initials } from "@/server/session";
import { ensureHandle, feed, socialCounts, suggestedPeople } from "@/server/modules/social";
import { Composer } from "@/components/social/Composer";
import { FeedList } from "@/components/social/FeedList";
import { PersonRow } from "@/components/social/PersonRow";
import { SocialTabs } from "@/components/social/SocialTabs";
import { Avatar } from "@/components/social/Avatar";
import { getRegion } from "@/lib/i18n/server";
import { weightUnitFor } from "@/lib/routines";

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await getTranslations("social"))("title") };
}

export default async function SocialPage({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  const { tab } = await searchParams;
  const mode = tab === "discover" ? "discover" : "following";
  const user = await requireUser("/app/social");
  const t = await getTranslations("social");
  const handle = await ensureHandle(user);
  const [posts, people, counts] = await Promise.all([feed(user._id, mode), suggestedPeople(user._id, 6), socialCounts(user._id)]);
  const me = { name: user.name || t("you"), image: user.image ?? null, initials: initials(user.name || t("you")) };
  const unit = weightUnitFor(await getRegion());

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,42rem)_20rem] lg:items-start lg:justify-center">
      <div className="mx-auto w-full max-w-2xl min-w-0 space-y-4 lg:mx-0">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="font-mono text-[11px] tracking-[0.14em] text-gray-400 uppercase">{t("eyebrow")}</p>
            <h1 className="mt-1 text-[1.75rem] font-semibold tracking-[-0.035em] text-ink sm:text-4xl">{t("title")}</h1>
          </div>
          <Link href={`/app/u/${handle}`} className="flex items-center gap-2 rounded-full bg-surface py-1 ps-1 pe-3 text-sm font-medium text-ink shadow-soft ring-1 ring-gray-900/[0.05] lg:hidden">
            <Avatar name={me.name} image={me.image} initials={me.initials} size="sm" />
            @{handle}
          </Link>
        </div>
        <SocialTabs active={mode} />
        <Composer me={me} />
        <FeedList
          key={mode}
          initial={posts}
          mode={mode}
          unit={unit}
          empty={
            <div className="rounded-[1.75rem] border-2 border-dashed border-gray-900/10 px-6 py-12 text-center">
              <p className="font-semibold text-ink">{mode === "following" ? t("empty.followingTitle") : t("empty.discoverTitle")}</p>
              <p className="mx-auto mt-1 max-w-sm text-sm text-gray-500">
                {mode === "following" ? t("empty.followingText") : t("empty.discoverText")}
              </p>
              <Link
                href={mode === "following" ? "/app/social/people" : "/app/routines"}
                className="mt-5 inline-flex h-11 items-center rounded-full bg-ink px-5 text-sm font-semibold text-white"
              >
                {mode === "following" ? t("empty.findPeople") : t("empty.routines")}
              </Link>
            </div>
          }
        />
      </div>

      <aside className="hidden gap-4 lg:sticky lg:top-24 lg:grid">
        <section className="rounded-3xl bg-surface p-5 shadow-soft ring-1 ring-gray-900/[0.05]">
          <div className="flex items-center gap-3">
            <Avatar name={me.name} image={me.image} initials={me.initials} />
            <div className="min-w-0 leading-tight">
              <p className="truncate font-semibold text-ink">{me.name}</p>
              <p className="truncate text-sm text-gray-500">@{handle}</p>
            </div>
          </div>
          <dl className="mt-4 grid grid-cols-2 gap-2 text-center">
            {[
              [t("followers"), counts.followers],
              [t("following"), counts.following],
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl bg-canvas py-2.5">
                <dd className="text-lg font-semibold text-ink tabular-nums">{value}</dd>
                <dt className="text-xs text-gray-500">{label}</dt>
              </div>
            ))}
          </dl>
          <div className="mt-3 flex gap-2 text-sm font-semibold">
            <Link href={`/app/u/${handle}`} className="flex h-10 flex-1 items-center justify-center rounded-full bg-ink text-white">
              {t("viewProfile")}
            </Link>
            <Link href="/app/social/settings" className="flex h-10 flex-1 items-center justify-center rounded-full ring-1 ring-gray-900/10 hover:bg-canvas">
              {t("settingsLink")}
            </Link>
          </div>
        </section>
        {people.length > 0 && (
          <section className="rounded-3xl bg-surface p-5 shadow-soft ring-1 ring-gray-900/[0.05]">
            <h2 className="text-base font-semibold text-ink">{t("toFollow")}</h2>
            <ul className="mt-1 divide-y divide-gray-900/[0.06]">
              {people.map((p) => (
                <PersonRow key={p.id} person={p} />
              ))}
            </ul>
          </section>
        )}
      </aside>
    </div>
  );
}
