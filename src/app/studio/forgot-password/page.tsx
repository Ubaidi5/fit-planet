"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  HiOutlineLightningBolt,
  HiOutlineMail,
  HiOutlineLockClosed,
  HiOutlineEye,
  HiOutlineEyeOff,
} from "react-icons/hi";

type Step = "email" | "otp" | "newPassword";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.includes("@")) {
      setError("Please enter a valid email address");
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
      setError("Please enter the complete OTP");
      return;
    }

    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);
    setStep("newPassword");
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);

    // Redirect to login
    window.location.href = "/studio/login";
  };

  const handleResendOTP = async () => {
    setError("");
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        {/* Logo */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg">
              <HiOutlineLightningBolt className="h-7 w-7 text-white" />
            </div>
            <div>
              <span className="text-2xl font-bold text-gray-900">
                Fit Planet
              </span>
              <span className="ml-2 rounded-lg bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-700">
                Studio
              </span>
            </div>
          </Link>
        </div>

        {/* Card */}
        <div className="rounded-2xl bg-white p-8 shadow-xl">
          {/* Step: Email */}
          {step === "email" && (
            <>
              <div className="mb-6 text-center">
                <h2 className="text-2xl font-bold text-gray-900">
                  Reset Password
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                  Enter your email address and we&apos;ll send you a code to
                  reset your password
                </p>
              </div>

              <form onSubmit={handleEmailSubmit} className="space-y-5">
                <Input
                  label="Email address"
                  type="email"
                  placeholder="you@yourgym.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={error}
                  disabled={isLoading}
                  leftIcon={<HiOutlineMail className="h-5 w-5" />}
                />

                <Button
                  type="submit"
                  disabled={isLoading}
                  loading={isLoading}
                  loadingText="Sending code..."
                  fullWidth
                >
                  Send Reset Code
                </Button>
              </form>

              <div className="mt-6 text-center">
                <Link
                  href="/studio/login"
                  className="text-sm font-medium text-emerald-600 hover:text-emerald-700"
                >
                  ← Back to login
                </Link>
              </div>
            </>
          )}

          {/* Step: OTP Verification */}
          {step === "otp" && (
            <>
              <div className="mb-6 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
                  <HiOutlineMail className="h-8 w-8 text-emerald-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Check your email
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                  We&apos;ve sent a 6-digit code to
                  <br />
                  <span className="font-medium text-gray-900">{email}</span>
                </p>
              </div>

              <form onSubmit={handleVerifyOTP} className="space-y-5">
                {/* OTP Input */}
                <div>
                  <label className="mb-3 block text-center text-sm font-medium text-gray-700">
                    Enter verification code
                  </label>
                  <div className="flex justify-center gap-2">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        id={`otp-${index}`}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOTPChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        className={cn(
                          "h-12 w-12 rounded-lg border-2 text-center text-lg font-semibold transition-all",
                          "focus:outline-none focus:ring-2 focus:ring-emerald-500",
                          digit
                            ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                            : "border-gray-300 bg-white text-gray-900",
                        )}
                        disabled={isLoading}
                      />
                    ))}
                  </div>
                  {error && (
                    <p className="mt-2 text-center text-sm text-red-600">
                      {error}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  loading={isLoading}
                  loadingText="Verifying..."
                  fullWidth
                >
                  Verify Code
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Didn&apos;t receive the code?{" "}
                  <button
                    onClick={handleResendOTP}
                    disabled={isLoading}
                    className="font-medium text-emerald-600 hover:text-emerald-700 disabled:opacity-50"
                  >
                    Resend
                  </button>
                </p>
              </div>
            </>
          )}

          {/* Step: New Password */}
          {step === "newPassword" && (
            <>
              <div className="mb-6 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
                  <HiOutlineLockClosed className="h-8 w-8 text-emerald-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Create new password
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                  Choose a strong password for your account
                </p>
              </div>

              <form onSubmit={handlePasswordReset} className="space-y-5">
                <Input
                  label="New password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  disabled={isLoading}
                  hint="At least 8 characters"
                  leftIcon={<HiOutlineLockClosed className="h-5 w-5" />}
                  rightIcon={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <HiOutlineEyeOff className="h-5 w-5" />
                      ) : (
                        <HiOutlineEye className="h-5 w-5" />
                      )}
                    </button>
                  }
                />

                <Input
                  label="Confirm new password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  error={error}
                  disabled={isLoading}
                  leftIcon={<HiOutlineLockClosed className="h-5 w-5" />}
                />

                <Button
                  type="submit"
                  disabled={isLoading}
                  loading={isLoading}
                  loadingText="Resetting password..."
                  fullWidth
                >
                  Reset Password
                </Button>
              </form>
            </>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-600">
          <Link href="/" className="hover:text-gray-900">
            ← Back to main website
          </Link>
        </p>
      </div>
    </div>
  );
}
