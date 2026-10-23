"use client";

import { useTranslations } from "next-intl";
import { useActionState, useRef, useState } from "react";
import { HiOutlineCamera } from "react-icons/hi2";
import { Input } from "@/components/ui/Input";
import { FormAlert, SubmitButton } from "@/components/auth/FormBits";
import { updateProfileAction } from "@/actions/member";
import { uploadImageAction } from "@/actions/media";
import { regions } from "@/lib/i18n/regions";
import { useToast } from "@/components/notifications/ToastProvider";

interface Props {
  initial: { name: string; email: string; phone: string; homeCity: string; regionCode: string; image: string; initials: string };
  cities: string[];
}

export function ProfileForm({ initial, cities }: Props) {
  const [state, action] = useActionState(updateProfileAction, null);
  const [image, setImage] = useState(initial.image);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const toast = useToast();
  const t = useTranslations("settings");
  const errors = state && !state.ok ? state.fieldErrors : undefined;

  const upload = async (file?: File) => {
    if (!file) return;
    setUploading(true);
    const data = new FormData();
    data.set("file", file);
    data.set("folder", "avatars");
    const result = await uploadImageAction(data);
    setUploading(false);
    if (result.ok) setImage(result.data.url);
    else toast.error(t("uploadFailed"), result.error);
  };

  return (
    <form action={action} className="space-y-6">
      <input type="hidden" name="image" value={image} />
      {state?.ok && <FormAlert tone="success">{state.message}</FormAlert>}
      {state && !state.ok && !state.fieldErrors && <FormAlert>{state.error}</FormAlert>}

      <div className="flex items-center gap-5">
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="group relative size-20 shrink-0 cursor-pointer overflow-hidden rounded-full bg-volt text-2xl font-semibold text-ink ring-4 ring-surface"
          aria-label={t("changePhoto")}
        >
          {image ? (
            <img src={image} alt="" className="size-full object-cover" referrerPolicy="no-referrer" />
          ) : (
            <span className="flex size-full items-center justify-center">{initial.initials}</span>
          )}
          <span className="absolute inset-0 flex items-center justify-center bg-ink/50 text-white opacity-0 transition-opacity group-hover:opacity-100">
            <HiOutlineCamera className="size-6" />
          </span>
          {uploading && <span className="absolute inset-0 animate-pulse bg-white/60" />}
        </button>
        <div>
          <p className="font-semibold text-ink">{initial.name || t("yourName")}</p>
          <p className="text-sm text-gray-500">{initial.email}</p>
          <div className="mt-2 flex gap-3 text-sm font-semibold">
            <button type="button" onClick={() => fileRef.current?.click()} className="cursor-pointer text-emerald-700">
              {t("uploadPhoto")}
            </button>
            {image && (
              <button type="button" onClick={() => setImage("")} className="cursor-pointer text-gray-500">
                {t("remove")}
              </button>
            )}
          </div>
        </div>
        <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(e) => upload(e.target.files?.[0])} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Input label={t("fullName")} name="name" defaultValue={initial.name} autoComplete="name" error={errors?.name} required />
        <Input label={t("phone")} name="phone" type="tel" defaultValue={initial.phone} autoComplete="tel" error={errors?.phone} hint={t("phoneHint")} />
        <div>
          <label htmlFor="homeCity" className="mb-1.5 block text-sm font-medium text-gray-700">
            {t("homeCity")}
          </label>
          <input
            id="homeCity"
            name="homeCity"
            list="city-options"
            defaultValue={initial.homeCity}
            placeholder={t("homeCityPlaceholder")}
            className="block h-12 w-full rounded-xl border border-gray-200 bg-surface px-4 text-[15px] placeholder:text-gray-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/15 focus:outline-none"
          />
          <datalist id="city-options">
            {cities.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
        </div>
        <div>
          <label htmlFor="regionCode" className="mb-1.5 block text-sm font-medium text-gray-700">
            {t("region")}
          </label>
          <select
            id="regionCode"
            name="regionCode"
            defaultValue={initial.regionCode}
            className="block h-12 w-full cursor-pointer rounded-xl border border-gray-200 bg-surface px-4 text-[15px] focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/15 focus:outline-none"
          >
            {regions.map((r) => (
              <option key={r.code} value={r.code}>
                {r.name} · {r.language}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="sm:w-48">
        <SubmitButton variant="secondary" pendingLabel={t("saving")} disabled={uploading}>
          {t("saveProfile")}
        </SubmitButton>
      </div>
    </form>
  );
}
