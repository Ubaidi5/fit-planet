// Mock exercise and routine data for UI development

export interface Exercise {
  id: string;
  name: string;
  muscleGroup: MuscleGroup;
  secondaryMuscles?: MuscleGroup[];
  equipment: Equipment[];
  difficulty: "beginner" | "intermediate" | "advanced";
  description: string;
  instructions: string[];
  tips?: string[];
  videoUrl?: string;
  imageUrl?: string;
  calories?: number; // per set
}

export type MuscleGroup =
  | "chest"
  | "back"
  | "shoulders"
  | "biceps"
  | "triceps"
  | "forearms"
  | "core"
  | "quadriceps"
  | "hamstrings"
  | "glutes"
  | "calves"
  | "full_body"
  | "cardio";

export type Equipment =
  | "barbell"
  | "dumbbell"
  | "cable"
  | "machine"
  | "bodyweight"
  | "kettlebell"
  | "resistance_band"
  | "pull_up_bar"
  | "bench"
  | "treadmill"
  | "bike"
  | "rowing_machine"
  | "none";

export interface RoutineExercise {
  exerciseId: string;
  sets: number;
  reps?: number | string; // "12" or "12-15" or "to failure"
  weight?: number;
  duration?: number; // in seconds (for cardio/planks)
  restTime: number; // in seconds
  notes?: string;
  supersetWith?: string; // exerciseId
}

export interface Routine {
  id: string;
  userId: string;
  name: string;
  description?: string;
  category: RoutineCategory;
  difficulty: "beginner" | "intermediate" | "advanced";
  duration: number; // estimated minutes
  exercises: RoutineExercise[];
  isPublic: boolean;
  isTemplate: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  timesCompleted: number;
  lastCompletedAt?: string;
  isFavorite: boolean;
}

export type RoutineCategory =
  | "push"
  | "pull"
  | "legs"
  | "upper_body"
  | "lower_body"
  | "full_body"
  | "cardio"
  | "hiit"
  | "strength"
  | "hypertrophy"
  | "custom";

export interface WorkoutLog {
  id: string;
  routineId: string;
  userId: string;
  startedAt: string;
  completedAt: string;
  duration: number; // actual minutes
  exercises: WorkoutExerciseLog[];
  notes?: string;
  mood?: "great" | "good" | "okay" | "tired";
  caloriesBurned?: number;
}

export interface WorkoutExerciseLog {
  exerciseId: string;
  sets: SetLog[];
  skipped: boolean;
}

export interface SetLog {
  reps: number;
  weight?: number;
  duration?: number;
  completed: boolean;
}

// Mock Exercises
export const mockExercises: Exercise[] = [
  // Chest
  {
    id: "ex001",
    name: "Barbell Bench Press",
    muscleGroup: "chest",
    secondaryMuscles: ["triceps", "shoulders"],
    equipment: ["barbell", "bench"],
    difficulty: "intermediate",
    description:
      "The king of chest exercises. A compound movement that builds overall chest mass and strength.",
    instructions: [
      "Lie on a flat bench with your feet firmly on the ground",
      "Grip the barbell slightly wider than shoulder width",
      "Unrack the bar and lower it to your mid-chest",
      "Press the bar back up to the starting position",
      "Keep your back slightly arched and shoulder blades retracted",
    ],
    tips: [
      "Don't bounce the bar off your chest",
      "Keep your wrists straight",
      "Drive through your heels for stability",
    ],
    imageUrl:
      "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&q=80",
    calories: 8,
  },
  {
    id: "ex002",
    name: "Incline Dumbbell Press",
    muscleGroup: "chest",
    secondaryMuscles: ["shoulders", "triceps"],
    equipment: ["dumbbell", "bench"],
    difficulty: "intermediate",
    description: "Targets the upper chest for a fuller, more defined look.",
    instructions: [
      "Set bench to 30-45 degree incline",
      "Hold dumbbells at shoulder level with palms facing forward",
      "Press dumbbells up until arms are extended",
      "Lower with control to starting position",
    ],
    imageUrl:
      "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&q=80",
    calories: 7,
  },
  {
    id: "ex003",
    name: "Push-Ups",
    muscleGroup: "chest",
    secondaryMuscles: ["triceps", "shoulders", "core"],
    equipment: ["bodyweight"],
    difficulty: "beginner",
    description:
      "A fundamental bodyweight exercise for chest, shoulders, and triceps.",
    instructions: [
      "Start in a plank position with hands shoulder-width apart",
      "Lower your body until chest nearly touches the floor",
      "Push back up to starting position",
      "Keep your body in a straight line throughout",
    ],
    calories: 5,
  },
  // Back
  {
    id: "ex004",
    name: "Pull-Ups",
    muscleGroup: "back",
    secondaryMuscles: ["biceps", "forearms"],
    equipment: ["pull_up_bar"],
    difficulty: "intermediate",
    description: "The ultimate back exercise for building width and strength.",
    instructions: [
      "Hang from bar with hands slightly wider than shoulder-width",
      "Pull yourself up until chin is above the bar",
      "Lower with control to full arm extension",
      "Avoid swinging or using momentum",
    ],
    imageUrl:
      "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=400&q=80",
    calories: 10,
  },
  {
    id: "ex005",
    name: "Barbell Rows",
    muscleGroup: "back",
    secondaryMuscles: ["biceps", "forearms"],
    equipment: ["barbell"],
    difficulty: "intermediate",
    description: "A compound movement that builds back thickness and strength.",
    instructions: [
      "Stand with feet shoulder-width apart, bend at hips",
      "Grip barbell with hands shoulder-width apart",
      "Pull bar to lower chest/upper abdomen",
      "Lower with control, keep back flat",
    ],
    calories: 8,
  },
  {
    id: "ex006",
    name: "Lat Pulldown",
    muscleGroup: "back",
    secondaryMuscles: ["biceps"],
    equipment: ["cable", "machine"],
    difficulty: "beginner",
    description:
      "A machine-based exercise great for beginners to build lat width.",
    instructions: [
      "Sit at lat pulldown machine, grab bar with wide grip",
      "Pull bar down to upper chest",
      "Squeeze shoulder blades together at bottom",
      "Return with control to starting position",
    ],
    calories: 6,
  },
  // Shoulders
  {
    id: "ex007",
    name: "Overhead Press",
    muscleGroup: "shoulders",
    secondaryMuscles: ["triceps", "core"],
    equipment: ["barbell"],
    difficulty: "intermediate",
    description:
      "The primary compound movement for building shoulder strength.",
    instructions: [
      "Stand with feet shoulder-width apart",
      "Hold barbell at shoulder height",
      "Press bar overhead until arms are fully extended",
      "Lower with control to starting position",
    ],
    imageUrl:
      "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=400&q=80",
    calories: 7,
  },
  {
    id: "ex008",
    name: "Lateral Raises",
    muscleGroup: "shoulders",
    equipment: ["dumbbell"],
    difficulty: "beginner",
    description: "Isolation exercise that targets the side deltoids for width.",
    instructions: [
      "Stand with dumbbells at your sides",
      "Raise arms out to the sides until parallel to floor",
      "Keep slight bend in elbows",
      "Lower with control",
    ],
    calories: 4,
  },
  // Legs
  {
    id: "ex009",
    name: "Barbell Squat",
    muscleGroup: "quadriceps",
    secondaryMuscles: ["glutes", "hamstrings", "core"],
    equipment: ["barbell"],
    difficulty: "intermediate",
    description: "The king of leg exercises. Builds overall lower body mass.",
    instructions: [
      "Position barbell on upper back",
      "Stand with feet shoulder-width apart",
      "Squat down until thighs are parallel to floor",
      "Drive through heels to stand back up",
    ],
    imageUrl:
      "https://images.unsplash.com/photo-1566241142559-40e1dab266c6?w=400&q=80",
    calories: 12,
  },
  {
    id: "ex010",
    name: "Romanian Deadlift",
    muscleGroup: "hamstrings",
    secondaryMuscles: ["glutes", "back"],
    equipment: ["barbell", "dumbbell"],
    difficulty: "intermediate",
    description: "Targets hamstrings and glutes with a hip-hinge movement.",
    instructions: [
      "Hold barbell with shoulder-width grip",
      "Hinge at hips, pushing them back",
      "Lower bar along legs until you feel hamstring stretch",
      "Drive hips forward to return to start",
    ],
    calories: 10,
  },
  {
    id: "ex011",
    name: "Leg Press",
    muscleGroup: "quadriceps",
    secondaryMuscles: ["glutes", "hamstrings"],
    equipment: ["machine"],
    difficulty: "beginner",
    description: "Machine-based leg exercise safe for beginners.",
    instructions: [
      "Sit in leg press machine with feet shoulder-width on platform",
      "Lower the weight by bending knees to 90 degrees",
      "Press through feet to extend legs",
      "Don't lock out knees at the top",
    ],
    calories: 8,
  },
  // Arms
  {
    id: "ex012",
    name: "Barbell Curl",
    muscleGroup: "biceps",
    equipment: ["barbell"],
    difficulty: "beginner",
    description: "Classic bicep builder for arm mass.",
    instructions: [
      "Stand with feet shoulder-width, hold barbell with underhand grip",
      "Curl bar up to shoulder level",
      "Keep elbows stationary at your sides",
      "Lower with control",
    ],
    calories: 5,
  },
  {
    id: "ex013",
    name: "Tricep Pushdown",
    muscleGroup: "triceps",
    equipment: ["cable"],
    difficulty: "beginner",
    description: "Cable exercise that isolates the triceps.",
    instructions: [
      "Stand facing cable machine with rope attachment",
      "Keep elbows at your sides",
      "Push rope down until arms are fully extended",
      "Return with control",
    ],
    calories: 4,
  },
  // Core
  {
    id: "ex014",
    name: "Plank",
    muscleGroup: "core",
    equipment: ["bodyweight"],
    difficulty: "beginner",
    description: "Isometric core exercise that builds stability.",
    instructions: [
      "Start in forearm plank position",
      "Keep body in straight line from head to heels",
      "Engage core and hold position",
      "Breathe steadily throughout",
    ],
    calories: 3,
  },
  {
    id: "ex015",
    name: "Cable Crunches",
    muscleGroup: "core",
    equipment: ["cable"],
    difficulty: "intermediate",
    description: "Weighted ab exercise for progressive overload.",
    instructions: [
      "Kneel in front of cable machine with rope attachment",
      "Hold rope behind head",
      "Crunch down, bringing elbows toward knees",
      "Return with control",
    ],
    calories: 5,
  },
  // Cardio
  {
    id: "ex016",
    name: "Treadmill Running",
    muscleGroup: "cardio",
    secondaryMuscles: ["quadriceps", "hamstrings", "calves"],
    equipment: ["treadmill"],
    difficulty: "beginner",
    description: "Classic cardio for endurance and calorie burn.",
    instructions: [
      "Start with warm-up walk",
      "Gradually increase speed to running pace",
      "Maintain steady pace for desired duration",
      "Cool down with slow walk",
    ],
    calories: 15,
  },
  {
    id: "ex017",
    name: "Rowing Machine",
    muscleGroup: "cardio",
    secondaryMuscles: ["back", "biceps", "quadriceps"],
    equipment: ["rowing_machine"],
    difficulty: "beginner",
    description: "Full-body cardio that's easy on the joints.",
    instructions: [
      "Sit on rower with feet strapped in",
      "Grab handle, push with legs first",
      "Then pull handle to chest",
      "Reverse motion to return",
    ],
    calories: 12,
  },
];

// Mock Routines
export const mockRoutines: Routine[] = [
  {
    id: "rt001",
    userId: "user123",
    name: "Push Day - Chest & Triceps",
    description:
      "Complete push workout targeting chest, shoulders, and triceps.",
    category: "push",
    difficulty: "intermediate",
    duration: 60,
    exercises: [
      {
        exerciseId: "ex001",
        sets: 4,
        reps: "8-10",
        weight: 60,
        restTime: 90,
      },
      {
        exerciseId: "ex002",
        sets: 3,
        reps: "10-12",
        weight: 22,
        restTime: 60,
      },
      {
        exerciseId: "ex007",
        sets: 4,
        reps: "8-10",
        weight: 40,
        restTime: 90,
      },
      {
        exerciseId: "ex008",
        sets: 3,
        reps: "12-15",
        weight: 10,
        restTime: 45,
      },
      {
        exerciseId: "ex013",
        sets: 3,
        reps: "12-15",
        restTime: 45,
      },
    ],
    isPublic: false,
    isTemplate: false,
    tags: ["push", "chest", "triceps", "shoulders"],
    createdAt: "2025-12-01T10:00:00Z",
    updatedAt: "2026-01-15T10:00:00Z",
    timesCompleted: 12,
    lastCompletedAt: "2026-01-24T18:00:00Z",
    isFavorite: true,
  },
  {
    id: "rt002",
    userId: "user123",
    name: "Pull Day - Back & Biceps",
    description: "Complete pull workout for a thick, wide back.",
    category: "pull",
    difficulty: "intermediate",
    duration: 55,
    exercises: [
      {
        exerciseId: "ex004",
        sets: 4,
        reps: "8-10",
        restTime: 90,
      },
      {
        exerciseId: "ex005",
        sets: 4,
        reps: "8-10",
        weight: 50,
        restTime: 90,
      },
      {
        exerciseId: "ex006",
        sets: 3,
        reps: "10-12",
        weight: 45,
        restTime: 60,
      },
      {
        exerciseId: "ex012",
        sets: 3,
        reps: "10-12",
        weight: 30,
        restTime: 60,
      },
    ],
    isPublic: true,
    isTemplate: false,
    tags: ["pull", "back", "biceps"],
    createdAt: "2025-12-01T10:00:00Z",
    updatedAt: "2026-01-10T10:00:00Z",
    timesCompleted: 10,
    lastCompletedAt: "2026-01-22T18:00:00Z",
    isFavorite: true,
  },
  {
    id: "rt003",
    userId: "user123",
    name: "Leg Day",
    description: "Complete lower body workout for strength and size.",
    category: "legs",
    difficulty: "intermediate",
    duration: 65,
    exercises: [
      {
        exerciseId: "ex009",
        sets: 4,
        reps: "8-10",
        weight: 80,
        restTime: 120,
      },
      {
        exerciseId: "ex010",
        sets: 4,
        reps: "10-12",
        weight: 60,
        restTime: 90,
      },
      {
        exerciseId: "ex011",
        sets: 3,
        reps: "12-15",
        weight: 120,
        restTime: 60,
      },
    ],
    isPublic: false,
    isTemplate: false,
    tags: ["legs", "quads", "hamstrings", "glutes"],
    createdAt: "2025-12-05T10:00:00Z",
    updatedAt: "2026-01-20T10:00:00Z",
    timesCompleted: 8,
    lastCompletedAt: "2026-01-20T18:00:00Z",
    isFavorite: false,
  },
  {
    id: "rt004",
    userId: "user123",
    name: "Quick Core Blast",
    description: "15-minute core workout you can do anywhere.",
    category: "custom",
    difficulty: "beginner",
    duration: 15,
    exercises: [
      {
        exerciseId: "ex014",
        sets: 3,
        duration: 60,
        restTime: 30,
      },
      {
        exerciseId: "ex015",
        sets: 3,
        reps: "15-20",
        restTime: 45,
      },
    ],
    isPublic: true,
    isTemplate: false,
    tags: ["core", "abs", "quick"],
    createdAt: "2026-01-10T10:00:00Z",
    updatedAt: "2026-01-10T10:00:00Z",
    timesCompleted: 5,
    lastCompletedAt: "2026-01-25T07:00:00Z",
    isFavorite: false,
  },
];

// Routine Templates (pre-made by experts)
export const routineTemplates: Routine[] = [
  {
    id: "tpl001",
    userId: "system",
    name: "Beginner Full Body",
    description:
      "Perfect starting routine for gym beginners. Covers all major muscle groups.",
    category: "full_body",
    difficulty: "beginner",
    duration: 45,
    exercises: [
      { exerciseId: "ex011", sets: 3, reps: "10-12", restTime: 60 },
      { exerciseId: "ex006", sets: 3, reps: "10-12", restTime: 60 },
      { exerciseId: "ex003", sets: 3, reps: "10-15", restTime: 45 },
      { exerciseId: "ex012", sets: 2, reps: "12-15", restTime: 45 },
      { exerciseId: "ex014", sets: 3, duration: 30, restTime: 30 },
    ],
    isPublic: true,
    isTemplate: true,
    tags: ["beginner", "full body", "starter"],
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-01T00:00:00Z",
    timesCompleted: 0,
    isFavorite: false,
  },
  {
    id: "tpl002",
    userId: "system",
    name: "HIIT Fat Burner",
    description: "High-intensity interval training for maximum calorie burn.",
    category: "hiit",
    difficulty: "advanced",
    duration: 30,
    exercises: [
      { exerciseId: "ex016", sets: 5, duration: 60, restTime: 30 },
      { exerciseId: "ex003", sets: 4, reps: "15-20", restTime: 20 },
      { exerciseId: "ex017", sets: 4, duration: 45, restTime: 20 },
      { exerciseId: "ex014", sets: 3, duration: 45, restTime: 15 },
    ],
    isPublic: true,
    isTemplate: true,
    tags: ["hiit", "cardio", "fat loss", "advanced"],
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-01T00:00:00Z",
    timesCompleted: 0,
    isFavorite: false,
  },
];

// Mock Workout Logs
export const mockWorkoutLogs: WorkoutLog[] = [
  {
    id: "wl001",
    routineId: "rt001",
    userId: "user123",
    startedAt: "2026-01-24T17:30:00Z",
    completedAt: "2026-01-24T18:35:00Z",
    duration: 65,
    exercises: [
      {
        exerciseId: "ex001",
        sets: [
          { reps: 10, weight: 60, completed: true },
          { reps: 9, weight: 60, completed: true },
          { reps: 8, weight: 60, completed: true },
          { reps: 7, weight: 55, completed: true },
        ],
        skipped: false,
      },
      {
        exerciseId: "ex002",
        sets: [
          { reps: 12, weight: 22, completed: true },
          { reps: 11, weight: 22, completed: true },
          { reps: 10, weight: 20, completed: true },
        ],
        skipped: false,
      },
    ],
    mood: "great",
    caloriesBurned: 320,
  },
];

// Helper Functions
export function getExerciseById(id: string): Exercise | undefined {
  return mockExercises.find((e) => e.id === id);
}

export function getExercisesByMuscleGroup(group: MuscleGroup): Exercise[] {
  return mockExercises.filter(
    (e) => e.muscleGroup === group || e.secondaryMuscles?.includes(group),
  );
}

export function getExercisesByEquipment(equipment: Equipment): Exercise[] {
  return mockExercises.filter((e) => e.equipment.includes(equipment));
}

export function getUserRoutines(userId: string): Routine[] {
  return mockRoutines.filter((r) => r.userId === userId);
}

export function getFavoriteRoutines(userId: string): Routine[] {
  return mockRoutines.filter((r) => r.userId === userId && r.isFavorite);
}

export function formatMuscleGroup(group: MuscleGroup): string {
  return group
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export function formatEquipment(equipment: Equipment): string {
  return equipment
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export function formatDifficulty(
  difficulty: "beginner" | "intermediate" | "advanced",
): { label: string; color: string } {
  switch (difficulty) {
    case "beginner":
      return { label: "Beginner", color: "text-green-600 bg-green-100" };
    case "intermediate":
      return { label: "Intermediate", color: "text-yellow-600 bg-yellow-100" };
    case "advanced":
      return { label: "Advanced", color: "text-red-600 bg-red-100" };
  }
}

export const muscleGroupIcons: Record<MuscleGroup, string> = {
  chest: "💪",
  back: "🏋️",
  shoulders: "🎯",
  biceps: "💪",
  triceps: "💪",
  forearms: "🤜",
  core: "🎯",
  quadriceps: "🦵",
  hamstrings: "🦵",
  glutes: "🍑",
  calves: "🦶",
  full_body: "🏃",
  cardio: "❤️",
};
