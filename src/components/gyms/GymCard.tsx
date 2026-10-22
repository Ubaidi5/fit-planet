import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import type { Gym } from "@/lib/data/mock-gyms";
import {
  HiArrowUpRight,
  HiCheckBadge,
  HiMapPin,
  HiOutlineClock,
  HiSparkles,
  HiStar,
} from "react-icons/hi2";

interface GymCardProps {
  gym: Gym;
  layout?: "grid" | "list";
  className?: string;
}

function getCrowd(gym: Gym) {
  const pct = Math.round((gym.capacity.current / gym.capacity.max) * 100);
  if (pct >= 80) return { pct, label: "Busy", dot: "bg-red-500", text: "text-red-700" };
  if (pct >= 50) return { pct, label: "Moderate", dot: "bg-amber-500", text: "text-amber-700" };
  return { pct, label: "Quiet", dot: "bg-emerald-500", text: "text-emerald-700" };
}

const GymCard: React.FC<GymCardProps> = ({ gym, layout = "grid", className }) => {
  const crowd = getCrowd(gym);
  const isList = layout === "list";

  return (
    <Link
      href={`/gyms/${gym.slug}`}
      className={cn(
        "group relative flex overflow-hidden rounded-4xl border border-gray-900/[0.06] bg-surface p-2 shadow-soft transition-all duration-500 ease-out-expo",
        "hover:-translate-y-1 hover:shadow-lift",
        isList ? "flex-col sm:flex-row" : "flex-col",
        className,
      )}
    >
      {/* Image */}
      <div
        className={cn(
          "relative shrink-0 overflow-hidden rounded-[1.6rem]",
          isList ? "aspect-16/10 sm:aspect-auto sm:w-72 sm:self-stretch" : "aspect-4/3",
        )}
      >
        <Image
          src={gym.coverImage}
          alt={gym.name}
          fill
          className="object-cover transition-transform duration-700 ease-out-expo group-hover:scale-[1.06]"
          sizes={isList ? "(max-width: 640px) 100vw, 288px" : "(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"}
        />
        <div className="absolute inset-0 bg-linear-to-t from-ink/50 via-transparent to-ink/10" />

        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          {gym.isFeatured && (
            <span className="glass inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold text-ink">
              <HiSparkles className="size-3.5 text-amber-500" />
              Featured
            </span>
          )}
        </div>

        <span className="glass absolute top-3 right-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold text-ink">
          <span className={cn("size-1.5 rounded-full", crowd.dot)} />
          {crowd.label}
        </span>

        <span className="absolute bottom-3 left-3 rounded-full bg-surface px-3 py-1.5 text-sm font-semibold text-ink shadow-soft tabular-nums">
          Rs. {gym.pricing.dayPass.toLocaleString()}
          <span className="font-normal text-gray-500"> /day</span>
        </span>
      </div>

      {/* Content */}
      <div className={cn("flex flex-1 flex-col px-3 pt-4 pb-3", isList && "sm:px-5 sm:py-4")}>
        <div className="flex items-start justify-between gap-3">
          <h3 className="flex items-center gap-1.5 text-[17px] font-semibold tracking-tight text-ink">
            <span className="line-clamp-1">{gym.name}</span>
            {gym.isVerified && (
              <HiCheckBadge className="size-4.5 shrink-0 text-emerald-600" aria-label="Verified" />
            )}
          </h3>
          <span className="flex shrink-0 items-center gap-1 text-sm font-semibold text-ink">
            <HiStar className="size-4 text-amber-400" />
            {gym.rating}
            <span className="font-normal text-gray-400">({gym.totalReviews})</span>
          </span>
        </div>

        <p className="mt-1.5 flex items-center gap-1.5 text-sm text-gray-500">
          <HiMapPin className="size-4 shrink-0 text-gray-400" />
          <span className="line-clamp-1">
            {gym.address.area}, {gym.address.city}
          </span>
          {gym.distance && (
            <span className="shrink-0 font-medium text-gray-700">· {gym.distance} km</span>
          )}
        </p>

        {isList && (
          <p className="mt-3 line-clamp-2 hidden text-sm leading-relaxed text-gray-600 sm:block">
            {gym.description}
          </p>
        )}

        <div className="mt-4 mb-4 flex flex-wrap gap-1.5">
          {gym.amenities.slice(0, isList ? 5 : 3).map((amenity) => (
            <span
              key={amenity}
              className="rounded-full bg-canvas px-2.5 py-1 text-xs text-gray-600 ring-1 ring-gray-900/[0.04]"
            >
              {amenity}
            </span>
          ))}
          {gym.amenities.length > (isList ? 5 : 3) && (
            <span className="rounded-full px-1.5 py-1 text-xs text-gray-400">
              +{gym.amenities.length - (isList ? 5 : 3)}
            </span>
          )}
        </div>

        <div className="mt-auto flex items-center justify-between border-t border-gray-900/[0.06] pt-3.5">
          <span className="flex items-center gap-1.5 text-xs text-gray-500">
            <HiOutlineClock className="size-4" />
            {gym.hours.is24Hours ? "Open 24/7" : `${gym.hours.open} to ${gym.hours.close}`}
          </span>
          <span className="flex size-8 items-center justify-center rounded-full bg-canvas text-gray-700 transition-all duration-500 ease-out-expo group-hover:rotate-45 group-hover:bg-ink group-hover:text-white">
            <HiArrowUpRight className="size-4" />
          </span>
        </div>
      </div>
    </Link>
  );
};

export { GymCard };
