import type { ReactNode } from "react";

import { cn } from "@/shared/lib/cn";
import { ARTICLE_STATUS_META } from "@/features/cms/constants/cms.constants";
import type { ArticleStatus } from "@/features/cms/types/cms.types";

type Tone = "neutral" | "info" | "warning" | "success" | "muted" | "danger";

const TONES: Record<Tone, string> = {
  neutral:
    "bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-200",
  info: "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  warning:
    "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  success:
    "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  muted:
    "bg-neutral-100 text-neutral-400 dark:bg-neutral-800 dark:text-neutral-500",
  danger: "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300",
};

interface BadgeProps {
  tone?: Tone;
  children: ReactNode;
  className?: string;
}

export function Badge({ tone = "neutral", children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold",
        TONES[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function StatusBadge({ status }: { status: ArticleStatus }) {
  const meta = ARTICLE_STATUS_META[status];
  return <Badge tone={meta.tone}>{meta.label}</Badge>;
}
