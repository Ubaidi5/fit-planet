"use client";

import { useActionState, useState } from "react";
import { HiOutlineEnvelope, HiOutlineLockClosed } from "react-icons/hi2";
import { Input } from "@/components/ui/Input";
import { PasswordStrength } from "@/components/ui/PasswordStrength";
import { forgotPasswordAction, resetPasswordAction } from "@/actions/auth";
import { FormAlert, SubmitButton } from "./FormBits";

export function ForgotPasswordForm({ portal }: { portal: "app" | "studio" }) {
  const [state, action] = useActionState(forgotPasswordAction, null);
  if (state?.ok) return <FormAlert tone="success">{state.message}</FormAlert>;
  return (
    <form action={action} className="space-y-4" noValidate>
      <input type="hidden" name="portal" value={portal} />
      {state && !state.ok && !state.fieldErrors && <FormAlert>{state.error}</FormAlert>}
      <Input
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        inputMode="email"
        placeholder="you@example.com"
        leftIcon={<HiOutlineEnvelope className="size-4.5" />}
        error={state && !state.ok ? state.fieldErrors?.email : undefined}
        required
      />
      <SubmitButton pendingLabel="Sending...">Send reset link</SubmitButton>
    </form>
  );
}

export function ResetPasswordForm({ token, portal }: { token: string; portal?: string }) {
  const [state, action] = useActionState(resetPasswordAction, null);
  const [password, setPassword] = useState("");
  const errors = state && !state.ok ? state.fieldErrors : undefined;
  return (
    <form action={action} className="space-y-4" noValidate>
      <input type="hidden" name="token" value={token} />
      <input type="hidden" name="portal" value={portal ?? ""} />
      {state && !state.ok && !state.fieldErrors && <FormAlert>{state.error}</FormAlert>}
      <div>
        <Input
          label="New password"
          name="password"
          type="password"
          autoComplete="new-password"
          leftIcon={<HiOutlineLockClosed className="size-4.5" />}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors?.password}
          required
        />
        {password && <PasswordStrength password={password} className="mt-2.5" />}
      </div>
      <Input
        label="Confirm password"
        name="confirm"
        type="password"
        autoComplete="new-password"
        leftIcon={<HiOutlineLockClosed className="size-4.5" />}
        error={errors?.confirm}
        required
      />
      <SubmitButton pendingLabel="Saving...">Save and sign in</SubmitButton>
    </form>
  );
}
