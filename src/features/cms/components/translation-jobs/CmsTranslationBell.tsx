"use client";

import { useState } from "react";
import Link from "next/link";

import { Icons } from "@/features/cms/components/ui/Icons";
import { Badge } from "@/features/cms/components/ui/Badge";
import {
  useRetryTranslation,
  useTranslationJobs,
} from "@/features/cms/hooks/useTranslationJobs";
import { useToast } from "@/features/cms/stores/cms-toast.store";
import type {
  TranslationJob,
  TranslationJobStatus,
} from "@/features/cms/types/cms.types";
import { formatRelativeTime } from "@/shared/utils/format";
import { cn } from "@/shared/lib/cn";
import { ApiError } from "@/shared/lib/errors";
import { useOutsideClick } from "@/shared/hooks/useOutsideClick";

const JOB_LABEL: Record<TranslationJobStatus, string> = {
  queued: "Queued",
  processing: "Translating",
  succeeded: "Ready",
  failed: "Failed",
};

const JOB_TONE: Record<
  TranslationJobStatus,
  "neutral" | "info" | "success" | "danger" | "warning"
> = {
  queued: "warning",
  processing: "info",
  succeeded: "success",
  failed: "danger",
};

function JobRow({
  job,
  onRetry,
  retrying,
}: {
  job: TranslationJob;
  onRetry: (job: TranslationJob) => void;
  retrying: boolean;
}) {
  const isActive = job.jobStatus === "queued" || job.jobStatus === "processing";
  const href =
    job.entityType === "column"
      ? `/cms/columns/${job.entityId}`
      : `/cms/articles/${job.entityId}`;
  const kindLabel = job.entityType === "column" ? "Column" : "Article";

  return (
    <li className="border-b border-neutral-100 px-3 py-3 last:border-0 dark:border-neutral-800">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <Link
            href={href}
            className="block truncate text-sm font-medium text-neutral-900 hover:text-accent dark:text-neutral-100"
          >
            {job.entityTitle || job.articleTitle || "Untitled"}
          </Link>
          <p className="mt-0.5 text-[11px] text-neutral-400">
            {kindLabel}
            {" · "}
            {job.targetStatus === "scheduled" ? "Schedule" : "Publish"}
            {" · "}
            {formatRelativeTime(job.createdAt)}
          </p>
        </div>
        <Badge tone={JOB_TONE[job.jobStatus]} className="shrink-0">
          {isActive ? (
            <span className="relative mr-1 inline-flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-current opacity-40" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-current" />
            </span>
          ) : null}
          {JOB_LABEL[job.jobStatus]}
        </Badge>
      </div>

      {isActive ? (
        <div className="mt-2 h-1 overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800">
          <div className="h-full w-2/3 animate-pulse rounded-full bg-accent/70" />
        </div>
      ) : null}

      {job.jobStatus === "failed" ? (
        <div className="mt-2 flex items-center justify-between gap-2">
          <p className="line-clamp-2 text-[11px] text-red-600 dark:text-red-400">
            {job.errorMessage || "Translation failed"}
          </p>
          <button
            type="button"
            disabled={retrying}
            onClick={() => onRetry(job)}
            className="shrink-0 rounded-md bg-accent px-2 py-1 text-[11px] font-semibold text-white hover:bg-accent/90 disabled:opacity-50"
          >
            Retry
          </button>
        </div>
      ) : null}

      {job.jobStatus === "succeeded" ? (
        <p className="mt-1.5 flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400">
          <Icons.check className="h-3.5 w-3.5" />
          EN + UZ ready
        </p>
      ) : null}
    </li>
  );
}

export function CmsTranslationBell() {
  const toast = useToast();
  const { jobs, activeCount, failedCount, isLoading, isError } =
    useTranslationJobs();
  const retry = useRetryTranslation();
  const [open, setOpen] = useState(false);
  const ref = useOutsideClick<HTMLDivElement>(() => setOpen(false));

  const badgeCount = activeCount > 0 ? activeCount : failedCount;
  const badgeLabel = badgeCount > 99 ? "99+" : String(badgeCount);

  async function handleRetry(job: TranslationJob) {
    try {
      await retry.mutateAsync({
        entityType: job.entityType,
        entityId: job.entityId,
      });
      toast.success("Translation restarted — tracking in the bell.");
    } catch (error) {
      toast.error(
        error instanceof ApiError ? error.message : "Retry failed",
      );
    }
  }

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={
          activeCount > 0
            ? `Translation jobs, ${activeCount} in progress`
            : "Translation jobs"
        }
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "relative flex h-9 w-9 items-center justify-center rounded-lg text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-800",
          activeCount > 0 && "text-accent",
        )}
      >
        {activeCount > 0 ? (
          <span className="pointer-events-none absolute inset-0 animate-pulse rounded-lg ring-2 ring-accent/40" />
        ) : null}
        <span className="relative">
          <Icons.bell className="h-[18px] w-[18px]" />
          {activeCount > 0 ? (
            <svg
              className="pointer-events-none absolute -inset-1 h-7 w-7 animate-spin text-accent/50"
              viewBox="0 0 28 28"
              fill="none"
              aria-hidden
            >
              <circle
                cx="14"
                cy="14"
                r="12"
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray="18 56"
                strokeLinecap="round"
              />
            </svg>
          ) : null}
        </span>
        {badgeCount > 0 ? (
          <span
            className={cn(
              "absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-bold leading-none text-white",
              activeCount > 0 ? "bg-accent" : "bg-red-500",
            )}
          >
            {badgeLabel}
          </span>
        ) : null}
      </button>

      {open ? (
        <div
          role="menu"
          className="absolute right-0 top-full z-40 mt-2 w-[min(100vw-2rem,22rem)] overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-lg dark:border-neutral-700 dark:bg-neutral-900"
        >
          <div className="flex items-center justify-between border-b border-neutral-100 px-3 py-2.5 dark:border-neutral-800">
            <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
              Translations
            </p>
            {activeCount > 0 ? (
              <span className="text-[11px] font-medium text-accent">
                {activeCount} in progress
              </span>
            ) : null}
          </div>

          <ul className="max-h-80 overflow-y-auto">
            {isLoading ? (
              <li className="px-3 py-8 text-center text-sm text-neutral-400">
                Loading…
              </li>
            ) : isError ? (
              <li className="px-3 py-8 text-center text-sm text-red-500">
                Could not load jobs
              </li>
            ) : jobs.length === 0 ? (
              <li className="px-3 py-8 text-center text-sm text-neutral-400">
                No translation jobs yet
              </li>
            ) : (
              jobs.map((job) => (
                <JobRow
                  key={job.id}
                  job={job}
                  onRetry={handleRetry}
                  retrying={retry.isPending}
                />
              ))
            )}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
