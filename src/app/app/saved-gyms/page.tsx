import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { HiOutlineHeart, HiOutlineMapPin, HiStar } from "react-icons/hi2";
import { requireUser } from "@/server/session";
import { collections } from "@/server/db/collections";
import { occupancyFor, toGym } from "@/server/modules/gyms";
import { formatMoney } from "@/server/modules/bookings";
import { SaveGymButton } from "@/components/gyms/SaveGymButton";

export const metadata: Metadata = { title: "Saved gyms" };

export default async function SavedGymsPage() {
  const user = await requireUser("/app/saved-gyms");
  const ids = user.savedGymIds ?? [];
  const docs = ids.length ? await (await collections.gyms()).find({ _id: { $in: ids }, status: "published" }).toArray() : [];
  const occupancy = await occupancyFor(docs.map((d) => d._id));
  const gyms = docs.map((d) => toGym(d, occupancy.get(d._id.toHexString()) ?? 0));

  return (
    <div>
      <p className="font-mono text-[11px] tracking-[0.14em] text-gray-400 uppercase">{gyms.length} saved</p>
      <h1 className="mt-1 text-[1.75rem] font-semibold tracking-[-0.035em] text-ink sm:text-4xl">Saved gyms</h1>

      {gyms.length === 0 ? (
        <div className="mt-8 flex flex-col items-center rounded-[1.75rem] border-2 border-dashed border-gray-900/10 px-6 py-16 text-center">
          <HiOutlineHeart className="size-10 text-gray-300" />
          <p className="mt-3 font-semibold text-ink">Nothing saved yet</p>
          <p className="mt-1 max-w-xs text-sm text-gray-500">Tap the heart on any gym to keep it here for quick booking.</p>
          <Link href="/gyms" className="mt-5 inline-flex h-11 items-center rounded-full bg-ink px-5 text-sm font-semibold text-white">
            Explore gyms
          </Link>
        </div>
      ) : (
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {gyms.map((gym) => (
            <li key={gym.id} className="relative overflow-hidden rounded-3xl bg-surface shadow-soft ring-1 ring-gray-900/[0.05]">
              <Link href={`/gyms/${gym.slug}`} className="block">
                <div className="relative aspect-[16/10] bg-canvas-deep">
                  <Image src={gym.coverImage} alt="" fill sizes="(max-width: 640px) 100vw, 33vw" className="object-cover" />
                </div>
                <div className="p-4">
                  <p className="truncate pe-12 text-[15px] font-semibold text-ink">{gym.name}</p>
                  <p className="mt-0.5 flex items-center gap-1 truncate text-sm text-gray-500">
                    <HiOutlineMapPin className="size-3.5 shrink-0" />
                    {gym.address.area}, {gym.address.city}
                  </p>
                  <div className="mt-3 flex items-center justify-between text-sm">
                    <span className="inline-flex items-center gap-1 font-medium text-ink">
                      <HiStar className="size-4 text-stamp-ochre" />
                      {gym.rating.toFixed(1)}
                    </span>
                    <span className="text-gray-600">
                      <span className="font-semibold whitespace-nowrap text-ink">{formatMoney(gym.pricing.dayPass, gym.currency)}</span> / day
                    </span>
                  </div>
                </div>
              </Link>
              <div className="absolute top-3 end-3">
                <SaveGymButton gymId={gym.id} saved signedIn label={false} />
              </div>
              <div className="px-4 pb-4">
                <Link href={`/gyms/${gym.slug}/book`} className="flex h-11 items-center justify-center rounded-full bg-ink text-sm font-semibold text-white hover:bg-gray-800">
                  Book a pass
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
