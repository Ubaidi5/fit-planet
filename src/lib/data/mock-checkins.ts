// Mock check-in data for UI development

export interface CheckIn {
  id: string;
  bookingId: string;
  gymId: string;
  gymName: string;
  gymLogo?: string;
  gymAddress: string;
  checkInTime: string;
  checkOutTime?: string;
  duration?: number; // in minutes
  passType: "day" | "week" | "month" | "annual";
}

export const mockCheckIns: CheckIn[] = [
  {
    id: "CHK001",
    bookingId: "BKG001",
    gymId: "1",
    gymName: "FitZone Karachi",
    gymLogo:
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&q=80",
    gymAddress: "DHA Phase 5, Karachi",
    checkInTime: "2026-01-26T09:30:00",
    checkOutTime: "2026-01-26T11:15:00",
    duration: 105,
    passType: "month",
  },
  {
    id: "CHK002",
    bookingId: "BKG001",
    gymId: "1",
    gymName: "FitZone Karachi",
    gymLogo:
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&q=80",
    gymAddress: "DHA Phase 5, Karachi",
    checkInTime: "2026-01-25T18:00:00",
    checkOutTime: "2026-01-25T19:45:00",
    duration: 105,
    passType: "month",
  },
  {
    id: "CHK003",
    bookingId: "BKG001",
    gymId: "1",
    gymName: "FitZone Karachi",
    gymLogo:
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&q=80",
    gymAddress: "DHA Phase 5, Karachi",
    checkInTime: "2026-01-24T07:00:00",
    checkOutTime: "2026-01-24T08:30:00",
    duration: 90,
    passType: "month",
  },
  {
    id: "CHK004",
    bookingId: "BKG001",
    gymId: "1",
    gymName: "FitZone Karachi",
    gymLogo:
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&q=80",
    gymAddress: "DHA Phase 5, Karachi",
    checkInTime: "2026-01-23T17:30:00",
    checkOutTime: "2026-01-23T19:00:00",
    duration: 90,
    passType: "month",
  },
  {
    id: "CHK005",
    bookingId: "BKG001",
    gymId: "1",
    gymName: "FitZone Karachi",
    gymLogo:
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&q=80",
    gymAddress: "DHA Phase 5, Karachi",
    checkInTime: "2026-01-22T06:30:00",
    checkOutTime: "2026-01-22T08:00:00",
    duration: 90,
    passType: "month",
  },
  {
    id: "CHK006",
    bookingId: "BKG003",
    gymId: "5",
    gymName: "Elite Fitness Club",
    gymAddress: "Clifton Block 5, Karachi",
    checkInTime: "2026-01-15T10:00:00",
    checkOutTime: "2026-01-15T11:30:00",
    duration: 90,
    passType: "day",
  },
  {
    id: "CHK007",
    bookingId: "BKG004",
    gymId: "2",
    gymName: "Iron Paradise",
    gymLogo:
      "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=200&q=80",
    gymAddress: "Gulshan-e-Iqbal, Karachi",
    checkInTime: "2026-01-10T16:00:00",
    checkOutTime: "2026-01-10T17:30:00",
    duration: 90,
    passType: "week",
  },
  {
    id: "CHK008",
    bookingId: "BKG004",
    gymId: "2",
    gymName: "Iron Paradise",
    gymLogo:
      "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=200&q=80",
    gymAddress: "Gulshan-e-Iqbal, Karachi",
    checkInTime: "2026-01-09T17:00:00",
    checkOutTime: "2026-01-09T18:45:00",
    duration: 105,
    passType: "week",
  },
];

// Helper functions
export function getCheckInsByDate(checkIns: CheckIn[], date: Date): CheckIn[] {
  const dateString = date.toISOString().split("T")[0];
  return checkIns.filter((c) => c.checkInTime.split("T")[0] === dateString);
}

export function getCheckInsByMonth(
  checkIns: CheckIn[],
  year: number,
  month: number,
): CheckIn[] {
  return checkIns.filter((c) => {
    const date = new Date(c.checkInTime);
    return date.getFullYear() === year && date.getMonth() === month;
  });
}

export function getTotalDuration(checkIns: CheckIn[]): number {
  return checkIns.reduce((total, c) => total + (c.duration || 0), 0);
}

export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
}

export function getUniqueGyms(checkIns: CheckIn[]): string[] {
  return [...new Set(checkIns.map((c) => c.gymId))];
}

export function getStreakDays(checkIns: CheckIn[]): number {
  if (checkIns.length === 0) return 0;

  // Sort by date descending
  const sortedDates = checkIns
    .map((c) => c.checkInTime.split("T")[0])
    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  // Get unique dates
  const uniqueDates = [...new Set(sortedDates)];

  let streak = 1;
  const today = new Date().toISOString().split("T")[0];

  // Check if last check-in was today or yesterday
  const lastCheckIn = uniqueDates[0];
  const daysDiff = Math.floor(
    (new Date(today).getTime() - new Date(lastCheckIn).getTime()) /
      (1000 * 60 * 60 * 24),
  );

  if (daysDiff > 1) return 0; // Streak broken

  for (let i = 1; i < uniqueDates.length; i++) {
    const prevDate = new Date(uniqueDates[i - 1]);
    const currDate = new Date(uniqueDates[i]);
    const diff = Math.floor(
      (prevDate.getTime() - currDate.getTime()) / (1000 * 60 * 60 * 24),
    );
    if (diff === 1) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}
