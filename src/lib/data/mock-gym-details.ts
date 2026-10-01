// Extended gym details for the gym profile pages
// This will be replaced with real data from MongoDB later

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  helpful: number;
  categories: {
    cleanliness: number;
    equipment: number;
    staff: number;
    value: number;
  };
  images?: string[];
  gymResponse?: {
    response: string;
    date: string;
  };
  isVerified: boolean;
}

export interface Trainer {
  id: string;
  name: string;
  avatar: string;
  specializations: string[];
  experience: number; // years
  rating: number;
  totalClients: number;
  bio: string;
  certifications: string[];
  hourlyRate: number;
  availability: string;
}

export interface GymClass {
  id: string;
  name: string;
  description: string;
  instructor: string;
  duration: number; // minutes
  difficulty: "Beginner" | "Intermediate" | "Advanced" | "All Levels";
  maxParticipants: number;
  currentEnrolled: number;
  schedule: {
    day: string;
    time: string;
  }[];
  image?: string;
}

export interface Equipment {
  name: string;
  quantity: number;
  brand?: string;
  condition: "New" | "Good" | "Fair";
}

export interface OperatingHours {
  day: string;
  open: string;
  close: string;
  isClosed: boolean;
}

export interface AddOn {
  id: string;
  name: string;
  description: string;
  price: number;
  category: "Equipment" | "Service" | "Access";
  icon?: string;
  isAvailable: boolean;
  limitations?: string;
}

export interface GymDetail {
  id: string;
  // Extended description
  longDescription: string;

  // Photo gallery
  gallery: {
    url: string;
    caption: string;
    category: "Equipment" | "Facility" | "Classes" | "Trainers" | "Exterior";
  }[];

  // Video tour
  videoTour?: string;

  // Detailed hours
  operatingHours: OperatingHours[];

  // Equipment list
  equipment: Equipment[];

  // Trainers
  trainers: Trainer[];

  // Classes
  classes: GymClass[];

  // Reviews
  reviews: Review[];
  ratingBreakdown: {
    cleanliness: number;
    equipment: number;
    staff: number;
    value: number;
  };

  // Add-ons
  addOns: AddOn[];

  // Additional pricing
  annualPass?: number;
  specialPackages?: {
    name: string;
    price: number;
    description: string;
    features: string[];
  }[];

  // Policies
  policies: {
    cancellation: string;
    guestPolicy: string;
    dresscode: string;
    ageRestriction: string;
  };

  // Crowd data (mock)
  crowdData: {
    hour: number;
    occupancy: number; // percentage
  }[];

  // Contact
  contact: {
    phone: string;
    email: string;
    website?: string;
    instagram?: string;
    facebook?: string;
  };
}

// Detailed data for gym ID "1" (FitZone Karachi)
export const gymDetails: Record<string, GymDetail> = {
  "1": {
    id: "1",
    longDescription: `FitZone Karachi is a premium fitness center located in the heart of Clifton. 
Established in 2018, we've grown to become one of the most trusted fitness destinations in Karachi. 
Our 8,000 sq ft facility features state-of-the-art equipment from Life Fitness and Hammer Strength, 
spacious cardio and strength training areas, and dedicated zones for functional training.

Whether you're a beginner starting your fitness journey or an advanced athlete pushing your limits, 
our certified trainers and supportive community are here to help you achieve your goals. We take pride 
in maintaining the highest standards of cleanliness and safety, ensuring you can focus entirely on your workout.

Join FitZone today and experience the difference of training at a facility that truly cares about your progress.`,

    gallery: [
      {
        url: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80",
        caption: "Main Gym Floor",
        category: "Facility",
      },
      {
        url: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800&q=80",
        caption: "Strength Training Area",
        category: "Equipment",
      },
      {
        url: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&q=80",
        caption: "Cardio Zone",
        category: "Equipment",
      },
      {
        url: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80",
        caption: "Group Classes Studio",
        category: "Classes",
      },
      {
        url: "https://images.unsplash.com/photo-1593079831268-3381b0db4a77?w=800&q=80",
        caption: "Free Weights Section",
        category: "Equipment",
      },
      {
        url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
        caption: "Reception & Lounge",
        category: "Facility",
      },
    ],

    videoTour: "https://www.youtube.com/embed/dQw4w9WgXcQ",

    operatingHours: [
      { day: "Monday", open: "06:00", close: "23:00", isClosed: false },
      { day: "Tuesday", open: "06:00", close: "23:00", isClosed: false },
      { day: "Wednesday", open: "06:00", close: "23:00", isClosed: false },
      { day: "Thursday", open: "06:00", close: "23:00", isClosed: false },
      { day: "Friday", open: "06:00", close: "23:00", isClosed: false },
      { day: "Saturday", open: "08:00", close: "21:00", isClosed: false },
      { day: "Sunday", open: "08:00", close: "20:00", isClosed: false },
    ],

    equipment: [
      {
        name: "Treadmills",
        quantity: 12,
        brand: "Life Fitness",
        condition: "New",
      },
      {
        name: "Ellipticals",
        quantity: 8,
        brand: "Life Fitness",
        condition: "New",
      },
      {
        name: "Stationary Bikes",
        quantity: 10,
        brand: "Schwinn",
        condition: "Good",
      },
      {
        name: "Rowing Machines",
        quantity: 4,
        brand: "Concept2",
        condition: "New",
      },
      {
        name: "Smith Machines",
        quantity: 2,
        brand: "Hammer Strength",
        condition: "Good",
      },
      {
        name: "Cable Crossover",
        quantity: 3,
        brand: "Hammer Strength",
        condition: "New",
      },
      {
        name: "Leg Press",
        quantity: 2,
        brand: "Hammer Strength",
        condition: "Good",
      },
      { name: "Squat Racks", quantity: 4, brand: "Rogue", condition: "New" },
      {
        name: "Bench Press Stations",
        quantity: 3,
        brand: "Rogue",
        condition: "Good",
      },
      {
        name: "Dumbbells (pairs)",
        quantity: 30,
        brand: "Rogue",
        condition: "New",
      },
      { name: "Kettlebells", quantity: 15, brand: "Rogue", condition: "New" },
      { name: "Battle Ropes", quantity: 2, condition: "Good" },
    ],

    trainers: [
      {
        id: "t1",
        name: "Ahmed Khan",
        avatar:
          "https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=200&q=80",
        specializations: ["Weight Training", "Bodybuilding", "Nutrition"],
        experience: 8,
        rating: 4.9,
        totalClients: 150,
        bio: "Certified personal trainer with a passion for helping clients achieve their dream physique. Former national-level bodybuilding competitor.",
        certifications: ["ACE Certified", "NASM-CPT", "Precision Nutrition L1"],
        hourlyRate: 2500,
        availability: "Mon-Sat, 6 AM - 2 PM",
      },
      {
        id: "t2",
        name: "Sara Malik",
        avatar:
          "https://images.unsplash.com/photo-1594381898411-846e7d193883?w=200&q=80",
        specializations: ["Functional Training", "HIIT", "Women's Fitness"],
        experience: 5,
        rating: 4.8,
        totalClients: 95,
        bio: "Passionate about empowering women through fitness. Specializing in high-intensity training and functional movements.",
        certifications: ["NASM-CPT", "CrossFit Level 1", "TRX Certified"],
        hourlyRate: 2000,
        availability: "Mon-Fri, 4 PM - 10 PM",
      },
      {
        id: "t3",
        name: "Bilal Hassan",
        avatar:
          "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=200&q=80",
        specializations: [
          "Strength & Conditioning",
          "Sports Performance",
          "Powerlifting",
        ],
        experience: 6,
        rating: 4.7,
        totalClients: 80,
        bio: "Former athlete turned coach. Helping clients build real-world strength and improve athletic performance.",
        certifications: [
          "CSCS",
          "USAW Sports Performance Coach",
          "FMS Certified",
        ],
        hourlyRate: 2200,
        availability: "Daily, 7 AM - 3 PM",
      },
    ],

    classes: [
      {
        id: "c1",
        name: "Morning HIIT Blast",
        description:
          "High-intensity interval training to kickstart your day. Burn maximum calories in minimum time.",
        instructor: "Sara Malik",
        duration: 45,
        difficulty: "Intermediate",
        maxParticipants: 20,
        currentEnrolled: 15,
        schedule: [
          { day: "Monday", time: "07:00" },
          { day: "Wednesday", time: "07:00" },
          { day: "Friday", time: "07:00" },
        ],
        image:
          "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&q=80",
      },
      {
        id: "c2",
        name: "Power Yoga",
        description:
          "A dynamic yoga practice that builds strength, flexibility, and mental focus.",
        instructor: "Ayesha Siddiqui",
        duration: 60,
        difficulty: "All Levels",
        maxParticipants: 15,
        currentEnrolled: 12,
        schedule: [
          { day: "Tuesday", time: "18:00" },
          { day: "Thursday", time: "18:00" },
          { day: "Saturday", time: "10:00" },
        ],
        image:
          "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&q=80",
      },
      {
        id: "c3",
        name: "Strength Foundations",
        description:
          "Learn proper lifting techniques and build a solid strength base. Perfect for beginners.",
        instructor: "Ahmed Khan",
        duration: 60,
        difficulty: "Beginner",
        maxParticipants: 12,
        currentEnrolled: 8,
        schedule: [
          { day: "Monday", time: "19:00" },
          { day: "Thursday", time: "19:00" },
        ],
        image:
          "https://images.unsplash.com/photo-1517963879433-6ad2b056d712?w=400&q=80",
      },
      {
        id: "c4",
        name: "Spin & Burn",
        description:
          "High-energy indoor cycling class set to motivating music. Great cardio workout.",
        instructor: "Zara Ahmed",
        duration: 45,
        difficulty: "Intermediate",
        maxParticipants: 25,
        currentEnrolled: 22,
        schedule: [
          { day: "Tuesday", time: "07:00" },
          { day: "Thursday", time: "07:00" },
          { day: "Saturday", time: "09:00" },
        ],
        image:
          "https://images.unsplash.com/photo-1534258936925-c58bed479fcb?w=400&q=80",
      },
    ],

    reviews: [
      {
        id: "r1",
        userId: "u1",
        userName: "Muhammad Ali",
        userAvatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80",
        rating: 5,
        title: "Best gym in Clifton - hands down!",
        comment:
          "Been a member for 2 years now and couldn't be happier. The equipment is always well-maintained, staff is friendly, and the trainers really know their stuff. The AC works perfectly even in peak summer. Highly recommended!",
        date: "2025-12-15",
        helpful: 45,
        categories: { cleanliness: 5, equipment: 5, staff: 5, value: 4 },
        isVerified: true,
      },
      {
        id: "r2",
        userId: "u2",
        userName: "Fatima Sheikh",
        userAvatar:
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80",
        rating: 4,
        title: "Great facilities, slightly crowded evenings",
        comment:
          "Love the variety of equipment and the group classes are excellent. Only downside is it gets quite crowded between 6-8 PM. I'd recommend going early morning for the best experience.",
        date: "2025-11-28",
        helpful: 32,
        categories: { cleanliness: 5, equipment: 5, staff: 4, value: 4 },
        gymResponse: {
          response:
            "Thank you for your feedback, Fatima! We're working on expanding our evening class schedules to better accommodate peak hours. See you at the gym!",
          date: "2025-11-30",
        },
        isVerified: true,
      },
      {
        id: "r3",
        userId: "u3",
        userName: "Hassan Raza",
        userAvatar:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80",
        rating: 5,
        title: "Transformed my fitness journey",
        comment:
          "Started as a complete beginner with Ahmed as my trainer. 6 months later, I've lost 15kg and gained real strength. The personalized attention and supportive environment made all the difference. Worth every rupee!",
        date: "2025-11-10",
        helpful: 58,
        categories: { cleanliness: 5, equipment: 5, staff: 5, value: 5 },
        images: [
          "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&q=80",
        ],
        isVerified: true,
      },
      {
        id: "r4",
        userId: "u4",
        userName: "Zainab Hussain",
        rating: 4,
        title: "Clean and well-equipped",
        comment:
          "The gym maintains high hygiene standards which I really appreciate. Good range of equipment for all fitness levels. The sauna is a nice bonus after a tough workout.",
        date: "2025-10-22",
        helpful: 18,
        categories: { cleanliness: 5, equipment: 4, staff: 4, value: 4 },
        isVerified: true,
      },
      {
        id: "r5",
        userId: "u5",
        userName: "Usman Tariq",
        userAvatar:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80",
        rating: 5,
        title: "Premium experience worth the price",
        comment:
          "Yes, it's on the pricier side, but you get what you pay for. Top-notch equipment, clean facilities, professional trainers, and a great atmosphere. The app integration for booking classes is super convenient.",
        date: "2025-10-05",
        helpful: 27,
        categories: { cleanliness: 5, equipment: 5, staff: 5, value: 4 },
        isVerified: true,
      },
    ],

    ratingBreakdown: {
      cleanliness: 4.9,
      equipment: 4.8,
      staff: 4.7,
      value: 4.3,
    },

    addOns: [
      {
        id: "addon-1",
        name: "Guest Pass",
        description: "Bring a friend to workout with you for the day",
        price: 600,
        category: "Access",
        isAvailable: true,
        limitations: "Valid for single day use only",
      },
      {
        id: "addon-2",
        name: "Locker Rental",
        description: "Secure locker for your belongings during workout",
        price: 200,
        category: "Service",
        isAvailable: true,
        limitations: "Per day rental",
      },
      {
        id: "addon-3",
        name: "Personal Training Session",
        description: "One-on-one training with certified personal trainer",
        price: 3000,
        category: "Service",
        isAvailable: true,
        limitations: "60-minute session, advance booking required",
      },
      {
        id: "addon-4",
        name: "Towel Service",
        description: "Fresh towel provided for your workout",
        price: 100,
        category: "Equipment",
        isAvailable: true,
      },
      {
        id: "addon-5",
        name: "Yoga Mat Rental",
        description: "Premium yoga mat for classes or stretching",
        price: 150,
        category: "Equipment",
        isAvailable: true,
        limitations: "Per session rental",
      },
    ],

    annualPass: 72000,

    specialPackages: [
      {
        name: "Student Special",
        price: 6000,
        description: "Monthly pass for students with valid ID",
        features: [
          "Full gym access",
          "2 group classes/week",
          "Locker included",
        ],
      },
      {
        name: "Off-Peak Pass",
        price: 5500,
        description: "Monthly access during off-peak hours (10 AM - 4 PM)",
        features: [
          "Full gym access",
          "Unlimited group classes",
          "Free parking",
        ],
      },
      {
        name: "Couple's Package",
        price: 14000,
        description: "Monthly pass for two people",
        features: [
          "Full gym access for 2",
          "4 PT sessions/month",
          "Shared locker",
        ],
      },
    ],

    policies: {
      cancellation:
        "Day passes are non-refundable. Monthly and annual passes can be cancelled within 7 days for a full refund, minus a Rs. 500 processing fee.",
      guestPolicy:
        "Members can bring 1 guest per month free of charge. Additional guest passes available at Rs. 400 per visit.",
      dresscode:
        "Proper athletic wear and clean indoor shoes required. No jeans, sandals, or open-toed footwear.",
      ageRestriction:
        "Members must be 16 or older. Ages 14-15 allowed with parental consent and supervision.",
    },

    crowdData: [
      { hour: 6, occupancy: 25 },
      { hour: 7, occupancy: 45 },
      { hour: 8, occupancy: 60 },
      { hour: 9, occupancy: 50 },
      { hour: 10, occupancy: 35 },
      { hour: 11, occupancy: 30 },
      { hour: 12, occupancy: 40 },
      { hour: 13, occupancy: 45 },
      { hour: 14, occupancy: 35 },
      { hour: 15, occupancy: 30 },
      { hour: 16, occupancy: 45 },
      { hour: 17, occupancy: 70 },
      { hour: 18, occupancy: 90 },
      { hour: 19, occupancy: 95 },
      { hour: 20, occupancy: 80 },
      { hour: 21, occupancy: 55 },
      { hour: 22, occupancy: 30 },
    ],

    contact: {
      phone: "+92 321 1234567",
      email: "info@fitzone.pk",
      website: "https://fitzone.pk",
      instagram: "@fitzone_karachi",
      facebook: "FitZoneKarachi",
    },
  },
};

// Helper function to get gym details by ID (falls back to default for gyms without details)
export function getGymDetails(gymId: string): GymDetail | null {
  return gymDetails[gymId] || null;
}

interface DefaultDetailsSource {
  id: string;
  pricing: { dayPass: number };
  hours: { open: string; close: string; is24Hours: boolean };
}

// Generate default details for gyms without specific data. Prices follow the
// gym's own day pass so they make sense in its currency.
export function generateDefaultDetails(gym: DefaultDetailsSource): GymDetail {
  const day = gym.pricing.dayPass;
  const round = (value: number) => (value >= 100 ? Math.round(value / 10) * 10 : Math.max(1, Math.round(value)));
  const open = gym.hours.is24Hours ? "00:00" : gym.hours.open;
  const close = gym.hours.is24Hours ? "24:00" : gym.hours.close;
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  return {
    id: gym.id,
    longDescription:
      "Welcome to our fitness center! We offer a wide range of equipment and services to help you achieve your fitness goals. Our friendly staff is always ready to assist you.",
    gallery: [],
    operatingHours: days.map((day) => ({ day, open, close, isClosed: false })),
    equipment: [],
    trainers: [],
    classes: [],
    reviews: [],
    ratingBreakdown: {
      cleanliness: 4.0,
      equipment: 4.0,
      staff: 4.0,
      value: 4.0,
    },
    addOns: [
      {
        id: "addon-default-1",
        name: "Guest Pass",
        description: "Bring a friend to workout with you",
        price: round(day * 0.8),
        category: "Access",
        isAvailable: true,
      },
      {
        id: "addon-default-2",
        name: "Locker Rental",
        description: "Secure locker for your belongings",
        price: round(day * 0.3),
        category: "Service",
        isAvailable: true,
      },
    ],
    policies: {
      cancellation: "Please contact us for our cancellation policy.",
      guestPolicy: "Guest passes available at reception.",
      dresscode: "Proper athletic wear required.",
      ageRestriction: "Members must be 16 or older.",
    },
    crowdData: [],
    contact: {
      phone: "",
      email: "",
    },
  };
}
