"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";

import { uploadImage } from "@/features/cms/services/cms-media.service";
import { ApiError } from "@/shared/lib/errors";
import { cn } from "@/shared/lib/cn";

const MAX_BYTES = 5 * 1024 * 1024;
const ACCEPT = "image/jpeg,image/png,image/webp,image/gif,image/avif";

interface ColumnFeaturedImageFieldProps {
  value?: string | null;
  onChange: (url: string) => void;
  error?: string;
}

export function ColumnFeaturedImageField({
  value,
  onChange,
  error,
}: ColumnFeaturedImageFieldProps) {
  const t = useTranslations("columnsPage");
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setUploadError(null);

    if (!file.type.startsWith("image/")) {
      setUploadError(t("form.featuredImageType"));
      return;
    }
    if (file.size > MAX_BYTES) {
      setUploadError(t("form.featuredImageTooLarge"));
      return;
    }

    setBusy(true);
    try {
      const url = await uploadImage(file);
      onChange(url);
    } catch (err) {
      setUploadError(
        err instanceof ApiError ? err.message : t("form.featuredImageUploadFailed"),
      );
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  const displayError = error || uploadError;

  return (
    <div className="space-y-1.5">
      <p className="block text-xs font-semibold uppercase tracking-wide text-neutral-600">
        {t("form.featuredImage")}
      </p>
      <p className="text-xs text-neutral-500">{t("form.featuredImageHint")}</p>

      {value ? (
        <div className="relative overflow-hidden border border-neutral-300 bg-neutral-50">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt=""
            className="aspect-[16/9] w-full object-cover"
            src={value}
          />
          <div className="flex gap-2 border-t border-neutral-200 bg-white p-3">
            <button
              className="border border-neutral-300 px-3 py-1.5 text-sm font-medium text-ink hover:bg-neutral-50 disabled:opacity-60"
              disabled={busy}
              onClick={() => inputRef.current?.click()}
              type="button"
            >
              {busy ? t("form.featuredImageUploading") : t("form.featuredImageReplace")}
            </button>
            <button
              className="px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-50 disabled:opacity-60"
              disabled={busy}
              onClick={() => {
                setUploadError(null);
                onChange("");
              }}
              type="button"
            >
              {t("form.featuredImageRemove")}
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          disabled={busy}
          onClick={() => inputRef.current?.click()}
          onDragOver={(event) => {
            event.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(event) => {
            event.preventDefault();
            setDragOver(false);
            void handleFile(event.dataTransfer.files?.[0]);
          }}
          className={cn(
            "flex aspect-[16/9] w-full flex-col items-center justify-center gap-2 border-2 border-dashed px-4 text-center transition-colors disabled:opacity-60",
            dragOver
              ? "border-ink bg-neutral-50"
              : "border-neutral-300 hover:border-ink hover:bg-neutral-50",
          )}
        >
          <svg
            aria-hidden
            className="h-8 w-8 text-neutral-400"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.6}
            viewBox="0 0 24 24"
          >
            <rect height="16" rx="1" width="18" x="3" y="4" />
            <circle cx="8.5" cy="9.5" r="1.5" />
            <path d="m5 18 5-5 4 4 3-3 2 2" />
          </svg>
          <span className="text-sm font-medium text-ink">
            {busy ? t("form.featuredImageUploading") : t("form.featuredImageSet")}
          </span>
          <span className="text-xs text-neutral-500">
            {t("form.featuredImageDrop")}
          </span>
        </button>
      )}

      <input
        ref={inputRef}
        accept={ACCEPT}
        className="hidden"
        type="file"
        onChange={(event) => void handleFile(event.target.files?.[0])}
      />

      {displayError ? (
        <p className="text-xs text-red-600">{displayError}</p>
      ) : null}
    </div>
  );
}
