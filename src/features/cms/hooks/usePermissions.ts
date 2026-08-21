"use client";

import { useAuthStore } from "@/features/auth/stores/auth.store";

/**
 * Role-derived capabilities for the CMS. Mirrors backend route guards
 * (`verifyRoleName`) so the UI only surfaces actions the API will allow.
 */
export function usePermissions() {
  const user = useAuthStore((state) => state.user);
  const role = user?.role ?? null;

  const isSuperadmin = role === "superadmin";
  const isAdmin = role === "admin";
  const isAuthor = role === "author";
  const isElevated = isSuperadmin || isAdmin;

  return {
    role,
    isSuperadmin,
    isAdmin,
    isAuthor,
    isElevated,
    // Authors and superadmins can author content.
    canManageArticles: isSuperadmin || isAuthor,
    // Publish / schedule / archive are superadmin-only. Authors may only submit
    // for review (draft <-> review), matching the backend transition guard.
    canPublish: isSuperadmin,
    // All taxonomy (category / topic / tag / series) is defined and managed by
    // superadmin; authors only select from what exists.
    canManageTaxonomy: isSuperadmin,
    canManageTags: isSuperadmin,
    canManageSeries: isSuperadmin,
    // User directory is admin-only. Authors must not see or open /cms/users.
    canViewUsers: isElevated,
    canManageUsers: isSuperadmin,
    // Only elevated roles can publish / activate videos.
    canManageVideos: isElevated,
    canViewActivity: isSuperadmin,
    canModerateColumns: isSuperadmin,
  };
}
