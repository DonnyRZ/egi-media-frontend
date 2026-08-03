"use client";

import { useMemo, useState } from "react";

import { CrawledArticleCard } from "@/features/cms/components/news-feed/CrawledArticleCard";
import { MediaSourceTabs } from "@/features/cms/components/news-feed/MediaSourceTabs";
import { ViralIssueDrawer } from "@/features/cms/components/news-feed/ViralIssueDrawer";
import { ViralIssuesList } from "@/features/cms/components/news-feed/ViralIssuesList";
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
import { useViralIssues } from "@/features/cms/hooks/useViralIssues";
import type { ViralIssue } from "@/features/cms/types/viral-issue.types";

export function NewsFeedView() {
  const [source, setSource] = useState<NewsFeedSourceId>("");
  const [windowHours, setWindowHours] = useState(24);
  const [searchInput, setSearchInput] = useState("");
  const [page, setPage] = useState(1);
  const [selectedIssue, setSelectedIssue] = useState<ViralIssue | null>(null);
  const search = useDebouncedValue(searchInput, 300);
  const isViralTab = source === "";

  const params = useMemo(
    () => ({
      page,
      limit: NEWS_FEED_PAGE_SIZE,
      source: source || undefined,
      search: search || undefined,
    }),
    [page, source, search],
  );

  const {
    data: articleData,
    isLoading: articlesLoading,
    isError: articlesError,
    error: articleError,
  } = useCrawledArticles(params, { enabled: !isViralTab });
  const {
    data: viralData,
    isLoading: viralLoading,
    isError: viralError,
    error: viralQueryError,
  } = useViralIssues({ enabled: isViralTab, windowHours });
  const items = articleData?.items ?? [];

  const viralIssues = useMemo(() => {
    const query = search.trim().toLowerCase();
    const issues = viralData?.items ?? [];
    if (!query) return issues;
    return issues.filter((issue) =>
      issue.title.toLowerCase().includes(query),
    );
  }, [search, viralData?.items]);

  return (
    <>
      <PageHeader
        title="News Feed"
        description="Cross-media coverage groups for the selected period. Outlet tabs load scraped articles from egi-media-crawl."
      />

      <div className="mb-4">
        <div className="flex flex-wrap items-center gap-3">
          {isViralTab ? (
            <label className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-300">
              <span>Period</span>
              <select
                className="rounded-md border border-neutral-300 bg-white px-2 py-1.5 text-sm dark:border-neutral-700 dark:bg-neutral-900"
                value={windowHours}
                onChange={(event) => setWindowHours(Number(event.target.value))}
              >
                <option value={24}>24 jam</option>
                <option value={72}>72 jam</option>
                <option value={168}>7 hari</option>
              </select>
            </label>
          ) : null}
          <div className="relative max-w-md">
          <Icons.search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <Input
            className="pl-9"
            placeholder={
              isViralTab ? "Search trending issues…" : "Search by title…"
            }
            value={searchInput}
            onChange={(event) => {
              setSearchInput(event.target.value);
              setPage(1);
            }}
            />
          </div>
        </div>
      </div>

      <Card>
        <MediaSourceTabs
          value={source}
          onChange={(next) => {
            setSource(next);
            setPage(1);
            setSelectedIssue(null);
          }}
        />

        {isViralTab ? (
          viralLoading ? (
            <LoadingState label="Clustering recent articles…" />
          ) : viralError ? (
            <ErrorState
              title="Viral clustering unavailable"
              description={
                viralQueryError instanceof Error
                  ? viralQueryError.message
                  : "Could not load clustered issues from the crawl API."
              }
            />
          ) : viralIssues.length === 0 ? (
            <EmptyState
              title={search ? "No matching issues" : "No viral clusters yet"}
              description={
                search
                  ? "Try another search."
                  : "No related article groups were found in the current 72-hour window."
              }
            />
          ) : (
            <div className="max-h-[calc(100vh-300px)] overflow-y-auto overscroll-contain [scrollbar-color:theme(colors.neutral.300)_transparent] [scrollbar-width:thin] dark:[scrollbar-color:theme(colors.neutral.700)_transparent]">
              <ViralIssuesList
                issues={viralIssues}
                selectedId={selectedIssue?.id ?? null}
                onSelect={setSelectedIssue}
              />
            </div>
          )
        ) : articlesLoading ? (
          <LoadingState />
        ) : articlesError ? (
          <ErrorState
            title="Crawl API unavailable"
            description={
              articleError instanceof Error
                ? articleError.message
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

        {!isViralTab ? (
          <Pagination
            page={articleData?.page ?? 1}
            totalPages={Math.max(1, articleData?.totalPages ?? 1)}
            total={articleData?.total ?? 0}
            onPageChange={setPage}
          />
        ) : null}
      </Card>

      <ViralIssueDrawer
        issue={selectedIssue}
        open={Boolean(selectedIssue)}
        onClose={() => setSelectedIssue(null)}
      />
    </>
  );
}
