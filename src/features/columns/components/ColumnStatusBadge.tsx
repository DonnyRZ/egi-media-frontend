"use client";

import { useTranslations } from "next-intl";

import type { ColumnStatus } from "@/features/columns/types/column.types";
import { cn } from "@/shared/lib/cn";

const STATUS_STYLES: Record<ColumnStatus, string> = {
  draft: "border-neutral-300 bg-neutral-100 text-neutral-700",
  pending_approval: "border-amber-200 bg-amber-50 text-amber-800",
  rejected: "border-red-200 bg-red-50 text-red-700",
  published: "border-emerald-200 bg-emerald-50 text-emerald-800",
  archived: "border-neutral-300 bg-neutral-50 text-neutral-500",
};

interface ColumnStatusBadgeProps {
  status: ColumnStatus;
}

export function ColumnStatusBadge({ status }: ColumnStatusBadgeProps) {
  const t = useTranslations("columnsPage.status");

  return (
    <span
      className={cn(
        "inline-flex border px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide",
        STATUS_STYLES[status],
      )}
    >
      {t(status)}
    </span>
  );
}
