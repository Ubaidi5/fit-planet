// Mock booking data for UI development

export interface Booking {
  id: string;
  userId: string;
  gymId: string;
  gymName: string;
  gymLogo?: string;
  passType: "day" | "week" | "month" | "annual";
  status: "active" | "expired" | "cancelled" | "upcoming";
  startDate: string;
  endDate: string;
  purchaseDate: string;
  price: number;
  discount?: number;
  finalPrice: number;
  qrCode: string;
  addOns?: {
    name: string;
    price: number;
  }[];
  paymentMethod: "card" | "mobile_wallet" | "bank_transfer";
  lastCheckIn?: string;
  totalCheckIns: number;
}

export interface PaymentMethod {
  id: string;
  type: "card" | "mobile_wallet";
  last4?: string;
  cardBrand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  holderName?: string;
  isDefault: boolean;
}

export const mockBookings: Booking[] = [
  {
    id: "BKG001",
    userId: "user123",
    gymId: "1",
    gymName: "FitZone Karachi",
    gymLogo:
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&q=80",
    passType: "month",
    status: "active",
    startDate: "2026-01-01",
    endDate: "2026-01-31",
    purchaseDate: "2025-12-28",
    price: 8000,
    discount: 0,
    finalPrice: 8000,
    qrCode: "FITZONE-MONTH-BKG001-2026",
    paymentMethod: "card",
    lastCheckIn: "2026-01-25",
    totalCheckIns: 18,
  },
  {
    id: "BKG002",
    userId: "user123",
    gymId: "3",
    gymName: "Flex Fitness Studio",
    gymLogo:
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=200&q=80",
    passType: "week",
    status: "upcoming",
    startDate: "2026-02-01",
    endDate: "2026-02-07",
    purchaseDate: "2026-01-26",
    price: 3000,
    discount: 300,
    finalPrice: 2700,
    qrCode: "FLEX-WEEK-BKG002-2026",
    addOns: [{ name: "Guest Pass (1x)", price: 600 }],
    paymentMethod: "mobile_wallet",
    totalCheckIns: 0,
  },
  {
    id: "BKG003",
    userId: "user123",
    gymId: "5",
    gymName: "Elite Fitness Club",
    passType: "day",
    status: "expired",
    startDate: "2026-01-15",
    endDate: "2026-01-15",
    purchaseDate: "2026-01-15",
    price: 1000,
    finalPrice: 1000,
    qrCode: "ELITE-DAY-BKG003-2026",
    paymentMethod: "card",
    lastCheckIn: "2026-01-15",
    totalCheckIns: 1,
  },
];

export const mockPaymentMethods: PaymentMethod[] = [
  {
    id: "pm_001",
    type: "card",
    last4: "4242",
    cardBrand: "Visa",
    expiryMonth: 12,
    expiryYear: 2027,
    holderName: "Muhammad Ali",
    isDefault: true,
  },
  {
    id: "pm_002",
    type: "card",
    last4: "5555",
    cardBrand: "Mastercard",
    expiryMonth: 8,
    expiryYear: 2026,
    holderName: "Muhammad Ali",
    isDefault: false,
  },
  {
    id: "pm_003",
    type: "mobile_wallet",
    isDefault: false,
  },
];

// Helper functions
export function getActiveBookings(bookings: Booking[]): Booking[] {
  return bookings.filter((b) => b.status === "active");
}

export function getUpcomingBookings(bookings: Booking[]): Booking[] {
  return bookings.filter((b) => b.status === "upcoming");
}

export function getPastBookings(bookings: Booking[]): Booking[] {
  return bookings.filter(
    (b) => b.status === "expired" || b.status === "cancelled",
  );
}

export function calculatePassDuration(passType: string): number {
  switch (passType) {
    case "day":
      return 1;
    case "week":
      return 7;
    case "month":
      return 30;
    case "annual":
      return 365;
    default:
      return 1;
  }
}

export function formatPassType(passType: string): string {
  const types: Record<string, string> = {
    day: "Day Pass",
    week: "Week Pass",
    month: "Monthly Pass",
    annual: "Annual Pass",
  };
  return types[passType] || passType;
}
