"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import {
  mockExercises,
  formatMuscleGroup,
  formatDifficulty,
  muscleGroupIcons,
  type RoutineExercise,
  type RoutineCategory,
  type Exercise,
} from "@/lib/data/mock-routines";
import Select from "@/components/ui/Select";

const categories: { value: RoutineCategory; label: string }[] = [
  { value: "push", label: "Push" },
  { value: "pull", label: "Pull" },
  { value: "legs", label: "Legs" },
  { value: "upper_body", label: "Upper Body" },
  { value: "lower_body", label: "Lower Body" },
  { value: "full_body", label: "Full Body" },
  { value: "cardio", label: "Cardio" },
  { value: "hiit", label: "HIIT" },
  { value: "strength", label: "Strength" },
  { value: "hypertrophy", label: "Hypertrophy" },
  { value: "custom", label: "Custom" },
];

interface RoutineBuilderExercise extends RoutineExercise {
  exercise: Exercise;
}

export default function RoutineBuilderPage() {
  const [routineName, setRoutineName] = useState("");
  const [routineDescription, setRoutineDescription] = useState("");
  const [category, setCategory] = useState<RoutineCategory>("custom");
  const [difficulty, setDifficulty] = useState<
    "beginner" | "intermediate" | "advanced"
  >("intermediate");
  const [isPublic, setIsPublic] = useState(false);
  const [exercises, setExercises] = useState<RoutineBuilderExercise[]>([]);
  const [showExercisePicker, setShowExercisePicker] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Calculate estimated duration
  const estimatedDuration = exercises.reduce((total, ex) => {
    const setTime = ex.duration ? ex.duration * ex.sets : ex.sets * 45; // avg 45s per set
    const restTotal = ex.restTime * (ex.sets - 1);
    return total + (setTime + restTotal) / 60;
  }, 0);

  const addExercise = (exercise: Exercise) => {
    const newExercise: RoutineBuilderExercise = {
      exerciseId: exercise.id,
      exercise,
      sets: 3,
      reps: "10-12",
      restTime: 60,
    };
    setExercises([...exercises, newExercise]);
    setShowExercisePicker(false);
    setSearchQuery("");
  };

  const removeExercise = (index: number) => {
    setExercises(exercises.filter((_, i) => i !== index));
  };

  const updateExercise = (
    index: number,
    field: keyof RoutineExercise,
    value: number | string,
  ) => {
    const updated = [...exercises];
    updated[index] = { ...updated[index], [field]: value };
    setExercises(updated);
  };

  const moveExercise = (index: number, direction: "up" | "down") => {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= exercises.length) return;

    const updated = [...exercises];
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    setExercises(updated);
  };

  const filteredExercises = mockExercises.filter(
    (e) =>
      e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      formatMuscleGroup(e.muscleGroup)
        .toLowerCase()
        .includes(searchQuery.toLowerCase()),
  );

  const handleSave = () => {
    // In real app, would save to database
    alert("Routine saved! (Mock - no backend yet)");
  };

  return (
    <div className="space-y-4 sm:space-y-6 pb-16 sm:pb-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            Routine Builder
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            Create your custom workout routine
          </p>
        </div>
        <Button
          onClick={handleSave}
          disabled={!routineName || exercises.length === 0}
          className="w-full sm:w-auto"
        >
          Save Routine
        </Button>
      </div>

      {/* Routine Details */}
      <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-3 sm:p-4 space-y-3 sm:space-y-4">
        <h2 className="text-sm sm:text-base font-semibold text-gray-900">
          Routine Details
        </h2>

        <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
              Routine Name *
            </label>
            <Input
              value={routineName}
              onChange={(e) => setRoutineName(e.target.value)}
              placeholder="e.g., Push Day - Chest & Triceps"
              className="text-sm sm:text-base"
            />
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <Select
              value={category}
              onChange={(e) => setCategory(e.target.value as RoutineCategory)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </Select>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={routineDescription}
              onChange={(e) => setRoutineDescription(e.target.value)}
              placeholder="Describe your routine..."
              rows={2}
              className="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
              Difficulty
            </label>
            <Select
              value={difficulty}
              onChange={(e) =>
                setDifficulty(
                  e.target.value as "beginner" | "intermediate" | "advanced",
                )
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </Select>
          </div>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
              />
              <span className="text-sm text-gray-700">
                Make this routine public
              </span>
            </label>
          </div>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap gap-4 sm:gap-6 pt-2 border-t border-gray-200 text-sm">
          <div>
            <span className="text-xs sm:text-sm text-gray-500">Exercises</span>
            <p className="text-base sm:text-lg font-semibold text-gray-900">
              {exercises.length}
            </p>
          </div>
          <div>
            <span className="text-xs sm:text-sm text-gray-500">
              Est. Duration
            </span>
            <p className="text-base sm:text-lg font-semibold text-gray-900">
              ~{Math.round(estimatedDuration)} min
            </p>
          </div>
          <div>
            <span className="text-xs sm:text-sm text-gray-500">Total Sets</span>
            <p className="text-base sm:text-lg font-semibold text-gray-900">
              {exercises.reduce((sum, ex) => sum + ex.sets, 0)}
            </p>
          </div>
        </div>
      </div>

      {/* Exercises List */}
      <div className="space-y-3 sm:space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm sm:text-base font-semibold text-gray-900">
            Exercises
          </h2>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowExercisePicker(true)}
            className="text-xs sm:text-sm"
          >
            + Add Exercise
          </Button>
        </div>

        {exercises.length === 0 ? (
          <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg sm:rounded-xl p-6 sm:p-8 text-center">
            <p className="text-sm sm:text-base text-gray-500 mb-3">
              No exercises added yet
            </p>
            <Button
              variant="outline"
              onClick={() => setShowExercisePicker(true)}
              className="w-full sm:w-auto"
            >
              Browse Exercise Library
            </Button>
          </div>
        ) : (
          <div className="space-y-2 sm:space-y-3">
            {exercises.map((item, index) => (
              <ExerciseItem
                key={`${item.exerciseId}-${index}`}
                item={item}
                index={index}
                total={exercises.length}
                onUpdate={(field, value) => updateExercise(index, field, value)}
                onRemove={() => removeExercise(index)}
                onMove={(dir) => moveExercise(index, dir)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Exercise Picker Modal */}
      {showExercisePicker && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center">
          <div className="bg-white w-full max-w-lg sm:rounded-xl rounded-t-xl max-h-[80vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900">Add Exercise</h3>
                <button
                  onClick={() => setShowExercisePicker(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <Input
                type="text"
                placeholder="Search exercises..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
            </div>

            {/* Exercise List */}
            <div className="flex-1 overflow-y-auto p-2">
              {filteredExercises.map((exercise) => {
                const diff = formatDifficulty(exercise.difficulty);
                return (
                  <button
                    key={exercise.id}
                    onClick={() => addExercise(exercise)}
                    className="w-full p-3 flex items-center gap-3 hover:bg-gray-50 rounded-lg text-left"
                  >
                    <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center text-xl shrink-0">
                      {muscleGroupIcons[exercise.muscleGroup]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900">
                        {exercise.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatMuscleGroup(exercise.muscleGroup)}
                      </p>
                    </div>
                    <Badge variant="default" className={diff.color}>
                      {diff.label}
                    </Badge>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface ExerciseItemProps {
  item: RoutineBuilderExercise;
  index: number;
  total: number;
  onUpdate: (field: keyof RoutineExercise, value: number | string) => void;
  onRemove: () => void;
  onMove: (direction: "up" | "down") => void;
}

function ExerciseItem({
  item,
  index,
  total,
  onUpdate,
  onRemove,
  onMove,
}: ExerciseItemProps) {
  const { exercise } = item;

  return (
    <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-3 sm:p-4">
      {/* Header */}
      <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
        <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs sm:text-sm font-medium">
          {index + 1}
        </span>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm sm:text-base font-medium text-gray-900">
            {exercise.name}
          </h4>
          <p className="text-xs sm:text-sm text-gray-500">
            {formatMuscleGroup(exercise.muscleGroup)}
          </p>
        </div>
        <div className="flex items-center gap-0.5 sm:gap-1">
          <button
            onClick={() => onMove("up")}
            disabled={index === 0}
            className="p-1.5 hover:bg-gray-100 rounded disabled:opacity-30"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 15l7-7 7 7"
              />
            </svg>
          </button>
          <button
            onClick={() => onMove("down")}
            disabled={index === total - 1}
            className="p-1.5 hover:bg-gray-100 rounded disabled:opacity-30"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
          <button
            onClick={onRemove}
            className="p-1.5 hover:bg-red-50 rounded text-red-500"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div>
          <label className="block text-xs text-gray-500 mb-1">Sets</label>
          <input
            type="number"
            min={1}
            max={10}
            value={item.sets}
            onChange={(e) => onUpdate("sets", parseInt(e.target.value) || 1)}
            className="w-full px-2 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div>
          <label className="block text-xs text-gray-500 mb-1">Reps</label>
          <input
            type="text"
            value={item.reps || ""}
            onChange={(e) => onUpdate("reps", e.target.value)}
            placeholder="10-12"
            className="w-full px-2 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div>
          <label className="block text-xs text-gray-500 mb-1">
            Weight (kg)
          </label>
          <input
            type="number"
            min={0}
            step={0.5}
            value={item.weight || ""}
            onChange={(e) =>
              onUpdate("weight", parseFloat(e.target.value) || 0)
            }
            placeholder="Optional"
            className="w-full px-2 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div>
          <label className="block text-xs text-gray-500 mb-1">Rest (sec)</label>
          <input
            type="number"
            min={0}
            step={15}
            value={item.restTime}
            onChange={(e) =>
              onUpdate("restTime", parseInt(e.target.value) || 60)
            }
            className="w-full px-2 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Notes (optional) */}
      <div className="mt-2 sm:mt-3">
        <input
          type="text"
          value={item.notes || ""}
          onChange={(e) => onUpdate("notes", e.target.value)}
          placeholder="Add notes (optional)..."
          className="w-full px-2 py-1.5 border border-gray-200 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50"
        />
      </div>
    </div>
  );
}
