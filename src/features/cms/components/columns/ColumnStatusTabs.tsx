"use client";

import { COLUMN_STATUS_META } from "@/features/cms/constants/column.constants";
import { cn } from "@/shared/lib/cn";
import type { ColumnStatus } from "@/features/columns/types/column.types";

export type ColumnStatusFilter = ColumnStatus | "";

interface ColumnStatusTabsProps {
  value: ColumnStatusFilter;
  onChange: (value: ColumnStatusFilter) => void;
}

const TABS: { value: ColumnStatusFilter; label: string }[] = [
  { value: "pending_approval", label: "In Review" },
  { value: "published", label: COLUMN_STATUS_META.published.label },
  { value: "rejected", label: COLUMN_STATUS_META.rejected.label },
  { value: "", label: "All" },
];

export function ColumnStatusTabs({ value, onChange }: ColumnStatusTabsProps) {
  return (
    <div
      role="tablist"
      aria-label="Filter columns by status"
      className="flex gap-1 overflow-x-auto border-b border-neutral-200 px-2 dark:border-neutral-800"
    >
      {TABS.map((tab) => {
        const active = value === tab.value;
        return (
          <button
            key={tab.value || "all"}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(tab.value)}
            className={cn(
              "relative whitespace-nowrap px-3 py-2.5 text-sm font-medium transition-colors",
              active
                ? "text-accent"
                : "text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200",
            )}
          >
            {tab.label}
            {active ? (
              <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-accent" />
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
