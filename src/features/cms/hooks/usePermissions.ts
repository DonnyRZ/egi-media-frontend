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
  const isAuthor = role === "author";

  return {
    role,
    isSuperadmin,
    isAuthor,
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
    // Everyone in the newsroom can view the team directory (read-only), but only
    // superadmin can add / edit / delete users.
    canViewUsers: isSuperadmin || isAuthor,
    canManageUsers: isSuperadmin,
    canViewActivity: isSuperadmin,
    canModerateColumns: isSuperadmin,
  };
}
