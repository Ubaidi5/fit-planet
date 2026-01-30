"use client";

import { AddOn } from "@/lib/data/mock-gym-details";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface AddOnsSectionProps {
  addOns: AddOn[];
  onSelectAddOn?: (addOn: AddOn) => void;
}

export function AddOnsSection({ addOns, onSelectAddOn }: AddOnsSectionProps) {
  if (!addOns || addOns.length === 0) {
    return null;
  }

  const getCategoryIcon = (category: AddOn["category"]) => {
    switch (category) {
      case "Equipment":
        return (
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
            />
          </svg>
        );
      case "Service":
        return (
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
        );
      case "Access":
        return (
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
        );
    }
  };

  const getCategoryColor = (category: AddOn["category"]) => {
    switch (category) {
      case "Equipment":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "Service":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "Access":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-6">
        <svg
          className="h-6 w-6 text-emerald-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          />
        </svg>
        <h2 className="text-xl font-semibold text-gray-900">
          Additional Services & Add-Ons
        </h2>
      </div>

      <p className="text-gray-600 text-sm mb-6">
        Enhance your gym experience with these optional add-ons. Available for
        booking along with your gym pass.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {addOns.map((addOn) => (
          <div
            key={addOn.id}
            className={cn(
              "relative p-4 rounded-lg border-2 transition-all",
              addOn.isAvailable
                ? "border-gray-200 hover:border-emerald-300 hover:shadow-md bg-white"
                : "border-gray-100 bg-gray-50 opacity-60",
            )}
          >
            {/* Category Badge */}
            <div className="flex items-center justify-between mb-3">
              <div
                className={cn(
                  "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border",
                  getCategoryColor(addOn.category),
                )}
              >
                {getCategoryIcon(addOn.category)}
                <span>{addOn.category}</span>
              </div>
              {!addOn.isAvailable && (
                <Badge variant="danger" size="sm">
                  Unavailable
                </Badge>
              )}
            </div>

            {/* Add-On Info */}
            <div className="mb-3">
              <h3 className="font-semibold text-gray-900 text-lg mb-1">
                {addOn.name}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {addOn.description}
              </p>
            </div>

            {/* Limitations */}
            {addOn.limitations && (
              <div className="mb-3 p-2 bg-amber-50 border border-amber-200 rounded text-xs text-amber-800">
                <div className="flex items-start gap-1.5">
                  <svg
                    className="h-3.5 w-3.5 mt-0.5 shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>{addOn.limitations}</span>
                </div>
              </div>
            )}

            {/* Price & Action */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <div>
                <span className="text-2xl font-bold text-gray-900">
                  Rs. {addOn.price.toLocaleString()}
                </span>
                <span className="text-sm text-gray-500 ml-1">per use</span>
              </div>
              {onSelectAddOn && addOn.isAvailable && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onSelectAddOn(addOn)}
                >
                  Add
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Info Footer */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start gap-3">
          <svg
            className="h-5 w-5 text-blue-600 mt-0.5 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div className="flex-1">
            <p className="text-sm font-medium text-blue-900 mb-1">
              How to add these services:
            </p>
            <p className="text-sm text-blue-800">
              Select your add-ons when booking a gym pass. You can add them
              during checkout or request them at the gym reception upon arrival.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
