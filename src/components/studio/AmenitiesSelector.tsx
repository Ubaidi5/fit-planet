"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { Input } from "../ui/Input";
import Select from "../ui/Select";
import { HiOutlineTrash } from "react-icons/hi";

interface Amenity {
  id: string;
  name: string;
  icon: string;
  category: "facilities" | "equipment" | "services";
}

interface EquipmentItem {
  id: string;
  name: string;
  quantity: number;
  category: string;
}

const AVAILABLE_AMENITIES: Amenity[] = [
  // Facilities
  { id: "parking", name: "Parking", icon: "🅿️", category: "facilities" },
  { id: "lockers", name: "Lockers", icon: "🔒", category: "facilities" },
  { id: "showers", name: "Showers", icon: "🚿", category: "facilities" },
  { id: "sauna", name: "Sauna", icon: "♨️", category: "facilities" },
  { id: "pool", name: "Swimming Pool", icon: "🏊", category: "facilities" },
  { id: "wifi", name: "WiFi", icon: "📶", category: "facilities" },
  { id: "ac", name: "Air Conditioning", icon: "❄️", category: "facilities" },
  { id: "cafe", name: "Café", icon: "☕", category: "facilities" },
  {
    id: "juice-bar",
    name: "Juice Bar",
    icon: "🥤",
    category: "facilities",
  },
  {
    id: "pro-shop",
    name: "Pro Shop",
    icon: "🛍️",
    category: "facilities",
  },

  // Equipment
  {
    id: "cardio",
    name: "Cardio Equipment",
    icon: "🏃",
    category: "equipment",
  },
  {
    id: "strength",
    name: "Strength Equipment",
    icon: "💪",
    category: "equipment",
  },
  {
    id: "free-weights",
    name: "Free Weights",
    icon: "🏋️",
    category: "equipment",
  },
  {
    id: "functional",
    name: "Functional Training",
    icon: "⚡",
    category: "equipment",
  },
  {
    id: "boxing",
    name: "Boxing Equipment",
    icon: "🥊",
    category: "equipment",
  },
  { id: "yoga", name: "Yoga Studio", icon: "🧘", category: "equipment" },
  { id: "crossfit", name: "CrossFit Area", icon: "🏅", category: "equipment" },

  // Services
  {
    id: "personal-training",
    name: "Personal Training",
    icon: "👨‍🏫",
    category: "services",
  },
  {
    id: "group-classes",
    name: "Group Classes",
    icon: "👥",
    category: "services",
  },
  {
    id: "nutrition",
    name: "Nutrition Counseling",
    icon: "🥗",
    category: "services",
  },
  {
    id: "physiotherapy",
    name: "Physiotherapy",
    icon: "🩺",
    category: "services",
  },
  { id: "massage", name: "Massage Therapy", icon: "💆", category: "services" },
  { id: "24-7", name: "24/7 Access", icon: "🕐", category: "services" },
];

const EQUIPMENT_CATEGORIES = [
  "Cardio Machines",
  "Strength Machines",
  "Free Weights",
  "Functional Equipment",
  "Other",
];

export default function AmenitiesSelector() {
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [equipmentList, setEquipmentList] = useState<EquipmentItem[]>([]);
  const [showEquipmentForm, setShowEquipmentForm] = useState(false);
  const [newEquipment, setNewEquipment] = useState({
    name: "",
    quantity: 1,
    category: "Cardio Machines",
  });

  const toggleAmenity = (amenityId: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenityId)
        ? prev.filter((id) => id !== amenityId)
        : [...prev, amenityId],
    );
  };

  const handleAddEquipment = () => {
    if (!newEquipment.name.trim()) return;

    setEquipmentList((prev) => [
      ...prev,
      {
        id: `eq-${Date.now()}`,
        name: newEquipment.name,
        quantity: newEquipment.quantity,
        category: newEquipment.category,
      },
    ]);

    setNewEquipment({
      name: "",
      quantity: 1,
      category: "Cardio Machines",
    });
    setShowEquipmentForm(false);
  };

  const handleDeleteEquipment = (id: string) => {
    setEquipmentList((prev) => prev.filter((item) => item.id !== id));
  };

  const groupedAmenities = {
    facilities: AVAILABLE_AMENITIES.filter((a) => a.category === "facilities"),
    equipment: AVAILABLE_AMENITIES.filter((a) => a.category === "equipment"),
    services: AVAILABLE_AMENITIES.filter((a) => a.category === "services"),
  };

  return (
    <div className="space-y-8 p-6">
      {/* Amenities Selection */}
      <div>
        <h2 className="mb-4 text-xl font-semibold text-gray-900">
          Select Amenities
        </h2>
        <p className="mb-6 text-sm text-gray-600">
          Choose all amenities available at your gym. This helps users find gyms
          with specific features they need.
        </p>

        {/* Facilities */}
        <div className="mb-6">
          <h3 className="mb-3 text-lg font-medium text-gray-800">
            🏢 Facilities
          </h3>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {groupedAmenities.facilities.map((amenity) => (
              <button
                key={amenity.id}
                type="button"
                onClick={() => toggleAmenity(amenity.id)}
                className={cn(
                  "flex items-center space-x-2 rounded-lg border-2 p-3 text-start transition-all",
                  selectedAmenities.includes(amenity.id)
                    ? "border-emerald-500 bg-emerald-50 text-emerald-900"
                    : "border-gray-200 bg-white text-gray-700 hover:border-gray-300",
                )}
              >
                <span className="text-2xl">{amenity.icon}</span>
                <span className="text-sm font-medium">{amenity.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Equipment */}
        <div className="mb-6">
          <h3 className="mb-3 text-lg font-medium text-gray-800">
            🏋️ Equipment Types
          </h3>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {groupedAmenities.equipment.map((amenity) => (
              <button
                key={amenity.id}
                type="button"
                onClick={() => toggleAmenity(amenity.id)}
                className={cn(
                  "flex items-center space-x-2 rounded-lg border-2 p-3 text-start transition-all",
                  selectedAmenities.includes(amenity.id)
                    ? "border-emerald-500 bg-emerald-50 text-emerald-900"
                    : "border-gray-200 bg-white text-gray-700 hover:border-gray-300",
                )}
              >
                <span className="text-2xl">{amenity.icon}</span>
                <span className="text-sm font-medium">{amenity.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Services */}
        <div>
          <h3 className="mb-3 text-lg font-medium text-gray-800">
            💼 Services
          </h3>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {groupedAmenities.services.map((amenity) => (
              <button
                key={amenity.id}
                type="button"
                onClick={() => toggleAmenity(amenity.id)}
                className={cn(
                  "flex items-center space-x-2 rounded-lg border-2 p-3 text-start transition-all",
                  selectedAmenities.includes(amenity.id)
                    ? "border-emerald-500 bg-emerald-50 text-emerald-900"
                    : "border-gray-200 bg-white text-gray-700 hover:border-gray-300",
                )}
              >
                <span className="text-2xl">{amenity.icon}</span>
                <span className="text-sm font-medium">{amenity.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Equipment Inventory */}
      <div className="border-t border-gray-200 pt-8">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Equipment Inventory
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              List specific equipment with quantities (optional but recommended)
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowEquipmentForm(!showEquipmentForm)}
          >
            {showEquipmentForm ? "Cancel" : "+ Add Equipment"}
          </Button>
        </div>

        {/* Add Equipment Form */}
        {showEquipmentForm && (
          <div className="mb-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="sm:col-span-2">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Equipment Name
                </label>
                <Input
                  type="text"
                  placeholder="e.g., Treadmill, Bench Press"
                  value={newEquipment.name}
                  onChange={(e) =>
                    setNewEquipment((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Quantity
                </label>
                <Input
                  type="number"
                  min="1"
                  value={newEquipment.quantity}
                  onChange={(e) =>
                    setNewEquipment((prev) => ({
                      ...prev,
                      quantity: parseInt(e.target.value) || 1,
                    }))
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Category
                </label>
                <Select
                  value={newEquipment.category}
                  onChange={(e) =>
                    setNewEquipment((prev) => ({
                      ...prev,
                      category: e.target.value,
                    }))
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  {EQUIPMENT_CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </Select>
              </div>

              <div className="flex items-end">
                <Button
                  type="button"
                  onClick={handleAddEquipment}
                  className="w-full"
                >
                  Add
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Equipment List */}
        {equipmentList.length > 0 && (
          <div className="space-y-2">
            {EQUIPMENT_CATEGORIES.map((category) => {
              const items = equipmentList.filter(
                (item) => item.category === category,
              );
              if (items.length === 0) return null;

              return (
                <div key={category} className="mb-4">
                  <h4 className="mb-2 text-sm font-semibold text-gray-700">
                    {category}
                  </h4>
                  <div className="space-y-2">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-3"
                      >
                        <div>
                          <p className="font-medium text-gray-900">
                            {item.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            Quantity: {item.quantity}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDeleteEquipment(item.id)}
                          className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                        >
                          <HiOutlineTrash className="h-5 w-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {equipmentList.length === 0 && !showEquipmentForm && (
          <div className="rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-8 text-center">
            <p className="text-gray-600">
              No equipment added yet. Click &quot;Add Equipment&quot; to start.
            </p>
          </div>
        )}
      </div>

      {/* Save Button */}
      <div className="flex justify-end space-x-4 border-t border-gray-200 pt-6">
        <Button variant="outline" type="button">
          Cancel
        </Button>
        <Button type="button">Save Amenities</Button>
      </div>
    </div>
  );
}
