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
        <Button className="w-full" variant="secondary" onClick={onSave} loading={saving}>
          Save draft
        </Button>

        {show("review") ? (
          <Button className="w-full" variant="secondary" onClick={onSubmitReview}>
            Submit for review
          </Button>
        ) : null}

        {show("scheduled") ? (
          <Button className="w-full" variant="secondary" onClick={onSchedule}>
            Schedule
          </Button>
        ) : null}

        {canPublish && show("published") ? (
          <Button className="w-full" onClick={onPublish}>
            Publish now
          </Button>
        ) : null}

        {show("archived") ? (
          <Button className="w-full" variant="ghost" onClick={onArchive}>
            Archive
          </Button>
        ) : null}
      </CardBody>
    </Card>
  );
}
