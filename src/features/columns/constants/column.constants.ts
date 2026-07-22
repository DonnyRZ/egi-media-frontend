export const COLUMNS_PAGE_LIMIT = 12;

export const MY_COLUMNS_PAGE_LIMIT = 20;

export const COLUMN_EDITABLE_STATUSES = [
  "draft",
  "pending_approval",
  "rejected",
] as const;

export const COLUMN_SUBMITTABLE_STATUSES = ["draft", "rejected"] as const;

export const SAVED_COLUMN_STORAGE_PREFIX = "saved_columns";

export const COLUMN_ALREADY_SAVED_STATUS = 409;

export const COLUMN_NOT_SAVED_STATUS = 404;

export const SAVED_COLUMN_PAGE_LIMIT = 12;

export const SAVED_COLUMN_STALE_TIME_MS = 60 * 1000;

export const COLUMN_COMMENTS_PAGE_LIMIT = 20;
