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

export function LoadingState({
  label = "Loading…",
  compact = false,
}: {
  label?: string;
  compact?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-sm text-neutral-500 dark:text-neutral-400",
        compact ? "gap-2 py-5" : "gap-3 py-16",
      )}
    >
      <Spinner className={compact ? "h-4 w-4" : undefined} />
      <span className={compact ? "text-xs" : undefined}>{label}</span>
    </div>
  );
}

interface MessageStateProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
  compact?: boolean;
}

export function EmptyState({
  title,
  description,
  icon,
  action,
  compact = false,
}: MessageStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center",
        compact ? "gap-1 px-4 py-5" : "gap-2 px-6 py-16",
      )}
    >
      {icon ? (
        <div
          className={cn(
            "text-neutral-300 dark:text-neutral-600",
            compact && "opacity-80",
          )}
        >
          {icon}
        </div>
      ) : null}
      <h3
        className={cn(
          "font-semibold text-neutral-800 dark:text-neutral-200",
          compact ? "text-xs" : "text-sm",
        )}
      >
        {title}
      </h3>
      {description ? (
        <p
          className={cn(
            "max-w-sm text-neutral-500 dark:text-neutral-400",
            compact ? "text-[11px] leading-snug" : "text-sm",
          )}
        >
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
