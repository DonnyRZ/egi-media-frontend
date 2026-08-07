"use client";

import { useState } from "react";
import { useFormatter, useTranslations } from "next-intl";

import { BookmarkIcon } from "@/features/saved-articles/components/BookmarkIcon";
import { useSaveArticle } from "@/features/saved-articles/hooks/useSaveArticle";
import type { SavedArticle } from "@/features/saved-articles/types/saved-article.types";
import { ArticleCard } from "@/shared/components/common/ArticleCard";
import { ConfirmDialog } from "@/shared/components/ui/ConfirmDialog";
import { DATE_FORMAT } from "@/shared/constants/format.constants";

interface SavedArticleCardProps {
  article: SavedArticle;
}

export function SavedArticleCard({ article }: SavedArticleCardProps) {
  const t = useTranslations("savedArticlesPage");
  const tDialog = useTranslations("unsaveDialog");
  const format = useFormatter();
  const { isPending, error, remove } = useSaveArticle(article.id);
  const [confirmOpen, setConfirmOpen] = useState(false);

  async function handleConfirm() {
    await remove();
    setConfirmOpen(false);
  }

  return (
    <div className="flex h-full flex-col border border-neutral-200 bg-white p-4 transition-shadow hover:shadow-md">
      <ArticleCard article={article} />
      <div className="mt-3 flex items-center justify-between gap-3 border-t border-neutral-100 pt-3">
        {article.savedAt ? (
          <span className="text-xs text-neutral-500">
            {t("savedOn", {
              date: format.dateTime(new Date(article.savedAt), DATE_FORMAT),
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
        message={tDialog("articleMessage")}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={() => void handleConfirm()}
        open={confirmOpen}
        title={tDialog("title")}
        tone="danger"
      />
    </div>
  );
}
