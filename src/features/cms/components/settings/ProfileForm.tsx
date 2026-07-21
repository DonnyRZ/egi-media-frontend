"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/features/cms/components/ui/Button";
import { Card, CardBody, CardHeader } from "@/features/cms/components/ui/Card";
import { Field } from "@/features/cms/components/ui/Field";
import { Input } from "@/features/cms/components/ui/Input";
import { Textarea } from "@/features/cms/components/ui/Textarea";
import { LoadingState } from "@/features/cms/components/ui/StateViews";
import { useAccountMutations, useProfile } from "@/features/cms/hooks/useAccount";
import {
  profileFormSchema,
  type ProfileFormValues,
} from "@/features/cms/schemas/cms.schemas";
import { useToast } from "@/features/cms/stores/cms-toast.store";

export function ProfileForm() {
  const toast = useToast();
  const { data, isLoading } = useProfile();
  const { saveProfile } = useAccountMutations();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      jobTitle: "",
      company: "",
      industry: "",
      seniority: "",
      country: "",
      bio: "",
      avatarUrl: "",
    },
  });

  useEffect(() => {
    if (!data) return;
    reset({
      jobTitle: data.jobTitle ?? "",
      company: data.company ?? "",
      industry: data.industry ?? "",
      seniority: data.seniority ?? "",
      country: data.country ?? "",
      bio: data.bio ?? "",
      avatarUrl: data.avatarUrl ?? "",
    });
  }, [data, reset]);

  async function submit(values: ProfileFormValues) {
    try {
      await saveProfile.mutateAsync(values);
      toast.success("Profile updated");
    } catch {
      toast.error("Could not update profile");
    }
  }

  return (
    <Card>
      <CardHeader
        title="Profile"
        description="Details shown on your author byline."
      />
      <CardBody>
        {isLoading ? (
          <LoadingState />
        ) : (
          <form onSubmit={handleSubmit(submit)} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Job title" htmlFor="job-title" error={errors.jobTitle?.message}>
                <Input id="job-title" {...register("jobTitle")} />
              </Field>
              <Field label="Company" htmlFor="company" error={errors.company?.message}>
                <Input id="company" {...register("company")} />
              </Field>
              <Field label="Industry" htmlFor="industry" error={errors.industry?.message}>
                <Input id="industry" {...register("industry")} />
              </Field>
              <Field label="Seniority" htmlFor="seniority" error={errors.seniority?.message}>
                <Input id="seniority" {...register("seniority")} />
              </Field>
              <Field label="Country" htmlFor="country" error={errors.country?.message}>
                <Input id="country" {...register("country")} />
              </Field>
              <Field label="Avatar URL" htmlFor="avatar" error={errors.avatarUrl?.message}>
                <Input id="avatar" placeholder="https://…" {...register("avatarUrl")} />
              </Field>
            </div>
            <Field label="Bio" htmlFor="bio" error={errors.bio?.message}>
              <Textarea id="bio" rows={4} {...register("bio")} />
            </Field>
            <div className="flex justify-end">
              <Button type="submit" loading={saveProfile.isPending}>
                Save profile
              </Button>
            </div>
          </form>
        )}
      </CardBody>
    </Card>
  );
}
