"use client";

import { useTranslations } from "next-intl";
import { useActionState, useState } from "react";
import { HiOutlineLockClosed } from "react-icons/hi2";
import { Input } from "@/components/ui/Input";
import { PasswordStrength } from "@/components/ui/PasswordStrength";
import { FormAlert, SubmitButton } from "@/components/auth/FormBits";
import { changePasswordAction } from "@/actions/member";

export function PasswordForm({ hasPassword }: { hasPassword: boolean }) {
  const [state, action] = useActionState(changePasswordAction, null);
  const [password, setPassword] = useState("");
  const t = useTranslations("settings");
  const errors = state && !state.ok ? state.fieldErrors : undefined;
  return (
    <form action={action} className="space-y-4">
      {state?.ok && <FormAlert tone="success">{state.message}</FormAlert>}
      {state && !state.ok && !state.fieldErrors && <FormAlert>{state.error}</FormAlert>}
      {hasPassword && (
        <Input label={t("currentPassword")} name="current" type="password" autoComplete="current-password" leftIcon={<HiOutlineLockClosed className="size-4.5" />} error={errors?.current} />
      )}
      <div>
        <Input
          label={hasPassword ? t("newPassword") : t("password")}
          name="password"
          type="password"
          autoComplete="new-password"
          leftIcon={<HiOutlineLockClosed className="size-4.5" />}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors?.password}
        />
        {password && <PasswordStrength password={password} className="mt-2.5" />}
      </div>
      <Input label={t("confirmPassword")} name="confirm" type="password" autoComplete="new-password" leftIcon={<HiOutlineLockClosed className="size-4.5" />} error={errors?.confirm} />
      <div className="sm:w-56">
        <SubmitButton variant="secondary" pendingLabel={t("saving")}>
          {hasPassword ? t("changePassword") : t("addPasswordCta")}
        </SubmitButton>
      </div>
    </form>
  );
}
