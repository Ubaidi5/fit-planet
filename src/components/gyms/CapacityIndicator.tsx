"use client";

import { cn } from "@/lib/utils";
import { HiOutlineUserGroup } from "react-icons/hi";

interface CapacityIndicatorProps {
  current: number;
  max: number;
  className?: string;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

export function CapacityIndicator({
  current,
  max,
  className,
  size = "md",
  showLabel = true,
}: CapacityIndicatorProps) {
  const percentage = Math.min((current / max) * 100, 100);

  // Determine status color based on capacity
  const getStatusColor = () => {
    if (percentage < 50) return "emerald";
    if (percentage < 75) return "amber";
    return "red";
  };

  const status = getStatusColor();

  const colorClasses = {
    emerald: {
      bg: "bg-emerald-500",
      text: "text-emerald-600",
      lightBg: "bg-emerald-100",
    },
    amber: {
      bg: "bg-amber-500",
      text: "text-amber-600",
      lightBg: "bg-amber-100",
    },
    red: {
      bg: "bg-red-500",
      text: "text-red-600",
      lightBg: "bg-red-100",
    },
  };

  const sizeClasses = {
    sm: {
      container: "h-1.5",
      text: "text-xs",
      icon: "h-3 w-3",
    },
    md: {
      container: "h-2",
      text: "text-sm",
      icon: "h-4 w-4",
    },
    lg: {
      container: "h-3",
      text: "text-base",
      icon: "h-5 w-5",
    },
  };

  const statusText = () => {
    if (percentage < 50) return "Not busy";
    if (percentage < 75) return "Getting busy";
    if (percentage < 90) return "Quite busy";
    return "Very busy";
  };

  return (
    <div className={cn("", className)}>
      {showLabel && (
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-2">
            <HiOutlineUserGroup
              className={cn(sizeClasses[size].icon, colorClasses[status].text)}
            />
            <span
              className={cn(
                sizeClasses[size].text,
                "font-medium text-gray-700",
              )}
            >
              {statusText()}
            </span>
          </div>
          <span className={cn(sizeClasses[size].text, "text-gray-500")}>
            {current}/{max}
          </span>
        </div>
      )}

      {/* Progress Bar */}
      <div
        className={cn(
          "w-full rounded-full overflow-hidden",
          colorClasses[status].lightBg,
          sizeClasses[size].container,
        )}
      >
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500",
            colorClasses[status].bg,
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

// Crowd Prediction Chart Component
interface CrowdDataPoint {
  hour: number;
  occupancy: number;
}

interface CrowdChartProps {
  data: CrowdDataPoint[];
  className?: string;
}

export function CrowdChart({ data, className }: CrowdChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className={cn("text-center py-8 text-gray-500", className)}>
        No crowd data available
      </div>
    );
  }

  const currentHour = new Date().getHours();
  const maxOccupancy = Math.max(...data.map((d) => d.occupancy));

  const formatHour = (hour: number) => {
    if (hour === 0 || hour === 24) return "12 AM";
    if (hour === 12) return "12 PM";
    if (hour < 12) return `${hour} AM`;
    return `${hour - 12} PM`;
  };

  const getBarColor = (occupancy: number, isCurrentHour: boolean) => {
    if (isCurrentHour) return "bg-emerald-600";
    if (occupancy < 50) return "bg-emerald-300";
    if (occupancy < 75) return "bg-amber-300";
    return "bg-red-300";
  };

  return (
    <div className={cn("", className)}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Popular Times</h3>
        <div className="flex items-center gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-emerald-300" />
            <span>Low</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-amber-300" />
            <span>Medium</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-red-300" />
            <span>High</span>
          </div>
        </div>
      </div>

      <div className="relative">
        {/* Chart Container */}
        <div className="flex items-end justify-between gap-1 h-32">
          {data.map((point) => {
            const isCurrentHour = point.hour === currentHour;
            const height = (point.occupancy / maxOccupancy) * 100;

            return (
              <div
                key={point.hour}
                className="flex-1 flex flex-col items-center"
              >
                <div
                  className={cn(
                    "w-full rounded-t transition-all duration-300 hover:opacity-80 cursor-pointer relative group",
                    getBarColor(point.occupancy, isCurrentHour),
                  )}
                  style={{ height: `${Math.max(height, 5)}%` }}
                >
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <div className="bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                      {point.occupancy}% full
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* X-Axis Labels */}
        <div className="flex justify-between mt-2 text-xs text-gray-500">
          {data
            .filter((_, i) => i % 3 === 0) // Show every 3rd label
            .map((point) => (
              <span key={point.hour} className="text-center">
                {formatHour(point.hour)}
              </span>
            ))}
        </div>

        {/* Current Time Indicator */}
        {data.find((d) => d.hour === currentHour) && (
          <div className="mt-3 flex items-center gap-2 text-sm">
            <div className="w-3 h-3 rounded bg-emerald-600" />
            <span className="text-gray-600">
              <span className="font-medium">Now:</span>{" "}
              {data.find((d) => d.hour === currentHour)?.occupancy}% full
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
