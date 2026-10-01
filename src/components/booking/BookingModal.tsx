"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Input } from "@/components/ui/Input";
import type { Gym } from "@/lib/data/mock-gyms";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import { cityCode } from "@/lib/data/cities";
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
type PassType = "day" | "week" | "month" | "annual";

interface BookingFormData {
  passType: PassType | null;
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

/** Rounds a derived price to a tidy figure in any currency */
function roundPrice(value: number) {
  if (value < 100) return Math.max(1, Math.round(value));
  if (value < 1000) return Math.round(value / 10) * 10;
  return Math.round(value / 50) * 50;
}

const monoLabel =
  "font-mono text-[11px] tracking-[0.14em] uppercase text-gray-400";

const STEPS: { id: Exclude<BookingStep, "confirmation">; label: string }[] = [
  { id: "pass-selection", label: "Pass" },
  { id: "details", label: "Details" },
  { id: "payment", label: "Payment" },
];

export function BookingModal({ gym, isOpen, onClose }: BookingModalProps) {
  const { money } = useLocale();
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

  const price = (value: number) => money(value, gym.currency);

  // Add-on prices follow the gym's own day pass so they fit every currency
  const GUEST_PASS_PRICE = roundPrice(gym.pricing.dayPass * 0.8);
  const LOCKER_PRICE = roundPrice(gym.pricing.dayPass * 0.3);
  const PT_SESSION_PRICE = roundPrice(gym.pricing.dayPass * 4);

  const handlePassTypeSelect = (passType: PassType) => {
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
    if (formData.addOns.guestPass) total += GUEST_PASS_PRICE;
    if (formData.addOns.locker) total += LOCKER_PRICE;
    if (formData.addOns.personalTraining) total += PT_SESSION_PRICE;
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

  const passOptions: {
    type: PassType;
    title: string;
    description: string;
    amount: number;
    validity: string;
    popular?: boolean;
    saving?: number;
  }[] = [
    {
      type: "day",
      title: "Day Pass",
      description: "Perfect for a single workout session",
      amount: gym.pricing.dayPass,
      validity: "Valid for 1 day",
    },
    {
      type: "week",
      title: "Week Pass",
      description: "Great for trying out the gym",
      amount: gym.pricing.weekPass,
      validity: "Valid for 7 days",
    },
    {
      type: "month",
      title: "Monthly Pass",
      description: "Best value for regular members",
      amount: gym.pricing.monthPass,
      validity: "Valid for 30 days",
      popular: true,
    },
    {
      type: "annual",
      title: "Annual Pass",
      description: "Save 2 months with annual commitment",
      amount: gym.pricing.monthPass * 10,
      validity: "Valid for 365 days",
      saving: gym.pricing.monthPass * 2,
    },
  ];

  const addOnOptions: {
    key: keyof BookingFormData["addOns"];
    title: string;
    description: string;
    amount: number;
  }[] = [
    {
      key: "guestPass",
      title: "Guest pass",
      description: "Bring a friend for one session",
      amount: GUEST_PASS_PRICE,
    },
    {
      key: "locker",
      title: "Dedicated locker",
      description: "Personal locker for the duration",
      amount: LOCKER_PRICE,
    },
    {
      key: "personalTraining",
      title: "PT session (1 hour)",
      description: "One-on-one training with a certified trainer",
      amount: PT_SESSION_PRICE,
    },
  ];

  const paymentOptions: {
    id: BookingFormData["paymentMethod"];
    label: string;
    subtitle: string;
    icon: ReactNode;
  }[] = [
    {
      id: "card",
      label: "Card",
      subtitle: "Visa, Mastercard, Amex",
      icon: <HiOutlineCreditCard className="size-5" />,
    },
    {
      id: "mobile_wallet",
      label: "Mobile wallet",
      subtitle: "Apple Pay, Google Pay and local wallets",
      icon: <HiOutlineDeviceMobile className="size-5" />,
    },
    {
      id: "bank_transfer",
      label: "Bank transfer",
      subtitle: "Confirmed once received",
      icon: <HiOutlineLibrary className="size-5" />,
    },
  ];

  const stepIndex = STEPS.findIndex((s) => s.id === step);

  const ticketRow = (label: ReactNode, value: ReactNode, accent = false) => (
    <div className="flex items-baseline justify-between gap-4 text-sm">
      <span className={accent ? "text-stamp-teal" : "text-gray-500"}>
        {label}
      </span>
      <span
        className={cn(
          "whitespace-nowrap tabular-nums",
          accent ? "text-stamp-teal" : "text-gray-900",
        )}
      >
        {value}
      </span>
    </div>
  );

  const passLabel = formData.passType
    ? `${formData.passType.charAt(0).toUpperCase()}${formData.passType.slice(1)} pass`
    : "Pass";

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 backdrop-blur-sm sm:items-center sm:p-4"
      aria-labelledby="booking-modal-title"
      role="dialog"
      aria-modal="true"
      onClick={resetAndClose}
    >
      <div
        className="relative flex max-h-[92dvh] w-full flex-col overflow-hidden rounded-t-[2rem] border border-gray-900/[0.06] bg-surface shadow-lift sm:max-h-[90dvh] sm:max-w-2xl sm:rounded-[2rem]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Grab handle (mobile sheet) */}
        <div className="flex justify-center pt-2.5 sm:hidden" aria-hidden="true">
          <span className="h-1 w-10 rounded-full bg-gray-900/10" />
        </div>

        {/* Header */}
        <div className="shrink-0 border-b border-dashed border-gray-900/10 px-5 pt-3 pb-4 sm:px-7 sm:pt-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3">
              <div className="relative flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-volt-soft text-lg font-semibold text-ink">
                {gym.coverImage ? (
                  <Image
                    src={gym.coverImage}
                    alt=""
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                ) : (
                  gym.name.charAt(0)
                )}
              </div>
              <div className="min-w-0">
                <p className={monoLabel}>
                  {cityCode(gym.address.city)} · {gym.country}
                </p>
                <h3
                  id="booking-modal-title"
                  className="mt-0.5 text-lg leading-tight font-semibold tracking-tight text-ink"
                >
                  {step === "confirmation" ? "Booking confirmed" : gym.name}
                </h3>
                {step === "confirmation" && (
                  <p className="text-sm text-gray-500">{gym.name}</p>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={resetAndClose}
              aria-label="Close booking"
              className="flex size-10 shrink-0 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-900/[0.05] hover:text-ink"
            >
              <HiOutlineX className="size-5" />
            </button>
          </div>

          {/* Step indicator */}
          {step !== "confirmation" && (
            <ol
              className="mt-4 flex items-center gap-1 rounded-full bg-gray-900/[0.04] p-1"
              aria-label="Booking progress"
            >
              {STEPS.map((s, i) => {
                const done = i < stepIndex;
                const current = i === stepIndex;
                return (
                  <li
                    key={s.id}
                    aria-current={current ? "step" : undefined}
                    className={cn(
                      "flex flex-1 items-center justify-center gap-1.5 rounded-full px-2 py-1.5 text-xs font-medium whitespace-nowrap transition-colors duration-300 ease-out-expo sm:text-sm",
                      current && "bg-ink text-white shadow-soft",
                      done && "bg-volt-soft text-ink",
                      !current && !done && "text-gray-400",
                    )}
                  >
                    {done ? (
                      <HiOutlineCheck className="size-3.5 shrink-0" />
                    ) : (
                      <span className="font-mono text-[11px]">{i + 1}</span>
                    )}
                    {s.label}
                  </li>
                );
              })}
            </ol>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-6 sm:px-7">
          {/* Step 1: Pass selection */}
          {step === "pass-selection" && (
            <div className="space-y-5">
              <div>
                <p className={monoLabel}>Choose a pass</p>
                <h4 className="mt-1 text-xl font-semibold tracking-tight text-ink">
                  Pick the plan that fits your training
                </h4>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {passOptions.map((option) => {
                  const selected = formData.passType === option.type;
                  return (
                    <button
                      key={option.type}
                      type="button"
                      onClick={() => handlePassTypeSelect(option.type)}
                      aria-pressed={selected}
                      className={cn(
                        "group relative flex flex-col rounded-3xl border border-gray-900/[0.06] p-5 text-start shadow-soft transition-all duration-300 ease-out-expo hover:-translate-y-0.5 hover:shadow-lift focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50",
                        option.popular ? "bg-volt-soft" : "bg-surface",
                        selected && "ring-2 ring-ink",
                      )}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <h5 className="text-base font-semibold text-ink">
                          {option.title}
                        </h5>
                        {option.popular && (
                          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-ink px-2.5 py-1 text-[11px] font-semibold whitespace-nowrap text-white">
                            <HiStar className="size-3" />
                            Popular
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-sm text-gray-500">
                        {option.description}
                      </p>
                      <p className="mt-4 text-2xl font-semibold tracking-tight whitespace-nowrap text-ink tabular-nums">
                        {price(option.amount)}
                      </p>
                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 text-sm font-medium text-stamp-teal">
                          <HiOutlineCheck className="size-4 shrink-0" />
                          {option.validity}
                        </span>
                        {option.saving !== undefined && (
                          <span className="inline-flex items-center gap-1 rounded-full border border-dashed border-stamp-ochre/60 px-2 py-0.5 text-xs font-semibold whitespace-nowrap text-stamp-ochre">
                            <HiSparkles className="size-3" />
                            Save {price(option.saving)}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 2: Details */}
          {step === "details" && (
            <div className="space-y-7">
              {/* Start date */}
              <div>
                <Input
                  label="Start date"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) =>
                    setFormData({ ...formData, startDate: e.target.value })
                  }
                  min={new Date().toISOString().split("T")[0]}
                  hint="Your pass is valid from this date"
                />
              </div>

              {/* Add-ons */}
              <fieldset>
                <legend className={cn(monoLabel, "mb-3")}>
                  Add-ons · optional
                </legend>
                <div className="space-y-2.5">
                  {addOnOptions.map((addOn) => {
                    const checked = formData.addOns[addOn.key];
                    return (
                      <label
                        key={addOn.key}
                        className={cn(
                          "flex cursor-pointer items-start gap-3 rounded-2xl border border-gray-900/[0.06] p-4 transition-colors",
                          checked
                            ? "bg-volt-soft ring-2 ring-ink"
                            : "bg-surface hover:bg-gray-900/[0.02]",
                        )}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              addOns: {
                                ...formData.addOns,
                                [addOn.key]: e.target.checked,
                              },
                            })
                          }
                          className="mt-0.5 size-4 shrink-0 accent-ink"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-baseline justify-between gap-3">
                            <span className="font-medium text-ink">
                              {addOn.title}
                            </span>
                            <span className="text-sm whitespace-nowrap text-gray-700 tabular-nums">
                              + {price(addOn.amount)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500">
                            {addOn.description}
                          </p>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </fieldset>

              {/* Promo code */}
              <div>
                <label
                  htmlFor="booking-promo"
                  className="mb-1.5 block text-sm font-medium text-gray-700"
                >
                  Promo code
                </label>
                <div className="flex gap-2">
                  <Input
                    id="booking-promo"
                    placeholder="Enter code"
                    value={formData.promoCode}
                    onChange={(e) =>
                      setFormData({ ...formData, promoCode: e.target.value })
                    }
                    disabled={promoApplied}
                  />
                  <button
                    type="button"
                    onClick={handleApplyPromo}
                    disabled={promoApplied || !formData.promoCode}
                    className="h-12 shrink-0 rounded-full border border-gray-900/10 bg-surface px-5 text-sm font-medium whitespace-nowrap text-ink transition-colors hover:bg-gray-900/[0.04] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {promoApplied ? "Applied" : "Apply"}
                  </button>
                </div>
                {promoApplied ? (
                  <p className="mt-1.5 flex items-center gap-1 text-sm text-stamp-teal">
                    <HiCheckCircle className="size-4 shrink-0" />
                    10% discount applied
                  </p>
                ) : (
                  <p className="mt-1.5 text-xs text-gray-500">
                    Try FIRST10 for 10% off
                  </p>
                )}
              </div>

              {/* Price summary ticket */}
              <div className="space-y-2 rounded-3xl border-2 border-dashed border-gray-900/15 p-5">
                <p className={cn(monoLabel, "mb-1")}>Summary</p>
                {ticketRow("Pass price", price(getPassPrice()))}
                {getAddOnsTotal() > 0 &&
                  ticketRow("Add-ons", price(getAddOnsTotal()))}
                {getDiscount() > 0 &&
                  ticketRow("Discount", `− ${price(getDiscount())}`, true)}
                <div className="mt-2 flex items-baseline justify-between gap-4 border-t border-dashed border-gray-900/15 pt-3">
                  <span className="font-semibold text-ink">Total</span>
                  <span className="text-lg font-semibold whitespace-nowrap text-ink tabular-nums">
                    {price(getTotal())}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Payment */}
          {step === "payment" && (
            <div className="space-y-6">
              {/* Payment method */}
              <fieldset>
                <legend className={cn(monoLabel, "mb-3")}>Payment method</legend>
                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                  {paymentOptions.map((option) => {
                    const selected = formData.paymentMethod === option.id;
                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() =>
                          setFormData({ ...formData, paymentMethod: option.id })
                        }
                        aria-pressed={selected}
                        className={cn(
                          "flex items-center gap-3 rounded-2xl border border-gray-900/[0.06] p-4 text-start shadow-soft transition-all duration-300 ease-out-expo focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 sm:flex-col sm:items-start",
                          selected
                            ? "bg-volt-soft ring-2 ring-ink"
                            : "bg-surface hover:bg-gray-900/[0.02]",
                        )}
                      >
                        <span
                          className={cn(
                            "flex size-10 shrink-0 items-center justify-center rounded-full",
                            selected
                              ? "bg-ink text-white"
                              : "bg-gray-900/[0.05] text-gray-700",
                          )}
                        >
                          {option.icon}
                        </span>
                        <span className="min-w-0">
                          <span className="block text-sm font-semibold text-ink">
                            {option.label}
                          </span>
                          <span className="block text-xs text-gray-500">
                            {option.subtitle}
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </fieldset>

              {/* Card form */}
              {formData.paymentMethod === "card" && (
                <div className="space-y-4">
                  <Input
                    label="Card number"
                    placeholder="1234 5678 9012 3456"
                    inputMode="numeric"
                    autoComplete="cc-number"
                  />
                  <Input
                    label="Name on card"
                    placeholder="Full name"
                    autoComplete="cc-name"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Expiry date"
                      placeholder="MM/YY"
                      autoComplete="cc-exp"
                    />
                    <Input
                      label="CVC"
                      placeholder="123"
                      inputMode="numeric"
                      autoComplete="cc-csc"
                    />
                  </div>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="size-4 accent-ink" />
                    <span className="text-sm text-gray-600">
                      Save card for future bookings
                    </span>
                  </label>
                </div>
              )}

              {/* Mobile wallet */}
              {formData.paymentMethod === "mobile_wallet" && (
                <div className="rounded-3xl bg-volt-soft p-6 text-center">
                  <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-surface text-ink shadow-soft">
                    <HiOutlineDeviceMobile className="size-6" />
                  </div>
                  <p className="text-sm text-gray-700">
                    You&apos;ll confirm the payment in your wallet app.
                  </p>
                  <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                    {["Apple Pay", "Google Pay", "Local wallets"].map((w) => (
                      <span
                        key={w}
                        className="rounded-full bg-surface px-3.5 py-1.5 text-sm font-medium whitespace-nowrap text-ink shadow-soft"
                      >
                        {w}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Bank transfer */}
              {formData.paymentMethod === "bank_transfer" && (
                <div className="flex items-start gap-3 rounded-3xl border border-dashed border-stamp-ochre/50 p-4">
                  <HiOutlineExclamation className="mt-0.5 size-5 shrink-0 text-stamp-ochre" />
                  <div className="text-sm">
                    <p className="mb-1 font-medium text-ink">
                      Manual verification required
                    </p>
                    <p className="text-gray-600">
                      Bank transfer details will be sent by email. Your booking
                      is confirmed once the payment is verified (usually within
                      24 hours).
                    </p>
                  </div>
                </div>
              )}

              {/* Order summary ticket */}
              <div className="space-y-2 rounded-3xl border-2 border-dashed border-gray-900/15 p-5">
                <p className={cn(monoLabel, "mb-1")}>Order summary</p>
                {ticketRow(passLabel, price(getPassPrice()))}
                {getAddOnsTotal() > 0 &&
                  ticketRow("Add-ons", price(getAddOnsTotal()))}
                {getDiscount() > 0 &&
                  ticketRow(
                    "Discount (FIRST10)",
                    `− ${price(getDiscount())}`,
                    true,
                  )}
                <div className="mt-2 flex items-baseline justify-between gap-4 border-t border-dashed border-gray-900/15 pt-3">
                  <span className="font-semibold text-ink">Total amount</span>
                  <span className="text-xl font-semibold whitespace-nowrap text-ink tabular-nums">
                    {price(getTotal())}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Confirmation */}
          {step === "confirmation" && (
            <div className="py-4 text-center">
              <div className="mx-auto mb-5 flex size-16 items-center justify-center rounded-full bg-volt text-ink">
                <HiOutlineCheck className="size-8" />
              </div>

              <h3 className="mb-1 text-2xl font-semibold tracking-tight text-ink">
                You&apos;re all set
              </h3>
              <p className="mb-6 text-gray-600">
                Your {formData.passType} pass for {gym.name} is ready
              </p>

              {/* QR code placeholder */}
              <div className="mx-auto mb-6 inline-block rounded-3xl border border-gray-900/[0.06] bg-surface p-5 shadow-soft">
                <div className="flex size-44 items-center justify-center rounded-2xl bg-gray-900/[0.04]">
                  <div className="text-center">
                    <HiOutlineQrcode className="mx-auto mb-2 size-14 text-gray-400" />
                    <p className="text-sm text-gray-500">QR code</p>
                  </div>
                </div>
                <p className={cn(monoLabel, "mt-4 text-gray-500")}>
                  Booking BKG{Math.floor(Math.random() * 10000)}
                </p>
              </div>

              {/* Pass details ticket */}
              <div className="mb-6 space-y-2 rounded-3xl border-2 border-dashed border-gray-900/15 p-5 text-start">
                {ticketRow("Valid from", formData.startDate)}
                {ticketRow(
                  "Valid until",
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
                    .split("T")[0],
                )}
                {ticketRow("Amount paid", price(getTotal()))}
              </div>

              <p className="mb-6 text-sm text-gray-500">
                A confirmation email has been sent to your registered email
                address.
              </p>

              <div className="flex flex-col-reverse gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={resetAndClose}
                  className="h-12 flex-1 rounded-full border border-gray-900/10 bg-surface px-6 text-sm font-medium whitespace-nowrap text-ink transition-colors hover:bg-gray-900/[0.04]"
                >
                  Close
                </button>
                <button
                  type="button"
                  className="h-12 flex-1 rounded-full bg-ink px-6 text-sm font-medium whitespace-nowrap text-white transition-colors hover:bg-gray-800"
                >
                  View my passes
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        {step !== "confirmation" && step !== "pass-selection" && (
          <div className="flex shrink-0 items-center justify-between gap-3 border-t border-gray-900/[0.06] bg-surface px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-7">
            <button
              type="button"
              onClick={() => {
                if (step === "payment") setStep("details");
                else if (step === "details") setStep("pass-selection");
              }}
              className="inline-flex h-12 shrink-0 items-center gap-1 rounded-full border border-gray-900/10 bg-surface ps-4 pe-5 text-sm font-medium whitespace-nowrap text-ink transition-colors hover:bg-gray-900/[0.04]"
            >
              <HiOutlineChevronLeft className="size-4 rtl:rotate-180" />
              Back
            </button>
            {step === "details" && (
              <button
                type="button"
                onClick={() => setStep("payment")}
                disabled={!formData.passType}
                className="inline-flex h-12 items-center justify-center gap-1.5 rounded-full bg-ink ps-6 pe-5 text-sm font-medium whitespace-nowrap text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50 max-sm:flex-1"
              >
                Continue to payment
                <HiOutlineChevronRight className="size-4 rtl:rotate-180" />
              </button>
            )}
            {step === "payment" && (
              <button
                type="button"
                onClick={handlePayment}
                disabled={isProcessing}
                aria-busy={isProcessing}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-ink px-6 text-sm font-medium whitespace-nowrap text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-70 max-sm:flex-1"
              >
                {isProcessing ? (
                  <>
                    <span
                      aria-hidden="true"
                      className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white"
                    />
                    Processing…
                  </>
                ) : (
                  `Pay ${price(getTotal())}`
                )}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
