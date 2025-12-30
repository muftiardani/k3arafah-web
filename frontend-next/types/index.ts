/**
 * Centralized type exports
 * Re-exports from service files which have complete Zod-validated definitions
 */

// Re-export Santri types from psbService (single source of truth)
export type {
  Santri,
  SantriStatus,
  VerifySantriData,
  PSBRegistrationData,
} from "@/lib/services/psbService";

// Re-export Article types from articleService (single source of truth)
export type {
  Article,
  PaginatedResponse,
  PaginationMeta,
  CreateArticleData,
  UpdateArticleData,
} from "@/lib/services/articleService";

// Re-export Gallery types from galleryService
export type {
  Gallery,
  GalleryPhoto,
  CreateGalleryData,
  UpdateGalleryData,
} from "@/lib/services/galleryService";

// Re-export Video types from videoService
export type { Video, CreateVideoData, UpdateVideoData } from "@/lib/services/videoService";

// Re-export Achievement types from achievementService
export type {
  Achievement,
  CreateAchievementData,
  UpdateAchievementData,
} from "@/lib/services/achievementService";

// Re-export Message types from contactService
export type { Message, ContactFormData } from "@/lib/services/contactService";

// Re-export User type from authService (single source of truth)
export type { User } from "@/lib/services/authService";

export interface ApiResponse<T> {
  status: boolean;
  message: string;
  data: T;
  error?: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: number;
    username: string;
    role: string;
  };
}
