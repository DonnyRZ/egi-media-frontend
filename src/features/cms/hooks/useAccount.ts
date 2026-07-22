"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { CMS_QUERY_KEYS } from "@/features/cms/constants/cms.constants";
import {
  changePassword,
  fetchProfile,
  updateProfile,
  type ProfileWritePayload,
} from "@/features/cms/services/cms-account.service";

export function useProfile() {
  return useQuery({
    queryKey: CMS_QUERY_KEYS.account.profile,
    queryFn: fetchProfile,
  });
}

export function useAccountMutations() {
  const queryClient = useQueryClient();

  const saveProfile = useMutation({
    mutationFn: (payload: ProfileWritePayload) => updateProfile(payload),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: CMS_QUERY_KEYS.account.profile,
      }),
  });

  const changeUserPassword = useMutation({
    mutationFn: ({
      oldPassword,
      newPassword,
    }: {
      oldPassword: string;
      newPassword: string;
    }) => changePassword(oldPassword, newPassword),
  });

  return { saveProfile, changeUserPassword };
}
