"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa6";
import { HiOutlineEnvelope, HiOutlineLockClosed, HiOutlineSparkles } from "react-icons/hi2";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";
import { loginAction, magicLinkAction, oauthAction } from "@/actions/auth";
import { Divider, FormAlert, SubmitButton } from "./FormBits";

export interface SignInMethods {
  google: boolean;
  facebook: boolean;
  magicLink: boolean;
}

const knownErrors = ["OAuthAccountNotLinked", "AccessDenied", "Verification", "Configuration"];

export function OAuthButtons({ methods, next }: { methods: SignInMethods; next: string }) {
  const t = useTranslations("auth.form");
  if (!methods.google && !methods.facebook) return null;
  return (
    <div className="grid gap-2.5">
      {methods.google && (
        <form action={oauthAction}>
          <input type="hidden" name="provider" value="google" />
          <input type="hidden" name="next" value={next} />
          <button
            type="submit"
            className="flex h-12 w-full cursor-pointer items-center justify-center gap-3 rounded-full border border-gray-200 bg-surface text-[15px] font-medium text-ink shadow-soft transition-colors hover:border-gray-300 hover:bg-white active:scale-[0.98]"
          >
            <FcGoogle className="size-5" />
            {t("google")}
          </button>
        </form>
      )}
      {methods.facebook && (
        <form action={oauthAction}>
          <input type="hidden" name="provider" value="facebook" />
          <input type="hidden" name="next" value={next} />
          <button
            type="submit"
            className="flex h-12 w-full cursor-pointer items-center justify-center gap-3 rounded-full bg-[#1877F2] text-[15px] font-medium text-white shadow-soft transition-[filter] hover:brightness-95 active:scale-[0.98]"
          >
            <FaFacebook className="size-5" />
            {t("facebook")}
          </button>
        </form>
      )}
    </div>
  );
}

export function SignInForm({
  methods,
  next,
  errorCode,
  forgotHref,
}: {
  methods: SignInMethods;
  next: string;
  errorCode?: string;
  forgotHref: string;
}) {
  const t = useTranslations("auth.form");
  const [mode, setMode] = useState<"password" | "link">("password");
  const [loginState, login] = useActionState(loginAction, null);
  const [linkState, sendLink] = useActionState(magicLinkAction, null);
  const urlError = errorCode ? t(`errors.${knownErrors.includes(errorCode) ? errorCode : "default"}`) : null;
  const hasOAuth = methods.google || methods.facebook;

  return (
    <div>
      {urlError && <FormAlert className="mb-5">{urlError}</FormAlert>}

      <OAuthButtons methods={methods} next={next} />
      {hasOAuth && <Divider label={t("orEmail")} />}

      {methods.magicLink && (
        <div role="tablist" aria-label={t("method")} className="mb-5 grid grid-cols-2 gap-1 rounded-full bg-gray-900/[0.05] p-1">
          {(
            [
              ["password", t("password"), HiOutlineLockClosed],
              ["link", t("emailLink"), HiOutlineSparkles],
            ] as const
          ).map(([value, label, Icon]) => (
            <button
              key={value}
              type="button"
              role="tab"
              aria-selected={mode === value}
              onClick={() => setMode(value)}
              className={cn(
                "flex h-10 cursor-pointer items-center justify-center gap-2 rounded-full text-sm font-medium transition-all duration-300 ease-out-expo",
                mode === value ? "bg-surface text-ink shadow-soft" : "text-gray-500 hover:text-ink",
              )}
            >
              <Icon className="size-4" />
              {label}
            </button>
          ))}
        </div>
      )}

      {mode === "password" ? (
        <form action={login} className="space-y-4" noValidate>
          <input type="hidden" name="next" value={next} />
          {loginState && !loginState.ok && !loginState.fieldErrors && <FormAlert>{loginState.error}</FormAlert>}
          <Input
            label={t("email")}
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            placeholder="you@example.com"
            leftIcon={<HiOutlineEnvelope className="size-4.5" />}
            error={loginState && !loginState.ok ? loginState.fieldErrors?.email : undefined}
            required
          />
          <div>
            <Input
              label={t("password")}
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder={t("passwordPlaceholder")}
              leftIcon={<HiOutlineLockClosed className="size-4.5" />}
              error={loginState && !loginState.ok ? loginState.fieldErrors?.password : undefined}
              required
            />
            <div className="mt-2 text-end">
              <Link href={forgotHref} className="text-sm font-medium text-emerald-700 underline-offset-4 hover:underline">
                {t("forgot")}
              </Link>
            </div>
          </div>
          <SubmitButton pendingLabel={t("signingIn")}>{t("signIn")}</SubmitButton>
        </form>
      ) : (
        <form action={sendLink} className="space-y-4" noValidate>
          <input type="hidden" name="next" value={next} />
          {linkState && !linkState.ok && <FormAlert>{linkState.error}</FormAlert>}
          <Input
            label={t("email")}
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            placeholder="you@example.com"
            leftIcon={<HiOutlineEnvelope className="size-4.5" />}
            hint={t("linkHint")}
            required
          />
          <SubmitButton pendingLabel={t("sendingLink")}>{t("sendLink")}</SubmitButton>
        </form>
      )}
    </div>
  );
}
