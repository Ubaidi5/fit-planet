"use client";

import { SegmentError } from "@/components/ui/SegmentError";

/** A failed page keeps the app navigation around it */
export default function AppError(props: { error: Error & { digest?: string }; reset: () => void }) {
  return <SegmentError area="app" {...props} />;
}
