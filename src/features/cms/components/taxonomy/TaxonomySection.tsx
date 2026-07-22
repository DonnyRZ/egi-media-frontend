"use client";

import { Button } from "@/features/cms/components/ui/Button";
import { Card, CardHeader } from "@/features/cms/components/ui/Card";
import { Icons } from "@/features/cms/components/ui/Icons";
import {
  EmptyState,
  ErrorState,
  LoadingState,
} from "@/features/cms/components/ui/StateViews";
import { TaxonomyItemRow } from "@/features/cms/components/taxonomy/TaxonomyItemRow";
import type { TaxonomyKind } from "@/features/cms/hooks/useCmsTaxonomy";
import type { CmsTaxonomyItem } from "@/features/cms/services/cms-taxonomy.service";

interface TaxonomySectionProps {
  kind: TaxonomyKind;
  title: string;
  description: string;
  singular: string;
  items: CmsTaxonomyItem[];
  isLoading: boolean;
  isError: boolean;
  canManage: boolean;
  onCreate: () => void;
  onEdit: (item: CmsTaxonomyItem) => void;
  onDelete: (item: CmsTaxonomyItem) => void;
}

export function TaxonomySection({
  kind,
  title,
  description,
  singular,
  items,
  isLoading,
  isError,
  canManage,
  onCreate,
  onEdit,
  onDelete,
}: TaxonomySectionProps) {
  return (
    <Card>
      <CardHeader
        title={`${title}${items.length ? ` (${items.length})` : ""}`}
        description={description}
        action={
          canManage ? (
            <Button size="sm" onClick={onCreate}>
              <Icons.plus className="h-4 w-4" /> New {singular.toLowerCase()}
            </Button>
          ) : undefined
        }
      />
      {isLoading ? (
        <LoadingState />
      ) : isError ? (
        <ErrorState />
      ) : items.length === 0 ? (
        <EmptyState title={`No ${title.toLowerCase()} yet`} />
      ) : (
        <ul className="divide-y divide-neutral-100 dark:divide-neutral-800">
          {items.map((item) => (
            <TaxonomyItemRow
              key={item.id}
              kind={kind}
              item={item}
              canManage={canManage}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </ul>
      )}
    </Card>
  );
}
