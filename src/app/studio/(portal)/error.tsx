"use client";

import { SegmentError } from "@/components/ui/SegmentError";

/** A failed page keeps the studio navigation around it */
export default function StudioError(props: { error: Error & { digest?: string }; reset: () => void }) {
  return <SegmentError area="studio" {...props} />;
}
