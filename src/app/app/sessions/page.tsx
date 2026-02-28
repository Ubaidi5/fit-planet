"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import {
  HiOutlineDeviceMobile,
  HiOutlineDesktopComputer,
  HiOutlineShieldCheck,
  HiOutlineLocationMarker,
  HiOutlineClock,
  HiOutlineServer,
  HiOutlineInformationCircle,
} from "react-icons/hi";

interface Session {
  id: string;
  device: string;
  browser: string;
  location: string;
  ip: string;
  lastActive: string;
  isCurrent: boolean;
}

export default function SessionManagementPage() {
  const [sessions, setSessions] = useState<Session[]>([
    {
      id: "1",
      device: "Windows PC",
      browser: "Chrome 120",
      location: "Karachi, Pakistan",
      ip: "192.168.1.1",
      lastActive: "Active now",
      isCurrent: true,
    },
    {
      id: "2",
      device: "iPhone 15 Pro",
      browser: "Safari Mobile",
      location: "Karachi, Pakistan",
      ip: "192.168.1.45",
      lastActive: "2 hours ago",
      isCurrent: false,
    },
    {
      id: "3",
      device: "MacBook Pro",
      browser: "Firefox 121",
      location: "Lahore, Pakistan",
      ip: "103.245.67.89",
      lastActive: "Yesterday",
      isCurrent: false,
    },
  ]);

  const [isRevoking, setIsRevoking] = useState<string | null>(null);

  const handleRevokeSession = async (sessionId: string) => {
    setIsRevoking(sessionId);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSessions((prev) => prev.filter((s) => s.id !== sessionId));
    setIsRevoking(null);
  };

  const handleRevokeAll = async () => {
    setIsRevoking("all");
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setSessions((prev) => prev.filter((s) => s.isCurrent));
    setIsRevoking(null);
  };

  const getDeviceIcon = (device: string) => {
    if (device.includes("iPhone") || device.includes("Android")) {
      return <HiOutlineDeviceMobile className="h-5 w-5" />;
    } else {
      return <HiOutlineDesktopComputer className="h-5 w-5" />;
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Active Sessions</h1>
        <p className="mt-1 text-sm text-gray-600">
          Manage devices where you're currently logged in
        </p>
      </div>

      {/* Stats Card */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Active Devices</p>
            <p className="mt-1 text-3xl font-bold text-gray-900">
              {sessions.length}
            </p>
          </div>
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
            <HiOutlineShieldCheck className="h-8 w-8 text-emerald-600" />
          </div>
        </div>
      </div>

      {/* Revoke All Button */}
      {sessions.filter((s) => !s.isCurrent).length > 0 && (
        <div className="flex justify-end">
          <Button
            variant="danger"
            size="sm"
            onClick={handleRevokeAll}
            disabled={isRevoking === "all"}
            loading={isRevoking === "all"}
            loadingText="Revoking all..."
          >
            Revoke All Other Sessions
          </Button>
        </div>
      )}

      {/* Sessions List */}
      <div className="space-y-3">
        {sessions.map((session) => (
          <div
            key={session.id}
            className={cn(
              "rounded-lg border p-4 shadow-sm transition-all",
              session.isCurrent
                ? "border-emerald-200 bg-emerald-50"
                : "border-gray-200 bg-white",
            )}
          >
            <div className="flex items-start justify-between">
              <div className="flex gap-4">
                {/* Device Icon */}
                <div
                  className={cn(
                    "flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg",
                    session.isCurrent
                      ? "bg-emerald-100 text-emerald-600"
                      : "bg-gray-100 text-gray-600",
                  )}
                >
                  {getDeviceIcon(session.device)}
                </div>

                {/* Session Details */}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900">
                      {session.device}
                    </h3>
                    {session.isCurrent && (
                      <span className="rounded-full bg-emerald-600 px-2 py-0.5 text-xs font-medium text-white">
                        Current
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-gray-600">
                    {session.browser}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <HiOutlineLocationMarker className="h-3.5 w-3.5" />
                      {session.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <HiOutlineClock className="h-3.5 w-3.5" />
                      {session.lastActive}
                    </span>
                    <span className="flex items-center gap-1">
                      <HiOutlineServer className="h-3.5 w-3.5" />
                      {session.ip}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              {!session.isCurrent && (
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleRevokeSession(session.id)}
                  disabled={isRevoking === session.id}
                  loading={isRevoking === session.id}
                  loadingText="Revoking..."
                >
                  Revoke
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Info Card */}
      <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
        <div className="flex gap-3">
          <HiOutlineInformationCircle className="h-5 w-5 flex-shrink-0 text-blue-600" />
          <div className="flex-1">
            <h4 className="font-medium text-blue-900">Security Tip</h4>
            <p className="mt-1 text-sm text-blue-700">
              If you see a device or location you don't recognize, revoke that
              session immediately and change your password.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
