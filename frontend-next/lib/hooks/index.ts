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

// Video Hooks
export {
  videoKeys,
  useVideos,
  useVideo,
  useCreateVideo,
  useUpdateVideo,
  useDeleteVideo,
  usePrefetchVideo,
} from "./useVideos";

// Achievement Hooks
export {
  achievementKeys,
  useAchievements,
  useAchievement,
  useCreateAchievement,
  useUpdateAchievement,
  useDeleteAchievement,
  usePrefetchAchievement,
} from "./useAchievements";

// Auth Hooks
export { authKeys, useLogin, useLogout, useAuth, useForceLogout } from "./useAuth";

// Admin Hooks
export { adminKeys, useAdmins, useCreateAdmin, useDeleteAdmin } from "./useAdmin";
