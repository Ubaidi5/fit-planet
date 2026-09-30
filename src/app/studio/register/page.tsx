"use client";

import Link from "next/link";
import { AuthShell } from "@/components/auth/AuthShell";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  HiOutlineCheck,
  HiOutlineUser,
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineLockClosed,
  HiOutlineEyeOff,
  HiOutlineEye,
  HiOutlineArrowRight,
  HiOutlineOfficeBuilding,
  HiOutlineLocationMarker,
  HiOutlineLibrary,
  HiOutlineExclamationCircle,
  HiOutlineArrowLeft,
} from "react-icons/hi";
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
import { Button } from "@/components/ui/Button";

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
  const router = useRouter();
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

    // Redirect to Studio dashboard
    router.push("/studio/dashboard");
  };

  return (
    <AuthShell variant="studio" width="md" aside={{ text: "Already listed?", href: "/studio/login", label: "Studio login" }}>

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
                  {step > 1 ? <HiOutlineCheck className="h-5 w-5" /> : "1"}
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
                      leftIcon={<HiOutlineUser className="h-5 w-5" />}
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
                      leftIcon={<HiOutlineMail className="h-5 w-5" />}
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
                      leftIcon={<HiOutlinePhone className="h-5 w-5" />}
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

                    <Input
                      label="Confirm password"
                      type={showPassword ? "text" : "password"}
                      name="confirmPassword"
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      error={errors.confirmPassword}
                      disabled={isLoading}
                      leftIcon={<HiOutlineLockClosed className="h-5 w-5" />}
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
                      <HiOutlineArrowRight className="h-4 w-4" />
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
                      leftIcon={<HiOutlineOfficeBuilding className="h-5 w-5" />}
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
                      leftIcon={<HiOutlineLocationMarker className="h-5 w-5" />}
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
                      leftIcon={<HiOutlineLibrary className="h-5 w-5" />}
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
                          <HiOutlineExclamationCircle className="h-4 w-4 shrink-0" />
                          {errors.terms}
                        </p>
                      )}
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3">
                      <Button
                        type="button"
                        onClick={handleBack}
                        variant="outline"
                        beforeIcon={<HiOutlineArrowLeft className="h-4 w-4" />}
                      >
                        Back
                      </Button>
                      <Button
                        type="submit"
                        disabled={isLoading}
                        loading={isLoading}
                      >
                        Create Studio Account
                      </Button>
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
    </AuthShell>
  );
}
