"use client";

import Link from "next/link";
import { AuthShell } from "@/components/auth/AuthShell";
import { useState } from "react";
import {
  HiOutlineMail,
  HiOutlineLockClosed,
  HiOutlineEye,
  HiOutlineEyeOff,
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
    <AuthShell variant="studio" width="md" aside={{ text: "New gym?", href: "/studio/register", label: "List your gym" }}>

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
                      <CgSpinner className="me-2 h-5 w-5 animate-spin text-white" />
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
    </AuthShell>
  );
}
