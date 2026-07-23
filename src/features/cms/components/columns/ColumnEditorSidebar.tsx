"use client";

import { Badge } from "@/features/cms/components/ui/Badge";
import { Button } from "@/features/cms/components/ui/Button";
import { Card, CardBody } from "@/features/cms/components/ui/Card";
import { COLUMN_STATUS_META } from "@/features/cms/constants/column.constants";
import type { ColumnDetail } from "@/features/columns/types/column.types";

interface ColumnEditorSidebarProps {
  column: ColumnDetail;
  canModerate: boolean;
  saving: boolean;
  approving: boolean;
  onApprove: () => void;
  onReject: () => void;
}

export function ColumnEditorSidebar({
  column,
  canModerate,
  saving,
  approving,
  onApprove,
  onReject,
}: ColumnEditorSidebarProps) {
  const statusMeta = COLUMN_STATUS_META[column.status];

  return (
    <Card>
      <CardBody className="space-y-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
            Status
          </p>
          <Badge tone={statusMeta.tone} className="mt-1">
            {statusMeta.label}
          </Badge>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
            Contributor
          </p>
          <p className="mt-1 text-sm font-medium text-neutral-900 dark:text-neutral-100">
            {column.author.fullName}
          </p>
          {column.author.email ? (
            <p className="text-xs text-neutral-500">{column.author.email}</p>
          ) : null}
        </div>
        <Button type="submit" className="w-full" loading={saving}>
          Save edits
        </Button>
        {canModerate ? (
          <>
            <Button
              type="button"
              className="w-full"
              loading={approving}
              onClick={onApprove}
            >
              Approve & Publish
            </Button>
            <Button
              type="button"
              variant="danger"
              className="w-full"
              onClick={onReject}
            >
              Reject
            </Button>
          </>
        ) : null}
      </CardBody>
    </Card>
  );
}
