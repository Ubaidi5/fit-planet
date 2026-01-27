"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface Referral {
  id: string;
  referrerName: string;
  referrerPhone: string;
  refereeName: string;
  refereePhone: string;
  status: "pending" | "converted" | "expired";
  referralCode: string;
  reward: number;
  createdDate: string;
  convertedDate?: string;
}

export default function ReferralProgram() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [generatingCode, setGeneratingCode] = useState(false);

  const referrals: Referral[] = [
    {
      id: "1",
      referrerName: "Ahmed Khan",
      referrerPhone: "+92 300 1234567",
      refereeName: "Ali Hassan",
      refereePhone: "+92 322 7778888",
      status: "converted",
      referralCode: "AHMED2026",
      reward: 500,
      createdDate: "2026-01-20",
      convertedDate: "2026-01-23",
    },
    {
      id: "2",
      referrerName: "Sara Ali",
      referrerPhone: "+92 321 9876543",
      refereeName: "Zainab Khan",
      refereePhone: "+92 313 9990000",
      status: "converted",
      referralCode: "SARA2026",
      reward: 500,
      createdDate: "2026-01-18",
      convertedDate: "2026-01-22",
    },
    {
      id: "3",
      referrerName: "Hamza Malik",
      referrerPhone: "+92 333 4567890",
      refereeName: "Bilal Ahmed",
      refereePhone: "+92 334 1112222",
      status: "pending",
      referralCode: "HAMZA2026",
      reward: 500,
      createdDate: "2026-01-25",
    },
    {
      id: "4",
      referrerName: "Fatima Sheikh",
      referrerPhone: "+92 345 2345678",
      refereeName: "Maria Khan",
      refereePhone: "+92 301 3334444",
      status: "converted",
      referralCode: "FATIMA2026",
      reward: 500,
      createdDate: "2026-01-15",
      convertedDate: "2026-01-18",
    },
  ];

  const handleGenerateCode = () => {
    setGeneratingCode(true);
    setTimeout(() => {
      const randomCode = `GYM${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      alert(`Generated code: ${randomCode}`);
      setGeneratingCode(false);
    }, 1000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "converted":
        return "bg-emerald-100 text-emerald-800";
      case "pending":
        return "bg-blue-100 text-blue-800";
      case "expired":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const conversionRate =
    (referrals.filter((r) => r.status === "converted").length /
      referrals.length) *
    100;

  return (
    <div className="space-y-6">
      {/* Program Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-gray-600">Total Referrals</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {referrals.length}
          </p>
          <p className="mt-1 text-xs text-gray-600">All time</p>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-gray-600">Converted</p>
          <p className="mt-2 text-3xl font-bold text-emerald-600">
            {referrals.filter((r) => r.status === "converted").length}
          </p>
          <p className="mt-1 text-xs text-emerald-600">
            {conversionRate.toFixed(1)}% conversion rate
          </p>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-gray-600">Rewards Paid</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            Rs.{" "}
            {(
              referrals
                .filter((r) => r.status === "converted")
                .reduce((sum, r) => sum + r.reward, 0) / 1000
            ).toFixed(1)}
            K
          </p>
          <p className="mt-1 text-xs text-gray-600">Total disbursed</p>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-gray-600">Pending</p>
          <p className="mt-2 text-3xl font-bold text-blue-600">
            {referrals.filter((r) => r.status === "pending").length}
          </p>
          <p className="mt-1 text-xs text-gray-600">Awaiting conversion</p>
        </div>
      </div>

      {/* Program Settings */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">
          Referral Program Settings
        </h3>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Reward per Referral
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  defaultValue={500}
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <span className="text-sm text-gray-600">Rs.</span>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Code Validity Period
              </label>
              <select className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500">
                <option>30 days</option>
                <option>60 days</option>
                <option>90 days</option>
                <option>Unlimited</option>
              </select>
            </div>

            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  defaultChecked
                  className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-sm text-gray-700">
                  Auto-generate referral codes
                </span>
              </label>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Minimum Purchase for Referee
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  defaultValue={1000}
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <span className="text-sm text-gray-600">Rs.</span>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Reward Disbursement
              </label>
              <select className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500">
                <option>Immediate</option>
                <option>After 7 days</option>
                <option>After 30 days</option>
              </select>
            </div>

            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  defaultChecked
                  className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-sm text-gray-700">
                  Send notification on successful referral
                </span>
              </label>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <Button variant="outline">Reset to Default</Button>
          <Button>Save Settings</Button>
        </div>
      </div>

      {/* Generate Code */}
      <div className="rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-8">
        <div className="flex flex-col items-center text-center">
          <span className="mb-4 text-6xl">🎟️</span>
          <h3 className="mb-2 text-lg font-semibold text-gray-900">
            Generate Referral Code
          </h3>
          <p className="mb-6 text-sm text-gray-600">
            Create a unique referral code for members to share with friends
          </p>
          <Button
            onClick={handleGenerateCode}
            disabled={generatingCode}
            size="lg"
          >
            {generatingCode ? "Generating..." : "🎁 Generate New Code"}
          </Button>
        </div>
      </div>

      {/* Referral List */}
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Referral History
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr className="text-left text-xs font-medium text-gray-600">
                <th className="p-4">Referrer</th>
                <th className="p-4">Referee</th>
                <th className="p-4">Code</th>
                <th className="p-4">Status</th>
                <th className="p-4">Reward</th>
                <th className="p-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {referrals.map((referral) => (
                <tr
                  key={referral.id}
                  className="transition-colors hover:bg-gray-50"
                >
                  <td className="p-4">
                    <p className="text-sm font-medium text-gray-900">
                      {referral.referrerName}
                    </p>
                    <p className="text-xs text-gray-600">
                      {referral.referrerPhone}
                    </p>
                  </td>

                  <td className="p-4">
                    <p className="text-sm font-medium text-gray-900">
                      {referral.refereeName}
                    </p>
                    <p className="text-xs text-gray-600">
                      {referral.refereePhone}
                    </p>
                  </td>

                  <td className="p-4">
                    <code className="rounded bg-gray-100 px-2 py-1 text-xs font-mono font-semibold text-gray-900">
                      {referral.referralCode}
                    </code>
                  </td>

                  <td className="p-4">
                    <span
                      className={cn(
                        "inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize",
                        getStatusColor(referral.status),
                      )}
                    >
                      {referral.status}
                    </span>
                  </td>

                  <td className="p-4">
                    <p
                      className={cn(
                        "text-sm font-semibold",
                        referral.status === "converted"
                          ? "text-emerald-600"
                          : "text-gray-600",
                      )}
                    >
                      {referral.status === "converted" ? "Rs. " : ""}
                      {referral.status === "converted"
                        ? referral.reward.toLocaleString()
                        : "Pending"}
                    </p>
                  </td>

                  <td className="p-4">
                    <p className="text-xs text-gray-600">
                      {new Date(referral.createdDate).toLocaleDateString()}
                    </p>
                    {referral.convertedDate && (
                      <p className="text-xs text-emerald-600">
                        ✓{" "}
                        {new Date(referral.convertedDate).toLocaleDateString()}
                      </p>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Share Options */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">
          Share Referral Program
        </h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Button variant="outline" className="justify-start">
            📱 WhatsApp Message
          </Button>
          <Button variant="outline" className="justify-start">
            📧 Email Template
          </Button>
          <Button variant="outline" className="justify-start">
            📲 SMS Campaign
          </Button>
          <Button variant="outline" className="justify-start">
            🌐 Social Media Post
          </Button>
        </div>
      </div>
    </div>
  );
}
