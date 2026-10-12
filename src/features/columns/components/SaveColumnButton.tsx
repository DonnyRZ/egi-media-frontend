"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

import { useAuthStore } from "@/features/auth/stores/auth.store";
import { BookmarkIcon } from "@/features/saved-articles/components/BookmarkIcon";
import { useSaveColumn } from "@/features/columns/hooks/useSaveColumn";
import { ConfirmDialog } from "@/shared/components/ui/ConfirmDialog";
import { cn } from "@/shared/lib/cn";

interface SaveColumnButtonProps {
  columnId: string;
}

export function SaveColumnButton({ columnId }: SaveColumnButtonProps) {
  const t = useTranslations("columnsPage");
  const tDialog = useTranslations("unsaveDialog");
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const { isSaved, isPending, error, toggle, canSave } =
    useSaveColumn(columnId);
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
        aria-pressed={isSaved}
        className={cn(
          "inline-flex min-h-11 items-center gap-2 border border-neutral-300 bg-white px-3 py-2 text-xs font-semibold uppercase tracking-wide text-neutral-700 transition-colors hover:border-ink hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 disabled:opacity-60",
          isSaved &&
            "border-accent text-accent hover:border-accent hover:text-accent",
        )}
        disabled={isPending}
        onClick={handleClick}
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
