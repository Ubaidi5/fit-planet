"use client";

import { useTranslations } from "next-intl";
import { useActionState } from "react";
import { FormAlert, SubmitButton } from "@/components/auth/FormBits";
import { acceptInviteAction } from "@/actions/team";

export function AcceptInviteForm({ token }: { token: string }) {
  const [state, action] = useActionState(acceptInviteAction, null);
  const t = useTranslations("studio.join");
  return (
    <form action={action} className="space-y-4">
      {state && !state.ok && <FormAlert>{state.error}</FormAlert>}
      <input type="hidden" name="token" value={token} />
      <SubmitButton pendingLabel={t("joining")}>{t("accept")}</SubmitButton>
    </form>
  );
}
