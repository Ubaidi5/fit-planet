"use client";

import { useTranslations } from "next-intl";
import { useState, useTransition } from "react";
import { cn } from "@/lib/utils";
import { updateNotificationPrefsAction } from "@/actions/member";
import { useToast } from "@/components/notifications/ToastProvider";

type Prefs = { push: boolean; email: boolean; bookingUpdates: boolean; passReminders: boolean; promotions: boolean };

const rows: (keyof Prefs)[] = ["push", "email", "bookingUpdates", "passReminders", "promotions"];

export function NotificationSettings({ initial }: { initial: Prefs }) {
  const [prefs, setPrefs] = useState(initial);
  const [, startTransition] = useTransition();
  const toast = useToast();
  const t = useTranslations("settings.prefs");

  const toggle = (key: keyof Prefs) => {
    const next = { ...prefs, [key]: !prefs[key] };
    setPrefs(next);
    startTransition(async () => {
      const result = await updateNotificationPrefsAction(next);
      if (!result.ok) {
        setPrefs(prefs);
        toast.error(t("failed"), result.error);
      }
    });
  };

  return (
    <ul className="divide-y divide-gray-900/[0.06] overflow-hidden rounded-[1.75rem] bg-surface shadow-soft ring-1 ring-gray-900/[0.05]">
      {rows.map((row) => (
        <li key={row}>
          <label className="flex cursor-pointer items-center justify-between gap-4 px-5 py-4">
            <span className="min-w-0">
              <span className="block text-[15px] font-medium text-ink">{t(`${row}.title`)}</span>
              <span className="block text-sm text-gray-500">{t(`${row}.text`)}</span>
            </span>
            <input type="checkbox" className="peer sr-only" checked={prefs[row]} onChange={() => toggle(row)} />
            <span
              aria-hidden="true"
              className={cn(
                "relative h-7 w-12 shrink-0 rounded-full bg-gray-300 transition-colors peer-checked:bg-emerald-600 peer-focus-visible:ring-4 peer-focus-visible:ring-emerald-500/25",
                "after:absolute after:top-1 after:start-1 after:size-5 after:rounded-full after:bg-white after:shadow after:transition-transform peer-checked:after:translate-x-5 rtl:peer-checked:after:-translate-x-5",
              )}
            />
          </label>
        </li>
      ))}
    </ul>
  );
}
