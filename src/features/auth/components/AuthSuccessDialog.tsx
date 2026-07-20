"use client";

import { Button } from "@/shared/components/ui/Button";

interface AuthSuccessDialogProps {
  open: boolean;
  onContinue: () => void;
  title: string;
  body: string;
  confirmLabel: string;
}

export function AuthSuccessDialog({
  open,
  onContinue,
  title,
  body,
  confirmLabel,
}: AuthSuccessDialogProps) {
  if (!open) return null;

  return (
    <div
      aria-labelledby="auth-success-title"
      aria-modal="true"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/45 p-4 backdrop-blur-[2px]"
      role="dialog"
    >
      <div className="w-full max-w-md border border-neutral-200 bg-white p-8 shadow-[0_24px_60px_rgba(15,23,42,0.18)]">
        <div className="mx-auto flex h-12 w-12 items-center justify-center bg-ink text-white">
          <svg
            aria-hidden="true"
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
          >
            <path d="M5 13l4 4L19 7" strokeLinecap="square" strokeLinejoin="miter" />
          </svg>
        </div>

        <h2
          className="mt-5 text-center font-serif text-2xl font-bold text-ink"
          id="auth-success-title"
        >
          {title}
        </h2>
        <p className="mt-2 text-center text-sm leading-6 text-neutral-600">{body}</p>

        <Button
          className="mt-6 w-full rounded-none"
          onClick={onContinue}
          type="button"
        >
          {confirmLabel}
        </Button>
      </div>
    </div>
  );
}
