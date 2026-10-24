"use client";

import { useTranslations } from "next-intl";
import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { HiOutlinePhoto, HiXMark } from "react-icons/hi2";
import { createPostAction } from "@/actions/social";
import { uploadImageAction } from "@/actions/media";
import { useToast } from "@/components/notifications/ToastProvider";
import { Avatar } from "./Avatar";

export function Composer({ me }: { me: { name: string; image: string | null; initials: string } }) {
  const router = useRouter();
  const toast = useToast();
  const t = useTranslations("social.composer");
  const [text, setText] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [pending, startTransition] = useTransition();
  const fileRef = useRef<HTMLInputElement>(null);

  const upload = async (file?: File) => {
    if (!file) return;
    setUploading(true);
    const data = new FormData();
    data.set("file", file);
    data.set("folder", "posts");
    const result = await uploadImageAction(data);
    setUploading(false);
    if (result.ok) setImage(result.data.url);
    else toast.error(t("uploadFailed"), result.error);
  };

  const post = () =>
    startTransition(async () => {
      const result = await createPostAction({ text, imageUrl: image ?? undefined });
      if (!result.ok) return toast.error(t("postFailed"), result.error);
      setText("");
      setImage(null);
      router.refresh();
    });

  return (
    <div className="rounded-[1.75rem] bg-surface p-4 shadow-soft ring-1 ring-gray-900/[0.05] sm:p-5">
      <div className="flex gap-3">
        <Avatar name={me.name} image={me.image} initials={me.initials} />
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          maxLength={1000}
          rows={text ? 3 : 1}
          placeholder={t("placeholder")}
          aria-label={t("aria")}
          className="min-h-10 flex-1 resize-none bg-transparent py-2 text-[15px] text-ink outline-none placeholder:text-gray-400"
        />
      </div>
      {image && (
        <div className="relative mt-3 ms-13">
          <img src={image} alt="" className="max-h-72 w-full rounded-2xl object-cover" />
          <button
            type="button"
            onClick={() => setImage(null)}
            aria-label={t("removePhoto")}
            className="absolute top-2 end-2 flex size-8 cursor-pointer items-center justify-center rounded-full bg-ink/70 text-white"
          >
            <HiXMark className="size-4" />
          </button>
        </div>
      )}
      <div className="mt-3 flex items-center justify-between border-t border-gray-900/[0.06] pt-3">
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="flex h-9 cursor-pointer items-center gap-1.5 rounded-full px-3 text-sm font-medium text-gray-600 hover:bg-gray-900/5 disabled:opacity-50"
        >
          <HiOutlinePhoto className="size-5" />
          {uploading ? t("uploading") : t("photo")}
        </button>
        <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(e) => upload(e.target.files?.[0])} />
        <button
          type="button"
          onClick={post}
          disabled={pending || uploading || (!text.trim() && !image)}
          className="h-9 cursor-pointer rounded-full bg-ink px-5 text-sm font-semibold text-white disabled:opacity-30"
        >
          {pending ? t("posting") : t("post")}
        </button>
      </div>
    </div>
  );
}
