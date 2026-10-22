"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  HiCheckCircle,
  HiOutlineCamera,
  HiOutlineKey,
  HiOutlineVideoCameraSlash,
  HiXCircle,
} from "react-icons/hi2";
import { cn } from "@/lib/utils";
import { checkInAction, markDeskPaidAction } from "@/actions/studio";
import type { CheckinOutcome } from "@/server/modules/checkins";
import { passMeta } from "@/lib/passes";
import { formatDate } from "@/lib/dates";
import { useLocale } from "@/lib/i18n/LocaleProvider";

type CameraState = "idle" | "starting" | "scanning" | "denied" | "unsupported";

/**
 * Front desk scanner. Uses the camera with jsQR (works on iOS Safari too)
 * and falls back to typing the pass code.
 */
export function CheckinDesk() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const frameRef = useRef<number>(0);
  const busyRef = useRef(false);
  const lastCodeRef = useRef<{ code: string; at: number } | null>(null);

  const [camera, setCamera] = useState<CameraState>("idle");
  const [code, setCode] = useState("");
  const [result, setResult] = useState<CheckinOutcome | null>(null);
  const [pending, startTransition] = useTransition();
  const [paid, setPaid] = useState(false);
  const router = useRouter();
  const { money } = useLocale();

  const submit = useCallback(
    (value: string, method: "qr" | "code") => {
      if (busyRef.current) return;
      busyRef.current = true;
      setPaid(false);
      startTransition(async () => {
        const outcome = await checkInAction(value, method);
        setResult(outcome);
        busyRef.current = false;
        if (navigator.vibrate) navigator.vibrate(outcome.ok ? 60 : [40, 60, 40]);
        if (outcome.ok) {
          setCode("");
          router.refresh();
        }
      });
    },
    [router],
  );

  const stopCamera = useCallback(() => {
    cancelAnimationFrame(frameRef.current);
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setCamera((c) => (c === "scanning" || c === "starting" ? "idle" : c));
  }, []);

  const startCamera = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setCamera("unsupported");
      return;
    }
    setCamera("starting");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" }, audio: false });
      streamRef.current = stream;
      const video = videoRef.current!;
      video.srcObject = stream;
      await video.play();
      setCamera("scanning");
      const { default: jsQR } = await import("jsqr");

      const tick = () => {
        const canvas = canvasRef.current;
        if (!canvas || !streamRef.current) return;
        if (video.readyState === video.HAVE_ENOUGH_DATA) {
          const size = Math.min(video.videoWidth, video.videoHeight);
          canvas.width = 480;
          canvas.height = 480;
          const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
          ctx.drawImage(video, (video.videoWidth - size) / 2, (video.videoHeight - size) / 2, size, size, 0, 0, 480, 480);
          const found = jsQR(ctx.getImageData(0, 0, 480, 480).data, 480, 480, { inversionAttempts: "dontInvert" });
          const now = Date.now();
          const last = lastCodeRef.current;
          if (found?.data && !(last && last.code === found.data && now - last.at < 4000)) {
            lastCodeRef.current = { code: found.data, at: now };
            submit(found.data, "qr");
          }
        }
        frameRef.current = requestAnimationFrame(tick);
      };
      frameRef.current = requestAnimationFrame(tick);
    } catch {
      setCamera("denied");
    }
  }, [submit]);

  useEffect(() => stopCamera, [stopCamera]);

  const booking = result?.booking;

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_24rem] lg:items-start">
      <div className="space-y-4">
        {/* Camera */}
        <div className="relative aspect-square overflow-hidden rounded-[2rem] bg-ink shadow-lift sm:aspect-[4/3]">
          <video ref={videoRef} playsInline muted className={cn("size-full object-cover", camera !== "scanning" && "opacity-0")} />
          <canvas ref={canvasRef} className="hidden" />
          {camera === "scanning" ? (
            <>
              <div aria-hidden="true" className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <div className="relative size-[62%] max-w-72 rounded-[1.75rem] shadow-[0_0_0_9999px_oklch(0.25_0.06_265/0.45)]">
                  {["top-0 start-0 border-t-4 border-s-4 rounded-ss-[1.75rem]", "top-0 end-0 border-t-4 border-e-4 rounded-se-[1.75rem]", "bottom-0 start-0 border-b-4 border-s-4 rounded-es-[1.75rem]", "bottom-0 end-0 border-b-4 border-e-4 rounded-ee-[1.75rem]"].map((c) => (
                    <span key={c} className={cn("absolute size-10 border-volt", c)} />
                  ))}
                  <span className="absolute inset-x-4 top-4 h-[calc(100%_-_2rem)] animate-scan">
                    <span className="block h-0.5 w-full bg-volt shadow-[0_0_14px_2px] shadow-volt/70" />
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={stopCamera}
                className="absolute bottom-4 start-1/2 h-10 -translate-x-1/2 cursor-pointer rounded-full bg-surface/90 px-4 text-sm font-semibold text-ink backdrop-blur rtl:translate-x-1/2"
              >
                Stop camera
              </button>
            </>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-white">
              {camera === "denied" || camera === "unsupported" ? (
                <>
                  <HiOutlineVideoCameraSlash className="size-10 text-white/60" />
                  <p className="mt-3 font-semibold">{camera === "denied" ? "Camera access was blocked" : "No camera available"}</p>
                  <p className="mt-1 max-w-xs text-sm text-white/60">Allow camera access in your browser settings, or type the pass code below.</p>
                </>
              ) : (
                <>
                  <span className="flex size-16 items-center justify-center rounded-3xl bg-volt text-ink">
                    <HiOutlineCamera className="size-7" />
                  </span>
                  <p className="mt-4 text-lg font-semibold">Scan a member&apos;s pass</p>
                  <p className="mt-1 max-w-xs text-sm text-white/60">Point the camera at the QR code on their phone.</p>
                  <button
                    type="button"
                    onClick={startCamera}
                    disabled={camera === "starting"}
                    className="mt-5 h-12 cursor-pointer rounded-full bg-volt px-6 text-sm font-semibold text-ink transition-[filter] hover:brightness-95 disabled:opacity-60"
                  >
                    {camera === "starting" ? "Starting camera..." : "Start scanning"}
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        {/* Manual code */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (code.trim()) submit(code, "code");
          }}
          className="flex gap-2 rounded-full bg-surface p-1.5 shadow-soft ring-1 ring-gray-900/[0.06]"
        >
          <label className="flex min-w-0 flex-1 items-center gap-2 ps-3">
            <HiOutlineKey className="size-4.5 shrink-0 text-gray-400" />
            <span className="sr-only">Pass code</span>
            <input
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="FP-XXXX-XXXX"
              autoCapitalize="characters"
              autoComplete="off"
              spellCheck={false}
              className="h-11 min-w-0 flex-1 bg-transparent font-mono text-base tracking-[0.1em] text-ink placeholder:text-gray-300 focus:outline-none"
              dir="ltr"
            />
          </label>
          <button type="submit" disabled={pending || !code.trim()} className="h-11 shrink-0 cursor-pointer rounded-full bg-ink px-5 text-sm font-semibold text-white disabled:opacity-40">
            {pending ? "Checking..." : "Check in"}
          </button>
        </form>
      </div>

      {/* Result */}
      <div aria-live="polite" className="lg:sticky lg:top-6">
        {!result ? (
          <div className="rounded-[2rem] border-2 border-dashed border-gray-900/10 p-6 text-center text-sm text-gray-500">
            Scan results show up here, with what to collect if the member pays at the desk.
          </div>
        ) : (
          <div
            key={booking?.id ?? result.ok.toString()}
            className={cn("animate-fade-up overflow-hidden rounded-[2rem] shadow-lift ring-1", result.ok ? "bg-surface ring-emerald-600/20" : "bg-surface ring-red-600/20")}
          >
            <div className={cn("flex items-center gap-3 px-5 py-4", result.ok ? "bg-emerald-600 text-white" : "bg-red-600 text-white")}>
              {result.ok ? <HiCheckCircle className="size-7 shrink-0" /> : <HiXCircle className="size-7 shrink-0" />}
              <div className="min-w-0">
                <p className="text-lg font-semibold">{result.ok ? "Checked in" : "Not valid"}</p>
                <p className="truncate text-sm text-white/80">{result.ok ? (result.firstVisit ? "First visit. Say welcome!" : "Welcome back") : result.reason}</p>
              </div>
            </div>
            {booking && (
              <div className="space-y-4 p-5">
                <div>
                  <p className="text-xl font-semibold tracking-[-0.02em] text-ink">{booking.guest.name}</p>
                  <p className="font-mono text-xs tracking-[0.1em] text-gray-400">{booking.code}</p>
                </div>
                <dl className="grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-2xl bg-canvas px-3 py-2.5">
                    <dt className="text-xs text-gray-500">Pass</dt>
                    <dd className="font-semibold text-ink">{passMeta[booking.passType].label}</dd>
                  </div>
                  <div className="rounded-2xl bg-canvas px-3 py-2.5">
                    <dt className="text-xs text-gray-500">Valid</dt>
                    <dd className="font-semibold text-ink">
                      {booking.startDate === booking.endDate ? formatDate(booking.startDate) : `${formatDate(booking.startDate)} to ${formatDate(booking.endDate)}`}
                    </dd>
                  </div>
                  <div className="rounded-2xl bg-canvas px-3 py-2.5">
                    <dt className="text-xs text-gray-500">Visits</dt>
                    <dd className="font-semibold text-ink tabular-nums">{booking.checkinCount}</dd>
                  </div>
                  <div className="rounded-2xl bg-canvas px-3 py-2.5">
                    <dt className="text-xs text-gray-500">Payment</dt>
                    <dd className="font-semibold text-ink">{booking.paymentStatus === "paid" || paid ? "Paid" : "At desk"}</dd>
                  </div>
                </dl>
                {result.ok && result.collectPayment && !paid && (
                  <div className="rounded-2xl bg-stamp-ochre/10 p-4 ring-1 ring-stamp-ochre/20">
                    <p className="text-sm font-semibold text-stamp-ochre">Collect {money(booking.amount, booking.currency)}</p>
                    <p className="mt-0.5 text-sm text-stamp-ochre/80">This member chose to pay at the desk.</p>
                    <button
                      type="button"
                      onClick={() =>
                        startTransition(async () => {
                          const r = await markDeskPaidAction(booking.id);
                          if (r.ok) setPaid(true);
                        })
                      }
                      className="mt-3 h-10 cursor-pointer rounded-full bg-ink px-4 text-sm font-semibold text-white"
                    >
                      Mark as paid
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
