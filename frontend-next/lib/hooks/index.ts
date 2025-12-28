// Article Hooks
export {
  articleKeys,
  useArticles,
  usePaginatedArticles,
  useArticle,
  useCreateArticle,
  useUpdateArticle,
  useDeleteArticle,
  usePrefetchArticle,
} from "./useArticles";

// Gallery Hooks
export {
  galleryKeys,
  useGalleries,
  useGallery,
  useCreateGallery,
  useDeleteGallery,
  useUploadGalleryPhoto,
  useDeleteGalleryPhoto,
  usePrefetchGallery,
} from "./useGalleries";

// Auth Hooks
export { authKeys, useLogin, useLogout, useAuth, useForceLogout } from "./useAuth";

// Admin Hooks
export { adminKeys, useAdmins, useCreateAdmin, useDeleteAdmin } from "./useAdmin";
