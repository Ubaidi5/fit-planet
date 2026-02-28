"use client";

import { AddOn } from "@/lib/data/mock-gym-details";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import {
  HiOutlineBeaker,
  HiOutlineLightningBolt,
  HiOutlineUserGroup,
  HiOutlinePlus,
  HiOutlineInformationCircle,
} from "react-icons/hi";

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
        return <HiOutlineBeaker className="h-5 w-5" />;
      case "Service":
        return <HiOutlineLightningBolt className="h-5 w-5" />;
      case "Access":
        return <HiOutlineUserGroup className="h-5 w-5" />;
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
        <HiOutlinePlus className="h-6 w-6 text-emerald-600" />
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
                  <HiOutlineInformationCircle className="h-3.5 w-3.5 mt-0.5 shrink-0" />
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
          <HiOutlineInformationCircle className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
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
