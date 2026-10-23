"use client";

import dynamic from "next/dynamic";

// The player resumes an in-progress workout from localStorage, so it renders on the client only
export const WorkoutPlayerClient = dynamic(() => import("./WorkoutPlayer").then((m) => m.WorkoutPlayer), {
  ssr: false,
  loading: () => (
    <div className="mx-auto max-w-2xl space-y-3 pt-2">
      <div className="h-16 animate-pulse rounded-3xl bg-gray-900/[0.05]" />
      <div className="h-48 animate-pulse rounded-3xl bg-gray-900/[0.05]" />
      <div className="h-20 animate-pulse rounded-3xl bg-gray-900/[0.05]" />
    </div>
  ),
});
