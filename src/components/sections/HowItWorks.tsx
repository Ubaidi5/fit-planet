const steps = [
  {
    step: "01",
    title: "Search for Gyms",
    description:
      "Enter your location or allow GPS access to discover gyms near you. Filter by price, amenities, ratings, and more.",
    image: (
      <div className="flex items-center justify-center h-48 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-xl">
        <svg
          className="h-20 w-20 text-emerald-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
          />
        </svg>
      </div>
    ),
  },
  {
    step: "02",
    title: "Choose Your Pass",
    description:
      "Select from day passes, week passes, or monthly memberships. Compare prices, check availability, and pick what suits you best.",
    image: (
      <div className="flex items-center justify-center h-48 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-xl">
        <svg
          className="h-20 w-20 text-emerald-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z"
          />
        </svg>
      </div>
    ),
  },
  {
    step: "03",
    title: "Book & Pay Online",
    description:
      "Complete your booking in seconds with secure online payment. No waiting, no queues — just instant confirmation.",
    image: (
      <div className="flex items-center justify-center h-48 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-xl">
        <svg
          className="h-20 w-20 text-emerald-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z"
          />
        </svg>
      </div>
    ),
  },
  {
    step: "04",
    title: "Show QR & Work Out",
    description:
      "Get your digital pass with a unique QR code. Just show it at the gym entrance, scan, and start your workout!",
    image: (
      <div className="flex items-center justify-center h-48 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-xl">
        <svg
          className="h-20 w-20 text-emerald-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
    ),
  },
];

const HowItWorks: React.FC = () => {
  return (
    <section id="how-it-works" className="bg-gray-50 py-20 lg:py-28">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-block rounded-full bg-emerald-100 px-4 py-1.5 text-sm font-medium text-emerald-700">
            Simple Process
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            How It Works
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Getting started with Fit Planet is easy. Just four simple steps to
            your perfect workout.
          </p>
        </div>

        {/* Steps */}
        <div className="mx-auto mt-16 max-w-6xl">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                {/* Connector Line (hidden on mobile) */}
                {index < steps.length - 1 && (
                  <div className="absolute left-1/2 top-24 hidden h-0.5 w-full bg-emerald-200 lg:block" />
                )}

                <div className="relative rounded-2xl bg-white p-6 shadow-sm">
                  {/* Step Number */}
                  <div className="absolute -top-4 left-6 flex h-8 w-12 items-center justify-center rounded-full bg-emerald-600 text-sm font-bold text-white">
                    {step.step}
                  </div>

                  {/* Image/Icon Area */}
                  <div className="mt-4">{step.image}</div>

                  {/* Content */}
                  <h3 className="mt-6 text-lg font-semibold text-gray-900">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <p className="text-lg text-gray-600">
            Ready to find your perfect gym?
          </p>
          <a
            href="/gyms"
            className="mt-4 inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-8 text-base font-semibold text-white shadow-sm transition-all hover:bg-emerald-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
          >
            Get Started Now
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
              />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
