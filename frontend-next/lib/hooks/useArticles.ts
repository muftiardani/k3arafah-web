import { useQuery, useMutation, useQueryClient, UseQueryOptions } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getAllArticles,
  getPaginatedArticles,
  getArticleBySlug,
  createArticle,
  updateArticle,
  deleteArticle,
  Article,
  PaginatedResponse,
  CreateArticleData,
  UpdateArticleData,
} from "@/lib/services/articleService";

/**
 * Query key factory for articles
 * Provides type-safe, consistent query keys across the application
 */
export const articleKeys = {
  all: ["articles"] as const,
  lists: () => [...articleKeys.all, "list"] as const,
  list: (page: number, limit: number) => [...articleKeys.lists(), { page, limit }] as const,
  details: () => [...articleKeys.all, "detail"] as const,
  detail: (slug: string) => [...articleKeys.details(), slug] as const,
};

/**
 * Hook for fetching all articles (non-paginated)
 */
export function useArticles(options?: Omit<UseQueryOptions<Article[]>, "queryKey" | "queryFn">) {
  return useQuery({
    queryKey: articleKeys.lists(),
    queryFn: getAllArticles,
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
}

/**
 * Hook for fetching paginated articles
 */
export function usePaginatedArticles(
  page: number = 1,
  limit: number = 6,
  options?: Omit<UseQueryOptions<PaginatedResponse<Article>>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: articleKeys.list(page, limit),
    queryFn: () => getPaginatedArticles(page, limit),
    staleTime: 5 * 60 * 1000,
    placeholderData: (previousData) => previousData, // Keep previous data while fetching
    ...options,
  });
}

/**
 * Hook for fetching a single article by slug
 */
export function useArticle(
  slug: string,
  options?: Omit<UseQueryOptions<Article | null>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: articleKeys.detail(slug),
    queryFn: () => getArticleBySlug(slug),
    staleTime: 10 * 60 * 1000, // 10 minutes for detail views
    enabled: !!slug,
    ...options,
  });
}

/**
 * Hook for creating a new article
 */
export function useCreateArticle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateArticleData) => createArticle(data),
    onSuccess: () => {
      // Invalidate all article lists to refetch with new article
      queryClient.invalidateQueries({ queryKey: articleKeys.lists() });
      toast.success("Artikel berhasil dibuat");
    },
    onError: (error: Error) => {
      toast.error(`Gagal membuat artikel: ${error.message}`);
    },
  });
}

/**
 * Hook for updating an existing article
 */
export function useUpdateArticle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateArticleData }) => updateArticle(id, data),
    onSuccess: (_, { id }) => {
      // Invalidate both list and detail queries
      queryClient.invalidateQueries({ queryKey: articleKeys.lists() });
      queryClient.invalidateQueries({ queryKey: articleKeys.details() });
      toast.success("Artikel berhasil diperbarui");
    },
    onError: (error: Error) => {
      toast.error(`Gagal memperbarui artikel: ${error.message}`);
    },
  });
}

/**
 * Hook for deleting an article with optimistic update
 */
export function useDeleteArticle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (articleId: number) => deleteArticle(articleId),

    // Optimistic update - remove from UI immediately
    onMutate: async (articleId: number) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: articleKeys.lists() });

      // Snapshot previous values for all list queries
      const previousLists = queryClient.getQueriesData<Article[]>({
        queryKey: articleKeys.lists(),
      });

      // Optimistically remove from all list caches
      queryClient.setQueriesData<Article[]>({ queryKey: articleKeys.lists() }, (old) =>
        old?.filter((article) => article.id !== articleId)
      );

      // Also handle paginated responses
      queryClient.setQueriesData<PaginatedResponse<Article>>(
        { queryKey: articleKeys.lists() },
        (old) => {
          if (old?.items) {
            return {
              ...old,
              items: old.items.filter((article) => article.id !== articleId),
              meta: {
                ...old.meta,
                total_items: old.meta.total_items - 1,
              },
            };
          }
          return old;
        }
      );

      // Return context with previous values for rollback
      return { previousLists };
    },

    // Rollback on error
    onError: (error: Error, articleId, context) => {
      // Restore previous values on error
      context?.previousLists.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });
      toast.error(`Gagal menghapus artikel: ${error.message}`);
    },

    // Refetch to ensure consistency
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: articleKeys.lists() });
    },

    onSuccess: () => {
      toast.success("Artikel berhasil dihapus");
    },
  });
}

/**
 * Prefetch article for faster navigation
 */
export function usePrefetchArticle() {
  const queryClient = useQueryClient();

  return (slug: string) => {
    queryClient.prefetchQuery({
      queryKey: articleKeys.detail(slug),
      queryFn: () => getArticleBySlug(slug),
      staleTime: 10 * 60 * 1000,
    });
  };
}
