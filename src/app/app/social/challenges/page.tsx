"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import {
  HiOutlinePlus,
  HiOutlineUserGroup,
  HiOutlineChevronDown,
} from "react-icons/hi";
import {
  mockChallenges,
  getChallengeStatusBadge,
  formatNumber,
  type Challenge,
  type LeaderboardEntry,
} from "@/lib/data/mock-social";

type Tab = "active" | "upcoming" | "completed" | "my_challenges";
type Category = "all" | "community" | "friends" | "gym";

export default function ChallengesPage() {
  const [activeTab, setActiveTab] = useState<Tab>("active");
  const [category, setCategory] = useState<Category>("all");
  const [challenges, setChallenges] = useState(mockChallenges);

  const filteredChallenges = challenges.filter((challenge) => {
    const statusMatch =
      activeTab === "my_challenges"
        ? challenge.isJoined
        : challenge.status === activeTab;
    const categoryMatch = category === "all" || challenge.category === category;
    return statusMatch && categoryMatch;
  });

  const joinChallenge = (challengeId: string) => {
    setChallenges((prev) =>
      prev.map((challenge) =>
        challenge.id === challengeId
          ? {
              ...challenge,
              isJoined: true,
              participants: challenge.participants + 1,
            }
          : challenge,
      ),
    );
  };

  const leaveChallenge = (challengeId: string) => {
    setChallenges((prev) =>
      prev.map((challenge) =>
        challenge.id === challengeId
          ? {
              ...challenge,
              isJoined: false,
              participants: challenge.participants - 1,
            }
          : challenge,
      ),
    );
  };

  const tabs = [
    {
      key: "active",
      label: "Active",
      count: challenges.filter((c) => c.status === "active").length,
    },
    {
      key: "upcoming",
      label: "Upcoming",
      count: challenges.filter((c) => c.status === "upcoming").length,
    },
    {
      key: "completed",
      label: "Completed",
      count: challenges.filter((c) => c.status === "completed").length,
    },
    {
      key: "my_challenges",
      label: "My Challenges",
      count: challenges.filter((c) => c.isJoined).length,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-ink sm:text-3xl tracking-tight">
            Challenges
          </h1>
          <p className="mt-1 text-gray-500">
            Compete, achieve, and earn badges
          </p>
        </div>
        <Button>
          <HiOutlinePlus className="mr-2 h-4 w-4" />
          Create Challenge
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-2xl">
              🏆
            </div>
            <div>
              <p className="text-2xl font-semibold text-ink tracking-tight">12</p>
              <p className="text-sm text-gray-500">Challenges Won</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-2xl">
              🎯
            </div>
            <div>
              <p className="text-2xl font-semibold text-ink tracking-tight">
                {
                  challenges.filter((c) => c.isJoined && c.status === "active")
                    .length
                }
              </p>
              <p className="text-sm text-gray-500">Active Now</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-2xl">
              🎖️
            </div>
            <div>
              <p className="text-2xl font-semibold text-ink tracking-tight">8</p>
              <p className="text-sm text-gray-500">Badges Earned</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-2xl">
              🔥
            </div>
            <div>
              <p className="text-2xl font-semibold text-ink tracking-tight">14</p>
              <p className="text-sm text-gray-500">Day Streak</p>
            </div>
          </div>
        </Card>
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
            <span
              className={`rounded-full px-2 py-0.5 text-xs ${
                activeTab === tab.key
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {[
          { key: "all", label: "All" },
          { key: "community", label: "🌍 Community" },
          { key: "friends", label: "👥 Friends" },
          { key: "gym", label: "🏋️ Gym" },
        ].map((cat) => (
          <button
            key={cat.key}
            onClick={() => setCategory(cat.key as Category)}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              category === cat.key
                ? "bg-gray-900 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Challenges Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {filteredChallenges.map((challenge) => (
          <ChallengeCard
            key={challenge.id}
            challenge={challenge}
            onJoin={() => joinChallenge(challenge.id)}
            onLeave={() => leaveChallenge(challenge.id)}
          />
        ))}
        {filteredChallenges.length === 0 && (
          <div className="col-span-full">
            <Card className="p-12 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-3xl">
                🏆
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                No challenges found
              </h3>
              <p className="mt-1 text-gray-500">
                {activeTab === "my_challenges"
                  ? "You haven't joined any challenges yet"
                  : "No challenges match your current filters"}
              </p>
              <Button className="mt-4">Browse All Challenges</Button>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

// Challenge Card Component
function ChallengeCard({
  challenge,
  onJoin,
  onLeave,
}: {
  challenge: Challenge;
  onJoin: () => void;
  onLeave: () => void;
}) {
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const statusBadge = getChallengeStatusBadge(challenge.status);

  const getChallengeIcon = () => {
    switch (challenge.type) {
      case "steps":
        return "👟";
      case "workouts":
        return "💪";
      case "streak":
        return "🔥";
      case "specific_exercise":
        return "🎯";
      default:
        return "🏆";
    }
  };

  return (
    <Card className="overflow-hidden">
      {/* Header */}
      <div className="border-b border-gray-100 bg-linear-to-r from-emerald-50 to-teal-50 p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-3xl bg-surface text-2xl shadow-soft">
              {getChallengeIcon()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-gray-900">
                  {challenge.name}
                </h3>
                <Badge variant={statusBadge.variant} size="sm">
                  {statusBadge.label}
                </Badge>
              </div>
              <p className="mt-0.5 text-sm text-gray-500">
                {challenge.duration}
              </p>
            </div>
          </div>
          <Badge variant="outline" size="sm">
            {challenge.category === "community" && "🌍"}
            {challenge.category === "friends" && "👥"}
            {challenge.category === "gym" && "🏋️"} {challenge.category}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <p className="text-sm text-gray-600">{challenge.description}</p>

        {/* Progress (if joined and active) */}
        {challenge.isJoined &&
          challenge.status === "active" &&
          challenge.progress !== undefined && (
            <div className="mt-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Your Progress</span>
                <span className="font-medium text-emerald-600">
                  {challenge.currentValue} / {challenge.goal}
                </span>
              </div>
              <div className="mt-2 h-3 overflow-hidden rounded-full bg-gray-200">
                <div
                  className="h-full rounded-full bg-linear-to-r from-emerald-500 to-teal-500 transition-all duration-500"
                  style={{ width: `${Math.min(challenge.progress, 100)}%` }}
                />
              </div>
              <p className="mt-1 text-right text-xs text-gray-500">
                {challenge.progress}% complete
              </p>
            </div>
          )}

        {/* Stats */}
        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-gray-500">
          <span className="flex items-center gap-1">
            <HiOutlineUserGroup className="h-4 w-4" />
            {formatNumber(challenge.participants)} participants
          </span>
          {challenge.prize && (
            <span className="flex items-center gap-1 text-amber-600">
              <span>🎁</span>
              {challenge.prize}
            </span>
          )}
        </div>

        {/* Leaderboard Toggle */}
        {challenge.leaderboard.length > 0 && (
          <button
            onClick={() => setShowLeaderboard(!showLeaderboard)}
            className="mt-4 flex w-full items-center justify-between rounded-lg bg-gray-50 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            <span className="flex items-center gap-2">
              <span>🏅</span> Leaderboard
            </span>
            <HiOutlineChevronDown
              className={`h-4 w-4 transition-transform ${showLeaderboard ? "rotate-180" : ""}`}
            />
          </button>
        )}

        {/* Leaderboard Content */}
        {showLeaderboard && challenge.leaderboard.length > 0 && (
          <div className="mt-3 space-y-2">
            {challenge.leaderboard.map((entry) => (
              <LeaderboardRow key={entry.userId} entry={entry} />
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="border-t border-gray-100 p-4">
        {challenge.isJoined ? (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" fullWidth onClick={onLeave}>
              Leave Challenge
            </Button>
            <Button size="sm" fullWidth>
              View Details
            </Button>
          </div>
        ) : challenge.status === "upcoming" ? (
          <Button fullWidth onClick={onJoin}>
            Join When It Starts
          </Button>
        ) : challenge.status === "active" ? (
          <Button fullWidth onClick={onJoin}>
            Join Challenge
          </Button>
        ) : (
          <Button variant="outline" fullWidth>
            View Results
          </Button>
        )}
      </div>
    </Card>
  );
}

// Leaderboard Row Component
function LeaderboardRow({ entry }: { entry: LeaderboardEntry }) {
  const getRankStyle = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-amber-100 text-amber-700";
      case 2:
        return "bg-gray-200 text-gray-700";
      case 3:
        return "bg-orange-100 text-orange-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return "🥇";
      case 2:
        return "🥈";
      case 3:
        return "🥉";
      default:
        return `#${rank}`;
    }
  };

  return (
    <div
      className={`flex items-center justify-between rounded-lg px-3 py-2 ${
        entry.isCurrentUser
          ? "bg-emerald-50 ring-1 ring-emerald-200"
          : "bg-gray-50"
      }`}
    >
      <div className="flex items-center gap-3">
        <span
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${getRankStyle(entry.rank)}`}
        >
          {entry.rank <= 3 ? getRankIcon(entry.rank) : entry.rank}
        </span>
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-emerald-400 to-teal-500 text-xs font-bold text-white">
            {entry.name.charAt(0)}
          </div>
          <div>
            <p
              className={`text-sm font-medium ${entry.isCurrentUser ? "text-emerald-700" : "text-gray-900"}`}
            >
              {entry.name}
              {entry.isCurrentUser && (
                <span className="ml-1 text-xs">(You)</span>
              )}
            </p>
            <p className="text-xs text-gray-500">@{entry.username}</p>
          </div>
        </div>
      </div>
      <span className="font-semibold text-gray-900">
        {formatNumber(entry.score)}
      </span>
    </div>
  );
}
