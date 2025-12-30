import api, { type ApiResponse } from "@/lib/api";
import { z } from "zod";

// Zod Schema for validation
const TagSchema = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
  created_at: z.string(),
  updated_at: z.string().optional(),
});

const TagListResponseSchema = z.object({
  status: z.union([z.boolean(), z.number()]),
  message: z.string(),
  data: z.array(TagSchema),
});

const SingleTagResponseSchema = z.object({
  status: z.union([z.boolean(), z.number()]),
  message: z.string(),
  data: TagSchema,
});

// Types
export type Tag = z.infer<typeof TagSchema>;

export interface CreateTagData {
  name: string;
}

export interface UpdateTagData extends Partial<CreateTagData> {}

/**
 * Get all tags
 */
export const getAllTags = async (): Promise<Tag[]> => {
  try {
    const response = await api.get<ApiResponse<Tag[]>>("/tags");
    const result = TagListResponseSchema.safeParse(response.data);
    if (result.success) {
      return result.data.data;
    }
    return response.data.data || [];
  } catch (error) {
    console.error("Failed to fetch tags:", error);
    throw error;
  }
};

/**
 * Get tag by ID
 */
export const getTagById = async (id: number): Promise<Tag> => {
  try {
    const response = await api.get<ApiResponse<Tag>>(`/tags/${id}`);
    const result = SingleTagResponseSchema.safeParse(response.data);
    if (result.success) {
      return result.data.data;
    }
    return response.data.data;
  } catch (error) {
    console.error(`Failed to fetch tag ${id}:`, error);
    throw error;
  }
};

/**
 * Create a new tag (Admin only)
 */
export const createTag = async (data: CreateTagData): Promise<Tag> => {
  try {
    const response = await api.post<ApiResponse<Tag>>("/tags", data);
    return response.data.data;
  } catch (error) {
    console.error("Failed to create tag:", error);
    throw error;
  }
};

/**
 * Update a tag (Admin only)
 */
export const updateTag = async (id: number, data: UpdateTagData): Promise<void> => {
  try {
    await api.put(`/tags/${id}`, data);
  } catch (error) {
    console.error(`Failed to update tag ${id}:`, error);
    throw error;
  }
};

/**
 * Delete a tag (Admin only)
 */
export const deleteTag = async (id: number): Promise<void> => {
  try {
    await api.delete(`/tags/${id}`);
  } catch (error) {
    console.error(`Failed to delete tag ${id}:`, error);
    throw error;
  }
};
