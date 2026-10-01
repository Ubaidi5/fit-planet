// Mock gym data for UI development
// This will be replaced with real data from MongoDB later.
// Prices are stored in each gym's local currency (ISO 4217) and formatted
// for the viewer with Intl in src/lib/i18n.

export interface Gym {
  id: string;
  name: string;
  slug: string;
  description: string;
  logo?: string;
  coverImage: string;
  images: string[];
  address: {
    street: string;
    city: string;
    area: string;
  };
  /** ISO 3166-1 alpha-2 country code */
  country: string;
  /** ISO 4217 currency code the gym charges in */
  currency: string;
  /** IANA timezone the opening hours are expressed in */
  timezone: string;
  location: {
    lat: number;
    lng: number;
  };
  distance?: number; // in km from the city centre (later: from the user)
  rating: number;
  totalReviews: number;
  pricing: {
    dayPass: number;
    weekPass: number;
    monthPass: number;
  };
  amenities: string[];
  equipmentTypes: string[];
  hours: {
    open: string;
    close: string;
    is24Hours: boolean;
  };
  capacity: {
    current: number;
    max: number;
  };
  isVerified: boolean;
  isFeatured: boolean;
}

export const mockGyms: Gym[] = [
  {
    id: "1",
    name: "FitZone Karachi",
    slug: "fitzone-karachi",
    description:
      "Premium fitness center with state-of-the-art equipment and expert trainers. Perfect for beginners and advanced athletes alike.",
    coverImage:
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80",
      "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800&q=80",
    ],
    address: {
      street: "Plot 123, Block 5",
      city: "Karachi",
      area: "Clifton",
    },
    country: "PK",
    currency: "PKR",
    timezone: "Asia/Karachi",
    location: { lat: 24.8138, lng: 67.0298 },
    distance: 1.2,
    rating: 4.8,
    totalReviews: 234,
    pricing: {
      dayPass: 500,
      weekPass: 2500,
      monthPass: 8000,
    },
    amenities: ["Parking", "Showers", "Lockers", "AC", "WiFi", "Sauna"],
    equipmentTypes: ["Cardio", "Strength", "Functional", "Free Weights"],
    hours: { open: "06:00", close: "23:00", is24Hours: false },
    capacity: { current: 25, max: 60 },
    isVerified: true,
    isFeatured: true,
  },
  {
    id: "2",
    name: "Iron Paradise Gym",
    slug: "iron-paradise-gym",
    description:
      "Hardcore gym for serious lifters. Heavy equipment, chalk allowed, and a no-nonsense environment for maximum gains.",
    coverImage:
      "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&q=80",
    ],
    address: {
      street: "Main Boulevard",
      city: "Karachi",
      area: "DHA Phase 6",
    },
    country: "PK",
    currency: "PKR",
    timezone: "Asia/Karachi",
    location: { lat: 24.7937, lng: 67.0562 },
    distance: 2.8,
    rating: 4.6,
    totalReviews: 189,
    pricing: {
      dayPass: 400,
      weekPass: 2000,
      monthPass: 6500,
    },
    amenities: ["Parking", "Showers", "Lockers", "AC"],
    equipmentTypes: ["Strength", "Free Weights", "Powerlifting"],
    hours: { open: "05:00", close: "00:00", is24Hours: false },
    capacity: { current: 18, max: 40 },
    isVerified: true,
    isFeatured: false,
  },
  {
    id: "3",
    name: "Flex Fitness Studio",
    slug: "flex-fitness-studio",
    description:
      "Modern fitness studio focusing on group classes, HIIT, and functional training. Great community atmosphere.",
    coverImage:
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80",
    ],
    address: {
      street: "Block 9, Commercial Area",
      city: "Karachi",
      area: "Gulshan-e-Iqbal",
    },
    country: "PK",
    currency: "PKR",
    timezone: "Asia/Karachi",
    location: { lat: 24.9215, lng: 67.0936 },
    distance: 4.5,
    rating: 4.9,
    totalReviews: 312,
    pricing: {
      dayPass: 600,
      weekPass: 3000,
      monthPass: 10000,
    },
    amenities: [
      "Parking",
      "Showers",
      "Lockers",
      "AC",
      "Cafe",
      "Personal Training",
    ],
    equipmentTypes: ["Cardio", "Functional", "CrossFit", "Yoga"],
    hours: { open: "06:00", close: "22:00", is24Hours: false },
    capacity: { current: 32, max: 50 },
    isVerified: true,
    isFeatured: true,
  },
  {
    id: "4",
    name: "PowerHouse Gym",
    slug: "powerhouse-gym",
    description:
      "Affordable gym with all essential equipment. Great for beginners starting their fitness journey.",
    coverImage:
      "https://images.unsplash.com/photo-1558611848-73f7eb4001a1?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1558611848-73f7eb4001a1?w=800&q=80",
    ],
    address: {
      street: "Near Lucky Star Mall",
      city: "Karachi",
      area: "North Nazimabad",
    },
    country: "PK",
    currency: "PKR",
    timezone: "Asia/Karachi",
    location: { lat: 24.9426, lng: 67.0346 },
    distance: 5.2,
    rating: 4.2,
    totalReviews: 87,
    pricing: {
      dayPass: 300,
      weekPass: 1500,
      monthPass: 4500,
    },
    amenities: ["Parking", "Showers", "AC"],
    equipmentTypes: ["Cardio", "Strength", "Free Weights"],
    hours: { open: "07:00", close: "22:00", is24Hours: false },
    capacity: { current: 12, max: 35 },
    isVerified: false,
    isFeatured: false,
  },
  {
    id: "5",
    name: "Elite Fitness Club",
    slug: "elite-fitness-club",
    description:
      "Luxury fitness experience with premium amenities, spa services, and world-class trainers.",
    coverImage:
      "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800&q=80",
    ],
    address: {
      street: "Zamzama Boulevard",
      city: "Karachi",
      area: "DHA Phase 5",
    },
    country: "PK",
    currency: "PKR",
    timezone: "Asia/Karachi",
    location: { lat: 24.8075, lng: 67.0349 },
    distance: 1.8,
    rating: 4.7,
    totalReviews: 156,
    pricing: {
      dayPass: 1000,
      weekPass: 5000,
      monthPass: 15000,
    },
    amenities: [
      "Parking",
      "Showers",
      "Lockers",
      "AC",
      "WiFi",
      "Sauna",
      "Pool",
      "Spa",
      "Cafe",
    ],
    equipmentTypes: [
      "Cardio",
      "Strength",
      "Functional",
      "Free Weights",
      "Swimming",
    ],
    hours: { open: "00:00", close: "00:00", is24Hours: true },
    capacity: { current: 45, max: 100 },
    isVerified: true,
    isFeatured: true,
  },
  {
    id: "6",
    name: "CrossFit Arena",
    slug: "crossfit-arena",
    description:
      "Official CrossFit box with certified coaches. Intense workouts, supportive community, real results.",
    coverImage:
      "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=800&q=80",
    ],
    address: {
      street: "Industrial Area, Block C",
      city: "Karachi",
      area: "SITE",
    },
    country: "PK",
    currency: "PKR",
    timezone: "Asia/Karachi",
    location: { lat: 24.8753, lng: 67.0129 },
    distance: 6.3,
    rating: 4.5,
    totalReviews: 98,
    pricing: {
      dayPass: 800,
      weekPass: 4000,
      monthPass: 12000,
    },
    amenities: ["Parking", "Showers", "AC"],
    equipmentTypes: ["CrossFit", "Functional", "Olympic Lifting"],
    hours: { open: "06:00", close: "21:00", is24Hours: false },
    capacity: { current: 8, max: 25 },
    isVerified: true,
    isFeatured: false,
  },
  {
    id: "7",
    name: "Zenith Wellness Center",
    slug: "zenith-wellness-center",
    description:
      "Holistic fitness center combining traditional gym with yoga, meditation, and wellness programs.",
    coverImage:
      "https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=800&q=80",
    ],
    address: {
      street: "Park Towers, Ground Floor",
      city: "Karachi",
      area: "Clifton Block 8",
    },
    country: "PK",
    currency: "PKR",
    timezone: "Asia/Karachi",
    location: { lat: 24.8262, lng: 67.0307 },
    distance: 2.1,
    rating: 4.8,
    totalReviews: 201,
    pricing: {
      dayPass: 700,
      weekPass: 3500,
      monthPass: 11000,
    },
    amenities: [
      "Parking",
      "Showers",
      "Lockers",
      "AC",
      "Meditation Room",
      "Juice Bar",
    ],
    equipmentTypes: ["Cardio", "Yoga", "Pilates", "Functional"],
    hours: { open: "05:30", close: "22:00", is24Hours: false },
    capacity: { current: 22, max: 45 },
    isVerified: true,
    isFeatured: false,
  },
  {
    id: "8",
    name: "Muscle Factory",
    slug: "muscle-factory",
    description:
      "Bodybuilding-focused gym with heavy duty equipment and experienced coaches for competitive athletes.",
    coverImage:
      "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800&q=80",
    ],
    address: {
      street: "Main University Road",
      city: "Karachi",
      area: "Gulistan-e-Jauhar",
    },
    country: "PK",
    currency: "PKR",
    timezone: "Asia/Karachi",
    location: { lat: 24.9271, lng: 67.1221 },
    distance: 7.8,
    rating: 4.4,
    totalReviews: 145,
    pricing: {
      dayPass: 350,
      weekPass: 1800,
      monthPass: 5500,
    },
    amenities: ["Parking", "Showers", "Lockers", "AC", "Supplement Shop"],
    equipmentTypes: ["Strength", "Free Weights", "Bodybuilding"],
    hours: { open: "06:00", close: "23:00", is24Hours: false },
    capacity: { current: 28, max: 50 },
    isVerified: true,
    isFeatured: false,
  },
  {
    id: "9",
    name: "Iron Shrine",
    slug: "iron-shrine-tokyo",
    description:
      "A quiet, design-led strength gym tucked behind Shibuya station. Calibrated plates, a sauna and an early-bird crowd.",
    coverImage: "https://images.unsplash.com/photo-1534258936925-c58bed479fcb?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1534258936925-c58bed479fcb?w=800&q=80",
      "https://images.unsplash.com/photo-1517963879433-6ad2b056d712?w=800&q=80",
    ],
    address: {
      street: "2-14 Dogenzaka",
      city: "Tokyo",
      area: "Shibuya",
    },
    country: "JP",
    currency: "JPY",
    timezone: "Asia/Tokyo",
    location: { lat: 35.658, lng: 139.6982 },
    distance: 0.4,
    rating: 4.8,
    totalReviews: 312,
    pricing: {
      dayPass: 1800,
      weekPass: 9800,
      monthPass: 28000,
    },
    amenities: ["Showers", "Lockers", "Sauna", "WiFi", "AC"],
    equipmentTypes: ["Strength", "Free Weights", "Olympic Lifting"],
    hours: { open: "06:00", close: "23:00", is24Hours: false },
    capacity: { current: 14, max: 40 },
    isVerified: true,
    isFeatured: true,
  },
  {
    id: "10",
    name: "Kinetic Lab Ebisu",
    slug: "kinetic-lab-ebisu",
    description:
      "Functional training floor and small-group classes with coaches who speak Japanese and English.",
    coverImage: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80",
      "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800&q=80",
    ],
    address: {
      street: "1-8 Ebisu-Minami",
      city: "Tokyo",
      area: "Ebisu",
    },
    country: "JP",
    currency: "JPY",
    timezone: "Asia/Tokyo",
    location: { lat: 35.6467, lng: 139.7101 },
    distance: 1.9,
    rating: 4.6,
    totalReviews: 148,
    pricing: {
      dayPass: 2200,
      weekPass: 11000,
      monthPass: 32000,
    },
    amenities: ["Showers", "Lockers", "AC", "Personal Training"],
    equipmentTypes: ["Functional", "Cardio", "CrossFit"],
    hours: { open: "07:00", close: "22:00", is24Hours: false },
    capacity: { current: 21, max: 30 },
    isVerified: true,
    isFeatured: false,
  },
  {
    id: "11",
    name: "Urban Iron",
    slug: "urban-iron-berlin",
    description:
      "Raw concrete, chalk everywhere and twelve racks. Kreuzberg's favourite place to lift heavy.",
    coverImage: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800&q=80",
      "https://images.unsplash.com/photo-1593079831268-3381b0db4a77?w=800&q=80",
    ],
    address: {
      street: "Skalitzer Str. 82",
      city: "Berlin",
      area: "Kreuzberg",
    },
    country: "DE",
    currency: "EUR",
    timezone: "Europe/Berlin",
    location: { lat: 52.4996, lng: 13.4185 },
    distance: 1.1,
    rating: 4.7,
    totalReviews: 420,
    pricing: {
      dayPass: 12,
      weekPass: 58,
      monthPass: 79,
    },
    amenities: ["Showers", "Lockers", "Juice Bar"],
    equipmentTypes: ["Strength", "Powerlifting", "Free Weights"],
    hours: { open: "00:00", close: "23:59", is24Hours: true },
    capacity: { current: 9, max: 45 },
    isVerified: true,
    isFeatured: true,
  },
  {
    id: "12",
    name: "Kraftwerk Studio",
    slug: "kraftwerk-studio-berlin",
    description:
      "Light-filled studio in a former factory. Yoga, mobility and a compact strength corner.",
    coverImage: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80",
      "https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=800&q=80",
    ],
    address: {
      street: "Köpenicker Str. 70",
      city: "Berlin",
      area: "Mitte",
    },
    country: "DE",
    currency: "EUR",
    timezone: "Europe/Berlin",
    location: { lat: 52.5103, lng: 13.4196 },
    distance: 2.4,
    rating: 4.5,
    totalReviews: 196,
    pricing: {
      dayPass: 14,
      weekPass: 49,
      monthPass: 69,
    },
    amenities: ["Showers", "Meditation Room", "Cafe"],
    equipmentTypes: ["Yoga", "Pilates", "Functional"],
    hours: { open: "06:30", close: "22:00", is24Hours: false },
    capacity: { current: 6, max: 35 },
    isVerified: true,
    isFeatured: false,
  },
  {
    id: "13",
    name: "Marina Box",
    slug: "marina-box-dubai",
    description:
      "Air-conditioned CrossFit box with a marina view, ice baths and classes from 5am.",
    coverImage: "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=800&q=80",
      "https://images.unsplash.com/photo-1558611848-73f7eb4001a1?w=800&q=80",
    ],
    address: {
      street: "Marina Walk, Tower 3",
      city: "Dubai",
      area: "Dubai Marina",
    },
    country: "AE",
    currency: "AED",
    timezone: "Asia/Dubai",
    location: { lat: 25.0805, lng: 55.1403 },
    distance: 0.8,
    rating: 4.9,
    totalReviews: 267,
    pricing: {
      dayPass: 95,
      weekPass: 420,
      monthPass: 890,
    },
    amenities: ["Parking", "Showers", "Lockers", "AC", "Spa"],
    equipmentTypes: ["CrossFit", "Functional", "Olympic Lifting"],
    hours: { open: "05:00", close: "23:00", is24Hours: false },
    capacity: { current: 33, max: 40 },
    isVerified: true,
    isFeatured: true,
  },
  {
    id: "14",
    name: "Brick Lab",
    slug: "brick-lab-new-york",
    description:
      "Brooklyn warehouse gym with turf, sleds, a boxing corner and an open-late schedule.",
    coverImage: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=800&q=80",
      "https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=800&q=80",
    ],
    address: {
      street: "88 Wythe Ave",
      city: "New York",
      area: "Williamsburg",
    },
    country: "US",
    currency: "USD",
    timezone: "America/New_York",
    location: { lat: 40.721, lng: -73.958 },
    distance: 1.3,
    rating: 4.6,
    totalReviews: 538,
    pricing: {
      dayPass: 30,
      weekPass: 110,
      monthPass: 189,
    },
    amenities: ["Showers", "Lockers", "WiFi", "Supplement Shop"],
    equipmentTypes: ["Functional", "Strength", "Cardio"],
    hours: { open: "05:00", close: "23:00", is24Hours: false },
    capacity: { current: 48, max: 55 },
    isVerified: true,
    isFeatured: false,
  },
  {
    id: "15",
    name: "Forja Lisboa",
    slug: "forja-lisboa",
    description:
      "Neighbourhood gym in Alfama with a rooftop training deck and coaches for every level.",
    coverImage: "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=800&q=80",
      "https://images.unsplash.com/photo-1594381898411-846e7d193883?w=800&q=80",
    ],
    address: {
      street: "Rua dos Remédios 41",
      city: "Lisbon",
      area: "Alfama",
    },
    country: "PT",
    currency: "EUR",
    timezone: "Europe/Lisbon",
    location: { lat: 38.7115, lng: -9.1281 },
    distance: 0.6,
    rating: 4.7,
    totalReviews: 121,
    pricing: {
      dayPass: 10,
      weekPass: 35,
      monthPass: 55,
    },
    amenities: ["Showers", "Lockers", "WiFi"],
    equipmentTypes: ["Functional", "Cardio", "Free Weights"],
    hours: { open: "07:00", close: "22:00", is24Hours: false },
    capacity: { current: 7, max: 30 },
    isVerified: true,
    isFeatured: false,
  },
  {
    id: "16",
    name: "Southbank Strength",
    slug: "southbank-strength-london",
    description:
      "Riverside strength club with Olympic platforms, a recovery suite and lunchtime express classes.",
    coverImage: "https://images.unsplash.com/photo-1566241142559-40e1dab266c6?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1566241142559-40e1dab266c6?w=800&q=80",
      "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&q=80",
    ],
    address: {
      street: "45 Belvedere Rd",
      city: "London",
      area: "Southbank",
    },
    country: "GB",
    currency: "GBP",
    timezone: "Europe/London",
    location: { lat: 51.5033, lng: -0.115 },
    distance: 0.9,
    rating: 4.5,
    totalReviews: 302,
    pricing: {
      dayPass: 18,
      weekPass: 65,
      monthPass: 120,
    },
    amenities: ["Showers", "Lockers", "Sauna", "Cafe"],
    equipmentTypes: ["Strength", "Olympic Lifting", "Cardio"],
    hours: { open: "06:00", close: "22:30", is24Hours: false },
    capacity: { current: 29, max: 60 },
    isVerified: true,
    isFeatured: false,
  },
  {
    id: "17",
    name: "Shinjuku Forge",
    slug: "shinjuku-forge-tokyo",
    description:
      "A 24-hour training floor above Shinjuku with racks on every wall and city views from the treadmills.",
    coverImage: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800&q=80",
      "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800&q=80",
    ],
    address: {
      street: "3-22 Shinjuku",
      city: "Tokyo",
      area: "Shinjuku",
    },
    country: "JP",
    currency: "JPY",
    timezone: "Asia/Tokyo",
    location: { lat: 35.6909, lng: 139.7003 },
    distance: 3.6,
    rating: 4.6,
    totalReviews: 421,
    pricing: {
      dayPass: 1500,
      weekPass: 8200,
      monthPass: 22000,
    },
    amenities: ["Showers", "Lockers", "WiFi", "AC"],
    equipmentTypes: ["Strength", "Cardio", "Free Weights"],
    hours: { open: "00:00", close: "00:00", is24Hours: true },
    capacity: { current: 41, max: 60 },
    isVerified: true,
    isFeatured: false,
  },
  {
    id: "18",
    name: "Nakameguro Move",
    slug: "nakameguro-move-tokyo",
    description:
      "Riverside studio for mobility, pilates and small-group strength, run by former physios.",
    coverImage: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&q=80",
      "https://images.unsplash.com/photo-1558611848-73f7eb4001a1?w=800&q=80",
    ],
    address: {
      street: "1-5 Kamimeguro",
      city: "Tokyo",
      area: "Nakameguro",
    },
    country: "JP",
    currency: "JPY",
    timezone: "Asia/Tokyo",
    location: { lat: 35.6443, lng: 139.699 },
    distance: 2.4,
    rating: 4.9,
    totalReviews: 188,
    pricing: {
      dayPass: 2600,
      weekPass: 12000,
      monthPass: 32000,
    },
    amenities: ["Showers", "Lockers", "Cafe", "Meditation Room"],
    equipmentTypes: ["Pilates", "Yoga", "Functional"],
    hours: { open: "07:00", close: "22:00", is24Hours: false },
    capacity: { current: 8, max: 24 },
    isVerified: true,
    isFeatured: false,
  },
  {
    id: "19",
    name: "Hafen Athletics",
    slug: "hafen-athletics-berlin",
    description:
      "Converted warehouse in Friedrichshain with lifting platforms, sleds and a turf lane.",
    coverImage: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80",
      "https://images.unsplash.com/photo-1566241142559-40e1dab266c6?w=800&q=80",
    ],
    address: {
      street: "Revaler Str. 99",
      city: "Berlin",
      area: "Friedrichshain",
    },
    country: "DE",
    currency: "EUR",
    timezone: "Europe/Berlin",
    location: { lat: 52.5075, lng: 13.454 },
    distance: 3.1,
    rating: 4.7,
    totalReviews: 264,
    pricing: {
      dayPass: 11,
      weekPass: 39,
      monthPass: 69,
    },
    amenities: ["Showers", "Lockers", "WiFi", "Juice Bar"],
    equipmentTypes: ["CrossFit", "Olympic Lifting", "Functional"],
    hours: { open: "06:00", close: "23:00", is24Hours: false },
    capacity: { current: 31, max: 50 },
    isVerified: true,
    isFeatured: false,
  },
  {
    id: "20",
    name: "Kiez Fit",
    slug: "kiez-fit-berlin",
    description:
      "Neighbourhood gym in Prenzlauer Berg with friendly coaches and a quiet morning crowd.",
    coverImage: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80",
      "https://images.unsplash.com/photo-1594381898411-846e7d193883?w=800&q=80",
    ],
    address: {
      street: "Kastanienallee 12",
      city: "Berlin",
      area: "Prenzlauer Berg",
    },
    country: "DE",
    currency: "EUR",
    timezone: "Europe/Berlin",
    location: { lat: 52.538, lng: 13.411 },
    distance: 2.9,
    rating: 4.5,
    totalReviews: 143,
    pricing: {
      dayPass: 9,
      weekPass: 32,
      monthPass: 55,
    },
    amenities: ["Showers", "Lockers", "Sauna"],
    equipmentTypes: ["Strength", "Cardio", "Yoga"],
    hours: { open: "06:30", close: "22:30", is24Hours: false },
    capacity: { current: 12, max: 40 },
    isVerified: true,
    isFeatured: false,
  },
  {
    id: "21",
    name: "Burj Athletic Club",
    slug: "burj-athletic-dubai",
    description:
      "Premium club in Downtown with a rooftop pool, recovery suite and private coaching floors.",
    coverImage: "https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=800&q=80",
      "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800&q=80",
    ],
    address: {
      street: "Sheikh Mohammed bin Rashid Blvd",
      city: "Dubai",
      area: "Downtown",
    },
    country: "AE",
    currency: "AED",
    timezone: "Asia/Dubai",
    location: { lat: 25.1972, lng: 55.2744 },
    distance: 3.4,
    rating: 4.8,
    totalReviews: 512,
    pricing: {
      dayPass: 150,
      weekPass: 520,
      monthPass: 1200,
    },
    amenities: ["Pool", "Spa", "Sauna", "Parking", "Personal Training"],
    equipmentTypes: ["Strength", "Cardio", "Swimming"],
    hours: { open: "05:00", close: "00:00", is24Hours: false },
    capacity: { current: 58, max: 120 },
    isVerified: true,
    isFeatured: true,
  },
  {
    id: "22",
    name: "JLT Iron House",
    slug: "jlt-iron-house-dubai",
    description:
      "No-frills strength gym by the lakes in JLT, open around the clock for shift workers.",
    coverImage: "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=800&q=80",
      "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&q=80",
    ],
    address: {
      street: "Cluster T, JLT",
      city: "Dubai",
      area: "JLT",
    },
    country: "AE",
    currency: "AED",
    timezone: "Asia/Dubai",
    location: { lat: 25.0693, lng: 55.1413 },
    distance: 1.9,
    rating: 4.4,
    totalReviews: 276,
    pricing: {
      dayPass: 60,
      weekPass: 210,
      monthPass: 450,
    },
    amenities: ["Parking", "Showers", "Lockers", "AC"],
    equipmentTypes: ["Powerlifting", "Bodybuilding", "Free Weights"],
    hours: { open: "00:00", close: "00:00", is24Hours: true },
    capacity: { current: 17, max: 45 },
    isVerified: true,
    isFeatured: false,
  },
  {
    id: "23",
    name: "Shoreditch Social Strength",
    slug: "shoreditch-strength-london",
    description:
      "Coach-led strength classes and open gym under the railway arches in Shoreditch.",
    coverImage: "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=800&q=80",
      "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80",
    ],
    address: {
      street: "Arch 402, Rivington St",
      city: "London",
      area: "Shoreditch",
    },
    country: "GB",
    currency: "GBP",
    timezone: "Europe/London",
    location: { lat: 51.5265, lng: -0.0786 },
    distance: 4.2,
    rating: 4.7,
    totalReviews: 331,
    pricing: {
      dayPass: 22,
      weekPass: 75,
      monthPass: 149,
    },
    amenities: ["Showers", "Lockers", "Cafe", "WiFi"],
    equipmentTypes: ["Strength", "Functional", "CrossFit"],
    hours: { open: "06:00", close: "22:00", is24Hours: false },
    capacity: { current: 22, max: 40 },
    isVerified: true,
    isFeatured: false,
  },
  {
    id: "24",
    name: "SoHo Strength Co.",
    slug: "soho-strength-new-york",
    description:
      "Boutique strength studio in SoHo with Eleiko platforms and a members' lounge.",
    coverImage: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=800&q=80",
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80",
    ],
    address: {
      street: "120 Grand St",
      city: "New York",
      area: "SoHo",
    },
    country: "US",
    currency: "USD",
    timezone: "America/New_York",
    location: { lat: 40.7209, lng: -74.0007 },
    distance: 2.6,
    rating: 4.8,
    totalReviews: 402,
    pricing: {
      dayPass: 38,
      weekPass: 140,
      monthPass: 260,
    },
    amenities: ["Showers", "Lockers", "Cafe", "WiFi", "Personal Training"],
    equipmentTypes: ["Strength", "Olympic Lifting", "Free Weights"],
    hours: { open: "05:30", close: "23:00", is24Hours: false },
    capacity: { current: 19, max: 40 },
    isVerified: true,
    isFeatured: true,
  },
  {
    id: "25",
    name: "Chelsea Piers Fit",
    slug: "chelsea-fit-new-york",
    description:
      "Huge riverside facility in Chelsea with a pool, track and a turf field.",
    coverImage: "https://images.unsplash.com/photo-1593079831268-3381b0db4a77?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1593079831268-3381b0db4a77?w=800&q=80",
      "https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=800&q=80",
    ],
    address: {
      street: "62 Chelsea Piers",
      city: "New York",
      area: "Chelsea",
    },
    country: "US",
    currency: "USD",
    timezone: "America/New_York",
    location: { lat: 40.7465, lng: -74.008 },
    distance: 2.1,
    rating: 4.6,
    totalReviews: 688,
    pricing: {
      dayPass: 45,
      weekPass: 160,
      monthPass: 299,
    },
    amenities: ["Pool", "Sauna", "Showers", "Lockers", "Parking"],
    equipmentTypes: ["Cardio", "Swimming", "Strength"],
    hours: { open: "05:00", close: "23:00", is24Hours: false },
    capacity: { current: 140, max: 220 },
    isVerified: true,
    isFeatured: false,
  },
  {
    id: "26",
    name: "Príncipe Real Box",
    slug: "principe-real-box-lisbon",
    description:
      "Small CrossFit box in a restored townhouse, with sunrise classes on the terrace.",
    coverImage: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800&q=80",
      "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=800&q=80",
    ],
    address: {
      street: "Rua da Escola Politécnica 40",
      city: "Lisbon",
      area: "Príncipe Real",
    },
    country: "PT",
    currency: "EUR",
    timezone: "Europe/Lisbon",
    location: { lat: 38.7165, lng: -9.149 },
    distance: 1.7,
    rating: 4.7,
    totalReviews: 121,
    pricing: {
      dayPass: 12,
      weekPass: 40,
      monthPass: 75,
    },
    amenities: ["Showers", "Lockers", "WiFi"],
    equipmentTypes: ["CrossFit", "Functional"],
    hours: { open: "06:30", close: "21:30", is24Hours: false },
    capacity: { current: 14, max: 20 },
    isVerified: true,
    isFeatured: false,
  },
];

// Filter options for the search UI
export const filterOptions = {
  amenities: [
    "Parking",
    "Showers",
    "Lockers",
    "AC",
    "WiFi",
    "Sauna",
    "Pool",
    "Spa",
    "Cafe",
    "Personal Training",
    "Meditation Room",
    "Juice Bar",
    "Supplement Shop",
  ],
  equipmentTypes: [
    "Cardio",
    "Strength",
    "Functional",
    "Free Weights",
    "CrossFit",
    "Yoga",
    "Pilates",
    "Swimming",
    "Powerlifting",
    "Bodybuilding",
    "Olympic Lifting",
  ],
  // Price tiers are relative to the city's average day pass, so they work
  // in any currency
  priceRanges: [
    { label: "Budget", min: 0, max: 0.85 },
    { label: "Mid-range", min: 0.85, max: 1.15 },
    { label: "Premium", min: 1.15, max: Infinity },
  ],
  distanceRanges: [
    { label: "Within 1 km", value: 1 },
    { label: "Within 3 km", value: 3 },
    { label: "Within 5 km", value: 5 },
    { label: "Within 10 km", value: 10 },
    { label: "Any distance", value: Infinity },
  ],
  sortOptions: [
    { label: "Nearest first", value: "distance" },
    { label: "Highest Rated", value: "rating" },
    { label: "Price: Low to High", value: "price_asc" },
    { label: "Price: High to Low", value: "price_desc" },
    { label: "Most Reviewed", value: "reviews" },
  ],
};

/** Cities that have at least one partner gym, in the order gyms were added */
export const gymCities = Array.from(new Set(mockGyms.map((gym) => gym.address.city)));

/** Average day pass per city, used for relative price tiers */
export function cityAverageDayPass(city: string) {
  const inCity = mockGyms.filter((gym) => gym.address.city === city);
  if (inCity.length === 0) return 0;
  return inCity.reduce((sum, gym) => sum + gym.pricing.dayPass, 0) / inCity.length;
}
