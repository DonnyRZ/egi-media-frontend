"use client";

import { ARTICLE_STATUS_META } from "@/features/cms/constants/cms.constants";
import { cn } from "@/shared/lib/cn";
import type { ArticleStatus } from "@/features/cms/types/cms.types";

interface ArticleStatusTabsProps {
  value: ArticleStatus | "";
  onChange: (value: ArticleStatus | "") => void;
}

const TABS: { value: ArticleStatus | ""; label: string }[] = [
  { value: "", label: "All" },
  { value: "draft", label: ARTICLE_STATUS_META.draft.label },
  { value: "review", label: ARTICLE_STATUS_META.review.label },
  { value: "scheduled", label: ARTICLE_STATUS_META.scheduled.label },
  { value: "published", label: ARTICLE_STATUS_META.published.label },
  { value: "archived", label: ARTICLE_STATUS_META.archived.label },
];

export function ArticleStatusTabs({ value, onChange }: ArticleStatusTabsProps) {
  return (
    <div
      role="tablist"
      aria-label="Filter articles by status"
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
