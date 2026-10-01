"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";
import Select from "../ui/Select";
import Textarea from "../ui/Textarea";
import { HiOutlineTrash } from "react-icons/hi";

interface AddOn {
  id: string;
  name: string;
  description: string;
  price: number;
  category: "equipment" | "service" | "facility" | "other";
  icon: string;
  isActive: boolean;
  // Availability
  availableForPassTypes: "all" | "specific";
  passTypes?: string[];
  // Limits
  maxQuantity?: number;
  requiresBooking: boolean;
}

const ADDON_CATEGORIES = [
  { value: "equipment", label: "Equipment Rental", icon: "🏋️" },
  { value: "service", label: "Additional Service", icon: "💼" },
  { value: "facility", label: "Facility Access", icon: "🏢" },
  { value: "other", label: "Other", icon: "➕" },
];

const ICON_OPTIONS = [
  "🔒",
  "🧘",
  "🥤",
  "🎽",
  "🧤",
  "👟",
  "🎒",
  "🧴",
  "🔑",
  "🚿",
  "🏊",
  "🥊",
  "⚡",
  "🎯",
  "💪",
  "🏃",
];

export default function AddOnsManager() {
  const [addOns, setAddOns] = useState<AddOn[]>([
    {
      id: "1",
      name: "Locker Rental",
      description: "Secure locker for your belongings",
      price: 50,
      category: "facility",
      icon: "🔒",
      isActive: true,
      availableForPassTypes: "all",
      maxQuantity: 1,
      requiresBooking: false,
    },
    {
      id: "2",
      name: "Yoga Mat Rental",
      description: "High-quality yoga mat",
      price: 30,
      category: "equipment",
      icon: "🧘",
      isActive: true,
      availableForPassTypes: "all",
      maxQuantity: 1,
      requiresBooking: false,
    },
    {
      id: "3",
      name: "Protein Shake",
      description: "Post-workout protein shake",
      price: 200,
      category: "service",
      icon: "🥤",
      isActive: true,
      availableForPassTypes: "all",
      maxQuantity: 5,
      requiresBooking: false,
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingAddOn, setEditingAddOn] = useState<AddOn | null>(null);
  const [formData, setFormData] = useState<Omit<AddOn, "id">>({
    name: "",
    description: "",
    price: 0,
    category: "equipment",
    icon: "🔒",
    isActive: true,
    availableForPassTypes: "all",
    requiresBooking: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingAddOn) {
      setAddOns((prev) =>
        prev.map((addOn) =>
          addOn.id === editingAddOn.id ? { ...formData, id: addOn.id } : addOn,
        ),
      );
    } else {
      setAddOns((prev) => [
        ...prev,
        { ...formData, id: `addon-${Date.now()}` },
      ]);
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: 0,
      category: "equipment",
      icon: "🔒",
      isActive: true,
      availableForPassTypes: "all",
      requiresBooking: false,
    });
    setShowForm(false);
    setEditingAddOn(null);
  };

  const handleEdit = (addOn: AddOn) => {
    setEditingAddOn(addOn);
    setFormData({
      name: addOn.name,
      description: addOn.description,
      price: addOn.price,
      category: addOn.category,
      icon: addOn.icon,
      isActive: addOn.isActive,
      availableForPassTypes: addOn.availableForPassTypes,
      passTypes: addOn.passTypes,
      maxQuantity: addOn.maxQuantity,
      requiresBooking: addOn.requiresBooking,
    });
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this add-on?")) {
      setAddOns((prev) => prev.filter((addOn) => addOn.id !== id));
    }
  };

  const toggleActive = (id: string) => {
    setAddOns((prev) =>
      prev.map((addOn) =>
        addOn.id === id ? { ...addOn, isActive: !addOn.isActive } : addOn,
      ),
    );
  };

  const getCategoryInfo = (category: string) => {
    return (
      ADDON_CATEGORIES.find((c) => c.value === category) || ADDON_CATEGORIES[3]
    );
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Add-On Services & Products
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            Extra services or equipment that users can add to their passes
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => {
            setShowForm(!showForm);
            if (showForm) resetForm();
          }}
        >
          {showForm ? "Cancel" : "+ Add New"}
        </Button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="rounded-lg border border-gray-200 bg-gray-50 p-6"
        >
          <h3 className="mb-4 text-lg font-semibold text-gray-900">
            {editingAddOn ? "Edit Add-On" : "Create New Add-On"}
          </h3>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Name */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Name <span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="e.g., Towel Rental"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                required
              />
            </div>

            {/* Category */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Category <span className="text-red-500">*</span>
              </label>
              <Select
                value={formData.category}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    category: e.target.value as AddOn["category"],
                  }))
                }
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                required
              >
                {ADDON_CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.icon} {cat.label}
                  </option>
                ))}
              </Select>
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Description
              </label>
              <Textarea
                rows={2}
                placeholder="Brief description..."
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                // className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            {/* Price */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Price (Rs.) <span className="text-red-500">*</span>
              </label>
              <Input
                type="number"
                min="0"
                placeholder="e.g., 100"
                value={formData.price}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    price: parseInt(e.target.value) || 0,
                  }))
                }
                required
              />
            </div>

            {/* Max Quantity */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Max Quantity Per Purchase
              </label>
              <Input
                type="number"
                min="1"
                placeholder="e.g., 5 (leave empty for unlimited)"
                value={formData.maxQuantity || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    maxQuantity: parseInt(e.target.value) || undefined,
                  }))
                }
              />
            </div>

            {/* Icon Selection */}
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Icon
              </label>
              <div className="flex flex-wrap gap-2">
                {ICON_OPTIONS.map((icon) => (
                  <button
                    key={icon}
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, icon }))}
                    className={cn(
                      "flex h-12 w-12 items-center justify-center rounded-lg border-2 text-2xl transition-all",
                      formData.icon === icon
                        ? "border-emerald-500 bg-emerald-50"
                        : "border-gray-200 hover:border-gray-300",
                    )}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>

            {/* Availability */}
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Available For
              </label>
              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="availableForPassTypes"
                    value="all"
                    checked={formData.availableForPassTypes === "all"}
                    onChange={() =>
                      setFormData((prev) => ({
                        ...prev,
                        availableForPassTypes: "all",
                        passTypes: undefined,
                      }))
                    }
                    className="h-4 w-4 border-gray-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="text-sm text-gray-700">All pass types</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="availableForPassTypes"
                    value="specific"
                    checked={formData.availableForPassTypes === "specific"}
                    onChange={() =>
                      setFormData((prev) => ({
                        ...prev,
                        availableForPassTypes: "specific",
                        passTypes: [],
                      }))
                    }
                    className="h-4 w-4 border-gray-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="text-sm text-gray-700">
                    Specific pass types
                  </span>
                </label>
              </div>
            </div>

            {/* Options */}
            <div className="md:col-span-2">
              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.requiresBooking}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        requiresBooking: e.target.checked,
                      }))
                    }
                    className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="text-sm text-gray-700">
                    Requires advance booking
                  </span>
                </label>

                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        isActive: e.target.checked,
                      }))
                    }
                    className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="text-sm text-gray-700">
                    Active (available to customers)
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="mt-6 flex justify-end space-x-3">
            <Button type="button" variant="outline" onClick={resetForm}>
              Cancel
            </Button>
            <Button type="submit">
              {editingAddOn ? "Update Add-On" : "Create Add-On"}
            </Button>
          </div>
        </form>
      )}

      {/* Add-Ons Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {addOns.map((addOn) => (
          <div
            key={addOn.id}
            className={cn(
              "rounded-lg border-2 bg-white p-4 transition-all",
              addOn.isActive ? "border-gray-200" : "border-gray-300 opacity-60",
            )}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-emerald-100 text-3xl">
                  {addOn.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{addOn.name}</h3>
                  <p className="mt-1 text-xs text-gray-600">
                    {getCategoryInfo(addOn.category).label}
                  </p>
                </div>
              </div>
            </div>

            {addOn.description && (
              <p className="mt-3 text-sm text-gray-600">{addOn.description}</p>
            )}

            <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-3">
              <div>
                <p className="text-2xl font-semibold text-emerald-600 tracking-tight">
                  Rs. {addOn.price}
                </p>
                {addOn.maxQuantity && (
                  <p className="text-xs text-gray-500">
                    Max {addOn.maxQuantity} per purchase
                  </p>
                )}
              </div>
              <div className="flex items-center space-x-1">
                {addOn.requiresBooking && (
                  <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
                    Booking
                  </span>
                )}
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-xs font-medium",
                    addOn.isActive
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-gray-100 text-gray-600",
                  )}
                >
                  {addOn.isActive ? "Active" : "Inactive"}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-3 flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleEdit(addOn)}
                className="flex-1"
              >
                Edit
              </Button>
              <Button
                variant={addOn.isActive ? "outline" : "success"}
                size="sm"
                onClick={() => toggleActive(addOn.id)}
                className="flex-1"
              >
                {addOn.isActive ? "Deactivate" : "Activate"}
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => handleDelete(addOn.id)}
              >
                <HiOutlineTrash className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}

        {addOns.length === 0 && (
          <div className="col-span-full rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-12 text-center">
            <p className="text-gray-600">
              No add-ons configured yet. Click &quot;Add New&quot; to create
              your first add-on service or product.
            </p>
          </div>
        )}
      </div>

      {/* Category Summary */}
      {addOns.length > 0 && (
        <div className="rounded-3xl border border-gray-900/[0.06] bg-surface p-4 shadow-soft">
          <h3 className="mb-3 text-sm font-semibold text-gray-900">
            Summary by Category
          </h3>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {ADDON_CATEGORIES.map((category) => {
              const count = addOns.filter(
                (addon) => addon.category === category.value && addon.isActive,
              ).length;
              return (
                <div
                  key={category.value}
                  className="rounded-lg bg-gray-50 p-3 text-center"
                >
                  <p className="text-2xl">{category.icon}</p>
                  <p className="mt-1 text-xl font-bold text-gray-900">
                    {count}
                  </p>
                  <p className="text-xs text-gray-600">{category.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Save All Button */}
      <div className="flex justify-end border-t border-gray-200 pt-6">
        <Button type="button">Save All Changes</Button>
      </div>
    </div>
  );
}
