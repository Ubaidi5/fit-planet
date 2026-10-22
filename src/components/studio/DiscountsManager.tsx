"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";
import Select from "../ui/Select";
import Textarea from "../ui/Textarea";

interface Discount {
  id: string;
  name: string;
  code: string;
  type: "percentage" | "fixed";
  value: number;
  description: string;
  // Applicability
  applicableTo: "all" | "specific-passes";
  passTypes?: string[];
  // Conditions
  minPurchaseAmount?: number;
  maxDiscountAmount?: number;
  usageLimit?: number;
  usedCount: number;
  // Validity
  startDate: string;
  endDate: string;
  isActive: boolean;
  // User restrictions
  newUsersOnly: boolean;
  firstPurchaseOnly: boolean;
}

const DISCOUNT_TYPES = [
  { value: "percentage", label: "Percentage (%)", example: "e.g., 20% off" },
  { value: "fixed", label: "Fixed Amount (Rs.)", example: "e.g., Rs. 500 off" },
];

export default function DiscountsManager() {
  const [discounts, setDiscounts] = useState<Discount[]>([
    {
      id: "1",
      name: "New Year Special",
      code: "NEWYEAR2026",
      type: "percentage",
      value: 20,
      description: "20% off on all monthly passes",
      applicableTo: "specific-passes",
      passTypes: ["Monthly Membership"],
      minPurchaseAmount: 2000,
      maxDiscountAmount: 1000,
      usageLimit: 100,
      usedCount: 45,
      startDate: "2026-01-01",
      endDate: "2026-01-31",
      isActive: true,
      newUsersOnly: true,
      firstPurchaseOnly: false,
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingDiscount, setEditingDiscount] = useState<Discount | null>(null);
  const [formData, setFormData] = useState<Omit<Discount, "id" | "usedCount">>({
    name: "",
    code: "",
    type: "percentage",
    value: 0,
    description: "",
    applicableTo: "all",
    startDate: new Date().toISOString().split("T")[0],
    endDate: "",
    isActive: true,
    newUsersOnly: false,
    firstPurchaseOnly: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingDiscount) {
      setDiscounts((prev) =>
        prev.map((discount) =>
          discount.id === editingDiscount.id
            ? { ...formData, id: discount.id, usedCount: discount.usedCount }
            : discount,
        ),
      );
    } else {
      setDiscounts((prev) => [
        ...prev,
        { ...formData, id: `discount-${Date.now()}`, usedCount: 0 },
      ]);
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: "",
      code: "",
      type: "percentage",
      value: 0,
      description: "",
      applicableTo: "all",
      startDate: new Date().toISOString().split("T")[0],
      endDate: "",
      isActive: true,
      newUsersOnly: false,
      firstPurchaseOnly: false,
    });
    setShowForm(false);
    setEditingDiscount(null);
  };

  const handleEdit = (discount: Discount) => {
    setEditingDiscount(discount);
    setFormData({
      name: discount.name,
      code: discount.code,
      type: discount.type,
      value: discount.value,
      description: discount.description,
      applicableTo: discount.applicableTo,
      passTypes: discount.passTypes,
      minPurchaseAmount: discount.minPurchaseAmount,
      maxDiscountAmount: discount.maxDiscountAmount,
      usageLimit: discount.usageLimit,
      startDate: discount.startDate,
      endDate: discount.endDate,
      isActive: discount.isActive,
      newUsersOnly: discount.newUsersOnly,
      firstPurchaseOnly: discount.firstPurchaseOnly,
    });
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this discount?")) {
      setDiscounts((prev) => prev.filter((discount) => discount.id !== id));
    }
  };

  const toggleActive = (id: string) => {
    setDiscounts((prev) =>
      prev.map((discount) =>
        discount.id === id
          ? { ...discount, isActive: !discount.isActive }
          : discount,
      ),
    );
  };

  const generateCode = () => {
    const randomCode = Math.random()
      .toString(36)
      .substring(2, 10)
      .toUpperCase();
    setFormData((prev) => ({ ...prev, code: randomCode }));
  };

  const getDiscountDisplay = (discount: Discount) => {
    if (discount.type === "percentage") {
      return `${discount.value}% OFF`;
    }
    return `Rs. ${discount.value} OFF`;
  };

  const getRemainingUses = (discount: Discount) => {
    if (!discount.usageLimit) return "Unlimited";
    return `${discount.usageLimit - discount.usedCount} / ${discount.usageLimit}`;
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Discounts & Promotional Offers
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            Create discount codes and promotional offers for your passes
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => {
            setShowForm(!showForm);
            if (showForm) resetForm();
          }}
        >
          {showForm ? "Cancel" : "+ Create Discount"}
        </Button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="rounded-lg border border-gray-200 bg-gray-50 p-6"
        >
          <h3 className="mb-4 text-lg font-semibold text-gray-900">
            {editingDiscount ? "Edit Discount" : "Create New Discount"}
          </h3>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Discount Name */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Discount Name <span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="e.g., Summer Sale"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                required
              />
            </div>

            {/* Discount Code */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Discount Code <span className="text-red-500">*</span>
              </label>
              <div className="flex space-x-2">
                <Input
                  placeholder="e.g., SUMMER2026"
                  value={formData.code}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      code: e.target.value.toUpperCase(),
                    }))
                  }
                  required
                />
                <Button type="button" variant="outline" onClick={generateCode}>
                  Generate
                </Button>
              </div>
            </div>

            {/* Discount Type */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Discount Type <span className="text-red-500">*</span>
              </label>
              <Select
                value={formData.type}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    type: e.target.value as "percentage" | "fixed",
                  }))
                }
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                required
              >
                {DISCOUNT_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label} - {type.example}
                  </option>
                ))}
              </Select>
            </div>

            {/* Discount Value */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                {formData.type === "percentage"
                  ? "Percentage (%)"
                  : "Amount (Rs.)"}{" "}
                <span className="text-red-500">*</span>
              </label>
              <Input
                type="number"
                min="0"
                max={formData.type === "percentage" ? "100" : undefined}
                placeholder={
                  formData.type === "percentage" ? "e.g., 20" : "e.g., 500"
                }
                value={formData.value}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    value: parseFloat(e.target.value) || 0,
                  }))
                }
                required
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Description
              </label>
              <Textarea
                rows={2}
                placeholder="Brief description of the offer..."
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
              />
            </div>

            {/* Applicable To */}
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Applicable To
              </label>
              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="applicableTo"
                    value="all"
                    checked={formData.applicableTo === "all"}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        applicableTo: "all",
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
                    name="applicableTo"
                    value="specific-passes"
                    checked={formData.applicableTo === "specific-passes"}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        applicableTo: "specific-passes",
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

            {/* Conditions */}
            <div className="md:col-span-2">
              <h4 className="mb-3 text-sm font-semibold text-gray-900">
                Conditions & Limits (Optional)
              </h4>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Min. Purchase Amount (Rs.)
                  </label>
                  <Input
                    type="number"
                    min="0"
                    placeholder="e.g., 1000"
                    value={formData.minPurchaseAmount || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        minPurchaseAmount:
                          parseInt(e.target.value) || undefined,
                      }))
                    }
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Max. Discount Amount (Rs.)
                  </label>
                  <Input
                    type="number"
                    min="0"
                    placeholder="e.g., 500"
                    value={formData.maxDiscountAmount || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        maxDiscountAmount:
                          parseInt(e.target.value) || undefined,
                      }))
                    }
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Total Usage Limit
                  </label>
                  <Input
                    type="number"
                    min="1"
                    placeholder="e.g., 100 (leave empty for unlimited)"
                    value={formData.usageLimit || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        usageLimit: parseInt(e.target.value) || undefined,
                      }))
                    }
                  />
                </div>
              </div>
            </div>

            {/* Validity Period */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Start Date <span className="text-red-500">*</span>
              </label>
              <Input
                type="date"
                value={formData.startDate}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    startDate: e.target.value,
                  }))
                }
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                End Date <span className="text-red-500">*</span>
              </label>
              <Input
                type="date"
                value={formData.endDate}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, endDate: e.target.value }))
                }
                required
              />
            </div>

            {/* User Restrictions */}
            <div className="md:col-span-2">
              <h4 className="mb-3 text-sm font-semibold text-gray-900">
                User Restrictions
              </h4>
              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.newUsersOnly}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        newUsersOnly: e.target.checked,
                      }))
                    }
                    className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="text-sm text-gray-700">New users only</span>
                </label>

                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.firstPurchaseOnly}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        firstPurchaseOnly: e.target.checked,
                      }))
                    }
                    className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="text-sm text-gray-700">
                    First purchase only
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
                    Active (visible to customers)
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
              {editingDiscount ? "Update Discount" : "Create Discount"}
            </Button>
          </div>
        </form>
      )}

      {/* Discounts List */}
      <div className="space-y-4">
        {discounts.map((discount) => (
          <div
            key={discount.id}
            className={cn(
              "rounded-lg border-2 bg-white p-6 transition-all",
              discount.isActive
                ? "border-emerald-200 bg-linear-to-r from-emerald-50 to-white"
                : "border-gray-300 opacity-60",
            )}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3">
                  <div className="rounded-lg bg-emerald-600 px-4 py-2 text-center">
                    <p className="text-2xl font-semibold text-white tracking-tight">
                      {getDiscountDisplay(discount)}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {discount.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Code:{" "}
                      <span className="font-mono font-semibold text-emerald-600">
                        {discount.code}
                      </span>
                    </p>
                  </div>
                </div>

                {discount.description && (
                  <p className="mt-3 text-sm text-gray-700">
                    {discount.description}
                  </p>
                )}

                <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
                  <div>
                    <p className="text-xs text-gray-600">Valid From</p>
                    <p className="text-sm font-medium text-gray-900">
                      {new Date(discount.startDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Valid Until</p>
                    <p className="text-sm font-medium text-gray-900">
                      {new Date(discount.endDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Uses Remaining</p>
                    <p className="text-sm font-medium text-gray-900">
                      {getRemainingUses(discount)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Status</p>
                    <p
                      className={cn(
                        "text-sm font-semibold",
                        discount.isActive
                          ? "text-emerald-600"
                          : "text-gray-500",
                      )}
                    >
                      {discount.isActive ? "Active" : "Inactive"}
                    </p>
                  </div>
                </div>

                {(discount.minPurchaseAmount ||
                  discount.maxDiscountAmount ||
                  discount.newUsersOnly ||
                  discount.firstPurchaseOnly) && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {discount.minPurchaseAmount && (
                      <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                        Min. Rs. {discount.minPurchaseAmount}
                      </span>
                    )}
                    {discount.maxDiscountAmount && (
                      <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-700">
                        Max. Rs. {discount.maxDiscountAmount} off
                      </span>
                    )}
                    {discount.newUsersOnly && (
                      <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-700">
                        New users only
                      </span>
                    )}
                    {discount.firstPurchaseOnly && (
                      <span className="rounded-full bg-pink-100 px-3 py-1 text-xs font-medium text-pink-700">
                        First purchase only
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="ml-4 flex flex-col space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(discount)}
                >
                  Edit
                </Button>
                <Button
                  variant={discount.isActive ? "outline" : "success"}
                  size="sm"
                  onClick={() => toggleActive(discount.id)}
                >
                  {discount.isActive ? "Deactivate" : "Activate"}
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(discount.id)}
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        ))}

        {discounts.length === 0 && (
          <div className="rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-12 text-center">
            <p className="text-gray-600">
              No discounts created yet. Click &quot;Create Discount&quot; to add
              your first promotional offer.
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
