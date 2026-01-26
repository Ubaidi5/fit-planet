"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

type Step = "phone" | "otp";

export default function LoginPage() {
  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate phone number (Pakistan format)
    const phoneRegex = /^(\+92|0)?3[0-9]{9}$/;
    if (!phoneRegex.test(phone.replace(/\s/g, ""))) {
      setError("Please enter a valid Pakistani phone number");
      return;
    }

    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);
    setStep("otp");
  };

  const handleOTPChange = (index: number, value: string) => {
    if (value.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const otpValue = otp.join("");
    if (otpValue.length !== 6) {
      setError("Please enter the complete 6-digit code");
      return;
    }

    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);

    // In real app, redirect to dashboard after successful login
    window.location.href = "/app/dashboard";
  };

  const handleResendOTP = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
    setOtp(["", "", "", "", "", ""]);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 mb-8">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-linear-to-br from-emerald-500 to-teal-600">
              <svg
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <span className="text-xl font-bold text-gray-900">Fit Planet</span>
          </Link>

          {step === "phone" ? (
            <>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Welcome back!
              </h2>
              <p className="text-gray-600 mb-8">
                Sign in with your phone number to access your passes
              </p>

              <form onSubmit={handleSendOTP} className="space-y-6">
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Phone Number
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                      +92
                    </span>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="3XX XXXXXXX"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="pl-14"
                      required
                    />
                  </div>
                  {error && (
                    <p className="mt-2 text-sm text-red-600">{error}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  fullWidth
                  loading={isLoading}
                  loadingText="Sending OTP..."
                >
                  Continue
                </Button>
              </form>

              <p className="mt-8 text-center text-sm text-gray-600">
                Don&apos;t have an account?{" "}
                <Link
                  href="/app/register"
                  className="font-medium text-emerald-600 hover:text-emerald-500"
                >
                  Sign up
                </Link>
              </p>
            </>
          ) : (
            <>
              <button
                onClick={() => setStep("phone")}
                className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
              >
                <svg
                  className="h-5 w-5 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Back
              </button>

              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Verify your phone
              </h2>
              <p className="text-gray-600 mb-8">
                We sent a 6-digit code to{" "}
                <span className="font-medium text-gray-900">+92 {phone}</span>
              </p>

              <form onSubmit={handleVerifyOTP} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Enter verification code
                  </label>
                  <div className="flex gap-2 justify-between">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        id={`otp-${index}`}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOTPChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        className={cn(
                          "w-12 h-14 text-center text-xl font-semibold rounded-lg border",
                          "focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500",
                          "transition-colors",
                          digit
                            ? "border-emerald-500 bg-emerald-50"
                            : "border-gray-300 bg-white",
                        )}
                      />
                    ))}
                  </div>
                  {error && (
                    <p className="mt-2 text-sm text-red-600">{error}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  fullWidth
                  loading={isLoading}
                  loadingText="Verifying..."
                >
                  Verify & Sign In
                </Button>

                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    Didn&apos;t receive the code?{" "}
                    <button
                      type="button"
                      onClick={handleResendOTP}
                      className="font-medium text-emerald-600 hover:text-emerald-500"
                      disabled={isLoading}
                    >
                      Resend
                    </button>
                  </p>
                </div>
              </form>
            </>
          )}

          {/* Security Note */}
          <div className="mt-10 flex items-start gap-3 p-4 bg-gray-100 rounded-lg">
            <svg
              className="h-5 w-5 text-gray-500 shrink-0 mt-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            <div>
              <p className="text-sm font-medium text-gray-700">
                Phone as Identity
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Your phone number is your digital identity across all partner
                gyms. No cards, no hassle.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Image/Info */}
      <div className="hidden lg:flex lg:w-1/2 bg-linear-to-br from-emerald-600 to-teal-700 lg:flex-col lg:justify-center lg:px-12 xl:px-16">
        <div className="max-w-md">
          <h2 className="text-3xl font-bold text-white mb-6">
            One Account, All Gyms
          </h2>
          <p className="text-emerald-100 text-lg mb-8">
            Access any partner gym with just your phone. No membership cards, no
            paperwork. Your fitness journey, simplified.
          </p>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/20">
                <svg
                  className="h-5 w-5 text-white"
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
              <div>
                <h3 className="font-semibold text-white">Phone-Based Entry</h3>
                <p className="text-emerald-100 text-sm mt-1">
                  Show your QR code at any gym. Quick scan and you&apos;re in.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/20">
                <svg
                  className="h-5 w-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-white">Secure & Private</h3>
                <p className="text-emerald-100 text-sm mt-1">
                  Your data is encrypted. OTP verification keeps your account
                  safe.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/20">
                <svg
                  className="h-5 w-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-white">Track Your Journey</h3>
                <p className="text-emerald-100 text-sm mt-1">
                  View check-in history, manage passes, and track your fitness
                  progress.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
