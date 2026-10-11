"use client";

import { useState } from "react";
import { useFormatter, useTranslations } from "next-intl";

import { BookmarkIcon } from "@/features/saved-articles/components/BookmarkIcon";
import { useSaveColumn } from "@/features/columns/hooks/useSaveColumn";
import type { ColumnListItem } from "@/features/columns/types/column.types";
import { Link } from "@/i18n/navigation";
import { ArticleImage } from "@/shared/components/common/ArticleImage";
import { ConfirmDialog } from "@/shared/components/ui/ConfirmDialog";
import { DATE_FORMAT } from "@/shared/constants/format.constants";

interface SavedColumnCardProps {
  column: ColumnListItem;
}

export function SavedColumnCard({ column }: SavedColumnCardProps) {
  const t = useTranslations("savedArticlesPage");
  const tDialog = useTranslations("unsaveDialog");
  const format = useFormatter();
  const { isPending, error, remove } = useSaveColumn(column.id);
  const [confirmOpen, setConfirmOpen] = useState(false);

  async function handleConfirm() {
    await remove();
    setConfirmOpen(false);
  }

  const href = `/kolom/${column.slug}`;
  const dateValue = column.savedAt ?? column.publishedAt ?? column.createdAt;

  return (
    <div className="flex h-full flex-col border border-neutral-200 bg-white p-4 transition-shadow hover:shadow-md">
      <article className="group flex flex-1 flex-col">
        <Link className="block" href={href}>
          <div className="relative aspect-[16/9] overflow-hidden bg-neutral-100">
            <ArticleImage
              alt={column.title}
              sizes="(max-width: 768px) 100vw, 33vw"
              src={column.featuredImage}
            />
          </div>
        </Link>
        <div className="flex flex-1 flex-col pt-4">
          <span className="kicker">{t("columnKicker")}</span>
          <h3 className="mt-2 font-serif text-xl font-bold leading-snug text-ink transition-colors group-hover:text-accent">
            <Link href={href}>{column.title}</Link>
          </h3>
          {column.summary ? (
            <p className="mt-2 line-clamp-3 flex-1 text-sm leading-6 text-neutral-600">
              {column.summary}
            </p>
          ) : null}
          <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-neutral-500">
            {t("byAuthor", { name: column.author.fullName })}
          </p>
        </div>
      </article>

      <div className="mt-3 flex items-center justify-between gap-3 border-t border-neutral-100 pt-3">
        {dateValue ? (
          <span className="text-xs text-neutral-500">
            {t("savedOn", {
              date: format.dateTime(new Date(dateValue), DATE_FORMAT),
            })}
          </span>
        ) : (
          <span aria-hidden="true" />
        )}
        <button
          className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-neutral-500 transition-colors hover:text-error focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 disabled:opacity-60"
          disabled={isPending}
          onClick={() => setConfirmOpen(true)}
          type="button"
        >
          <BookmarkIcon className="h-4 w-4" filled />
          {isPending ? t("removing") : t("remove")}
        </button>
      </div>
      {error ? (
        <p className="mt-2 text-xs text-error" role="alert">
          {error}
        </p>
      ) : null}

      <ConfirmDialog
        cancelLabel={tDialog("cancel")}
        confirmLabel={tDialog("confirm")}
        isPending={isPending}
        message={tDialog("columnMessage")}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={() => void handleConfirm()}
        open={confirmOpen}
        title={tDialog("title")}
        tone="danger"
      />
    </div>
  );
}
