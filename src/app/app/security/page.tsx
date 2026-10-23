import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa6";
import { HiOutlineEnvelope } from "react-icons/hi2";
import { requireUser } from "@/server/session";
import { getDb } from "@/server/db/client";
import { PasswordForm } from "@/components/member/PasswordForm";
import { signOutAction } from "@/actions/auth";
import { signOutOtherDevicesAction } from "@/actions/member";
import { DeleteAccountForm } from "@/components/member/DeleteAccountForm";
import { deletionBlocker } from "@/server/modules/privacy";
import Link from "next/link";
import { HiOutlineArrowDownTray } from "react-icons/hi2";

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await getTranslations("settings"))("security") };
}

const providers = {
  google: { name: "Google", icon: FcGoogle },
  facebook: { name: "Facebook", icon: FaFacebook },
} as const;

export default async function SecurityPage({ searchParams }: { searchParams: Promise<{ devices?: string }> }) {
  const user = await requireUser("/app/security");
  const { devices } = await searchParams;
  const accounts = await (await getDb()).collection("accounts").find({ userId: user._id }, { projection: { provider: 1 } }).toArray();
  const linked = new Set(accounts.map((a) => String(a.provider)));
  const [t, tp, blocker] = await Promise.all([getTranslations("settings"), getTranslations("privacy"), deletionBlocker(user._id)]);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-[1.75rem] font-semibold tracking-[-0.035em] text-ink sm:text-4xl">{t("security")}</h1>
        <p className="mt-1 text-gray-500">{user.email}</p>
      </div>

      <section className="rounded-[1.75rem] bg-surface p-5 shadow-soft ring-1 ring-gray-900/[0.05] sm:p-8">
        <h2 className="text-lg font-semibold text-ink">{user.passwordHash ? t("password") : t("addPassword")}</h2>
        <p className="mt-1 mb-5 text-sm text-gray-500">
          {user.passwordHash ? t("passwordHint") : t("addPasswordHint")}
        </p>
        <PasswordForm hasPassword={Boolean(user.passwordHash)} />
      </section>

      <section className="rounded-[1.75rem] bg-surface p-5 shadow-soft ring-1 ring-gray-900/[0.05] sm:p-8">
        <h2 className="text-lg font-semibold text-ink">{t("ways")}</h2>
        <ul className="mt-4 divide-y divide-gray-900/[0.06]">
          <li className="flex items-center gap-3 py-3">
            <HiOutlineEnvelope className="size-5 text-gray-500" />
            <span className="flex-1 text-sm text-ink">{t("emailLink")}</span>
            <span className="text-xs font-semibold text-emerald-700">{t("alwaysOn")}</span>
          </li>
          {Object.entries(providers).map(([key, p]) => (
            <li key={key} className="flex items-center gap-3 py-3">
              <p.icon className="size-5 text-[#1877F2]" />
              <span className="flex-1 text-sm text-ink">{p.name}</span>
              <span className={linked.has(key) ? "text-xs font-semibold text-emerald-700" : "text-xs text-gray-400"}>{linked.has(key) ? t("connected") : t("notConnected")}</span>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-gray-500">{t("connectHint")}</p>
      </section>

      <section className="rounded-[1.75rem] bg-surface p-5 shadow-soft ring-1 ring-gray-900/[0.05] sm:p-8">
        <h2 className="text-lg font-semibold text-ink">{t("devices.title")}</h2>
        <p className="mt-1 text-sm text-gray-500">{t("devices.text")}</p>
        {devices === "signed-out" ? (
          <p role="status" className="mt-5 rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800 ring-1 ring-emerald-600/15">
            {t("devices.done")}
          </p>
        ) : (
          <form action={signOutOtherDevicesAction} className="mt-5">
            <button type="submit" className="h-11 w-full cursor-pointer rounded-full bg-canvas px-5 text-sm font-semibold text-ink ring-1 ring-gray-900/[0.08] transition-colors hover:bg-gray-100 sm:w-auto">
              {t("devices.action")}
            </button>
          </form>
        )}
      </section>

      <section className="rounded-[1.75rem] bg-surface p-5 shadow-soft ring-1 ring-gray-900/[0.05] sm:p-8">
        <h2 className="text-lg font-semibold text-ink">{tp("dataTitle")}</h2>
        <p className="mt-1 text-sm text-gray-500">{tp("dataText")}</p>
        {/* A plain link: the route answers with a file download */}
        <a
          href="/app/security/export"
          download
          className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-canvas px-5 text-sm font-semibold text-ink ring-1 ring-gray-900/[0.08] transition-colors hover:bg-gray-100 sm:w-auto"
        >
          <HiOutlineArrowDownTray className="size-4.5" />
          {tp("download")}
        </a>

        <div className="mt-8 border-t border-gray-900/[0.06] pt-6">
          <h3 className="text-base font-semibold text-ink">{tp("deleteTitle")}</h3>
          <p className="mt-1 mb-5 text-sm text-gray-500">{tp("deleteText")}</p>
          {blocker ? (
            <p className="rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-900 ring-1 ring-amber-600/15">
              {tp(blocker === "runsGym" ? "blockedGym" : "blockedPass")}{" "}
              {blocker === "activePass" && (
                <Link href="/app/passes" className="font-semibold underline underline-offset-2">
                  {tp("seePasses")}
                </Link>
              )}
            </p>
          ) : (
            user.email && <DeleteAccountForm email={user.email} />
          )}
        </div>
      </section>

      <form action={signOutAction}>
        <button type="submit" className="h-12 w-full cursor-pointer rounded-full bg-surface text-sm font-semibold text-red-600 shadow-soft ring-1 ring-gray-900/[0.05] hover:bg-red-50 sm:w-auto sm:px-6">
          {t("signOut")}
        </button>
      </form>
    </div>
  );
}
