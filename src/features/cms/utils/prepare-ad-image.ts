import { MAX_IMAGE_UPLOAD_BYTES, decodeImage } from "@/features/cms/utils/prepare-image";
import { AD_PLACEMENT_GUIDELINES, matchesAdRatio, type AdPlacement } from "@/shared/types/ads.types";

export async function prepareAdImage(file: File, placement: AdPlacement, signal?: AbortSignal) {
  if (!["image/png", "image/jpeg", "image/webp", "image/avif"].includes(file.type)) throw new Error("Choose a PNG, JPG, WebP, or AVIF advertisement image.");
  if (!file.size || file.size > MAX_IMAGE_UPLOAD_BYTES) throw new Error("Advertisement images must be between 1 byte and 5 MB. The original file is preserved.");
  const image = await decodeImage(file, signal);
  try {
    if (!matchesAdRatio(placement, image.naturalWidth, image.naturalHeight)) {
      throw new Error(`Image is ${image.naturalWidth}×${image.naturalHeight}. This slot requires ${AD_PLACEMENT_GUIDELINES[placement].dimensions}.`);
    }
    return file;
  } finally { image.src = ""; }
}
