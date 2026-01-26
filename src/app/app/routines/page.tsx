"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  mockRoutines,
  routineTemplates,
  getExerciseById,
  formatMuscleGroup,
  formatDifficulty,
  muscleGroupIcons,
  type Routine,
} from "@/lib/data/mock-routines";

type TabType = "my-routines" | "favorites" | "templates";

export default function RoutinesPage() {
  const [activeTab, setActiveTab] = useState<TabType>("my-routines");
  const [routines, setRoutines] = useState(mockRoutines);

  const favoriteRoutines = routines.filter((r) => r.isFavorite);

  const toggleFavorite = (routineId: string) => {
    setRoutines(
      routines.map((r) =>
        r.id === routineId ? { ...r, isFavorite: !r.isFavorite } : r,
      ),
    );
  };

  const getDisplayRoutines = () => {
    switch (activeTab) {
      case "favorites":
        return favoriteRoutines;
      case "templates":
        return routineTemplates;
      default:
        return routines;
    }
  };

  const displayRoutines = getDisplayRoutines();

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            My Routines
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            {routines.length} routines • {favoriteRoutines.length} favorites
          </p>
        </div>
        <Link href="/app/routines/builder">
          <Button className="w-full sm:w-auto">+ New Routine</Button>
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 overflow-x-auto">
        {[
          { id: "my-routines", label: "My Routines", count: routines.length },
          {
            id: "favorites",
            label: "Favorites",
            count: favoriteRoutines.length,
          },
          {
            id: "templates",
            label: "Templates",
            count: routineTemplates.length,
          },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as TabType)}
            className={`px-3 sm:px-4 py-3 text-xs sm:text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? "text-emerald-600 border-emerald-600"
                : "text-gray-500 border-transparent hover:text-gray-700"
            }`}
          >
            {tab.label}
            <span
              className={`ml-1.5 sm:ml-2 px-1.5 py-0.5 rounded-full text-xs ${
                activeTab === tab.id
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Routines Grid */}
      {displayRoutines.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg sm:rounded-xl">
          <p className="text-sm sm:text-base text-gray-500 mb-4">
            {activeTab === "favorites"
              ? "No favorite routines yet"
              : "No routines found"}
          </p>
          {activeTab !== "templates" && (
            <Link href="/app/routines/builder">
              <Button variant="outline" className="w-full sm:w-auto">
                Create Your First Routine
              </Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="grid gap-3 sm:gap-4">
          {displayRoutines.map((routine) => (
            <RoutineCard
              key={routine.id}
              routine={routine}
              isTemplate={activeTab === "templates"}
              onToggleFavorite={
                activeTab !== "templates"
                  ? () => toggleFavorite(routine.id)
                  : undefined
              }
            />
          ))}
        </div>
      )}

      {/* Quick Stats (for my-routines tab) */}
      {activeTab === "my-routines" && routines.length > 0 && (
        <div className="bg-emerald-50 rounded-lg sm:rounded-xl p-3 sm:p-4">
          <h3 className="text-sm sm:text-base font-semibold text-emerald-900 mb-3">
            📊 Your Training Stats
          </h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div>
              <p className="text-xl sm:text-2xl font-bold text-emerald-700">
                {routines.reduce((sum, r) => sum + r.timesCompleted, 0)}
              </p>
              <p className="text-xs sm:text-sm text-emerald-600">
                Total Workouts
              </p>
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-bold text-emerald-700">
                {routines.length}
              </p>
              <p className="text-xs sm:text-sm text-emerald-600">
                Routines Created
              </p>
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-bold text-emerald-700">
                {Math.round(
                  routines.reduce((sum, r) => sum + r.duration, 0) /
                    routines.length,
                )}
                <span className="text-xs sm:text-sm font-normal">min</span>
              </p>
              <p className="text-xs sm:text-sm text-emerald-600">
                Avg Duration
              </p>
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-bold text-emerald-700">
                {routines.reduce((sum, r) => sum + r.exercises.length, 0)}
              </p>
              <p className="text-xs sm:text-sm text-emerald-600">
                Total Exercises
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface RoutineCardProps {
  routine: Routine;
  isTemplate?: boolean;
  onToggleFavorite?: () => void;
}

function RoutineCard({
  routine,
  isTemplate,
  onToggleFavorite,
}: RoutineCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const difficulty = formatDifficulty(routine.difficulty);

  // Get primary muscle groups from exercises
  const muscleGroups = Array.from(
    new Set(
      routine.exercises
        .map((ex) => getExerciseById(ex.exerciseId)?.muscleGroup)
        .filter(Boolean),
    ),
  ).slice(0, 3);

  return (
    <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 overflow-hidden">
      {/* Main Card */}
      <div className="p-3 sm:p-4">
        <div className="flex items-start justify-between gap-3 sm:gap-4">
          {/* Left - Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-gray-900 truncate">
                {routine.name}
              </h3>
              {routine.isFavorite && <span className="text-yellow-500">★</span>}
              {routine.isPublic && (
                <Badge variant="default" className="text-xs">
                  Public
                </Badge>
              )}
              {isTemplate && (
                <Badge variant="default" className="text-xs">
                  Template
                </Badge>
              )}
            </div>

            {routine.description && (
              <p className="text-sm text-gray-600 mb-2 line-clamp-1">
                {routine.description}
              </p>
            )}

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500">
              <span>{routine.exercises.length} exercises</span>
              <span>~{routine.duration} min</span>
              <span className={difficulty.color}>{difficulty.label}</span>
            </div>

            {/* Muscle Groups */}
            <div className="flex gap-1 mt-2">
              {muscleGroups.map((group) => (
                <span
                  key={group}
                  className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 rounded text-xs text-gray-600"
                >
                  {muscleGroupIcons[group!]} {formatMuscleGroup(group!)}
                </span>
              ))}
            </div>
          </div>

          {/* Right - Actions */}
          <div className="flex items-center gap-2">
            {onToggleFavorite && (
              <button
                onClick={onToggleFavorite}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                {routine.isFavorite ? (
                  <svg
                    className="w-5 h-5 text-yellow-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                    />
                  </svg>
                )}
              </button>
            )}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <svg
                className={`w-5 h-5 text-gray-400 transition-transform ${
                  isExpanded ? "rotate-180" : ""
                }`}
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
          </div>
        </div>

        {/* Last Completed */}
        {!isTemplate && routine.timesCompleted > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-sm">
            <span className="text-gray-500">
              Completed {routine.timesCompleted} times
            </span>
            {routine.lastCompletedAt && (
              <span className="text-gray-400">
                Last:{" "}
                {new Date(routine.lastCompletedAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t border-gray-200 p-4 bg-gray-50 space-y-4">
          {/* Exercise List */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-700">Exercises</h4>
            {routine.exercises.map((ex, index) => {
              const exercise = getExerciseById(ex.exerciseId);
              if (!exercise) return null;

              return (
                <div
                  key={`${ex.exerciseId}-${index}`}
                  className="flex items-center gap-3 p-2 bg-white rounded-lg"
                >
                  <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-medium">
                    {index + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {exercise.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {ex.sets} sets × {ex.reps || ex.duration + "s"}
                      {ex.weight && ` @ ${ex.weight}kg`}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Tags */}
          {routine.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {routine.tags.map((tag) => (
                <Badge key={tag} variant="outline">
                  #{tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-2 pt-2">
            <Link href="/app/routines/workout" className="flex-1">
              <Button className="w-full">Start Workout</Button>
            </Link>
            {isTemplate ? (
              <Button variant="outline" className="flex-1">
                Use Template
              </Button>
            ) : (
              <Link href="/app/routines/builder" className="flex-1">
                <Button variant="outline" className="w-full">
                  Edit
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
