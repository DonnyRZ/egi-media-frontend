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
      {issues.map((issue) => {
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
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                {issue.title}
              </p>
              <p className="mt-0.5 text-xs text-neutral-500">
                {issue.articleCount} articles · cross-media coverage
              </p>
            </div>
            <Badge tone="warning" className="shrink-0">
              {issue.mediaCount} channels
            </Badge>
          </button>
        );
      })}
    </div>
  );
}
