"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { Input } from "../ui/Input";

interface CheckInResult {
  success: boolean;
  message: string;
  member?: {
    name: string;
    phone: string;
    passType: string;
    expiryDate: string;
    visitsRemaining?: number;
  };
}

export default function CheckInSystem() {
  const [scanMode, setScanMode] = useState<"qr" | "manual">("qr");
  const [searchQuery, setSearchQuery] = useState("");
  const [checkInResult, setCheckInResult] = useState<CheckInResult | null>(
    null,
  );
  const [isScanning, setIsScanning] = useState(false);

  // Mock check-in function
  const handleCheckIn = (identifier: string) => {
    setIsScanning(true);

    // Simulate API call
    setTimeout(() => {
      // Mock successful check-in
      setCheckInResult({
        success: true,
        message: "Check-in successful! Welcome to the gym.",
        member: {
          name: "Ahmed Khan",
          phone: "+92 300 1234567",
          passType: "Monthly Pass",
          expiryDate: "2026-02-15",
          visitsRemaining: undefined, // Unlimited for monthly
        },
      });
      setIsScanning(false);
      setSearchQuery("");

      // Clear result after 5 seconds
      setTimeout(() => setCheckInResult(null), 5000);
    }, 1000);
  };

  const handleManualCheckIn = () => {
    if (!searchQuery.trim()) {
      setCheckInResult({
        success: false,
        message: "Please enter a phone number or name",
      });
      return;
    }

    handleCheckIn(searchQuery);
  };

  const handleQRScan = () => {
    // In production, this would open camera/QR scanner
    handleCheckIn("QR_CODE_12345");
  };

  return (
    <div className="space-y-6">
      {/* Mode Selector */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">
          Check-In Method
        </h3>
        <div className="flex space-x-4">
          <button
            onClick={() => setScanMode("qr")}
            className={cn(
              "flex flex-1 items-center justify-center space-x-3 rounded-lg border-2 p-6 transition-all",
              scanMode === "qr"
                ? "border-emerald-600 bg-emerald-50"
                : "border-gray-200 bg-white hover:border-gray-300",
            )}
          >
            <span className="text-3xl">📱</span>
            <div className="text-left">
              <p
                className={cn(
                  "font-semibold",
                  scanMode === "qr" ? "text-emerald-900" : "text-gray-900",
                )}
              >
                QR Code Scanner
              </p>
              <p className="text-sm text-gray-600">Scan booking QR code</p>
            </div>
          </button>

          <button
            onClick={() => setScanMode("manual")}
            className={cn(
              "flex flex-1 items-center justify-center space-x-3 rounded-lg border-2 p-6 transition-all",
              scanMode === "manual"
                ? "border-emerald-600 bg-emerald-50"
                : "border-gray-200 bg-white hover:border-gray-300",
            )}
          >
            <span className="text-3xl">🔍</span>
            <div className="text-left">
              <p
                className={cn(
                  "font-semibold",
                  scanMode === "manual" ? "text-emerald-900" : "text-gray-900",
                )}
              >
                Manual Search
              </p>
              <p className="text-sm text-gray-600">Search by phone or name</p>
            </div>
          </button>
        </div>
      </div>

      {/* Check-In Interface */}
      {scanMode === "qr" ? (
        <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
          <div className="flex flex-col items-center">
            <div className="mb-6 flex h-64 w-64 items-center justify-center rounded-lg border-4 border-dashed border-gray-300 bg-gray-50">
              {isScanning ? (
                <div className="text-center">
                  <div className="mx-auto mb-4 h-16 w-16 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent"></div>
                  <p className="text-sm text-gray-600">Scanning...</p>
                </div>
              ) : (
                <div className="text-center">
                  <span className="mb-3 block text-6xl">📷</span>
                  <p className="text-sm text-gray-600">
                    Position QR code in frame
                  </p>
                </div>
              )}
            </div>

            <Button
              onClick={handleQRScan}
              disabled={isScanning}
              size="lg"
              className="w-full max-w-xs"
            >
              {isScanning ? "Scanning..." : "Start QR Scanner"}
            </Button>

            <p className="mt-4 text-center text-sm text-gray-600">
              Hold the QR code from the booking confirmation in front of the
              camera
            </p>
          </div>
        </div>
      ) : (
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">
            Search Member
          </h3>

          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Phone Number or Name
            </label>
            <div className="flex space-x-3">
              <Input
                type="text"
                placeholder="Enter phone number or member name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleManualCheckIn()}
                className="flex-1 rounded-lg border border-gray-300 px-4 py-3 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <Button
                onClick={handleManualCheckIn}
                disabled={isScanning}
                size="lg"
              >
                {isScanning ? "Checking..." : "Check In"}
              </Button>
            </div>
          </div>

          <div className="rounded-lg bg-blue-50 p-4">
            <p className="text-sm text-blue-800">
              💡 <span className="font-semibold">Tip:</span> Enter phone number
              (e.g., 03001234567) or member name for quick search
            </p>
          </div>
        </div>
      )}

      {/* Check-In Result */}
      {checkInResult && (
        <div
          className={cn(
            "rounded-lg border-2 p-6 shadow-lg",
            checkInResult.success
              ? "border-emerald-500 bg-emerald-50"
              : "border-red-500 bg-red-50",
          )}
        >
          <div className="flex items-start space-x-4">
            <span className="text-4xl">
              {checkInResult.success ? "✅" : "❌"}
            </span>
            <div className="flex-1">
              <h4
                className={cn(
                  "text-lg font-bold",
                  checkInResult.success ? "text-emerald-900" : "text-red-900",
                )}
              >
                {checkInResult.success
                  ? "Check-In Successful!"
                  : "Check-In Failed"}
              </h4>
              <p
                className={cn(
                  "mt-1 text-sm",
                  checkInResult.success ? "text-emerald-700" : "text-red-700",
                )}
              >
                {checkInResult.message}
              </p>

              {checkInResult.member && (
                <div className="mt-4 space-y-2 rounded-lg bg-white p-4">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-600">
                      Member Name:
                    </span>
                    <span className="text-sm font-semibold text-gray-900">
                      {checkInResult.member.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-600">
                      Phone:
                    </span>
                    <span className="text-sm font-semibold text-gray-900">
                      {checkInResult.member.phone}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-600">
                      Pass Type:
                    </span>
                    <span className="text-sm font-semibold text-emerald-600">
                      {checkInResult.member.passType}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-600">
                      Valid Until:
                    </span>
                    <span className="text-sm font-semibold text-gray-900">
                      {new Date(
                        checkInResult.member.expiryDate,
                      ).toLocaleDateString()}
                    </span>
                  </div>
                  {checkInResult.member.visitsRemaining !== undefined && (
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-600">
                        Visits Remaining:
                      </span>
                      <span className="text-sm font-semibold text-gray-900">
                        {checkInResult.member.visitsRemaining}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Recent Check-Ins */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">
          Recent Check-Ins (Today)
        </h3>
        <div className="space-y-3">
          {[
            {
              name: "Ahmed Khan",
              time: "08:30 AM",
              passType: "Monthly",
              duration: "2h 15m",
            },
            {
              name: "Sara Ali",
              time: "09:15 AM",
              passType: "Day Pass",
              duration: "1h 45m",
            },
            {
              name: "Hamza Malik",
              time: "10:00 AM",
              passType: "Weekly",
              duration: "1h 20m",
            },
          ].map((checkin, index) => (
            <div
              key={index}
              className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-4"
            >
              <div className="flex items-center space-x-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100">
                  <span className="text-lg">👤</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{checkin.name}</p>
                  <p className="text-sm text-gray-600">
                    {checkin.passType} • {checkin.time}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-emerald-600">Active</p>
                <p className="text-xs text-gray-600">{checkin.duration}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
