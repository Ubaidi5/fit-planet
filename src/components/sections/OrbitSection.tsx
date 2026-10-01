import { OrbitExplorer } from "@/components/orbit/OrbitExplorer";
import { mockGyms } from "@/lib/data/mock-gyms";
import { Accent, SectionHeading } from "./SectionHeading";

export default function OrbitSection() {
  return (
    <section id="orbit" className="relative scroll-mt-24 overflow-hidden py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Orbit · explore nearby"
          title={
            <>
              Gyms around you, <Accent>not in a list</Accent>
            </>
          }
          description="Closer gyms sit nearer the centre. Each ring fills with how busy it is right now, so the quiet one is easy to spot."
        />
        <div className="mt-12 sm:mt-14">
          <OrbitExplorer gyms={mockGyms} initialCity="Karachi" />
        </div>
      </div>
    </section>
  );
}
