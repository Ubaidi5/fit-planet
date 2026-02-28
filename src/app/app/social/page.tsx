"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import {
  HiOutlinePlus,
  HiOutlineHeart,
  HiHeart,
  HiOutlineChat,
  HiOutlineShare,
} from "react-icons/hi";
import {
  mockFeedPosts,
  mockSharedRoutines,
  mockGymVisits,
  formatTimeAgo,
  formatNumber,
  type FeedPost,
  type SharedRoutine,
  type GymVisit,
} from "@/lib/data/mock-social";

type FeedFilter = "all" | "routines" | "workouts" | "gym_visits";

export default function SocialFeedPage() {
  const [filter, setFilter] = useState<FeedFilter>("all");
  const [feedPosts, setFeedPosts] = useState(mockFeedPosts);
  const [sharedRoutines] = useState(mockSharedRoutines);
  const [gymVisits] = useState(mockGymVisits);

  const filteredPosts = feedPosts.filter((post) => {
    if (filter === "all") return true;
    if (filter === "routines") return post.type === "routine_share";
    if (filter === "workouts")
      return post.type === "workout_complete" || post.type === "milestone";
    if (filter === "gym_visits") return post.type === "going_to_gym";
    return true;
  });

  const handleLikePost = (postId: string) => {
    setFeedPosts((posts) =>
      posts.map((post) =>
        post.id === postId
          ? {
              ...post,
              isLiked: !post.isLiked,
              likes: post.isLiked ? post.likes - 1 : post.likes + 1,
            }
          : post,
      ),
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Social Feed
          </h1>
          <p className="mt-1 text-gray-500">
            See what your fitness community is up to
          </p>
        </div>
        <Button beforeIcon={<HiOutlinePlus className="h-5 w-5" />}>
          Share Routine
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Feed */}
        <div className="space-y-6 lg:col-span-2">
          {/* Filter Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {[
              { key: "all", label: "All Activity" },
              { key: "routines", label: "Routines" },
              { key: "workouts", label: "Workouts" },
              { key: "gym_visits", label: "Gym Visits" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key as FeedFilter)}
                className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  filter === tab.key
                    ? "bg-emerald-500 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Feed Posts */}
          <div className="space-y-4">
            {filteredPosts.map((post) => (
              <FeedPostCard
                key={post.id}
                post={post}
                onLike={() => handleLikePost(post.id)}
              />
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Going to Gym Section */}
          <Card className="p-4">
            <h3 className="mb-4 font-semibold text-gray-900">
              🏋️ Friends Going to Gym
            </h3>
            <div className="space-y-3">
              {gymVisits.map((visit) => (
                <GymVisitCard key={visit.id} visit={visit} />
              ))}
            </div>
            <Button variant="outline" fullWidth className="mt-4">
              Post Your Gym Visit
            </Button>
          </Card>

          {/* Trending Routines */}
          <Card className="p-4">
            <h3 className="mb-4 font-semibold text-gray-900">
              🔥 Trending Routines
            </h3>
            <div className="space-y-3">
              {sharedRoutines.slice(0, 3).map((routine) => (
                <TrendingRoutineCard key={routine.id} routine={routine} />
              ))}
            </div>
            <Button variant="outline" fullWidth className="mt-4">
              Browse All Routines
            </Button>
          </Card>

          {/* Suggested Users */}
          <Card className="p-4">
            <h3 className="mb-4 font-semibold text-gray-900">
              👥 Suggested to Follow
            </h3>
            <div className="space-y-3">
              {[
                { name: "Zain Ahmed", username: "zain_fitness", workouts: 891 },
                { name: "Sara Khan", username: "sara_lifts", workouts: 456 },
                { name: "Hassan Ali", username: "hassan_fit", workouts: 234 },
              ].map((user) => (
                <div
                  key={user.username}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-emerald-400 to-teal-500 text-sm font-bold text-white">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {user.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {user.workouts} workouts
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Follow
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Feed Post Card Component
function FeedPostCard({
  post,
  onLike,
}: {
  post: FeedPost;
  onLike: () => void;
}) {
  const getPostIcon = () => {
    switch (post.type) {
      case "routine_share":
        return "📋";
      case "workout_complete":
        return "💪";
      case "going_to_gym":
        return "🏋️";
      case "milestone":
        return "🎉";
      case "challenge_complete":
        return "🏆";
      default:
        return "📝";
    }
  };

  return (
    <Card className="overflow-hidden">
      {/* Post Header */}
      <div className="flex items-center gap-3 p-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-emerald-400 to-teal-500 text-lg font-bold text-white">
          {post.user.name.charAt(0)}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="truncate font-semibold text-gray-900">
              {post.user.name}
            </span>
            <span className="text-lg">{getPostIcon()}</span>
          </div>
          <p className="text-sm text-gray-500">
            @{post.user.username} · {formatTimeAgo(post.createdAt)}
          </p>
        </div>
      </div>

      {/* Post Content */}
      <div className="px-4 pb-3">
        <p className="text-gray-700">{post.content.text}</p>
      </div>

      {/* Routine Card (if shared) */}
      {post.type === "routine_share" && post.content.routine && (
        <div className="mx-4 mb-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="font-semibold text-gray-900">
                {post.content.routine.title}
              </h4>
              <p className="mt-1 text-sm text-gray-500">
                {post.content.routine.description}
              </p>
            </div>
            <Badge
              variant={
                post.content.routine.fitnessLevel === "advanced"
                  ? "danger"
                  : post.content.routine.fitnessLevel === "intermediate"
                    ? "warning"
                    : "success"
              }
            >
              {post.content.routine.fitnessLevel}
            </Badge>
          </div>
          <div className="mt-3 flex flex-wrap gap-2 text-xs text-gray-600">
            <span>⏱️ {post.content.routine.duration} min</span>
            <span>•</span>
            <span>💪 {post.content.routine.exerciseCount} exercises</span>
            <span>•</span>
            <span>📁 {post.content.routine.saves} saves</span>
          </div>
          <div className="mt-3 flex gap-2">
            <Button size="sm" variant="outline">
              View Routine
            </Button>
            <Button size="sm">Save to Library</Button>
          </div>
        </div>
      )}

      {/* Workout Summary (if completed) */}
      {post.type === "workout_complete" && post.content.workout && (
        <div className="mx-4 mb-4 rounded-lg border border-emerald-200 bg-emerald-50 p-4">
          <h4 className="font-semibold text-emerald-800">
            {post.content.workout.name}
          </h4>
          <div className="mt-2 flex flex-wrap gap-4 text-sm text-emerald-700">
            <span>⏱️ {post.content.workout.duration} min</span>
            <span>💪 {post.content.workout.exerciseCount} exercises</span>
            {post.content.workout.personalRecords &&
              post.content.workout.personalRecords > 0 && (
                <span className="font-semibold">
                  🏆 {post.content.workout.personalRecords} PRs!
                </span>
              )}
          </div>
        </div>
      )}

      {/* Going to Gym Card */}
      {post.type === "going_to_gym" && post.content.gym && (
        <div className="mx-4 mb-4 rounded-lg border border-blue-200 bg-blue-50 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-blue-800">
                {post.content.gym.name}
              </h4>
              <p className="text-sm text-blue-600">
                🕐 {post.content.gym.time}
              </p>
            </div>
            {post.content.gym.joinable && <Button size="sm">Join</Button>}
          </div>
        </div>
      )}

      {/* Milestone Badge */}
      {post.type === "milestone" && post.content.milestone && (
        <div className="mx-4 mb-4 flex items-center gap-4 rounded-lg border border-purple-200 bg-purple-50 p-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-purple-100 text-3xl">
            {post.content.milestone.badge?.icon || "🏆"}
          </div>
          <div>
            <h4 className="font-semibold text-purple-800">
              {post.content.milestone.type}
            </h4>
            <p className="text-sm text-purple-600">
              {post.content.milestone.badge?.description}
            </p>
          </div>
        </div>
      )}

      {/* Challenge Complete */}
      {post.type === "challenge_complete" && post.content.challenge && (
        <div className="mx-4 mb-4 rounded-lg border border-amber-200 bg-amber-50 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-2xl">
              {post.content.challenge.position === 1
                ? "🥇"
                : post.content.challenge.position === 2
                  ? "🥈"
                  : "🥉"}
            </div>
            <div>
              <h4 className="font-semibold text-amber-800">
                {post.content.challenge.name}
              </h4>
              <p className="text-sm text-amber-600">
                Finished #{post.content.challenge.position}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Post Actions */}
      <div className="flex items-center justify-between border-t border-gray-100 px-4 py-3">
        <div className="flex gap-4">
          <button
            onClick={onLike}
            className={`flex items-center gap-1.5 text-sm transition-colors ${
              post.isLiked ? "text-red-500" : "text-gray-500 hover:text-red-500"
            }`}
          >
            {post.isLiked ? (
              <HiHeart className="h-5 w-5" />
            ) : (
              <HiOutlineHeart className="h-5 w-5" />
            )}
            {formatNumber(post.likes)}
          </button>
          <button className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-500">
            <HiOutlineChat className="h-5 w-5" />
            {post.comments}
          </button>
        </div>
        <button className="text-gray-500 hover:text-gray-700">
          <HiOutlineShare className="h-5 w-5" />
        </button>
      </div>
    </Card>
  );
}

// Gym Visit Card Component
function GymVisitCard({ visit }: { visit: GymVisit }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 p-3">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-blue-400 to-indigo-500 text-sm font-bold text-white">
          {visit.user.name.charAt(0)}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-gray-900">
            {visit.user.name}
          </p>
          <p className="truncate text-xs text-gray-500">{visit.gym.name}</p>
          <p className="text-xs text-blue-600">{visit.time}</p>
        </div>
      </div>
      {visit.joinable && (
        <Button size="sm" variant="outline">
          Join
        </Button>
      )}
    </div>
  );
}

// Trending Routine Card Component
function TrendingRoutineCard({ routine }: { routine: SharedRoutine }) {
  return (
    <div className="rounded-lg border border-gray-100 bg-gray-50 p-3">
      <div className="flex items-start justify-between">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-gray-900">
            {routine.title}
          </p>
          <p className="text-xs text-gray-500">by @{routine.user.username}</p>
        </div>
        <Badge
          size="sm"
          variant={
            routine.fitnessLevel === "advanced"
              ? "danger"
              : routine.fitnessLevel === "intermediate"
                ? "warning"
                : "success"
          }
        >
          {routine.fitnessLevel}
        </Badge>
      </div>
      <div className="mt-2 flex items-center gap-3 text-xs text-gray-500">
        <span>❤️ {formatNumber(routine.likes)}</span>
        <span>💾 {formatNumber(routine.saves)}</span>
        <span>⏱️ {routine.duration}m</span>
      </div>
    </div>
  );
}
