"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { HiOutlineChevronDown } from "react-icons/hi";
import {
  mockExercises,
  formatMuscleGroup,
  formatEquipment,
  formatDifficulty,
  muscleGroupIcons,
  type Exercise,
  type MuscleGroup,
  type Equipment,
} from "@/lib/data/mock-routines";
import Select from "@/components/ui/Select";

const muscleGroups: MuscleGroup[] = [
  "chest",
  "back",
  "shoulders",
  "biceps",
  "triceps",
  "forearms",
  "core",
  "quadriceps",
  "hamstrings",
  "glutes",
  "calves",
  "cardio",
];

const equipmentList: Equipment[] = [
  "bodyweight",
  "barbell",
  "dumbbell",
  "cable",
  "machine",
  "kettlebell",
  "resistance_band",
  "pull_up_bar",
];

export default function ExercisesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMuscle, setSelectedMuscle] = useState<MuscleGroup | "all">(
    "all",
  );
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | "all">(
    "all",
  );
  const [selectedDifficulty, setSelectedDifficulty] = useState<
    "all" | "beginner" | "intermediate" | "advanced"
  >("all");
  const [expandedExercise, setExpandedExercise] = useState<string | null>(null);

  const filteredExercises = useMemo(() => {
    return mockExercises.filter((exercise) => {
      // Search filter
      if (
        searchQuery &&
        !exercise.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !exercise.description.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }

      // Muscle group filter
      if (
        selectedMuscle !== "all" &&
        exercise.muscleGroup !== selectedMuscle &&
        !exercise.secondaryMuscles?.includes(selectedMuscle)
      ) {
        return false;
      }

      // Equipment filter
      if (
        selectedEquipment !== "all" &&
        !exercise.equipment.includes(selectedEquipment)
      ) {
        return false;
      }

      // Difficulty filter
      if (
        selectedDifficulty !== "all" &&
        exercise.difficulty !== selectedDifficulty
      ) {
        return false;
      }

      return true;
    });
  }, [searchQuery, selectedMuscle, selectedEquipment, selectedDifficulty]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedMuscle("all");
    setSelectedEquipment("all");
    setSelectedDifficulty("all");
  };

  const hasFilters =
    searchQuery ||
    selectedMuscle !== "all" ||
    selectedEquipment !== "all" ||
    selectedDifficulty !== "all";

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
          Exercise Library
        </h1>
        <p className="text-sm sm:text-base text-gray-600 mt-1">
          Browse {mockExercises.length} exercises with detailed instructions
        </p>
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-3 sm:p-4 space-y-3 sm:space-y-4">
        {/* Search */}
        <Input
          type="text"
          placeholder="Search exercises..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full text-sm sm:text-base"
        />

        {/* Filter Row */}
        <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-3">
          {/* Muscle Group */}
          <Select
            value={selectedMuscle}
            onChange={(e) =>
              setSelectedMuscle(e.target.value as MuscleGroup | "all")
            }
            // className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">All Muscles</option>
            {muscleGroups.map((muscle) => (
              <option key={muscle} value={muscle}>
                {muscleGroupIcons[muscle]} {formatMuscleGroup(muscle)}
              </option>
            ))}
          </Select>

          {/* Equipment */}
          <Select
            value={selectedEquipment}
            onChange={(e) =>
              setSelectedEquipment(e.target.value as Equipment | "all")
            }
            // className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">All Equipment</option>
            {equipmentList.map((equip) => (
              <option key={equip} value={equip}>
                {formatEquipment(equip)}
              </option>
            ))}
          </Select>

          {/* Difficulty */}
          <Select
            value={selectedDifficulty}
            onChange={(e) =>
              setSelectedDifficulty(
                e.target.value as
                  | "all"
                  | "beginner"
                  | "intermediate"
                  | "advanced",
              )
            }
            // className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">All Levels</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </Select>

          {hasFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              Clear Filters
            </Button>
          )}
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-xs sm:text-sm text-gray-600">
          Showing {filteredExercises.length} of {mockExercises.length} exercises
        </p>
      </div>

      {/* Exercise List */}
      <div className="grid gap-3 sm:gap-4">
        {filteredExercises.map((exercise) => (
          <ExerciseCard
            key={exercise.id}
            exercise={exercise}
            isExpanded={expandedExercise === exercise.id}
            onToggle={() =>
              setExpandedExercise(
                expandedExercise === exercise.id ? null : exercise.id,
              )
            }
          />
        ))}

        {filteredExercises.length === 0 && (
          <div className="text-center py-12 bg-gray-50 rounded-xl">
            <p className="text-gray-500">No exercises found</p>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="mt-2"
            >
              Clear filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

interface ExerciseCardProps {
  exercise: Exercise;
  isExpanded: boolean;
  onToggle: () => void;
}

function ExerciseCard({ exercise, isExpanded, onToggle }: ExerciseCardProps) {
  const difficulty = formatDifficulty(exercise.difficulty);

  return (
    <div className="bg-surface rounded-3xl sm:rounded-xl border border-gray-900/[0.06] overflow-hidden shadow-soft">
      {/* Header - Always Visible */}
      <button
        onClick={onToggle}
        className="w-full p-3 sm:p-4 flex items-center gap-3 sm:gap-4 hover:bg-gray-50 transition-colors text-left"
      >
        {/* Icon/Image */}
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-emerald-100 flex items-center justify-center text-xl sm:text-2xl shrink-0">
          {muscleGroupIcons[exercise.muscleGroup]}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className="text-sm sm:text-base font-semibold text-gray-900">
            {exercise.name}
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 truncate">
            {formatMuscleGroup(exercise.muscleGroup)}
            {exercise.secondaryMuscles &&
              exercise.secondaryMuscles.length > 0 && (
                <span className="text-gray-400">
                  {" "}
                  •{" "}
                  {exercise.secondaryMuscles.map(formatMuscleGroup).join(", ")}
                </span>
              )}
          </p>
        </div>

        {/* Badges */}
        <div className="hidden sm:flex items-center gap-2">
          <Badge variant="default" className={difficulty.color}>
            {difficulty.label}
          </Badge>
        </div>

        {/* Expand Icon */}
        <HiOutlineChevronDown
          className={`w-5 h-5 text-gray-400 transition-transform ${
            isExpanded ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t border-gray-200 p-3 sm:p-4 space-y-3 sm:space-y-4 bg-gray-50">
          {/* Mobile Badge */}
          <div className="sm:hidden">
            <Badge variant="default" className={difficulty.color}>
              {difficulty.label}
            </Badge>
          </div>

          {/* Description */}
          <p className="text-sm sm:text-base text-gray-700">
            {exercise.description}
          </p>

          {/* Equipment */}
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-2">
              Equipment Needed
            </h4>
            <div className="flex flex-wrap gap-2">
              {exercise.equipment.map((equip) => (
                <Badge key={equip} variant="outline">
                  {formatEquipment(equip)}
                </Badge>
              ))}
            </div>
          </div>

          {/* Instructions */}
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-2">
              Instructions
            </h4>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              {exercise.instructions.map((instruction, index) => (
                <li key={index} className="text-sm">
                  {instruction}
                </li>
              ))}
            </ol>
          </div>

          {/* Tips */}
          {exercise.tips && exercise.tips.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <h4 className="text-sm font-medium text-amber-800 mb-2">
                💡 Pro Tips
              </h4>
              <ul className="list-disc list-inside space-y-1 text-amber-700">
                {exercise.tips.map((tip, index) => (
                  <li key={index} className="text-sm">
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Action */}
          <div className="flex flex-col sm:flex-row gap-2 pt-2">
            <Button size="sm" className="w-full sm:w-auto">
              Add to Routine
            </Button>
            <Button variant="outline" size="sm" className="w-full sm:w-auto">
              View Demo
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
