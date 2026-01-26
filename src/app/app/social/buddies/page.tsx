"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import {
  mockWorkoutBuddies,
  mockUsers,
  getStatusColor,
  formatNumber,
  type WorkoutBuddy,
  type User,
} from "@/lib/data/mock-social";

type Tab = "buddies" | "following" | "followers" | "discover";

export default function BuddiesPage() {
  const [activeTab, setActiveTab] = useState<Tab>("buddies");
  const [searchQuery, setSearchQuery] = useState("");
  const [buddies, setBuddies] = useState(mockWorkoutBuddies);

  const filteredBuddies = buddies.filter(
    (buddy) =>
      buddy.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      buddy.username.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const toggleFollow = (buddyId: string) => {
    setBuddies((prev) =>
      prev.map((buddy) =>
        buddy.id === buddyId
          ? { ...buddy, isFollowing: !buddy.isFollowing }
          : buddy,
      ),
    );
  };

  const tabs = [
    {
      key: "buddies",
      label: "Workout Buddies",
      count: buddies.filter((b) => b.isFollowing).length,
    },
    { key: "following", label: "Following", count: 89 },
    { key: "followers", label: "Followers", count: 156 },
    { key: "discover", label: "Discover", count: null },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Friends & Buddies
          </h1>
          <p className="mt-1 text-gray-500">
            Connect with your fitness community
          </p>
        </div>
        <Button>
          <svg
            className="mr-2 h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
            />
          </svg>
          Find Friends
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <Input
          type="text"
          placeholder="Search friends by name or username..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto border-b border-gray-200 pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as Tab)}
            className={`flex shrink-0 items-center gap-2 rounded-t-lg px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? "border-b-2 border-emerald-500 text-emerald-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {tab.label}
            {tab.count !== null && (
              <span
                className={`rounded-full px-2 py-0.5 text-xs ${
                  activeTab === tab.key
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === "buddies" && (
        <div className="space-y-6">
          {/* Currently at Gym */}
          <div>
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
              <span className="flex h-3 w-3 animate-pulse rounded-full bg-emerald-500"></span>
              At the Gym Now
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredBuddies
                .filter((buddy) => buddy.status === "at_gym")
                .map((buddy) => (
                  <BuddyCard
                    key={buddy.id}
                    buddy={buddy}
                    onToggleFollow={() => toggleFollow(buddy.id)}
                  />
                ))}
            </div>
            {filteredBuddies.filter((b) => b.status === "at_gym").length ===
              0 && (
              <Card className="p-6 text-center">
                <p className="text-gray-500">No buddies at the gym right now</p>
              </Card>
            )}
          </div>

          {/* Online */}
          <div>
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
              <span className="flex h-3 w-3 rounded-full bg-blue-500"></span>
              Online
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredBuddies
                .filter((buddy) => buddy.status === "online")
                .map((buddy) => (
                  <BuddyCard
                    key={buddy.id}
                    buddy={buddy}
                    onToggleFollow={() => toggleFollow(buddy.id)}
                  />
                ))}
            </div>
          </div>

          {/* Offline */}
          <div>
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
              <span className="flex h-3 w-3 rounded-full bg-gray-400"></span>
              Offline
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredBuddies
                .filter((buddy) => buddy.status === "offline")
                .map((buddy) => (
                  <BuddyCard
                    key={buddy.id}
                    buddy={buddy}
                    onToggleFollow={() => toggleFollow(buddy.id)}
                  />
                ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "following" && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {mockUsers
            .filter((u) => u.isFollowing)
            .map((user) => (
              <UserCard key={user.id} user={user} />
            ))}
        </div>
      )}

      {activeTab === "followers" && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {mockUsers.map((user) => (
            <UserCard key={user.id} user={user} showFollowBack />
          ))}
        </div>
      )}

      {activeTab === "discover" && (
        <div className="space-y-6">
          {/* Suggested Based on Activity */}
          <div>
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              Suggested for You
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {mockUsers
                .filter((u) => !u.isFollowing)
                .map((user) => (
                  <UserCard key={user.id} user={user} />
                ))}
            </div>
          </div>

          {/* People at Same Gym */}
          <div>
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              People at Your Favorite Gyms
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {mockUsers.slice(0, 3).map((user) => (
                <UserCard
                  key={user.id}
                  user={user}
                  gymContext="FitZone Premium"
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Buddy Card Component
function BuddyCard({
  buddy,
  onToggleFollow,
}: {
  buddy: WorkoutBuddy;
  onToggleFollow: () => void;
}) {
  return (
    <Card className="p-4">
      <div className="flex items-start gap-4">
        {/* Avatar with Status */}
        <div className="relative shrink-0">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-linear-to-br from-emerald-400 to-teal-500 text-xl font-bold text-white">
            {buddy.name.charAt(0)}
          </div>
          <span
            className={`absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-white ${getStatusColor(buddy.status)}`}
          ></span>
        </div>

        {/* Info */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <h3 className="truncate font-semibold text-gray-900">
                {buddy.name}
              </h3>
              <p className="text-sm text-gray-500">@{buddy.username}</p>
            </div>
            <Button
              variant={buddy.isFollowing ? "outline" : "primary"}
              size="sm"
              onClick={onToggleFollow}
            >
              {buddy.isFollowing ? "Following" : "Follow"}
            </Button>
          </div>

          {/* Status Info */}
          <div className="mt-2">
            {buddy.status === "at_gym" && buddy.currentGym && (
              <div className="flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span className="truncate">{buddy.currentGym}</span>
              </div>
            )}
            {buddy.status !== "at_gym" && buddy.lastWorkout && (
              <p className="text-sm text-gray-500">
                Last workout: {buddy.lastWorkout}
              </p>
            )}
          </div>

          {/* Stats */}
          <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <span className="text-orange-500">🔥</span>
              {buddy.workoutStreak} day streak
            </span>
            <span className="flex items-center gap-1">
              <span>👥</span>
              {buddy.mutualFriends} mutual
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      {buddy.status === "at_gym" && (
        <div className="mt-4 flex gap-2">
          <Button variant="outline" size="sm" fullWidth>
            Message
          </Button>
          <Button size="sm" fullWidth>
            Join Workout
          </Button>
        </div>
      )}
    </Card>
  );
}

// User Card Component
function UserCard({
  user,
  showFollowBack,
  gymContext,
}: {
  user: User;
  showFollowBack?: boolean;
  gymContext?: string;
}) {
  const [isFollowing, setIsFollowing] = useState(user.isFollowing);

  return (
    <Card className="p-4">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-emerald-400 to-teal-500 text-xl font-bold text-white">
          {user.name.charAt(0)}
        </div>

        {/* Info */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <h3 className="truncate font-semibold text-gray-900">
                {user.name}
              </h3>
              <p className="text-sm text-gray-500">@{user.username}</p>
            </div>
          </div>

          {/* Bio */}
          <p className="mt-1 line-clamp-2 text-sm text-gray-600">{user.bio}</p>

          {/* Gym Context */}
          {gymContext && (
            <div className="mt-2 flex items-center gap-1 text-xs text-emerald-600">
              <svg
                className="h-3 w-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
              </svg>
              Works out at {gymContext}
            </div>
          )}

          {/* Stats */}
          <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
            <span>{formatNumber(user.stats.workouts)} workouts</span>
            <span>{formatNumber(user.stats.followers)} followers</span>
            <span className="flex items-center gap-1">
              <span className="text-orange-500">🔥</span>
              {user.stats.streak}
            </span>
          </div>

          {/* Badges */}
          {user.badges.length > 0 && (
            <div className="mt-2 flex gap-1">
              {user.badges.slice(0, 3).map((badge) => (
                <span key={badge.id} className="text-lg" title={badge.name}>
                  {badge.icon}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-4 flex gap-2">
        <Button variant="outline" size="sm" fullWidth>
          View Profile
        </Button>
        <Button
          variant={isFollowing ? "outline" : "primary"}
          size="sm"
          fullWidth
          onClick={() => setIsFollowing(!isFollowing)}
        >
          {isFollowing
            ? "Following"
            : showFollowBack
              ? "Follow Back"
              : "Follow"}
        </Button>
      </div>
    </Card>
  );
}
