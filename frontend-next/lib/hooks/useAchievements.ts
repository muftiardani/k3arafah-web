import { useQuery, useMutation, useQueryClient, UseQueryOptions } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getAllAchievements,
  getAchievementById,
  createAchievement,
  updateAchievement,
  deleteAchievement,
  type Achievement,
  type CreateAchievementData,
  type UpdateAchievementData,
} from "@/lib/services/achievementService";

/**
 * Query key factory for achievements
 */
export const achievementKeys = {
  all: ["achievements"] as const,
  lists: () => [...achievementKeys.all, "list"] as const,
  details: () => [...achievementKeys.all, "detail"] as const,
  detail: (id: number) => [...achievementKeys.details(), id] as const,
};

/**
 * Hook for fetching all achievements with caching
 */
export function useAchievements(
  options?: Omit<UseQueryOptions<Achievement[]>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: achievementKeys.lists(),
    queryFn: getAllAchievements,
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
}

/**
 * Hook for fetching a single achievement by ID
 */
export function useAchievement(
  id: number,
  options?: Omit<UseQueryOptions<Achievement | null>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: achievementKeys.detail(id),
    queryFn: () => getAchievementById(id),
    staleTime: 5 * 60 * 1000,
    enabled: !!id,
    ...options,
  });
}

/**
 * Hook for creating a new achievement
 */
export function useCreateAchievement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAchievementData) => createAchievement(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: achievementKeys.lists() });
      toast.success("Prestasi berhasil ditambahkan");
    },
    onError: (error: Error) => {
      toast.error(`Gagal menambahkan prestasi: ${error.message}`);
    },
  });
}

/**
 * Hook for updating an achievement
 */
export function useUpdateAchievement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateAchievementData }) =>
      updateAchievement(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: achievementKeys.lists() });
      queryClient.invalidateQueries({ queryKey: achievementKeys.detail(variables.id) });
      toast.success("Prestasi berhasil diperbarui");
    },
    onError: (error: Error) => {
      toast.error(`Gagal memperbarui prestasi: ${error.message}`);
    },
  });
}

/**
 * Hook for deleting an achievement with optimistic update
 */
export function useDeleteAchievement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (achievementId: number) => deleteAchievement(achievementId),

    onMutate: async (achievementId: number) => {
      await queryClient.cancelQueries({ queryKey: achievementKeys.lists() });
      const previousAchievements = queryClient.getQueryData<Achievement[]>(achievementKeys.lists());
      queryClient.setQueryData<Achievement[]>(achievementKeys.lists(), (old) =>
        old?.filter((achievement) => achievement.id !== achievementId)
      );
      return { previousAchievements };
    },

    onError: (error: Error, _achievementId, context) => {
      queryClient.setQueryData(achievementKeys.lists(), context?.previousAchievements);
      toast.error(`Gagal menghapus prestasi: ${error.message}`);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: achievementKeys.lists() });
    },

    onSuccess: () => {
      toast.success("Prestasi berhasil dihapus");
    },
  });
}

/**
 * Prefetch achievement detail
 */
export function usePrefetchAchievement() {
  const queryClient = useQueryClient();

  return (id: number) => {
    queryClient.prefetchQuery({
      queryKey: achievementKeys.detail(id),
      queryFn: () => getAchievementById(id),
      staleTime: 5 * 60 * 1000,
    });
  };
}
