"use client";

import { useEffect, useState } from "react";

import { PlacementCheckboxes } from "@/features/cms/components/articles/PlacementCheckboxes";
import { Button } from "@/features/cms/components/ui/Button";
import { Modal } from "@/features/cms/components/ui/Modal";
import type { ArticlePlacement } from "@/features/cms/types/cms.types";

interface PlacementModalProps {
  open: boolean;
  title: string;
  initialPlacements: ArticlePlacement[];
  loading?: boolean;
  onClose: () => void;
  onConfirm: (placements: ArticlePlacement[]) => void;
}

export function PlacementModal({
  open,
  title,
  initialPlacements,
  loading,
  onClose,
  onConfirm,
}: PlacementModalProps) {
  const [placements, setPlacements] = useState<ArticlePlacement[]>(initialPlacements);

  useEffect(() => {
    if (open) setPlacements(initialPlacements);
  }, [open, initialPlacements]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Manage placement"
      size="sm"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={() => onConfirm(placements)} loading={loading}>
            Save placements
          </Button>
        </>
      }
    >
      <p className="mb-4 text-sm text-neutral-500">
        Choose where <span className="font-medium text-neutral-800 dark:text-neutral-200">{title}</span> appears on the site. Independent of publish status.
      </p>
      <PlacementCheckboxes
        idPrefix="modal-placement"
        value={placements}
        onChange={setPlacements}
      />
    </Modal>
  );
}
