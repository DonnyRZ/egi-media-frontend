import { MediaCatalogView } from "@/features/cms/components/videos/MediaCatalogView";
import { EditorialCmsProvider } from "@/features/cms/components/editorial/EditorialCmsProvider";
export default function Page() {
  return (
    <EditorialCmsProvider>
      <MediaCatalogView />
    </EditorialCmsProvider>
  );
}
