"use client";

import { useTranslations } from "next-intl";

import { Button } from "@/shared/components/ui/Button";

interface NewsletterSubscribeButtonProps {
  isSubscribed: boolean;
  isPending: boolean;
  onToggle: () => void;
}

export function NewsletterSubscribeButton({
  isSubscribed,
  isPending,
  onToggle,
}: NewsletterSubscribeButtonProps) {
  const t = useTranslations("newslettersPage");

  const label = isPending
    ? t("processing")
    : isSubscribed
      ? t("subscribed")
      : t("subscribe");

  return (
    <Button
      aria-pressed={isSubscribed}
      className="w-full rounded-none sm:w-auto"
      disabled={isPending}
      onClick={onToggle}
      type="button"
      variant={isSubscribed ? "secondary" : "primary"}
    >
      {label}
    </Button>
  );
}
