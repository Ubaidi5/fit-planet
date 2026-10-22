"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import type { Review } from "@/lib/data/mock-gym-details";
import {
  HiStar,
  HiCheckCircle,
  HiOutlineReply,
  HiOutlineThumbUp,
  HiThumbUp,
} from "react-icons/hi";

interface ReviewCardProps {
  review: Review;
  className?: string;
}

export function ReviewCard({ review, className }: ReviewCardProps) {
  const [showFullComment, setShowFullComment] = useState(false);
  const [helpful, setHelpful] = useState(review.helpful);
  const [hasVoted, setHasVoted] = useState(false);

  const shouldTruncate = review.comment.length > 200;
  const displayComment =
    shouldTruncate && !showFullComment
      ? review.comment.slice(0, 200) + "..."
      : review.comment;

  const handleHelpful = () => {
    if (!hasVoted) {
      setHelpful((prev) => prev + 1);
      setHasVoted(true);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div
      className={cn(
        "bg-surface rounded-3xl border border-gray-900/[0.06] p-5 shadow-soft",
        className,
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-100">
            {review.userAvatar ? (
              <Image
                src={review.userAvatar}
                alt={review.userName}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-500 text-lg font-semibold">
                {review.userName.charAt(0)}
              </div>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-gray-900">{review.userName}</h4>
              {review.isVerified && (
                <span className="inline-flex items-center gap-1 text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                  <HiCheckCircle className="h-3 w-3" />
                  Verified
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500">{formatDate(review.date)}</p>
          </div>
        </div>

        {/* Star Rating */}
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <HiStar
              key={star}
              className={cn(
                "h-5 w-5",
                star <= review.rating ? "text-stamp-ochre" : "text-gray-200",
              )}
            />
          ))}
        </div>
      </div>

      {/* Title & Comment */}
      <div className="mt-4">
        <h5 className="font-semibold text-gray-900 mb-2">{review.title}</h5>
        <p className="text-gray-600 leading-relaxed">{displayComment}</p>
        {shouldTruncate && (
          <button
            onClick={() => setShowFullComment(!showFullComment)}
            className="text-emerald-600 text-sm font-medium mt-1 hover:underline"
          >
            {showFullComment ? "Show less" : "Read more"}
          </button>
        )}
      </div>

      {/* Category Ratings */}
      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
        {Object.entries(review.categories).map(([category, rating]) => (
          <div key={category} className="text-center">
            <div className="text-xs text-gray-500 capitalize mb-1">
              {category}
            </div>
            <div className="flex items-center justify-center gap-1">
              <HiStar className="h-4 w-4 text-stamp-ochre" />
              <span className="text-sm font-medium text-gray-700">
                {rating.toFixed(1)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Review Images */}
      {review.images && review.images.length > 0 && (
        <div className="mt-4 flex gap-2">
          {review.images.map((image, index) => (
            <div
              key={index}
              className="relative w-20 h-20 rounded-lg overflow-hidden"
            >
              <Image
                src={image}
                alt={`Review image ${index + 1}`}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>
      )}

      {/* Gym Response */}
      {review.gymResponse && (
        <div className="mt-4 bg-gray-50 rounded-lg p-4 border-s-4 border-emerald-500">
          <div className="flex items-center gap-2 mb-2">
            <HiOutlineReply className="h-5 w-5 text-emerald-600" />
            <span className="font-semibold text-gray-900 text-sm">
              Response from the gym
            </span>
            <span className="text-xs text-gray-500">
              {formatDate(review.gymResponse.date)}
            </span>
          </div>
          <p className="text-sm text-gray-600">{review.gymResponse.response}</p>
        </div>
      )}

      {/* Helpful Button */}
      <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
        <button
          onClick={handleHelpful}
          className={cn(
            "flex items-center gap-2 text-sm transition-colors",
            hasVoted
              ? "text-emerald-600 cursor-default"
              : "text-gray-500 hover:text-emerald-600",
          )}
          disabled={hasVoted}
        >
          {hasVoted ? (
            <HiThumbUp className="h-4 w-4" />
          ) : (
            <HiOutlineThumbUp className="h-4 w-4" />
          )}
          Helpful ({helpful})
        </button>

        <button className="text-sm text-gray-500 hover:text-gray-700">
          Report
        </button>
      </div>
    </div>
  );
}

// Reviews Summary Component
interface ReviewsSummaryProps {
  rating: number;
  totalReviews: number;
  breakdown: {
    cleanliness: number;
    equipment: number;
    staff: number;
    value: number;
  };
  className?: string;
}

export function ReviewsSummary({
  rating,
  totalReviews,
  breakdown,
  className,
}: ReviewsSummaryProps) {
  // Calculate star distribution (mock data)
  const starDistribution = [
    { stars: 5, percentage: 68 },
    { stars: 4, percentage: 22 },
    { stars: 3, percentage: 7 },
    { stars: 2, percentage: 2 },
    { stars: 1, percentage: 1 },
  ];

  return (
    <div
      className={cn(
        "bg-surface rounded-3xl border border-gray-900/[0.06] p-6 shadow-soft",
        className,
      )}
    >
      <div className="flex flex-col md:flex-row gap-8">
        {/* Overall Rating */}
        <div className="text-center">
          <div className="text-5xl font-semibold tracking-tight text-ink">{rating}</div>
          <div className="flex items-center justify-center gap-1 mt-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <HiStar
                key={star}
                className={cn(
                  "h-5 w-5",
                  star <= Math.round(rating)
                    ? "text-stamp-ochre"
                    : "text-gray-200",
                )}
              />
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Based on {totalReviews} reviews
          </p>
        </div>

        {/* Star Distribution */}
        <div className="flex-1 space-y-2">
          {starDistribution.map(({ stars, percentage }) => (
            <div key={stars} className="flex items-center gap-3">
              <span className="text-sm text-gray-600 w-12">
                {stars} star{stars !== 1 && "s"}
              </span>
              <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-stamp-ochre rounded-full"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="text-sm text-gray-500 w-10">{percentage}%</span>
            </div>
          ))}
        </div>

        {/* Category Breakdown */}
        <div className="grid grid-cols-2 gap-4 md:min-w-[200px]">
          {Object.entries(breakdown).map(([category, score]) => (
            <div key={category}>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 capitalize">
                  {category}
                </span>
                <span className="text-sm font-semibold text-gray-900">
                  {score.toFixed(1)}
                </span>
              </div>
              <div className="mt-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full"
                  style={{ width: `${(score / 5) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
