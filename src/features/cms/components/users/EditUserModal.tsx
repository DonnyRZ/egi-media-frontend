"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/features/cms/components/ui/Button";
import { Field } from "@/features/cms/components/ui/Field";
import { Input } from "@/features/cms/components/ui/Input";
import { Modal } from "@/features/cms/components/ui/Modal";
import { Select } from "@/features/cms/components/ui/Select";
import { editUserSchema, type EditUserValues } from "@/features/cms/schemas/cms.schemas";
import type { CmsUser } from "@/features/cms/types/cms.types";

const ROLE_OPTIONS = [
  { value: "superadmin", label: "Super Admin" },
  { value: "author", label: "Author" },
  { value: "member", label: "Member" },
  { value: "visitor", label: "Visitor" },
];

interface EditUserModalProps {
  open: boolean;
  saving: boolean;
  user: CmsUser | null;
  onClose: () => void;
  onSubmit: (values: EditUserValues) => void;
}

export function EditUserModal({
  open,
  saving,
  user,
  onClose,
  onSubmit,
}: EditUserModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditUserValues>({
    resolver: zodResolver(editUserSchema),
    defaultValues: { fullName: "", role: "author" },
  });

  useEffect(() => {
    if (open && user) {
      reset({
        fullName: user.fullName,
        role: (user.role as EditUserValues["role"]) ?? "author",
      });
    }
  }, [open, user, reset]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Edit user"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={handleSubmit(onSubmit)} loading={saving}>
            Save changes
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <Field label="Full name" htmlFor="user-name" error={errors.fullName?.message} required>
          <Input id="user-name" invalid={Boolean(errors.fullName)} {...register("fullName")} />
        </Field>
        <Field label="Role" htmlFor="user-role" error={errors.role?.message} required>
          <Select id="user-role" options={ROLE_OPTIONS} {...register("role")} />
        </Field>
      </div>
    </Modal>
  );
}
