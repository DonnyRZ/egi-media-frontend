interface CanDeleteColumnCommentParams {
  viewerId: string | null | undefined;
  viewerRole: string | null | undefined;
  columnAuthorId: string | null | undefined;
  commentAuthorId: string | null | undefined;
}

function normalizeId(value: string | null | undefined): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

/**
 * Who may delete a column comment:
 * - superadmin
 * - column author (non-visitor)
 * - comment owner with role member/author/superadmin
 * Visitors can never delete comments.
 */
export function canDeleteColumnComment({
  viewerId,
  viewerRole,
  columnAuthorId,
  commentAuthorId,
}: CanDeleteColumnCommentParams): boolean {
  const viewer = normalizeId(viewerId);
  if (!viewer) return false;

  const role = viewerRole?.trim().toLowerCase() ?? "";
  if (!role || role === "visitor") return false;

  if (role === "superadmin") return true;

  const columnAuthor = normalizeId(columnAuthorId);
  if (columnAuthor && viewer === columnAuthor) return true;

  const commentAuthor = normalizeId(commentAuthorId);
  if (commentAuthor && viewer === commentAuthor) return true;

  return false;
}
