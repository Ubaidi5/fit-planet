import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { HiChevronLeft } from "react-icons/hi2";

export async function BackLink({ href = "/app/routines", label }: { href?: string; label?: string }) {
  const t = await getTranslations("routines");
  return (
    <Link href={href} className="-ms-2 inline-flex h-9 items-center gap-1 rounded-full ps-1.5 pe-3 text-sm font-medium text-gray-500 hover:bg-gray-900/5 hover:text-ink">
      <HiChevronLeft className="size-4 rtl:rotate-180" />
      {label ?? t("title")}
    </Link>
  );
}
