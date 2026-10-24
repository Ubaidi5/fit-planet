"use client";

import { useTranslations } from "next-intl";
import { useActionState, useState } from "react";
import { HiOutlineEnvelope } from "react-icons/hi2";
import { Input } from "@/components/ui/Input";
import { FormAlert, SubmitButton } from "@/components/auth/FormBits";
import { deleteAccountAction } from "@/actions/member";

export function DeleteAccountForm({ email }: { email: string }) {
  const [state, action] = useActionState(deleteAccountAction, null);
  const [open, setOpen] = useState(false);
  const t = useTranslations("privacy");
  const errors = state && !state.ok ? state.fieldErrors : undefined;

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="h-11 w-full cursor-pointer rounded-full bg-red-50 px-5 text-sm font-semibold text-red-700 ring-1 ring-red-600/15 transition-colors hover:bg-red-100 sm:w-auto"
      >
        {t("deleteStart")}
      </button>
    );
  }

  return (
    <form action={action} className="space-y-4">
      {state && !state.ok && !state.fieldErrors && <FormAlert>{state.error}</FormAlert>}
      <Input
        label={t("deleteConfirmLabel", { email })}
        name="confirm"
        type="email"
        autoComplete="off"
        placeholder={email}
        leftIcon={<HiOutlineEnvelope className="size-4.5" />}
        error={errors?.confirm}
        required
      />
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="sm:w-60">
          <SubmitButton variant="danger" pendingLabel={t("deleting")}>
            {t("deleteForever")}
          </SubmitButton>
        </div>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="h-12 cursor-pointer rounded-full px-5 text-sm font-semibold text-gray-600 transition-colors hover:bg-canvas hover:text-ink"
        >
          {t("keepAccount")}
        </button>
      </div>
    </form>
  );
}
