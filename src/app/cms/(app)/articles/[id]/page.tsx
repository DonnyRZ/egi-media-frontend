import { ArticleEditorView } from "@/features/cms/components/articles/ArticleEditorView";

interface EditArticlePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditArticlePage({ params }: EditArticlePageProps) {
  const { id } = await params;
  return <ArticleEditorView articleId={id} />;
}
