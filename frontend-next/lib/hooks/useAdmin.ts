import { useQuery, useMutation, useQueryClient, UseQueryOptions } from "@tanstack/react-query";
import { toast } from "sonner";
import { getAllAdmins, createAdmin, deleteAdmin, User } from "@/lib/services/authService";

/**
 * Query key factory for admins
 */
export const adminKeys = {
  all: ["admins"] as const,
  list: () => [...adminKeys.all, "list"] as const,
};

/**
 * Create admin data interface
 */
interface CreateAdminData {
  username: string;
  password: string;
}

/**
 * Hook for fetching all admins
 */
export function useAdmins(options?: Omit<UseQueryOptions<User[]>, "queryKey" | "queryFn">) {
  return useQuery({
    queryKey: adminKeys.list(),
    queryFn: getAllAdmins,
    staleTime: 2 * 60 * 1000, // 2 minutes
    ...options,
  });
}

/**
 * Hook for creating a new admin
 */
export function useCreateAdmin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAdminData) =>
      createAdmin({
        username: data.username,
        password: data.password,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.list() });
      toast.success("Admin berhasil dibuat");
    },
    onError: (error: Error) => {
      toast.error(`Gagal membuat admin: ${error.message}`);
    },
  });
}

/**
 * Hook for deleting an admin with optimistic update
 */
export function useDeleteAdmin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (adminId: number) => deleteAdmin(adminId),

    // Optimistic update
    onMutate: async (adminId: number) => {
      await queryClient.cancelQueries({ queryKey: adminKeys.list() });

      const previousAdmins = queryClient.getQueryData<User[]>(adminKeys.list());

      queryClient.setQueryData<User[]>(adminKeys.list(), (old) =>
        old?.filter((admin) => admin.id !== adminId)
      );

      return { previousAdmins };
    },

    onError: (error: Error, adminId, context) => {
      queryClient.setQueryData(adminKeys.list(), context?.previousAdmins);
      toast.error(`Gagal menghapus admin: ${error.message}`);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.list() });
    },

    onSuccess: () => {
      toast.success("Admin berhasil dihapus");
    },
  });
}
