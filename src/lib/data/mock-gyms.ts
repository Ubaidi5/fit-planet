// Mock gym data for UI development
// This will be replaced with real data from MongoDB later

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
  location: {
    lat: number;
    lng: number;
  };
  distance?: number; // in km (calculated based on user location)
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
  priceRanges: [
    { label: "Under Rs. 500", min: 0, max: 500 },
    { label: "Rs. 500 - 1000", min: 500, max: 1000 },
    { label: "Rs. 1000+", min: 1000, max: Infinity },
  ],
  distanceRanges: [
    { label: "Within 1 km", value: 1 },
    { label: "Within 3 km", value: 3 },
    { label: "Within 5 km", value: 5 },
    { label: "Within 10 km", value: 10 },
    { label: "Any distance", value: Infinity },
  ],
  sortOptions: [
    { label: "Nearest First", value: "distance" },
    { label: "Highest Rated", value: "rating" },
    { label: "Price: Low to High", value: "price_asc" },
    { label: "Price: High to Low", value: "price_desc" },
    { label: "Most Reviewed", value: "reviews" },
  ],
};
