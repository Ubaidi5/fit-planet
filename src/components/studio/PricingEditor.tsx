"use client";

import { useTranslations } from "next-intl";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { updatePricingAction } from "@/actions/studio";
import { useToast } from "@/components/notifications/ToastProvider";
import { useLocale } from "@/lib/i18n/LocaleProvider";

interface Props {
  gymId: string;
  currency: string;
  initial: { dayPass: number; weekPass: number; monthPass: number; dailyDayPassLimit: number | null };
  sales: Record<"day" | "week" | "month", { count: number; revenue: number }>;
}

const rows = [
  { key: "dayPass", type: "day", days: 1 },
  { key: "weekPass", type: "week", days: 7 },
  { key: "monthPass", type: "month", days: 30 },
] as const;

export function PricingEditor({ gymId, currency, initial, sales }: Props) {
  const t = useTranslations("studio.pricing");
  const tp = useTranslations("passes");
  const [values, setValues] = useState({ ...initial, dailyDayPassLimit: initial.dailyDayPassLimit ?? 0 });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  const toast = useToast();
  const { money } = useLocale();
  const dirty = JSON.stringify(values) !== JSON.stringify({ ...initial, dailyDayPassLimit: initial.dailyDayPassLimit ?? 0 });

  const save = () =>
    startTransition(async () => {
      const result = await updatePricingAction(gymId, values);
      if (result.ok) {
        setErrors({});
        toast.success(result.message ?? t("saved"));
        router.refresh();
      } else {
        setErrors(result.fieldErrors ?? {});
        toast.error(t("failed"), result.error);
      }
    });

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-[minmax(0,1fr)] gap-4 md:grid-cols-3">
        {rows.map((row) => {
          const value = values[row.key];
          const perDay = row.days > 1 && value > 0 ? value / row.days : null;
          const saving = perDay && values.dayPass > 0 ? Math.round((1 - perDay / values.dayPass) * 100) : null;
          return (
            <section key={row.key} className={cn("rounded-[1.75rem] bg-surface p-5 shadow-soft ring-1", value > 0 ? "ring-gray-900/[0.06]" : "ring-dashed ring-gray-900/15")}>
              <div className="flex items-center justify-between">
                <p className="font-mono text-[11px] tracking-[0.14em] text-gray-400 uppercase">{tp(`name.${row.type}`)}</p>
                {value > 0 ? (
                  <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">{t("onSale")}</span>
                ) : (
                  <span className="rounded-full bg-gray-900/[0.05] px-2 py-0.5 text-xs font-semibold text-gray-500">{t("off")}</span>
                )}
              </div>
              <label className={cn("mt-3 flex h-14 items-center rounded-2xl border bg-canvas/50 focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-500/15", errors[row.key] ? "border-red-500" : "border-gray-200")}>
                <span className="ps-4 pe-2 font-mono text-sm text-gray-500">{currency}</span>
                <input
                  type="number"
                  inputMode="decimal"
                  min={0}
                  value={value}
                  onChange={(e) => setValues((v) => ({ ...v, [row.key]: Number(e.target.value) }))}
                  className="h-full min-w-0 flex-1 bg-transparent pe-4 text-2xl font-semibold tracking-tight text-ink tabular-nums focus:outline-none"
                  aria-label={t("priceAria", { pass: tp(`name.${row.type}`) })}
                />
              </label>
              <p className="mt-2 text-xs text-gray-500">
                {errors[row.key] ?? t(`note.${row.type}`)}
                {saving && saving > 0 ? ` · ${t("cheaper", { percent: saving })}` : ""}
              </p>
              <div className="mt-4 flex items-center justify-between border-t border-dashed border-gray-900/10 pt-3 text-sm">
                <span className="text-gray-500">{t("sold")}</span>
                <span className="font-semibold text-ink tabular-nums">
                  {sales[row.type].count} · {money(sales[row.type].revenue, currency)}
                </span>
              </div>
            </section>
          );
        })}
      </div>

      <section className="flex flex-col gap-4 rounded-[1.75rem] bg-surface p-5 shadow-soft ring-1 ring-gray-900/[0.06] sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-semibold text-ink">{t("limit")}</p>
          <p className="text-sm text-gray-500">{t("limitHint")}</p>
        </div>
        <input
          type="number"
          min={0}
          value={values.dailyDayPassLimit}
          onChange={(e) => setValues((v) => ({ ...v, dailyDayPassLimit: Number(e.target.value) }))}
          className="h-12 w-28 shrink-0 rounded-xl border border-gray-200 bg-surface px-4 text-lg font-semibold tabular-nums focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/15 focus:outline-none"
          aria-label={t("limit")}
        />
      </section>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={save}
          disabled={!dirty || pending}
          className="h-12 w-full cursor-pointer rounded-full bg-ink px-6 text-sm font-semibold text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
        >
          {pending ? t("saving") : t("save")}
        </button>
      </div>
    </div>
  );
}
