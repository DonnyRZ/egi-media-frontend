"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/features/cms/components/ui/Button";
import { Field } from "@/features/cms/components/ui/Field";
import { Input } from "@/features/cms/components/ui/Input";
import { Modal } from "@/features/cms/components/ui/Modal";
import { Textarea } from "@/features/cms/components/ui/Textarea";
import {
  videoFormSchema,
  type VideoFormValues,
} from "@/features/cms/schemas/cms.schemas";
import type { CmsVideo } from "@/features/cms/services/cms-video.service";

interface VideoFormModalProps {
  open: boolean;
  saving: boolean;
  video: CmsVideo | null;
  canActivate: boolean;
  onClose: () => void;
  onSubmit: (values: VideoFormValues) => void;
}

const EMPTY: VideoFormValues = {
  title: "",
  description: "",
  url: "",
  isActive: true,
};

export function VideoFormModal({
  open,
  saving,
  video,
  canActivate,
  onClose,
  onSubmit,
}: VideoFormModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<VideoFormValues>({
    resolver: zodResolver(videoFormSchema),
    defaultValues: EMPTY,
  });

  const isActive = watch("isActive");

  useEffect(() => {
    if (!open) return;
    reset(
      video
        ? {
            title: video.title,
            description: video.description ?? "",
            url: video.url,
            isActive: canActivate ? video.isActive : false,
          }
        : { ...EMPTY, isActive: canActivate },
    );
  }, [open, video, canActivate, reset]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={video ? "Edit video" : "Add video"}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={handleSubmit(onSubmit)} loading={saving}>
            {video ? "Save changes" : "Add video"}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <Field label="Video title" htmlFor="video-title" error={errors.title?.message} required>
          <Input id="video-title" invalid={Boolean(errors.title)} {...register("title")} />
        </Field>
        <Field label="YouTube URL" htmlFor="video-url" error={errors.url?.message} required>
          <Input
            id="video-url"
            type="url"
            placeholder="https://www.youtube.com/watch?v=…"
            invalid={Boolean(errors.url)}
            {...register("url")}
          />
        </Field>
        <Field label="Description" htmlFor="video-desc" error={errors.description?.message}>
          <Textarea id="video-desc" {...register("description")} />
        </Field>
        {canActivate ? (
          <label className="flex items-center gap-2 text-sm text-neutral-700 dark:text-neutral-300">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-neutral-300 text-accent focus:ring-accent"
              checked={isActive}
              onChange={(event) => setValue("isActive", event.target.checked)}
            />
            Active (shown on the public website)
          </label>
        ) : (
          <p className="text-sm text-neutral-500">
            This video will be submitted for review. An editor must activate it
            before it appears on the website.
          </p>
        )}
      </div>
    </Modal>
  );
}
