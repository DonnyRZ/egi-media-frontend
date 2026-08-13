import type { ReactNode } from "react";

import { cn } from "@/shared/lib/cn";
import {
  ARTICLE_PLACEMENT_META,
  ARTICLE_STATUS_META,
} from "@/features/cms/constants/cms.constants";
import type {
  ArticlePlacement,
  ArticleStatus,
  TranslationStatus,
} from "@/features/cms/types/cms.types";

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

const TRANSLATION_STATUS_META: Record<
  TranslationStatus,
  { label: string; tone: Tone }
> = {
  none: { label: "No EN/UZ", tone: "muted" },
  pending: { label: "Translating", tone: "warning" },
  processing: { label: "Translating", tone: "info" },
  ready: { label: "EN+UZ ready", tone: "success" },
  failed: { label: "Translate failed", tone: "danger" },
};

export function TranslationStatusBadge({
  status,
}: {
  status: TranslationStatus;
}) {
  if (status === "none") return null;
  const meta = TRANSLATION_STATUS_META[status];
  return <Badge tone={meta.tone}>{meta.label}</Badge>;
}

export function PlacementBadges({
  placements,
  headlinePosition = null,
}: {
  placements: ArticlePlacement[];
  headlinePosition?: number | null;
}) {
  if (!placements.length) {
    return <span className="text-xs text-neutral-400">—</span>;
  }

  return (
    <div className="flex flex-wrap gap-1">
      {placements.map((placement) => {
        const meta = ARTICLE_PLACEMENT_META[placement];
        const label =
          placement === "headline" && headlinePosition != null
            ? `Headline #${String(headlinePosition).padStart(2, "0")}`
            : meta.shortLabel;
        return (
          <Badge key={placement} tone={meta.tone} className="rounded-md px-2">
            {label}
          </Badge>
        );
      })}
    </div>
  );
}
