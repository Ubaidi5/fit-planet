import Link from "next/link";
import {
  HiOutlineArrowRight,
  HiOutlineShieldCheck,
  HiOutlineStar,
  HiOutlineUserGroup,
} from "react-icons/hi";

const CTA: React.FC = () => {
  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="container mx-auto px-4">
        <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-emerald-600 to-teal-700 px-6 py-16 sm:px-12 sm:py-20 lg:px-20">
          {/* Background Pattern */}
          <div className="absolute inset-0 -z-10 opacity-30">
            <svg
              className="absolute left-0 top-0 h-full w-full"
              viewBox="0 0 1024 1024"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="512" cy="512" r="512" fill="url(#cta-gradient)" />
              <defs>
                <radialGradient
                  id="cta-gradient"
                  cx="0"
                  cy="0"
                  r="1"
                  gradientUnits="userSpaceOnUse"
                  gradientTransform="translate(512 512) rotate(90) scale(512)"
                >
                  <stop stopColor="white" />
                  <stop offset="1" stopColor="white" stopOpacity="0" />
                </radialGradient>
              </defs>
            </svg>
          </div>

          {/* Content */}
          <div className="relative mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Ready to Transform Your Fitness Journey?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg text-emerald-100">
              Join thousands of fitness enthusiasts who've discovered a smarter
              way to find and book gyms. No cards, no hassle — just show up and
              work out.
            </p>

            {/* CTA Buttons */}
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/gyms"
                className="inline-flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-white px-8 text-base font-semibold text-emerald-700 shadow-lg transition-all hover:bg-gray-50 hover:shadow-xl sm:w-auto"
              >
                Find Gyms Near You
                <HiOutlineArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/app/dashboard"
                className="inline-flex h-14 w-full items-center justify-center gap-2 rounded-xl border-2 border-white/30 px-8 text-base font-semibold text-white transition-all hover:bg-white/10 sm:w-auto"
              >
                Create Free Account
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="mt-12 flex flex-col items-center justify-center gap-6 sm:flex-row sm:gap-12">
              <div className="flex items-center gap-2">
                <HiOutlineShieldCheck className="h-5 w-5 text-emerald-200" />
                <span className="text-sm text-emerald-100">
                  Secure Payments
                </span>
              </div>
              <div className="flex items-center gap-2">
                <HiOutlineStar className="h-5 w-5 text-emerald-200" />
                <span className="text-sm text-emerald-100">
                  4.8 Star Rating
                </span>
              </div>
              <div className="flex items-center gap-2">
                <HiOutlineUserGroup className="h-5 w-5 text-emerald-200" />
                <span className="text-sm text-emerald-100">50K+ Users</span>
              </div>
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
          <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-teal-500/30 blur-3xl"></div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
