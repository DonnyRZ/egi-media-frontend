"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/features/cms/components/ui/Button";
import { Card, CardBody, CardHeader } from "@/features/cms/components/ui/Card";
import { Field } from "@/features/cms/components/ui/Field";
import { Input } from "@/features/cms/components/ui/Input";
import { useAccountMutations } from "@/features/cms/hooks/useAccount";
import {
  changePasswordSchema,
  type ChangePasswordValues,
} from "@/features/cms/schemas/cms.schemas";
import { useToast } from "@/features/cms/stores/cms-toast.store";

const EMPTY: ChangePasswordValues = {
  oldPassword: "",
  newPassword: "",
  confirmPassword: "",
};

export function ChangePasswordForm() {
  const toast = useToast();
  const { changeUserPassword } = useAccountMutations();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: EMPTY,
  });

  async function submit(values: ChangePasswordValues) {
    try {
      await changeUserPassword.mutateAsync({
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
      });
      toast.success("Password changed");
      reset(EMPTY);
    } catch {
      toast.error("Could not change password. Check your current password.");
    }
  }

  return (
    <Card>
      <CardHeader
        title="Change password"
        description="Use a strong password with at least 8 characters."
      />
      <CardBody>
        <form onSubmit={handleSubmit(submit)} className="space-y-4">
          <Field
            label="Current password"
            htmlFor="old-password"
            error={errors.oldPassword?.message}
            required
          >
            <Input
              id="old-password"
              type="password"
              invalid={Boolean(errors.oldPassword)}
              {...register("oldPassword")}
            />
          </Field>
          <Field
            label="New password"
            htmlFor="new-password"
            error={errors.newPassword?.message}
            required
          >
            <Input
              id="new-password"
              type="password"
              invalid={Boolean(errors.newPassword)}
              {...register("newPassword")}
            />
          </Field>
          <Field
            label="Confirm new password"
            htmlFor="confirm-password"
            error={errors.confirmPassword?.message}
            required
          >
            <Input
              id="confirm-password"
              type="password"
              invalid={Boolean(errors.confirmPassword)}
              {...register("confirmPassword")}
            />
          </Field>
          <div className="flex justify-end">
            <Button type="submit" loading={changeUserPassword.isPending}>
              Update password
            </Button>
          </div>
        </form>
      </CardBody>
    </Card>
  );
}
