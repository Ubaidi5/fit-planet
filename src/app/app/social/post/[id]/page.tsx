import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireUser } from "@/server/session";
import { toObjectId } from "@/server/db/collections";
import { getPost, listComments } from "@/server/modules/social";
import { BackLink } from "@/components/routines/BackLink";
import { PostCard } from "@/components/social/PostCard";
import { getRegion } from "@/lib/i18n/server";
import { weightUnitFor } from "@/lib/routines";

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await getTranslations("social"))("postMeta") };
}

export default async function PostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await requireUser(`/app/social/post/${id}`);
  const postId = toObjectId(id);
  const post = postId ? await getPost(user._id, postId) : null;
  if (!post || !postId) notFound();
  const comments = await listComments(user._id, postId);
  const t = await getTranslations("social");

  return (
    <div className="mx-auto max-w-2xl">
      <BackLink href="/app/social" label={t("title")} />
      <div className="mt-3">
        <PostCard post={post} unit={weightUnitFor(await getRegion())} initialComments={comments} />
      </div>
    </div>
  );
}
