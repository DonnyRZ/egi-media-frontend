"use client";

import { Button } from "@/features/cms/components/ui/Button";
import { StatusBadge } from "@/features/cms/components/ui/Badge";
import { Card, CardBody, CardHeader } from "@/features/cms/components/ui/Card";
import { ALLOWED_STATUS_TRANSITIONS } from "@/features/cms/constants/cms.constants";
import type { ArticleStatus } from "@/features/cms/types/cms.types";

interface ArticleActionBarProps {
  mode: "new" | "edit";
  status: ArticleStatus;
  canPublish: boolean;
  saving: boolean;
  feedback?: { tone: "success" | "error"; message: string } | null;
  onSave: () => void;
  onSubmitReview: () => void;
  onPublish: () => void;
  onSchedule: () => void;
  onArchive: () => void;
}

export function ArticleActionBar({
  mode,
  status,
  canPublish,
  saving,
  feedback,
  onSave,
  onSubmitReview,
  onPublish,
  onSchedule,
  onArchive,
}: ArticleActionBarProps) {
  const transitions =
    mode === "new"
      ? (["review", "scheduled", "published"] as ArticleStatus[])
      : ALLOWED_STATUS_TRANSITIONS[status];

  const show = (target: ArticleStatus) => transitions.includes(target);

  return (
    <Card>
      <CardHeader
        title="Publishing"
        action={mode === "edit" ? <StatusBadge status={status} /> : undefined}
      />
      <CardBody className="space-y-2">
        <Button type="button" className="w-full" variant="secondary" onClick={onSave} loading={saving}>
          {mode === "edit" && status === "published"
            ? "Update article"
            : mode === "edit" && status !== "draft"
              ? "Save changes"
              : "Save draft"}
        </Button>

        {feedback ? (
          <p
            role={feedback.tone === "error" ? "alert" : "status"}
            className={feedback.tone === "error" ? "text-sm text-error" : "text-sm text-emerald-600 dark:text-emerald-400"}
          >
            {feedback.message}
          </p>
        ) : null}

        {show("review") ? (
          <Button type="button" className="w-full" variant="secondary" onClick={onSubmitReview} disabled={saving}>
            Submit for review
          </Button>
        ) : null}

        {show("scheduled") ? (
          <Button type="button" className="w-full" variant="secondary" onClick={onSchedule} disabled={saving}>
            Schedule
          </Button>
        ) : null}

        {canPublish && show("published") ? (
          <Button type="button" className="w-full" onClick={onPublish} disabled={saving}>
            Publish now
          </Button>
        ) : null}

        {show("archived") ? (
          <Button type="button" className="w-full" variant="ghost" onClick={onArchive} disabled={saving}>
            Archive
          </Button>
        ) : null}
      </CardBody>
    </Card>
  );
}
