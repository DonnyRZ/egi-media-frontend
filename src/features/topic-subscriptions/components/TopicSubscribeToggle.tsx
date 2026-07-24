"use client";

import { useTranslations } from "next-intl";

import { Button } from "@/shared/components/ui/Button";

interface TopicSubscribeToggleProps {
  isSubscribed: boolean;
  isPending: boolean;
  onToggle: () => void;
}

export function TopicSubscribeToggle({
  isSubscribed,
  isPending,
  onToggle,
}: TopicSubscribeToggleProps) {
  const t = useTranslations("topicSubscriptionsPage");

  const label = isPending
    ? t("processing")
    : isSubscribed
      ? t("subscribed")
      : t("subscribe");

  return (
    <Button
      aria-pressed={isSubscribed}
      className="rounded-none"
      disabled={isPending}
      onClick={onToggle}
      type="button"
      variant={isSubscribed ? "secondary" : "primary"}
    >
      {label}
    </Button>
  );
}
