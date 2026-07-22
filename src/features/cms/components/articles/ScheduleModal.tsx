"use client";

import { useState } from "react";

import { Button } from "@/features/cms/components/ui/Button";
import { Field } from "@/features/cms/components/ui/Field";
import { Input } from "@/features/cms/components/ui/Input";
import { Modal } from "@/features/cms/components/ui/Modal";

interface ScheduleModalProps {
  open: boolean;
  loading?: boolean;
  onClose: () => void;
  onConfirm: (isoDate: string) => void;
}

export function ScheduleModal({
  open,
  loading,
  onClose,
  onConfirm,
}: ScheduleModalProps) {
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleConfirm() {
    if (!value) {
      setError("Pick a publish date and time");
      return;
    }
    const date = new Date(value);
    if (date.getTime() <= Date.now()) {
      setError("Scheduled time must be in the future");
      return;
    }
    setError(null);
    onConfirm(date.toISOString());
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Schedule article"
      size="sm"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} loading={loading}>
            Schedule
          </Button>
        </>
      }
    >
      <Field label="Publish at" htmlFor="schedule-at" error={error ?? undefined}>
        <Input
          id="schedule-at"
          type="datetime-local"
          value={value}
          onChange={(event) => setValue(event.target.value)}
        />
      </Field>
    </Modal>
  );
}
