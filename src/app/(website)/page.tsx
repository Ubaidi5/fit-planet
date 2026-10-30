import Hero from "@/components/sections/Hero";
import Departures from "@/components/sections/Departures";
import OrbitSection from "@/components/sections/OrbitSection";
import PassportSection from "@/components/sections/PassportSection";
import PulseSection from "@/components/sections/PulseSection";
import TwoSides from "@/components/sections/TwoSides";
import HowItWorks from "@/components/sections/HowItWorks";
import ForGymOwners from "@/components/sections/ForGymOwners";
import Testimonials from "@/components/sections/Testimonials";
import CTA from "@/components/sections/CTA";
import { getRegion } from "@/lib/i18n/server";
import { SectionBoundary } from "@/components/ui/SectionBoundary";
import { localFirst, memberStories, platformSnapshot, regionCountry } from "@/server/modules/platform";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [{ gyms, stats }, region] = await Promise.all([platformSnapshot(), getRegion()]);
  const country = regionCountry(region.code);
  const local = localFirst(gyms, country);
  const cities = localFirst(
    stats.cities.map((city) => ({ city, country: gyms.find((g) => g.address.city === city)!.country })),
    country,
  ).map((c) => c.city);
  const stories = await memberStories(gyms);

  return (
    <main>
      <Hero stats={stats} cities={cities} gyms={local} />
      {/* The interactive sections hide themselves if they crash, so the page still reads top to bottom */}
      <SectionBoundary name="home:departures" fallback={null}>
        <Departures gyms={gyms} cities={cities} />
      </SectionBoundary>
      <SectionBoundary name="home:orbit" fallback={null}>
        <OrbitSection gyms={gyms} initialCity={cities[0]} />
      </SectionBoundary>
      <PassportSection />
      <SectionBoundary name="home:pulse" fallback={null}>
        <PulseSection gyms={local} />
      </SectionBoundary>
      <TwoSides />
      <HowItWorks stats={stats} />
      <ForGymOwners />
      <SectionBoundary name="home:stories" fallback={null}>
        <Testimonials stories={stories} />
      </SectionBoundary>
      <CTA />
    </main>
  );
}
