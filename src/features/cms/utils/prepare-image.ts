export const MAX_IMAGE_UPLOAD_BYTES = 5 * 1024 * 1024;
export const MAX_IMAGE_INPUT_BYTES = 20 * 1024 * 1024;
export const IMAGE_TARGET_BYTES = 512 * 1024;
export const IMAGE_ACCEPT = "image/jpeg,image/png,image/webp,image/gif,image/avif,image/svg+xml";

const RASTER_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);
const PASSTHROUGH_TYPES = new Set(["image/gif", "image/svg+xml"]);
const MAX_DIMENSION = 1920;
const MAX_PIXELS = 40_000_000;

function checkAborted(signal?: AbortSignal) {
  if (signal?.aborted) throw new DOMException("Upload cancelled", "AbortError");
}

export function decodeImage(file: File, signal?: AbortSignal): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    checkAborted(signal);
    const image = new Image();
    const objectUrl = URL.createObjectURL(file);
    const finish = (error?: Error) => {
      clearTimeout(timer);
      signal?.removeEventListener("abort", abort);
      image.onload = null;
      image.onerror = null;
      URL.revokeObjectURL(objectUrl);
      if (error) {
        image.src = "";
        reject(error);
      } else {
        resolve(image);
      }
    };
    const abort = () => finish(new DOMException("Upload cancelled", "AbortError"));
    const timer = setTimeout(() => finish(new Error("This image could not be opened. Try a different JPG, PNG, or WebP file.")), 15_000);
    image.onload = () => finish();
    image.onerror = () => finish(new Error("This image could not be opened. Check that the file is a valid image."));
    signal?.addEventListener("abort", abort, { once: true });
    image.src = objectUrl;
  });
}

function encodeWebp(canvas: HTMLCanvasElement, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob || blob.type !== "image/webp") {
        reject(new Error("Your browser could not optimize this image. Try a smaller JPG or WebP file."));
      } else {
        resolve(blob);
      }
    }, "image/webp", quality);
  });
}

/** Reduce photographic uploads before sending them over slow connections. */
export async function prepareImage(file: File, signal?: AbortSignal): Promise<File> {
  checkAborted(signal);
  if (!RASTER_TYPES.has(file.type) && !PASSTHROUGH_TYPES.has(file.type)) {
    throw new Error("Choose a JPG, PNG, WebP, GIF, AVIF, or SVG image.");
  }
  if (!file.size) throw new Error("This image is empty. Choose another file.");
  if (file.size > MAX_IMAGE_INPUT_BYTES) throw new Error("Choose an image smaller than 20 MB.");
  // Keep animation and vector content intact.
  if (PASSTHROUGH_TYPES.has(file.type)) {
    if (file.size > MAX_IMAGE_UPLOAD_BYTES) throw new Error("GIF and SVG images must be smaller than 5 MB.");
    return file;
  }

  const image = await decodeImage(file, signal);
  const canvas = document.createElement("canvas");
  try {
    checkAborted(signal);
    const width = image.naturalWidth;
    const height = image.naturalHeight;
    if (!width || !height || width * height > MAX_PIXELS) {
      throw new Error("This image is too large to process. Resize it below 40 megapixels and try again.");
    }
    if (file.size <= IMAGE_TARGET_BYTES && Math.max(width, height) <= MAX_DIMENSION) return file;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Your browser could not optimize this image. Try a smaller file.");
    let scale = Math.min(1, MAX_DIMENSION / Math.max(width, height));
    for (let resize = 0; resize < 4; resize += 1) {
      canvas.width = Math.max(1, Math.round(width * scale));
      canvas.height = Math.max(1, Math.round(height * scale));
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      for (const quality of [0.82, 0.72, 0.62, 0.52]) {
        checkAborted(signal);
        const blob = await encodeWebp(canvas, quality);
        checkAborted(signal);
        if (blob.size <= IMAGE_TARGET_BYTES) {
          return new File([blob], `${file.name.replace(/\.[^.]+$/, "") || "image"}.webp`, {
            type: "image/webp",
            lastModified: file.lastModified,
          });
        }
      }
      scale *= 0.8;
    }
    throw new Error("This image could not be reduced enough for upload. Resize it and try again.");
  } finally {
    canvas.width = 0;
    canvas.height = 0;
    image.src = "";
  }
}
