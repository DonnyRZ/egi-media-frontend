import type { ReactNode } from "react";

import { cn } from "@/shared/lib/cn";

export function Spinner({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "inline-block h-5 w-5 animate-spin rounded-full border-2 border-neutral-300 border-t-accent",
        className,
      )}
    />
  );
}

export function LoadingState({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-sm text-neutral-500 dark:text-neutral-400">
      <Spinner />
      <span>{label}</span>
    </div>
  );
}

interface MessageStateProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
}

export function EmptyState({ title, description, icon, action }: MessageStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 px-6 py-16 text-center">
      {icon ? <div className="text-neutral-300 dark:text-neutral-600">{icon}</div> : null}
      <h3 className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
        {title}
      </h3>
      {description ? (
        <p className="max-w-sm text-sm text-neutral-500 dark:text-neutral-400">
          {description}
        </p>
      ) : null}
      {action ? <div className="mt-2">{action}</div> : null}
    </div>
  );
}

export function ErrorState({
  title = "Something went wrong",
  description = "Please try again in a moment.",
  action,
}: Partial<MessageStateProps>) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 px-6 py-16 text-center">
      <h3 className="text-sm font-semibold text-error">{title}</h3>
      <p className="max-w-sm text-sm text-neutral-500 dark:text-neutral-400">
        {description}
      </p>
      {action ? <div className="mt-2">{action}</div> : null}
    </div>
  );
}
