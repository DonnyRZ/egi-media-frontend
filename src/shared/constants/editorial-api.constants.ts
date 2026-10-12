export const EDITORIAL_API = {
  category: (id: string) =>
    `/api/v1/categories/${encodeURIComponent(id)}/editorial`,
  programs: "/api/v1/video-programs",
  collections: "/api/v1/video-collections",
  settings: "/api/v1/video-hub/settings",
  cmsVideos: "/api/v1/cms/youtube-videos",
  cmsPrograms: "/api/v1/cms/video-programs",
  cmsCollections: "/api/v1/cms/video-collections",
};
