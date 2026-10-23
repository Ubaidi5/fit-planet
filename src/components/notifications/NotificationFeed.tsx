"use client";

import { useTranslations } from "next-intl";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import {
  HiOutlineBellSlash,
  HiOutlineCalendarDays,
  HiOutlineCheckBadge,
  HiOutlineInformationCircle,
  HiOutlineStar,
  HiOutlineTicket,
  HiOutlineXCircle,
} from "react-icons/hi2";
import { cn } from "@/lib/utils";
import type { NotificationView } from "@/lib/types";
import { markNotificationsReadAction, notificationFeedAction } from "@/actions/notifications";

const icons: Record<string, { icon: React.ComponentType<{ className?: string }>; tone: string }> = {
  "booking.new": { icon: HiOutlineTicket, tone: "bg-volt text-ink" },
  "booking.confirmed": { icon: HiOutlineCalendarDays, tone: "bg-emerald-50 text-emerald-700" },
  "booking.cancelled": { icon: HiOutlineXCircle, tone: "bg-red-50 text-red-600" },
  checkin: { icon: HiOutlineCheckBadge, tone: "bg-volt-soft text-emerald-800" },
  "review.new": { icon: HiOutlineStar, tone: "bg-stamp-ochre/10 text-stamp-ochre" },
  "review.reply": { icon: HiOutlineStar, tone: "bg-stamp-ochre/10 text-stamp-ochre" },
};

function relative(iso: string, locale: string) {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });
  if (diff < 60) return rtf.format(0, "second");
  if (diff < 3600) return rtf.format(-Math.round(diff / 60), "minute");
  if (diff < 86400) return rtf.format(-Math.round(diff / 3600), "hour");
  return rtf.format(-Math.round(diff / 86400), "day");
}

/** Notification list that refreshes itself every 30 seconds */
export function NotificationFeed({ initial }: { initial: NotificationView[] }) {
  const [items, setItems] = useState(initial);
  const t = useTranslations("notifications");
  const { region } = useLocale();
  const [pending, startTransition] = useTransition();
  const unread = items.filter((n) => !n.read).length;

  useEffect(() => {
    const id = setInterval(async () => {
      if (document.visibilityState !== "visible") return;
      const feed = await notificationFeedAction();
      setItems((current) => {
        const known = new Set(current.map((n) => n.id));
        const fresh = feed.items.filter((n) => !known.has(n.id));
        return fresh.length ? [...fresh, ...current] : current;
      });
    }, 30_000);
    return () => clearInterval(id);
  }, []);

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center rounded-[1.75rem] border-2 border-dashed border-gray-900/10 px-6 py-16 text-center">
        <HiOutlineBellSlash className="size-10 text-gray-300" />
        <p className="mt-3 font-semibold text-ink">{t("empty.title")}</p>
        <p className="mt-1 max-w-xs text-sm text-gray-500">{t("empty.text")}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm text-gray-500">{unread > 0 ? t("unread", { count: unread }) : t("caughtUp")}</p>
        {unread > 0 && (
          <button
            type="button"
            disabled={pending}
            onClick={() =>
              startTransition(async () => {
                await markNotificationsReadAction("all");
                setItems((list) => list.map((n) => ({ ...n, read: true })));
              })
            }
            className="h-9 cursor-pointer rounded-full px-3 text-sm font-semibold text-emerald-700 hover:bg-emerald-50"
          >
            {t("markAll")}
          </button>
        )}
      </div>
      <ul className="divide-y divide-gray-900/[0.06] overflow-hidden rounded-[1.75rem] bg-surface shadow-soft ring-1 ring-gray-900/[0.05]">
        {items.map((n) => {
          const { icon: Icon, tone } = icons[n.type] ?? { icon: HiOutlineInformationCircle, tone: "bg-canvas text-gray-600" };
          const body = (
            <div className={cn("flex gap-3.5 px-4 py-4 sm:px-5", !n.read && "bg-volt-soft/40")}>
              <span className={cn("flex size-10 shrink-0 items-center justify-center rounded-2xl", tone)}>
                <Icon className="size-5" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <p className={cn("text-[15px] text-ink", !n.read ? "font-semibold" : "font-medium")}>{n.title}</p>
                  <span className="shrink-0 pt-0.5 text-xs text-gray-400">{relative(n.createdAt, region.locale)}</span>
                </div>
                <p className="mt-0.5 text-sm leading-relaxed text-gray-600">{n.body}</p>
              </div>
              {!n.read && <span aria-label={t("unreadOne")} className="mt-2 size-2 shrink-0 rounded-full bg-emerald-500" />}
            </div>
          );
          return (
            <li key={n.id}>
              {n.link ? (
                <Link
                  href={n.link}
                  onClick={() => !n.read && markNotificationsReadAction([n.id])}
                  className="block transition-colors hover:bg-canvas/50"
                >
                  {body}
                </Link>
              ) : (
                body
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
