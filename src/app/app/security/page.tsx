import type { Metadata } from "next";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa6";
import { HiOutlineEnvelope } from "react-icons/hi2";
import { requireUser } from "@/server/session";
import { getDb } from "@/server/db/client";
import { PasswordForm } from "@/components/member/PasswordForm";
import { signOutAction } from "@/actions/auth";

export const metadata: Metadata = { title: "Security" };

const providers = {
  google: { name: "Google", icon: FcGoogle },
  facebook: { name: "Facebook", icon: FaFacebook },
} as const;

export default async function SecurityPage() {
  const user = await requireUser("/app/security");
  const accounts = await (await getDb()).collection("accounts").find({ userId: user._id }, { projection: { provider: 1 } }).toArray();
  const linked = new Set(accounts.map((a) => String(a.provider)));

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-[1.75rem] font-semibold tracking-[-0.035em] text-ink sm:text-4xl">Sign-in and security</h1>
        <p className="mt-1 text-gray-500">{user.email}</p>
      </div>

      <section className="rounded-[1.75rem] bg-surface p-5 shadow-soft ring-1 ring-gray-900/[0.05] sm:p-8">
        <h2 className="text-lg font-semibold text-ink">{user.passwordHash ? "Password" : "Add a password"}</h2>
        <p className="mt-1 mb-5 text-sm text-gray-500">
          {user.passwordHash ? "Use at least 8 characters. A passphrase is easiest to remember." : "You sign in with a link or social account. Add a password to sign in with your email too."}
        </p>
        <PasswordForm hasPassword={Boolean(user.passwordHash)} />
      </section>

      <section className="rounded-[1.75rem] bg-surface p-5 shadow-soft ring-1 ring-gray-900/[0.05] sm:p-8">
        <h2 className="text-lg font-semibold text-ink">Ways to sign in</h2>
        <ul className="mt-4 divide-y divide-gray-900/[0.06]">
          <li className="flex items-center gap-3 py-3">
            <HiOutlineEnvelope className="size-5 text-gray-500" />
            <span className="flex-1 text-sm text-ink">Email link</span>
            <span className="text-xs font-semibold text-emerald-700">Always on</span>
          </li>
          {Object.entries(providers).map(([key, p]) => (
            <li key={key} className="flex items-center gap-3 py-3">
              <p.icon className="size-5 text-[#1877F2]" />
              <span className="flex-1 text-sm text-ink">{p.name}</span>
              <span className={linked.has(key) ? "text-xs font-semibold text-emerald-700" : "text-xs text-gray-400"}>{linked.has(key) ? "Connected" : "Not connected"}</span>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-gray-500">Sign in once with Google or Facebook using the same email to connect it.</p>
      </section>

      <form action={signOutAction}>
        <button type="submit" className="h-12 w-full cursor-pointer rounded-full bg-surface text-sm font-semibold text-red-600 shadow-soft ring-1 ring-gray-900/[0.05] hover:bg-red-50 sm:w-auto sm:px-6">
          Sign out of this device
        </button>
      </form>
    </div>
  );
}
