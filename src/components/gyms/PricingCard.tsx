import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

interface PricingPlan {
  name: string;
  price: number;
  duration: string;
  popular?: boolean;
  features?: string[];
}

interface SpecialPackage {
  name: string;
  price: number;
  description: string;
  features: string[];
}

interface PricingCardProps {
  dayPass: number;
  weekPass: number;
  monthPass: number;
  annualPass?: number;
  specialPackages?: SpecialPackage[];
  className?: string;
}

export function PricingCard({
  dayPass,
  weekPass,
  monthPass,
  annualPass,
  specialPackages,
  className,
}: PricingCardProps) {
  const plans: PricingPlan[] = [
    {
      name: "Day Pass",
      price: dayPass,
      duration: "per day",
      features: ["Full gym access", "Use of all equipment", "Locker access"],
    },
    {
      name: "Week Pass",
      price: weekPass,
      duration: "7 days",
      features: [
        "Full gym access",
        "Use of all equipment",
        "Locker access",
        "1 group class included",
      ],
    },
    {
      name: "Monthly Pass",
      price: monthPass,
      duration: "30 days",
      popular: true,
      features: [
        "Full gym access",
        "Use of all equipment",
        "Locker access",
        "Unlimited group classes",
        "Free towel service",
      ],
    },
  ];

  if (annualPass) {
    plans.push({
      name: "Annual Pass",
      price: annualPass,
      duration: "12 months",
      features: [
        "Full gym access",
        "Use of all equipment",
        "Locker access",
        "Unlimited group classes",
        "Free towel service",
        "2 free PT sessions/month",
        "Guest passes (2/month)",
      ],
    });
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Standard Plans */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={cn(
              "relative rounded-xl border p-6 transition-all hover:shadow-lg",
              plan.popular
                ? "border-emerald-500 bg-emerald-50/50 ring-1 ring-emerald-500"
                : "border-gray-200 bg-white hover:border-emerald-300",
            )}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-emerald-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                  Most Popular
                </span>
              </div>
            )}

            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900">
                {plan.name}
              </h3>
              <div className="mt-3">
                <span className="text-3xl font-bold text-gray-900">
                  Rs. {plan.price.toLocaleString()}
                </span>
                <span className="text-gray-500 text-sm ml-1">
                  / {plan.duration}
                </span>
              </div>
            </div>

            {plan.features && (
              <ul className="mt-5 space-y-2.5">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <svg
                      className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-sm text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
            )}

            <Button
              className={cn(
                "w-full mt-6",
                plan.popular ? "" : "bg-gray-900 hover:bg-gray-800",
              )}
            >
              Select {plan.name}
            </Button>
          </div>
        ))}
      </div>

      {/* Special Packages */}
      {specialPackages && specialPackages.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Special Packages
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {specialPackages.map((pkg) => (
              <div
                key={pkg.name}
                className="rounded-xl border border-amber-200 bg-amber-50/50 p-5"
              >
                <div className="flex items-center gap-2 mb-2">
                  <svg
                    className="h-5 w-5 text-amber-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <h4 className="font-semibold text-gray-900">{pkg.name}</h4>
                </div>
                <p className="text-sm text-gray-600 mb-3">{pkg.description}</p>
                <div className="text-xl font-bold text-gray-900 mb-3">
                  Rs. {pkg.price.toLocaleString()}
                  <span className="text-sm font-normal text-gray-500">
                    {" "}
                    /month
                  </span>
                </div>
                <ul className="space-y-1.5">
                  {pkg.features.map((feature, index) => (
                    <li
                      key={index}
                      className="flex items-center gap-2 text-sm text-gray-600"
                    >
                      <svg
                        className="h-4 w-4 text-amber-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button
                  outline
                  className="w-full mt-4 border-amber-400 text-amber-700 hover:bg-amber-100"
                >
                  Get This Package
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
