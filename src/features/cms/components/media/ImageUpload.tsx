"use client";

import { useEffect, useRef, useState } from "react";

import { Icons } from "@/features/cms/components/ui/Icons";
import { uploadImage, type ImageUploadState, type AdImageMetadata } from "@/features/cms/services/cms-media.service";
import type { AdPlacement } from "@/shared/types/ads.types";
import { useToast } from "@/features/cms/stores/cms-toast.store";
import { IMAGE_ACCEPT } from "@/features/cms/utils/prepare-image";

interface ImageUploadProps {
  onUploaded: (url: string) => void;
  onBusyChange?: (busy: boolean) => void;
  adPlacement?: AdPlacement;
  onMetadata?: (metadata: AdImageMetadata) => void;
}

function formatSize(bytes: number) {
  return bytes >= 1024 * 1024 ? `${(bytes / (1024 * 1024)).toFixed(2)} MB` : `${Math.ceil(bytes / 1024)} KB`;
}

export function ImageUpload({ onUploaded, onBusyChange, adPlacement, onMetadata }: ImageUploadProps) {
  const toast = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [state, setState] = useState<ImageUploadState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [completed, setCompleted] = useState(false);
  const controllerRef = useRef<AbortController | null>(null);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      controllerRef.current?.abort();
    };
  }, []);

  async function handleFile(file: File | undefined) {
    if (!file || controllerRef.current) return;
    const controller = new AbortController();
    controllerRef.current = controller;
    setSelectedFile(file);
    setError(null);
    setCompleted(false);
    setBusy(true);
    onBusyChange?.(true);
    try {
      const url = await uploadImage(file, {
        signal: controller.signal,
        onStateChange: (next) => { if (mounted.current) setState(next); },
        adPlacement,
        onMetadata,
      });
      if (!mounted.current || controller.signal.aborted) return;
      setCompleted(true);
      setSelectedFile(null);
      onUploaded(url);
      toast.success("Image uploaded");
    } catch (error) {
      if (!mounted.current) return;
      if (controller.signal.aborted) {
        setState(null);
        return;
      }
      const message = error instanceof Error ? error.message : "Upload failed. Please retry.";
      setError(message);
      toast.error(message);
    } finally {
      controllerRef.current = null;
      if (mounted.current) {
        setBusy(false);
        onBusyChange?.(false);
        if (inputRef.current) inputRef.current.value = "";
      }
    }
  }

  const label = !busy ? "Click to upload an image"
    : state?.stage === "preparing" ? adPlacement ? "Checking image dimensions…" : "Optimizing image…"
    : state?.stage === "retrying" ? "Connection interrupted. Retrying (2/2)…"
    : state?.stage === "saving" ? "Saving image…"
    : `Uploading… ${state?.progress ?? 0}%${state?.attempt === 2 ? " (2/2)" : ""}`;

  return (
    <div className="space-y-3">
    <button
      type="button"
      onClick={() => inputRef.current?.click()}
      disabled={busy}
      className="flex w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-neutral-300 bg-neutral-50 px-4 py-8 text-center transition-colors hover:border-accent hover:bg-accent/5 disabled:opacity-60 dark:border-neutral-700 dark:bg-neutral-900"
    >
      <Icons.media className="h-6 w-6 text-neutral-400" />
      <span className="text-sm font-medium text-neutral-600 dark:text-neutral-300">
        {label}
      </span>
      <span className="text-xs text-neutral-400">
        {adPlacement ? "Original file preserved · PNG, JPG, WebP, AVIF · Max 5 MB" : "Photos are optimized automatically · JPG, PNG, WebP, GIF, AVIF, SVG"}
      </span>
    </button>
      <input
        ref={inputRef}
        type="file"
        accept={adPlacement ? "image/png,image/jpeg,image/webp,image/avif" : IMAGE_ACCEPT}
        aria-label="Choose image file"
        disabled={busy}
        className="hidden"
        onChange={(event) => handleFile(event.target.files?.[0])}
      />
      {busy && state ? (
        <div className="space-y-2" aria-live="polite">
          <div role="progressbar" aria-label="Image upload progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={state.progress}
            className="h-2 overflow-hidden rounded bg-neutral-200 dark:bg-neutral-800">
            <div className="h-full bg-accent transition-all" style={{ width: `${state.progress}%` }} />
          </div>
          <p className="text-xs text-neutral-500">{formatSize(state.originalBytes)} → {formatSize(state.uploadBytes)}</p>
          <button type="button" className="text-sm text-neutral-600 underline dark:text-neutral-300"
            onClick={() => controllerRef.current?.abort()}>Cancel upload</button>
        </div>
      ) : null}
      {completed && state ? <p className="text-xs text-neutral-500" role="status">Image ready · {formatSize(state.originalBytes)} → {formatSize(state.uploadBytes)}</p> : null}
      {error ? <p role="alert" className="text-sm text-red-600">{error}</p> : null}
      {!busy && selectedFile && (error || !state) ? (
        <button type="button" className="text-sm font-semibold text-accent underline"
          onClick={() => void handleFile(selectedFile)}>Retry upload</button>
      ) : null}
    </div>
  );
}
