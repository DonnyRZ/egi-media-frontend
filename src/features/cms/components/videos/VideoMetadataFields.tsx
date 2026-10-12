"use client";
import { useVideoMetadataOptions } from "@/features/cms/hooks/useVideoMetadataOptions";
import {
  VideoFormatField,
  VideoTaxonomyFields,
  VideoNumberFields,
  VideoPosterFields,
  type VideoMetadataProps,
} from "@/features/cms/components/videos/VideoMetadataInputs";
import { MediaPreview } from "@/features/cms/components/media/MediaPreview";
import { getYoutubeThumbnail } from "@/shared/utils/format";
export function VideoMetadataFields(props: VideoMetadataProps) {
  const options = useVideoMetadataOptions();
  const values = props.values;
  const src =
    (values.format === "short"
      ? values.posterPortrait
      : values.posterLandscape) || getYoutubeThumbnail(values.url);
  return (
    <div className="space-y-4">
      <VideoFormatField {...props} />
      <div className="grid gap-4 sm:grid-cols-2">
        <VideoTaxonomyFields {...props} options={options} />
        <VideoNumberFields {...props} />
      </div>
      <VideoPosterFields {...props} />
      {options.programs.isError || options.categories.isError ? (
        <p role="alert" className="text-sm text-error">
          Could not load category/program choices. Reopen the form to retry.
        </p>
      ) : null}
      <MediaPreview
        title={values.title}
        summary={values.description}
        src={src}
        ratio={values.format === "short" ? "9:16" : "16:9"}
      />
    </div>
  );
}
