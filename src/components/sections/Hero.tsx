import Link from "next/link";
import {
  HiOutlineCheckCircle,
  HiOutlineLocationMarker,
  HiOutlineSearch,
  HiOutlineArrowRight,
} from "react-icons/hi";

const Hero: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-linear-to-br from-emerald-50 via-white to-teal-50">
      <div className="container mx-auto px-4 py-20 sm:py-28 lg:py-32">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-1.5 text-sm font-medium text-emerald-700">
            <HiOutlineCheckCircle className="h-4 w-4" />
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
                <HiOutlineLocationMarker className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
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
                <HiOutlineSearch className="h-5 w-5" />
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
              <HiOutlineArrowRight className="h-4 w-4" />
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
