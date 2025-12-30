import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import {
  getActivityLogs,
  getActivityLogsByUser,
  type PaginatedActivityLogs,
} from "@/lib/services/activityLogService";

/**
 * Query key factory for activity logs
 */
export const activityLogKeys = {
  all: ["activity-logs"] as const,
  lists: () => [...activityLogKeys.all, "list"] as const,
  list: (page: number, limit: number) => [...activityLogKeys.lists(), { page, limit }] as const,
  byUser: (userId: number) => [...activityLogKeys.all, "user", userId] as const,
};

/**
 * Hook for fetching paginated activity logs
 */
export function useActivityLogs(
  page: number = 1,
  limit: number = 20,
  options?: Omit<UseQueryOptions<PaginatedActivityLogs>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: activityLogKeys.list(page, limit),
    queryFn: () => getActivityLogs(page, limit),
    staleTime: 1 * 60 * 1000, // 1 minute - logs should be fresher
    ...options,
  });
}

/**
 * Hook for fetching activity logs by user ID
 */
export function useActivityLogsByUser(
  userId: number,
  page: number = 1,
  limit: number = 20,
  options?: Omit<UseQueryOptions<PaginatedActivityLogs>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: [...activityLogKeys.byUser(userId), { page, limit }],
    queryFn: () => getActivityLogsByUser(userId, page, limit),
    staleTime: 1 * 60 * 1000,
    enabled: !!userId,
    ...options,
  });
}
