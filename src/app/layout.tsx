import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, JetBrains_Mono } from "next/font/google";
import "@/styles/globals.css";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { env } from "@/server/env";
import { LocaleProvider } from "@/lib/i18n/LocaleProvider";
import { getRegion } from "@/lib/i18n/server";
import { ToastProvider } from "@/components/notifications/ToastProvider";
import { MonitoringInit } from "@/components/monitoring/MonitoringInit";
import { serverRelease } from "@/server/release";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin", "latin-ext", "vietnamese"],
  axes: ["opsz"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin", "latin-ext", "cyrillic"],
});

export async function generateMetadata(): Promise<Metadata> {
  const [t, region] = await Promise.all([getTranslations("seo"), getRegion()]);
  return {
    metadataBase: new URL(env.appUrl),
    title: { default: t("title"), template: "%s · Fit Planet" },
    description: t("description"),
    applicationName: "Fit Planet",
    openGraph: { type: "website", siteName: "Fit Planet", locale: region.locale.replace("-", "_"), title: t("title"), description: t("description") },
    twitter: { card: "summary_large_image", title: t("title"), description: t("description") },
  };
}

export const viewport: Viewport = {
  themeColor: "#eef0ec",
  colorScheme: "light",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [region, messages] = await Promise.all([getRegion(), getMessages()]);
  return (
    <html lang={region.locale} dir={region.dir} className="scroll-pt-24" suppressHydrationWarning>
      <body
        className={`${bricolage.variable} ${jetbrains.variable} font-sans antialiased`}
      >
        <NextIntlClientProvider locale={region.lang} messages={messages} timeZone="UTC">
          <LocaleProvider initialRegion={region.code}>
            <ToastProvider>{children}</ToastProvider>
            <MonitoringInit config={{ ...env.monitoring, release: serverRelease() }} />
          </LocaleProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
