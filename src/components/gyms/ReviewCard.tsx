"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import type { Review } from "@/lib/data/mock-gym-details";

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
        "bg-white rounded-xl border border-gray-200 p-5",
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
                  <svg
                    className="h-3 w-3"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
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
            <svg
              key={star}
              className={cn(
                "h-5 w-5",
                star <= review.rating ? "text-amber-400" : "text-gray-200",
              )}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
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
              <svg
                className="h-4 w-4 text-amber-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
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
        <div className="mt-4 bg-gray-50 rounded-lg p-4 border-l-4 border-emerald-500">
          <div className="flex items-center gap-2 mb-2">
            <svg
              className="h-5 w-5 text-emerald-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
              />
            </svg>
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
          <svg
            className="h-4 w-4"
            fill={hasVoted ? "currentColor" : "none"}
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
            />
          </svg>
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
        "bg-white rounded-xl border border-gray-200 p-6",
        className,
      )}
    >
      <div className="flex flex-col md:flex-row gap-8">
        {/* Overall Rating */}
        <div className="text-center">
          <div className="text-5xl font-bold text-gray-900">{rating}</div>
          <div className="flex items-center justify-center gap-1 mt-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg
                key={star}
                className={cn(
                  "h-5 w-5",
                  star <= Math.round(rating)
                    ? "text-amber-400"
                    : "text-gray-200",
                )}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
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
                  className="h-full bg-amber-400 rounded-full"
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
