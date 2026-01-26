"use client";

import Link from "next/link";
import { useState } from "react";
import { Input } from "@/components/ui/Input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/Card";
import { cn } from "@/lib/utils";

interface FormData {
  // Owner Details
  ownerName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  // Gym Details
  gymName: string;
  gymAddress: string;
  city: string;
}

export default function StudioRegisterPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    ownerName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    gymName: "",
    gymAddress: "",
    city: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.ownerName.trim()) {
      newErrors.ownerName = "Full name is required";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.phone) {
      newErrors.phone = "Phone number is required";
    } else if (
      !/^(\+92|0)?[0-9]{10}$/.test(formData.phone.replace(/\s/g, ""))
    ) {
      newErrors.phone = "Please enter a valid Pakistani phone number";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.gymName.trim()) {
      newErrors.gymName = "Gym name is required";
    }

    if (!formData.gymAddress.trim()) {
      newErrors.gymAddress = "Gym address is required";
    }

    if (!formData.city.trim()) {
      newErrors.city = "City is required";
    }

    if (!agreeToTerms) {
      newErrors.terms = "You must agree to the terms and conditions";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handleBack = () => {
    setStep(1);
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateStep2()) return;

    setIsLoading(true);

    // Simulate API call (UI only - no actual backend)
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsLoading(false);
    console.log("Registration submitted:", formData);
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Side - Branding (hidden on mobile) */}
      <div className="hidden bg-gradient-to-br from-emerald-600 to-teal-700 lg:flex lg:w-1/2 lg:flex-col lg:justify-center lg:px-12 xl:px-16">
        <div className="mx-auto max-w-md">
          {/* Main Heading */}
          <h1 className="text-4xl font-bold text-white">
            Grow Your Gym Business with Fit Planet
          </h1>
          <p className="mt-4 text-lg text-emerald-100">
            Join 500+ gyms already on our platform and reach thousands of
            fitness enthusiasts looking for their perfect gym.
          </p>

          {/* Features List */}
          <div className="mt-10 space-y-6">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-white/20">
                <svg
                  className="h-5 w-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-white">
                  Online Presence Made Easy
                </h3>
                <p className="mt-1 text-sm text-emerald-200">
                  Get a professional gym profile without building your own
                  website
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-white/20">
                <svg
                  className="h-5 w-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-white">
                  Instant Booking & Payments
                </h3>
                <p className="mt-1 text-sm text-emerald-200">
                  Accept bookings 24/7 and receive payments directly to your
                  account
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-white/20">
                <svg
                  className="h-5 w-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-white">
                  Analytics & Insights
                </h3>
                <p className="mt-1 text-sm text-emerald-200">
                  Track bookings, revenue, and member activity in real-time
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-white/20">
                <svg
                  className="h-5 w-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-white">
                  Reach New Customers
                </h3>
                <p className="mt-1 text-sm text-emerald-200">
                  Get discovered by thousands of fitness seekers in your area
                </p>
              </div>
            </div>
          </div>

          {/* Trust Badge */}
          <div className="mt-12 flex items-center gap-2 rounded-lg bg-white/10 p-4">
            <svg
              className="h-6 w-6 text-emerald-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
              />
            </svg>
            <span className="text-sm text-emerald-100">
              Free to join · No hidden fees · Cancel anytime
            </span>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex w-full flex-col justify-center px-4 py-12 sm:px-6 lg:w-1/2 lg:px-8 xl:px-12">
        <div className="mx-auto w-full max-w-md">
          {/* Logo */}
          <Link href="/" className="mb-8 flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600">
              <svg
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
                />
              </svg>
            </div>
            <span className="text-xl font-bold text-gray-100">Fit Planet</span>
            <span className="ml-1 rounded bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
              Studio
            </span>
          </Link>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium",
                    step >= 1
                      ? "bg-emerald-600 text-white"
                      : "bg-gray-200 text-gray-600",
                  )}
                >
                  {step > 1 ? (
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4.5 12.75l6 6 9-13.5"
                      />
                    </svg>
                  ) : (
                    "1"
                  )}
                </div>
                <span
                  className={cn(
                    "ml-2 text-sm font-medium",
                    step >= 1 ? "text-emerald-600" : "text-gray-500",
                  )}
                >
                  Your Details
                </span>
              </div>
              <div
                className={cn(
                  "h-0.5 w-12 sm:w-20",
                  step > 1 ? "bg-emerald-600" : "bg-gray-200",
                )}
              />
              <div className="flex items-center">
                <div
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium",
                    step >= 2
                      ? "bg-emerald-600 text-white"
                      : "bg-gray-200 text-gray-600",
                  )}
                >
                  2
                </div>
                <span
                  className={cn(
                    "ml-2 text-sm font-medium",
                    step >= 2 ? "text-emerald-600" : "text-gray-500",
                  )}
                >
                  Gym Details
                </span>
              </div>
            </div>
          </div>

          {/* Card */}
          <Card variant="elevated" padding="lg">
            <CardHeader>
              <CardTitle as="h1">
                {step === 1 ? "Create your account" : "Tell us about your gym"}
              </CardTitle>
              <CardDescription>
                {step === 1
                  ? "Enter your personal details to get started"
                  : "Basic information to set up your gym profile"}
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                {step === 1 ? (
                  <>
                    {/* Step 1: Owner Details */}
                    <Input
                      label="Full name"
                      type="text"
                      name="ownerName"
                      placeholder="Ahmed Khan"
                      value={formData.ownerName}
                      onChange={handleChange}
                      error={errors.ownerName}
                      disabled={isLoading}
                      leftIcon={
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={1.5}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                          />
                        </svg>
                      }
                    />

                    <Input
                      label="Email address"
                      type="email"
                      name="email"
                      placeholder="you@yourgym.com"
                      value={formData.email}
                      onChange={handleChange}
                      error={errors.email}
                      disabled={isLoading}
                      leftIcon={
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={1.5}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                          />
                        </svg>
                      }
                    />

                    <Input
                      label="Phone number"
                      type="tel"
                      name="phone"
                      placeholder="+92 300 1234567"
                      value={formData.phone}
                      onChange={handleChange}
                      error={errors.phone}
                      disabled={isLoading}
                      hint="We'll use this for account verification"
                      leftIcon={
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={1.5}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
                          />
                        </svg>
                      }
                    />

                    <Input
                      label="Password"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                      error={errors.password}
                      disabled={isLoading}
                      hint="At least 8 characters"
                      leftIcon={
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={1.5}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                          />
                        </svg>
                      }
                      rightIcon={
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="text-gray-400 hover:text-gray-600 focus:outline-none"
                          tabIndex={-1}
                        >
                          {showPassword ? (
                            <svg
                              className="h-5 w-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={1.5}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                              />
                            </svg>
                          ) : (
                            <svg
                              className="h-5 w-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={1.5}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                            </svg>
                          )}
                        </button>
                      }
                    />

                    <Input
                      label="Confirm password"
                      type={showPassword ? "text" : "password"}
                      name="confirmPassword"
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      error={errors.confirmPassword}
                      disabled={isLoading}
                      leftIcon={
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={1.5}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                          />
                        </svg>
                      }
                    />

                    {/* Next Button */}
                    <button
                      type="button"
                      onClick={handleNext}
                      className={cn(
                        "flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 text-sm font-semibold text-white shadow-sm",
                        "transition-all duration-200",
                        "hover:bg-emerald-700 hover:shadow-md",
                        "focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2",
                      )}
                    >
                      Continue
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                        />
                      </svg>
                    </button>
                  </>
                ) : (
                  <>
                    {/* Step 2: Gym Details */}
                    <Input
                      label="Gym name"
                      type="text"
                      name="gymName"
                      placeholder="FitZone Gym"
                      value={formData.gymName}
                      onChange={handleChange}
                      error={errors.gymName}
                      disabled={isLoading}
                      leftIcon={
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={1.5}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z"
                          />
                        </svg>
                      }
                    />

                    <Input
                      label="Gym address"
                      type="text"
                      name="gymAddress"
                      placeholder="123 Fitness Street, Block 5"
                      value={formData.gymAddress}
                      onChange={handleChange}
                      error={errors.gymAddress}
                      disabled={isLoading}
                      leftIcon={
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={1.5}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                          />
                        </svg>
                      }
                    />

                    <Input
                      label="City"
                      type="text"
                      name="city"
                      placeholder="Karachi"
                      value={formData.city}
                      onChange={handleChange}
                      error={errors.city}
                      disabled={isLoading}
                      leftIcon={
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={1.5}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z"
                          />
                        </svg>
                      }
                    />

                    {/* Terms & Conditions */}
                    <div>
                      <label className="flex cursor-pointer items-start gap-3">
                        <input
                          type="checkbox"
                          checked={agreeToTerms}
                          onChange={(e) => setAgreeToTerms(e.target.checked)}
                          className="mt-0.5 h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                        />
                        <span className="text-sm text-gray-600">
                          I agree to Fit Planet&apos;s{" "}
                          <Link
                            href="/terms"
                            className="font-medium text-emerald-600 hover:text-emerald-700"
                          >
                            Terms of Service
                          </Link>{" "}
                          and{" "}
                          <Link
                            href="/privacy"
                            className="font-medium text-emerald-600 hover:text-emerald-700"
                          >
                            Privacy Policy
                          </Link>
                        </span>
                      </label>
                      {errors.terms && (
                        <p className="mt-1.5 flex items-center gap-1 text-sm text-red-600">
                          <svg
                            className="h-4 w-4 flex-shrink-0"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                            />
                          </svg>
                          {errors.terms}
                        </p>
                      )}
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={handleBack}
                        className={cn(
                          "flex h-12 flex-1 items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white text-sm font-semibold text-gray-700 shadow-sm",
                          "transition-all duration-200",
                          "hover:bg-gray-50",
                          "focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2",
                        )}
                      >
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                          />
                        </svg>
                        Back
                      </button>
                      <button
                        type="submit"
                        disabled={isLoading}
                        className={cn(
                          "relative flex h-12 flex-[2] items-center justify-center rounded-lg bg-emerald-600 text-sm font-semibold text-white shadow-sm",
                          "transition-all duration-200",
                          "hover:bg-emerald-700 hover:shadow-md",
                          "focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2",
                          "disabled:cursor-not-allowed disabled:opacity-70",
                        )}
                      >
                        {isLoading ? (
                          <>
                            <svg
                              className="mr-2 h-5 w-5 animate-spin text-white"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              />
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              />
                            </svg>
                            Creating account...
                          </>
                        ) : (
                          "Create Studio Account"
                        )}
                      </button>
                    </div>
                  </>
                )}
              </form>
            </CardContent>

            <CardFooter>
              <p className="text-center text-sm text-gray-600">
                Already have an account?{" "}
                <Link
                  href="/studio/login"
                  className="font-medium text-emerald-600 hover:text-emerald-700"
                >
                  Sign in
                </Link>
              </p>
            </CardFooter>
          </Card>

          {/* Back to Website */}
          <p className="mt-8 text-center text-sm text-gray-500">
            <Link
              href="/"
              className="inline-flex items-center gap-1 hover:text-gray-700"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                />
              </svg>
              Back to main website
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
