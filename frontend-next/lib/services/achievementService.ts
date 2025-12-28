import api, { type ApiResponse } from "@/lib/api";
import { z } from "zod";

// Zod Schema for validation
const AchievementSchema = z.object({
  id: z.number(),
  title: z.string(),
  subtitle: z.string(),
  description: z.string(),
  icon: z.string(),
  color: z.string(),
  created_at: z.string(),
  updated_at: z.string().optional(),
});

const AchievementListResponseSchema = z.object({
  status: z.union([z.boolean(), z.number()]),
  message: z.string(),
  data: z.array(AchievementSchema),
});

const SingleAchievementResponseSchema = z.object({
  status: z.union([z.boolean(), z.number()]),
  message: z.string(),
  data: AchievementSchema,
});

// Types
export type Achievement = z.infer<typeof AchievementSchema>;

export interface CreateAchievementData {
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  color: string;
}

export interface UpdateAchievementData extends Partial<CreateAchievementData> {}

/**
 * Get all achievements
 */
export const getAllAchievements = async (): Promise<Achievement[]> => {
  try {
    const response = await api.get<ApiResponse<Achievement[]>>("/achievements");

    const result = AchievementListResponseSchema.safeParse(response.data);
    if (result.success) {
      return result.data.data;
    }

    console.error("Zod Validation Failed (getAllAchievements):", result.error);
    // Fallback to raw data if validation fails
    return response.data.data || [];
  } catch (error) {
    console.error("Failed to fetch achievements:", error);
    return [];
  }
};

/**
 * Get achievement by ID
 */
export const getAchievementById = async (id: number): Promise<Achievement | null> => {
  try {
    const response = await api.get<ApiResponse<Achievement>>(`/achievements/${id}`);

    const result = SingleAchievementResponseSchema.safeParse(response.data);
    if (result.success) {
      return result.data.data;
    }

    console.error("Zod Validation Failed (getAchievementById):", result.error);
    return response.data.data || null;
  } catch (error) {
    console.error(`Failed to fetch achievement ${id}:`, error);
    return null;
  }
};

/**
 * Create a new achievement
 */
export const createAchievement = async (data: CreateAchievementData): Promise<Achievement> => {
  try {
    const response = await api.post<ApiResponse<Achievement>>("/achievements", data);

    const result = SingleAchievementResponseSchema.safeParse(response.data);
    if (result.success) {
      return result.data.data;
    }

    console.error("Zod Validation Failed (createAchievement):", result.error);
    return response.data.data;
  } catch (error) {
    console.error("Failed to create achievement:", error);
    throw error;
  }
};

/**
 * Update an existing achievement
 */
export const updateAchievement = async (
  id: number,
  data: UpdateAchievementData
): Promise<boolean> => {
  try {
    await api.put(`/achievements/${id}`, data);
    return true;
  } catch (error) {
    console.error(`Failed to update achievement ${id}:`, error);
    throw error;
  }
};

/**
 * Delete an achievement
 */
export const deleteAchievement = async (id: number): Promise<boolean> => {
  try {
    await api.delete(`/achievements/${id}`);
    return true;
  } catch (error) {
    console.error(`Failed to delete achievement ${id}:`, error);
    throw error;
  }
};
