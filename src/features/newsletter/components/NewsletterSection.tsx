"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

import { Button } from "@/shared/components/ui/Button";
import { Container } from "@/shared/components/layout/Container";
import { Section } from "@/shared/components/layout/Section";
import { ErrorState } from "@/shared/components/common/ErrorState";
import { Skeleton } from "@/shared/components/ui/Skeleton";
import { useNewsletter } from "@/features/homepage/hooks/useNewsletter";

export function NewsletterSection() {
  const { data, isLoading, isError, error, refetch } = useNewsletter();
  const [email, setEmail] = useState("");
  const newsletter = data?.items[0];
  const t = useTranslations("newsletter");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setEmail("");
  };

  return (
    <Section ariaLabelledby="newsletter-heading" className="bg-ink text-white">
      <Container>
        <div className="grid items-center gap-8 lg:grid-cols-[1.4fr_1fr]">
          <div className="border-l-4 border-accent pl-6">
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-8 w-64 bg-neutral-700" />
                <Skeleton className="h-4 w-full max-w-xl bg-neutral-700" />
                <Skeleton className="h-12 w-full max-w-md bg-neutral-700" />
              </div>
            ) : null}

            {isError ? (
              <ErrorState message={error?.message} onRetry={() => void refetch()} />
            ) : null}

            {!isLoading && !isError ? (
              <>
                <span className="kicker">{t("kicker")}</span>
                <h2
                  id="newsletter-heading"
                  className="mt-2 font-serif text-3xl font-bold leading-tight sm:text-4xl"
                >
                  {newsletter?.title ?? t("fallbackTitle")}
                </h2>
                <p className="mt-3 max-w-xl text-base leading-7 text-neutral-300">
                  {t("description")}
                </p>
                <form className="mt-6 flex max-w-md flex-col gap-3 sm:flex-row" onSubmit={handleSubmit}>
                  <label className="sr-only" htmlFor="newsletter-email">
                    {t("emailLabel")}
                  </label>
                  <input
                    className="flex-1 border border-neutral-600 bg-transparent px-4 py-2.5 text-sm text-white placeholder:text-neutral-500 focus-visible:border-accent focus-visible:outline-none"
                    id="newsletter-email"
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder={t("emailPlaceholder")}
                    required
                    type="email"
                    value={email}
                  />
                  <Button className="rounded-none bg-accent hover:bg-accent/90 focus-visible:ring-accent" type="submit">
                    {t("subscribe")}
                  </Button>
                </form>
              </>
            ) : null}
          </div>

          <div
            aria-hidden="true"
            className="hidden text-right text-white lg:block"
          >
            <p className="font-serif text-7xl font-bold leading-none">EGI</p>
            <p className="mt-3 text-sm uppercase tracking-[0.2em] text-neutral-400">
              {t("tagline")}
            </p>
          </div>
        </div>
      </Container>
    </Section>
  );
}
