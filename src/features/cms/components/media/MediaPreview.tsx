"use client";
import { useState } from "react";
import { ArticleImage } from "@/shared/components/common/ArticleImage";
import { cn } from "@/shared/lib/cn";
type Ratio = "16:9" | "9:16" | "2:3";
type Variant = "card" | "lead";
interface MediaPreviewProps {
  src: string | null;
  title: string;
  summary?: string;
  ratio?: Ratio;
  defaultVariant?: Variant;
}
interface PreviewControlsProps {
  ratio: Ratio;
  mobile: boolean;
  setMobile: (value: boolean) => void;
  variant: Variant;
  setVariant: (value: Variant) => void;
}
function previewChoices({
  ratio,
  mobile,
  setMobile,
  variant,
  setVariant,
}: PreviewControlsProps) {
  return [
    { label: "Mobile", selected: mobile, select: () => setMobile(true) },
    { label: "Desktop", selected: !mobile, select: () => setMobile(false) },
    ...(ratio === "16:9"
      ? [
          {
            label: "Card",
            selected: variant === "card",
            select: () => setVariant("card"),
          },
          {
            label: "Lead",
            selected: variant === "lead",
            select: () => setVariant("lead"),
          },
        ]
      : []),
  ];
}
function PreviewControls(props: PreviewControlsProps) {
  const choices = previewChoices(props);
  return (
    <div className="flex flex-wrap items-center gap-2 border-b border-neutral-300 p-3 text-xs dark:border-neutral-700">
      <span className="mr-auto font-semibold">Preview · {props.ratio}</span>
      {choices.map((choice) => (
        <button
          key={choice.label}
          type="button"
          aria-pressed={choice.selected}
          className={cn(
            "min-h-11 rounded border px-2",
            choice.selected
              ? "border-current font-semibold"
              : "border-transparent",
          )}
          onClick={choice.select}
        >
          {choice.label}
        </button>
      ))}
    </div>
  );
}
function PreviewMedia({
  src,
  title,
  ratio,
}: {
  src: string | null;
  title: string;
  ratio: Ratio;
}) {
  const shape =
    ratio === "9:16"
      ? "aspect-[9/16] max-w-[240px]"
      : ratio === "2:3"
        ? "aspect-[2/3] max-w-[240px]"
        : "aspect-video";
  return (
    <div className={cn("relative mx-auto bg-neutral-100", shape)}>
      <ArticleImage src={src} alt={title} />
    </div>
  );
}
function PreviewCopy({
  title,
  summary,
  mobile,
  variant,
}: {
  title: string;
  summary?: string;
  mobile: boolean;
  variant: Variant;
}) {
  return (
    <>
      <h3
        className={cn(
          "mt-3 font-bold leading-tight",
          variant === "lead"
            ? mobile
              ? "text-[28px]"
              : "text-4xl"
            : "text-xl",
        )}
      >
        {title}
      </h3>
      {summary ? (
        <p className="mt-2 line-clamp-3 text-sm leading-6 text-neutral-600">
          {summary}
        </p>
      ) : null}
    </>
  );
}
export function MediaPreview({
  src,
  title,
  summary,
  ratio = "16:9",
  defaultVariant = "card",
}: MediaPreviewProps) {
  const [mobile, setMobile] = useState(true);
  const [variant, setVariant] = useState<Variant>(defaultVariant);
  return (
    <section className="overflow-hidden rounded-lg border border-neutral-300 dark:border-neutral-700">
      <PreviewControls
        ratio={ratio}
        mobile={mobile}
        setMobile={setMobile}
        variant={variant}
        setVariant={setVariant}
      />
      <div
        className={cn(
          "mx-auto bg-white p-4 text-ink",
          mobile ? "max-w-[360px]" : "max-w-[640px]",
        )}
      >
        <PreviewMedia src={src} title={title} ratio={ratio} />
        <PreviewCopy
          title={title}
          summary={summary}
          mobile={mobile}
          variant={variant}
        />
      </div>
    </section>
  );
}
