"use client";
import { useAuthStore } from "@/features/auth/stores/auth.store";
import { useTopicSubscriptionToggle } from "@/features/topic-subscriptions/hooks/useTopicSubscriptionToggle";
import { TopicSubscribeToggle } from "@/features/topic-subscriptions/components/TopicSubscribeToggle";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
export function TopicFollow({ id }: { id: string }) {
  const loggedIn = useAuthStore((s) => s.isAuthenticated);
  const toggle = useTopicSubscriptionToggle();
  const t = useTranslations("topicSubscriptionsPage");
  return (
    <div>
      {loggedIn ? (
        <TopicSubscribeToggle
          isSubscribed={toggle.isSubscribed(id)}
          isPending={toggle.isPending(id)}
          onToggle={() => void toggle.toggle(id)}
        />
      ) : (
        <Link
          className="inline-flex min-h-11 items-center border border-ink px-4 font-semibold"
          href="/login"
        >
          {t("subscribe")}
        </Link>
      )}
      {toggle.errorFor(id) ? (
        <p role="alert" className="mt-2 text-sm text-error">
          {toggle.errorFor(id)}
        </p>
      ) : null}
    </div>
  );
}
