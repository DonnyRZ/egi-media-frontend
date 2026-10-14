"use client";

import { Badge } from "@/features/cms/components/ui/Badge";
import type { ViralIssue } from "@/features/cms/types/viral-issue.types";
import { cn } from "@/shared/lib/cn";

interface ViralIssuesListProps {
  issues: ViralIssue[];
  selectedId: string | null;
  onSelect: (issue: ViralIssue) => void;
  rankOffset?: number;
}

export function ViralIssuesList({
  issues,
  selectedId,
  onSelect,
  rankOffset = 0,
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
              "grid w-full grid-cols-[2.5rem_minmax(0,1fr)] items-start gap-x-4 gap-y-2 px-5 py-4 text-left transition-colors sm:grid-cols-[2.5rem_minmax(0,1fr)_auto]",
              "hover:bg-neutral-50 dark:hover:bg-neutral-800/60",
              active && "bg-accent/5 dark:bg-accent/10",
            )}
          >
            <div className="flex w-10 shrink-0 flex-col items-center justify-center border-r border-neutral-200 pr-3 dark:border-neutral-800">
              <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-neutral-400">
                Rank
              </span>
              <span className="mt-0.5 text-lg font-bold leading-none text-neutral-700 dark:text-neutral-200">
                {rankOffset + index + 1}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                {issue.title}
              </p>
              {issue.score !== undefined ? <p className="mt-1 text-xs text-neutral-500">Skor {issue.score.toFixed(1)} · {issue.groupCount} kelompok terverifikasi · {issue.trend === "rising" ? "Cakupan bertambah" : issue.trend === "falling" ? "Cakupan menurun" : "Cakupan stabil"} · Bukti {issue.confidence === "high" ? "kuat" : "terbatas"} · {issue.recommendation === "primary" ? "Rekomendasi" : "Kandidat berkembang"}</p> : null}
              {issue.reasons?.[0] ? <p className="mt-1 text-xs text-neutral-500">{issue.reasons[0]}</p> : null}
            </div>
            <div className="col-start-2 flex flex-wrap items-center gap-2 sm:col-start-3">
              <Badge tone="warning">{issue.mediaCount} portal</Badge>
              <Badge tone="info">{issue.articleCount} articles</Badge>
            </div>
          </button>
        );
      })}
    </div>
  );
}
