"use client";
import { useCategoryEditorialForm } from "@/features/cms/hooks/useCategoryEditorialForm";
import { PageHeader } from "@/features/cms/components/layout/PageHeader";
import {
  CategoryLayoutPanel,
  CategoryEditorialPreview,
} from "@/features/cms/components/editorial/CategoryEditorialPanels";
export function CategoryEditorialView() {
  const model = useCategoryEditorialForm();
  if (!model.isSuperadmin) return <p>Superadmin access required.</p>;
  return (
    <>
      <PageHeader
        title="Tampilan kategori"
        description="Lead di tengah, pendamping di kiri, Latest/video kategori di kanan ketika cukup konten. Pilihan kosong memakai fallback published terbaru."
      />
      <CategoryLayoutPanel model={model} />
      <CategoryEditorialPreview model={model} />
    </>
  );
}
