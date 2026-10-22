import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { HiStar, HiOutlineCheck } from "react-icons/hi";

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
  onSelectPlan?: (planType: string) => void;
}

export function PricingCard({
  dayPass,
  weekPass,
  monthPass,
  annualPass,
  specialPackages,
  className,
  onSelectPlan,
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
                <span className="text-3xl font-semibold text-ink tracking-tight">
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
                    <HiOutlineCheck className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
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
              onClick={() =>
                onSelectPlan?.(plan.name.toLowerCase().replace(" pass", ""))
              }
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
                  <HiStar className="h-5 w-5 text-amber-500" />
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
                      <HiOutlineCheck className="h-4 w-4 text-amber-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button
                  variant="outline"
                  className="w-full mt-4 border-amber-400 text-amber-700 hover:bg-amber-100"
                  onClick={() => onSelectPlan?.("month")}
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
