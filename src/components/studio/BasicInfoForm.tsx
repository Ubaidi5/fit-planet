"use client";

import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface OperatingHours {
  day: string;
  isOpen: boolean;
  openTime: string;
  closeTime: string;
}

interface BasicInfoData {
  gymName: string;
  description: string;
  phone: string;
  email: string;
  website: string;
  address: string;
  city: string;
  zipCode: string;
  operatingHours: OperatingHours[];
}

const DAYS_OF_WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export default function BasicInfoForm() {
  const [formData, setFormData] = useState<BasicInfoData>({
    gymName: "",
    description: "",
    phone: "",
    email: "",
    website: "",
    address: "",
    city: "",
    zipCode: "",
    operatingHours: DAYS_OF_WEEK.map((day) => ({
      day,
      isOpen: true,
      openTime: "06:00",
      closeTime: "22:00",
    })),
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleOperatingHoursChange = (
    index: number,
    field: keyof OperatingHours,
    value: string | boolean,
  ) => {
    setFormData((prev) => ({
      ...prev,
      operatingHours: prev.operatingHours.map((hour, i) =>
        i === index ? { ...hour, [field]: value } : hour,
      ),
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.gymName.trim()) {
      newErrors.gymName = "Gym name is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.length < 50) {
      newErrors.description = "Description must be at least 50 characters";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[\d\s\-\+\(\)]+$/.test(formData.phone)) {
      newErrors.phone = "Invalid phone number format";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }

    if (!formData.city.trim()) {
      newErrors.city = "City is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSaving(true);

    try {
      // TODO: API call to save gym profile
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log("Gym profile saved:", formData);
      // Show success toast
    } catch (error) {
      console.error("Error saving gym profile:", error);
      // Show error toast
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 p-6">
      {/* Basic Information Section */}
      <div>
        <h2 className="mb-4 text-xl font-semibold text-gray-900">
          Basic Information
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="md:col-span-2">
            <label
              htmlFor="gymName"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Gym Name <span className="text-red-500">*</span>
            </label>
            <Input
              id="gymName"
              name="gymName"
              type="text"
              placeholder="e.g., Fit Planet Gym"
              value={formData.gymName}
              onChange={handleChange}
              error={errors.gymName}
            />
          </div>

          <div className="md:col-span-2">
            <label
              htmlFor="description"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              placeholder="Describe your gym, its unique features, and what makes it special..."
              value={formData.description}
              onChange={handleChange}
              className={cn(
                "w-full rounded-lg border px-4 py-2 text-gray-900 transition-colors",
                "focus:outline-none focus:ring-2 focus:ring-emerald-500",
                errors.description
                  ? "border-red-500 bg-red-50"
                  : "border-gray-300 bg-white",
              )}
            />
            <p className="mt-1 text-xs text-gray-500">
              {formData.description.length} / 500 characters (minimum 50)
            </p>
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description}</p>
            )}
          </div>
        </div>
      </div>

      {/* Contact Information Section */}
      <div>
        <h2 className="mb-4 text-xl font-semibold text-gray-900">
          Contact Information
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label
              htmlFor="phone"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Phone Number <span className="text-red-500">*</span>
            </label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              placeholder="+92 300 1234567"
              value={formData.phone}
              onChange={handleChange}
              error={errors.phone}
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Email Address <span className="text-red-500">*</span>
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="gym@example.com"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
            />
          </div>

          <div className="md:col-span-2">
            <label
              htmlFor="website"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Website (Optional)
            </label>
            <Input
              id="website"
              name="website"
              type="url"
              placeholder="https://www.example.com"
              value={formData.website}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      {/* Address Section */}
      <div>
        <h2 className="mb-4 text-xl font-semibold text-gray-900">Address</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="md:col-span-2">
            <label
              htmlFor="address"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Street Address <span className="text-red-500">*</span>
            </label>
            <Input
              id="address"
              name="address"
              type="text"
              placeholder="123 Main Street"
              value={formData.address}
              onChange={handleChange}
              error={errors.address}
            />
          </div>

          <div>
            <label
              htmlFor="city"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              City <span className="text-red-500">*</span>
            </label>
            <Input
              id="city"
              name="city"
              type="text"
              placeholder="Karachi"
              value={formData.city}
              onChange={handleChange}
              error={errors.city}
            />
          </div>

          <div>
            <label
              htmlFor="zipCode"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              ZIP / Postal Code
            </label>
            <Input
              id="zipCode"
              name="zipCode"
              type="text"
              placeholder="75500"
              value={formData.zipCode}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      {/* Operating Hours Section */}
      <div>
        <h2 className="mb-4 text-xl font-semibold text-gray-900">
          Operating Hours
        </h2>
        <div className="space-y-3">
          {formData.operatingHours.map((hours, index) => (
            <div
              key={hours.day}
              className="flex items-center space-x-4 rounded-lg border border-gray-200 p-4"
            >
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id={`open-${hours.day}`}
                  checked={hours.isOpen}
                  onChange={(e) =>
                    handleOperatingHoursChange(
                      index,
                      "isOpen",
                      e.target.checked,
                    )
                  }
                  className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                />
                <label
                  htmlFor={`open-${hours.day}`}
                  className="w-24 text-sm font-medium text-gray-700"
                >
                  {hours.day}
                </label>
              </div>

              {hours.isOpen ? (
                <div className="flex items-center space-x-2">
                  <Input
                    type="time"
                    value={hours.openTime}
                    onChange={(e) =>
                      handleOperatingHoursChange(
                        index,
                        "openTime",
                        e.target.value,
                      )
                    }
                    className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <span className="text-gray-500">to</span>
                  <Input
                    type="time"
                    value={hours.closeTime}
                    onChange={(e) =>
                      handleOperatingHoursChange(
                        index,
                        "closeTime",
                        e.target.value,
                      )
                    }
                    className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              ) : (
                <span className="text-sm text-gray-500">Closed</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end space-x-4 border-t border-gray-200 pt-6">
        <Button variant="outline" type="button">
          Cancel
        </Button>
        <Button type="submit" disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}
