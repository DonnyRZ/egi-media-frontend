"use client";
import { Field } from "@/features/cms/components/ui/Field";
import { Input } from "@/features/cms/components/ui/Input";
import { MediaPreview } from "@/features/cms/components/media/MediaPreview";
export interface ImageMetadata {
  featuredImageAlt?: string | null;
  featuredImageCaption?: string | null;
  featuredImageCredit?: string | null;
}
const FIELDS = [
  ["featuredImageAlt", "Alternative text", 500],
  ["featuredImageCaption", "Caption", 1000],
  ["featuredImageCredit", "Photo credit", 500],
] as const;
export function ImageMetadataFields({
  values,
  onChange,
  src,
  title,
  summary,
}: {
  values: ImageMetadata;
  onChange: (key: keyof ImageMetadata, value: string) => void;
  src: string | null;
  title: string;
  summary?: string;
}) {
  return (
    <div className="space-y-4">
      {FIELDS.map(([key, label, max]) => (
        <Field key={key} label={label} htmlFor={key}>
          <Input
            id={key}
            value={values[key] || ""}
            maxLength={max}
            onChange={(e) => onChange(key, e.target.value)}
          />
        </Field>
      ))}
      <p className="text-xs leading-5 text-neutral-500">
        Keep the summary short enough for a three-line card. Existing text is
        preserved. Check embedded text in the photo at thumbnail size.
      </p>
      <MediaPreview src={src} title={title} summary={summary} />
    </div>
  );
}
