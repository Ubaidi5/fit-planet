"use client";

import { usePathname } from "next/navigation";
import { StudioSidebar } from "./StudioSidebar";

export function StudioLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Don't show sidebar on login/register pages
  const isAuthPage =
    pathname === "/studio/login" || pathname === "/studio/register";

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <StudioSidebar />
      <main className="ml-64 flex-1">{children}</main>
    </div>
  );
}
