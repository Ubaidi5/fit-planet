import { getTranslations } from "next-intl/server";
import { OrbitExplorer } from "@/components/orbit/OrbitExplorer";
import { mockGyms } from "@/lib/data/mock-gyms";
import { Accent, SectionHeading } from "./SectionHeading";

export default async function OrbitSection() {
  const t = await getTranslations("orbit");
  return (
    <section id="orbit" className="relative scroll-mt-24 overflow-hidden py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow={t("eyebrow")}
          title={t.rich("title", { accent: (c) => <Accent>{c}</Accent> })}
          description={t("lead")}
        />
        <div className="mt-12 sm:mt-14">
          <OrbitExplorer gyms={mockGyms} initialCity="Karachi" />
        </div>
      </div>
    </section>
  );
}
