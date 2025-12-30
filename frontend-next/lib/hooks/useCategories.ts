import { useQuery, useMutation, useQueryClient, UseQueryOptions } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  type Category,
  type CreateCategoryData,
  type UpdateCategoryData,
} from "@/lib/services/categoryService";

/**
 * Query key factory for categories
 */
export const categoryKeys = {
  all: ["categories"] as const,
  lists: () => [...categoryKeys.all, "list"] as const,
  details: () => [...categoryKeys.all, "detail"] as const,
  detail: (id: number) => [...categoryKeys.details(), id] as const,
};

/**
 * Hook for fetching all categories with caching
 */
export function useCategories(options?: Omit<UseQueryOptions<Category[]>, "queryKey" | "queryFn">) {
  return useQuery({
    queryKey: categoryKeys.lists(),
    queryFn: getAllCategories,
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
}

/**
 * Hook for fetching a single category by ID
 */
export function useCategory(
  id: number,
  options?: Omit<UseQueryOptions<Category | null>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: categoryKeys.detail(id),
    queryFn: () => getCategoryById(id),
    staleTime: 5 * 60 * 1000,
    enabled: !!id,
    ...options,
  });
}

/**
 * Hook for creating a new category
 */
export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCategoryData) => createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
      toast.success("Kategori berhasil ditambahkan");
    },
    onError: (error: Error) => {
      toast.error(`Gagal menambahkan kategori: ${error.message}`);
    },
  });
}

/**
 * Hook for updating a category
 */
export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateCategoryData }) =>
      updateCategory(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: categoryKeys.detail(variables.id),
      });
      toast.success("Kategori berhasil diperbarui");
    },
    onError: (error: Error) => {
      toast.error(`Gagal memperbarui kategori: ${error.message}`);
    },
  });
}

/**
 * Hook for deleting a category
 */
export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
      toast.success("Kategori berhasil dihapus");
    },
    onError: (error: Error) => {
      toast.error(`Gagal menghapus kategori: ${error.message}`);
    },
  });
}
