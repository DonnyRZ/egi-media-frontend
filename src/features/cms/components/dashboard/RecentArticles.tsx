"use client";

import Link from "next/link";

import { formatRelativeTime } from "@/shared/utils/format";
import { Card, CardHeader } from "@/features/cms/components/ui/Card";
import { StatusBadge } from "@/features/cms/components/ui/Badge";
import { EmptyState, LoadingState } from "@/features/cms/components/ui/StateViews";
import type { CmsArticleListItem } from "@/features/cms/types/cms.types";

interface RecentArticlesProps {
  title: string;
  items: CmsArticleListItem[] | undefined;
  isLoading: boolean;
  emptyLabel: string;
}

export function RecentArticles({
  title,
  items,
  isLoading,
  emptyLabel,
}: RecentArticlesProps) {
  return (
    <Card>
      <CardHeader
        title={title}
        action={
          <Link
            href="/cms/articles"
            className="text-xs font-semibold text-accent hover:underline"
          >
            View all
          </Link>
        }
      />
      {isLoading ? (
        <LoadingState />
      ) : !items || items.length === 0 ? (
        <EmptyState title={emptyLabel} />
      ) : (
        <ul className="divide-y divide-neutral-100 dark:divide-neutral-800">
          {items.map((article) => (
            <li key={article.id}>
              <Link
                href={`/cms/articles/${article.id}`}
                className="flex items-center justify-between gap-3 px-5 py-3 transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-neutral-900 dark:text-neutral-100">
                    {article.title}
                  </p>
                  <p className="mt-0.5 text-xs text-neutral-400">
                    {formatRelativeTime(
                      article.publishedAt ??
                        article.updatedAt ??
                        article.createdAt,
                    )}
                  </p>
                </div>
                <StatusBadge status={article.status} />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
