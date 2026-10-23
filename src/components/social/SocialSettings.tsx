"use client";

import { useState, useTransition } from "react";
import { updateSocialProfileAction } from "@/actions/social";
import { useToast } from "@/components/notifications/ToastProvider";
import { cn } from "@/lib/utils";

interface Props {
  initial: { handle: string; bio: string; visibility: "public" | "followers"; shareCheckins: boolean };
}

export function SocialSettings({ initial }: Props) {
  const toast = useToast();
  const [values, setValues] = useState(initial);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const save = () =>
    startTransition(async () => {
      setError(null);
      const result = await updateSocialProfileAction(values);
      if (result.ok) toast.success(result.message ?? "Saved");
      else setError(result.error);
    });

  return (
    <div className="space-y-5">
      <label className="block">
        <span className="text-sm font-medium text-gray-700">Username</span>
        <span className="mt-1.5 flex h-12 items-center rounded-2xl bg-canvas px-4 focus-within:ring-2 focus-within:ring-ink/10">
          <span className="text-gray-400">@</span>
          <input
            value={values.handle}
            onChange={(e) => setValues((v) => ({ ...v, handle: e.target.value.toLowerCase().replace(/[^a-z0-9_.]/g, "") }))}
            maxLength={24}
            className="min-w-0 flex-1 bg-transparent ps-0.5 text-[15px] text-ink outline-none"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
          />
        </span>
        {error && <span className="mt-1.5 block text-sm text-stamp-magenta">{error}</span>}
      </label>

      <label className="block">
        <span className="flex justify-between text-sm font-medium text-gray-700">
          Bio
          <span className="font-normal text-gray-400 tabular-nums">{values.bio.length}/160</span>
        </span>
        <textarea
          value={values.bio}
          onChange={(e) => setValues((v) => ({ ...v, bio: e.target.value }))}
          maxLength={160}
          rows={3}
          placeholder="Powerlifter, early riser, always travelling"
          className="mt-1.5 w-full resize-none rounded-2xl bg-canvas px-4 py-3 text-[15px] text-ink outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-ink/10"
        />
      </label>

      <fieldset>
        <legend className="text-sm font-medium text-gray-700">Who sees your posts</legend>
        <div className="mt-1.5 grid gap-2 sm:grid-cols-2">
          {(
            [
              ["public", "Everyone", "Anyone signed in to Fit Planet."],
              ["followers", "Followers", "Only people who follow you."],
            ] as const
          ).map(([value, title, text]) => (
            <button
              key={value}
              type="button"
              onClick={() => setValues((v) => ({ ...v, visibility: value }))}
              aria-pressed={values.visibility === value}
              className={cn(
                "cursor-pointer rounded-2xl p-4 text-start ring-1 transition-colors",
                values.visibility === value ? "bg-volt-soft ring-ink/20" : "bg-canvas ring-transparent hover:ring-gray-900/10",
              )}
            >
              <span className="block text-sm font-semibold text-ink">{title}</span>
              <span className="text-sm text-gray-500">{text}</span>
            </button>
          ))}
        </div>
      </fieldset>

      <label className="flex cursor-pointer items-start justify-between gap-4 rounded-2xl bg-canvas p-4">
        <span>
          <span className="block text-sm font-semibold text-ink">Share gym check-ins</span>
          <span className="text-sm text-gray-500">Post automatically when a gym scans your pass.</span>
        </span>
        <input
          type="checkbox"
          checked={values.shareCheckins}
          onChange={(e) => setValues((v) => ({ ...v, shareCheckins: e.target.checked }))}
          className="peer sr-only"
        />
        <span aria-hidden className="relative mt-0.5 h-7 w-12 shrink-0 rounded-full bg-gray-300 transition-colors peer-checked:bg-ink peer-focus-visible:ring-2 peer-focus-visible:ring-ink/30 after:absolute after:top-1 after:start-1 after:size-5 after:rounded-full after:bg-white after:transition-transform peer-checked:after:translate-x-5 rtl:peer-checked:after:-translate-x-5" />
      </label>

      <button type="button" onClick={save} disabled={pending} className="h-12 w-full cursor-pointer rounded-full bg-ink text-sm font-semibold text-white disabled:opacity-60 sm:w-auto sm:px-8">
        {pending ? "Saving…" : "Save"}
      </button>
    </div>
  );
}
