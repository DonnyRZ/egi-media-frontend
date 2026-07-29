"use client";

import type { NewsFeedSourceId } from "@/features/cms/constants/news-feed.constants";
import { NEWS_FEED_TABS } from "@/features/cms/constants/news-feed.constants";
import { cn } from "@/shared/lib/cn";

interface MediaSourceTabsProps {
  value: NewsFeedSourceId;
  onChange: (value: NewsFeedSourceId) => void;
}

export function MediaSourceTabs({ value, onChange }: MediaSourceTabsProps) {
  return (
    <div
      role="tablist"
      aria-label="Filter news feed by media source"
      className={cn(
        "flex gap-1 overflow-x-auto border-b border-neutral-200 px-2 dark:border-neutral-800",
        "[-ms-overflow-style:none] [scrollbar-width:none]",
        "[&::-webkit-scrollbar]:hidden",
      )}
    >
      {NEWS_FEED_TABS.map((tab) => {
        const active = value === tab.value;
        return (
          <button
            key={tab.value || "viral"}
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
