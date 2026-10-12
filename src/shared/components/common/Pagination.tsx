"use client";

import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";
import { cn } from "@/shared/lib/cn";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
  /** When set with pageSize, shows “Showing X–Y of Z …” */
  totalItems?: number;
  pageSize?: number;
  pageParam?: string;
  itemLabel?: "articles" | "videos" | "items";
  className?: string;
}

function getVisiblePages(currentPage: number, totalPages: number): (number | "ellipsis")[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages: (number | "ellipsis")[] = [1];

  if (currentPage > 3) {
    pages.push("ellipsis");
  }

  const start = Math.max(2, currentPage - 1);
  const end = Math.min(totalPages - 1, currentPage + 1);

  for (let page = start; page <= end; page += 1) {
    pages.push(page);
  }

  if (currentPage < totalPages - 2) {
    pages.push("ellipsis");
  }

  pages.push(totalPages);
  return pages;
}

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  basePath,
  pageParam = "page",
  itemLabel = "articles",
  className,
}: PaginationProps) {
  const t = useTranslations("common");
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  const previousPage = currentPage > 1 ? currentPage - 1 : null;
  const nextPage = currentPage < totalPages ? currentPage + 1 : null;
  const showRange =
    typeof totalItems === "number" &&
    totalItems > 0 &&
    typeof pageSize === "number" &&
    pageSize > 0;
  const rangeStart = showRange ? (currentPage - 1) * pageSize + 1 : 0;
  const rangeEnd = showRange ? Math.min(currentPage * pageSize, totalItems) : 0;
  const visiblePages = getVisiblePages(currentPage, totalPages);

  const showingKey =
    itemLabel === "videos"
      ? "showingVideos"
      : itemLabel === "items"
        ? "showingItems"
        : "showingArticles";

  function pageHref(page: number) {
    const params = new URLSearchParams(searchParams.toString());
    if (page <= 1) {
      params.delete(pageParam);
    } else {
      params.set(pageParam, String(page));
    }
    const query = params.toString();
    return query ? `${basePath}?${query}` : basePath;
  }

  const navButtonClass =
    "inline-flex min-h-11 items-center justify-center border border-neutral-200 px-3 text-sm font-semibold uppercase tracking-wide text-neutral-700 transition-colors hover:border-accent hover:text-accent";
  const navButtonDisabledClass =
    "inline-flex min-h-11 cursor-not-allowed items-center justify-center border border-neutral-100 px-3 text-sm font-semibold uppercase tracking-wide text-neutral-300";

  return (
    <nav
      aria-label={t("paginationLabel")}
      className={cn(
        "flex flex-col gap-4 border-t border-neutral-200 pt-6 sm:flex-row sm:items-center sm:justify-between",
        className,
      )}
    >
      {showRange ? (
        <p className="text-sm text-neutral-500">
          {t(showingKey, {
            start: rangeStart,
            end: rangeEnd,
            total: totalItems,
          })}
        </p>
      ) : (
        <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
          {t("pageOf", { current: currentPage, total: totalPages })}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-2">
        {previousPage ? (
          <Link className={navButtonClass} href={pageHref(previousPage)}>
            ← {t("previous")}
          </Link>
        ) : (
          <span className={navButtonDisabledClass}>← {t("previous")}</span>
        )}

        <ul className="flex flex-wrap items-center gap-1">
          {visiblePages.map((page, index) =>
            page === "ellipsis" ? (
              <li
                aria-hidden="true"
                className="px-2 text-sm text-neutral-400"
                key={`ellipsis-${index}`}
              >
                …
              </li>
            ) : (
              <li key={page}>
                <Link
                  aria-current={page === currentPage ? "page" : undefined}
                  className={cn(
                    "inline-flex min-h-11 min-w-11 items-center justify-center border text-sm font-semibold transition-colors",
                    page === currentPage
                      ? "border-ink bg-ink text-white"
                      : "border-neutral-200 text-neutral-700 hover:border-accent hover:text-accent",
                  )}
                  href={pageHref(page)}
                >
                  {page}
                </Link>
              </li>
            ),
          )}
        </ul>

        {nextPage ? (
          <Link className={navButtonClass} href={pageHref(nextPage)}>
            {t("next")} →
          </Link>
        ) : (
          <span className={navButtonDisabledClass}>{t("next")} →</span>
        )}
      </div>
    </nav>
  );
}
