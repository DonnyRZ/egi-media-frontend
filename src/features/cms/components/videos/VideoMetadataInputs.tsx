"use client";
import type {
  UseFormRegister,
  UseFormSetValue,
  FieldErrors,
} from "react-hook-form";
import { Field } from "@/features/cms/components/ui/Field";
import { Input } from "@/features/cms/components/ui/Input";
import { Select } from "@/features/cms/components/ui/Select";
import { ImageUpload } from "@/features/cms/components/media/ImageUpload";
import { optionalNumber } from "@/features/cms/utils/optional-number";
import type { VideoFormValues } from "@/features/cms/schemas/cms.schemas";
import type { useVideoMetadataOptions } from "@/features/cms/hooks/useVideoMetadataOptions";
export interface VideoMetadataProps {
  register: UseFormRegister<VideoFormValues>;
  values: VideoFormValues;
  setValue: UseFormSetValue<VideoFormValues>;
  errors: FieldErrors<VideoFormValues>;
  onUploadBusyChange?: (key: string, busy: boolean) => void;
}
interface VideoTaxonomyProps extends VideoMetadataProps {
  options: ReturnType<typeof useVideoMetadataOptions>;
}
export function VideoFormatField({ register }: VideoMetadataProps) {
  return (
    <Field label="Format">
      <Select
        {...register("format")}
        options={[
          { value: "horizontal", label: "Horizontal · 16:9" },
          { value: "short", label: "Shorts · 9:16" },
        ]}
      />
    </Field>
  );
}
export function VideoTaxonomyFields({
  register,
  errors,
  options,
}: VideoTaxonomyProps) {
  const categories = [
    { value: "", label: "No category" },
    ...(options.categories.data?.items || []).map((c) => ({
      value: c.id,
      label: c.name,
    })),
  ];
  const programs = [
    { value: "", label: "Standalone video" },
    ...(options.programs.data || []).map((p) => ({
      value: p.id,
      label: p.name,
    })),
  ];
  return (
    <>
      <Field label="Category" error={errors.categoryId?.message}>
        <Select {...register("categoryId")} options={categories} />
      </Field>
      <Field label="Program" error={errors.programId?.message}>
        <Select {...register("programId")} options={programs} />
      </Field>
    </>
  );
}
const NUMBER_FIELDS = [
  { key: "episodeNumber", label: "Episode number" },
  { key: "durationSeconds", label: "Duration (seconds)" },
] as const;
export function VideoNumberFields({ register, errors }: VideoMetadataProps) {
  return (
    <>
      {NUMBER_FIELDS.map((field) => (
        <Field
          key={field.key}
          label={field.label}
          error={errors[field.key]?.message}
        >
          <Input
            type="number"
            {...register(field.key, { setValueAs: optionalNumber })}
          />
        </Field>
      ))}
    </>
  );
}
const POSTERS = [
  { key: "posterLandscape", label: "Landscape poster · 16:9" },
  { key: "posterPortrait", label: "Portrait poster · 9:16" },
] as const;
export function VideoPosterFields({
  register,
  errors,
  setValue,
  onUploadBusyChange,
}: VideoMetadataProps) {
  return (
    <>
      {POSTERS.map((field) => (
        <div key={field.key}>
          <Field label={field.label} error={errors[field.key]?.message}>
            <Input {...register(field.key)} />
          </Field>
          <ImageUpload
            onBusyChange={(busy) => onUploadBusyChange?.(field.key, busy)}
            onUploaded={(url) =>
              setValue(field.key, url, {
                shouldDirty: true,
                shouldValidate: true,
              })
            }
          />
        </div>
      ))}
    </>
  );
}
