"use client";

import { useEffect } from "react";

import { Badge } from "@/features/cms/components/ui/Badge";
import type { ViralIssue } from "@/features/cms/types/viral-issue.types";
import { formatAbsoluteDateTime } from "@/shared/utils/format";
import { cn } from "@/shared/lib/cn";

interface ViralIssueDrawerProps {
  issue: ViralIssue | null;
  open: boolean;
  onClose: () => void;
}

export function ViralIssueDrawer({ issue, open, onClose }: ViralIssueDrawerProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <div
      className={cn(
        "fixed inset-0 z-50",
        open ? "pointer-events-auto" : "pointer-events-none",
      )}
      aria-hidden={!open}
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
              Trending issue
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

            <section>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                Version metadata
              </h3>
              <dl className="mt-3 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-lg border border-neutral-200 p-3 dark:border-neutral-800">
                  <dt className="text-xs text-neutral-500">First seen</dt>
                  <dd className="mt-1 font-medium text-neutral-900 dark:text-neutral-100">
                    {formatAbsoluteDateTime(issue.firstSeenAt) || "—"}
                  </dd>
                </div>
                <div className="rounded-lg border border-neutral-200 p-3 dark:border-neutral-800">
                  <dt className="text-xs text-neutral-500">Last developed</dt>
                  <dd className="mt-1 font-medium text-neutral-900 dark:text-neutral-100">
                    {formatAbsoluteDateTime(issue.lastDevelopedAt) || "—"}
                  </dd>
                </div>
                <div className="rounded-lg border border-neutral-200 p-3 dark:border-neutral-800">
                  <dt className="text-xs text-neutral-500">Channels</dt>
                  <dd className="mt-1 font-medium text-neutral-900 dark:text-neutral-100">
                    {issue.mediaCount}
                  </dd>
                </div>
                <div className="rounded-lg border border-neutral-200 p-3 dark:border-neutral-800">
                  <dt className="text-xs text-neutral-500">Articles</dt>
                  <dd className="mt-1 font-medium text-neutral-900 dark:text-neutral-100">
                    {issue.articleCount}
                  </dd>
                </div>
              </dl>
            </section>

            <section>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                Development timeline
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
            </section>

            <section>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                Clustered articles
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
            </section>
          </div>
        ) : null}
      </aside>
    </div>
  );
}
