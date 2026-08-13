"use client";

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { CMS_QUERY_KEYS } from "@/features/cms/constants/cms.constants";
import {
  createCmsTeamMember,
  deleteCmsTeamMember,
  fetchCmsTeamMembers,
  updateCmsTeamMember,
  type CmsTeamMemberWritePayload,
  type CmsTeamMembersParams,
} from "@/features/cms/services/cms-team-members.service";
import { QUERY_KEYS } from "@/shared/constants/query-keys.constants";

export function useCmsTeamMembers(params: CmsTeamMembersParams) {
  return useQuery({
    queryKey: CMS_QUERY_KEYS.teamMembers.list(params),
    queryFn: () => fetchCmsTeamMembers(params),
    placeholderData: keepPreviousData,
  });
}

export function useTeamMemberMutations() {
  const queryClient = useQueryClient();

  const invalidate = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: CMS_QUERY_KEYS.teamMembers.all }),
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.teamMembers.all }),
    ]);
  };

  const save = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id?: string;
      payload: CmsTeamMemberWritePayload;
    }) =>
      id
        ? updateCmsTeamMember(id, payload)
        : createCmsTeamMember(payload),
    onSuccess: invalidate,
  });

  const remove = useMutation({
    mutationFn: (id: string) => deleteCmsTeamMember(id),
    onSuccess: invalidate,
  });

  return { save, remove };
}
