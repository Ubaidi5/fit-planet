"use client";

import { useState } from "react";
import { notFound, useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  HiArrowLeft,
  HiArrowUpRight,
  HiCheck,
  HiCheckBadge,
  HiMapPin,
  HiOutlineCalendarDays,
  HiOutlineChatBubbleLeftRight,
  HiOutlineClock,
  HiOutlineEnvelope,
  HiOutlineGlobeAlt,
  HiOutlinePhone,
  HiOutlinePhoto,
  HiOutlineSparkles,
  HiOutlineUser,
  HiOutlineUserGroup,
  HiPlus,
  HiStar,
} from "react-icons/hi2";
import { FaFacebookF, FaInstagram } from "react-icons/fa6";
import { cn } from "@/lib/utils";
import { mockGyms } from "@/lib/data/mock-gyms";
import { getGymDetails, generateDefaultDetails } from "@/lib/data/mock-gym-details";
import { cityCode } from "@/lib/data/cities";
import { countryName } from "@/lib/i18n/format";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import { isOpenAt, useGymClock } from "@/lib/i18n/useGymClock";
import { PhotoGallery } from "@/components/gyms/PhotoGallery";
import { PassTickets } from "@/components/gyms/PassTickets";
import { BookingTicket } from "@/components/gyms/BookingTicket";
import { ReviewCard, ReviewsSummary } from "@/components/gyms/ReviewCard";
import { CrowdCurve } from "@/components/pulse/CrowdCurve";
import { BookingModal } from "@/components/booking/BookingModal";

type TabType = "overview" | "passes" | "classes" | "trainers" | "reviews";

const card = "rounded-4xl border border-gray-900/[0.06] bg-surface p-6 shadow-soft sm:p-8";

function SectionTitle({ eyebrow, title, action }: { eyebrow: string; title: string; action?: React.ReactNode }) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4">
      <div>
        <p className="font-mono text-[11px] tracking-[0.14em] text-gray-400 uppercase">{eyebrow}</p>
        <h2 className="mt-1.5 text-xl font-semibold tracking-[-0.02em] text-ink sm:text-2xl">{title}</h2>
      </div>
      {action}
    </div>
  );
}

function crowdTone(pct: number) {
  if (pct >= 80) return { label: "Busy", color: "var(--color-stamp-magenta)" };
  if (pct >= 50) return { label: "Moderate", color: "var(--color-stamp-ochre)" };
  return { label: "Quiet", color: "var(--color-stamp-teal)" };
}

const difficultyTone: Record<string, string> = {
  Beginner: "bg-emerald-50 text-emerald-700",
  Intermediate: "bg-stamp-ochre/10 text-stamp-ochre",
  Advanced: "bg-stamp-magenta/10 text-stamp-magenta",
  "All Levels": "bg-stamp-violet/10 text-stamp-violet",
};

export default function GymDetailPage() {
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const params = useParams();
  const { region, money, distance, clock: formatClock } = useLocale();
  const gym = mockGyms.find((g) => g.id === params.id || g.slug === params.id);
  const gymClock = useGymClock(gym?.timezone ?? "UTC");

  if (!gym) {
    notFound();
  }

  const details = getGymDetails(gym.id) || generateDefaultDetails(gym);
  const galleryImages =
    details.gallery.length > 0
      ? details.gallery
      : gym.images.map((url, i) => ({ url, caption: `${gym.name} photo ${i + 1}`, category: "Facility" as const }));
  const heroImages = [gym.coverImage, ...galleryImages.map((img) => img.url).filter((url) => url !== gym.coverImage)];

  const pct = Math.round((gym.capacity.current / gym.capacity.max) * 100);
  const crowd = crowdTone(pct);
  const code = cityCode(gym.address.city);
  const openNow = gymClock ? isOpenAt(gym.hours, gymClock.hour, gymClock.minute) : null;
  const localTime = gymClock
    ? new Intl.DateTimeFormat(region.locale, { hour: "numeric", minute: "2-digit", timeZone: gym.timezone }).format(gymClock.date)
    : "--:--";

  const tabs: { id: TabType; label: string; count?: number }[] = [
    { id: "overview", label: "Overview" },
    { id: "passes", label: "Passes" },
    ...(details.classes.length > 0 ? [{ id: "classes" as const, label: "Classes", count: details.classes.length }] : []),
    ...(details.trainers.length > 0 ? [{ id: "trainers" as const, label: "Trainers", count: details.trainers.length }] : []),
    { id: "reviews", label: "Reviews", count: gym.totalReviews },
  ];

  const openBooking = () => setIsBookingOpen(true);
  const directions = `https://www.google.com/maps/dir/?api=1&destination=${gym.location.lat},${gym.location.lng}`;

  return (
    <div className="min-h-screen pb-20">
      {/* Hero */}
      <section className="mx-auto max-w-7xl px-4 pt-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <Link
            href={`/gyms?city=${encodeURIComponent(gym.address.city)}`}
            className="group inline-flex h-10 items-center gap-2 rounded-full bg-surface ps-3 pe-4 text-sm font-medium text-gray-700 shadow-soft ring-1 ring-gray-900/[0.06] transition-colors hover:text-ink"
          >
            <HiArrowLeft className="size-4 transition-transform duration-300 group-hover:-translate-x-0.5 rtl:rotate-180" />
            Gyms in {gym.address.city}
          </Link>
          <p className="hidden font-mono text-[11px] tracking-[0.14em] text-gray-400 uppercase sm:block">
            Explore / {code} / {gym.address.area}
          </p>
        </div>

        <div className="mt-4 grid h-72 gap-2 sm:h-96 lg:h-[30rem] lg:grid-cols-[1.65fr_1fr]">
          <div className="relative overflow-hidden rounded-[2rem] bg-ink">
            <Image
              src={heroImages[0]}
              alt={gym.name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 800px"
              className="animate-[fade-up_1.2s_var(--ease-out-expo)_both] object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-ink/40 via-transparent to-ink/20" />
            <div className="absolute top-4 start-4 flex flex-wrap gap-1.5">
              <span className="inline-flex items-center rounded-full bg-ink/85 px-3 py-1.5 font-mono text-[11px] tracking-[0.12em] text-volt backdrop-blur">
                {code} · {gym.country}
              </span>
              {gym.isVerified && (
                <span className="inline-flex items-center gap-1 rounded-full bg-surface/95 px-3 py-1.5 text-xs font-semibold text-ink">
                  <HiCheckBadge className="size-4 text-emerald-600" />
                  Verified
                </span>
              )}
              {gym.isFeatured && (
                <span className="inline-flex items-center gap-1 rounded-full bg-volt px-3 py-1.5 text-xs font-semibold text-ink">
                  <HiOutlineSparkles className="size-3.5" />
                  Featured
                </span>
              )}
            </div>
            <a
              href="#gallery"
              onClick={() => setActiveTab("overview")}
              className="absolute end-4 bottom-4 inline-flex h-10 items-center gap-2 rounded-full bg-surface/95 px-4 text-sm font-medium text-ink shadow-soft transition-colors hover:bg-surface"
            >
              <HiOutlinePhoto className="size-4.5" />
              {galleryImages.length} photos
            </a>
          </div>
          <div className="hidden grid-rows-2 gap-2 lg:grid">
            {[heroImages[1] ?? heroImages[0], heroImages[2] ?? heroImages[0]].map((src, index) => (
              <div key={index} className="relative overflow-hidden rounded-[2rem] bg-ink">
                <Image src={src} alt="" fill sizes="440px" className="object-cover" />
                {index === 1 && heroImages.length > 3 && (
                  <a href="#gallery" className="absolute inset-0 flex items-center justify-center bg-ink/45 text-lg font-semibold text-white">
                    +{heroImages.length - 3} more
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Title + live stats */}
        <div className="mt-8 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <p className="font-mono text-[12px] tracking-[0.14em] text-emerald-700 uppercase">
              {gym.address.area} · {countryName(gym.country, region.locale)}
            </p>
            <h1 className="mt-3 text-[2.5rem] leading-[1] font-bold tracking-[-0.045em] text-ink text-balance-safe sm:text-6xl">
              {gym.name}
            </h1>
            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-[15px] text-gray-600">
              <span className="flex items-center gap-1.5">
                <HiStar className="size-5 text-stamp-ochre" />
                <span className="font-semibold text-ink">{gym.rating}</span>
                <span className="text-gray-500">({gym.totalReviews} reviews)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <HiMapPin className="size-5 text-gray-400" />
                {gym.address.street}
                {gym.distance ? <span className="text-gray-500">· {distance(gym.distance)}</span> : null}
              </span>
              <span className="flex items-center gap-1.5">
                <HiOutlineClock className="size-5 text-gray-400" />
                {gym.hours.is24Hours ? "Open 24/7" : `${formatClock(gym.hours.open)} to ${formatClock(gym.hours.close)}`}
                {openNow !== null && (
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 font-mono text-[10px] tracking-[0.1em] uppercase",
                      openNow ? "bg-emerald-50 text-emerald-700" : "bg-stamp-magenta/10 text-stamp-magenta",
                    )}
                  >
                    {openNow ? "Open now" : "Closed"}
                  </span>
                )}
              </span>
            </div>
          </div>

          <dl className="grid shrink-0 grid-cols-3 divide-x divide-dashed divide-gray-900/15 rounded-3xl border border-dashed border-gray-900/15 bg-surface/60 rtl:divide-x-reverse">
            <div className="flex flex-col items-center px-4 py-4 sm:px-6">
              <dt className="order-2 mt-1 font-mono text-[10px] tracking-[0.12em] text-gray-400 uppercase">{crowd.label} now</dt>
              <dd
                className="flex size-12 items-center justify-center rounded-full p-[3px]"
                style={{ background: `conic-gradient(${crowd.color} 0 ${pct}%, var(--color-gray-200) 0)` }}
              >
                <span className="flex size-full items-center justify-center rounded-full bg-surface font-mono text-[11px] font-semibold text-ink">
                  {pct}%
                </span>
              </dd>
            </div>
            <div className="flex flex-col items-center justify-center px-4 py-4 sm:px-6">
              <dt className="order-2 mt-1 font-mono text-[10px] tracking-[0.12em] text-gray-400 uppercase">Day pass</dt>
              <dd className="text-xl font-semibold whitespace-nowrap text-ink tabular-nums sm:text-2xl">{money(gym.pricing.dayPass, gym.currency)}</dd>
            </div>
            <div className="flex flex-col items-center justify-center px-4 py-4 sm:px-6">
              <dt className="order-2 mt-1 font-mono text-[10px] tracking-[0.12em] text-gray-400 uppercase">Local time</dt>
              <dd className="font-mono text-xl font-semibold whitespace-nowrap text-ink tabular-nums sm:text-2xl">{localTime}</dd>
            </div>
          </dl>
        </div>
      </section>

      {/* Tabs */}
      <div className="sticky top-21 z-30 mt-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="-mx-1 overflow-x-auto px-1 py-1 no-scrollbar">
            <div role="tablist" aria-label="Gym sections" className="inline-flex min-w-full gap-1 rounded-full bg-surface p-1 shadow-lift ring-1 ring-gray-900/[0.06] sm:min-w-0">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={activeTab === tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "inline-flex flex-1 items-center justify-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-all duration-300 ease-out-expo sm:flex-none",
                    activeTab === tab.id ? "bg-ink text-white shadow-soft" : "text-gray-600 hover:text-ink",
                  )}
                >
                  {tab.label}
                  {tab.count !== undefined && (
                    <span className={cn("font-mono text-[10px]", activeTab === tab.id ? "text-volt" : "text-gray-400")}>{tab.count}</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="mx-auto mt-6 grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_22.5rem] lg:px-8">
        <div className="min-w-0 space-y-6">
          {activeTab === "overview" && (
            <>
              <section className={card}>
                <SectionTitle eyebrow="About" title={`Inside ${gym.name}`} />
                <p className="leading-relaxed whitespace-pre-line text-gray-600">{details.longDescription || gym.description}</p>
                <ul className="mt-6 flex flex-wrap gap-2">
                  {gym.amenities.map((amenity) => (
                    <li key={amenity} className="inline-flex items-center gap-1.5 rounded-full bg-canvas px-3 py-1.5 text-sm text-gray-700 ring-1 ring-gray-900/[0.05]">
                      <HiCheck className="size-4 text-emerald-600" />
                      {amenity}
                    </li>
                  ))}
                </ul>
                {gym.equipmentTypes.length > 0 && (
                  <p className="mt-5 font-mono text-[11px] tracking-[0.1em] text-gray-500 uppercase">
                    Training · {gym.equipmentTypes.join(" · ")}
                  </p>
                )}
              </section>

              <section className={card}>
                <SectionTitle
                  eyebrow="Pulse"
                  title="How busy it gets today"
                  action={
                    <span className="hidden font-mono text-[11px] tracking-[0.1em] text-gray-400 uppercase sm:block">
                      {gym.address.city} time
                    </span>
                  }
                />
                <CrowdCurve gym={gym} />
              </section>

              <section id="gallery" className={cn(card, "scroll-mt-40")}>
                <SectionTitle eyebrow="Gallery" title="Take a look around" />
                <PhotoGallery images={galleryImages} />
              </section>

              <div className="grid gap-6 xl:grid-cols-2">
                <section className={card}>
                  <SectionTitle eyebrow="Hours" title="Opening hours" />
                  <ul className="space-y-1">
                    {details.operatingHours.map((day) => {
                      const today = gymClock?.weekday === day.day;
                      return (
                        <li
                          key={day.day}
                          className={cn("flex items-center justify-between gap-3 rounded-2xl px-3 py-2.5 text-sm", today && "bg-volt-soft")}
                        >
                          <span className={cn("flex items-center gap-2", today ? "font-semibold text-ink" : "text-gray-600")}>
                            {day.day}
                            {today && (
                              <span className="rounded-full bg-ink px-2 py-0.5 font-mono text-[9px] tracking-[0.1em] text-volt uppercase">Today</span>
                            )}
                          </span>
                          <span className={cn("font-mono text-[13px] whitespace-nowrap tabular-nums", day.isClosed ? "text-stamp-magenta" : "text-ink")}>
                            {day.isClosed ? "Closed" : `${formatClock(day.open)} – ${formatClock(day.close)}`}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </section>

                <section className={card}>
                  <SectionTitle eyebrow="House rules" title="Good to know" />
                  <dl className="space-y-4">
                    {Object.entries(details.policies).map(([key, value]) => (
                      <div key={key}>
                        <dt className="text-sm font-semibold text-ink capitalize">{key.replace(/([A-Z])/g, " $1").replace("dresscode", "dress code").trim()}</dt>
                        <dd className="mt-0.5 text-sm leading-relaxed text-gray-600">{value}</dd>
                      </div>
                    ))}
                  </dl>
                </section>
              </div>

              {details.equipment.length > 0 && (
                <section className={card}>
                  <SectionTitle eyebrow="Equipment" title="What's on the floor" />
                  <ul className="grid gap-2 sm:grid-cols-2">
                    {details.equipment.map((item) => (
                      <li key={item.name} className="flex items-center justify-between gap-3 rounded-2xl bg-canvas/70 px-4 py-3">
                        <span className="min-w-0">
                          <span className="block truncate text-sm font-medium text-ink">{item.name}</span>
                          {item.brand && <span className="block truncate text-xs text-gray-500">{item.brand}</span>}
                        </span>
                        <span className="shrink-0 font-mono text-[12px] text-gray-500 tabular-nums">×{item.quantity}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {details.addOns.length > 0 && (
                <section className={card}>
                  <SectionTitle eyebrow="Add-ons" title="Add to any pass" />
                  <ul className="grid gap-3 sm:grid-cols-2">
                    {details.addOns.map((addOn) => (
                      <li
                        key={addOn.id}
                        className={cn(
                          "flex items-center gap-4 rounded-3xl p-4 ring-1 ring-gray-900/[0.06]",
                          addOn.isAvailable ? "bg-surface" : "bg-canvas opacity-60",
                        )}
                      >
                        <div className="min-w-0 flex-1">
                          <p className="font-mono text-[10px] tracking-[0.12em] text-gray-400 uppercase">{addOn.category}</p>
                          <p className="mt-0.5 truncate font-semibold text-ink">{addOn.name}</p>
                          <p className="mt-0.5 line-clamp-2 text-sm text-gray-500">{addOn.description}</p>
                        </div>
                        <div className="flex shrink-0 flex-col items-end gap-2">
                          <span className="text-[15px] font-semibold whitespace-nowrap text-ink tabular-nums">{money(addOn.price, gym.currency)}</span>
                          {addOn.isAvailable ? (
                            <button
                              type="button"
                              onClick={openBooking}
                              aria-label={`Add ${addOn.name}`}
                              className="flex size-8 items-center justify-center rounded-full bg-ink text-white transition-colors hover:bg-gray-800"
                            >
                              <HiPlus className="size-4" />
                            </button>
                          ) : (
                            <span className="text-xs text-gray-500">Unavailable</span>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </>
          )}

          {activeTab === "passes" && (
            <section>
              <SectionTitle eyebrow={`Passes · ${gym.currency}`} title="Pick how long you want to train" />
              <PassTickets gym={gym} annualPass={details.annualPass} specialPackages={details.specialPackages} onSelect={openBooking} />
            </section>
          )}

          {activeTab === "classes" && (
            <section>
              <SectionTitle eyebrow="Classes" title="Group sessions this week" />
              <div className="grid gap-4 md:grid-cols-2">
                {details.classes.map((cls) => {
                  const fill = Math.round((cls.currentEnrolled / cls.maxParticipants) * 100);
                  return (
                    <article key={cls.id} className="flex flex-col overflow-hidden rounded-4xl border border-gray-900/[0.06] bg-surface p-2 shadow-soft">
                      {cls.image && (
                        <div className="relative aspect-16/9 overflow-hidden rounded-[1.6rem]">
                          <Image src={cls.image} alt={cls.name} fill sizes="(max-width: 768px) 100vw, 400px" className="object-cover" />
                          <span className={cn("absolute top-3 start-3 rounded-full px-2.5 py-1 text-xs font-semibold backdrop-blur", difficultyTone[cls.difficulty] ?? "bg-surface text-ink")}>
                            {cls.difficulty}
                          </span>
                        </div>
                      )}
                      <div className="flex flex-1 flex-col p-4">
                        <h3 className="text-lg font-semibold tracking-tight text-ink">{cls.name}</h3>
                        <p className="mt-1 line-clamp-2 text-sm text-gray-600">{cls.description}</p>
                        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500">
                          <span className="flex items-center gap-1.5">
                            <HiOutlineClock className="size-4" />
                            {cls.duration} min
                          </span>
                          <span className="flex items-center gap-1.5">
                            <HiOutlineUser className="size-4" />
                            {cls.instructor}
                          </span>
                        </div>
                        <ul className="mt-4 flex flex-wrap gap-1.5">
                          {cls.schedule.map((slot, i) => (
                            <li key={i} className="rounded-full bg-canvas px-2.5 py-1 font-mono text-[11px] text-gray-600 ring-1 ring-gray-900/[0.05]">
                              {slot.day.slice(0, 3).toUpperCase()} {/^\d{1,2}:\d{2}$/.test(slot.time) ? formatClock(slot.time) : slot.time}
                            </li>
                          ))}
                        </ul>
                        <div className="mt-auto flex items-center justify-between gap-4 pt-5">
                          <div className="min-w-0 flex-1">
                            <div className="h-1.5 overflow-hidden rounded-full bg-gray-100">
                              <div className="h-full rounded-full bg-emerald-500" style={{ width: `${fill}%` }} />
                            </div>
                            <p className="mt-1.5 text-xs text-gray-500">
                              {cls.maxParticipants - cls.currentEnrolled} of {cls.maxParticipants} spots left
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={openBooking}
                            className="inline-flex h-10 shrink-0 items-center rounded-full bg-ink px-5 text-sm font-medium whitespace-nowrap text-white transition-colors hover:bg-gray-800"
                          >
                            Book class
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          )}

          {activeTab === "trainers" && (
            <section>
              <SectionTitle eyebrow="Coaches" title="Train with the team" />
              <div className="grid gap-4 md:grid-cols-2">
                {details.trainers.map((trainer) => (
                  <article key={trainer.id} className="flex flex-col rounded-4xl border border-gray-900/[0.06] bg-surface p-6 shadow-soft">
                    <div className="flex items-center gap-4">
                      <div className="relative size-16 shrink-0 overflow-hidden rounded-2xl">
                        <Image src={trainer.avatar} alt={trainer.name} fill sizes="64px" className="object-cover" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="truncate font-semibold text-ink">{trainer.name}</h3>
                        <p className="mt-0.5 flex items-center gap-1 text-sm text-gray-500">
                          <HiStar className="size-4 text-stamp-ochre" />
                          <span className="font-medium text-ink">{trainer.rating}</span>· {trainer.totalClients} clients · {trainer.experience} yrs
                        </p>
                      </div>
                    </div>
                    <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-gray-600">{trainer.bio}</p>
                    <ul className="mt-4 flex flex-wrap gap-1.5">
                      {trainer.specializations.map((spec) => (
                        <li key={spec} className="rounded-full bg-volt-soft px-2.5 py-1 text-xs font-medium text-emerald-800">
                          {spec}
                        </li>
                      ))}
                    </ul>
                    <p className="mt-4 mb-5 flex items-center gap-1.5 text-xs text-gray-500">
                      <HiOutlineCalendarDays className="size-4" />
                      {trainer.availability}
                    </p>
                    <div className="mt-auto flex items-center justify-between gap-4 border-t border-dashed border-gray-900/15 pt-4">
                      <p className="whitespace-nowrap">
                        <span className="text-lg font-semibold text-ink tabular-nums">{money(trainer.hourlyRate, gym.currency)}</span>
                        <span className="text-sm text-gray-500"> / hour</span>
                      </p>
                      <button
                        type="button"
                        onClick={openBooking}
                        className="inline-flex h-10 shrink-0 items-center rounded-full bg-surface px-5 text-sm font-medium whitespace-nowrap text-ink ring-1 ring-gray-900/10 transition-colors hover:bg-gray-100"
                      >
                        Book session
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}

          {activeTab === "reviews" && (
            <section className="space-y-4">
              <ReviewsSummary rating={gym.rating} totalReviews={gym.totalReviews} breakdown={details.ratingBreakdown} />
              <div className="flex flex-col items-start justify-between gap-4 rounded-4xl border border-dashed border-gray-900/15 bg-surface/60 p-6 sm:flex-row sm:items-center">
                <div>
                  <h3 className="font-semibold text-ink">Trained here?</h3>
                  <p className="mt-0.5 text-sm text-gray-500">Reviews from passport holders help travellers pick the right gym.</p>
                </div>
                <button type="button" className="inline-flex h-11 shrink-0 items-center rounded-full bg-ink px-5 text-sm font-medium text-white transition-colors hover:bg-gray-800">
                  Write a review
                </button>
              </div>
              {details.reviews.length === 0 ? (
                <div className={cn(card, "py-14 text-center")}>
                  <HiOutlineChatBubbleLeftRight className="mx-auto size-10 text-gray-300" />
                  <p className="mt-3 text-gray-500">No written reviews yet. Be the first to leave one.</p>
                </div>
              ) : (
                details.reviews.map((review) => <ReviewCard key={review.id} review={review} />)
              )}
            </section>
          )}
        </div>

        {/* Sidebar */}
        <aside className="space-y-4 lg:sticky lg:top-40 lg:self-start">
          <BookingTicket gym={gym} annualPass={details.annualPass} onBook={openBooking} />

          <div className="overflow-hidden rounded-4xl border border-gray-900/[0.06] bg-surface shadow-soft">
            <div className="relative h-40 bg-canvas-deep bg-line-grid">
              <div aria-hidden="true" className="absolute top-1/2 left-1/2 size-28 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-emerald-600/30" />
              <div aria-hidden="true" className="absolute top-1/2 left-1/2 size-14 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/15" />
              <span className="absolute top-1/2 left-1/2 flex size-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-ink text-volt shadow-lift">
                <HiMapPin className="size-5" />
              </span>
              <span className="absolute start-3 bottom-3 rounded-full bg-surface px-2.5 py-1 font-mono text-[10px] tracking-[0.1em] text-gray-500">
                {gym.location.lat.toFixed(3)}, {gym.location.lng.toFixed(3)}
              </span>
            </div>
            <div className="p-5">
              <p className="text-sm font-semibold text-ink">{gym.address.street}</p>
              <p className="mt-0.5 text-sm text-gray-500">
                {gym.address.area}, {gym.address.city}
              </p>
              <a
                href={directions}
                target="_blank"
                rel="noopener noreferrer"
                className="group mt-4 inline-flex h-10 w-full items-center justify-center gap-2 rounded-full bg-canvas text-sm font-medium text-ink ring-1 ring-gray-900/[0.06] transition-colors hover:bg-gray-100"
              >
                Get directions
                <HiArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 rtl:-scale-x-100" />
              </a>
            </div>
          </div>

          {(details.contact.phone || details.contact.email || details.contact.website) && (
            <div className="rounded-4xl border border-gray-900/[0.06] bg-surface p-5 shadow-soft">
              <p className="font-mono text-[11px] tracking-[0.14em] text-gray-400 uppercase">Contact</p>
              <ul className="mt-3 space-y-1">
                {details.contact.phone && (
                  <li>
                    <a href={`tel:${details.contact.phone}`} className="flex items-center gap-3 rounded-2xl px-2 py-2 text-sm text-gray-700 transition-colors hover:bg-canvas" dir="ltr">
                      <HiOutlinePhone className="size-4.5 text-gray-400" />
                      {details.contact.phone}
                    </a>
                  </li>
                )}
                {details.contact.email && (
                  <li>
                    <a href={`mailto:${details.contact.email}`} className="flex items-center gap-3 rounded-2xl px-2 py-2 text-sm text-gray-700 transition-colors hover:bg-canvas">
                      <HiOutlineEnvelope className="size-4.5 text-gray-400" />
                      <span className="truncate">{details.contact.email}</span>
                    </a>
                  </li>
                )}
                {details.contact.website && (
                  <li>
                    <a href={details.contact.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-2xl px-2 py-2 text-sm text-gray-700 transition-colors hover:bg-canvas">
                      <HiOutlineGlobeAlt className="size-4.5 text-gray-400" />
                      Website
                    </a>
                  </li>
                )}
              </ul>
              {(details.contact.instagram || details.contact.facebook) && (
                <div className="mt-3 flex gap-2 border-t border-gray-900/[0.06] pt-3">
                  {details.contact.instagram && (
                    <a
                      href={`https://instagram.com/${details.contact.instagram.replace("@", "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Instagram"
                      className="flex size-9 items-center justify-center rounded-full ring-1 ring-gray-900/10 text-gray-500 transition-colors hover:text-ink"
                    >
                      <FaInstagram className="size-4" />
                    </a>
                  )}
                  {details.contact.facebook && (
                    <a
                      href={`https://facebook.com/${details.contact.facebook}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Facebook"
                      className="flex size-9 items-center justify-center rounded-full ring-1 ring-gray-900/10 text-gray-500 transition-colors hover:text-ink"
                    >
                      <FaFacebookF className="size-4" />
                    </a>
                  )}
                </div>
              )}
            </div>
          )}

          <p className="flex items-center justify-center gap-1.5 text-xs text-gray-400">
            <HiOutlineUserGroup className="size-4" />
            {gym.capacity.current} of {gym.capacity.max} people inside right now
          </p>
        </aside>
      </div>

      {/* Mobile booking bar */}
      <div className="fixed inset-x-3 bottom-3 z-40 flex items-center justify-between gap-3 rounded-full bg-ink p-1.5 ps-5 text-white shadow-lift lg:hidden">
        <div className="min-w-0">
          <p className="font-mono text-[10px] tracking-[0.12em] text-white/50 uppercase">Day pass</p>
          <p className="truncate text-[15px] font-semibold whitespace-nowrap tabular-nums">{money(gym.pricing.dayPass, gym.currency)}</p>
        </div>
        <button type="button" onClick={openBooking} className="inline-flex h-11 shrink-0 items-center rounded-full bg-volt px-6 text-sm font-semibold text-ink">
          Book a pass
        </button>
      </div>

      <BookingModal gym={gym} isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />
    </div>
  );
}
