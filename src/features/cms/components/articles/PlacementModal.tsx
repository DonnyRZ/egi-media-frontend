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
  initialHeadlinePosition?: number | null;
  loading?: boolean;
  onClose: () => void;
  onConfirm: (
    placements: ArticlePlacement[],
    headlinePosition: number | null,
  ) => void;
}

export function PlacementModal({
  open,
  title,
  initialPlacements,
  initialHeadlinePosition = null,
  loading,
  onClose,
  onConfirm,
}: PlacementModalProps) {
  const [placements, setPlacements] =
    useState<ArticlePlacement[]>(initialPlacements);
  const [headlinePosition, setHeadlinePosition] = useState<number | null>(
    initialHeadlinePosition,
  );

  useEffect(() => {
    if (!open) return;
    setPlacements(initialPlacements);
    setHeadlinePosition(initialHeadlinePosition);
  }, [open, initialPlacements, initialHeadlinePosition]);

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
          <Button
            onClick={() => onConfirm(placements, headlinePosition)}
            loading={loading}
          >
            Save placements
          </Button>
        </>
      }
    >
      <p className="mb-4 text-sm text-neutral-500">
        Choose where{" "}
        <span className="font-medium text-neutral-800 dark:text-neutral-200">
          {title}
        </span>{" "}
        appears on the site. Independent of publish status.
      </p>
      <PlacementCheckboxes
        idPrefix="modal-placement"
        value={placements}
        headlinePosition={headlinePosition}
        onChange={setPlacements}
        onHeadlinePositionChange={setHeadlinePosition}
      />
    </Modal>
  );
}
