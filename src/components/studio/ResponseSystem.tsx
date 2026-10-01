"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface PendingReview {
  id: string;
  userName: string;
  userAvatar: string;
  rating: number;
  date: string;
  comment: string;
  urgency: "high" | "medium" | "low";
}

interface ResponseTemplate {
  id: string;
  name: string;
  content: string;
  category: "positive" | "negative" | "neutral";
}

export default function ResponseSystem() {
  const [selectedReview, setSelectedReview] = useState<string | null>(null);
  const [responseText, setResponseText] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");

  const pendingReviews: PendingReview[] = [
    {
      id: "1",
      userName: "Hassan Raza",
      userAvatar: "HR",
      rating: 3,
      date: "2026-01-23",
      comment:
        "Decent gym but gets very crowded in the evening. Sometimes have to wait for equipment.",
      urgency: "medium",
    },
    {
      id: "2",
      userName: "Usman Malik",
      userAvatar: "UM",
      rating: 2,
      date: "2026-01-21",
      comment:
        "Equipment is old and some machines are often out of order. Not worth the price.",
      urgency: "high",
    },
    {
      id: "3",
      userName: "Ali Zafar",
      userAvatar: "AZ",
      rating: 4,
      date: "2026-01-19",
      comment:
        "Good value for money. Equipment is decent and staff is friendly. Could use more cardio machines.",
      urgency: "low",
    },
    {
      id: "4",
      userName: "Maria Khan",
      userAvatar: "MK",
      rating: 5,
      date: "2026-01-27",
      comment:
        "Excellent gym! Just started my membership and I'm already seeing results. Trainers are very supportive.",
      urgency: "low",
    },
    {
      id: "5",
      userName: "Bilal Ahmed",
      userAvatar: "BA",
      rating: 1,
      date: "2026-01-26",
      comment:
        "Very disappointed. Canceled my day pass and staff was rude about the refund process.",
      urgency: "high",
    },
  ];

  const responseTemplates: ResponseTemplate[] = [
    {
      id: "1",
      name: "Thank Positive Reviewer",
      content:
        "Thank you so much for your wonderful feedback! We're thrilled to have you as a member and appreciate your support. Keep up the great work! 💪",
      category: "positive",
    },
    {
      id: "2",
      name: "Address Crowding Concerns",
      content:
        "Thank you for your feedback. We understand peak hours can be busy. We're actively monitoring capacity and considering expanding our space. In the meantime, our off-peak hours (10 AM - 4 PM) offer a quieter experience with full equipment availability.",
      category: "neutral",
    },
    {
      id: "3",
      name: "Equipment Issues Apology",
      content:
        "We sincerely apologize for the equipment issues you experienced. We take maintenance very seriously and are immediately investigating. Our team performs daily inspections, and we'd love to discuss your specific concerns. Please contact us at [contact info].",
      category: "negative",
    },
    {
      id: "4",
      name: "Staff Courtesy Response",
      content:
        "We're deeply sorry to hear about your experience with our staff. This does not reflect our values, and we're taking immediate action to address this. We'd appreciate the opportunity to make this right. Please contact our manager directly.",
      category: "negative",
    },
    {
      id: "5",
      name: "Acknowledge Suggestion",
      content:
        "Thank you for the thoughtful suggestion! We're always looking to improve our facilities based on member feedback. We'll definitely consider adding more cardio equipment in our next expansion.",
      category: "neutral",
    },
    {
      id: "6",
      name: "Welcome New Member",
      content:
        "Welcome to our gym family! We're so happy to have you and thrilled you're already seeing results. Our trainers are here to support you every step of the way. Don't hesitate to reach out if you need anything!",
      category: "positive",
    },
  ];

  const handleTemplateSelect = (templateId: string) => {
    const template = responseTemplates.find((t) => t.id === templateId);
    if (template) {
      setResponseText(template.content);
      setSelectedTemplate(templateId);
    }
  };

  const handleSubmitResponse = (reviewId: string) => {
    console.log("Submitting response:", { reviewId, responseText });
    // Reset form
    setResponseText("");
    setSelectedReview(null);
    setSelectedTemplate("");
  };

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

  const getUrgencyBadge = (urgency: PendingReview["urgency"]) => {
    const badges = {
      high: { label: "High Priority", color: "bg-red-100 text-red-800" },
      medium: {
        label: "Medium Priority",
        color: "bg-orange-100 text-orange-800",
      },
      low: { label: "Low Priority", color: "bg-green-100 text-green-800" },
    };

    return badges[urgency];
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {/* Pending Reviews (Left Column - 2/3 width) */}
      <div className="space-y-4 lg:col-span-2">
        <div className="rounded-3xl border border-gray-900/[0.06] bg-surface p-6 shadow-soft">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Pending Responses ({pendingReviews.length})
            </h3>
            <button className="text-sm font-medium text-emerald-600 hover:text-emerald-700">
              Sort by Urgency
            </button>
          </div>

          <div className="space-y-4">
            {pendingReviews.map((review) => (
              <div
                key={review.id}
                className={cn(
                  "rounded-lg border p-4 transition-all",
                  selectedReview === review.id
                    ? "border-emerald-500 bg-emerald-50"
                    : "border-gray-200 bg-white hover:border-gray-300",
                  review.urgency === "high" && "border-s-4 border-s-red-500",
                )}
              >
                {/* Review Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    {/* Avatar */}
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-600 text-white">
                      <span className="text-sm font-semibold">
                        {review.userAvatar}
                      </span>
                    </div>

                    {/* User Info */}
                    <div>
                      <p className="font-semibold text-gray-900">
                        {review.userName}
                      </p>
                      <div className="mt-1 flex items-center space-x-3">
                        {renderStars(review.rating)}
                        <span className="text-xs text-gray-500">
                          {new Date(review.date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Urgency Badge */}
                  <span
                    className={cn(
                      "inline-flex rounded-full px-3 py-1 text-xs font-semibold",
                      getUrgencyBadge(review.urgency).color,
                    )}
                  >
                    {getUrgencyBadge(review.urgency).label}
                  </span>
                </div>

                {/* Review Comment */}
                <p className="mt-3 text-sm text-gray-700">{review.comment}</p>

                {/* Action Button */}
                <div className="mt-3 flex items-center space-x-2">
                  <button
                    onClick={() => setSelectedReview(review.id)}
                    className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
                  >
                    {selectedReview === review.id ? "✓ Selected" : "Reply Now"}
                  </button>

                  <button className="rounded-full border border-gray-200 bg-surface px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50">
                    Skip
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Response Composer (Right Column - 1/3 width) */}
      <div className="space-y-4">
        {/* Templates */}
        <div className="rounded-3xl border border-gray-900/[0.06] bg-surface p-6 shadow-soft">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">
            Response Templates
          </h3>

          <div className="space-y-2">
            {responseTemplates.map((template) => (
              <button
                key={template.id}
                onClick={() => handleTemplateSelect(template.id)}
                className={cn(
                  "w-full rounded-lg border p-3 text-start text-sm transition-all",
                  selectedTemplate === template.id
                    ? "border-emerald-500 bg-emerald-50"
                    : "border-gray-200 bg-white hover:border-gray-300",
                )}
              >
                <p className="font-semibold text-gray-900">{template.name}</p>
                <p className="mt-1 text-xs text-gray-600">
                  {template.category === "positive" && "👍 Positive"}
                  {template.category === "negative" && "🔧 Address Issue"}
                  {template.category === "neutral" && "💬 Neutral"}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Composer */}
        <div className="rounded-3xl border border-gray-900/[0.06] bg-surface p-6 shadow-soft">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">
            Write Response
          </h3>

          {!selectedReview ? (
            <div className="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
              <p className="text-sm text-gray-600">
                Select a review to respond to
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <textarea
                value={responseText}
                onChange={(e) => setResponseText(e.target.value)}
                placeholder="Type your response here..."
                rows={6}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />

              <div className="flex items-center justify-between text-xs text-gray-600">
                <span>{responseText.length} characters</span>
                <span>
                  {responseText.length < 50
                    ? "⚠️ Too short"
                    : responseText.length > 500
                      ? "⚠️ Too long"
                      : "✓ Good length"}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleSubmitResponse(selectedReview)}
                  disabled={
                    responseText.length < 50 || responseText.length > 500
                  }
                  className="flex-1 rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-gray-300"
                >
                  Submit Response
                </button>

                <button
                  onClick={() => {
                    setSelectedReview(null);
                    setResponseText("");
                    setSelectedTemplate("");
                  }}
                  className="rounded-full border border-gray-200 bg-surface px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Tips */}
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
          <h4 className="mb-2 text-sm font-semibold text-blue-900">
            💡 Response Tips
          </h4>
          <ul className="space-y-1 text-xs text-blue-700">
            <li>• Thank reviewers for their feedback</li>
            <li>• Address concerns professionally</li>
            <li>• Offer solutions when possible</li>
            <li>• Keep responses under 500 characters</li>
            <li>• Respond within 24-48 hours</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
