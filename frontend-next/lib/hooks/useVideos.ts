import { useQuery, useMutation, useQueryClient, UseQueryOptions } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getAllVideos,
  getVideoById,
  createVideo,
  updateVideo,
  deleteVideo,
  type Video,
  type CreateVideoData,
  type UpdateVideoData,
} from "@/lib/services/videoService";

/**
 * Query key factory for videos
 */
export const videoKeys = {
  all: ["videos"] as const,
  lists: () => [...videoKeys.all, "list"] as const,
  details: () => [...videoKeys.all, "detail"] as const,
  detail: (id: number) => [...videoKeys.details(), id] as const,
};

/**
 * Hook for fetching all videos with caching
 */
export function useVideos(options?: Omit<UseQueryOptions<Video[]>, "queryKey" | "queryFn">) {
  return useQuery({
    queryKey: videoKeys.lists(),
    queryFn: getAllVideos,
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
}

/**
 * Hook for fetching a single video by ID
 */
export function useVideo(
  id: number,
  options?: Omit<UseQueryOptions<Video | null>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: videoKeys.detail(id),
    queryFn: () => getVideoById(id),
    staleTime: 5 * 60 * 1000,
    enabled: !!id,
    ...options,
  });
}

/**
 * Hook for creating a new video
 */
export function useCreateVideo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateVideoData) => createVideo(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: videoKeys.lists() });
      toast.success("Video berhasil ditambahkan");
    },
    onError: (error: Error) => {
      toast.error(`Gagal menambahkan video: ${error.message}`);
    },
  });
}

/**
 * Hook for updating a video
 */
export function useUpdateVideo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateVideoData }) => updateVideo(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: videoKeys.lists() });
      queryClient.invalidateQueries({ queryKey: videoKeys.detail(variables.id) });
      toast.success("Video berhasil diperbarui");
    },
    onError: (error: Error) => {
      toast.error(`Gagal memperbarui video: ${error.message}`);
    },
  });
}

/**
 * Hook for deleting a video with optimistic update
 */
export function useDeleteVideo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (videoId: number) => deleteVideo(videoId),

    onMutate: async (videoId: number) => {
      await queryClient.cancelQueries({ queryKey: videoKeys.lists() });
      const previousVideos = queryClient.getQueryData<Video[]>(videoKeys.lists());
      queryClient.setQueryData<Video[]>(videoKeys.lists(), (old) =>
        old?.filter((video) => video.id !== videoId)
      );
      return { previousVideos };
    },

    onError: (error: Error, _videoId, context) => {
      queryClient.setQueryData(videoKeys.lists(), context?.previousVideos);
      toast.error(`Gagal menghapus video: ${error.message}`);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: videoKeys.lists() });
    },

    onSuccess: () => {
      toast.success("Video berhasil dihapus");
    },
  });
}

/**
 * Prefetch video detail
 */
export function usePrefetchVideo() {
  const queryClient = useQueryClient();

  return (id: number) => {
    queryClient.prefetchQuery({
      queryKey: videoKeys.detail(id),
      queryFn: () => getVideoById(id),
      staleTime: 5 * 60 * 1000,
    });
  };
}
