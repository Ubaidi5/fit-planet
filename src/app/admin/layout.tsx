import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { AdminNav } from "@/components/admin/AdminNav";
import { requireAdmin } from "@/server/session";
import { collections } from "@/server/db/collections";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s · Fit Planet admin" },
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();
  const openReports = (await (await collections.reports()).distinct("postId")).length;
  return (
    <div className="min-h-dvh bg-canvas">
      <header className="sticky top-0 z-40 border-b border-gray-900/[0.06] bg-canvas/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 sm:px-6 lg:flex-row lg:items-center lg:gap-8">
          <div className="flex items-center justify-between gap-4">
            <Logo href="/admin" tag="Admin" />
            <Link href="/" className="text-sm font-medium text-gray-500 hover:text-ink lg:hidden">
              Site
            </Link>
          </div>
          <AdminNav openReports={openReports} />
          <div className="ml-auto hidden items-center gap-4 text-sm lg:flex">
            <span className="max-w-48 truncate text-gray-500">{admin.email}</span>
            <Link href="/" className="font-medium text-gray-500 hover:text-ink">
              Site
            </Link>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl space-y-6 px-4 py-6 sm:px-6 sm:py-10">{children}</main>
    </div>
  );
}
