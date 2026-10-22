"use client";

import { useActionState, useState } from "react";
import { HiOutlineEnvelope, HiOutlineLockClosed, HiOutlineUser } from "react-icons/hi2";
import { Input } from "@/components/ui/Input";
import { PasswordStrength } from "@/components/ui/PasswordStrength";
import { registerAction } from "@/actions/auth";
import { Divider, FormAlert, SubmitButton } from "./FormBits";
import { OAuthButtons, type SignInMethods } from "./SignInForm";

export function RegisterForm({ methods, next, cta = "Create account" }: { methods: SignInMethods; next: string; cta?: string }) {
  const [state, action] = useActionState(registerAction, null);
  const [password, setPassword] = useState("");
  const errors = state && !state.ok ? state.fieldErrors : undefined;

  return (
    <div>
      <OAuthButtons methods={methods} next={next} />
      {(methods.google || methods.facebook) && <Divider label="or sign up with email" />}

      <form action={action} className="space-y-4" noValidate>
        <input type="hidden" name="next" value={next} />
        {state && !state.ok && !state.fieldErrors && <FormAlert>{state.error}</FormAlert>}
        <Input
          label="Full name"
          name="name"
          autoComplete="name"
          placeholder="Your name"
          leftIcon={<HiOutlineUser className="size-4.5" />}
          error={errors?.name}
          required
        />
        <Input
          label="Email"
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
            label="Password"
            name="password"
            type="password"
            autoComplete="new-password"
            placeholder="At least 8 characters"
            leftIcon={<HiOutlineLockClosed className="size-4.5" />}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors?.password}
            required
          />
          {password && <PasswordStrength password={password} className="mt-2.5" />}
        </div>
        <SubmitButton pendingLabel="Creating account...">{cta}</SubmitButton>
        <p className="text-center text-xs leading-relaxed text-gray-500">
          By continuing you agree to the Fit Planet terms and privacy policy.
        </p>
      </form>
    </div>
  );
}
