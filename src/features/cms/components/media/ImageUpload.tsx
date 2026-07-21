"use client";

import { useRef, useState } from "react";

import { Icons } from "@/features/cms/components/ui/Icons";
import { uploadImage } from "@/features/cms/services/cms-media.service";
import { useToast } from "@/features/cms/stores/cms-toast.store";

interface ImageUploadProps {
  onUploaded: (url: string) => void;
}

export function ImageUpload({ onUploaded }: ImageUploadProps) {
  const toast = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setBusy(true);
    try {
      const url = await uploadImage(file);
      onUploaded(url);
      toast.success("Image uploaded");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Upload failed",
      );
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <button
      type="button"
      onClick={() => inputRef.current?.click()}
      disabled={busy}
      className="flex w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-neutral-300 bg-neutral-50 px-4 py-8 text-center transition-colors hover:border-accent hover:bg-accent/5 disabled:opacity-60 dark:border-neutral-700 dark:bg-neutral-900"
    >
      <Icons.media className="h-6 w-6 text-neutral-400" />
      <span className="text-sm font-medium text-neutral-600 dark:text-neutral-300">
        {busy ? "Uploading…" : "Click to upload an image"}
      </span>
      <span className="text-xs text-neutral-400">
        or paste a URL below
      </span>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(event) => handleFile(event.target.files?.[0])}
      />
    </button>
  );
}
