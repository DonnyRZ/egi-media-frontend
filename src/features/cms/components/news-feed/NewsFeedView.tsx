"use client";

import { useMemo, useState } from "react";

import { CrawledArticleCard } from "@/features/cms/components/news-feed/CrawledArticleCard";
import { MediaSourceTabs } from "@/features/cms/components/news-feed/MediaSourceTabs";
import { ViralIssueDrawer } from "@/features/cms/components/news-feed/ViralIssueDrawer";
import { ViralIssuesList } from "@/features/cms/components/news-feed/ViralIssuesList";
import { RadarHealth } from "@/features/cms/components/news-feed/RadarHealth";
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
  const [method, setMethod] = useState("default");
  const candidate=method === "candidate";
  const [category, setCategory] = useState("");
  const [trend, setTrend] = useState("");
  const [selectedIssue, setSelectedIssue] = useState<ViralIssue | null>(null);
  const [selectionRunId, setSelectionRunId] = useState<string | null>(null);
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
    refetch: refreshViral,
    isFetching: viralRefreshing,
  } = useViralIssues({ enabled: isViralTab, windowHours, page, search, category, trend, candidate, legacy:method === "legacy" });
  const items = articleData?.items ?? [];

  const viralIssues = viralData?.items ?? [];
  const radarData=viralData?.meta.algorithmVersion === "editorial-radar-v2";
  const stale = viralData?.meta.stale || viralData?.meta.availability === "stale" ||
    Boolean(viralData?.meta.asOf && Date.now() - new Date(viralData.meta.asOf).getTime() > 30*60_000);

  return (
    <>
      <PageHeader
        title="News Feed"
        description="Radar isu: perhatian editorial lintas media dan perkembangan pemberitaan."
      />

      <div className="mb-4">
        <div className="flex flex-wrap items-center gap-3">
          {isViralTab ? (
            <label className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-300">
              <span>Period</span>
              <select
                className="rounded-md border border-neutral-300 bg-white px-2 py-1.5 text-sm dark:border-neutral-700 dark:bg-neutral-900"
                value={windowHours}
                onChange={(event) => { setWindowHours(Number(event.target.value)); setPage(1); setSelectedIssue(null); }}
              >
                <option value={24}>24 jam</option>
                <option value={72}>72 jam</option>
                <option value={168}>7 hari</option>
              </select>
            </label>
          ) : null}
          {isViralTab ? <>
            <label className="flex items-center gap-2 text-sm">Metode
              <select className="rounded border p-2 dark:bg-neutral-900" value={method} onChange={event=>{setMethod(event.target.value);setCategory("");setTrend("");setPage(1);setSelectedIssue(null);}}>
                <option value="default">Utama</option><option value="legacy">Eksisting</option><option value="candidate">Kandidat (evaluasi)</option>
              </select>
            </label>
            {candidate || radarData ? <>
              <select aria-label="Desk radar" className="rounded border p-2 text-sm dark:bg-neutral-900" value={category} onChange={event=>{setCategory(event.target.value);setPage(1);}}>
                <option value="">Semua desk</option><option value="business">Bisnis</option><option value="technology">Teknologi</option><option value="politics">Politik</option><option value="sports">Olahraga</option><option value="entertainment">Hiburan</option><option value="other">Lainnya</option>
              </select>
              <select aria-label="Momentum radar" className="rounded border p-2 text-sm dark:bg-neutral-900" value={trend} onChange={event=>{setTrend(event.target.value);setPage(1);}}>
                <option value="">Semua momentum</option><option value="rising">Bertambah</option><option value="steady">Tetap</option><option value="falling">Menurun</option>
              </select>
            </> : null}
          </> : null}
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

      <RadarHealth enabled={isViralTab} />
      {isViralTab && viralData ? <div className="mb-3 flex flex-wrap items-center gap-2 text-xs text-neutral-500" role="status">
        <span>{radarData && viralData.meta.shadow ? "Kandidat: belum lolos penilaian redaksi" : radarData ? "Radar editorial" : "Metode eksisting"} · {viralData.meta.algorithmVersion} · {stale ? "data kedaluwarsa" : viralData.meta.availability ?? "ready"}</span>
        {viralData.meta.asOf ? <span>Data sampai {new Date(viralData.meta.asOf).toLocaleString()}</span> : null}
        {radarData ? <span>Input {viralData.meta.processedCount ?? 0}/{viralData.meta.eligibleCount ?? 0}</span> : null}
        {viralRefreshing ? <span>Memperbarui…</span> : null}
        {viralError ? <span className="text-amber-600">Refresh gagal; hasil sebelumnya dipertahankan.</span> : null}
        <button type="button" onClick={()=>void refreshViral()} className="min-h-9 px-2 underline">Coba lagi</button>
      </div> : null}

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
          ) : viralError && !viralData ? (
            <div><ErrorState
              title="Viral clustering unavailable"
              description={
                viralQueryError instanceof Error
                  ? viralQueryError.message
                  : "Could not load clustered issues from the crawl API."
              }
            /><button type="button" className="mb-4 ml-5 underline" onClick={()=>void refreshViral()}>Coba lagi</button></div>
          ) : viralIssues.length === 0 ? (
            <EmptyState
              title={search ? "No matching issues" : "No viral clusters yet"}
              description={
                search
                  ? "Try another search."
                  : candidate && viralData?.meta.enabled === false ? "Kandidat belum diaktifkan pada layanan Crawl lokal." : `Tidak ada rekomendasi untuk periode ${windowHours} jam.`
              }
            />
          ) : (
            <div className="max-h-[calc(100vh-300px)] overflow-y-auto overscroll-contain [scrollbar-color:theme(colors.neutral.300)_transparent] [scrollbar-width:thin] dark:[scrollbar-color:theme(colors.neutral.700)_transparent]">
              <ViralIssuesList
                issues={viralIssues}
                selectedId={selectedIssue?.id ?? null}
                onSelect={issue=>{setSelectedIssue(issue);setSelectionRunId(radarData ? viralData?.meta.runId ?? null : null);}}
                rankOffset={(page-1)*20}
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

        {isViralTab ? <Pagination page={viralData?.page ?? page} totalPages={viralData?.totalPages ?? 1} total={viralData?.total ?? 0} onPageChange={setPage} /> : (
          <Pagination
            page={articleData?.page ?? 1}
            totalPages={Math.max(1, articleData?.totalPages ?? 1)}
            total={articleData?.total ?? 0}
            onPageChange={setPage}
          />
        )}
      </Card>

      <ViralIssueDrawer
        issue={selectedIssue}
        open={Boolean(selectedIssue)}
        onClose={() => setSelectedIssue(null)}
        windowHours={windowHours}
        runId={selectionRunId}
      />
    </>
  );
}
