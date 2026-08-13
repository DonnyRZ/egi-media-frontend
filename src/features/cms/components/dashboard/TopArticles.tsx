"use client";

import Link from "next/link";

import { Card, CardHeader } from "@/features/cms/components/ui/Card";
import { Icons } from "@/features/cms/components/ui/Icons";
import {
  EmptyState,
  LoadingState,
} from "@/features/cms/components/ui/StateViews";
import { useTopArticles } from "@/features/cms/hooks/useDashboard";

const TOP_ARTICLES_LIMIT = 5;

export function TopArticles() {
  const { data, isLoading, isError } = useTopArticles(TOP_ARTICLES_LIMIT);
  const articles = (data ?? []).slice(0, TOP_ARTICLES_LIMIT);

  return (
    <Card>
      <CardHeader
        title="Top Articles"
        description="Most viewed published articles"
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
        <LoadingState compact label="Loading…" />
      ) : isError ? (
        <EmptyState
          compact
          icon={<Icons.articles className="h-5 w-5" />}
          title="Unavailable"
          description="Could not load view rankings."
        />
      ) : articles.length === 0 ? (
        <EmptyState
          compact
          icon={<Icons.articles className="h-5 w-5" />}
          title="Unavailable"
          description="No article views yet."
        />
      ) : (
        <ol className="divide-y divide-neutral-100 dark:divide-neutral-800">
          {articles.map((article, index) => (
            <li key={article.id}>
              <Link
                href={`/cms/articles/${article.id}`}
                className="flex items-center gap-3 px-5 py-3 transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-xs font-semibold text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400">
                  {index + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p
                    title={article.title}
                    className="truncate text-sm font-medium text-neutral-900 dark:text-neutral-100"
                  >
                    {article.title}
                  </p>
                  <p className="mt-0.5 text-xs text-neutral-400">
                    {article.viewCount.toLocaleString()} views
                    {article.author.fullName
                      ? ` · ${article.author.fullName}`
                      : ""}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ol>
      )}
    </Card>
  );
}
