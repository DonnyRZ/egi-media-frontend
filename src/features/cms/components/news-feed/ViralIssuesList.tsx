"use client";

import { Badge } from "@/features/cms/components/ui/Badge";
import type { ViralIssue } from "@/features/cms/types/viral-issue.types";
import { cn } from "@/shared/lib/cn";

interface ViralIssuesListProps {
  issues: ViralIssue[];
  selectedId: string | null;
  onSelect: (issue: ViralIssue) => void;
}

export function ViralIssuesList({
  issues,
  selectedId,
  onSelect,
}: ViralIssuesListProps) {
  return (
    <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
      {issues.map((issue, index) => {
        const active = selectedId === issue.id;
        return (
          <button
            key={issue.id}
            type="button"
            onClick={() => onSelect(issue)}
            className={cn(
              "flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors",
              "hover:bg-neutral-50 dark:hover:bg-neutral-800/60",
              active && "bg-accent/5 dark:bg-accent/10",
            )}
          >
            <div className="flex w-10 shrink-0 flex-col items-center justify-center border-r border-neutral-200 pr-3 dark:border-neutral-800">
              <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-neutral-400">
                Rank
              </span>
              <span className="mt-0.5 text-lg font-bold leading-none text-neutral-700 dark:text-neutral-200">
                {index + 1}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                {issue.title}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <Badge tone="warning">{issue.mediaCount} channels</Badge>
              <Badge tone="info">{issue.articleCount} articles</Badge>
            </div>
          </button>
        );
      })}
    </div>
  );
}
