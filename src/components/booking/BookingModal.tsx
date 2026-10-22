"use client";

import { useState, Fragment } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import type { Gym } from "@/lib/data/mock-gyms";
import {
  HiOutlineX,
  HiOutlineCheck,
  HiStar,
  HiOutlineCreditCard,
  HiOutlineDeviceMobile,
  HiOutlineLibrary,
  HiOutlineExclamation,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlineQrcode,
  HiSparkles,
  HiCheckCircle,
} from "react-icons/hi";

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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/30 backdrop-blur-sm"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
      onClick={resetAndClose}
    >
      {/* Modal Content */}
      <div
        className="relative bg-surface rounded-4xl shadow-lift ring-1 ring-gray-900/[0.06] w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-linear-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-xl font-bold">
                {gym.coverImage ? (
                  <Image
                    src={gym.coverImage}
                    alt={gym.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  gym.name.charAt(0)
                )}
              </div>
              <div>
                <h3
                  className="text-lg font-bold text-gray-900"
                  id="modal-title"
                >
                  {step === "confirmation"
                    ? "Booking Confirmed! 🎉"
                    : "Book Your Pass"}
                </h3>
                <p className="text-sm text-gray-600">{gym.name}</p>
              </div>
            </div>
            <button
              onClick={resetAndClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <HiOutlineX className="h-6 w-6" />
            </button>
          </div>

          {/* Progress Steps */}
          {step !== "confirmation" && (
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    "flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold transition-colors",
                    step === "pass-selection"
                      ? "bg-emerald-600 text-white"
                      : "bg-emerald-100 text-emerald-600",
                  )}
                >
                  1
                </div>
                <span className="text-sm font-medium text-gray-600">Pass</span>
              </div>
              <div className="flex-1 h-1 bg-gray-200 mx-2 rounded-full overflow-hidden">
                <div
                  className={cn(
                    "h-full bg-emerald-600 transition-all duration-300",
                    step === "pass-selection" ? "w-0" : "w-full",
                  )}
                />
              </div>
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    "flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold transition-colors",
                    step === "details"
                      ? "bg-emerald-600 text-white"
                      : step === "pass-selection"
                        ? "bg-gray-200 text-gray-500"
                        : "bg-emerald-100 text-emerald-600",
                  )}
                >
                  2
                </div>
                <span className="text-sm font-medium text-gray-600">
                  Details
                </span>
              </div>
              <div className="flex-1 h-1 bg-gray-200 mx-2 rounded-full overflow-hidden">
                <div
                  className={cn(
                    "h-full bg-emerald-600 transition-all duration-300",
                    step === "payment" ? "w-full" : "w-0",
                  )}
                />
              </div>
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    "flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold transition-colors",
                    step === "payment"
                      ? "bg-emerald-600 text-white"
                      : "bg-gray-200 text-gray-500",
                  )}
                >
                  3
                </div>
                <span className="text-sm font-medium text-gray-600">
                  Payment
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {/* Step 1: Pass Selection */}
          {step === "pass-selection" && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <h4 className="text-xl font-bold text-gray-900 mb-2">
                  Choose Your Perfect Pass
                </h4>
                <p className="text-gray-600">
                  Select the plan that fits your fitness journey
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Day Pass */}
                <button
                  onClick={() => handlePassTypeSelect("day")}
                  className="text-left p-5 border-2 border-gray-200 rounded-xl hover:border-emerald-500 hover:shadow-lg transition-all group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-20 h-20 bg-linear-to-br from-emerald-500/10 to-teal-500/10 rounded-bl-full -mr-10 -mt-10 group-hover:scale-150 transition-transform" />
                  <div className="relative">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h5 className="font-bold text-gray-900 group-hover:text-emerald-600 transition-colors text-lg">
                          Day Pass
                        </h5>
                        <p className="text-sm text-gray-500 mt-1">
                          Perfect for a single workout session
                        </p>
                      </div>
                    </div>
                    <div className="flex items-baseline gap-1 mb-3">
                      <span className="text-2xl font-semibold text-ink tracking-tight">
                        Rs. {gym.pricing.dayPass.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-emerald-600 font-medium">
                      <HiOutlineCheck className="h-4 w-4 mr-1.5" />
                      Valid for 1 day
                    </div>
                  </div>
                </button>

                {/* Week Pass */}
                <button
                  onClick={() => handlePassTypeSelect("week")}
                  className="text-left p-5 border-2 border-gray-200 rounded-xl hover:border-emerald-500 hover:shadow-lg transition-all group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-20 h-20 bg-linear-to-br from-emerald-500/10 to-teal-500/10 rounded-bl-full -mr-10 -mt-10 group-hover:scale-150 transition-transform" />
                  <div className="relative">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h5 className="font-bold text-gray-900 group-hover:text-emerald-600 transition-colors text-lg">
                          Week Pass
                        </h5>
                        <p className="text-sm text-gray-500 mt-1">
                          Great for trying out the gym
                        </p>
                      </div>
                    </div>
                    <div className="flex items-baseline gap-1 mb-3">
                      <span className="text-2xl font-semibold text-ink tracking-tight">
                        Rs. {gym.pricing.weekPass.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-emerald-600 font-medium">
                      <HiOutlineCheck className="h-4 w-4 mr-1.5" />
                      Valid for 7 days
                    </div>
                  </div>
                </button>

                {/* Month Pass */}
                <button
                  onClick={() => handlePassTypeSelect("month")}
                  className="relative text-left p-5 border-2 border-emerald-500 bg-linear-to-br from-emerald-50 to-teal-50 rounded-xl hover:shadow-lg transition-all group overflow-hidden"
                >
                  <div className="absolute -top-3 -right-3">
                    <span className="inline-flex items-center gap-1 bg-emerald-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
                      <HiStar className="h-3 w-3" />
                      Popular
                    </span>
                  </div>
                  <div className="relative">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h5 className="font-bold text-gray-900 group-hover:text-emerald-700 transition-colors text-lg">
                          Monthly Pass
                        </h5>
                        <p className="text-sm text-gray-600 mt-1">
                          Best value for regular members
                        </p>
                      </div>
                    </div>
                    <div className="flex items-baseline gap-1 mb-3">
                      <span className="text-2xl font-semibold text-emerald-700 tracking-tight">
                        Rs. {gym.pricing.monthPass.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-emerald-700 font-medium">
                      <HiOutlineCheck className="h-4 w-4 mr-1.5" />
                      Valid for 30 days
                    </div>
                  </div>
                </button>

                {/* Annual Pass */}
                <button
                  onClick={() => handlePassTypeSelect("annual")}
                  className="text-left p-5 border-2 border-gray-200 rounded-xl hover:border-emerald-500 hover:shadow-lg transition-all group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-20 h-20 bg-linear-to-br from-amber-500/10 to-orange-500/10 rounded-bl-full -mr-10 -mt-10 group-hover:scale-150 transition-transform" />
                  <div className="relative">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h5 className="font-bold text-gray-900 group-hover:text-emerald-600 transition-colors text-lg">
                          Annual Pass
                        </h5>
                        <p className="text-sm text-gray-500 mt-1">
                          Save 2 months with annual commitment
                        </p>
                      </div>
                    </div>
                    <div className="flex items-baseline gap-1 mb-2">
                      <span className="text-2xl font-semibold text-ink tracking-tight">
                        Rs. {(gym.pricing.monthPass * 10).toLocaleString()}
                      </span>
                    </div>
                    <div className="inline-flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-full">
                      <HiSparkles className="h-3 w-3" />
                      Save Rs. {(gym.pricing.monthPass * 2).toLocaleString()}
                    </div>
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
                    variant="outline"
                    onClick={handleApplyPromo}
                    disabled={promoApplied || !formData.promoCode}
                  >
                    {promoApplied ? "Applied" : "Apply"}
                  </Button>
                </div>
                {promoApplied && (
                  <p className="text-sm text-emerald-600 mt-1 flex items-center gap-1">
                    <HiCheckCircle className="h-4 w-4" />
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
                    <HiOutlineCreditCard className="h-8 w-8 mx-auto mb-2 text-gray-700" />
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
                    <HiOutlineDeviceMobile className="h-8 w-8 mx-auto mb-2 text-gray-700" />
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
                    <HiOutlineLibrary className="h-8 w-8 mx-auto mb-2 text-gray-700" />
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
                    <HiOutlineDeviceMobile className="h-8 w-8 text-emerald-600" />
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
                    <HiOutlineExclamation className="h-5 w-5 text-amber-600 mt-0.5" />
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
                <HiOutlineCheck className="h-10 w-10 text-emerald-600" />
              </div>

              <h3 className="text-2xl font-semibold text-ink mb-2 tracking-tight">
                Booking Confirmed!
              </h3>
              <p className="text-gray-600 mb-6">
                Your {formData.passType} pass for {gym.name} is ready
              </p>

              {/* QR Code Placeholder */}
              <div className="inline-block bg-white border-4 border-gray-200 rounded-xl p-6 mb-6">
                <div className="w-48 h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <HiOutlineQrcode className="h-16 w-16 mx-auto text-gray-400 mb-2" />
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
                  variant="outline"
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
          <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex items-center justify-between gap-3">
            {step !== "pass-selection" && (
              <Button
                variant="outline"
                onClick={() => {
                  if (step === "payment") setStep("details");
                  else if (step === "details") setStep("pass-selection");
                }}
                beforeIcon={<HiOutlineChevronLeft className="h-4 w-4" />}
              >
                Back
              </Button>
            )}
            <div className="flex-1" />
            {step === "details" && (
              <Button
                onClick={() => setStep("payment")}
                disabled={!formData.passType}
                size="lg"
                afterIcon={<HiOutlineChevronRight className="h-4 w-4" />}
              >
                Continue to Payment
              </Button>
            )}
            {step === "payment" && (
              <Button
                onClick={handlePayment}
                disabled={isProcessing}
                size="lg"
                loading={isProcessing}
                loadingText="Processing..."
              >
                {!isProcessing && `Pay Rs. ${getTotal().toLocaleString()}`}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
