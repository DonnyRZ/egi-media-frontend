"use client";

import { useState } from "react";

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

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setEmail("");
  };

  return (
    <Section ariaLabelledby="newsletter-heading" className="bg-primary-100">
      <Container>
        <div className="grid items-center gap-8 rounded-2xl border border-primary-500/20 bg-white p-8 shadow-sm lg:grid-cols-[1.4fr_1fr] lg:p-12">
          <div>
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-4 w-full max-w-xl" />
                <Skeleton className="h-12 w-full max-w-md" />
              </div>
            ) : null}

            {isError ? (
              <ErrorState message={error?.message} onRetry={() => void refetch()} />
            ) : null}

            {!isLoading && !isError ? (
              <>
                <h2
                  id="newsletter-heading"
                  className="text-2xl font-bold text-neutral-900 sm:text-3xl"
                >
                  {newsletter?.title ?? "Stay ahead with EGI Media"}
                </h2>
                <p className="mt-3 max-w-xl text-base leading-7 text-neutral-700">
                  {newsletter?.description ??
                    "Get premium editorial insights delivered to your inbox. Curated reporting for professionals who need clarity."}
                </p>
                <form className="mt-6 flex max-w-md flex-col gap-3 sm:flex-row" onSubmit={handleSubmit}>
                  <label className="sr-only" htmlFor="newsletter-email">
                    Email address
                  </label>
                  <input
                    className="flex-1 rounded-lg border border-neutral-300 px-4 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                    id="newsletter-email"
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="Enter your email"
                    required
                    type="email"
                    value={email}
                  />
                  <Button type="submit">Subscribe</Button>
                </form>
              </>
            ) : null}
          </div>

          <div
            aria-hidden="true"
            className="hidden items-center justify-center rounded-xl bg-primary-900 p-8 text-center text-white lg:flex"
          >
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-primary-100">
                Premium Editorial
              </p>
              <p className="mt-4 text-4xl font-bold">EGI</p>
              <p className="mt-2 text-sm text-primary-100">Trusted insights. Clean design.</p>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
