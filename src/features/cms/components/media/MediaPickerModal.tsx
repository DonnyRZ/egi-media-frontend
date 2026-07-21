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

  function handleInsert() {
    const trimmed = url.trim();
    if (!trimmed) {
      setError("Enter an image URL");
      return;
    }
    try {
      new URL(trimmed);
    } catch {
      setError("Enter a valid URL");
      return;
    }
    onSelect(trimmed);
    setUrl("");
    setError(null);
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleInsert}>Insert</Button>
        </>
      }
    >
      <div className="space-y-4">
        <ImageUpload onUploaded={(uploadedUrl) => setUrl(uploadedUrl)} />

        <Field label="Image URL" htmlFor="media-url" error={error ?? undefined}>
          <Input
            id="media-url"
            placeholder="https://…"
            value={url}
            onChange={(event) => setUrl(event.target.value)}
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
