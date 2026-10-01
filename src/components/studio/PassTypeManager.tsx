"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";
import Select from "../ui/Select";
import Textarea from "../ui/Textarea";
import { HiOutlineX, HiOutlineCheck } from "react-icons/hi";

interface PassType {
  id: string;
  name: string;
  duration: "day" | "week" | "month" | "year" | "custom";
  customDays?: number;
  basePrice: number;
  description: string;
  features: string[];
  isActive: boolean;
  // Time-based pricing
  peakHourPrice?: number;
  offPeakHourPrice?: number;
  // Limits
  maxVisitsPerDay?: number;
  totalVisits?: number;
  // Colors for UI
  color: string;
}

const DURATION_OPTIONS = [
  { value: "day", label: "Day Pass", description: "Valid for 24 hours" },
  { value: "week", label: "Week Pass", description: "Valid for 7 days" },
  { value: "month", label: "Month Pass", description: "Valid for 30 days" },
  { value: "year", label: "Year Pass", description: "Valid for 365 days" },
  { value: "custom", label: "Custom Duration", description: "Specify days" },
];

const COLOR_OPTIONS = [
  { value: "emerald", label: "Emerald", class: "bg-emerald-500" },
  { value: "blue", label: "Blue", class: "bg-blue-500" },
  { value: "purple", label: "Purple", class: "bg-purple-500" },
  { value: "orange", label: "Orange", class: "bg-orange-500" },
  { value: "pink", label: "Pink", class: "bg-pink-500" },
  { value: "indigo", label: "Indigo", class: "bg-indigo-500" },
];

export default function PassTypeManager() {
  const [passTypes, setPassTypes] = useState<PassType[]>([
    {
      id: "1",
      name: "Day Pass",
      duration: "day",
      basePrice: 500,
      description: "Full access for one day",
      features: ["All equipment", "Group classes", "Locker access"],
      isActive: true,
      color: "emerald",
    },
    {
      id: "2",
      name: "Monthly Membership",
      duration: "month",
      basePrice: 3000,
      description: "Unlimited access for 30 days",
      features: [
        "Unlimited visits",
        "All equipment",
        "Group classes",
        "Personal locker",
        "Guest pass (1/month)",
      ],
      isActive: true,
      color: "blue",
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingPass, setEditingPass] = useState<PassType | null>(null);
  const [formData, setFormData] = useState<Omit<PassType, "id">>({
    name: "",
    duration: "day",
    basePrice: 0,
    description: "",
    features: [],
    isActive: true,
    color: "emerald",
  });

  const [newFeature, setNewFeature] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingPass) {
      // Update existing pass
      setPassTypes((prev) =>
        prev.map((pass) =>
          pass.id === editingPass.id ? { ...formData, id: pass.id } : pass,
        ),
      );
    } else {
      // Add new pass
      setPassTypes((prev) => [
        ...prev,
        { ...formData, id: `pass-${Date.now()}` },
      ]);
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: "",
      duration: "day",
      basePrice: 0,
      description: "",
      features: [],
      isActive: true,
      color: "emerald",
    });
    setShowForm(false);
    setEditingPass(null);
    setNewFeature("");
  };

  const handleEdit = (pass: PassType) => {
    setEditingPass(pass);
    setFormData({
      name: pass.name,
      duration: pass.duration,
      customDays: pass.customDays,
      basePrice: pass.basePrice,
      description: pass.description,
      features: pass.features,
      isActive: pass.isActive,
      peakHourPrice: pass.peakHourPrice,
      offPeakHourPrice: pass.offPeakHourPrice,
      maxVisitsPerDay: pass.maxVisitsPerDay,
      totalVisits: pass.totalVisits,
      color: pass.color,
    });
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this pass type?")) {
      setPassTypes((prev) => prev.filter((pass) => pass.id !== id));
    }
  };

  const toggleActive = (id: string) => {
    setPassTypes((prev) =>
      prev.map((pass) =>
        pass.id === id ? { ...pass, isActive: !pass.isActive } : pass,
      ),
    );
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData((prev) => ({
        ...prev,
        features: [...prev.features, newFeature.trim()],
      }));
      setNewFeature("");
    }
  };

  const removeFeature = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Pass Types & Pricing
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            Configure pass durations, pricing, and features
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => {
            setShowForm(!showForm);
            if (showForm) resetForm();
          }}
        >
          {showForm ? "Cancel" : "+ Add Pass Type"}
        </Button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="rounded-lg border border-gray-200 bg-gray-50 p-6"
        >
          <h3 className="mb-4 text-lg font-semibold text-gray-900">
            {editingPass ? "Edit Pass Type" : "Create New Pass Type"}
          </h3>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Pass Name */}
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Pass Name <span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="e.g., Premium Monthly Pass"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                required
              />
            </div>

            {/* Duration */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Duration <span className="text-red-500">*</span>
              </label>
              <Select
                value={formData.duration}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    duration: e.target.value as PassType["duration"],
                  }))
                }
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                required
              >
                {DURATION_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label} - {option.description}
                  </option>
                ))}
              </Select>
            </div>

            {/* Custom Days (if custom duration) */}
            {formData.duration === "custom" && (
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Number of Days <span className="text-red-500">*</span>
                </label>
                <Input
                  type="number"
                  min="1"
                  placeholder="e.g., 10"
                  value={formData.customDays || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      customDays: parseInt(e.target.value) || undefined,
                    }))
                  }
                  required
                />
              </div>
            )}

            {/* Base Price */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Base Price (Rs.) <span className="text-red-500">*</span>
              </label>
              <Input
                type="number"
                min="0"
                placeholder="e.g., 3000"
                value={formData.basePrice}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    basePrice: parseInt(e.target.value) || 0,
                  }))
                }
                required
              />
            </div>

            {/* Color Theme */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Color Theme
              </label>
              <div className="flex space-x-2">
                {COLOR_OPTIONS.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, color: color.value }))
                    }
                    className={cn(
                      "h-10 w-10 rounded-full border-2 transition-all",
                      color.class,
                      formData.color === color.value
                        ? "scale-110 border-gray-900"
                        : "border-transparent",
                    )}
                    title={color.label}
                  />
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Description
              </label>
              <Textarea
                rows={3}
                placeholder="Brief description of this pass type..."
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
              />
            </div>

            {/* Advanced Options */}
            <div className="md:col-span-2">
              <h4 className="mb-3 text-sm font-semibold text-gray-900">
                Advanced Options (Optional)
              </h4>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Peak Hour Price (Rs.)
                  </label>
                  <Input
                    type="number"
                    min="0"
                    placeholder="Optional higher price"
                    value={formData.peakHourPrice || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        peakHourPrice: parseInt(e.target.value) || undefined,
                      }))
                    }
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Off-Peak Hour Price (Rs.)
                  </label>
                  <Input
                    type="number"
                    min="0"
                    placeholder="Optional lower price"
                    value={formData.offPeakHourPrice || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        offPeakHourPrice: parseInt(e.target.value) || undefined,
                      }))
                    }
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Max Visits Per Day
                  </label>
                  <Input
                    type="number"
                    min="1"
                    placeholder="e.g., 1"
                    value={formData.maxVisitsPerDay || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        maxVisitsPerDay: parseInt(e.target.value) || undefined,
                      }))
                    }
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Total Visits Allowed
                  </label>
                  <Input
                    type="number"
                    min="1"
                    placeholder="e.g., 10 (for 10-visit pass)"
                    value={formData.totalVisits || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        totalVisits: parseInt(e.target.value) || undefined,
                      }))
                    }
                  />
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Features & Benefits
              </label>
              <div className="flex space-x-2">
                <Input
                  placeholder="Add a feature (e.g., Free locker)"
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addFeature();
                    }
                  }}
                />
                <Button type="button" variant="outline" onClick={addFeature}>
                  Add
                </Button>
              </div>

              {formData.features.length > 0 && (
                <ul className="mt-3 space-y-2">
                  {formData.features.map((feature, index) => (
                    <li
                      key={index}
                      className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2"
                    >
                      <span className="text-sm text-gray-700">✓ {feature}</span>
                      <button
                        type="button"
                        onClick={() => removeFeature(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <HiOutlineX className="h-4 w-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Active Status */}
            <div className="md:col-span-2">
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
                <span className="text-sm font-medium text-gray-700">
                  Active (visible to customers)
                </span>
              </label>
            </div>
          </div>

          {/* Form Actions */}
          <div className="mt-6 flex justify-end space-x-3">
            <Button type="button" variant="outline" onClick={resetForm}>
              Cancel
            </Button>
            <Button type="submit">
              {editingPass ? "Update Pass" : "Create Pass"}
            </Button>
          </div>
        </form>
      )}

      {/* Pass Types List */}
      <div className="space-y-4">
        {passTypes.map((pass) => (
          <div
            key={pass.id}
            className={cn(
              "rounded-lg border-2 bg-white p-6 transition-all",
              pass.isActive ? "border-gray-200" : "border-gray-300 opacity-60",
            )}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3">
                  <div
                    className={cn(
                      "h-12 w-12 rounded-lg",
                      `bg-${pass.color}-500`,
                      "flex items-center justify-center text-white",
                    )}
                  >
                    <span className="text-xl font-bold">
                      {pass.duration === "day"
                        ? "1D"
                        : pass.duration === "week"
                          ? "7D"
                          : pass.duration === "month"
                            ? "30D"
                            : pass.duration === "year"
                              ? "1Y"
                              : `${pass.customDays}D`}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {pass.name}
                    </h3>
                    <p className="text-sm text-gray-600">{pass.description}</p>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <div>
                    <p className="text-sm text-gray-600">Base Price</p>
                    <p className="text-xl font-bold text-emerald-600">
                      Rs. {pass.basePrice.toLocaleString()}
                    </p>
                  </div>

                  {pass.peakHourPrice && (
                    <div>
                      <p className="text-sm text-gray-600">Peak Hour Price</p>
                      <p className="text-lg font-semibold text-orange-600">
                        Rs. {pass.peakHourPrice.toLocaleString()}
                      </p>
                    </div>
                  )}

                  {pass.offPeakHourPrice && (
                    <div>
                      <p className="text-sm text-gray-600">Off-Peak Price</p>
                      <p className="text-lg font-semibold text-blue-600">
                        Rs. {pass.offPeakHourPrice.toLocaleString()}
                      </p>
                    </div>
                  )}

                  {pass.maxVisitsPerDay && (
                    <div>
                      <p className="text-sm text-gray-600">Daily Visit Limit</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {pass.maxVisitsPerDay} visit
                        {pass.maxVisitsPerDay > 1 ? "s" : ""}
                      </p>
                    </div>
                  )}

                  {pass.totalVisits && (
                    <div>
                      <p className="text-sm text-gray-600">Total Visits</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {pass.totalVisits} visits
                      </p>
                    </div>
                  )}
                </div>

                {pass.features.length > 0 && (
                  <div className="mt-4">
                    <p className="mb-2 text-sm font-medium text-gray-700">
                      Features:
                    </p>
                    <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {pass.features.map((feature, index) => (
                        <li
                          key={index}
                          className="flex items-center text-sm text-gray-600"
                        >
                          <HiOutlineCheck className="me-2 h-4 w-4 text-emerald-500" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="ms-4 flex flex-col space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(pass)}
                >
                  Edit
                </Button>
                <Button
                  variant={pass.isActive ? "outline" : "success"}
                  size="sm"
                  onClick={() => toggleActive(pass.id)}
                >
                  {pass.isActive ? "Deactivate" : "Activate"}
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(pass.id)}
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        ))}

        {passTypes.length === 0 && (
          <div className="rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-12 text-center">
            <p className="text-gray-600">
              No pass types configured yet. Click &quot;Add Pass Type&quot; to
              create your first pass.
            </p>
          </div>
        )}
      </div>

      {/* Save All Button */}
      <div className="flex justify-end border-t border-gray-200 pt-6">
        <Button type="button">Save All Changes</Button>
      </div>
    </div>
  );
}
