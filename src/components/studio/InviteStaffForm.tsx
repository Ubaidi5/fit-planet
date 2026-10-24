"use client";

import { useTranslations } from "next-intl";
import { useActionState, useEffect, useRef } from "react";
import { HiOutlineEnvelope } from "react-icons/hi2";
import { Input } from "@/components/ui/Input";
import { FormAlert, SubmitButton } from "@/components/auth/FormBits";
import { inviteStaffAction } from "@/actions/team";

export function InviteStaffForm() {
  const [state, action] = useActionState(inviteStaffAction, null);
  const t = useTranslations("studio.team");
  const form = useRef<HTMLFormElement>(null);
  const errors = state && !state.ok ? state.fieldErrors : undefined;

  // Clear the field after a successful invite, ready for the next one
  useEffect(() => {
    if (state?.ok) form.current?.reset();
  }, [state]);

  return (
    <form ref={form} action={action} className="space-y-3">
      {state?.ok && <FormAlert tone="success">{state.message}</FormAlert>}
      {state && !state.ok && !state.fieldErrors && <FormAlert>{state.error}</FormAlert>}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
        <div className="flex-1">
          <Input
            label={t("emailLabel")}
            name="email"
            type="email"
            autoComplete="off"
            placeholder={t("emailPlaceholder")}
            leftIcon={<HiOutlineEnvelope className="size-4.5" />}
            error={errors?.email}
            required
          />
        </div>
        <div className="sm:mt-7 sm:w-44">
          <SubmitButton variant="secondary" pendingLabel={t("sending")}>
            {t("invite")}
          </SubmitButton>
        </div>
      </div>
    </form>
  );
}
