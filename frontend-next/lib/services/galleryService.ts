import api, { type ApiResponse } from "@/lib/api";
import { z } from "zod";

// Zod Schemas for validation
const GalleryPhotoSchema = z.object({
  id: z.number(),
  photo_url: z.string(),
  gallery_id: z.number(),
  caption: z.string().optional(),
  created_at: z.string(),
  updated_at: z.string().optional(),
});

const GallerySchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  cover_url: z.string().optional().nullable(),
  event_date: z.string().optional().nullable(),
  photos: z.array(GalleryPhotoSchema).optional().default([]),
  created_at: z.string(),
  updated_at: z.string(),
});

const GalleryListResponseSchema = z.object({
  status: z.union([z.boolean(), z.number()]),
  message: z.string(),
  data: z.array(GallerySchema),
});

const SingleGalleryResponseSchema = z.object({
  status: z.union([z.boolean(), z.number()]),
  message: z.string(),
  data: GallerySchema,
});

const SinglePhotoResponseSchema = z.object({
  status: z.union([z.boolean(), z.number()]),
  message: z.string(),
  data: GalleryPhotoSchema,
});

// Types
export type GalleryPhoto = z.infer<typeof GalleryPhotoSchema>;
export type Gallery = z.infer<typeof GallerySchema>;

export interface CreateGalleryData {
  title: string;
  description: string;
  event_date?: string; // YYYY-MM-DD
}

export interface UpdateGalleryData {
  title?: string;
  description?: string;
  cover_url?: string;
}

/**
 * Get all galleries
 */
export const getAllGalleries = async (): Promise<Gallery[]> => {
  try {
    const res = await api.get<ApiResponse<Gallery[]>>("/galleries");

    const result = GalleryListResponseSchema.safeParse(res.data);
    if (result.success) {
      return result.data.data;
    }

    console.error("Zod Validation Failed (getAllGalleries):", result.error);
    return res.data.data || [];
  } catch (error) {
    console.error("Failed to fetch galleries:", error);
    return [];
  }
};

/**
 * Get gallery detail by ID
 */
export const getGalleryDetail = async (id: number): Promise<Gallery | null> => {
  try {
    const res = await api.get<ApiResponse<Gallery>>(`/galleries/${id}`);

    const result = SingleGalleryResponseSchema.safeParse(res.data);
    if (result.success) {
      return result.data.data;
    }

    console.error("Zod Validation Failed (getGalleryDetail):", result.error);
    return res.data.data || null;
  } catch (error) {
    console.error(`Failed to fetch gallery ${id}:`, error);
    return null;
  }
};

/**
 * Create a new gallery
 */
export const createGallery = async (data: CreateGalleryData): Promise<Gallery> => {
  try {
    const res = await api.post<ApiResponse<Gallery>>("/galleries", data);

    const result = SingleGalleryResponseSchema.safeParse(res.data);
    if (result.success) {
      return result.data.data;
    }

    console.error("Zod Validation Failed (createGallery):", result.error);
    return res.data.data;
  } catch (error) {
    console.error("Failed to create gallery:", error);
    throw error;
  }
};

/**
 * Update an existing gallery
 */
export const updateGallery = async (id: number, data: UpdateGalleryData): Promise<boolean> => {
  try {
    await api.put(`/galleries/${id}`, data);
    return true;
  } catch (error) {
    console.error(`Failed to update gallery ${id}:`, error);
    throw error;
  }
};

/**
 * Delete a gallery
 */
export const deleteGallery = async (id: number): Promise<boolean> => {
  try {
    await api.delete(`/galleries/${id}`);
    return true;
  } catch (error) {
    console.error(`Failed to delete gallery ${id}:`, error);
    throw error;
  }
};

/**
 * Upload a photo to a gallery
 */
export const uploadGalleryPhoto = async (galleryId: number, file: File): Promise<GalleryPhoto> => {
  try {
    const formData = new FormData();
    formData.append("photos", file);

    const res = await api.post<ApiResponse<GalleryPhoto>>(
      `/galleries/${galleryId}/photos`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    const result = SinglePhotoResponseSchema.safeParse(res.data);
    if (result.success) {
      return result.data.data;
    }

    console.error("Zod Validation Failed (uploadGalleryPhoto):", result.error);
    return res.data.data;
  } catch (error) {
    console.error("Failed to upload photo:", error);
    throw error;
  }
};

/**
 * Delete a photo from a gallery
 */
export const deleteGalleryPhoto = async (photoId: number): Promise<boolean> => {
  try {
    await api.delete(`/galleries/photos/${photoId}`);
    return true;
  } catch (error) {
    console.error(`Failed to delete photo ${photoId}:`, error);
    throw error;
  }
};
