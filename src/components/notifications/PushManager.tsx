"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { HiOutlineBellAlert, HiXMark } from "react-icons/hi2";
import { cn } from "@/lib/utils";
import { getPushToken, onForegroundPush, pushSupport, type PushSupport } from "@/lib/firebase/client";
import { registerPushTokenAction } from "@/actions/notifications";
import { useToast } from "./ToastProvider";

const DISMISS_KEY = "fp:push-prompt-dismissed";

async function registerDevice() {
  const token = await getPushToken();
  if (!token) return false;
  await registerPushTokenAction(token, navigator.userAgent);
  return true;
}

/** Permission state plus a function that asks for it and registers this device */
export function usePushStatus() {
  const [status, setStatus] = useState<PushSupport>("unsupported");
  useEffect(() => setStatus(pushSupport()), []);
  const enable = useCallback(async () => {
    try {
      return await registerDevice();
    } catch (error) {
      console.error("[push] enable failed", error);
      return false;
    } finally {
      setStatus(pushSupport());
    }
  }, []);
  return { status, enable };
}

/** Card that asks for push permission in context, with a clear reason */
export function PushPrompt({ title, body, className }: { title: string; body: string; className?: string }) {
  const { status, enable } = usePushStatus();
  const [dismissed, setDismissed] = useState(true);
  const [busy, setBusy] = useState(false);
  const toast = useToast();

  useEffect(() => {
    try {
      setDismissed(localStorage.getItem(DISMISS_KEY) === "1");
    } catch {
      setDismissed(false);
    }
  }, []);

  if (status !== "default" || dismissed) return null;

  const dismiss = () => {
    setDismissed(true);
    try {
      localStorage.setItem(DISMISS_KEY, "1");
    } catch {}
  };

  return (
    <div className={cn("relative overflow-hidden rounded-[1.75rem] bg-ink p-5 text-white shadow-lift", className)}>
      <div aria-hidden="true" className="absolute -top-10 -end-10 size-36 rounded-full bg-volt/25 blur-2xl" />
      <button type="button" onClick={dismiss} aria-label="Not now" className="absolute top-3 end-3 flex size-8 cursor-pointer items-center justify-center rounded-full text-white/60 hover:bg-white/10 hover:text-white">
        <HiXMark className="size-4" />
      </button>
      <span className="relative flex size-10 items-center justify-center rounded-2xl bg-volt text-ink">
        <HiOutlineBellAlert className="size-5" />
      </span>
      <p className="relative mt-4 pe-6 text-base font-semibold tracking-tight">{title}</p>
      <p className="relative mt-1 text-sm leading-relaxed text-white/70">{body}</p>
      <button
        type="button"
        disabled={busy}
        onClick={async () => {
          setBusy(true);
          const ok = await enable();
          setBusy(false);
          if (ok) toast.success("Notifications on", "We'll ping this device when something needs you.");
          else if (pushSupport() === "denied") toast.warning("Notifications are blocked", "Allow them for this site in your browser settings.");
        }}
        className="relative mt-4 inline-flex h-11 cursor-pointer items-center rounded-full bg-volt px-5 text-sm font-semibold text-ink transition-[filter] hover:brightness-95 disabled:opacity-60"
      >
        {busy ? "Turning on..." : "Turn on notifications"}
      </button>
    </div>
  );
}

/** Invisible: keeps registration and foreground toasts working on every page */
export function PushListener() {
  const toast = useToast();
  const router = useRouter();
  useEffect(() => {
    if (pushSupport() !== "granted") return;
    // Tokens rotate; re-register quietly on every visit
    registerDevice().catch(() => undefined);
    let unsubscribe: (() => void) | undefined;
    onForegroundPush((data) => {
      toast.info(data.title ?? "Fit Planet", data.body);
      router.refresh();
    })
      .then((fn) => (unsubscribe = fn))
      .catch(() => undefined);
    return () => unsubscribe?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}
