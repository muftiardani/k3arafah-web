import api, { type ApiResponse } from "@/lib/api";
import { z } from "zod";

// Zod Schema for validation
const ActivityLogSchema = z.object({
  id: z.number(),
  user_id: z.number(),
  user: z
    .object({
      id: z.number(),
      username: z.string(),
      role: z.string(),
    })
    .optional(),
  action: z.string(),
  entity_type: z.string(),
  entity_id: z.number().nullable(),
  old_value: z.string().optional(),
  new_value: z.string().optional(),
  ip_address: z.string(),
  user_agent: z.string(),
  created_at: z.string(),
});

const ActivityLogListResponseSchema = z.object({
  status: z.union([z.boolean(), z.number()]),
  message: z.string(),
  data: z.object({
    items: z.array(ActivityLogSchema),
    meta: z.object({
      page: z.number(),
      limit: z.number(),
      total_items: z.number(),
      total_pages: z.number(),
    }),
  }),
});

// Types
export type ActivityLog = z.infer<typeof ActivityLogSchema>;

export type ActivityLogMeta = {
  page: number;
  limit: number;
  total_items: number;
  total_pages: number;
};

export type PaginatedActivityLogs = {
  items: ActivityLog[];
  meta: ActivityLogMeta;
};

/**
 * Get all activity logs with pagination
 */
export const getActivityLogs = async (
  page: number = 1,
  limit: number = 20
): Promise<PaginatedActivityLogs> => {
  try {
    const response = await api.get("/activity-logs", {
      params: { page, limit },
    });

    const result = ActivityLogListResponseSchema.safeParse(response.data);
    if (result.success) {
      return result.data.data;
    }

    // Fallback
    const data = response.data?.data;
    if (data) {
      return {
        items: data.items || [],
        meta: data.meta || { page, limit, total_items: 0, total_pages: 0 },
      };
    }

    return { items: [], meta: { page, limit, total_items: 0, total_pages: 0 } };
  } catch (error) {
    console.error("Failed to fetch activity logs:", error);
    throw error;
  }
};

/**
 * Get activity logs by user ID
 */
export const getActivityLogsByUser = async (
  userId: number,
  page: number = 1,
  limit: number = 20
): Promise<PaginatedActivityLogs> => {
  try {
    const response = await api.get(`/activity-logs/user/${userId}`, {
      params: { page, limit },
    });

    const data = response.data?.data;
    if (data) {
      return {
        items: data.items || [],
        meta: data.meta || { page, limit, total_items: 0, total_pages: 0 },
      };
    }

    return { items: [], meta: { page, limit, total_items: 0, total_pages: 0 } };
  } catch (error) {
    console.error("Failed to fetch activity logs by user:", error);
    throw error;
  }
};
