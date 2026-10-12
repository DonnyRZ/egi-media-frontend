"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

import { useAuthStore } from "@/features/auth/stores/auth.store";
import { ArticleActionIcon } from "@/features/article/components/ArticleActionIcon";
import { useSaveArticle } from "@/features/saved-articles/hooks/useSaveArticle";
import { ConfirmDialog } from "@/shared/components/ui/ConfirmDialog";
import { cn } from "@/shared/lib/cn";

interface SaveArticleButtonProps {
  articleId: string;
}

export function SaveArticleButton({ articleId }: SaveArticleButtonProps) {
  const t = useTranslations("article");
  const tDialog = useTranslations("unsaveDialog");
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const { isSaved, isPending, error, toggle, canSave } =
    useSaveArticle(articleId);
  const [confirmOpen, setConfirmOpen] = useState(false);

  if (!isHydrated || !canSave) return null;

  function handleClick() {
    if (isSaved) {
      setConfirmOpen(true);
      return;
    }
    void toggle();
  }

  async function handleConfirm() {
    await toggle();
    setConfirmOpen(false);
  }

  const label = isPending ? t("saving") : isSaved ? t("saved") : t("save");

  return (
    <div>
      <button
        aria-label={label}
        aria-pressed={isSaved}
        className={cn(
          "inline-flex h-11 w-11 items-center justify-center border border-neutral-300 bg-white p-0 text-neutral-700 transition-colors hover:border-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 disabled:opacity-60",
          isSaved && "border-accent text-accent hover:border-accent hover:text-accent",
        )}
        disabled={isPending}
        onClick={handleClick}
        type="button"
      >
        <ArticleActionIcon name="bookmark" />
      </button>
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
