import Hero from "@/components/sections/Hero";
import PartnerMarquee from "@/components/sections/PartnerMarquee";
import TwoSides from "@/components/sections/TwoSides";
import Features from "@/components/sections/Features";
import HowItWorks from "@/components/sections/HowItWorks";
import ForGymOwners from "@/components/sections/ForGymOwners";
import Testimonials from "@/components/sections/Testimonials";
import CTA from "@/components/sections/CTA";

export default function Home() {
  return (
    <main>
      <Hero />
      <PartnerMarquee />
      <TwoSides />
      <Features />
      <HowItWorks />
      <ForGymOwners />
      <Testimonials />
      <CTA />
    </main>
  );
}
