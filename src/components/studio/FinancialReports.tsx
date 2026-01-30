"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Input } from "../ui/Input";

export default function FinancialReports() {
  const [reportType, setReportType] = useState<"revenue" | "tax" | "custom">(
    "revenue",
  );
  const [dateRange, setDateRange] = useState<
    "week" | "month" | "quarter" | "year"
  >("month");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");

  // Available report templates
  const reportTemplates = [
    {
      id: "1",
      name: "Monthly Revenue Report",
      description: "Complete revenue breakdown by pass type and payment method",
      icon: "📊",
      format: "PDF, CSV",
    },
    {
      id: "2",
      name: "Transaction Summary",
      description: "All transactions with customer details and status",
      icon: "💳",
      format: "CSV, Excel",
    },
    {
      id: "3",
      name: "Payout Statement",
      description: "Detailed payout history with bank transaction IDs",
      icon: "🏦",
      format: "PDF",
    },
    {
      id: "4",
      name: "Tax Report (FBR)",
      description: "Tax-compliant report for FBR filing",
      icon: "📋",
      format: "PDF",
    },
    {
      id: "5",
      name: "Member Revenue Analysis",
      description: "Revenue per member with lifetime value calculations",
      icon: "👥",
      format: "PDF, Excel",
    },
    {
      id: "6",
      name: "Daily Sales Summary",
      description: "Day-by-day sales breakdown with growth trends",
      icon: "📈",
      format: "CSV",
    },
  ];

  // Recent reports
  const recentReports = [
    {
      id: "1",
      name: "January 2026 Revenue Report",
      generatedDate: "2026-01-27",
      size: "2.4 MB",
      format: "PDF",
    },
    {
      id: "2",
      name: "Q4 2025 Tax Report",
      generatedDate: "2026-01-15",
      size: "1.8 MB",
      format: "PDF",
    },
    {
      id: "3",
      name: "December Transaction Summary",
      generatedDate: "2026-01-05",
      size: "3.2 MB",
      format: "CSV",
    },
    {
      id: "4",
      name: "Annual Report 2025",
      generatedDate: "2026-01-02",
      size: "5.1 MB",
      format: "PDF",
    },
  ];

  const handleGenerateReport = () => {
    console.log("Generating report:", {
      reportType,
      dateRange,
      customStartDate,
      customEndDate,
    });
    // Report generation logic would go here
  };

  return (
    <div className="space-y-6">
      {/* Report Generator */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="mb-6 text-lg font-semibold text-gray-900">
          Generate Financial Report
        </h3>

        <div className="space-y-6">
          {/* Report Type Selection */}
          <div>
            <label className="mb-3 block text-sm font-medium text-gray-700">
              Select Report Type
            </label>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <button
                onClick={() => setReportType("revenue")}
                className={cn(
                  "rounded-lg border-2 p-4 text-left transition-all",
                  reportType === "revenue"
                    ? "border-emerald-500 bg-emerald-50"
                    : "border-gray-200 bg-white hover:border-gray-300",
                )}
              >
                <p className="font-semibold text-gray-900">📊 Revenue Report</p>
                <p className="mt-1 text-xs text-gray-600">
                  Complete revenue breakdown
                </p>
              </button>

              <button
                onClick={() => setReportType("tax")}
                className={cn(
                  "rounded-lg border-2 p-4 text-left transition-all",
                  reportType === "tax"
                    ? "border-emerald-500 bg-emerald-50"
                    : "border-gray-200 bg-white hover:border-gray-300",
                )}
              >
                <p className="font-semibold text-gray-900">📋 Tax Report</p>
                <p className="mt-1 text-xs text-gray-600">
                  FBR-compliant tax filing
                </p>
              </button>

              <button
                onClick={() => setReportType("custom")}
                className={cn(
                  "rounded-lg border-2 p-4 text-left transition-all",
                  reportType === "custom"
                    ? "border-emerald-500 bg-emerald-50"
                    : "border-gray-200 bg-white hover:border-gray-300",
                )}
              >
                <p className="font-semibold text-gray-900">⚙️ Custom Report</p>
                <p className="mt-1 text-xs text-gray-600">
                  Build your own report
                </p>
              </button>
            </div>
          </div>

          {/* Date Range Selection */}
          <div>
            <label className="mb-3 block text-sm font-medium text-gray-700">
              Select Date Range
            </label>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <button
                onClick={() => setDateRange("week")}
                className={cn(
                  "rounded-lg border px-4 py-3 text-sm font-medium transition-all",
                  dateRange === "week"
                    ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                    : "border-gray-300 bg-white text-gray-700 hover:border-gray-400",
                )}
              >
                Last Week
              </button>

              <button
                onClick={() => setDateRange("month")}
                className={cn(
                  "rounded-lg border px-4 py-3 text-sm font-medium transition-all",
                  dateRange === "month"
                    ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                    : "border-gray-300 bg-white text-gray-700 hover:border-gray-400",
                )}
              >
                Last Month
              </button>

              <button
                onClick={() => setDateRange("quarter")}
                className={cn(
                  "rounded-lg border px-4 py-3 text-sm font-medium transition-all",
                  dateRange === "quarter"
                    ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                    : "border-gray-300 bg-white text-gray-700 hover:border-gray-400",
                )}
              >
                Last Quarter
              </button>

              <button
                onClick={() => setDateRange("year")}
                className={cn(
                  "rounded-lg border px-4 py-3 text-sm font-medium transition-all",
                  dateRange === "year"
                    ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                    : "border-gray-300 bg-white text-gray-700 hover:border-gray-400",
                )}
              >
                Last Year
              </button>
            </div>
          </div>

          {/* Custom Date Range */}
          {reportType === "custom" && (
            <div className="rounded-lg border-2 border-blue-200 bg-blue-50 p-4">
              <p className="mb-3 text-sm font-semibold text-blue-900">
                📅 Custom Date Range
              </p>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs font-medium text-blue-900">
                    Start Date
                  </label>
                  <Input
                    type="date"
                    value={customStartDate}
                    onChange={(e) => setCustomStartDate(e.target.value)}
                    className="w-full rounded-lg border border-blue-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-medium text-blue-900">
                    End Date
                  </label>
                  <Input
                    type="date"
                    value={customEndDate}
                    onChange={(e) => setCustomEndDate(e.target.value)}
                    className="w-full rounded-lg border border-blue-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Export Format */}
          <div>
            <label className="mb-3 block text-sm font-medium text-gray-700">
              Export Format
            </label>
            <div className="flex items-center space-x-3">
              <button className="rounded-lg border-2 border-emerald-500 bg-emerald-50 px-6 py-3 text-sm font-semibold text-emerald-700 transition-all hover:bg-emerald-100">
                📄 PDF
              </button>
              <button className="rounded-lg border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 transition-all hover:border-gray-400">
                📊 CSV
              </button>
              <button className="rounded-lg border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 transition-all hover:border-gray-400">
                📈 Excel
              </button>
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerateReport}
            className="w-full rounded-lg bg-emerald-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-emerald-700"
          >
            Generate Report
          </button>
        </div>
      </div>

      {/* Report Templates */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="mb-6 text-lg font-semibold text-gray-900">
          Quick Report Templates
        </h3>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {reportTemplates.map((template) => (
            <div
              key={template.id}
              className="rounded-lg border border-gray-200 bg-gray-50 p-4 transition-all hover:border-emerald-500 hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <span className="text-3xl">{template.icon}</span>
                <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-800">
                  {template.format}
                </span>
              </div>

              <p className="mt-3 font-semibold text-gray-900">
                {template.name}
              </p>
              <p className="mt-1 text-xs text-gray-600">
                {template.description}
              </p>

              <button className="mt-4 w-full rounded-lg border border-emerald-600 bg-white px-4 py-2 text-sm font-semibold text-emerald-600 transition-colors hover:bg-emerald-50">
                Generate
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Reports */}
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Recently Generated Reports
          </h3>
        </div>

        <div className="divide-y divide-gray-100">
          {recentReports.map((report) => (
            <div
              key={report.id}
              className="flex items-center justify-between p-6 transition-colors hover:bg-gray-50"
            >
              <div className="flex items-center space-x-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800">
                  <span className="text-xl">📄</span>
                </div>

                <div>
                  <p className="font-semibold text-gray-900">{report.name}</p>
                  <p className="text-xs text-gray-600">
                    Generated on{" "}
                    {new Date(report.generatedDate).toLocaleDateString(
                      "en-US",
                      {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      },
                    )}{" "}
                    • {report.size} • {report.format}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50">
                  Preview
                </button>
                <button className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-700">
                  Download
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tax Information */}
      <div className="rounded-lg border border-orange-200 bg-orange-50 p-6">
        <div className="flex items-start space-x-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-600 text-white">
            <span className="text-xl">📋</span>
          </div>

          <div className="flex-1">
            <h4 className="text-sm font-semibold text-orange-900">
              Tax Filing Information
            </h4>
            <p className="mt-2 text-sm text-orange-700">
              • All revenue reports include GST/Sales Tax breakdown
              <br />
              • Tax reports are FBR-compliant and ready for filing
              <br />
              • Download annual tax report for easy NTN filing
              <br />• Keep records for at least 6 years as per FBR requirements
            </p>
          </div>
        </div>
      </div>

      {/* Export Tips */}
      <div className="rounded-lg border border-blue-200 bg-blue-50 p-6">
        <h4 className="mb-3 text-sm font-semibold text-blue-900">
          💡 Report Tips
        </h4>
        <div className="grid grid-cols-1 gap-2 text-sm text-blue-700 sm:grid-cols-2">
          <div>✓ PDF format is best for official records</div>
          <div>✓ CSV/Excel for data analysis</div>
          <div>✓ Schedule monthly reports for tracking</div>
          <div>✓ Keep copies for tax filing</div>
        </div>
      </div>
    </div>
  );
}
