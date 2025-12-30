import { useQuery, useMutation, useQueryClient, UseQueryOptions } from "@tanstack/react-query";
import { toast } from "sonner";
import { getAllAdmins, createAdmin, deleteAdmin } from "@/lib/services/authService";
import type { User } from "@/lib/services/authService";

export interface CreateAdminData {
  username: string;
  password: string;
  role: string;
}

/**
 * Query key factory for users/admins
 */
export const userKeys = {
  all: ["users"] as const,
  admins: () => [...userKeys.all, "admins"] as const,
};

/**
 * Hook for fetching all admin users
 */
export function useAdmins(options?: Omit<UseQueryOptions<User[]>, "queryKey" | "queryFn">) {
  return useQuery({
    queryKey: userKeys.admins(),
    queryFn: getAllAdmins,
    staleTime: 5 * 60 * 1000,
    ...options,
  });
}

/**
 * Hook for creating a new admin
 */
export function useCreateAdmin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAdminData) => createAdmin(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.admins() });
      toast.success("Admin berhasil dibuat");
    },
    onError: (error: Error) => {
      toast.error(`Gagal membuat admin: ${error.message}`);
    },
  });
}

/**
 * Hook for deleting an admin
 */
export function useDeleteAdmin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (adminId: number) => deleteAdmin(adminId),
    onMutate: async (adminId: number) => {
      await queryClient.cancelQueries({ queryKey: userKeys.admins() });
      const previousAdmins = queryClient.getQueryData<User[]>(userKeys.admins());
      queryClient.setQueryData<User[]>(userKeys.admins(), (old) =>
        old?.filter((admin) => admin.id !== adminId)
      );
      return { previousAdmins };
    },
    onError: (error: Error, _id, context) => {
      queryClient.setQueryData(userKeys.admins(), context?.previousAdmins);
      toast.error(`Gagal menghapus admin: ${error.message}`);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.admins() });
    },
    onSuccess: () => {
      toast.success("Admin berhasil dihapus");
    },
  });
}

// Re-export User type for convenience
export type { User } from "@/lib/services/authService";
