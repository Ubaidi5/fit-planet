"use client";

import { useMemo, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  HiArrowLeft,
  HiArrowRight,
  HiCheck,
  HiOutlineMapPin,
  HiOutlinePhoto,
  HiOutlinePlus,
  HiOutlineStar,
  HiOutlineTrash,
  HiStar,
} from "react-icons/hi2";
import { cn } from "@/lib/utils";
import { countries, findCountry } from "@/lib/data/countries";
import { AMENITIES, DAYS, EQUIPMENT, type GymFormValues } from "./gym-form-values";
import type { GymInput } from "@/actions/studio";
import { createGymAction, updateGymAction } from "@/actions/studio";
import { uploadImageAction } from "@/actions/media";
import { Input } from "@/components/ui/Input";
import { FormAlert } from "@/components/auth/FormBits";
import { useToast } from "@/components/notifications/ToastProvider";

export type { GymFormValues };

const label = "mb-1.5 block text-sm font-medium text-gray-700";
const sectionCard = "rounded-[1.75rem] border border-gray-900/[0.06] bg-surface p-5 shadow-soft sm:p-7";

function Section({ title, hint, children, id }: { title: string; hint?: string; children: React.ReactNode; id?: string }) {
  return (
    <section id={id} className={cn(sectionCard, "scroll-mt-24")}>
      <h2 className="text-lg font-semibold tracking-[-0.02em] text-ink">{title}</h2>
      {hint && <p className="mt-1 text-sm text-gray-500">{hint}</p>}
      <div className="mt-5 space-y-4">{children}</div>
    </section>
  );
}

function Chips({ options, value, onChange }: { options: string[]; value: string[]; onChange: (v: string[]) => void }) {
  const [custom, setCustom] = useState("");
  const all = [...new Set([...options, ...value])];
  const toggle = (item: string) => onChange(value.includes(item) ? value.filter((v) => v !== item) : [...value, item]);
  return (
    <div className="flex flex-wrap gap-2">
      {all.map((item) => {
        const on = value.includes(item);
        return (
          <button
            key={item}
            type="button"
            aria-pressed={on}
            onClick={() => toggle(item)}
            className={cn(
              "inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-full px-3.5 text-sm font-medium ring-1 transition-colors",
              on ? "bg-ink text-white ring-ink" : "bg-surface text-gray-700 ring-gray-900/[0.1] hover:ring-gray-900/25",
            )}
          >
            {on && <HiCheck className="size-3.5 text-volt" />}
            {item}
          </button>
        );
      })}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const v = custom.trim();
          if (v && !value.includes(v)) onChange([...value, v]);
          setCustom("");
        }}
        className="inline-flex h-9 items-center rounded-full ps-3.5 pe-1 ring-1 ring-dashed ring-gray-900/20"
      >
        <input value={custom} onChange={(e) => setCustom(e.target.value)} placeholder="Add your own" className="w-28 bg-transparent text-sm placeholder:text-gray-400 focus:outline-none" />
        <button type="submit" aria-label="Add" className="flex size-7 cursor-pointer items-center justify-center rounded-full text-gray-500 hover:bg-gray-900/5">
          <HiOutlinePlus className="size-4" />
        </button>
      </form>
    </div>
  );
}

function TimeInput({ value, onChange, ...rest }: { value: string; onChange: (v: string) => void } & Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange">) {
  return (
    <input
      type="time"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-11 rounded-xl border border-gray-200 bg-surface px-3 text-[15px] text-ink focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/15 focus:outline-none disabled:opacity-40"
      {...rest}
    />
  );
}

export function GymEditor({ mode, gymId, initial }: { mode: "onboarding" | "edit"; gymId?: string; initial: GymFormValues }) {
  const [values, setValues] = useState<GymFormValues>(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [step, setStep] = useState(0);
  const [uploading, setUploading] = useState(0);
  const [locating, setLocating] = useState(false);
  const [pending, startTransition] = useTransition();
  const fileRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const toast = useToast();

  const set = <K extends keyof GymFormValues>(key: K, value: GymFormValues[K]) => {
    setValues((v) => ({ ...v, [key]: value }));
    if (errors[key as string]) setErrors(({ [key as string]: _, ...rest }) => rest);
  };

  const currencySymbol = useMemo(() => {
    try {
      return new Intl.NumberFormat("en", { style: "currency", currency: values.currency, currencyDisplay: "narrowSymbol" }).formatToParts(0).find((p) => p.type === "currency")?.value ?? values.currency;
    } catch {
      return values.currency;
    }
  }, [values.currency]);

  const timezones = useMemo(() => {
    try {
      return Intl.supportedValuesOf("timeZone");
    } catch {
      return [values.timezone];
    }
  }, [values.timezone]);

  const upload = async (files: FileList | null) => {
    if (!files?.length) return;
    const list = Array.from(files).slice(0, 12);
    setUploading((n) => n + list.length);
    for (const file of list) {
      const data = new FormData();
      data.set("file", file);
      data.set("folder", "gyms");
      const result = await uploadImageAction(data);
      setUploading((n) => n - 1);
      if (result.ok) setValues((v) => ({ ...v, images: [...v.images, result.data.url], coverImage: v.coverImage || result.data.url }));
      else toast.error(`Couldn't upload ${file.name}`, result.error);
    }
    if (fileRef.current) fileRef.current.value = "";
  };

  const locate = () => {
    if (!navigator.geolocation) return toast.error("Location isn't available in this browser");
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setValues((v) => ({ ...v, lat: Number(pos.coords.latitude.toFixed(6)), lng: Number(pos.coords.longitude.toFixed(6)) }));
        setLocating(false);
        toast.success("Location set", "Members will see accurate distance and directions.");
      },
      () => {
        setLocating(false);
        toast.error("Couldn't get your location", "Check location permission, or skip this for now.");
      },
      { enableHighAccuracy: true, timeout: 10_000 },
    );
  };

  const payload = (): GymInput => ({
    ...values,
    dailyDayPassLimit: values.dailyDayPassLimit === "" ? undefined : values.dailyDayPassLimit,
    weekPass: values.weekPass === "" ? 0 : values.weekPass,
    monthPass: values.monthPass === "" ? 0 : values.monthPass,
    // Opening hours shown on the card follow Monday unless the gym is 24/7
    open: values.is24Hours ? "00:00" : (values.operatingHours[0]?.open ?? values.open),
    close: values.is24Hours ? "24:00" : (values.operatingHours[0]?.close ?? values.close),
    operatingHours: values.is24Hours ? DAYS.map((day) => ({ day, open: "00:00", close: "24:00", isClosed: false })) : values.operatingHours,
  });

  const save = () =>
    startTransition(async () => {
      setFormError(null);
      const result = mode === "onboarding" ? await createGymAction(payload()) : await updateGymAction(gymId!, payload());
      if (!result.ok) {
        setErrors(result.fieldErrors ?? {});
        setFormError(result.error);
        const firstStep = stepOf(Object.keys(result.fieldErrors ?? {})[0]);
        if (mode === "onboarding" && firstStep !== null) setStep(firstStep);
        return;
      }
      if (mode === "onboarding") {
        toast.success("Your studio is ready", "Review your listing, then publish when you're happy.");
        router.push("/studio/profile?welcome=1");
      } else {
        toast.success(result.message ?? "Saved");
        router.refresh();
      }
    });

  const err = (key: string) => errors[key];

  const basics = (
    <Section id="basics" title="The basics" hint="This is what members see first.">
      <Input label="Gym name" value={values.name} onChange={(e) => set("name", e.target.value)} placeholder="Iron Paradise Gym" error={err("name")} maxLength={80} />
      <div>
        <label className={label} htmlFor="gym-desc">
          Short description
        </label>
        <textarea
          id="gym-desc"
          rows={3}
          maxLength={300}
          value={values.description}
          onChange={(e) => set("description", e.target.value)}
          placeholder="What makes your gym worth the trip? Equipment, vibe, who it's for."
          className={cn("block w-full rounded-xl border border-gray-200 bg-surface px-4 py-3 text-[15px] placeholder:text-gray-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/15 focus:outline-none", err("description") && "border-red-500")}
        />
        <div className="mt-1 flex justify-between text-xs">
          <span className="text-red-600">{err("description")}</span>
          <span className="text-gray-400 tabular-nums">{values.description.length}/300</span>
        </div>
      </div>
      <div>
        <label className={label} htmlFor="gym-long">
          Full story <span className="font-normal text-gray-400">(optional)</span>
        </label>
        <textarea
          id="gym-long"
          rows={5}
          maxLength={4000}
          value={values.longDescription ?? ""}
          onChange={(e) => set("longDescription", e.target.value)}
          placeholder="History, size, coaches, what a first visit looks like..."
          className="block w-full rounded-xl border border-gray-200 bg-surface px-4 py-3 text-[15px] placeholder:text-gray-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/15 focus:outline-none"
        />
      </div>
    </Section>
  );

  const location = (
    <Section id="location" title="Location" hint="Prices are charged in your currency; hours follow your timezone.">
      <div>
        <label className={label} htmlFor="gym-country">
          Country
        </label>
        <select
          id="gym-country"
          value={values.country}
          onChange={(e) => {
            const c = findCountry(e.target.value);
            setValues((v) => ({ ...v, country: e.target.value, ...(c ? { currency: c.currency, timezone: c.timezone, lat: c.center[0], lng: c.center[1] } : {}) }));
          }}
          className="h-12 w-full cursor-pointer rounded-xl border border-gray-200 bg-surface px-4 text-[15px] focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/15 focus:outline-none"
        >
          {countries.map((c) => (
            <option key={c.code} value={c.code}>
              {c.name}
            </option>
          ))}
        </select>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="City" value={values.city} onChange={(e) => set("city", e.target.value)} placeholder="Karachi" error={err("city")} />
        <Input label="Neighbourhood" value={values.area} onChange={(e) => set("area", e.target.value)} placeholder="Clifton" error={err("area")} />
      </div>
      <Input label="Street address" value={values.street} onChange={(e) => set("street", e.target.value)} placeholder="Plot 12, Block 5" error={err("street")} />
      <div className="flex flex-col gap-3 rounded-2xl bg-canvas p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="text-sm font-medium text-ink">Map pin</p>
          <p className="font-mono text-xs text-gray-500" dir="ltr">
            {Number(values.lat).toFixed(4)}, {Number(values.lng).toFixed(4)}
          </p>
        </div>
        <button
          type="button"
          onClick={locate}
          disabled={locating}
          className="inline-flex h-10 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-full bg-surface px-4 text-sm font-semibold text-ink shadow-soft ring-1 ring-gray-900/[0.06] disabled:opacity-60"
        >
          <HiOutlineMapPin className="size-4" />
          {locating ? "Locating..." : "I'm at the gym, use my location"}
        </button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={label} htmlFor="gym-currency">
            Currency
          </label>
          <input
            id="gym-currency"
            value={values.currency}
            onChange={(e) => set("currency", e.target.value.toUpperCase().slice(0, 3))}
            className="h-12 w-full rounded-xl border border-gray-200 bg-surface px-4 font-mono text-[15px] uppercase focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/15 focus:outline-none"
          />
        </div>
        <div>
          <label className={label} htmlFor="gym-tz">
            Timezone
          </label>
          <select
            id="gym-tz"
            value={values.timezone}
            onChange={(e) => set("timezone", e.target.value)}
            className="h-12 w-full cursor-pointer rounded-xl border border-gray-200 bg-surface px-4 text-[15px] focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/15 focus:outline-none"
          >
            {timezones.map((tz) => (
              <option key={tz} value={tz}>
                {tz.replace(/_/g, " ")}
              </option>
            ))}
          </select>
        </div>
      </div>
    </Section>
  );

  const priceField = (key: "dayPass" | "weekPass" | "monthPass", title: string, hint: string) => (
    <div>
      <label className={label} htmlFor={`price-${key}`}>
        {title}
      </label>
      <div className={cn("flex h-12 items-center rounded-xl border border-gray-200 bg-surface focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-500/15", err(key) && "border-red-500")}>
        <span className="ps-4 pe-2 text-sm font-medium text-gray-500">{currencySymbol}</span>
        <input
          id={`price-${key}`}
          type="number"
          inputMode="decimal"
          min={0}
          value={values[key] as number | string}
          onChange={(e) => set(key, e.target.value === "" ? "" : (Number(e.target.value) as never))}
          placeholder="0"
          className="h-full min-w-0 flex-1 bg-transparent pe-4 text-[15px] tabular-nums focus:outline-none"
        />
      </div>
      <p className={cn("mt-1.5 text-xs", err(key) ? "text-red-600" : "text-gray-500")}>{err(key) ?? hint}</p>
    </div>
  );

  const pricing = (
    <Section id="pricing" title="Passes and pricing" hint="Leave week or month at 0 if you only sell day passes.">
      <div className="grid gap-4 sm:grid-cols-3">
        {priceField("dayPass", "Day pass", "Single entry, one day")}
        {priceField("weekPass", "Week pass", "7 days, once a day")}
        {priceField("monthPass", "Month pass", "30 days, once a day")}
      </div>
    </Section>
  );

  const hours = (
    <Section id="hours" title="Hours and capacity">
      <label className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl bg-canvas p-4">
        <span>
          <span className="block text-sm font-medium text-ink">Open 24/7</span>
          <span className="block text-xs text-gray-500">Members can check in any time</span>
        </span>
        <input type="checkbox" checked={values.is24Hours} onChange={(e) => set("is24Hours", e.target.checked)} className="peer sr-only" />
        <span className="relative h-7 w-12 shrink-0 rounded-full bg-gray-300 transition-colors peer-checked:bg-emerald-600 after:absolute after:top-1 after:start-1 after:size-5 after:rounded-full after:bg-white after:shadow after:transition-transform peer-checked:after:translate-x-5 rtl:peer-checked:after:-translate-x-5" />
      </label>
      {!values.is24Hours && (
        <ul className="divide-y divide-gray-900/[0.06] rounded-2xl ring-1 ring-gray-900/[0.06]">
          {values.operatingHours.map((row, i) => (
            <li key={row.day} className="flex flex-wrap items-center gap-x-3 gap-y-2 px-4 py-3">
              <span className="w-24 text-sm font-medium text-ink">{row.day}</span>
              <div className="flex flex-1 items-center gap-2">
                <TimeInput aria-label={`${row.day} opens`} value={row.open} disabled={row.isClosed} onChange={(v) => set("operatingHours", values.operatingHours.map((r, j) => (j === i ? { ...r, open: v } : r)))} />
                <span className="text-gray-400">to</span>
                <TimeInput aria-label={`${row.day} closes`} value={row.close} disabled={row.isClosed} onChange={(v) => set("operatingHours", values.operatingHours.map((r, j) => (j === i ? { ...r, close: v } : r)))} />
              </div>
              <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-600">
                <input
                  type="checkbox"
                  checked={row.isClosed}
                  onChange={(e) => set("operatingHours", values.operatingHours.map((r, j) => (j === i ? { ...r, isClosed: e.target.checked } : r)))}
                  className="size-4 accent-ink"
                />
                Closed
              </label>
            </li>
          ))}
        </ul>
      )}
      {!values.is24Hours && (
        <button
          type="button"
          onClick={() => set("operatingHours", values.operatingHours.map((r) => ({ ...r, open: values.operatingHours[0].open, close: values.operatingHours[0].close })))}
          className="cursor-pointer text-sm font-semibold text-emerald-700"
        >
          Copy Monday to every day
        </button>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="Max people at once" type="number" inputMode="numeric" min={1} value={values.capacity as number} onChange={(e) => set("capacity", Number(e.target.value))} error={err("capacity")} hint="Used for the live crowd meter" />
        <Input
          label="Day passes per day (optional)"
          type="number"
          inputMode="numeric"
          min={0}
          value={(values.dailyDayPassLimit ?? "") as number | string}
          onChange={(e) => set("dailyDayPassLimit", e.target.value === "" ? "" : (Number(e.target.value) as never))}
          hint="Stops selling day passes once reached"
        />
      </div>
    </Section>
  );

  const photos = (
    <Section id="photos" title="Photos" hint="Bright, wide shots of the floor work best. The starred photo is your cover.">
      <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" multiple className="hidden" onChange={(e) => upload(e.target.files)} />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {values.images.map((url) => {
          const cover = (values.coverImage || values.images[0]) === url;
          return (
            <div key={url} className="group relative aspect-[4/3] overflow-hidden rounded-2xl bg-canvas ring-1 ring-gray-900/[0.06]">
              <img src={url} alt="" className="size-full object-cover" />
              <div className="absolute inset-x-2 top-2 flex justify-between">
                <button
                  type="button"
                  onClick={() => set("coverImage", url)}
                  aria-label={cover ? "Cover photo" : "Make cover photo"}
                  className={cn("flex h-8 cursor-pointer items-center gap-1 rounded-full px-2.5 text-xs font-semibold backdrop-blur", cover ? "bg-volt text-ink" : "bg-surface/90 text-gray-700")}
                >
                  {cover ? <HiStar className="size-3.5" /> : <HiOutlineStar className="size-3.5" />}
                  {cover ? "Cover" : "Set cover"}
                </button>
                <button
                  type="button"
                  onClick={() => setValues((v) => ({ ...v, images: v.images.filter((u) => u !== url), coverImage: v.coverImage === url ? "" : v.coverImage }))}
                  aria-label="Remove photo"
                  className="flex size-8 cursor-pointer items-center justify-center rounded-full bg-surface/90 text-red-600 backdrop-blur"
                >
                  <HiOutlineTrash className="size-4" />
                </button>
              </div>
            </div>
          );
        })}
        {Array.from({ length: uploading }).map((_, i) => (
          <div key={`u${i}`} className="aspect-[4/3] animate-pulse rounded-2xl bg-gray-200" />
        ))}
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="flex aspect-[4/3] cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-gray-900/15 text-sm font-medium text-gray-600 transition-colors hover:border-emerald-500 hover:text-emerald-700"
        >
          <HiOutlinePhoto className="size-7" />
          Add photos
        </button>
      </div>
    </Section>
  );

  const amenities = (
    <Section id="amenities" title="Amenities and equipment">
      <div>
        <p className={label}>Amenities</p>
        <Chips options={AMENITIES} value={values.amenities} onChange={(v) => set("amenities", v)} />
      </div>
      <div>
        <p className={label}>Training styles</p>
        <Chips options={EQUIPMENT} value={values.equipmentTypes} onChange={(v) => set("equipmentTypes", v)} />
      </div>
    </Section>
  );

  const contact = (
    <Section id="contact" title="Contact and house rules" hint="Optional, but members trust gyms that fill this in.">
      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="Phone" type="tel" value={values.phone ?? ""} onChange={(e) => set("phone", e.target.value)} />
        <Input label="Email" type="email" value={values.email ?? ""} onChange={(e) => set("email", e.target.value)} error={err("email")} />
        <Input label="Website" type="url" value={values.website ?? ""} onChange={(e) => set("website", e.target.value)} placeholder="https://" error={err("website")} />
        <Input label="Instagram" value={values.instagram ?? ""} onChange={(e) => set("instagram", e.target.value)} placeholder="@yourgym" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="Cancellation policy" value={values.cancellation ?? ""} onChange={(e) => set("cancellation", e.target.value)} placeholder="Full refund until the day before" />
        <Input label="Guests" value={values.guestPolicy ?? ""} onChange={(e) => set("guestPolicy", e.target.value)} placeholder="Guests need their own pass" />
        <Input label="Dress code" value={values.dresscode ?? ""} onChange={(e) => set("dresscode", e.target.value)} placeholder="Clean indoor shoes" />
        <Input label="Age" value={values.ageRestriction ?? ""} onChange={(e) => set("ageRestriction", e.target.value)} placeholder="16 and over" />
      </div>
    </Section>
  );

  const steps = [
    { title: "Basics", body: basics },
    { title: "Location", body: location },
    { title: "Pricing", body: (<div className="space-y-5">{pricing}{hours}</div>) },
    { title: "Photos", body: (<div className="space-y-5">{photos}{amenities}</div>) },
  ];

  if (mode === "onboarding") {
    const last = step === steps.length - 1;
    return (
      <div className="pb-28">
        <ol className="mb-6 grid grid-cols-4 gap-2">
          {steps.map((s, i) => (
            <li key={s.title}>
              <button type="button" onClick={() => i < step && setStep(i)} className={cn("w-full text-start", i < step && "cursor-pointer")}>
                <span className={cn("block h-1.5 rounded-full transition-colors", i <= step ? "bg-ink" : "bg-gray-900/10")} />
                <span className={cn("mt-2 block truncate text-xs font-medium", i === step ? "text-ink" : "text-gray-400")}>
                  {i + 1}. {s.title}
                </span>
              </button>
            </li>
          ))}
        </ol>
        {formError && <FormAlert className="mb-4">{formError}</FormAlert>}
        <div key={step} className="animate-fade-up">
          {steps[step].body}
        </div>
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-gray-900/[0.06] bg-surface/95 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur">
          <div className="mx-auto flex max-w-3xl items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0}
              className="inline-flex h-12 cursor-pointer items-center gap-2 rounded-full px-4 text-sm font-semibold text-gray-600 hover:bg-gray-900/5 disabled:invisible"
            >
              <HiArrowLeft className="size-4 rtl:rotate-180" />
              Back
            </button>
            <button
              type="button"
              disabled={pending || uploading > 0}
              onClick={() => (last ? save() : setStep((s) => s + 1))}
              className="inline-flex h-12 cursor-pointer items-center gap-2 rounded-full bg-ink px-6 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-60"
            >
              {last ? (pending ? "Creating..." : "Create my studio") : "Continue"}
              {!last && <HiArrowRight className="size-4 rtl:rotate-180" />}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-28">
      {formError && <FormAlert className="mb-4">{formError}</FormAlert>}
      <div className="space-y-5">
        {basics}
        {photos}
        {pricing}
        {hours}
        {location}
        {amenities}
        {contact}
      </div>
      {/* Sits above the studio tab bar on phones, docks to the bottom on desktop */}
      <div className="fixed inset-x-3 bottom-[5.5rem] z-30 rounded-full bg-surface/95 p-1.5 shadow-lift ring-1 ring-gray-900/[0.06] backdrop-blur lg:inset-x-0 lg:start-72 lg:bottom-0 lg:rounded-none lg:px-4 lg:pt-3 lg:pb-3 lg:shadow-none lg:ring-0 lg:border-t lg:border-gray-900/[0.06]">
        <div className="mx-auto flex max-w-4xl items-center justify-end gap-2 lg:gap-3">
          <button
            type="button"
            onClick={() => setValues(initial)}
            className="h-11 cursor-pointer rounded-full px-4 text-sm font-semibold text-gray-600 hover:bg-gray-900/5 lg:h-12"
          >
            Discard
          </button>
          <button
            type="button"
            onClick={save}
            disabled={pending || uploading > 0}
            className="h-11 flex-1 cursor-pointer rounded-full bg-ink px-6 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-60 lg:h-12 lg:flex-none"
          >
            {pending ? "Saving..." : "Save changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

function stepOf(field?: string): number | null {
  if (!field) return null;
  if (["name", "description", "longDescription"].includes(field)) return 0;
  if (["street", "area", "city", "country", "currency", "timezone", "lat", "lng"].includes(field)) return 1;
  if (["dayPass", "weekPass", "monthPass", "capacity", "dailyDayPassLimit", "open", "close"].includes(field) || field.startsWith("operatingHours")) return 2;
  return 3;
}
