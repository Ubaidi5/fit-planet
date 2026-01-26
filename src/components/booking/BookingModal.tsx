"use client";

import { useState, Fragment } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import type { Gym } from "@/lib/data/mock-gyms";

interface BookingModalProps {
  gym: Gym;
  isOpen: boolean;
  onClose: () => void;
}

type BookingStep = "pass-selection" | "details" | "payment" | "confirmation";

interface BookingFormData {
  passType: "day" | "week" | "month" | "annual" | null;
  startDate: string;
  addOns: {
    guestPass: boolean;
    locker: boolean;
    personalTraining: boolean;
  };
  promoCode: string;
  paymentMethod: "card" | "mobile_wallet" | "bank_transfer";
  cardNumber?: string;
  cardName?: string;
  cardExpiry?: string;
  cardCVV?: string;
}

export function BookingModal({ gym, isOpen, onClose }: BookingModalProps) {
  const [step, setStep] = useState<BookingStep>("pass-selection");
  const [formData, setFormData] = useState<BookingFormData>({
    passType: null,
    startDate: new Date().toISOString().split("T")[0],
    addOns: {
      guestPass: false,
      locker: false,
      personalTraining: false,
    },
    promoCode: "",
    paymentMethod: "card",
  });

  const [promoApplied, setPromoApplied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handlePassTypeSelect = (
    passType: "day" | "week" | "month" | "annual",
  ) => {
    setFormData({ ...formData, passType });
    setStep("details");
  };

  const handleApplyPromo = () => {
    // Mock promo validation
    if (formData.promoCode.toUpperCase() === "FIRST10") {
      setPromoApplied(true);
    }
  };

  const handlePayment = () => {
    setIsProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setStep("confirmation");
    }, 2000);
  };

  const getPassPrice = () => {
    if (!formData.passType) return 0;
    const prices = {
      day: gym.pricing.dayPass,
      week: gym.pricing.weekPass,
      month: gym.pricing.monthPass,
      annual: gym.pricing.monthPass * 10, // Mock annual price
    };
    return prices[formData.passType];
  };

  const getAddOnsTotal = () => {
    let total = 0;
    if (formData.addOns.guestPass) total += 400;
    if (formData.addOns.locker) total += 200;
    if (formData.addOns.personalTraining) total += 2500;
    return total;
  };

  const getSubtotal = () => {
    return getPassPrice() + getAddOnsTotal();
  };

  const getDiscount = () => {
    if (promoApplied) {
      return Math.floor(getSubtotal() * 0.1); // 10% discount
    }
    return 0;
  };

  const getTotal = () => {
    return getSubtotal() - getDiscount();
  };

  const resetAndClose = () => {
    setStep("pass-selection");
    setFormData({
      passType: null,
      startDate: new Date().toISOString().split("T")[0],
      addOns: { guestPass: false, locker: false, personalTraining: false },
      promoCode: "",
      paymentMethod: "card",
    });
    setPromoApplied(false);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity"
          aria-hidden="true"
          onClick={resetAndClose}
        />

        {/* Modal positioning trick */}
        <span
          className="hidden sm:inline-block sm:h-screen sm:align-middle"
          aria-hidden="true"
        >
          &#8203;
        </span>

        {/* Modal Content */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          {/* Header */}
          <div className="bg-white px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12 rounded-lg overflow-hidden">
                  <Image
                    src={gym.coverImage}
                    alt={gym.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3
                    className="text-lg font-semibold text-gray-900"
                    id="modal-title"
                  >
                    {step === "confirmation"
                      ? "Booking Confirmed!"
                      : "Book a Pass"}
                  </h3>
                  <p className="text-sm text-gray-500">{gym.name}</p>
                </div>
              </div>
              <button
                onClick={resetAndClose}
                className="text-gray-400 hover:text-gray-500 transition-colors"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Progress Steps */}
            {step !== "confirmation" && (
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      "flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium",
                      step === "pass-selection"
                        ? "bg-emerald-600 text-white"
                        : "bg-emerald-100 text-emerald-600",
                    )}
                  >
                    1
                  </div>
                  <span className="text-sm text-gray-600">Pass</span>
                </div>
                <div className="flex-1 h-0.5 bg-gray-200 mx-2" />
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      "flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium",
                      step === "details"
                        ? "bg-emerald-600 text-white"
                        : step === "pass-selection"
                          ? "bg-gray-200 text-gray-500"
                          : "bg-emerald-100 text-emerald-600",
                    )}
                  >
                    2
                  </div>
                  <span className="text-sm text-gray-600">Details</span>
                </div>
                <div className="flex-1 h-0.5 bg-gray-200 mx-2" />
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      "flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium",
                      step === "payment"
                        ? "bg-emerald-600 text-white"
                        : "bg-gray-200 text-gray-500",
                    )}
                  >
                    3
                  </div>
                  <span className="text-sm text-gray-600">Payment</span>
                </div>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="bg-white px-6 py-6 max-h-[60vh] overflow-y-auto">
            {/* Step 1: Pass Selection */}
            {step === "pass-selection" && (
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900 mb-4">
                  Choose Your Pass
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Day Pass */}
                  <button
                    onClick={() => handlePassTypeSelect("day")}
                    className="text-left p-4 border-2 border-gray-200 rounded-xl hover:border-emerald-500 hover:shadow-md transition-all group"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h5 className="font-semibold text-gray-900 group-hover:text-emerald-600">
                        Day Pass
                      </h5>
                      <span className="text-lg font-bold text-gray-900">
                        Rs. {gym.pricing.dayPass.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Perfect for a single workout session
                    </p>
                    <div className="mt-3 flex items-center text-xs text-gray-500">
                      <svg
                        className="h-4 w-4 mr-1"
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
                      Valid for 1 day
                    </div>
                  </button>

                  {/* Week Pass */}
                  <button
                    onClick={() => handlePassTypeSelect("week")}
                    className="text-left p-4 border-2 border-gray-200 rounded-xl hover:border-emerald-500 hover:shadow-md transition-all group"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h5 className="font-semibold text-gray-900 group-hover:text-emerald-600">
                        Week Pass
                      </h5>
                      <span className="text-lg font-bold text-gray-900">
                        Rs. {gym.pricing.weekPass.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Great for trying out the gym
                    </p>
                    <div className="mt-3 flex items-center text-xs text-gray-500">
                      <svg
                        className="h-4 w-4 mr-1"
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
                      Valid for 7 days
                    </div>
                  </button>

                  {/* Month Pass */}
                  <button
                    onClick={() => handlePassTypeSelect("month")}
                    className="relative text-left p-4 border-2 border-emerald-500 bg-emerald-50 rounded-xl hover:shadow-md transition-all group"
                  >
                    <div className="absolute -top-2 -right-2">
                      <span className="bg-emerald-600 text-white text-xs font-semibold px-2 py-1 rounded-full">
                        Popular
                      </span>
                    </div>
                    <div className="flex items-start justify-between mb-2">
                      <h5 className="font-semibold text-gray-900 group-hover:text-emerald-600">
                        Monthly Pass
                      </h5>
                      <span className="text-lg font-bold text-gray-900">
                        Rs. {gym.pricing.monthPass.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Best value for regular members
                    </p>
                    <div className="mt-3 flex items-center text-xs text-gray-500">
                      <svg
                        className="h-4 w-4 mr-1"
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
                      Valid for 30 days
                    </div>
                  </button>

                  {/* Annual Pass */}
                  <button
                    onClick={() => handlePassTypeSelect("annual")}
                    className="text-left p-4 border-2 border-gray-200 rounded-xl hover:border-emerald-500 hover:shadow-md transition-all group"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h5 className="font-semibold text-gray-900 group-hover:text-emerald-600">
                        Annual Pass
                      </h5>
                      <span className="text-lg font-bold text-gray-900">
                        Rs. {(gym.pricing.monthPass * 10).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Save 2 months with annual commitment
                    </p>
                    <div className="mt-3 flex items-center text-xs text-emerald-600 font-medium">
                      <svg
                        className="h-4 w-4 mr-1"
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
                      Save Rs. {(gym.pricing.monthPass * 2).toLocaleString()}
                    </div>
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Details */}
            {step === "details" && (
              <div className="space-y-6">
                {/* Start Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date
                  </label>
                  <Input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) =>
                      setFormData({ ...formData, startDate: e.target.value })
                    }
                    min={new Date().toISOString().split("T")[0]}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Pass will be valid from this date
                  </p>
                </div>

                {/* Add-ons */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Add-ons (Optional)
                  </label>
                  <div className="space-y-3">
                    <label className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="checkbox"
                        checked={formData.addOns.guestPass}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            addOns: {
                              ...formData.addOns,
                              guestPass: e.target.checked,
                            },
                          })
                        }
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-gray-900">
                            Guest Pass
                          </span>
                          <span className="text-gray-700">+ Rs. 400</span>
                        </div>
                        <p className="text-sm text-gray-500">
                          Bring a friend for one session
                        </p>
                      </div>
                    </label>

                    <label className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="checkbox"
                        checked={formData.addOns.locker}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            addOns: {
                              ...formData.addOns,
                              locker: e.target.checked,
                            },
                          })
                        }
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-gray-900">
                            Dedicated Locker
                          </span>
                          <span className="text-gray-700">+ Rs. 200</span>
                        </div>
                        <p className="text-sm text-gray-500">
                          Personal locker for the duration
                        </p>
                      </div>
                    </label>

                    <label className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="checkbox"
                        checked={formData.addOns.personalTraining}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            addOns: {
                              ...formData.addOns,
                              personalTraining: e.target.checked,
                            },
                          })
                        }
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-gray-900">
                            PT Session (1 hour)
                          </span>
                          <span className="text-gray-700">+ Rs. 2,500</span>
                        </div>
                        <p className="text-sm text-gray-500">
                          One-on-one training with certified trainer
                        </p>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Promo Code */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Promo Code
                  </label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter code"
                      value={formData.promoCode}
                      onChange={(e) =>
                        setFormData({ ...formData, promoCode: e.target.value })
                      }
                      disabled={promoApplied}
                    />
                    <Button
                      outline
                      onClick={handleApplyPromo}
                      disabled={promoApplied || !formData.promoCode}
                    >
                      {promoApplied ? "Applied" : "Apply"}
                    </Button>
                  </div>
                  {promoApplied && (
                    <p className="text-sm text-emerald-600 mt-1 flex items-center gap-1">
                      <svg
                        className="h-4 w-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      10% discount applied!
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    Try: FIRST10 for 10% off
                  </p>
                </div>

                {/* Price Summary */}
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Pass Price</span>
                    <span className="text-gray-900">
                      Rs. {getPassPrice().toLocaleString()}
                    </span>
                  </div>
                  {getAddOnsTotal() > 0 && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Add-ons</span>
                      <span className="text-gray-900">
                        Rs. {getAddOnsTotal().toLocaleString()}
                      </span>
                    </div>
                  )}
                  {getDiscount() > 0 && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-emerald-600">Discount</span>
                      <span className="text-emerald-600">
                        - Rs. {getDiscount().toLocaleString()}
                      </span>
                    </div>
                  )}
                  <div className="pt-2 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-gray-900">Total</span>
                      <span className="text-lg font-bold text-gray-900">
                        Rs. {getTotal().toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Payment */}
            {step === "payment" && (
              <div className="space-y-6">
                {/* Payment Method Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Payment Method
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      onClick={() =>
                        setFormData({ ...formData, paymentMethod: "card" })
                      }
                      className={cn(
                        "p-4 border-2 rounded-lg text-center transition-all",
                        formData.paymentMethod === "card"
                          ? "border-emerald-600 bg-emerald-50"
                          : "border-gray-200 hover:border-gray-300",
                      )}
                    >
                      <svg
                        className="h-8 w-8 mx-auto mb-2 text-gray-700"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                        />
                      </svg>
                      <span className="text-sm font-medium">Card</span>
                    </button>

                    <button
                      onClick={() =>
                        setFormData({
                          ...formData,
                          paymentMethod: "mobile_wallet",
                        })
                      }
                      className={cn(
                        "p-4 border-2 rounded-lg text-center transition-all",
                        formData.paymentMethod === "mobile_wallet"
                          ? "border-emerald-600 bg-emerald-50"
                          : "border-gray-200 hover:border-gray-300",
                      )}
                    >
                      <svg
                        className="h-8 w-8 mx-auto mb-2 text-gray-700"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                        />
                      </svg>
                      <span className="text-sm font-medium">Wallet</span>
                    </button>

                    <button
                      onClick={() =>
                        setFormData({
                          ...formData,
                          paymentMethod: "bank_transfer",
                        })
                      }
                      className={cn(
                        "p-4 border-2 rounded-lg text-center transition-all",
                        formData.paymentMethod === "bank_transfer"
                          ? "border-emerald-600 bg-emerald-50"
                          : "border-gray-200 hover:border-gray-300",
                      )}
                    >
                      <svg
                        className="h-8 w-8 mx-auto mb-2 text-gray-700"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"
                        />
                      </svg>
                      <span className="text-sm font-medium">Bank</span>
                    </button>
                  </div>
                </div>

                {/* Card Payment Form */}
                {formData.paymentMethod === "card" && (
                  <div className="space-y-4">
                    <Input
                      label="Card Number"
                      placeholder="1234 5678 9012 3456"
                    />
                    <Input label="Cardholder Name" placeholder="Muhammad Ali" />
                    <div className="grid grid-cols-2 gap-4">
                      <Input label="Expiry Date" placeholder="MM/YY" />
                      <Input label="CVV" placeholder="123" />
                    </div>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="rounded" />
                      <span className="text-sm text-gray-600">
                        Save card for future bookings
                      </span>
                    </label>
                  </div>
                )}

                {/* Mobile Wallet */}
                {formData.paymentMethod === "mobile_wallet" && (
                  <div className="text-center py-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 mb-4">
                      <svg
                        className="h-8 w-8 text-emerald-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <p className="text-gray-600 mb-4">
                      You will be redirected to complete payment via:
                    </p>
                    <div className="flex items-center justify-center gap-4">
                      <div className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-medium">
                        JazzCash
                      </div>
                      <div className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-medium">
                        Easypaisa
                      </div>
                    </div>
                  </div>
                )}

                {/* Bank Transfer */}
                {formData.paymentMethod === "bank_transfer" && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <svg
                        className="h-5 w-5 text-amber-600 mt-0.5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <div className="flex-1 text-sm">
                        <p className="font-medium text-amber-900 mb-1">
                          Manual Verification Required
                        </p>
                        <p className="text-amber-700">
                          Bank transfer details will be sent via email. Your
                          booking will be confirmed once payment is verified
                          (usually within 24 hours).
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Order Summary */}
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <h5 className="font-semibold text-gray-900">Order Summary</h5>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">
                        {formData.passType?.charAt(0).toUpperCase()}
                        {formData.passType?.slice(1)} Pass
                      </span>
                      <span className="text-gray-900">
                        Rs. {getPassPrice().toLocaleString()}
                      </span>
                    </div>
                    {getAddOnsTotal() > 0 && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Add-ons</span>
                        <span className="text-gray-900">
                          Rs. {getAddOnsTotal().toLocaleString()}
                        </span>
                      </div>
                    )}
                    {getDiscount() > 0 && (
                      <div className="flex items-center justify-between">
                        <span className="text-emerald-600">
                          Discount (FIRST10)
                        </span>
                        <span className="text-emerald-600">
                          - Rs. {getDiscount().toLocaleString()}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="pt-3 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-gray-900">
                        Total Amount
                      </span>
                      <span className="text-xl font-bold text-gray-900">
                        Rs. {getTotal().toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Confirmation */}
            {step === "confirmation" && (
              <div className="text-center py-8">
                {/* Success Icon */}
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-100 mb-6">
                  <svg
                    className="h-10 w-10 text-emerald-600"
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
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Booking Confirmed!
                </h3>
                <p className="text-gray-600 mb-6">
                  Your {formData.passType} pass for {gym.name} is ready
                </p>

                {/* QR Code Placeholder */}
                <div className="inline-block bg-white border-4 border-gray-200 rounded-xl p-6 mb-6">
                  <div className="w-48 h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <svg
                        className="h-16 w-16 mx-auto text-gray-400 mb-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                        />
                      </svg>
                      <p className="text-sm text-gray-500">QR Code</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-4">
                    Booking ID: BKG{Math.floor(Math.random() * 10000)}
                  </p>
                </div>

                {/* Pass Details */}
                <div className="bg-gray-50 rounded-lg p-4 text-left mb-6 space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Valid From</span>
                    <span className="font-medium text-gray-900">
                      {formData.startDate}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Valid Until</span>
                    <span className="font-medium text-gray-900">
                      {
                        new Date(
                          new Date(formData.startDate).getTime() +
                            (formData.passType === "day"
                              ? 1
                              : formData.passType === "week"
                                ? 7
                                : formData.passType === "month"
                                  ? 30
                                  : 365) *
                              24 *
                              60 *
                              60 *
                              1000,
                        )
                          .toISOString()
                          .split("T")[0]
                      }
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Amount Paid</span>
                    <span className="font-medium text-gray-900">
                      Rs. {getTotal().toLocaleString()}
                    </span>
                  </div>
                </div>

                <p className="text-sm text-gray-500 mb-6">
                  A confirmation email has been sent to your registered email
                  address.
                </p>

                <div className="flex gap-3">
                  <Button
                    outline
                    className="flex-1"
                    onClick={resetAndClose}
                  >
                    Close
                  </Button>
                  <Button className="flex-1">View My Passes</Button>
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          {step !== "confirmation" && (
            <div className="bg-gray-50 px-6 py-4 flex items-center justify-between gap-3">
              {step !== "pass-selection" && (
                <Button
                  outline
                  onClick={() => {
                    if (step === "payment") setStep("details");
                    else if (step === "details") setStep("pass-selection");
                  }}
                >
                  Back
                </Button>
              )}
              <div className="flex-1" />
              {step === "details" && (
                <Button
                  onClick={() => setStep("payment")}
                  disabled={!formData.passType}
                >
                  Continue to Payment
                </Button>
              )}
              {step === "payment" && (
                <Button onClick={handlePayment} disabled={isProcessing}>
                  {isProcessing
                    ? "Processing..."
                    : `Pay Rs. ${getTotal().toLocaleString()}`}
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
