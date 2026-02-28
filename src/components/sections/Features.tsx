import {
  HiOutlineLocationMarker,
  HiOutlineCalendar,
  HiOutlineQrcode,
  HiOutlineUserGroup,
  HiOutlineClipboardList,
  HiOutlineShare,
} from "react-icons/hi";

const features = [
  {
    title: "Discover Gyms Near You",
    description:
      "Find the perfect gym based on location, price, amenities, and real-time availability. No more guessing if a gym fits your needs.",
    icon: <HiOutlineLocationMarker className="h-6 w-6" />,
  },
  {
    title: "Instant Booking",
    description:
      "Book day passes, week passes, or monthly memberships instantly. No waiting, no paperwork — just quick and easy online booking.",
    icon: <HiOutlineCalendar className="h-6 w-6" />,
  },
  {
    title: "Digital Pass & QR Entry",
    description:
      "Your phone is your gym pass. Get a unique QR code after booking and simply scan it at the gym entrance — no physical cards needed.",
    icon: <HiOutlineQrcode className="h-6 w-6" />,
  },
  {
    title: "Real-Time Capacity",
    description:
      "See how busy a gym is before you go. Check real-time occupancy and avoid overcrowded workout sessions.",
    icon: <HiOutlineUserGroup className="h-6 w-6" />,
  },
  {
    title: "Workout Routines",
    description:
      "Create and manage your workout routines. Track your progress, log exercises, and stay consistent with your fitness goals.",
    icon: <HiOutlineClipboardList className="h-6 w-6" />,
  },
  {
    title: "Social & Community",
    description:
      "Share your routines with friends, coordinate gym visits together, and stay motivated with social accountability.",
    icon: <HiOutlineShare className="h-6 w-6" />,
  },
];

const Features: React.FC = () => {
  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Everything You Need for Your Fitness Journey
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            From discovering gyms to tracking your progress, we've got all the
            tools to make your fitness journey seamless and enjoyable.
          </p>
        </div>

        {/* Features Grid */}
        <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative rounded-2xl border border-gray-200 bg-white p-8 transition-all hover:border-emerald-200 hover:shadow-lg"
            >
              {/* Icon */}
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 transition-colors group-hover:bg-emerald-600 group-hover:text-white">
                {feature.icon}
              </div>

              {/* Content */}
              <h3 className="mt-6 text-lg font-semibold text-gray-900">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
