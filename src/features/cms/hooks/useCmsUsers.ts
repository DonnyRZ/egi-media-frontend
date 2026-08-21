"use client";

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { CMS_QUERY_KEYS } from "@/features/cms/constants/cms.constants";
import {
  addAuthor,
  deleteUser,
  fetchUsers,
  updateUser,
  type AddAuthorPayload,
  type CmsUsersParams,
  type UpdateUserPayload,
} from "@/features/cms/services/cms-user.service";

export function useCmsUsers(params: CmsUsersParams, enabled = true) {
  return useQuery({
    queryKey: CMS_QUERY_KEYS.users.list(params),
    queryFn: () => fetchUsers(params),
    placeholderData: keepPreviousData,
    enabled,
  });
}

export function useUserMutations() {
  const queryClient = useQueryClient();
  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: CMS_QUERY_KEYS.users.all });

  const add = useMutation({
    mutationFn: (payload: AddAuthorPayload) => addAuthor(payload),
    onSuccess: invalidate,
  });

  const update = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateUserPayload }) =>
      updateUser(id, payload),
    onSuccess: invalidate,
  });

  const remove = useMutation({
    mutationFn: (id: string) => deleteUser(id),
    onSuccess: invalidate,
  });

  return { add, update, remove };
}
