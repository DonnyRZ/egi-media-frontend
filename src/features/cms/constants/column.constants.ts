import type { ColumnStatus } from "@/features/columns/types/column.types";

type ColumnStatusTone =
  | "neutral"
  | "info"
  | "warning"
  | "success"
  | "muted"
  | "danger";

export const COLUMN_STATUS_META: Record<
  ColumnStatus,
  { label: string; tone: ColumnStatusTone }
> = {
  draft: { label: "Draft", tone: "muted" },
  pending_approval: { label: "In Review", tone: "warning" },
  rejected: { label: "Rejected", tone: "danger" },
  published: { label: "Published", tone: "success" },
  archived: { label: "Archived", tone: "muted" },
};

export const CMS_COLUMN_DEFAULT_PAGE_SIZE = 20;
