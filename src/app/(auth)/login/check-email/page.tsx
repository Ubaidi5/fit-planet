import type { Metadata } from "next";
import Link from "next/link";
import { HiOutlineEnvelopeOpen } from "react-icons/hi2";
import { AuthShell } from "@/components/auth/AuthShell";

export const metadata: Metadata = { title: "Check your email" };

export default function CheckEmailPage() {
  return (
    <AuthShell variant="member">
      <div className="text-center">
        <span className="mx-auto flex size-16 items-center justify-center rounded-3xl bg-volt text-ink shadow-soft">
          <HiOutlineEnvelopeOpen className="size-7" />
        </span>
        <h1 className="mt-6 text-[1.75rem] font-semibold tracking-[-0.03em] text-ink">Check your inbox</h1>
        <p className="mt-2 text-[15px] leading-relaxed text-gray-600">
          We sent you a sign-in link. Open it on this device to continue. It expires in 24 hours.
        </p>
        <p className="mt-8 text-sm text-gray-500">
          Nothing there? Check spam, or{" "}
          <Link href="/login" className="font-semibold text-ink underline-offset-4 hover:underline">
            try again
          </Link>
          .
        </p>
      </div>
    </AuthShell>
  );
}
