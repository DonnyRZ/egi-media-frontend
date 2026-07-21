"use client";

import { PageHeader } from "@/features/cms/components/layout/PageHeader";
import { Badge } from "@/features/cms/components/ui/Badge";
import { Card, CardBody, CardHeader } from "@/features/cms/components/ui/Card";
import { ChangePasswordForm } from "@/features/cms/components/settings/ChangePasswordForm";
import { ProfileForm } from "@/features/cms/components/settings/ProfileForm";
import { useAuthStore } from "@/features/auth/stores/auth.store";

export function SettingsView() {
  const user = useAuthStore((state) => state.user);

  return (
    <>
      <PageHeader
        title="Settings"
        description="Manage your account, profile, and security."
      />

      <div className="space-y-6">
        <Card>
          <CardHeader title="Account" />
          <CardBody>
            <dl className="grid gap-4 sm:grid-cols-3">
              <div>
                <dt className="text-xs uppercase tracking-wide text-neutral-500">
                  Name
                </dt>
                <dd className="mt-1 text-sm font-medium text-neutral-900 dark:text-neutral-100">
                  {user?.fullName ?? "—"}
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-neutral-500">
                  Email
                </dt>
                <dd className="mt-1 text-sm font-medium text-neutral-900 dark:text-neutral-100">
                  {user?.email ?? "—"}
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-neutral-500">
                  Role
                </dt>
                <dd className="mt-1">
                  <Badge tone={user?.role === "superadmin" ? "success" : "info"}>
                    {user?.role ?? "—"}
                  </Badge>
                </dd>
              </div>
            </dl>
          </CardBody>
        </Card>

        <ProfileForm />
        <ChangePasswordForm />
      </div>
    </>
  );
}
