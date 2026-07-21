"use client";

import { Button } from "@/features/cms/components/ui/Button";

interface BulkActionsBarProps {
  count: number;
  canPublish: boolean;
  onPublish: () => void;
  onArchive: () => void;
  onDelete: () => void;
  onClear: () => void;
}

export function BulkActionsBar({
  count,
  canPublish,
  onPublish,
  onArchive,
  onDelete,
  onClear,
}: BulkActionsBarProps) {
  if (count === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-3 border-b border-neutral-200 bg-accent/5 px-4 py-3 dark:border-neutral-800">
      <span className="text-sm font-semibold text-neutral-700 dark:text-neutral-200">
        {count} selected
      </span>
      <div className="ml-auto flex flex-wrap gap-2">
        {canPublish ? (
          <>
            <Button size="sm" variant="secondary" onClick={onPublish}>
              Publish
            </Button>
            <Button size="sm" variant="secondary" onClick={onArchive}>
              Archive
            </Button>
          </>
        ) : null}
        <Button size="sm" variant="danger" onClick={onDelete}>
          Delete
        </Button>
        <Button size="sm" variant="ghost" onClick={onClear}>
          Clear
        </Button>
      </div>
    </div>
  );
}
