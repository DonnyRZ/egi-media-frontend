"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { ImageUpload } from "@/features/cms/components/media/ImageUpload";
import { Button } from "@/features/cms/components/ui/Button";
import { Field } from "@/features/cms/components/ui/Field";
import { Input } from "@/features/cms/components/ui/Input";
import { Modal } from "@/features/cms/components/ui/Modal";
import { Textarea } from "@/features/cms/components/ui/Textarea";
import {
  teamMemberFormSchema,
  type TeamMemberFormValues,
} from "@/features/cms/schemas/cms.schemas";
import type { CmsTeamMember } from "@/features/cms/services/cms-team-members.service";

interface TeamMemberFormModalProps {
  open: boolean;
  saving: boolean;
  member: CmsTeamMember | null;
  onClose: () => void;
  onSubmit: (values: TeamMemberFormValues) => void;
}

const EMPTY: TeamMemberFormValues = {
  name: "",
  role: "",
  bio: "",
  photoUrl: "",
  isActive: true,
  sortOrder: 0,
};

export function TeamMemberFormModal({
  open,
  saving,
  member,
  onClose,
  onSubmit,
}: TeamMemberFormModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<TeamMemberFormValues>({
    resolver: zodResolver(teamMemberFormSchema),
    defaultValues: EMPTY,
  });

  const isActive = watch("isActive");
  const photoUrl = watch("photoUrl");

  useEffect(() => {
    if (!open) return;
    reset(
      member
        ? {
            name: member.name,
            role: member.role,
            bio: member.bio ?? "",
            photoUrl: member.photoUrl,
            isActive: member.isActive,
            sortOrder: member.sortOrder,
          }
        : EMPTY,
    );
  }, [open, member, reset]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={member ? "Edit team member" : "Add team member"}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={handleSubmit(onSubmit)} loading={saving}>
            {member ? "Save changes" : "Add member"}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <Field label="Name" htmlFor="team-name" error={errors.name?.message} required>
          <Input
            id="team-name"
            invalid={Boolean(errors.name)}
            placeholder="Full name"
            {...register("name")}
          />
        </Field>

        <Field label="Role" htmlFor="team-role" error={errors.role?.message} required>
          <Input
            id="team-role"
            invalid={Boolean(errors.role)}
            placeholder="Editor in Chief"
            {...register("role")}
          />
        </Field>

        <Field label="Bio" htmlFor="team-bio" error={errors.bio?.message}>
          <Textarea
            id="team-bio"
            rows={3}
            placeholder="Optional short bio"
            invalid={Boolean(errors.bio)}
            {...register("bio")}
          />
        </Field>

        <Field
          label="Photo"
          htmlFor="team-photo"
          error={errors.photoUrl?.message}
          required
        >
          <div className="space-y-3">
            <ImageUpload
              onUploaded={(url) => setValue("photoUrl", url, { shouldValidate: true })}
            />
            <Input
              id="team-photo"
              placeholder="https://… or /images/…"
              invalid={Boolean(errors.photoUrl)}
              {...register("photoUrl")}
            />
            {photoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={photoUrl}
                alt="Preview"
                className="h-28 w-24 rounded-md object-cover"
              />
            ) : null}
          </div>
        </Field>

        <Field
          label="Sort order"
          htmlFor="team-sort"
          error={errors.sortOrder?.message}
          required
        >
          <Input
            id="team-sort"
            type="number"
            min={0}
            invalid={Boolean(errors.sortOrder)}
            {...register("sortOrder")}
          />
        </Field>

        <label className="flex items-center gap-2 text-sm text-neutral-700 dark:text-neutral-300">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-neutral-300 text-accent focus:ring-accent"
            checked={isActive}
            onChange={(event) => setValue("isActive", event.target.checked)}
          />
          Active (shown on the About page)
        </label>
      </div>
    </Modal>
  );
}
