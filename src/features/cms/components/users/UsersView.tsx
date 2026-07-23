"use client";

import { useMemo, useState } from "react";

import { PageHeader } from "@/features/cms/components/layout/PageHeader";
import { Badge } from "@/features/cms/components/ui/Badge";
import { Button } from "@/features/cms/components/ui/Button";
import { Card } from "@/features/cms/components/ui/Card";
import { ConfirmDialog } from "@/features/cms/components/ui/ConfirmDialog";
import { Icons } from "@/features/cms/components/ui/Icons";
import { Pagination } from "@/features/cms/components/ui/Pagination";
import {
  EmptyState,
  ErrorState,
  LoadingState,
} from "@/features/cms/components/ui/StateViews";
import { AddAuthorModal } from "@/features/cms/components/users/AddAuthorModal";
import { EditUserModal } from "@/features/cms/components/users/EditUserModal";
import {
  UserFilters,
  type UserSortKey,
} from "@/features/cms/components/users/UserFilters";
import {
  UserRoleTabs,
  type UserRoleFilter,
} from "@/features/cms/components/users/UserRoleTabs";
import { CMS_DEFAULT_PAGE_SIZE } from "@/features/cms/constants/cms.constants";
import { useCmsUsers, useUserMutations } from "@/features/cms/hooks/useCmsUsers";
import { useDebouncedValue } from "@/features/cms/hooks/useDebouncedValue";
import { usePermissions } from "@/features/cms/hooks/usePermissions";
import { useToast } from "@/features/cms/stores/cms-toast.store";
import type { AddAuthorValues } from "@/features/cms/schemas/cms.schemas";
import type { CmsUser } from "@/features/cms/types/cms.types";

const ROLE_TONE: Record<string, "info" | "success" | "neutral" | "muted"> = {
  superadmin: "success",
  author: "info",
  member: "neutral",
  visitor: "muted",
};

export function UsersView() {
  const toast = useToast();
  const { canManageUsers } = usePermissions();
  const [searchInput, setSearchInput] = useState("");
  const [role, setRole] = useState<UserRoleFilter>("");
  const [sort, setSort] = useState<UserSortKey>("newest");
  const [page, setPage] = useState(1);
  const [addOpen, setAddOpen] = useState(false);
  const [editing, setEditing] = useState<CmsUser | null>(null);
  const [pendingDelete, setPendingDelete] = useState<CmsUser | null>(null);

  const search = useDebouncedValue(searchInput, 300);
  const params = useMemo(
    () => ({
      page,
      limit: CMS_DEFAULT_PAGE_SIZE,
      search,
      role,
      sort,
    }),
    [page, search, role, sort],
  );
  const { data, isLoading, isError } = useCmsUsers(params);
  const { add, update, remove } = useUserMutations();

  const users = data?.items ?? [];

  async function createUser(values: AddAuthorValues) {
    try {
      await add.mutateAsync(values);
      toast.success("User created");
      setAddOpen(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not create user",
      );
    }
  }

  async function saveUser(values: { fullName: string; role: string }) {
    if (!editing) return;
    try {
      await update.mutateAsync({ id: editing.id, payload: values });
      toast.success("User updated");
      setEditing(null);
    } catch {
      toast.error("Could not update user");
    }
  }

  async function confirmDelete() {
    if (!pendingDelete) return;
    try {
      await remove.mutateAsync(pendingDelete.id);
      toast.success("User deleted");
    } catch {
      toast.error("Could not delete user");
    } finally {
      setPendingDelete(null);
    }
  }

  return (
    <>
      <PageHeader
        title="Users"
        description={
          canManageUsers
            ? "Manage authors, editors, and administrators."
            : "The EGI Media newsroom team."
        }
        actions={
          canManageUsers ? (
            <Button onClick={() => setAddOpen(true)}>
              <Icons.plus className="h-4 w-4" /> Add user
            </Button>
          ) : undefined
        }
      />

      <Card>
        <UserRoleTabs
          value={role}
          onChange={(value) => {
            setRole(value);
            setPage(1);
          }}
        />

        <UserFilters
          search={searchInput}
          sort={sort}
          onSearch={(value) => {
            setSearchInput(value);
            setPage(1);
          }}
          onSort={(value) => {
            setSort(value);
            setPage(1);
          }}
        />

        {isLoading ? (
          <LoadingState />
        ) : isError ? (
          <ErrorState />
        ) : users.length === 0 ? (
          <EmptyState title="No users found" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-neutral-200 text-xs uppercase tracking-wide text-neutral-500 dark:border-neutral-800">
                <tr>
                  <th className="px-5 py-3 font-semibold">Name</th>
                  <th className="px-5 py-3 font-semibold">Email</th>
                  <th className="px-5 py-3 font-semibold">Role</th>
                  {canManageUsers ? (
                    <th className="px-5 py-3 text-right font-semibold">Actions</th>
                  ) : null}
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="px-5 py-3 font-medium text-neutral-900 dark:text-neutral-100">
                      {user.fullName}
                    </td>
                    <td className="px-5 py-3 text-neutral-500 dark:text-neutral-400">
                      {user.email}
                    </td>
                    <td className="px-5 py-3">
                      <Badge tone={ROLE_TONE[user.role] ?? "neutral"}>
                        {user.role}
                      </Badge>
                    </td>
                    {canManageUsers ? (
                      <td className="px-5 py-3">
                        <div className="flex justify-end gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setEditing(user)}
                          >
                            <Icons.edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setPendingDelete(user)}
                          >
                            <Icons.trash className="h-4 w-4 text-error" />
                          </Button>
                        </div>
                      </td>
                    ) : null}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <Pagination
          page={data?.page ?? 1}
          totalPages={data?.totalPages ?? 1}
          total={data?.total ?? 0}
          onPageChange={setPage}
        />
      </Card>

      <AddAuthorModal
        open={addOpen}
        saving={add.isPending}
        onClose={() => setAddOpen(false)}
        onSubmit={createUser}
      />
      <EditUserModal
        open={Boolean(editing)}
        saving={update.isPending}
        user={editing}
        onClose={() => setEditing(null)}
        onSubmit={saveUser}
      />
      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete user"
        message={`Delete "${pendingDelete?.fullName}"? This cannot be undone.`}
        confirmLabel="Delete"
        danger
        loading={remove.isPending}
        onConfirm={confirmDelete}
        onClose={() => setPendingDelete(null)}
      />
    </>
  );
}
