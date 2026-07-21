"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";

import { useAuthStore } from "@/features/auth/stores/auth.store";
import { Button } from "@/features/cms/components/ui/Button";
import { EmptyState, LoadingState } from "@/features/cms/components/ui/StateViews";
import {
  CMS_ALLOWED_ROLES,
  CMS_BASE_PATH,
} from "@/features/cms/constants/cms.constants";
import type { CmsRole } from "@/features/cms/types/cms.types";

interface RouteGuardProps {
  children: ReactNode;
  requireSuperadmin?: boolean;
}

export function RouteGuard({ children, requireSuperadmin }: RouteGuardProps) {
  const router = useRouter();
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);

  const role = user?.role as CmsRole | undefined;
  const isCmsUser = Boolean(role && CMS_ALLOWED_ROLES.includes(role));

  useEffect(() => {
    if (isHydrated && !isAuthenticated) {
      router.replace(`${CMS_BASE_PATH}/login`);
    }
  }, [isHydrated, isAuthenticated, router]);

  if (!isHydrated || (!isAuthenticated && !user)) {
    return <LoadingState label="Checking your session…" />;
  }

  if (isAuthenticated && !isCmsUser) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <EmptyState
          title="No CMS access"
          description="Your account does not have editorial permissions. Contact a Super Admin if you believe this is a mistake."
          action={
            <Button variant="secondary" onClick={() => router.replace("/")}>
              Back to site
            </Button>
          }
        />
      </div>
    );
  }

  if (requireSuperadmin && role !== "superadmin") {
    return (
      <EmptyState
        title="Super Admin only"
        description="You don't have permission to view this section."
      />
    );
  }

  if (!isAuthenticated) {
    return <LoadingState label="Redirecting…" />;
  }

  return <>{children}</>;
}
