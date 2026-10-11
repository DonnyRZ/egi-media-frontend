"use client";

import Image from "next/image";
import { useState } from "react";

import { Button } from "@/features/cms/components/ui/Button";
import { Icons } from "@/features/cms/components/ui/Icons";
import { MediaPickerModal } from "@/features/cms/components/media/MediaPickerModal";

interface FeaturedImagePickerProps {
  value: string | null | undefined;
  onChange: (url: string | null) => void;
}

export function FeaturedImagePicker({ value, onChange }: FeaturedImagePickerProps) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      {value ? (
        <div className="group relative aspect-[16/9] w-full overflow-hidden rounded-lg border border-neutral-200 dark:border-neutral-800">
          <Image
            src={value}
            alt="Featured"
            fill
            className="object-cover"
            unoptimized
          />
          <div className="absolute inset-0 flex items-center justify-center gap-2 bg-neutral-900/50 opacity-0 transition-opacity group-hover:opacity-100">
            <Button size="sm" variant="secondary" onClick={() => setOpen(true)}>
              Replace
            </Button>
            <Button size="sm" variant="danger" onClick={() => onChange(null)}>
              Remove
            </Button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex aspect-[16/9] w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-neutral-300 text-neutral-400 transition-colors hover:border-accent hover:text-accent dark:border-neutral-700"
        >
          <Icons.media className="h-7 w-7" />
          <span className="text-sm font-medium">Set featured image</span>
        </button>
      )}

      <MediaPickerModal
        open={open}
        title="Featured image"
        onClose={() => setOpen(false)}
        onSelect={(url) => {
          onChange(url);
          setOpen(false);
        }}
      />
    </div>
  );
}
