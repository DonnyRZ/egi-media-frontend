"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/features/cms/components/ui/Button";
import { Field } from "@/features/cms/components/ui/Field";
import { Input } from "@/features/cms/components/ui/Input";
import { Modal } from "@/features/cms/components/ui/Modal";
import { Select } from "@/features/cms/components/ui/Select";
import { addAuthorSchema, type AddAuthorValues } from "@/features/cms/schemas/cms.schemas";

interface AddAuthorModalProps {
  open: boolean;
  saving: boolean;
  onClose: () => void;
  onSubmit: (values: AddAuthorValues) => void;
}

const ROLE_OPTIONS = [
  { value: "author", label: "Author" },
  { value: "superadmin", label: "Super Admin" },
];

const EMPTY: AddAuthorValues = {
  fullName: "",
  email: "",
  password: "",
  role: "author",
};

export function AddAuthorModal({
  open,
  saving,
  onClose,
  onSubmit,
}: AddAuthorModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddAuthorValues>({
    resolver: zodResolver(addAuthorSchema),
    defaultValues: EMPTY,
  });

  useEffect(() => {
    if (open) reset(EMPTY);
  }, [open, reset]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Add user"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={handleSubmit(onSubmit)} loading={saving}>
            Create user
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <Field label="Full name" htmlFor="author-name" error={errors.fullName?.message} required>
          <Input id="author-name" invalid={Boolean(errors.fullName)} {...register("fullName")} />
        </Field>
        <Field label="Role" htmlFor="author-role" error={errors.role?.message} required>
          <Select
            id="author-role"
            options={ROLE_OPTIONS}
            invalid={Boolean(errors.role)}
            {...register("role")}
          />
        </Field>
        <Field label="Email" htmlFor="author-email" error={errors.email?.message} required>
          <Input
            id="author-email"
            type="email"
            invalid={Boolean(errors.email)}
            {...register("email")}
          />
        </Field>
        <Field
          label="Temporary password"
          htmlFor="author-password"
          error={errors.password?.message}
          hint="The author can change this later in settings."
          required
        >
          <Input
            id="author-password"
            type="password"
            invalid={Boolean(errors.password)}
            {...register("password")}
          />
        </Field>
      </div>
    </Modal>
  );
}
