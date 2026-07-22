export const API_ENDPOINTS = {
  articles: "/api/v1/articles",
  articlesMe: "/api/v1/articles/me",
  articlesManage: "/api/v1/articles/manage",
  articlesStats: "/api/v1/articles/stats",
  youtubeVideoById: (id: string) => `/api/v1/youtube-videos/${id}`,
  articleById: (id: string) => `/api/v1/articles/${id}`,
  articleBySlug: (slug: string) =>
    `/api/v1/articles/slug/${encodeURIComponent(slug)}`,
  articleView: (id: string) => `/api/v1/articles/${id}/view`,
  articleShare: (id: string) => `/api/v1/articles/${id}/share`,
  articleStatus: (id: string) => `/api/v1/articles/${id}/status`,
  articlePlacements: (id: string) => `/api/v1/articles/${id}/placements`,
  categories: "/api/v1/categories",
  categoryById: (idOrSlug: string) =>
    `/api/v1/categories/${encodeURIComponent(idOrSlug)}`,
  topics: "/api/v1/topics",
  topicById: (idOrSlug: string) =>
    `/api/v1/topics/${encodeURIComponent(idOrSlug)}`,
  tags: "/api/v1/tags",
  tagById: (id: string) => `/api/v1/tags/${id}`,
  series: "/api/v1/series",
  seriesById: (id: string) => `/api/v1/series/${id}`,
  users: "/api/v1/users",
  userById: (id: string) => `/api/v1/users/${id}`,
  adminUsers: "/api/v1/admin/users",
  userProfile: "/api/v1/users/me/profile",
  auditLogs: "/api/v1/audit-logs",
  newsletters: "/api/v1/newsletters",
  youtubeVideos: "/api/v1/youtube-videos",
  uploads: "/api/v1/uploads",
  columns: "/api/v1/columns",
  columnsMe: "/api/v1/columns/me",
  columnMeById: (id: string) => `/api/v1/columns/me/${id}`,
  columnById: (id: string) => `/api/v1/columns/${id}`,
  columnBySlug: (slug: string) =>
    `/api/v1/columns/slug/${encodeURIComponent(slug)}`,
  columnSubmit: (id: string) => `/api/v1/columns/${id}/submit`,
  columnView: (id: string) => `/api/v1/columns/${id}/view`,
  columnShare: (id: string) => `/api/v1/columns/${id}/share`,
  columnSave: (id: string) => `/api/v1/columns/${id}/save`,
  columnsSaved: "/api/v1/columns/saved",
  columnComments: (id: string) => `/api/v1/columns/${id}/comments`,
  columnCommentById: (columnId: string, commentId: string) =>
    `/api/v1/columns/${columnId}/comments/${commentId}`,
} as const;

export const API_TIMEOUT_MS = 15_000;
