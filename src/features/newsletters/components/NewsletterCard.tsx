"use client";

import { useTranslations } from "next-intl";

import { NewsletterSubscribeButton } from "@/features/newsletters/components/NewsletterSubscribeButton";
import type { Newsletter } from "@/features/newsletters/types/newsletter.types";

interface NewsletterCardProps {
  newsletter: Newsletter;
  isSubscribed: boolean;
  isPending: boolean;
  errorMessage: string | null;
  onToggle: (id: string) => void;
}

export function NewsletterCard({
  newsletter,
  isSubscribed,
  isPending,
  errorMessage,
  onToggle,
}: NewsletterCardProps) {
  const t = useTranslations("newslettersPage");

  return (
    <article className="flex h-full flex-col border border-neutral-200 bg-white p-5 transition-shadow hover:shadow-md">
      <div className="flex items-center justify-between gap-3">
        <span className="inline-flex items-center bg-primary-100 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-primary-900">
          {t(`frequency.${newsletter.frequency}`)}
        </span>
        {isSubscribed ? (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wide text-success">
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-success" />
            {t("subscribed")}
          </span>
        ) : null}
      </div>

      <h3 className="mt-3 font-serif text-xl font-bold leading-snug text-ink">
        {newsletter.name}
      </h3>
      <p className="mt-2 flex-1 text-sm leading-6 text-neutral-600">
        {newsletter.description ?? t("noDescription")}
      </p>

      <div className="mt-5">
        <NewsletterSubscribeButton
          isPending={isPending}
          isSubscribed={isSubscribed}
          onToggle={() => onToggle(newsletter.id)}
        />
        {errorMessage ? (
          <p className="mt-2 text-xs text-error" role="alert">
            {errorMessage}
          </p>
        ) : null}
      </div>
    </article>
  );
}
