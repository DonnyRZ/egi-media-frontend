"use client";

import { cn } from "@/shared/lib/cn";
import { Card } from "@/features/cms/components/ui/Card";
import { useDashboardStats } from "@/features/cms/hooks/useDashboard";
import type { DashboardStats } from "@/features/cms/types/cms.types";

interface StatConfig {
  key: keyof DashboardStats;
  label: string;
  accent: string;
}

const STATS: StatConfig[] = [
  { key: "total", label: "Total Articles", accent: "text-neutral-900 dark:text-neutral-100" },
  { key: "published", label: "Published", accent: "text-emerald-600" },
  { key: "draft", label: "Drafts", accent: "text-neutral-500" },
  { key: "review", label: "In Review", accent: "text-blue-600" },
  { key: "scheduled", label: "Scheduled", accent: "text-amber-600" },
];

export function StatCards() {
  const { data, isLoading } = useDashboardStats();

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
      {STATS.map((stat) => (
        <Card key={stat.key} className="p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
            {stat.label}
          </p>
          {isLoading ? (
            <div className="mt-2 h-8 w-12 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
          ) : (
            <p className={cn("mt-1 font-serif text-3xl font-bold", stat.accent)}>
              {data?.[stat.key] ?? 0}
            </p>
          )}
        </Card>
      ))}
    </div>
  );
}
