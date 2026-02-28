import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import type { Gym } from "@/lib/data/mock-gyms";
import {
  HiStar,
  HiOutlineCheckCircle,
  HiOutlineLocationMarker,
  HiOutlineTerminal,
} from "react-icons/hi";

interface GymCardProps {
  gym: Gym;
  className?: string;
}

const GymCard: React.FC<GymCardProps> = ({ gym, className }) => {
  const capacityPercentage = Math.round(
    (gym.capacity.current / gym.capacity.max) * 100,
  );
  const isNearCapacity = capacityPercentage >= 80;
  const isBusy = capacityPercentage >= 50 && capacityPercentage < 80;

  return (
    <Link
      href={`/gyms/${gym.slug}`}
      className={cn(
        "group block overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-300",
        "hover:border-emerald-200 hover:shadow-lg hover:-translate-y-1",
        className,
      )}
    >
      {/* Image Container */}
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={gym.coverImage}
          alt={gym.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />

        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Top Badges */}
        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          {gym.isFeatured && (
            <Badge variant="warning" size="sm">
              <HiStar className="mr-1 h-3 w-3" />
              Featured
            </Badge>
          )}
          {gym.isVerified && (
            <Badge variant="success" size="sm">
              <HiOutlineCheckCircle className="mr-1 h-3 w-3" />
              Verified
            </Badge>
          )}
        </div>

        {/* Capacity Badge */}
        <div className="absolute right-3 top-3">
          <Badge
            variant={isNearCapacity ? "danger" : isBusy ? "warning" : "success"}
            size="sm"
          >
            <span
              className={cn(
                "mr-1.5 h-2 w-2 rounded-full",
                isNearCapacity
                  ? "bg-red-500"
                  : isBusy
                    ? "bg-amber-500"
                    : "bg-emerald-500",
              )}
            />
            {gym.capacity.current}/{gym.capacity.max}
          </Badge>
        </div>

        {/* Price Badge */}
        <div className="absolute bottom-3 left-3">
          <span className="rounded-lg bg-white/95 px-2.5 py-1 text-sm font-semibold text-gray-900 shadow-sm backdrop-blur-sm">
            Rs. {gym.pricing.dayPass.toLocaleString()}
            <span className="text-xs font-normal text-gray-500">/day</span>
          </span>
        </div>

        {/* Hours Badge */}
        <div className="absolute bottom-3 right-3">
          {gym.hours.is24Hours ? (
            <span className="rounded-lg bg-emerald-600/90 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm">
              24/7
            </span>
          ) : (
            <span className="rounded-lg bg-gray-900/70 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm">
              {gym.hours.open} - {gym.hours.close}
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Name & Rating */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-gray-900 line-clamp-1 group-hover:text-emerald-600 transition-colors">
            {gym.name}
          </h3>
          <div className="flex items-center gap-1 flex-shrink-0">
            <HiStar className="h-4 w-4 text-amber-400" />
            <span className="text-sm font-medium text-gray-900">
              {gym.rating}
            </span>
            <span className="text-xs text-gray-500">({gym.totalReviews})</span>
          </div>
        </div>

        {/* Location & Distance */}
        <div className="mt-2 flex items-center gap-1 text-sm text-gray-500">
          <HiOutlineLocationMarker className="h-4 w-4 flex-shrink-0" />
          <span className="line-clamp-1">
            {gym.address.area}, {gym.address.city}
          </span>
          {gym.distance && (
            <>
              <span className="text-gray-300">•</span>
              <span className="font-medium text-emerald-600">
                {gym.distance} km
              </span>
            </>
          )}
        </div>

        {/* Amenities Preview */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {gym.amenities.slice(0, 4).map((amenity) => (
            <span
              key={amenity}
              className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600"
            >
              {amenity}
            </span>
          ))}
          {gym.amenities.length > 4 && (
            <span className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-500">
              +{gym.amenities.length - 4} more
            </span>
          )}
        </div>

        {/* Equipment Types */}
        <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
          <HiOutlineTerminal className="h-4 w-4 text-gray-400" />
          <span className="line-clamp-1">
            {gym.equipmentTypes.slice(0, 3).join(" • ")}
          </span>
        </div>
      </div>
    </Link>
  );
};

export { GymCard };
