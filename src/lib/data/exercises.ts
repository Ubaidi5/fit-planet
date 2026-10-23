// Exercise catalog used by routines, the workout player and the exercise library.
// Static content: it ships with the app rather than living in the database.

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

/** Logged in seconds instead of reps */
export const TIMED_EXERCISES = new Set(["ex014", "ex016", "ex017"]);

export const isTimed = (exerciseId: string) => TIMED_EXERCISES.has(exerciseId);

export const exercises: Exercise[] = [
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


export const exerciseById = new Map(exercises.map((e) => [e.id, e]));

export function getExerciseById(id: string): Exercise | undefined {
  return exercises.find((e) => e.id === id);
}

export function getExercisesByMuscleGroup(group: MuscleGroup): Exercise[] {
  return exercises.filter(
    (e) => e.muscleGroup === group || e.secondaryMuscles?.includes(group),
  );
}

export function getExercisesByEquipment(equipment: Equipment): Exercise[] {
  return exercises.filter((e) => e.equipment.includes(equipment));
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


export type RoutineCategory = "push" | "pull" | "legs" | "upper_body" | "lower_body" | "full_body" | "core" | "cardio" | "custom";

export const ROUTINE_CATEGORIES: { value: RoutineCategory; label: string }[] = [
  { value: "push", label: "Push" },
  { value: "pull", label: "Pull" },
  { value: "legs", label: "Legs" },
  { value: "upper_body", label: "Upper body" },
  { value: "lower_body", label: "Lower body" },
  { value: "full_body", label: "Full body" },
  { value: "core", label: "Core" },
  { value: "cardio", label: "Cardio" },
  { value: "custom", label: "Custom" },
];

export interface RoutineTemplate {
  id: string;
  name: string;
  category: RoutineCategory;
  notes: string;
  items: { exerciseId: string; sets: number; reps: string; weight: number | null; restSec: number }[];
}

/** Starting points a member can copy into their own routines */
export const routineTemplates: RoutineTemplate[] = [
  {
    id: "tpl-push",
    name: "Push day",
    category: "push",
    notes: "Chest, shoulders and triceps.",
    items: [
      { exerciseId: "ex001", sets: 4, reps: "8-10", weight: null, restSec: 120 },
      { exerciseId: "ex002", sets: 3, reps: "10-12", weight: null, restSec: 90 },
      { exerciseId: "ex007", sets: 3, reps: "8-10", weight: null, restSec: 90 },
      { exerciseId: "ex008", sets: 3, reps: "12-15", weight: null, restSec: 60 },
      { exerciseId: "ex013", sets: 3, reps: "12-15", weight: null, restSec: 60 },
    ],
  },
  {
    id: "tpl-pull",
    name: "Pull day",
    category: "pull",
    notes: "Back and biceps.",
    items: [
      { exerciseId: "ex004", sets: 4, reps: "6-10", weight: null, restSec: 120 },
      { exerciseId: "ex005", sets: 4, reps: "8-10", weight: null, restSec: 90 },
      { exerciseId: "ex006", sets: 3, reps: "10-12", weight: null, restSec: 75 },
      { exerciseId: "ex012", sets: 3, reps: "10-12", weight: null, restSec: 60 },
    ],
  },
  {
    id: "tpl-legs",
    name: "Leg day",
    category: "legs",
    notes: "Quads, hamstrings and glutes.",
    items: [
      { exerciseId: "ex009", sets: 4, reps: "6-8", weight: null, restSec: 150 },
      { exerciseId: "ex010", sets: 3, reps: "8-10", weight: null, restSec: 120 },
      { exerciseId: "ex011", sets: 3, reps: "10-12", weight: null, restSec: 90 },
    ],
  },
  {
    id: "tpl-full",
    name: "Beginner full body",
    category: "full_body",
    notes: "Every major muscle group in one short session. Good for your first weeks.",
    items: [
      { exerciseId: "ex011", sets: 3, reps: "10-12", weight: null, restSec: 60 },
      { exerciseId: "ex006", sets: 3, reps: "10-12", weight: null, restSec: 60 },
      { exerciseId: "ex003", sets: 3, reps: "10-15", weight: null, restSec: 45 },
      { exerciseId: "ex012", sets: 2, reps: "12-15", weight: null, restSec: 45 },
      { exerciseId: "ex014", sets: 3, reps: "30", weight: null, restSec: 30 },
    ],
  },
  {
    id: "tpl-core",
    name: "Quick core",
    category: "core",
    notes: "Fifteen minutes, finish any session with it.",
    items: [
      { exerciseId: "ex014", sets: 3, reps: "45", weight: null, restSec: 30 },
      { exerciseId: "ex015", sets: 3, reps: "15", weight: null, restSec: 45 },
    ],
  },
  {
    id: "tpl-hiit",
    name: "Cardio intervals",
    category: "cardio",
    notes: "Short, hard efforts with short rests.",
    items: [
      { exerciseId: "ex016", sets: 5, reps: "60", weight: null, restSec: 30 },
      { exerciseId: "ex003", sets: 4, reps: "15-20", weight: null, restSec: 20 },
      { exerciseId: "ex017", sets: 4, reps: "45", weight: null, restSec: 20 },
    ],
  },
];
