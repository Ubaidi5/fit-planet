import Hero from "@/components/sections/Hero";
import Features from "@/components/sections/Features";
import HowItWorks from "@/components/sections/HowItWorks";
import ForGymOwners from "@/components/sections/ForGymOwners";
import CTA from "@/components/sections/CTA";

export default function Home() {
  return (
    <main>
      <Hero />
      <Features />
      <HowItWorks />
      <ForGymOwners />
      <CTA />
    </main>
  );
}
