"use client";

import Link from "next/link";

import { Badge } from "@/features/cms/components/ui/Badge";
import { Card, CardHeader } from "@/features/cms/components/ui/Card";
import {
  EmptyState,
  LoadingState,
} from "@/features/cms/components/ui/StateViews";
import { useViralIssues } from "@/features/cms/hooks/useViralIssues";

const TOP_ISSUES_LIMIT = 5;

export function TopTrendingIssues() {
  const { data, isLoading, isError } = useViralIssues({ windowHours: 24 });
  const issues = data?.items.slice(0, TOP_ISSUES_LIMIT) ?? [];

  return (
    <Card>
      <CardHeader
        title="Top Trending Issues"
        description="Cross-media coverage in the last 24 hours"
        action={
          <Link
            href="/cms/news-feed"
            className="text-xs font-semibold text-accent hover:underline"
          >
            View all
          </Link>
        }
      />

      {isLoading ? (
        <LoadingState label="Loading trends…" />
      ) : isError ? (
        <EmptyState
          title="Trending unavailable"
          description="Could not load clustering data."
        />
      ) : issues.length === 0 ? (
        <EmptyState title="No trending issues yet" />
      ) : (
        <ol className="divide-y divide-neutral-100 dark:divide-neutral-800">
          {issues.map((issue, index) => (
            <li key={issue.id}>
              <Link
                href="/cms/news-feed"
                className="flex items-center gap-3 px-5 py-3 transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-xs font-semibold text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400">
                  {index + 1}
                </span>
                <p
                  title={issue.title}
                  className="min-w-0 flex-1 truncate text-sm font-medium text-neutral-900 dark:text-neutral-100"
                >
                  {issue.title}
                </p>
                <Badge tone="warning" className="shrink-0">
                  {issue.articleCount} articles
                </Badge>
              </Link>
            </li>
          ))}
        </ol>
      )}
    </Card>
  );
}
