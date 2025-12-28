import api, { type ApiResponse } from "@/lib/api";
import { z } from "zod";

// Zod Schema for validation
const VideoSchema = z.object({
  id: z.number(),
  title: z.string(),
  youtube_id: z.string(),
  thumbnail: z.string(),
  created_at: z.string(),
  updated_at: z.string().optional(),
});

const VideoListResponseSchema = z.object({
  status: z.union([z.boolean(), z.number()]),
  message: z.string(),
  data: z.array(VideoSchema),
});

const SingleVideoResponseSchema = z.object({
  status: z.union([z.boolean(), z.number()]),
  message: z.string(),
  data: VideoSchema,
});

// Types
export type Video = z.infer<typeof VideoSchema>;

export interface CreateVideoData {
  title: string;
  youtube_id: string;
  thumbnail?: string;
}

export interface UpdateVideoData extends Partial<CreateVideoData> {}

/**
 * Get all videos
 */
export const getAllVideos = async (): Promise<Video[]> => {
  try {
    const response = await api.get<ApiResponse<Video[]>>("/videos");

    const result = VideoListResponseSchema.safeParse(response.data);
    if (result.success) {
      return result.data.data;
    }

    console.error("Zod Validation Failed (getAllVideos):", result.error);
    // Fallback to raw data if validation fails
    return response.data.data || [];
  } catch (error) {
    console.error("Failed to fetch videos:", error);
    return [];
  }
};

/**
 * Get video by ID
 */
export const getVideoById = async (id: number): Promise<Video | null> => {
  try {
    const response = await api.get<ApiResponse<Video>>(`/videos/${id}`);

    const result = SingleVideoResponseSchema.safeParse(response.data);
    if (result.success) {
      return result.data.data;
    }

    console.error("Zod Validation Failed (getVideoById):", result.error);
    return response.data.data || null;
  } catch (error) {
    console.error(`Failed to fetch video ${id}:`, error);
    return null;
  }
};

/**
 * Create a new video
 */
export const createVideo = async (data: CreateVideoData): Promise<Video> => {
  try {
    const response = await api.post<ApiResponse<Video>>("/videos", data);

    const result = SingleVideoResponseSchema.safeParse(response.data);
    if (result.success) {
      return result.data.data;
    }

    console.error("Zod Validation Failed (createVideo):", result.error);
    return response.data.data;
  } catch (error) {
    console.error("Failed to create video:", error);
    throw error;
  }
};

/**
 * Update an existing video
 */
export const updateVideo = async (id: number, data: UpdateVideoData): Promise<boolean> => {
  try {
    await api.put(`/videos/${id}`, data);
    return true;
  } catch (error) {
    console.error(`Failed to update video ${id}:`, error);
    throw error;
  }
};

/**
 * Delete a video
 */
export const deleteVideo = async (id: number): Promise<boolean> => {
  try {
    await api.delete(`/videos/${id}`);
    return true;
  } catch (error) {
    console.error(`Failed to delete video ${id}:`, error);
    throw error;
  }
};
