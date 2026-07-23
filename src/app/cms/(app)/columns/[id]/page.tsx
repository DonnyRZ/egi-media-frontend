import { ColumnEditorView } from "@/features/cms/components/columns/ColumnEditorView";

interface CmsColumnEditPageProps {
  params: Promise<{ id: string }>;
}

export default async function CmsColumnEditPage({
  params,
}: CmsColumnEditPageProps) {
  const { id } = await params;
  return <ColumnEditorView columnId={id} />;
}
