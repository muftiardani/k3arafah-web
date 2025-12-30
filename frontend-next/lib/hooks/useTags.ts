import { useQuery, useMutation, useQueryClient, UseQueryOptions } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getAllTags,
  getTagById,
  createTag,
  updateTag,
  deleteTag,
  type Tag,
  type CreateTagData,
  type UpdateTagData,
} from "@/lib/services/tagService";

/**
 * Query key factory for tags
 */
export const tagKeys = {
  all: ["tags"] as const,
  lists: () => [...tagKeys.all, "list"] as const,
  details: () => [...tagKeys.all, "detail"] as const,
  detail: (id: number) => [...tagKeys.details(), id] as const,
};

/**
 * Hook for fetching all tags with caching
 */
export function useTags(options?: Omit<UseQueryOptions<Tag[]>, "queryKey" | "queryFn">) {
  return useQuery({
    queryKey: tagKeys.lists(),
    queryFn: getAllTags,
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
}

/**
 * Hook for fetching a single tag by ID
 */
export function useTag(
  id: number,
  options?: Omit<UseQueryOptions<Tag | null>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: tagKeys.detail(id),
    queryFn: () => getTagById(id),
    staleTime: 5 * 60 * 1000,
    enabled: !!id,
    ...options,
  });
}

/**
 * Hook for creating a new tag
 */
export function useCreateTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTagData) => createTag(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tagKeys.lists() });
      toast.success("Tag berhasil ditambahkan");
    },
    onError: (error: Error) => {
      toast.error(`Gagal menambahkan tag: ${error.message}`);
    },
  });
}

/**
 * Hook for updating a tag
 */
export function useUpdateTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateTagData }) => updateTag(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: tagKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: tagKeys.detail(variables.id),
      });
      toast.success("Tag berhasil diperbarui");
    },
    onError: (error: Error) => {
      toast.error(`Gagal memperbarui tag: ${error.message}`);
    },
  });
}

/**
 * Hook for deleting a tag
 */
export function useDeleteTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteTag(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tagKeys.lists() });
      toast.success("Tag berhasil dihapus");
    },
    onError: (error: Error) => {
      toast.error(`Gagal menghapus tag: ${error.message}`);
    },
  });
}
