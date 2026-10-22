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
    passType: "month",
    status: "active",
    startDate: "2026-09-15",
    endDate: "2026-10-14",
    purchaseDate: "2026-09-14",
    price: 8000,
    finalPrice: 8000,
    qrCode: "FITZONE-MONTH-BKG001-2026",
    paymentMethod: "card",
    lastCheckIn: "2026-09-30",
    totalCheckIns: 11,
  },
  {
    id: "BKG004",
    userId: "user123",
    gymId: "9",
    gymName: "Iron Shrine",
    passType: "day",
    status: "active",
    startDate: "2026-10-01",
    endDate: "2026-10-01",
    purchaseDate: "2026-09-30",
    price: 1800,
    finalPrice: 1800,
    qrCode: "SHRINE-DAY-BKG004-2026",
    paymentMethod: "card",
    totalCheckIns: 0,
  },
  {
    id: "BKG002",
    userId: "user123",
    gymId: "13",
    gymName: "Marina Box",
    passType: "week",
    status: "upcoming",
    startDate: "2026-10-08",
    endDate: "2026-10-14",
    purchaseDate: "2026-09-28",
    price: 520,
    discount: 50,
    finalPrice: 470,
    qrCode: "MARINA-WEEK-BKG002-2026",
    addOns: [{ name: "Guest pass (1x)", price: 80 }],
    paymentMethod: "mobile_wallet",
    totalCheckIns: 0,
  },
  {
    id: "BKG007",
    userId: "user123",
    gymId: "16",
    gymName: "Southbank Strength",
    passType: "day",
    status: "expired",
    startDate: "2026-09-15",
    endDate: "2026-09-15",
    purchaseDate: "2026-09-14",
    price: 18,
    finalPrice: 18,
    qrCode: "SOUTHBANK-DAY-BKG007-2026",
    paymentMethod: "card",
    lastCheckIn: "2026-09-15",
    totalCheckIns: 1,
  },
  {
    id: "BKG006",
    userId: "user123",
    gymId: "15",
    gymName: "Forja Lisboa",
    passType: "day",
    status: "expired",
    startDate: "2026-09-07",
    endDate: "2026-09-07",
    purchaseDate: "2026-09-06",
    price: 10,
    finalPrice: 10,
    qrCode: "FORJA-DAY-BKG006-2026",
    paymentMethod: "card",
    lastCheckIn: "2026-09-07",
    totalCheckIns: 1,
  },
  {
    id: "BKG005",
    userId: "user123",
    gymId: "11",
    gymName: "Urban Iron",
    passType: "day",
    status: "expired",
    startDate: "2026-09-03",
    endDate: "2026-09-03",
    purchaseDate: "2026-09-03",
    price: 12,
    finalPrice: 12,
    qrCode: "URBAN-DAY-BKG005-2026",
    paymentMethod: "card",
    lastCheckIn: "2026-09-03",
    totalCheckIns: 1,
  },
  {
    id: "BKG003",
    userId: "user123",
    gymId: "5",
    gymName: "Elite Fitness Club",
    passType: "day",
    status: "expired",
    startDate: "2026-08-19",
    endDate: "2026-08-19",
    purchaseDate: "2026-08-19",
    price: 1000,
    finalPrice: 1000,
    qrCode: "ELITE-DAY-BKG003-2026",
    paymentMethod: "card",
    lastCheckIn: "2026-08-19",
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
    holderName: "Hira Siddiqui",
    isDefault: true,
  },
  {
    id: "pm_002",
    type: "card",
    last4: "5555",
    cardBrand: "Mastercard",
    expiryMonth: 8,
    expiryYear: 2026,
    holderName: "Hira Siddiqui",
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
