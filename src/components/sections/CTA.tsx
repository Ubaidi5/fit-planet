import Link from "next/link";

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
                <svg
                  className="h-5 w-5 text-emerald-200"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
                  />
                </svg>
                <span className="text-sm text-emerald-100">
                  Secure Payments
                </span>
              </div>
              <div className="flex items-center gap-2">
                <svg
                  className="h-5 w-5 text-emerald-200"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                  />
                </svg>
                <span className="text-sm text-emerald-100">
                  4.8 Star Rating
                </span>
              </div>
              <div className="flex items-center gap-2">
                <svg
                  className="h-5 w-5 text-emerald-200"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
                  />
                </svg>
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
