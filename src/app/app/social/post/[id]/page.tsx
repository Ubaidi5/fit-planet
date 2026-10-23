import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireUser } from "@/server/session";
import { toObjectId } from "@/server/db/collections";
import { getPost, listComments } from "@/server/modules/social";
import { BackLink } from "@/components/routines/BackLink";
import { PostCard } from "@/components/social/PostCard";
import { findRegion } from "@/lib/i18n/regions";
import { weightUnitFor } from "@/lib/routines";

export const metadata: Metadata = { title: "Post" };

export default async function PostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await requireUser(`/app/social/post/${id}`);
  const postId = toObjectId(id);
  const post = postId ? await getPost(user._id, postId) : null;
  if (!post || !postId) notFound();
  const comments = await listComments(user._id, postId);

  return (
    <div className="mx-auto max-w-2xl">
      <BackLink href="/app/social" label="Social" />
      <div className="mt-3">
        <PostCard post={post} unit={weightUnitFor(findRegion(user.regionCode))} initialComments={comments} />
      </div>
    </div>
  );
}
