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

export default function Home() {
  return (
    <main>
      <Hero />
      <Departures />
      <OrbitSection />
      <PassportSection />
      <PulseSection />
      <TwoSides />
      <HowItWorks />
      <ForGymOwners />
      <Testimonials />
      <CTA />
    </main>
  );
}
