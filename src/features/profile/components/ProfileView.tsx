"use client";

import { useAuthStore } from "@/features/auth/stores/auth.store";
import { ProfileNameForm } from "@/features/profile/components/ProfileNameForm";
import { ProfilePasswordForm } from "@/features/profile/components/ProfilePasswordForm";
import { ProfileSignInPrompt } from "@/features/profile/components/ProfileSignInPrompt";
import { Container } from "@/shared/components/layout/Container";
import { Section } from "@/shared/components/layout/Section";
import { Skeleton } from "@/shared/components/ui/Skeleton";

function ProfileSkeleton() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Skeleton className="h-72 w-full" />
      <Skeleton className="h-72 w-full" />
    </div>
  );
}

export function ProfileView() {
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isHydrated) {
    return (
      <Section>
        <Container>
          <ProfileSkeleton />
        </Container>
      </Section>
    );
  }

  if (!isAuthenticated) {
    return (
      <Section>
        <Container>
          <ProfileSignInPrompt />
        </Container>
      </Section>
    );
  }

  return (
    <Section>
      <Container>
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
          <ProfileNameForm />
          <ProfilePasswordForm />
        </div>
      </Container>
    </Section>
  );
}
