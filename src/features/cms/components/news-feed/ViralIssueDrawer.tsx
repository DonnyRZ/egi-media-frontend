"use client";

import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchRadarDetail } from "@/features/cms/services/viral-issue.service";
import { Pagination } from "@/features/cms/components/ui/Pagination";

import { Badge } from "@/features/cms/components/ui/Badge";
import type { ViralIssue } from "@/features/cms/types/viral-issue.types";
import { formatAbsoluteDateTime } from "@/shared/utils/format";
import { cn } from "@/shared/lib/cn";

interface ViralIssueDrawerProps {
  issue: ViralIssue | null;
  open: boolean;
  onClose: () => void;
  windowHours?: number;
  runId?: string | null;
}

export function ViralIssueDrawer({ issue: selected, open, onClose, windowHours=24, runId }: ViralIssueDrawerProps) {
  const [page,setPage] = useState(1);
  const dialog = useRef<HTMLElement>(null);
  const detail=useQuery({queryKey:["cms","news-feed","radar-detail",selected?.id,windowHours,page,runId],
    queryFn:()=>fetchRadarDetail(selected!.id,windowHours,page,runId),enabled:open && Boolean(selected?.id.startsWith("radar-")),staleTime:60_000});
  const issue=detail.data?.item ?? selected;
  useEffect(()=>{setPage(1);},[selected?.id,runId]);
  useEffect(() => {
    if (!open) return;
    const previous=document.activeElement as HTMLElement | null;
    dialog.current?.querySelector<HTMLButtonElement>("button")?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if(event.key === "Tab") {
        const targets=dialog.current?.querySelectorAll<HTMLElement>('button:not([disabled]),a[href],input,select,[tabindex="0"]');
        if(!targets?.length)return;
        const first=targets[0],last=targets[targets.length-1];
        if(event.shiftKey && document.activeElement===first){event.preventDefault();last.focus();}
        else if(!event.shiftKey && document.activeElement===last){event.preventDefault();first.focus();}
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {document.removeEventListener("keydown", onKey);previous?.focus();};
  }, [open, onClose]);

  return (
    <div
      className={cn(
        "fixed inset-0 z-50",
        open ? "pointer-events-auto" : "pointer-events-none",
      )}
      aria-hidden={!open}
      inert={!open}
    >
      <button
        type="button"
        aria-label="Close drawer overlay"
        className={cn(
          "absolute inset-0 bg-neutral-900/40 transition-opacity duration-300",
          open ? "opacity-100" : "opacity-0",
        )}
        onClick={onClose}
      />

      <aside
        ref={dialog}
        role="dialog"
        aria-modal="true"
        aria-label={issue ? issue.title : "Issue detail"}
        className={cn(
          "absolute inset-y-0 right-0 flex w-full max-w-lg flex-col border-l border-neutral-200 bg-white shadow-xl transition-transform duration-300 ease-out dark:border-neutral-800 dark:bg-neutral-900",
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex items-start justify-between gap-3 border-b border-neutral-200 px-5 py-4 dark:border-neutral-800">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wide text-accent">
              Radar isu
            </p>
            <h2 className="mt-1 text-xl font-semibold leading-snug text-neutral-900 dark:text-neutral-100">
              {issue?.title ?? "—"}
            </h2>
          </div>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="rounded-md p-1.5 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                d="M6 18L18 6M6 6l12 12"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
              />
            </svg>
          </button>
        </div>

        {issue ? (
          <div className="flex-1 space-y-6 overflow-y-auto px-5 py-5">
            <p className="text-sm leading-6 text-neutral-600 dark:text-neutral-300">
              {issue.summary}
            </p>
            {detail.isError ? <p className="text-sm text-amber-600">Detail belum tersedia. <button onClick={()=>void detail.refetch()} className="underline">Coba lagi</button></p> : null}
            {detail.isFetching ? <p className="text-sm text-neutral-500">Memuat artikel sumber…</p> : null}
            {issue.components ? <section className="text-sm">
              <h3 className="font-semibold">Alasan rekomendasi · skor {issue.score?.toFixed(1)}</h3>
              <p className="mt-1 text-xs text-neutral-500">Keluasan {(issue.components.breadth*100).toFixed(1)} · Momentum {(issue.components.momentum*100).toFixed(1)} · Kebaruan {(issue.components.freshness*100).toFixed(1)} · Bukti {issue.evidenceQuality} · Keyakinan {issue.confidence}</p>
              <ul className="mt-2 list-disc pl-4">{issue.reasons?.map(reason=><li key={reason}>{reason}</li>)}</ul>
            </section> : null}
            {issue.angles?.length ? <section><h3 className="text-sm font-semibold">Sudut pemberitaan</h3>
              <ul className="mt-2 space-y-2 text-sm">{issue.angles.map(angle=><li key={angle.id}>{angle.title} <span className="text-xs text-neutral-500">({angle.articleCount} artikel)</span></li>)}</ul>
            </section> : null}

            <section>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                Cakupan isu
              </h3>
              <dl className="mt-3 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-lg border border-neutral-200 p-3 dark:border-neutral-800">
                  <dt className="text-xs text-neutral-500">Pertama ditemukan</dt>
                  <dd className="mt-1 font-medium text-neutral-900 dark:text-neutral-100">
                    {formatAbsoluteDateTime(issue.firstSeenAt) || "—"}
                  </dd>
                </div>
                <div className="rounded-lg border border-neutral-200 p-3 dark:border-neutral-800">
                  <dt className="text-xs text-neutral-500">Pemberitaan terbaru</dt>
                  <dd className="mt-1 font-medium text-neutral-900 dark:text-neutral-100">
                    {formatAbsoluteDateTime(issue.lastDevelopedAt) || "—"}
                  </dd>
                </div>
                <div className="rounded-lg border border-neutral-200 p-3 dark:border-neutral-800">
                  <dt className="text-xs text-neutral-500">Portal</dt>
                  <dd className="mt-1 font-medium text-neutral-900 dark:text-neutral-100">
                    {issue.mediaCount}
                  </dd>
                </div>
                <div className="rounded-lg border border-neutral-200 p-3 dark:border-neutral-800">
                  <dt className="text-xs text-neutral-500">Artikel sumber</dt>
                  <dd className="mt-1 font-medium text-neutral-900 dark:text-neutral-100">
                    {issue.articleCount}
                  </dd>
                </div>
              </dl>
            </section>

            {issue.timeline.length ? <section>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                Perkembangan
              </h3>
              <ol className="relative mt-3 space-y-4 border-l border-neutral-200 pl-4 dark:border-neutral-700">
                {issue.timeline.map((entry) => (
                  <li key={entry.id} className="relative">
                    <span className="absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full bg-accent" />
                    <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                      {entry.label}
                    </p>
                    <p className="text-xs text-neutral-500">
                      {formatAbsoluteDateTime(entry.at) || "—"}
                    </p>
                    <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                      {entry.detail}
                    </p>
                  </li>
                ))}
              </ol>
            </section> : null}

            <section>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                Artikel sumber
              </h3>
              <ul className="mt-3 space-y-2">
                {issue.articles.map((article) => (
                  <li key={article.id}>
                    <a
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block rounded-lg border border-neutral-200 p-3 transition-colors hover:border-accent/40 hover:bg-neutral-50 dark:border-neutral-800 dark:hover:bg-neutral-800/50"
                    >
                      <div className="flex items-center gap-2">
                        <Badge tone="info">{article.sourceLabel}</Badge>
                        {article.evidenceQuality === "listing_only" ? <Badge tone="warning">metadata resmi</Badge> : null}
                        <span className="text-xs text-neutral-500">
                          {formatAbsoluteDateTime(article.publishedAt) || "—"}
                        </span>
                      </div>
                      <p className="mt-2 text-sm font-medium leading-snug text-neutral-900 dark:text-neutral-100">
                        {article.title}
                      </p>
                    </a>
                  </li>
                ))}
              </ul>
              {detail.data ? <Pagination page={page} total={detail.data.total} totalPages={detail.data.total_pages} onPageChange={setPage} /> : null}
            </section>
          </div>
        ) : null}
      </aside>
    </div>
  );
}
