"use client";

import { useState } from "react";

import { Button } from "@/features/cms/components/ui/Button";
import { Modal } from "@/features/cms/components/ui/Modal";
import { Textarea } from "@/features/cms/components/ui/Textarea";

interface ColumnRejectDialogProps {
  open: boolean;
  title: string;
  loading?: boolean;
  onConfirm: (reason: string) => void;
  onClose: () => void;
}

export function ColumnRejectDialog({
  open,
  title,
  loading,
  onConfirm,
  onClose,
}: ColumnRejectDialogProps) {
  const [reason, setReason] = useState("Rejected by editorial review.");
  const trimmed = reason.trim();
  const invalid = trimmed.length < 3;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Reject column"
      size="md"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            variant="danger"
            disabled={loading || invalid}
            loading={loading}
            onClick={() => onConfirm(trimmed)}
          >
            Reject
          </Button>
        </>
      }
    >
      <p className="mb-3 text-sm text-neutral-600 dark:text-neutral-400">
        Reject <span className="font-semibold text-neutral-900 dark:text-neutral-100">{title}</span>?
        The contributor will see this reason.
      </p>
      <Textarea
        aria-label="Rejection reason"
        rows={4}
        value={reason}
        onChange={(event) => setReason(event.target.value)}
        disabled={loading}
      />
      {invalid ? (
        <p className="mt-1.5 text-xs text-error">
          Reason must be at least 3 characters.
        </p>
      ) : null}
    </Modal>
  );
}
