"use client";

import { useEffect } from "react";

import { Button } from "@/shared/components/ui/Button";
import { useOutsideClick } from "@/shared/hooks/useOutsideClick";
import { cn } from "@/shared/lib/cn";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
  isPending?: boolean;
  tone?: "default" | "danger";
}

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
  isPending = false,
  tone = "default",
}: ConfirmDialogProps) {
  const ref = useOutsideClick<HTMLDivElement>(() => {
    if (!isPending) onCancel();
  });

  useEffect(() => {
    if (!open) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !isPending) onCancel();
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, isPending, onCancel]);

  if (!open) return null;

  return (
    <div
      aria-describedby="confirm-dialog-body"
      aria-labelledby="confirm-dialog-title"
      aria-modal="true"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/45 p-4 backdrop-blur-[2px]"
      role="dialog"
    >
      <div
        ref={ref}
        className="w-full max-w-sm border border-neutral-200 bg-white p-6 shadow-[0_24px_60px_rgba(15,23,42,0.18)]"
      >
        <h2
          className="font-serif text-xl font-bold text-ink"
          id="confirm-dialog-title"
        >
          {title}
        </h2>
        <p
          className="mt-2 text-sm leading-6 text-neutral-600"
          id="confirm-dialog-body"
        >
          {message}
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <Button
            className="rounded-none"
            disabled={isPending}
            onClick={onCancel}
            type="button"
            variant="secondary"
          >
            {cancelLabel}
          </Button>
          <Button
            className={cn(
              "rounded-none",
              tone === "danger" &&
                "bg-error text-white hover:bg-error/90 focus-visible:ring-error",
            )}
            disabled={isPending}
            onClick={onConfirm}
            type="button"
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
