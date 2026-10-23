"use client";

import "@/styles/globals.css";

// Last resort when the root layout itself fails, so translations aren't available here
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body className="bg-canvas font-sans text-ink antialiased">
        <main className="flex min-h-dvh items-center px-4 py-16">
          <div className="mx-auto max-w-md text-center">
            <h1 className="text-[2rem] leading-[1.05] font-semibold tracking-[-0.04em]">Something went wrong</h1>
            <p className="mt-4 text-[17px] leading-relaxed text-gray-500">Fit Planet couldn&apos;t load this page. Please try again in a moment.</p>
            <button
              type="button"
              onClick={reset}
              className="mt-8 h-12 cursor-pointer rounded-full bg-ink px-6 text-[15px] font-semibold text-white transition-colors hover:bg-gray-800"
            >
              Try again
            </button>
            {error.digest && <p className="mt-6 font-mono text-xs text-gray-400">Reference {error.digest}</p>}
          </div>
        </main>
      </body>
    </html>
  );
}
