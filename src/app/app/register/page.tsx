"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import Select from "@/components/ui/Select";

type Step = "info" | "phone" | "otp";

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  gender: "male" | "female" | "other" | "";
  dateOfBirth: string;
}

export default function RegisterPage() {
  const [step, setStep] = useState<Step>("info");
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    phone: "",
    gender: "",
    dateOfBirth: "",
  });
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);

  const handleInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.fullName.trim()) {
      setError("Please enter your full name");
      return;
    }

    if (!formData.email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }

    if (!acceptTerms) {
      setError("Please accept the terms and conditions");
      return;
    }

    setStep("phone");
  };

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const phoneRegex = /^(\+92|0)?3[0-9]{9}$/;
    if (!phoneRegex.test(formData.phone.replace(/\s/g, ""))) {
      setError("Please enter a valid Pakistani phone number");
      return;
    }

    setIsLoading(true);

    try {
      // Format phone number
      let formattedPhone = formData.phone.replace(/\s/g, "");
      if (formattedPhone.startsWith("0")) {
        formattedPhone = "+92" + formattedPhone.substring(1);
      } else if (!formattedPhone.startsWith("+92")) {
        formattedPhone = "+92" + formattedPhone;
      }

      const response = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: formattedPhone }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to send OTP");
        setIsLoading(false);
        return;
      }

      console.log("OTP sent successfully. Use: 123456");
      setFormData({ ...formData, phone: formattedPhone });
      setStep("otp");
    } catch (error) {
      console.error("Send OTP error:", error);
      setError("Failed to send OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPChange = (index: number, value: string) => {
    if (value.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

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

    // Verify OTP (hardcoded as 123456)
    if (otpValue !== "123456") {
      setError("Invalid OTP. Please try again.");
      return;
    }

    setIsLoading(true);

    try {
      // Register user
      const registerResponse = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const registerData = await registerResponse.json();

      if (!registerResponse.ok) {
        setError(registerData.error || "Registration failed");
        setIsLoading(false);
        return;
      }

      // Auto-login after registration
      const { signIn } = await import("next-auth/react");

      const result = await signIn("phone-otp", {
        phone: formData.phone,
        otp: otpValue,
        redirect: false,
      });

      if (result?.error) {
        setError(
          "Registration successful but login failed. Please login manually.",
        );
        setIsLoading(false);
        setTimeout(() => {
          window.location.href = "/app/login";
        }, 2000);
        return;
      }

      if (result?.ok) {
        window.location.href = "/app/dashboard";
      }
    } catch (error) {
      console.error("Registration error:", error);
      setError("Registration failed. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-md">
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

          {/* Progress Steps */}
          <div className="flex items-center gap-2 mb-8">
            {["info", "phone", "otp"].map((s, i) => (
              <div key={s} className="flex items-center">
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                    step === s
                      ? "bg-emerald-600 text-white"
                      : i < ["info", "phone", "otp"].indexOf(step)
                        ? "bg-emerald-100 text-emerald-600"
                        : "bg-gray-200 text-gray-500",
                  )}
                >
                  {i < ["info", "phone", "otp"].indexOf(step) ? (
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    i + 1
                  )}
                </div>
                {i < 2 && (
                  <div
                    className={cn(
                      "w-12 h-0.5 mx-2",
                      i < ["info", "phone", "otp"].indexOf(step)
                        ? "bg-emerald-600"
                        : "bg-gray-200",
                    )}
                  />
                )}
              </div>
            ))}
          </div>

          {step === "info" && (
            <>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Create your account
              </h2>
              <p className="text-gray-600 mb-8">
                Join Fit Planet and access gyms everywhere
              </p>

              <form onSubmit={handleInfoSubmit} className="space-y-5">
                <div>
                  <label
                    htmlFor="fullName"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Full Name
                  </label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Muhammad Ali"
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Email Address
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="gender"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Gender
                    </label>
                    <Select
                      id="gender"
                      value={formData.gender}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          gender: e.target.value as FormData["gender"],
                        })
                      }
                      className="px-20"
                    >
                      <option value="">Select</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </Select>
                  </div>

                  <div>
                    <label
                      htmlFor="dob"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Date of Birth
                    </label>
                    <Input
                      id="dob"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          dateOfBirth: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                    className="mt-1 h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                  />
                  <label htmlFor="terms" className="text-sm text-gray-600">
                    I agree to the{" "}
                    <Link
                      href="/terms"
                      className="text-emerald-600 hover:text-emerald-500"
                    >
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                      href="/privacy"
                      className="text-emerald-600 hover:text-emerald-500"
                    >
                      Privacy Policy
                    </Link>
                  </label>
                </div>

                {error && <p className="text-sm text-red-600">{error}</p>}

                <Button type="submit" fullWidth>
                  Continue
                </Button>
              </form>

              <p className="mt-6 text-center text-sm text-gray-600">
                Already have an account?{" "}
                <Link
                  href="/app/login"
                  className="font-medium text-emerald-600 hover:text-emerald-500"
                >
                  Sign in
                </Link>
              </p>
            </>
          )}

          {step === "phone" && (
            <>
              <button
                onClick={() => setStep("info")}
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
                Add your phone number
              </h2>
              <p className="text-gray-600 mb-8">
                Your phone number will be your digital identity for gym access
              </p>

              <form onSubmit={handlePhoneSubmit} className="space-y-6">
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
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
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
                  Send Verification Code
                </Button>
              </form>
            </>
          )}

          {step === "otp" && (
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
                <span className="font-medium text-gray-900">
                  +92 {formData.phone}
                </span>
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
                  loadingText="Creating account..."
                >
                  Complete Registration
                </Button>

                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    Didn&apos;t receive the code?{" "}
                    <button
                      type="button"
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
        </div>
      </div>

      {/* Right Side - Image/Info */}
      <div className="hidden lg:flex lg:w-1/2 bg-linear-to-br from-emerald-600 to-teal-700 lg:flex-col lg:justify-center lg:px-12 xl:px-16">
        <div className="max-w-md">
          <h2 className="text-3xl font-bold text-white mb-6">
            Your Fitness Journey Starts Here
          </h2>
          <p className="text-emerald-100 text-lg mb-8">
            Create your free account and get instant access to hundreds of gyms
            across Pakistan.
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
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-white">Discover Gyms</h3>
                <p className="text-emerald-100 text-sm mt-1">
                  Find the perfect gym near you with detailed profiles and
                  reviews.
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
                    d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-white">Flexible Passes</h3>
                <p className="text-emerald-100 text-sm mt-1">
                  Day, week, or month passes. No long-term commitments required.
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
                    d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-white">Digital Check-In</h3>
                <p className="text-emerald-100 text-sm mt-1">
                  Skip the counter. Just show your QR code and start your
                  workout.
                </p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-12 grid grid-cols-3 gap-6">
            <div>
              <p className="text-3xl font-bold text-white">500+</p>
              <p className="text-emerald-100 text-sm">Partner Gyms</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white">50K+</p>
              <p className="text-emerald-100 text-sm">Active Users</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white">4.8★</p>
              <p className="text-emerald-100 text-sm">App Rating</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
