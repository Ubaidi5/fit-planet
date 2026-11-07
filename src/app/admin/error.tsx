"use client";

import { SegmentError } from "@/components/ui/SegmentError";

/** A failed page keeps the admin navigation around it */
export default function AdminError(props: { error: Error & { digest?: string }; reset: () => void }) {
  return <SegmentError area="admin" {...props} />;
}
