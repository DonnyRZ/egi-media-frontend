"use client";

import { cn } from "@/shared/lib/cn";
import { useToastStore, type ToastTone } from "@/features/cms/stores/cms-toast.store";

const TONE_STYLES: Record<ToastTone, string> = {
  success: "border-emerald-200 bg-emerald-50 text-emerald-800",
  error: "border-red-200 bg-red-50 text-red-800",
  info: "border-neutral-200 bg-white text-neutral-800",
};

export function Toaster() {
  const toasts = useToastStore((state) => state.toasts);
  const dismiss = useToastStore((state) => state.dismiss);

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[60] flex w-full max-w-sm flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            "pointer-events-auto flex items-start justify-between gap-3 rounded-lg border px-4 py-3 text-sm shadow-lg",
            TONE_STYLES[toast.tone],
          )}
          role="status"
        >
          <span>{toast.message}</span>
          <button
            aria-label="Dismiss"
            className="opacity-60 transition-opacity hover:opacity-100"
            onClick={() => dismiss(toast.id)}
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
