export type AuditActionTone =
  | "success"
  | "info"
  | "warning"
  | "danger"
  | "neutral";

export const AUDIT_ACTION_TONE: Record<string, AuditActionTone> = {
  create: "success",
  insert: "success",
  published: "success",
  scheduled: "info",
  submitted_for_review: "info",
  update: "info",
  restored: "info",
  reverted_to_draft: "warning",
  archived: "warning",
  status_change: "warning",
  delete: "danger",
  trashed: "danger",
};

export const AUDIT_ACTION_LABEL: Record<string, string> = {
  create: "CREATED",
  insert: "CREATED",
  update: "UPDATED",
  delete: "TRASHED",
  trashed: "TRASHED",
  archived: "ARCHIVED",
  restored: "RESTORED",
  published: "PUBLISHED",
  scheduled: "SCHEDULED",
  submitted_for_review: "SUBMITTED FOR REVIEW",
  reverted_to_draft: "REVERTED TO DRAFT",
  status_change: "CHANGED STATUS",
};

/** Actions shown in the Audit Logs filter select (backend enum values). */
export const AUDIT_ACTION_FILTER_OPTIONS = [
  { value: "CREATE", label: "Created" },
  { value: "UPDATE", label: "Updated" },
  { value: "PUBLISHED", label: "Published" },
  { value: "ARCHIVED", label: "Archived" },
  { value: "RESTORED", label: "Restored" },
  { value: "SCHEDULED", label: "Scheduled" },
  { value: "SUBMITTED_FOR_REVIEW", label: "Submitted for review" },
  { value: "REVERTED_TO_DRAFT", label: "Reverted to draft" },
  { value: "TRASHED", label: "Trashed" },
  { value: "DELETE", label: "Deleted" },
] as const;

export function normalizeAuditAction(
  action: string | null | undefined,
): string {
  return (action ?? "").trim().toLowerCase();
}

export function getAuditActionLabel(
  action: string | null | undefined,
): string {
  const normalized = normalizeAuditAction(action);
  return (
    AUDIT_ACTION_LABEL[normalized] ??
    (action ? action.replace(/_/g, " ") : "CHANGED")
  );
}

export function getAuditActionTone(
  action: string | null | undefined,
): AuditActionTone {
  return AUDIT_ACTION_TONE[normalizeAuditAction(action)] ?? "neutral";
}
