import { useQuery, useMutation, useQueryClient, UseQueryOptions } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getAllRegistrants,
  getRegistrantById,
  updateRegistrantStatus,
  verifyRegistrant,
  type Santri,
  type SantriStatus,
  type VerifySantriData,
} from "@/lib/services/psbService";

/**
 * Query key factory for PSB (Registrants/Students)
 */
export const psbKeys = {
  all: ["psb"] as const,
  registrants: () => [...psbKeys.all, "registrants"] as const,
  registrantsList: (status?: SantriStatus) => [...psbKeys.registrants(), { status }] as const,
  students: () => [...psbKeys.all, "students"] as const,
  detail: (id: number) => [...psbKeys.all, "detail", id] as const,
};

/**
 * Hook for fetching all registrants
 */
export function useRegistrants(
  status?: SantriStatus,
  options?: Omit<UseQueryOptions<Santri[]>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: psbKeys.registrantsList(status),
    queryFn: () => getAllRegistrants(status),
    staleTime: 2 * 60 * 1000, // 2 minutes
    ...options,
  });
}

/**
 * Hook for fetching accepted students only
 */
export function useStudents(options?: Omit<UseQueryOptions<Santri[]>, "queryKey" | "queryFn">) {
  return useQuery({
    queryKey: psbKeys.students(),
    queryFn: () => getAllRegistrants("ACCEPTED"),
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
}

/**
 * Hook for fetching a single registrant by ID
 */
export function useRegistrant(
  id: number,
  options?: Omit<UseQueryOptions<Santri | null>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: psbKeys.detail(id),
    queryFn: () => getRegistrantById(id),
    staleTime: 5 * 60 * 1000,
    enabled: !!id,
    ...options,
  });
}

/**
 * Hook for updating registrant status
 */
export function useUpdateRegistrantStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: SantriStatus }) =>
      updateRegistrantStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: psbKeys.registrants() });
      queryClient.invalidateQueries({ queryKey: psbKeys.students() });
      toast.success("Status berhasil diperbarui");
    },
    onError: (error: Error) => {
      toast.error(`Gagal memperbarui status: ${error.message}`);
    },
  });
}

/**
 * Hook for verifying and accepting a registrant
 */
export function useVerifyRegistrant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: VerifySantriData }) =>
      verifyRegistrant(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: psbKeys.registrants() });
      queryClient.invalidateQueries({ queryKey: psbKeys.students() });
      toast.success("Santri berhasil diverifikasi dan diterima");
    },
    onError: (error: Error) => {
      toast.error(`Gagal memverifikasi: ${error.message}`);
    },
  });
}

/**
 * Prefetch registrant detail
 */
export function usePrefetchRegistrant() {
  const queryClient = useQueryClient();

  return (id: number) => {
    queryClient.prefetchQuery({
      queryKey: psbKeys.detail(id),
      queryFn: () => getRegistrantById(id),
      staleTime: 5 * 60 * 1000,
    });
  };
}
