"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { HiOutlineChevronLeft } from "react-icons/hi";
import {
  mockRoutines,
  getExerciseById,
  formatMuscleGroup,
  type Routine,
  type RoutineExercise,
  type SetLog,
} from "@/lib/data/mock-routines";

interface WorkoutState {
  routine: Routine;
  currentExerciseIndex: number;
  exerciseLogs: ExerciseLog[];
  startedAt: Date;
  isResting: boolean;
  restTimeRemaining: number;
}

interface ExerciseLog {
  exerciseId: string;
  sets: SetLog[];
  completed: boolean;
}

export default function WorkoutPage() {
  // For demo, use the first routine
  const selectedRoutine = mockRoutines[0];

  const [workout, setWorkout] = useState<WorkoutState | null>(null);
  const [currentSetIndex, setCurrentSetIndex] = useState(0);
  const [showSummary, setShowSummary] = useState(false);

  // Rest timer
  useEffect(() => {
    if (workout?.isResting && workout.restTimeRemaining > 0) {
      const timer = setInterval(() => {
        setWorkout((prev) =>
          prev
            ? {
                ...prev,
                restTimeRemaining: prev.restTimeRemaining - 1,
                isResting: prev.restTimeRemaining > 1,
              }
            : null,
        );
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [workout?.isResting, workout?.restTimeRemaining]);

  const startWorkout = () => {
    const initialLogs: ExerciseLog[] = selectedRoutine.exercises.map((ex) => ({
      exerciseId: ex.exerciseId,
      sets: Array(ex.sets)
        .fill(null)
        .map(() => ({
          reps: typeof ex.reps === "number" ? ex.reps : 0,
          weight: ex.weight,
          completed: false,
        })),
      completed: false,
    }));

    setWorkout({
      routine: selectedRoutine,
      currentExerciseIndex: 0,
      exerciseLogs: initialLogs,
      startedAt: new Date(),
      isResting: false,
      restTimeRemaining: 0,
    });
    setCurrentSetIndex(0);
  };

  const completeSet = (reps: number, weight?: number) => {
    if (!workout) return;

    const updatedLogs = [...workout.exerciseLogs];
    updatedLogs[workout.currentExerciseIndex].sets[currentSetIndex] = {
      reps,
      weight,
      completed: true,
    };

    const currentExercise =
      workout.routine.exercises[workout.currentExerciseIndex];
    const isLastSet = currentSetIndex >= currentExercise.sets - 1;

    if (isLastSet) {
      // Mark exercise as completed
      updatedLogs[workout.currentExerciseIndex].completed = true;

      // Move to next exercise or finish
      if (
        workout.currentExerciseIndex >=
        workout.routine.exercises.length - 1
      ) {
        // Workout complete!
        setWorkout({ ...workout, exerciseLogs: updatedLogs });
        setShowSummary(true);
      } else {
        // Next exercise
        setWorkout({
          ...workout,
          exerciseLogs: updatedLogs,
          currentExerciseIndex: workout.currentExerciseIndex + 1,
          isResting: true,
          restTimeRemaining: currentExercise.restTime,
        });
        setCurrentSetIndex(0);
      }
    } else {
      // Start rest timer, then next set
      setWorkout({
        ...workout,
        exerciseLogs: updatedLogs,
        isResting: true,
        restTimeRemaining: currentExercise.restTime,
      });
      setCurrentSetIndex(currentSetIndex + 1);
    }
  };

  const skipRest = () => {
    if (!workout) return;
    setWorkout({
      ...workout,
      isResting: false,
      restTimeRemaining: 0,
    });
  };

  const skipExercise = () => {
    if (!workout) return;

    const updatedLogs = [...workout.exerciseLogs];
    // Mark remaining sets as skipped/not completed
    updatedLogs[workout.currentExerciseIndex].completed = true;

    if (workout.currentExerciseIndex >= workout.routine.exercises.length - 1) {
      setWorkout({ ...workout, exerciseLogs: updatedLogs });
      setShowSummary(true);
    } else {
      setWorkout({
        ...workout,
        exerciseLogs: updatedLogs,
        currentExerciseIndex: workout.currentExerciseIndex + 1,
        isResting: false,
        restTimeRemaining: 0,
      });
      setCurrentSetIndex(0);
    }
  };

  // Pre-workout screen
  if (!workout && !showSummary) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <div className="flex items-center gap-3">
          <Link href="/app/routines">
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <HiOutlineChevronLeft className="w-5 h-5" />
            </button>
          </Link>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            Start Workout
          </h1>
        </div>

        {/* Routine Preview */}
        <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-3 sm:p-4">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
            {selectedRoutine.name}
          </h2>
          {selectedRoutine.description && (
            <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
              {selectedRoutine.description}
            </p>
          )}

          <div className="flex gap-3 sm:gap-4 mb-3 sm:mb-4 text-xs sm:text-sm text-gray-600">
            <span>🏋️ {selectedRoutine.exercises.length} exercises</span>
            <span>⏱️ ~{selectedRoutine.duration} min</span>
          </div>

          {/* Exercise List Preview */}
          <div className="space-y-2 mb-4 sm:mb-6">
            {selectedRoutine.exercises.map((ex, index) => {
              const exercise = getExerciseById(ex.exerciseId);
              if (!exercise) return null;
              return (
                <div
                  key={`${ex.exerciseId}-${index}`}
                  className="flex items-center gap-2 sm:gap-3 p-2 bg-gray-50 rounded-lg"
                >
                  <span className="w-6 h-6 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center text-xs font-medium">
                    {index + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                      {exercise.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {ex.sets} sets × {ex.reps || ex.duration + "s"}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <Button className="w-full" onClick={startWorkout}>
            🚀 Start Workout
          </Button>
        </div>
      </div>
    );
  }

  // Workout summary screen
  if (showSummary && workout) {
    const completedSets = workout.exerciseLogs.reduce(
      (sum, ex) => sum + ex.sets.filter((s) => s.completed).length,
      0,
    );
    const totalSets = workout.routine.exercises.reduce(
      (sum, ex) => sum + ex.sets,
      0,
    );
    const duration = Math.round(
      (Date.now() - workout.startedAt.getTime()) / 1000 / 60,
    );

    return (
      <div className="space-y-4 sm:space-y-6">
        <div className="text-center py-6 sm:py-8">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl sm:text-4xl">🎉</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
            Workout Complete!
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Great job crushing your workout!
          </p>
        </div>

        {/* Stats */}
        <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-3 sm:p-4">
          <h2 className="text-sm sm:text-base font-semibold text-gray-900 mb-3 sm:mb-4">
            Workout Summary
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div className="text-center p-3 sm:p-4 bg-emerald-50 rounded-lg">
              <p className="text-xl sm:text-2xl font-bold text-emerald-700">
                {duration}
              </p>
              <p className="text-xs sm:text-sm text-emerald-600">Minutes</p>
            </div>
            <div className="text-center p-3 sm:p-4 bg-blue-50 rounded-lg">
              <p className="text-xl sm:text-2xl font-bold text-blue-700">
                {completedSets}/{totalSets}
              </p>
              <p className="text-xs sm:text-sm text-blue-600">Sets Completed</p>
            </div>
            <div className="text-center p-3 sm:p-4 bg-purple-50 rounded-lg">
              <p className="text-xl sm:text-2xl font-bold text-purple-700">
                {workout.exerciseLogs.filter((e) => e.completed).length}
              </p>
              <p className="text-xs sm:text-sm text-purple-600">
                Exercises Done
              </p>
            </div>
            <div className="text-center p-3 sm:p-4 bg-orange-50 rounded-lg">
              <p className="text-xl sm:text-2xl font-bold text-orange-700">
                ~{Math.round(duration * 8)}
              </p>
              <p className="text-xs sm:text-sm text-orange-600">
                Calories Burned
              </p>
            </div>
          </div>
        </div>

        {/* Exercise Breakdown */}
        <div className="bg-surface rounded-3xl border border-gray-900/[0.06] p-4 shadow-soft">
          <h3 className="font-semibold text-gray-900 mb-3">
            Exercise Breakdown
          </h3>
          <div className="space-y-3">
            {workout.exerciseLogs.map((log, index) => {
              const exercise = getExerciseById(log.exerciseId);
              const completedSetCount = log.sets.filter(
                (s) => s.completed,
              ).length;
              return (
                <div key={log.exerciseId} className="flex items-center gap-3">
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                      log.completed
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {log.completed ? "✓" : index + 1}
                  </span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {exercise?.name}
                    </p>
                  </div>
                  <span className="text-sm text-gray-500">
                    {completedSetCount}/{log.sets.length} sets
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <Link href="/app/routines" className="flex-1">
            <Button variant="outline" className="w-full">
              Back to Routines
            </Button>
          </Link>
          <Link href="/app/dashboard" className="flex-1">
            <Button className="w-full">Done</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Active workout screen
  if (!workout) return null;

  const currentExerciseData =
    workout.routine.exercises[workout.currentExerciseIndex];
  const currentExercise = getExerciseById(currentExerciseData.exerciseId);
  const currentLog = workout.exerciseLogs[workout.currentExerciseIndex];
  const progress =
    (workout.currentExerciseIndex * 100) / workout.routine.exercises.length +
    ((currentSetIndex / currentExerciseData.sets) * 100) /
      workout.routine.exercises.length;

  return (
    <div className="min-h-screen pb-32 -mx-4 sm:-mx-6 lg:-mx-8">
      {/* Header */}
      <div className="sticky top-16 bg-white border-b border-gray-200 px-4 py-3 z-10">
        <div className="flex items-center justify-between mb-2">
          <button
            onClick={() => {
              if (confirm("End workout early?")) {
                setShowSummary(true);
              }
            }}
            className="text-xs sm:text-sm text-red-600 font-medium"
          >
            End Workout
          </button>
          <span className="text-xs sm:text-sm text-gray-600 font-medium">
            {Math.round((Date.now() - workout.startedAt.getTime()) / 1000 / 60)}{" "}
            min
          </span>
        </div>
        {/* Progress Bar */}
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-xs text-gray-500 mt-1 text-center">
          Exercise {workout.currentExerciseIndex + 1} of{" "}
          {workout.routine.exercises.length}
        </p>
      </div>

      {/* Rest Timer Overlay */}
      {workout.isResting && (
        <div className="fixed inset-0 bg-ink/70 backdrop-blur-md z-50 flex items-center justify-center px-4">
          <div className="text-center text-white">
            <p className="text-base sm:text-lg mb-2">Rest Time</p>
            <p className="text-6xl sm:text-7xl font-bold mb-4">
              {workout.restTimeRemaining}
            </p>
            <p className="text-sm sm:text-base text-gray-400 mb-6">
              Next:{" "}
              {currentSetIndex < currentExerciseData.sets
                ? `Set ${currentSetIndex + 1}`
                : "Next Exercise"}
            </p>
            <Button
              variant="outline"
              onClick={skipRest}
              className="text-white border-white hover:bg-white/10"
            >
              Skip Rest
            </Button>
          </div>
        </div>
      )}

      {/* Current Exercise */}
      <div className="py-4 sm:py-6 space-y-4 sm:space-y-6 px-4 sm:px-6 lg:px-8">
        {/* Exercise Info */}
        <div className="text-center">
          <Badge variant="info" className="mb-2 sm:mb-3 text-xs sm:text-sm">
            {formatMuscleGroup(currentExercise?.muscleGroup || "chest")}
          </Badge>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            {currentExercise?.name}
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            Set {currentSetIndex + 1} of {currentExerciseData.sets}
          </p>
        </div>

        {/* Target */}
        <div className="bg-emerald-50 rounded-xl p-4 sm:p-6 text-center">
          <p className="text-xs sm:text-sm text-emerald-700 mb-1">Target</p>
          <p className="text-3xl sm:text-4xl font-semibold text-emerald-800 tracking-tight">
            {currentExerciseData.reps || `${currentExerciseData.duration}s`}
          </p>
          {currentExerciseData.weight && (
            <p className="text-emerald-600 mt-1">
              @ {currentExerciseData.weight} kg
            </p>
          )}
        </div>

        {/* Set Progress Indicators */}
        <div className="flex justify-center gap-2">
          {Array(currentExerciseData.sets)
            .fill(null)
            .map((_, i) => (
              <div
                key={i}
                className={`w-10 h-10 rounded-full flex items-center justify-center font-medium ${
                  currentLog.sets[i]?.completed
                    ? "bg-emerald-500 text-white"
                    : i === currentSetIndex
                      ? "bg-emerald-100 text-emerald-700 ring-2 ring-emerald-500"
                      : "bg-gray-100 text-gray-400"
                }`}
              >
                {currentLog.sets[i]?.completed ? "✓" : i + 1}
              </div>
            ))}
        </div>

        {/* Instructions */}
        {currentExercise?.instructions && (
          <div className="bg-gray-50 rounded-xl p-3 sm:p-4">
            <h3 className="text-sm sm:text-base font-medium text-gray-900 mb-2">
              Quick Tips
            </h3>
            <ul className="text-xs sm:text-sm text-gray-600 space-y-1">
              {currentExercise.instructions.slice(0, 3).map((tip, i) => (
                <li key={i}>• {tip}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 sm:p-4 safe-area-inset-bottom">
        <div className="max-w-lg mx-auto space-y-2 sm:space-y-3">
          <SetCompletionButtons
            targetReps={
              typeof currentExerciseData.reps === "number"
                ? currentExerciseData.reps
                : parseInt(String(currentExerciseData.reps)?.split("-")[0]) ||
                  10
            }
            weight={currentExerciseData.weight}
            onComplete={completeSet}
          />
          <button
            onClick={skipExercise}
            className="w-full text-sm text-gray-500 py-2"
          >
            Skip Exercise
          </button>
        </div>
      </div>
    </div>
  );
}

interface SetCompletionButtonsProps {
  targetReps: number;
  weight?: number;
  onComplete: (reps: number, weight?: number) => void;
}

function SetCompletionButtons({
  targetReps,
  weight,
  onComplete,
}: SetCompletionButtonsProps) {
  const [customReps, setCustomReps] = useState(targetReps);
  const [customWeight, setCustomWeight] = useState(weight || 0);
  const [showCustom, setShowCustom] = useState(false);

  if (showCustom) {
    return (
      <div className="space-y-3">
        <div className="flex gap-3">
          <div className="flex-1">
            <label className="text-xs text-gray-500">Reps</label>
            <input
              type="number"
              value={customReps}
              onChange={(e) => setCustomReps(parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div className="flex-1">
            <label className="text-xs text-gray-500">Weight (kg)</label>
            <input
              type="number"
              value={customWeight}
              onChange={(e) => setCustomWeight(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => setShowCustom(false)}
          >
            Cancel
          </Button>
          <Button
            className="flex-1"
            onClick={() => onComplete(customReps, customWeight || undefined)}
          >
            Log Set
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Button
        className="w-full py-4 text-lg"
        onClick={() => onComplete(targetReps, weight)}
      >
        ✓ Complete Set ({targetReps} reps{weight ? ` @ ${weight}kg` : ""})
      </Button>
      <button
        onClick={() => setShowCustom(true)}
        className="w-full text-sm text-emerald-600 py-2"
      >
        Log different reps/weight
      </button>
    </div>
  );
}
