"use client";

import { useMemo, useState } from "react";

import { CrawledArticleCard } from "@/features/cms/components/news-feed/CrawledArticleCard";
import { MediaSourceTabs } from "@/features/cms/components/news-feed/MediaSourceTabs";
import { PageHeader } from "@/features/cms/components/layout/PageHeader";
import { Card } from "@/features/cms/components/ui/Card";
import { Icons } from "@/features/cms/components/ui/Icons";
import { Input } from "@/features/cms/components/ui/Input";
import { Pagination } from "@/features/cms/components/ui/Pagination";
import {
  EmptyState,
  ErrorState,
  LoadingState,
} from "@/features/cms/components/ui/StateViews";
import {
  NEWS_FEED_PAGE_SIZE,
  type NewsFeedSourceId,
} from "@/features/cms/constants/news-feed.constants";
import { useCrawledArticles } from "@/features/cms/hooks/useCrawledArticles";
import { useDebouncedValue } from "@/features/cms/hooks/useDebouncedValue";

export function NewsFeedView() {
  const [source, setSource] = useState<NewsFeedSourceId>("");
  const [searchInput, setSearchInput] = useState("");
  const [page, setPage] = useState(1);
  const search = useDebouncedValue(searchInput, 300);

  const params = useMemo(
    () => ({
      page,
      limit: NEWS_FEED_PAGE_SIZE,
      source: source || undefined,
      search: search || undefined,
    }),
    [page, source, search],
  );

  const { data, isLoading, isError, error } = useCrawledArticles(params);
  const items = data?.items ?? [];

  return (
    <>
      <PageHeader
        title="News Feed"
        description="Raw scraped articles from external media sources (egi-media-crawl)."
      />

      <div className="mb-4">
        <div className="relative max-w-md">
          <Icons.search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <Input
            className="pl-9"
            placeholder="Search by title…"
            value={searchInput}
            onChange={(event) => {
              setSearchInput(event.target.value);
              setPage(1);
            }}
          />
        </div>
      </div>

      <Card>
        <MediaSourceTabs
          value={source}
          onChange={(next) => {
            setSource(next);
            setPage(1);
          }}
        />

        {isLoading ? (
          <LoadingState />
        ) : isError ? (
          <ErrorState
            title="Crawl API unavailable"
            description={
              error instanceof Error
                ? error.message
                : "Could not reach the crawl API. Is npm run api running on port 5050?"
            }
          />
        ) : items.length === 0 ? (
          <EmptyState
            title="No crawled articles"
            description="Run fixture crawls in egi-media-crawl (npm run crawl:once -- --source=detik) then refresh."
          />
        ) : (
          <div className="grid gap-6 p-5 sm:grid-cols-2 xl:grid-cols-3">
            {items.map((article) => (
              <CrawledArticleCard key={article.id} article={article} />
            ))}
          </div>
        )}

        <Pagination
          page={data?.page ?? 1}
          totalPages={Math.max(1, data?.totalPages ?? 1)}
          total={data?.total ?? 0}
          onPageChange={setPage}
        />
      </Card>
    </>
  );
}
