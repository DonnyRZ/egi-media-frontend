"use client";

import { useMemo, useState } from "react";

import { PageHeader } from "@/features/cms/components/layout/PageHeader";
import { Badge } from "@/features/cms/components/ui/Badge";
import { Button } from "@/features/cms/components/ui/Button";
import { Card } from "@/features/cms/components/ui/Card";
import { ConfirmDialog } from "@/features/cms/components/ui/ConfirmDialog";
import { Icons } from "@/features/cms/components/ui/Icons";
import { Input } from "@/features/cms/components/ui/Input";
import { Pagination } from "@/features/cms/components/ui/Pagination";
import { Select } from "@/features/cms/components/ui/Select";
import {
  EmptyState,
  ErrorState,
  LoadingState,
} from "@/features/cms/components/ui/StateViews";
import { AddAuthorModal } from "@/features/cms/components/users/AddAuthorModal";
import { EditUserModal } from "@/features/cms/components/users/EditUserModal";
import { CMS_DEFAULT_PAGE_SIZE } from "@/features/cms/constants/cms.constants";
import { useCmsUsers, useUserMutations } from "@/features/cms/hooks/useCmsUsers";
import { useDebouncedValue } from "@/features/cms/hooks/useDebouncedValue";
import { usePermissions } from "@/features/cms/hooks/usePermissions";
import { useToast } from "@/features/cms/stores/cms-toast.store";
import type { CmsUser } from "@/features/cms/types/cms.types";

const ROLE_FILTER_OPTIONS = [
  { value: "superadmin", label: "Super Admin" },
  { value: "author", label: "Author" },
  { value: "member", label: "Member" },
  { value: "visitor", label: "Visitor" },
];

const ROLE_TONE: Record<string, "info" | "success" | "neutral" | "muted"> = {
  superadmin: "success",
  author: "info",
  member: "neutral",
  visitor: "muted",
};

export function UsersView() {
  const toast = useToast();
  const { canManageUsers } = usePermissions();
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [page, setPage] = useState(1);
  const [addOpen, setAddOpen] = useState(false);
  const [editing, setEditing] = useState<CmsUser | null>(null);
  const [pendingDelete, setPendingDelete] = useState<CmsUser | null>(null);

  const debouncedSearch = useDebouncedValue(search);
  const params = useMemo(
    () => ({ page, limit: CMS_DEFAULT_PAGE_SIZE, search: debouncedSearch, role }),
    [page, debouncedSearch, role],
  );
  const { data, isLoading, isError } = useCmsUsers(params);
  const { add, update, remove } = useUserMutations();

  const users = data?.items ?? [];

  async function createAuthor(values: { fullName: string; email: string; password: string }) {
    try {
      await add.mutateAsync(values);
      toast.success("Author created");
      setAddOpen(false);
    } catch {
      toast.error("Could not create author");
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
              <Icons.plus className="h-4 w-4" /> Add author
            </Button>
          ) : undefined
        }
      />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Icons.search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <Input
            className="pl-9"
            placeholder="Search users…"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
          />
        </div>
        <Select
          className="sm:w-48"
          placeholder="All roles"
          options={ROLE_FILTER_OPTIONS}
          value={role}
          onChange={(event) => {
            setRole(event.target.value);
            setPage(1);
          }}
        />
      </div>

      <Card>
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
        onSubmit={createAuthor}
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
