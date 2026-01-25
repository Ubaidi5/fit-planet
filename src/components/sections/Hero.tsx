import Link from "next/link";

const Hero: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-linear-to-br from-emerald-50 via-white to-teal-50">
      <div className="container mx-auto px-4 py-20 sm:py-28 lg:py-32">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-1.5 text-sm font-medium text-emerald-700">
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>No membership cards needed</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
            Find Your Perfect Gym,
            <span className="block text-emerald-600">Book Instantly</span>
          </h1>

          {/* Description */}
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600 sm:text-xl">
            Discover gyms near you, compare plans, and book day passes or
            memberships with just your phone. No physical cards, no paperwork —
            just show up and work out.
          </p>

          {/* Search Bar */}
          <div className="mx-auto mt-10 max-w-xl">
            <form className="flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <svg
                  className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="Enter your location or area..."
                  className="h-14 w-full rounded-xl border border-gray-300 bg-white pl-12 pr-4 text-gray-900 placeholder-gray-500 shadow-sm transition-colors focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>
              <Link
                href="/gyms"
                className="inline-flex h-14 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-8 text-base font-semibold text-white shadow-sm transition-all hover:bg-emerald-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
              >
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
                    d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                  />
                </svg>
                Find Gyms
              </Link>
            </form>
            <p className="mt-3 text-sm text-gray-500">
              Popular: Karachi, Lahore, Islamabad, Peshawar, Quetta
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/gyms"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-gray-900 px-6 text-sm font-medium text-white shadow-sm transition-colors hover:bg-gray-800"
            >
              Browse All Gyms
              <svg
                className="h-4 w-4"
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
            </Link>
            <Link
              href="/studio/register"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-6 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
            >
              Register Your Gym
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 gap-8 sm:grid-cols-4">
            <div>
              <p className="text-3xl font-bold text-emerald-600">500+</p>
              <p className="mt-1 text-sm text-gray-600">Partner Gyms</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-emerald-600">50K+</p>
              <p className="mt-1 text-sm text-gray-600">Active Users</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-emerald-600">100K+</p>
              <p className="mt-1 text-sm text-gray-600">Bookings Made</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-emerald-600">4.8</p>
              <p className="mt-1 text-sm text-gray-600">Average Rating</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
