"use client";

import Link from "next/link";
import { useState } from "react";
import {
  HiOutlineLightningBolt,
  HiOutlineMail,
  HiOutlineLockClosed,
  HiOutlineEye,
  HiOutlineEyeOff,
  HiOutlineArrowLeft,
} from "react-icons/hi";
import { CgSpinner } from "react-icons/cg";
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

export default function StudioLoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    // Simulate API call (UI only - no actual backend)
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsLoading(false);
    // In a real app, this would redirect to dashboard on success
    console.log("Login submitted:", formData);
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Side - Form */}
      <div className="flex w-full flex-col justify-center px-4 py-12 sm:px-6 lg:w-1/2 lg:px-8 xl:px-12">
        <div className="mx-auto w-full max-w-md">
          {/* Logo */}
          <Link href="/" className="mb-8 flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600">
              <HiOutlineLightningBolt className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-100">Fit Planet</span>
            <span className="ml-1 rounded bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
              Studio
            </span>
          </Link>

          {/* Card */}
          <Card variant="elevated" padding="lg">
            <CardHeader>
              <CardTitle as="h1">Welcome back</CardTitle>
              <CardDescription>
                Sign in to manage your gym and grow your business
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email Field */}
                <Input
                  label="Email address"
                  type="email"
                  name="email"
                  placeholder="you@yourgym.com"
                  value={formData.email}
                  onChange={handleChange}
                  error={errors.email}
                  disabled={isLoading}
                  leftIcon={<HiOutlineMail className="h-5 w-5" />}
                />

                {/* Password Field */}
                <Input
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  error={errors.password}
                  disabled={isLoading}
                  leftIcon={<HiOutlineLockClosed className="h-5 w-5" />}
                  rightIcon={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-gray-400 hover:text-gray-600 focus:outline-none"
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        <HiOutlineEyeOff className="h-5 w-5" />
                      ) : (
                        <HiOutlineEye className="h-5 w-5" />
                      )}
                    </button>
                  }
                />

                {/* Remember & Forgot */}
                <div className="flex items-center justify-between">
                  <label className="flex cursor-pointer items-center gap-2">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="text-sm text-gray-600">Remember me</span>
                  </label>
                  <Link
                    href="/studio/forgot-password"
                    className="text-sm font-medium text-emerald-600 hover:text-emerald-700"
                  >
                    Forgot password?
                  </Link>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className={cn(
                    "relative flex h-12 w-full items-center justify-center rounded-lg bg-emerald-600 text-sm font-semibold text-white shadow-sm",
                    "transition-all duration-200",
                    "hover:bg-emerald-700 hover:shadow-md",
                    "focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2",
                    "disabled:cursor-not-allowed disabled:opacity-70",
                  )}
                >
                  {isLoading ? (
                    <>
                      <CgSpinner className="mr-2 h-5 w-5 animate-spin text-white" />
                      Signing in...
                    </>
                  ) : (
                    "Sign in to Studio"
                  )}
                </button>
              </form>
            </CardContent>

            <CardFooter>
              <p className="text-center text-sm text-gray-600">
                Don&apos;t have an account?{" "}
                <Link
                  href="/studio/register"
                  className="font-medium text-emerald-600 hover:text-emerald-700"
                >
                  Register your gym
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
              <HiOutlineArrowLeft className="h-4 w-4" />
              Back to main website
            </Link>
          </p>
        </div>
      </div>

      {/* Right Side - Branding */}
      <div className="hidden bg-gradient-to-br from-emerald-600 to-teal-700 lg:flex lg:w-1/2 lg:flex-col lg:justify-center lg:px-12 xl:px-16">
        <div className="mx-auto max-w-md">
          {/* Quote / Feature Highlight */}
          <div className="relative">
            <span className="absolute -left-4 -top-4 text-5xl font-serif text-emerald-400/50">
              &ldquo;
            </span>
            <blockquote className="text-2xl font-medium leading-relaxed text-white">
              "Fit Planet helped us reach 3x more customers without building our
              own website. The capacity management feature alone saved us hours
              every week."
            </blockquote>
            <div className="mt-6 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 text-lg font-bold text-white">
                AK
              </div>
              <div>
                <p className="font-semibold text-white">Ahmed Khan</p>
                <p className="text-sm text-emerald-200">
                  Owner, FitZone Karachi
                </p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-12 grid grid-cols-2 gap-6">
            <div className="rounded-xl bg-white/10 p-4">
              <p className="text-3xl font-bold text-white">500+</p>
              <p className="text-sm text-emerald-200">Gyms on platform</p>
            </div>
            <div className="rounded-xl bg-white/10 p-4">
              <p className="text-3xl font-bold text-white">100K+</p>
              <p className="text-sm text-emerald-200">Bookings processed</p>
            </div>
            <div className="rounded-xl bg-white/10 p-4">
              <p className="text-3xl font-bold text-white">40%</p>
              <p className="text-sm text-emerald-200">Avg. revenue increase</p>
            </div>
            <div className="rounded-xl bg-white/10 p-4">
              <p className="text-3xl font-bold text-white">24/7</p>
              <p className="text-sm text-emerald-200">Bookings & support</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
