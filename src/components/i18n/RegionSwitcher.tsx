"use client";

import { useEffect, useId, useRef, useState } from "react";
import { HiCheck, HiChevronDown, HiOutlineGlobeAlt } from "react-icons/hi2";
import { cn } from "@/lib/utils";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import { regions } from "@/lib/i18n/regions";
import { formatMoney } from "@/lib/i18n/format";

interface RegionSwitcherProps {
  /** Where the menu opens from the trigger */
  align?: "start" | "end";
  /** Open upwards, for triggers near the bottom of the screen */
  placement?: "bottom" | "top";
  className?: string;
}

/** Region and language picker: changes number, date, distance formats and text direction */
export function RegionSwitcher({ align = "end", placement = "bottom", className }: RegionSwitcherProps) {
  const { region, setRegion } = useLocale();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const menuId = useId();

  useEffect(() => {
    if (!open) return;
    const onPointer = (event: PointerEvent) => {
      if (!ref.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls={menuId}
        aria-label={`Region: ${region.name}, ${region.language}`}
        className="inline-flex h-10 items-center gap-1.5 rounded-full px-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-900/[0.04] hover:text-ink"
      >
        <HiOutlineGlobeAlt className="size-4.5" />
        <span className="font-mono text-[12px] tracking-[0.08em]">{region.code.split("-")[0]}</span>
        <HiChevronDown className={cn("size-3.5 text-gray-400 transition-transform duration-300", open && "rotate-180")} />
      </button>

      <div
        id={menuId}
        role="listbox"
        aria-label="Choose your region"
        className={cn(
          "absolute z-50 w-72 origin-top rounded-3xl border border-gray-900/[0.06] bg-surface p-2 shadow-lift transition-all duration-300 ease-out-expo",
          align === "end" ? "end-0" : "start-0",
          placement === "bottom" ? "top-full mt-2" : "bottom-full mb-2",
          open ? "visible scale-100 opacity-100" : "invisible scale-95 opacity-0",
        )}
      >
        <p className="px-3 pt-2 pb-2 font-mono text-[11px] tracking-[0.14em] text-gray-400 uppercase">Region · Language</p>
        <ul className="max-h-80 overflow-y-auto">
          {regions.map((option) => {
            const selected = option.code === region.code;
            return (
              <li key={option.code}>
                <button
                  type="button"
                  role="option"
                  aria-selected={selected}
                  onClick={() => {
                    setRegion(option.code);
                    setOpen(false);
                  }}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-start transition-colors",
                    selected ? "bg-volt-soft" : "hover:bg-gray-100",
                  )}
                >
                  <span className="w-9 shrink-0 font-mono text-[11px] tracking-[0.08em] text-gray-500">
                    {option.code.split("-")[0]}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-ink" dir={option.dir}>
                      {option.name}
                    </span>
                    <span className="block truncate text-xs text-gray-500">
                      <span dir={option.dir}>{option.language}</span> · {formatMoney(1234, option.currency, option.locale)}
                      {option.units === "imperial" ? " · mi" : " · km"}
                    </span>
                  </span>
                  {selected && <HiCheck className="size-4 shrink-0 text-emerald-700" />}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
