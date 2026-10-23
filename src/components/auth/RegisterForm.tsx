"use client";

import { useActionState, useState } from "react";
import { useTranslations } from "next-intl";
import { HiOutlineEnvelope, HiOutlineLockClosed, HiOutlineUser } from "react-icons/hi2";
import { Input } from "@/components/ui/Input";
import { PasswordStrength } from "@/components/ui/PasswordStrength";
import { registerAction } from "@/actions/auth";
import { Divider, FormAlert, SubmitButton } from "./FormBits";
import { OAuthButtons, type SignInMethods } from "./SignInForm";

export function RegisterForm({ methods, next, cta }: { methods: SignInMethods; next: string; cta?: string }) {
  const t = useTranslations("auth.form");
  const [state, action] = useActionState(registerAction, null);
  const [password, setPassword] = useState("");
  const errors = state && !state.ok ? state.fieldErrors : undefined;

  return (
    <div>
      <OAuthButtons methods={methods} next={next} />
      {(methods.google || methods.facebook) && <Divider label={t("orSignUpEmail")} />}

      <form action={action} className="space-y-4" noValidate>
        <input type="hidden" name="next" value={next} />
        {state && !state.ok && !state.fieldErrors && <FormAlert>{state.error}</FormAlert>}
        <Input
          label={t("fullName")}
          name="name"
          autoComplete="name"
          placeholder={t("namePlaceholder")}
          leftIcon={<HiOutlineUser className="size-4.5" />}
          error={errors?.name}
          required
        />
        <Input
          label={t("email")}
          name="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          placeholder="you@example.com"
          leftIcon={<HiOutlineEnvelope className="size-4.5" />}
          error={errors?.email}
          required
        />
        <div>
          <Input
            label={t("password")}
            name="password"
            type="password"
            autoComplete="new-password"
            placeholder={t("newPasswordPlaceholder")}
            leftIcon={<HiOutlineLockClosed className="size-4.5" />}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors?.password}
            required
          />
          {password && <PasswordStrength password={password} className="mt-2.5" />}
        </div>
        <SubmitButton pendingLabel={t("creating")}>{cta ?? t("create")}</SubmitButton>
        <p className="text-center text-xs leading-relaxed text-gray-500">
          {t("terms")}
        </p>
      </form>
    </div>
  );
}
