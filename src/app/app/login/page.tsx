"use client";

import { useState } from "react";
import Link from "next/link";
import { AuthShell } from "@/components/auth/AuthShell";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { PhoneInput, isValidPhone } from "@/components/ui/PhoneInput";
import {
  HiOutlineArrowLeft,
  HiOutlineLockClosed,
} from "react-icons/hi";

export default function LoginPage() {
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate phone number (international E.164)
    if (!isValidPhone(phone)) {
      setError("Enter a valid phone number with country code");
      return;
    }

    setIsLoading(true);

    try {
      // Format phone number
      const formattedPhone = phone.replace(/[\s-]/g, "");

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

    try {
      // Format phone number
      const formattedPhone = phone.replace(/[\s-]/g, "");

      // Import signIn dynamically
      const { signIn } = await import("next-auth/react");

      const result = await signIn("phone-otp", {
        phone: formattedPhone,
        otp: otpValue,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid OTP or phone number. Please try again.");
        setIsLoading(false);
        return;
      }

      if (result?.ok) {
        window.location.href = "/app/dashboard";
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Login failed. Please try again.");
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
    setOtp(["", "", "", "", "", ""]);
  };

  return (
    <AuthShell variant="member" width="sm" aside={{ text: "New to Fit Planet?", href: "/app/register", label: "Create account" }}>

          {step === "phone" ? (
            <>
              <h2 className="mb-2 text-3xl font-semibold tracking-[-0.03em] text-ink">
                Welcome back!
              </h2>
              <p className="text-gray-600 mb-8">
                Sign in with your phone number to access your passes
              </p>

              <form onSubmit={handleSendOTP} className="space-y-6">
                <PhoneInput
                  id="phone"
                  name="phone"
                  label="Phone number"
                  placeholder="Mobile number"
                  value={phone}
                  onChange={setPhone}
                  error={error || undefined}
                  required
                />

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
                <HiOutlineArrowLeft className="h-5 w-5 me-1" />
                Back
              </button>

              <h2 className="mb-2 text-3xl font-semibold tracking-[-0.03em] text-ink">
                Verify your phone
              </h2>
              <p className="text-gray-600 mb-8">
                We sent a 6-digit code to{" "}
                <span className="font-medium whitespace-nowrap text-gray-900">{phone}</span>
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
          <div className="mt-10 flex items-start gap-3 rounded-2xl bg-surface p-4 ring-1 ring-gray-900/[0.06]">
            <HiOutlineLockClosed className="h-5 w-5 text-gray-500 shrink-0 mt-0.5" />
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
    </AuthShell>
  );
}
