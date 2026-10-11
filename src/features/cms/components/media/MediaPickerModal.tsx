"use client";

import Image from "next/image";
import { useState } from "react";

import { Button } from "@/features/cms/components/ui/Button";
import { Field } from "@/features/cms/components/ui/Field";
import { Input } from "@/features/cms/components/ui/Input";
import { Modal } from "@/features/cms/components/ui/Modal";
import { ImageUpload } from "@/features/cms/components/media/ImageUpload";

interface MediaPickerModalProps {
  open: boolean;
  title?: string;
  onClose: () => void;
  onSelect: (url: string) => void;
}

export function MediaPickerModal({
  open,
  title = "Insert image",
  onClose,
  onSelect,
}: MediaPickerModalProps) {
  const [url, setUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  function handleClose() {
    setUrl("");
    setError(null);
    setUploading(false);
    onClose();
  }

  function handleBusyChange(busy: boolean) {
    setUploading(busy);
    if (busy) {
      setUrl("");
      setError(null);
    }
  }

  function handleInsert() {
    if (uploading) return;
    const trimmed = url.trim();
    if (!trimmed) {
      setError("Enter an image URL");
      return;
    }
    try {
      const parsed = new URL(trimmed);
      if (!["http:", "https:"].includes(parsed.protocol)) throw new Error("Unsupported URL");
    } catch {
      setError("Enter a valid HTTP or HTTPS image URL");
      return;
    }
    onSelect(trimmed);
    setUrl("");
    setError(null);
    setUploading(false);
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={title}
      footer={
        <>
          <Button type="button" variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="button" onClick={handleInsert} disabled={uploading || !url.trim()}>Insert</Button>
        </>
      }
    >
      <div className="space-y-4">
        <ImageUpload onBusyChange={handleBusyChange} onUploaded={(uploadedUrl) => {
          setUrl(uploadedUrl);
          setError(null);
        }} />

        <Field label="Image URL" htmlFor="media-url" error={error ?? undefined}>
          <Input
            id="media-url"
            placeholder="https://…"
            value={url}
            disabled={uploading}
            onChange={(event) => {
              setUrl(event.target.value);
              setError(null);
            }}
          />
        </Field>

        {url.trim() ? (
          <div className="relative h-40 w-full overflow-hidden rounded-lg border border-neutral-200 dark:border-neutral-800">
            <Image
              src={url}
              alt="Preview"
              fill
              className="object-cover"
              unoptimized
              onError={() => setError("Could not load this image")}
            />
          </div>
        ) : null}
      </div>
    </Modal>
  );
}
