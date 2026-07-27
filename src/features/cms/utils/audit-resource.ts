/** Friendly labels for audit log resource types. */

export const AUDIT_RESOURCE_TYPE_FILTER_OPTIONS = [
  { value: "Article", label: "Article" },
  { value: "Column", label: "Column" },
  { value: "Video", label: "Video" },
  { value: "Category", label: "Category" },
  { value: "Topic", label: "Topic" },
  { value: "Series", label: "Series" },
  { value: "Tag", label: "Tag" },
  { value: "User", label: "User" },
  { value: "Newsletter", label: "Newsletter" },
] as const;

const TABLE_NAME_TO_RESOURCE: Record<string, string> = {
  articles: "Article",
  columns: "Column",
  youtube_videos: "Video",
  categories: "Category",
  topics: "Topic",
  series: "Series",
  tags: "Tag",
  users: "User",
  newsletters: "Newsletter",
};

export function resolveResourceTypeLabel(
  resourceType: string | null | undefined,
  tableName?: string | null,
): string {
  if (typeof resourceType === "string" && resourceType.trim()) {
    return resourceType.trim();
  }

  const key = (tableName ?? "").trim().toLowerCase();
  if (key && TABLE_NAME_TO_RESOURCE[key]) {
    return TABLE_NAME_TO_RESOURCE[key];
  }

  if (key) {
    return key
      .split("_")
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");
  }

  return "Unknown";
}
