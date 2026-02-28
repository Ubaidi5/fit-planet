"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  HiOutlineLightningBolt,
  HiOutlineArrowLeft,
  HiOutlineLockClosed,
  HiOutlineDeviceMobile,
  HiOutlineShieldCheck,
  HiOutlineClock,
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

    // Validate phone number (Pakistan format)
    const phoneRegex = /^(\+92|0)?3[0-9]{9}$/;
    if (!phoneRegex.test(phone.replace(/\s/g, ""))) {
      setError("Please enter a valid Pakistani phone number");
      return;
    }

    setIsLoading(true);

    try {
      // Format phone number
      let formattedPhone = phone.replace(/\s/g, "");
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
      let formattedPhone = phone.replace(/\s/g, "");
      if (formattedPhone.startsWith("0")) {
        formattedPhone = "+92" + formattedPhone.substring(1);
      } else if (!formattedPhone.startsWith("+92")) {
        formattedPhone = "+92" + formattedPhone;
      }

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
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 mb-8">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-linear-to-br from-emerald-500 to-teal-600">
              <HiOutlineLightningBolt className="h-6 w-6 text-white" />
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
                    <Input
                      leftIcon={"+92"}
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
                <HiOutlineArrowLeft className="h-5 w-5 mr-1" />
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
          <div className="mt-10 flex items-start gap-3 p-4 bg-gray-100 rounded-lg">
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
                <HiOutlineDeviceMobile className="h-5 w-5 text-white" />
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
                <HiOutlineShieldCheck className="h-5 w-5 text-white" />
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
                <HiOutlineClock className="h-5 w-5 text-white" />
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
