import { useQuery, useMutation, useQueryClient, UseQueryOptions } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getAllGalleries,
  getGalleryDetail,
  createGallery,
  updateGallery,
  deleteGallery,
  uploadGalleryPhoto,
  deleteGalleryPhoto,
  Gallery,
  CreateGalleryData,
  UpdateGalleryData,
  GalleryPhoto,
} from "@/lib/services/galleryService";

/**
 * Query key factory for galleries
 */
export const galleryKeys = {
  all: ["galleries"] as const,
  lists: () => [...galleryKeys.all, "list"] as const,
  details: () => [...galleryKeys.all, "detail"] as const,
  detail: (id: number) => [...galleryKeys.details(), id] as const,
};

/**
 * Hook for fetching all galleries
 */
export function useGalleries(options?: Omit<UseQueryOptions<Gallery[]>, "queryKey" | "queryFn">) {
  return useQuery({
    queryKey: galleryKeys.lists(),
    queryFn: getAllGalleries,
    staleTime: 5 * 60 * 1000,
    ...options,
  });
}

/**
 * Hook for fetching a single gallery by ID
 */
export function useGallery(
  id: number,
  options?: Omit<UseQueryOptions<Gallery | null>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: galleryKeys.detail(id),
    queryFn: () => getGalleryDetail(id),
    staleTime: 5 * 60 * 1000,
    enabled: !!id,
    ...options,
  });
}

/**
 * Hook for creating a new gallery
 */
export function useCreateGallery() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateGalleryData) => createGallery(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: galleryKeys.lists() });
      toast.success("Galeri berhasil dibuat");
    },
    onError: (error: Error) => {
      toast.error(`Gagal membuat galeri: ${error.message}`);
    },
  });
}

/**
 * Hook for deleting a gallery with optimistic update
 */
export function useDeleteGallery() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (galleryId: number) => deleteGallery(galleryId),

    // Optimistic update
    onMutate: async (galleryId: number) => {
      await queryClient.cancelQueries({ queryKey: galleryKeys.lists() });

      const previousGalleries = queryClient.getQueryData<Gallery[]>(galleryKeys.lists());

      queryClient.setQueryData<Gallery[]>(galleryKeys.lists(), (old) =>
        old?.filter((gallery) => gallery.id !== galleryId)
      );

      return { previousGalleries };
    },

    onError: (error: Error, galleryId, context) => {
      queryClient.setQueryData(galleryKeys.lists(), context?.previousGalleries);
      toast.error(`Gagal menghapus galeri: ${error.message}`);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: galleryKeys.lists() });
    },

    onSuccess: () => {
      toast.success("Galeri berhasil dihapus");
    },
  });
}

/**
 * Hook for updating a gallery
 */
export function useUpdateGallery() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateGalleryData }) => updateGallery(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: galleryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: galleryKeys.detail(variables.id) });
      toast.success("Galeri berhasil diperbarui");
    },
    onError: (error: Error) => {
      toast.error(`Gagal memperbarui galeri: ${error.message}`);
    },
  });
}

/**
 * Hook for uploading a photo to a gallery
 */
export function useUploadGalleryPhoto(galleryId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => uploadGalleryPhoto(galleryId, file),
    onSuccess: (newPhoto: GalleryPhoto) => {
      // Optimistically add photo to cache
      queryClient.setQueryData<Gallery | null>(galleryKeys.detail(galleryId), (old) => {
        if (!old) return old;
        return {
          ...old,
          photos: [...old.photos, newPhoto],
        };
      });
      queryClient.invalidateQueries({ queryKey: galleryKeys.detail(galleryId) });
      toast.success("Foto berhasil diupload");
    },
    onError: (error: Error) => {
      toast.error(`Gagal mengupload foto: ${error.message}`);
    },
  });
}

/**
 * Hook for deleting a photo with optimistic update
 */
export function useDeleteGalleryPhoto(galleryId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (photoId: number) => deleteGalleryPhoto(photoId),

    onMutate: async (photoId: number) => {
      await queryClient.cancelQueries({ queryKey: galleryKeys.detail(galleryId) });

      const previousGallery = queryClient.getQueryData<Gallery | null>(
        galleryKeys.detail(galleryId)
      );

      queryClient.setQueryData<Gallery | null>(galleryKeys.detail(galleryId), (old) => {
        if (!old) return old;
        return {
          ...old,
          photos: old.photos.filter((p) => p.id !== photoId),
        };
      });

      return { previousGallery };
    },

    onError: (error: Error, photoId, context) => {
      queryClient.setQueryData(galleryKeys.detail(galleryId), context?.previousGallery);
      toast.error(`Gagal menghapus foto: ${error.message}`);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: galleryKeys.detail(galleryId) });
    },

    onSuccess: () => {
      toast.success("Foto berhasil dihapus");
    },
  });
}

/**
 * Prefetch gallery detail
 */
export function usePrefetchGallery() {
  const queryClient = useQueryClient();

  return (id: number) => {
    queryClient.prefetchQuery({
      queryKey: galleryKeys.detail(id),
      queryFn: () => getGalleryDetail(id),
      staleTime: 5 * 60 * 1000,
    });
  };
}
