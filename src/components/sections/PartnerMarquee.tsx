import { mockGyms } from "@/lib/data/mock-gyms";

function monogram(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((word) => word[0])
    .join("");
}

export default function PartnerMarquee() {
  const row = [...mockGyms, ...mockGyms];

  return (
    <section aria-label="Partner gyms" className="border-y border-gray-900/[0.06] bg-surface/60 py-7">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-4 sm:px-6 lg:flex-row lg:gap-10 lg:px-8">
        <p className="shrink-0 text-center text-[13px] font-medium text-gray-500 lg:max-w-40 lg:text-left">
          Pilot partner gyms across Karachi
        </p>
        <div className="relative w-full overflow-hidden mask-fade-x">
          <div className="flex w-max animate-marquee gap-10 hover:[animation-play-state:paused]">
            {row.map((gym, index) => (
              <div
                key={`${gym.id}-${index}`}
                className="flex shrink-0 items-center gap-3 text-gray-500"
                aria-hidden={index >= mockGyms.length}
              >
                <span className="flex size-9 items-center justify-center rounded-xl border border-gray-900/[0.08] bg-canvas text-xs font-bold tracking-tight text-gray-700">
                  {monogram(gym.name)}
                </span>
                <span className="text-[15px] font-semibold tracking-tight whitespace-nowrap text-gray-700">
                  {gym.name}
                </span>
                <span className="text-[13px] whitespace-nowrap text-gray-400">
                  {gym.address.area}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
