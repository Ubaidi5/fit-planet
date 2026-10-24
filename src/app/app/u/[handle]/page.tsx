import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "@/server/session";
import { postsBy, profileByHandle } from "@/server/modules/social";
import { Avatar } from "@/components/social/Avatar";
import { FeedList } from "@/components/social/FeedList";
import { FollowButton } from "@/components/social/FollowButton";
import { getRegion } from "@/lib/i18n/server";
import { weightUnitFor } from "@/lib/routines";

export async function generateMetadata({ params }: { params: Promise<{ handle: string }> }): Promise<Metadata> {
  const { handle } = await params;
  return { title: `@${decodeURIComponent(handle)}` };
}

export default async function ProfilePage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  const user = await requireUser(`/app/u/${handle}`);
  const profile = await profileByHandle(user._id, decodeURIComponent(handle));
  if (!profile) notFound();
  const { person, stats } = profile;
  const posts = await postsBy(user._id, profile.userId);
  const t = await getTranslations("social.profile");

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <section className="overflow-hidden rounded-[2rem] bg-surface shadow-soft ring-1 ring-gray-900/[0.05]">
        <div className="h-24 bg-[linear-gradient(120deg,var(--color-volt-soft),var(--color-canvas-deep))] sm:h-32" />
        <div className="px-5 pb-5 sm:px-6">
          <div className="-mt-10 flex items-end justify-between gap-3">
            <Avatar name={person.name} image={person.image} initials={person.initials} size="lg" className="ring-4 ring-surface" />
            {person.isSelf ? (
              <Link href="/app/social/settings" className="flex h-10 items-center rounded-full px-5 text-sm font-semibold ring-1 ring-gray-900/10 hover:bg-canvas">
                {t("edit")}
              </Link>
            ) : (
              <FollowButton userId={person.id} following={person.following} />
            )}
          </div>
          <h1 className="mt-3 text-2xl font-semibold tracking-tight text-ink">{person.name}</h1>
          <p className="text-sm text-gray-500">@{person.handle}</p>
          {person.bio && <p className="mt-2 text-[15px] text-gray-700">{person.bio}</p>}
          <dl className="mt-4 flex gap-6 text-sm">
            {[
              [t("workouts", { count: stats.workouts }), stats.workouts],
              [t("followers", { count: stats.followers }), stats.followers],
              [t("following"), stats.following],
            ].map(([label, value]) => (
              <div key={label} className="flex items-baseline gap-1">
                <dd className="font-semibold text-ink tabular-nums">{value}</dd>
                <dt className="text-gray-500">{label}</dt>
              </div>
            ))}
          </dl>
        </div>
      </section>
      <FeedList
        initial={posts}
        unit={weightUnitFor(await getRegion())}
        empty={
          <p className="rounded-[1.75rem] border-2 border-dashed border-gray-900/10 px-6 py-10 text-center text-sm text-gray-500">
            {person.isSelf ? t("selfEmpty") : t("empty", { name: person.name.split(" ")[0] })}
          </p>
        }
      />
    </div>
  );
}
