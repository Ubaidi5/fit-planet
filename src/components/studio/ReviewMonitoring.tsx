"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Input } from "../ui/Input";
import Select from "../ui/Select";

interface Review {
  id: string;
  userName: string;
  userAvatar: string;
  rating: number;
  date: string;
  comment: string;
  hasResponse: boolean;
  responseText?: string;
  category: "cleanliness" | "equipment" | "staff" | "value";
  verified: boolean;
}

export default function ReviewMonitoring() {
  const [filterRating, setFilterRating] = useState<number | "all">("all");
  const [sortBy, setSortBy] = useState<
    "newest" | "oldest" | "highest" | "lowest"
  >("newest");
  const [searchQuery, setSearchQuery] = useState("");

  const reviews: Review[] = [
    {
      id: "1",
      userName: "Ahmed Khan",
      userAvatar: "AK",
      rating: 5,
      date: "2026-01-25",
      comment:
        "Amazing gym! Equipment is top-notch and staff is very helpful. Been coming here for 3 months and love it.",
      hasResponse: true,
      responseText:
        "Thank you Ahmed! We're thrilled to have you as a member. Keep up the great work!",
      category: "equipment",
      verified: true,
    },
    {
      id: "2",
      userName: "Sara Ali",
      userAvatar: "SA",
      rating: 4,
      date: "2026-01-24",
      comment:
        "Great gym overall. Clean facilities and good equipment. Only issue is parking can be difficult during peak hours.",
      hasResponse: true,
      responseText:
        "Thank you for the feedback Sara! We're working on expanding parking options. Please try our off-peak hours for better availability.",
      category: "cleanliness",
      verified: true,
    },
    {
      id: "3",
      userName: "Hassan Raza",
      userAvatar: "HR",
      rating: 3,
      date: "2026-01-23",
      comment:
        "Decent gym but gets very crowded in the evening. Sometimes have to wait for equipment.",
      hasResponse: false,
      category: "value",
      verified: true,
    },
    {
      id: "4",
      userName: "Fatima Sheikh",
      userAvatar: "FS",
      rating: 5,
      date: "2026-01-22",
      comment:
        "Best gym in the area! Love the group classes and the trainers are excellent. Highly recommend!",
      hasResponse: true,
      responseText:
        "Thank you so much Fatima! Our trainers will be happy to hear this. See you in class!",
      category: "staff",
      verified: true,
    },
    {
      id: "5",
      userName: "Usman Malik",
      userAvatar: "UM",
      rating: 2,
      date: "2026-01-21",
      comment:
        "Equipment is old and some machines are often out of order. Not worth the price.",
      hasResponse: false,
      category: "equipment",
      verified: true,
    },
    {
      id: "6",
      userName: "Ayesha Ahmed",
      userAvatar: "AA",
      rating: 5,
      date: "2026-01-20",
      comment:
        "Clean, well-maintained, and friendly staff. The personal training sessions have been incredibly helpful!",
      hasResponse: true,
      responseText:
        "We're so glad you're enjoying the personal training! Thank you for being such a dedicated member.",
      category: "staff",
      verified: true,
    },
    {
      id: "7",
      userName: "Ali Zafar",
      userAvatar: "AZ",
      rating: 4,
      date: "2026-01-19",
      comment:
        "Good value for money. Equipment is decent and staff is friendly. Could use more cardio machines.",
      hasResponse: false,
      category: "value",
      verified: false,
    },
    {
      id: "8",
      userName: "Zainab Khan",
      userAvatar: "ZK",
      rating: 5,
      date: "2026-01-18",
      comment:
        "Absolutely love this gym! Clean locker rooms, great showers, and the sauna is a nice bonus.",
      hasResponse: true,
      responseText:
        "Thank you Zainab! We're happy you're enjoying all our amenities.",
      category: "cleanliness",
      verified: true,
    },
  ];

  const filteredReviews = reviews
    .filter((review) =>
      filterRating === "all" ? true : review.rating === filterRating,
    )
    .filter((review) =>
      searchQuery
        ? review.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          review.comment.toLowerCase().includes(searchQuery.toLowerCase())
        : true,
    )
    .sort((a, b) => {
      if (sortBy === "newest")
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      if (sortBy === "oldest")
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      if (sortBy === "highest") return b.rating - a.rating;
      if (sortBy === "lowest") return a.rating - b.rating;
      return 0;
    });

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={star <= rating ? "text-yellow-400" : "text-gray-300"}
          >
            ⭐
          </span>
        ))}
      </div>
    );
  };

  const getCategoryBadge = (category: Review["category"]) => {
    const badges = {
      cleanliness: { label: "Cleanliness", color: "bg-blue-100 text-blue-800" },
      equipment: { label: "Equipment", color: "bg-purple-100 text-purple-800" },
      staff: { label: "Staff", color: "bg-green-100 text-green-800" },
      value: { label: "Value", color: "bg-orange-100 text-orange-800" },
    };

    return badges[category];
  };

  return (
    <div className="space-y-6">
      {/* Filters and Search */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {/* Search */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Search Reviews
            </label>
            <Input
              type="text"
              placeholder="Search by name or comment..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Filter by Rating */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Filter by Rating
            </label>
            <Select
              value={filterRating}
              onChange={(e) =>
                setFilterRating(
                  e.target.value === "all" ? "all" : Number(e.target.value),
                )
              }
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">All Ratings</option>
              <option value="5">⭐⭐⭐⭐⭐ (5 Stars)</option>
              <option value="4">⭐⭐⭐⭐ (4 Stars)</option>
              <option value="3">⭐⭐⭐ (3 Stars)</option>
              <option value="2">⭐⭐ (2 Stars)</option>
              <option value="1">⭐ (1 Star)</option>
            </Select>
          </div>

          {/* Sort by */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Sort By
            </label>
            <Select
              value={sortBy}
              onChange={(e) =>
                setSortBy(
                  e.target.value as "newest" | "oldest" | "highest" | "lowest",
                )
              }
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="highest">Highest Rating</option>
              <option value="lowest">Lowest Rating</option>
            </Select>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Showing {filteredReviews.length} of {reviews.length} reviews
        </p>

        <button className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-700">
          Export Reviews
        </button>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.length === 0 ? (
          <div className="rounded-lg border border-gray-200 bg-white p-12 text-center shadow-sm">
            <p className="text-gray-600">
              No reviews found matching your filters.
            </p>
          </div>
        ) : (
          filteredReviews.map((review) => (
            <div
              key={review.id}
              className={cn(
                "rounded-lg border bg-white p-6 shadow-sm transition-all",
                !review.hasResponse
                  ? "border-orange-200 bg-orange-50"
                  : "border-gray-200",
              )}
            >
              {/* Review Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  {/* Avatar */}
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600 text-white">
                    <span className="text-lg font-semibold">
                      {review.userAvatar}
                    </span>
                  </div>

                  {/* User Info */}
                  <div>
                    <div className="flex items-center space-x-2">
                      <p className="font-semibold text-gray-900">
                        {review.userName}
                      </p>
                      {review.verified && (
                        <span className="text-blue-500" title="Verified Member">
                          ✓
                        </span>
                      )}
                    </div>
                    <div className="mt-1 flex items-center space-x-3">
                      {renderStars(review.rating)}
                      <span className="text-sm text-gray-500">
                        {new Date(review.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="flex items-center space-x-2">
                  <span
                    className={cn(
                      "inline-flex rounded-full px-3 py-1 text-xs font-semibold",
                      getCategoryBadge(review.category).color,
                    )}
                  >
                    {getCategoryBadge(review.category).label}
                  </span>
                  {!review.hasResponse && (
                    <span className="inline-flex rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-800">
                      Needs Reply
                    </span>
                  )}
                </div>
              </div>

              {/* Review Comment */}
              <p className="mt-4 text-gray-700">{review.comment}</p>

              {/* Response */}
              {review.hasResponse && review.responseText && (
                <div className="mt-4 rounded-lg border-l-4 border-emerald-500 bg-emerald-50 p-4">
                  <p className="text-sm font-semibold text-emerald-900">
                    Your Response:
                  </p>
                  <p className="mt-1 text-sm text-emerald-700">
                    {review.responseText}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-4 flex items-center space-x-3">
                {!review.hasResponse ? (
                  <button className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-700">
                    Reply to Review
                  </button>
                ) : (
                  <button className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50">
                    Edit Response
                  </button>
                )}

                <button className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50">
                  Share Review
                </button>

                {review.rating >= 4 && (
                  <button className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50">
                    Feature on Website
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
