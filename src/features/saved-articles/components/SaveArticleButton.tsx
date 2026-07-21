"use client";

import { useTranslations } from "next-intl";

import { useAuthStore } from "@/features/auth/stores/auth.store";
import { BookmarkIcon } from "@/features/saved-articles/components/BookmarkIcon";
import { useSaveArticle } from "@/features/saved-articles/hooks/useSaveArticle";
import { cn } from "@/shared/lib/cn";

interface SaveArticleButtonProps {
  articleId: string;
}

export function SaveArticleButton({ articleId }: SaveArticleButtonProps) {
  const t = useTranslations("article");
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const { isSaved, isPending, error, toggle, canSave } =
    useSaveArticle(articleId);

  if (!isHydrated || !canSave) return null;

  const label = isPending ? t("saving") : isSaved ? t("saved") : t("save");

  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-neutral-500">
        {t("saveTitle")}
      </p>
      <button
        aria-pressed={isSaved}
        className={cn(
          "mt-3 inline-flex items-center gap-2 border border-neutral-300 bg-white px-3 py-2 text-xs font-semibold uppercase tracking-wide text-neutral-700 transition-colors hover:border-ink hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 disabled:opacity-60",
          isSaved && "border-accent text-accent hover:border-accent hover:text-accent",
        )}
        disabled={isPending}
        onClick={() => void toggle()}
        type="button"
      >
        <BookmarkIcon className="h-4 w-4" filled={isSaved} />
        {label}
      </button>
      {error ? (
        <p className="mt-2 text-xs text-error" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
