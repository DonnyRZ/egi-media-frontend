"use client";

import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";
import { cn } from "@/shared/lib/cn";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  basePath,
  className,
}: PaginationProps) {
  const t = useTranslations("common");

  if (totalPages <= 1) return null;

  const previousPage = currentPage > 1 ? currentPage - 1 : null;
  const nextPage = currentPage < totalPages ? currentPage + 1 : null;

  function pageHref(page: number) {
    return page <= 1 ? basePath : `${basePath}?page=${page}`;
  }

  return (
    <nav
      aria-label={t("paginationLabel")}
      className={cn("flex items-center justify-between gap-4 border-t border-neutral-200 pt-6", className)}
    >
      {previousPage ? (
        <Link
          className="text-sm font-semibold uppercase tracking-wide text-neutral-600 transition-colors hover:text-accent"
          href={pageHref(previousPage)}
        >
          ← {t("previous")}
        </Link>
      ) : (
        <span aria-hidden="true" className="invisible text-sm">
          ← {t("previous")}
        </span>
      )}

      <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
        {t("pageOf", { current: currentPage, total: totalPages })}
      </p>

      {nextPage ? (
        <Link
          className="text-sm font-semibold uppercase tracking-wide text-neutral-600 transition-colors hover:text-accent"
          href={pageHref(nextPage)}
        >
          {t("next")} →
        </Link>
      ) : (
        <span aria-hidden="true" className="invisible text-sm">
          {t("next")} →
        </span>
      )}
    </nav>
  );
}
