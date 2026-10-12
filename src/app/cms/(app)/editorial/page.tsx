import { CategoryEditorialView } from "@/features/cms/components/editorial/CategoryEditorialView";
import { EditorialCmsProvider } from "@/features/cms/components/editorial/EditorialCmsProvider";
export default function Page() {
  return (
    <EditorialCmsProvider>
      <CategoryEditorialView />
    </EditorialCmsProvider>
  );
}
