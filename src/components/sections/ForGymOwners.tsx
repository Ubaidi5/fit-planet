import Link from "next/link";

const benefits = [
  {
    title: "No Software Hassle",
    description:
      "Get a professional online presence without building your own website or app. We handle all the tech.",
    icon: (
      <svg
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25"
        />
      </svg>
    ),
  },
  {
    title: "Manage Capacity",
    description:
      "Set your gym's capacity limits and prevent overcrowding. Members see real-time availability before booking.",
    icon: (
      <svg
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605"
        />
      </svg>
    ),
  },
  {
    title: "Flexible Pricing",
    description:
      "Create day passes, week passes, monthly memberships, and custom packages with your own pricing.",
    icon: (
      <svg
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
  {
    title: "Easy Check-Ins",
    description:
      "Scan member QR codes for instant verification. No more manual registers or identity checks at the door.",
    icon: (
      <svg
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z"
        />
      </svg>
    ),
  },
  {
    title: "Analytics Dashboard",
    description:
      "Track bookings, revenue, peak hours, and member insights with our comprehensive analytics tools.",
    icon: (
      <svg
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z"
        />
      </svg>
    ),
  },
  {
    title: "Run Promotions",
    description:
      "Create discount codes, seasonal offers, and referral programs to attract and retain more members.",
    icon: (
      <svg
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6 6h.008v.008H6V6z"
        />
      </svg>
    ),
  },
];

const ForGymOwners: React.FC = () => {
  return (
    <section id="for-owners" className="bg-gray-900 py-20 lg:py-28">
      <div className="container mx-auto px-4">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          {/* Left Content */}
          <div>
            <span className="inline-block rounded-full bg-emerald-900/50 px-4 py-1.5 text-sm font-medium text-emerald-400">
              For Gym Owners
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Manage Your Gym Business{" "}
              <span className="text-emerald-400">Without the Hassle</span>
            </h2>
            <p className="mt-4 text-lg text-gray-300">
              Most gyms don't have websites or management software. Fit Planet
              gives you a complete platform to manage operations, reach more
              customers, and grow your business — all in one place.
            </p>

            {/* Benefits Grid */}
            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-600/20 text-emerald-400">
                    {benefit.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">
                      {benefit.title}
                    </h3>
                    <p className="mt-1 text-sm text-gray-400">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/studio/register"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-6 text-base font-semibold text-white shadow-sm transition-all hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-gray-900"
              >
                Register Your Gym
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
                href="/studio-features"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-gray-700 px-6 text-base font-semibold text-white transition-colors hover:bg-gray-800"
              >
                Learn More
              </Link>
            </div>
          </div>

          {/* Right Side - Dashboard Preview */}
          <div className="relative">
            <div className="rounded-2xl bg-gray-800 p-6 shadow-2xl ring-1 ring-gray-700">
              {/* Mock Dashboard Header */}
              <div className="flex items-center justify-between border-b border-gray-700 pb-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-emerald-600 flex items-center justify-center">
                    <span className="text-white font-bold">FP</span>
                  </div>
                  <div>
                    <p className="font-semibold text-white">Fitness Hub</p>
                    <p className="text-xs text-gray-400">Studio Dashboard</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="flex h-2 w-2 rounded-full bg-emerald-500"></span>
                  <span className="text-xs text-emerald-400">Online</span>
                </div>
              </div>

              {/* Mock Stats */}
              <div className="mt-6 grid grid-cols-3 gap-4">
                <div className="rounded-lg bg-gray-900/50 p-4">
                  <p className="text-2xl font-bold text-white">42</p>
                  <p className="text-xs text-gray-400">Today's Check-ins</p>
                </div>
                <div className="rounded-lg bg-gray-900/50 p-4">
                  <p className="text-2xl font-bold text-emerald-400">Rs. 45K</p>
                  <p className="text-xs text-gray-400">Today's Revenue</p>
                </div>
                <div className="rounded-lg bg-gray-900/50 p-4">
                  <p className="text-2xl font-bold text-white">32/50</p>
                  <p className="text-xs text-gray-400">Current Capacity</p>
                </div>
              </div>

              {/* Mock Chart Area */}
              <div className="mt-6 rounded-lg bg-gray-900/50 p-4">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm font-medium text-white">
                    Weekly Bookings
                  </p>
                  <span className="text-xs text-emerald-400">+12%</span>
                </div>
                {/* Simple Bar Chart Mock */}
                <div className="flex items-end gap-2 h-24">
                  <div
                    className="flex-1 bg-emerald-600/30 rounded-t"
                    style={{ height: "40%" }}
                  ></div>
                  <div
                    className="flex-1 bg-emerald-600/30 rounded-t"
                    style={{ height: "60%" }}
                  ></div>
                  <div
                    className="flex-1 bg-emerald-600/30 rounded-t"
                    style={{ height: "45%" }}
                  ></div>
                  <div
                    className="flex-1 bg-emerald-600/30 rounded-t"
                    style={{ height: "80%" }}
                  ></div>
                  <div
                    className="flex-1 bg-emerald-600/30 rounded-t"
                    style={{ height: "70%" }}
                  ></div>
                  <div
                    className="flex-1 bg-emerald-600/30 rounded-t"
                    style={{ height: "90%" }}
                  ></div>
                  <div
                    className="flex-1 bg-emerald-600 rounded-t"
                    style={{ height: "100%" }}
                  ></div>
                </div>
                <div className="flex justify-between mt-2 text-xs text-gray-500">
                  <span>Mon</span>
                  <span>Tue</span>
                  <span>Wed</span>
                  <span>Thu</span>
                  <span>Fri</span>
                  <span>Sat</span>
                  <span>Sun</span>
                </div>
              </div>

              {/* Mock Recent Activity */}
              <div className="mt-6">
                <p className="text-sm font-medium text-white mb-3">
                  Recent Check-ins
                </p>
                <div className="space-y-2">
                  {[
                    { name: "Ahmed K.", time: "2 min ago", pass: "Day Pass" },
                    { name: "Sara M.", time: "5 min ago", pass: "Monthly" },
                    { name: "Ali R.", time: "12 min ago", pass: "Week Pass" },
                  ].map((checkin, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between rounded-lg bg-gray-900/30 p-2"
                    >
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-gray-700 flex items-center justify-center text-xs text-white">
                          {checkin.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm text-white">{checkin.name}</p>
                          <p className="text-xs text-gray-500">
                            {checkin.time}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded">
                        {checkin.pass}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -bottom-6 -right-6 h-72 w-72 rounded-full bg-emerald-600/20 blur-3xl -z-10"></div>
            <div className="absolute -top-6 -left-6 h-48 w-48 rounded-full bg-teal-600/20 blur-3xl -z-10"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ForGymOwners;
