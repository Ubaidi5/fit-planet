// Mock data for Module 6: Social Features & Routine Sharing

export interface User {
  id: string;
  name: string;
  username: string;
  avatar: string;
  bio: string;
  stats: {
    workouts: number;
    streak: number;
    followers: number;
    following: number;
  };
  isFollowing: boolean;
  badges: Badge[];
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  earnedAt: string;
}

export interface SharedRoutine {
  id: string;
  userId: string;
  user: {
    name: string;
    username: string;
    avatar: string;
  };
  title: string;
  description: string;
  fitnessLevel: "beginner" | "intermediate" | "advanced";
  duration: number; // in minutes
  exerciseCount: number;
  muscleGroups: string[];
  likes: number;
  comments: number;
  saves: number;
  isLiked: boolean;
  isSaved: boolean;
  createdAt: string;
  tags: string[];
}

export interface FeedPost {
  id: string;
  type:
    | "routine_share"
    | "workout_complete"
    | "going_to_gym"
    | "milestone"
    | "challenge_complete";
  userId: string;
  user: {
    name: string;
    username: string;
    avatar: string;
  };
  content: {
    text: string;
    routine?: SharedRoutine;
    workout?: {
      name: string;
      duration: number;
      exerciseCount: number;
      personalRecords?: number;
    };
    gym?: {
      name: string;
      time: string;
      joinable: boolean;
    };
    milestone?: {
      type: string;
      value: number;
      badge?: Badge;
    };
    challenge?: {
      name: string;
      position: number;
    };
  };
  likes: number;
  comments: number;
  isLiked: boolean;
  createdAt: string;
}

export interface WorkoutBuddy {
  id: string;
  name: string;
  username: string;
  avatar: string;
  status: "online" | "at_gym" | "offline";
  currentGym?: string;
  lastWorkout?: string;
  workoutStreak: number;
  mutualFriends: number;
  isFollowing: boolean;
}

export interface GymVisit {
  id: string;
  user: {
    name: string;
    username: string;
    avatar: string;
  };
  gym: {
    id: string;
    name: string;
    location: string;
  };
  time: string;
  joinable: boolean;
  attendees: number;
}

export interface Challenge {
  id: string;
  name: string;
  description: string;
  type: "steps" | "workouts" | "streak" | "specific_exercise";
  duration: string;
  startDate: string;
  endDate: string;
  participants: number;
  status: "upcoming" | "active" | "completed";
  progress?: number;
  goal: number;
  currentValue?: number;
  prize?: string;
  leaderboard: LeaderboardEntry[];
  isJoined: boolean;
  category: "community" | "friends" | "gym";
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  username: string;
  avatar: string;
  score: number;
  isCurrentUser: boolean;
}

export interface Comment {
  id: string;
  userId: string;
  user: {
    name: string;
    username: string;
    avatar: string;
  };
  text: string;
  likes: number;
  createdAt: string;
}

// Mock Users
export const mockUsers: User[] = [
  {
    id: "user-1",
    name: "Ali Hassan",
    username: "alifit",
    avatar: "/avatars/ali.jpg",
    bio: "Fitness enthusiast | 3 years lifting | Love helping beginners",
    stats: { workouts: 342, streak: 28, followers: 1240, following: 89 },
    isFollowing: true,
    badges: [
      {
        id: "badge-1",
        name: "100 Workouts",
        icon: "💯",
        description: "Completed 100 workouts",
        earnedAt: "2024-08-15",
      },
      {
        id: "badge-2",
        name: "30 Day Streak",
        icon: "🔥",
        description: "Worked out 30 days in a row",
        earnedAt: "2024-11-01",
      },
    ],
  },
  {
    id: "user-2",
    name: "Fatima Khan",
    username: "fitfatima",
    avatar: "/avatars/fatima.jpg",
    bio: "Yoga & strength training | Plant-based athlete 🌱",
    stats: { workouts: 567, streak: 45, followers: 3200, following: 156 },
    isFollowing: true,
    badges: [
      {
        id: "badge-3",
        name: "Year Warrior",
        icon: "🏆",
        description: "Worked out for a full year",
        earnedAt: "2024-06-20",
      },
      {
        id: "badge-4",
        name: "Community Leader",
        icon: "👑",
        description: "Helped 50+ members",
        earnedAt: "2024-09-10",
      },
    ],
  },
  {
    id: "user-3",
    name: "Omar Malik",
    username: "omarlifts",
    avatar: "/avatars/omar.jpg",
    bio: "Powerlifter | 500lb deadlift club | Always learning",
    stats: { workouts: 890, streak: 12, followers: 5600, following: 234 },
    isFollowing: false,
    badges: [
      {
        id: "badge-5",
        name: "PR Machine",
        icon: "💪",
        description: "50 personal records",
        earnedAt: "2024-10-05",
      },
    ],
  },
  {
    id: "user-4",
    name: "Ayesha Raza",
    username: "ayesha_moves",
    avatar: "/avatars/ayesha.jpg",
    bio: "CrossFit athlete | Morning person ☀️ | DM for workout tips",
    stats: { workouts: 456, streak: 67, followers: 2100, following: 178 },
    isFollowing: true,
    badges: [
      {
        id: "badge-6",
        name: "Early Bird",
        icon: "🌅",
        description: "50 workouts before 7 AM",
        earnedAt: "2024-07-22",
      },
    ],
  },
];

// Mock Feed Posts
export const mockFeedPosts: FeedPost[] = [
  {
    id: "post-1",
    type: "routine_share",
    userId: "user-2",
    user: {
      name: "Fatima Khan",
      username: "fitfatima",
      avatar: "/avatars/fatima.jpg",
    },
    content: {
      text: "Just finished designing my new Push Day routine! It's perfect for intermediate lifters looking to build chest and shoulders. Give it a try! 💪",
      routine: {
        id: "routine-shared-1",
        userId: "user-2",
        user: {
          name: "Fatima Khan",
          username: "fitfatima",
          avatar: "/avatars/fatima.jpg",
        },
        title: "Power Push Day",
        description: "High-volume push workout for muscle growth",
        fitnessLevel: "intermediate",
        duration: 65,
        exerciseCount: 8,
        muscleGroups: ["chest", "shoulders", "triceps"],
        likes: 234,
        comments: 45,
        saves: 89,
        isLiked: false,
        isSaved: false,
        createdAt: "2025-01-14T10:30:00Z",
        tags: ["push", "hypertrophy", "chest"],
      },
    },
    likes: 234,
    comments: 45,
    isLiked: false,
    createdAt: "2025-01-14T10:30:00Z",
  },
  {
    id: "post-2",
    type: "workout_complete",
    userId: "user-1",
    user: {
      name: "Ali Hassan",
      username: "alifit",
      avatar: "/avatars/ali.jpg",
    },
    content: {
      text: "Crushed leg day this morning! New PR on squats 🎉",
      workout: {
        name: "Leg Day Destroyer",
        duration: 72,
        exerciseCount: 6,
        personalRecords: 2,
      },
    },
    likes: 89,
    comments: 12,
    isLiked: true,
    createdAt: "2025-01-14T08:15:00Z",
  },
  {
    id: "post-3",
    type: "going_to_gym",
    userId: "user-4",
    user: {
      name: "Ayesha Raza",
      username: "ayesha_moves",
      avatar: "/avatars/ayesha.jpg",
    },
    content: {
      text: "Heading to the gym for some cardio and core work. Anyone want to join?",
      gym: {
        name: "FitZone Premium",
        time: "6:30 PM",
        joinable: true,
      },
    },
    likes: 23,
    comments: 8,
    isLiked: false,
    createdAt: "2025-01-14T17:45:00Z",
  },
  {
    id: "post-4",
    type: "milestone",
    userId: "user-3",
    user: {
      name: "Omar Malik",
      username: "omarlifts",
      avatar: "/avatars/omar.jpg",
    },
    content: {
      text: "Just hit 500 workouts on Fit Planet! 🏆 Thank you to this amazing community for keeping me motivated!",
      milestone: {
        type: "500 Workouts",
        value: 500,
        badge: {
          id: "badge-7",
          name: "500 Club",
          icon: "🎖️",
          description: "Completed 500 workouts",
          earnedAt: "2025-01-14",
        },
      },
    },
    likes: 567,
    comments: 89,
    isLiked: true,
    createdAt: "2025-01-13T14:20:00Z",
  },
  {
    id: "post-5",
    type: "challenge_complete",
    userId: "user-1",
    user: {
      name: "Ali Hassan",
      username: "alifit",
      avatar: "/avatars/ali.jpg",
    },
    content: {
      text: "Finished the 30-Day Plank Challenge in 2nd place! 🥈 My core has never felt stronger!",
      challenge: {
        name: "30-Day Plank Challenge",
        position: 2,
      },
    },
    likes: 145,
    comments: 34,
    isLiked: false,
    createdAt: "2025-01-12T18:00:00Z",
  },
  {
    id: "post-6",
    type: "routine_share",
    userId: "user-3",
    user: {
      name: "Omar Malik",
      username: "omarlifts",
      avatar: "/avatars/omar.jpg",
    },
    content: {
      text: "My tried and tested deadlift program. This took me from 300lb to 500lb over 2 years. Share it with anyone who wants to get stronger!",
      routine: {
        id: "routine-shared-2",
        userId: "user-3",
        user: {
          name: "Omar Malik",
          username: "omarlifts",
          avatar: "/avatars/omar.jpg",
        },
        title: "Deadlift Domination",
        description:
          "Progressive overload program for building a monster deadlift",
        fitnessLevel: "advanced",
        duration: 90,
        exerciseCount: 5,
        muscleGroups: ["back", "legs", "core"],
        likes: 892,
        comments: 156,
        saves: 423,
        isLiked: true,
        isSaved: true,
        createdAt: "2025-01-11T09:00:00Z",
        tags: ["deadlift", "strength", "powerlifting"],
      },
    },
    likes: 892,
    comments: 156,
    isLiked: true,
    createdAt: "2025-01-11T09:00:00Z",
  },
];

// Mock Workout Buddies
export const mockWorkoutBuddies: WorkoutBuddy[] = [
  {
    id: "buddy-1",
    name: "Ali Hassan",
    username: "alifit",
    avatar: "/avatars/ali.jpg",
    status: "at_gym",
    currentGym: "FitZone Premium",
    lastWorkout: "2 hours ago",
    workoutStreak: 28,
    mutualFriends: 5,
    isFollowing: true,
  },
  {
    id: "buddy-2",
    name: "Fatima Khan",
    username: "fitfatima",
    avatar: "/avatars/fatima.jpg",
    status: "online",
    lastWorkout: "8 hours ago",
    workoutStreak: 45,
    mutualFriends: 12,
    isFollowing: true,
  },
  {
    id: "buddy-3",
    name: "Ayesha Raza",
    username: "ayesha_moves",
    avatar: "/avatars/ayesha.jpg",
    status: "online",
    lastWorkout: "1 day ago",
    workoutStreak: 67,
    mutualFriends: 8,
    isFollowing: true,
  },
  {
    id: "buddy-4",
    name: "Omar Malik",
    username: "omarlifts",
    avatar: "/avatars/omar.jpg",
    status: "offline",
    lastWorkout: "3 hours ago",
    workoutStreak: 12,
    mutualFriends: 3,
    isFollowing: false,
  },
  {
    id: "buddy-5",
    name: "Zain Ahmed",
    username: "zain_fitness",
    avatar: "/avatars/zain.jpg",
    status: "at_gym",
    currentGym: "Iron Paradise",
    lastWorkout: "Just now",
    workoutStreak: 91,
    mutualFriends: 7,
    isFollowing: true,
  },
];

// Mock Gym Visits (Going to Gym)
export const mockGymVisits: GymVisit[] = [
  {
    id: "visit-1",
    user: {
      name: "Ayesha Raza",
      username: "ayesha_moves",
      avatar: "/avatars/ayesha.jpg",
    },
    gym: { id: "gym-1", name: "FitZone Premium", location: "Clifton, Karachi" },
    time: "6:30 PM Today",
    joinable: true,
    attendees: 3,
  },
  {
    id: "visit-2",
    user: {
      name: "Zain Ahmed",
      username: "zain_fitness",
      avatar: "/avatars/zain.jpg",
    },
    gym: { id: "gym-2", name: "Iron Paradise", location: "DHA Phase 5" },
    time: "7:00 PM Today",
    joinable: true,
    attendees: 1,
  },
  {
    id: "visit-3",
    user: {
      name: "Ali Hassan",
      username: "alifit",
      avatar: "/avatars/ali.jpg",
    },
    gym: { id: "gym-3", name: "Muscle Factory", location: "Gulshan-e-Iqbal" },
    time: "5:00 AM Tomorrow",
    joinable: true,
    attendees: 5,
  },
];

// Mock Challenges
export const mockChallenges: Challenge[] = [
  {
    id: "challenge-1",
    name: "30-Day Consistency Challenge",
    description:
      "Work out at least 4 times per week for 30 days. Build the habit that transforms your life!",
    type: "workouts",
    duration: "30 days",
    startDate: "2025-01-01",
    endDate: "2025-01-31",
    participants: 1234,
    status: "active",
    progress: 60,
    goal: 16,
    currentValue: 10,
    prize: "Fit Planet Pro Badge + 1 Free Day Pass",
    leaderboard: [
      {
        rank: 1,
        userId: "user-4",
        name: "Ayesha Raza",
        username: "ayesha_moves",
        avatar: "/avatars/ayesha.jpg",
        score: 14,
        isCurrentUser: false,
      },
      {
        rank: 2,
        userId: "user-2",
        name: "Fatima Khan",
        username: "fitfatima",
        avatar: "/avatars/fatima.jpg",
        score: 13,
        isCurrentUser: false,
      },
      {
        rank: 3,
        userId: "user-1",
        name: "Ali Hassan",
        username: "alifit",
        avatar: "/avatars/ali.jpg",
        score: 12,
        isCurrentUser: false,
      },
      {
        rank: 15,
        userId: "current",
        name: "You",
        username: "me",
        avatar: "/avatars/default.jpg",
        score: 10,
        isCurrentUser: true,
      },
    ],
    isJoined: true,
    category: "community",
  },
  {
    id: "challenge-2",
    name: "10K Steps Daily",
    description:
      "Hit 10,000 steps every single day this month. Walking is the foundation of fitness!",
    type: "steps",
    duration: "30 days",
    startDate: "2025-01-01",
    endDate: "2025-01-31",
    participants: 3456,
    status: "active",
    progress: 45,
    goal: 310000, // 31 days * 10000 steps
    currentValue: 140000,
    leaderboard: [
      {
        rank: 1,
        userId: "user-5",
        name: "Zain Ahmed",
        username: "zain_fitness",
        avatar: "/avatars/zain.jpg",
        score: 280000,
        isCurrentUser: false,
      },
      {
        rank: 2,
        userId: "user-3",
        name: "Omar Malik",
        username: "omarlifts",
        avatar: "/avatars/omar.jpg",
        score: 265000,
        isCurrentUser: false,
      },
      {
        rank: 42,
        userId: "current",
        name: "You",
        username: "me",
        avatar: "/avatars/default.jpg",
        score: 140000,
        isCurrentUser: true,
      },
    ],
    isJoined: true,
    category: "community",
  },
  {
    id: "challenge-3",
    name: "Push-Up Power",
    description:
      "Complete 1000 push-ups in 2 weeks. Track your daily push-ups and climb the leaderboard!",
    type: "specific_exercise",
    duration: "14 days",
    startDate: "2025-01-15",
    endDate: "2025-01-29",
    participants: 567,
    status: "upcoming",
    goal: 1000,
    leaderboard: [],
    isJoined: false,
    category: "community",
  },
  {
    id: "challenge-4",
    name: "Weekend Warriors",
    description:
      "Private challenge with your gym buddies. Who can complete the most workouts this month?",
    type: "workouts",
    duration: "30 days",
    startDate: "2025-01-01",
    endDate: "2025-01-31",
    participants: 8,
    status: "active",
    progress: 75,
    goal: 20,
    currentValue: 15,
    leaderboard: [
      {
        rank: 1,
        userId: "user-1",
        name: "Ali Hassan",
        username: "alifit",
        avatar: "/avatars/ali.jpg",
        score: 18,
        isCurrentUser: false,
      },
      {
        rank: 2,
        userId: "current",
        name: "You",
        username: "me",
        avatar: "/avatars/default.jpg",
        score: 15,
        isCurrentUser: true,
      },
      {
        rank: 3,
        userId: "user-2",
        name: "Fatima Khan",
        username: "fitfatima",
        avatar: "/avatars/fatima.jpg",
        score: 14,
        isCurrentUser: false,
      },
    ],
    isJoined: true,
    category: "friends",
  },
  {
    id: "challenge-5",
    name: "100 Day Streak",
    description:
      "The ultimate test of consistency. Work out every single day for 100 days straight!",
    type: "streak",
    duration: "100 days",
    startDate: "2025-01-01",
    endDate: "2025-04-11",
    participants: 234,
    status: "active",
    progress: 14,
    goal: 100,
    currentValue: 14,
    prize: "Legendary Badge + 1 Month Free Pass",
    leaderboard: [
      {
        rank: 1,
        userId: "user-4",
        name: "Ayesha Raza",
        username: "ayesha_moves",
        avatar: "/avatars/ayesha.jpg",
        score: 14,
        isCurrentUser: false,
      },
      {
        rank: 1,
        userId: "user-2",
        name: "Fatima Khan",
        username: "fitfatima",
        avatar: "/avatars/fatima.jpg",
        score: 14,
        isCurrentUser: false,
      },
      {
        rank: 1,
        userId: "current",
        name: "You",
        username: "me",
        avatar: "/avatars/default.jpg",
        score: 14,
        isCurrentUser: true,
      },
    ],
    isJoined: true,
    category: "community",
  },
];

// Shared Routines for browsing
export const mockSharedRoutines: SharedRoutine[] = [
  {
    id: "shared-1",
    userId: "user-2",
    user: {
      name: "Fatima Khan",
      username: "fitfatima",
      avatar: "/avatars/fatima.jpg",
    },
    title: "Power Push Day",
    description:
      "High-volume push workout for muscle growth. Perfect for intermediate lifters.",
    fitnessLevel: "intermediate",
    duration: 65,
    exerciseCount: 8,
    muscleGroups: ["chest", "shoulders", "triceps"],
    likes: 234,
    comments: 45,
    saves: 89,
    isLiked: false,
    isSaved: false,
    createdAt: "2025-01-14",
    tags: ["push", "hypertrophy", "chest"],
  },
  {
    id: "shared-2",
    userId: "user-3",
    user: {
      name: "Omar Malik",
      username: "omarlifts",
      avatar: "/avatars/omar.jpg",
    },
    title: "Deadlift Domination",
    description:
      "Progressive overload program for building a monster deadlift. 2 year proven results!",
    fitnessLevel: "advanced",
    duration: 90,
    exerciseCount: 5,
    muscleGroups: ["back", "legs", "core"],
    likes: 892,
    comments: 156,
    saves: 423,
    isLiked: true,
    isSaved: true,
    createdAt: "2025-01-11",
    tags: ["deadlift", "strength", "powerlifting"],
  },
  {
    id: "shared-3",
    userId: "user-4",
    user: {
      name: "Ayesha Raza",
      username: "ayesha_moves",
      avatar: "/avatars/ayesha.jpg",
    },
    title: "Morning HIIT Blast",
    description:
      "Quick 30-minute high-intensity workout to start your day with energy!",
    fitnessLevel: "beginner",
    duration: 30,
    exerciseCount: 10,
    muscleGroups: ["full body"],
    likes: 567,
    comments: 78,
    saves: 234,
    isLiked: false,
    isSaved: false,
    createdAt: "2025-01-10",
    tags: ["hiit", "cardio", "morning"],
  },
  {
    id: "shared-4",
    userId: "user-1",
    user: {
      name: "Ali Hassan",
      username: "alifit",
      avatar: "/avatars/ali.jpg",
    },
    title: "Leg Day Destroyer",
    description:
      "Complete lower body workout targeting quads, hamstrings, and glutes.",
    fitnessLevel: "intermediate",
    duration: 75,
    exerciseCount: 7,
    muscleGroups: ["legs", "glutes"],
    likes: 345,
    comments: 56,
    saves: 167,
    isLiked: true,
    isSaved: false,
    createdAt: "2025-01-08",
    tags: ["legs", "strength", "squats"],
  },
  {
    id: "shared-5",
    userId: "user-2",
    user: {
      name: "Fatima Khan",
      username: "fitfatima",
      avatar: "/avatars/fatima.jpg",
    },
    title: "Yoga Flow for Recovery",
    description:
      "Gentle yoga routine for active recovery days. Great for flexibility and relaxation.",
    fitnessLevel: "beginner",
    duration: 45,
    exerciseCount: 12,
    muscleGroups: ["full body"],
    likes: 456,
    comments: 34,
    saves: 289,
    isLiked: false,
    isSaved: true,
    createdAt: "2025-01-05",
    tags: ["yoga", "recovery", "flexibility"],
  },
];

// Helper functions
export function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

export function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
}

export function getStatusColor(
  status: "online" | "at_gym" | "offline",
): string {
  switch (status) {
    case "at_gym":
      return "bg-emerald-500";
    case "online":
      return "bg-blue-500";
    case "offline":
      return "bg-gray-400";
  }
}

export function getChallengeStatusBadge(
  status: "upcoming" | "active" | "completed",
): {
  variant: "default" | "success" | "warning" | "danger" | "info" | "outline";
  label: string;
} {
  switch (status) {
    case "active":
      return { variant: "success", label: "Active" };
    case "upcoming":
      return { variant: "info", label: "Upcoming" };
    case "completed":
      return { variant: "default", label: "Completed" };
  }
}
