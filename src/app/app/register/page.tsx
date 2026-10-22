"use client";

import { useState } from "react";
import Link from "next/link";
import { AuthShell } from "@/components/auth/AuthShell";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { PhoneInput, isValidPhone } from "@/components/ui/PhoneInput";
import Select from "@/components/ui/Select";
import {
  HiOutlineCheck,
  HiOutlineArrowLeft,
} from "react-icons/hi";

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

    if (!isValidPhone(formData.phone)) {
      setError("Enter a valid phone number with country code");
      return;
    }

    setIsLoading(true);

    try {
      // Format phone number
      const formattedPhone = formData.phone.replace(/[\s-]/g, "");

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
    <AuthShell variant="member" width="md" aside={{ text: "Already a member?", href: "/app/login", label: "Log in" }}>

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
                    <HiOutlineCheck className="w-4 h-4" />
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
              <h2 className="mb-2 text-3xl font-semibold tracking-[-0.03em] text-ink">
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
                <HiOutlineArrowLeft className="h-5 w-5 me-1" />
                Back
              </button>

              <h2 className="mb-2 text-3xl font-semibold tracking-[-0.03em] text-ink">
                Add your phone number
              </h2>
              <p className="text-gray-600 mb-8">
                Your phone number will be your digital identity for gym access
              </p>

              <form onSubmit={handlePhoneSubmit} className="space-y-6">
                <PhoneInput
                  id="phone"
                  name="phone"
                  label="Phone number"
                  placeholder="Mobile number"
                  value={formData.phone}
                  onChange={(phone) =>
                    setFormData((prev) => ({ ...prev, phone }))
                  }
                  error={error || undefined}
                  required
                />

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
                <HiOutlineArrowLeft className="h-5 w-5 me-1" />
                Back
              </button>

              <h2 className="mb-2 text-3xl font-semibold tracking-[-0.03em] text-ink">
                Verify your phone
              </h2>
              <p className="text-gray-600 mb-8">
                We sent a 6-digit code to{" "}
                <span className="font-medium whitespace-nowrap text-gray-900">
                  {formData.phone}
                </span>
              </p>

              <form onSubmit={handleVerifyOTP} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Enter verification code
                  </label>
                  <div className="flex gap-2 justify-between">
                    {otp.map((digit, index) => (
                      <Input
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
    </AuthShell>
  );
}
