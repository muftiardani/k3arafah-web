import api, { type ApiResponse } from "@/lib/api";
import { z } from "zod";

/**
 * PSB Registration Data - matches backend RegisterSantriRequest DTO
 * @see backend-go/internal/dto/psb_dto.go
 */
export interface PSBRegistrationData {
  // Santri Data
  full_name: string;
  nik: string; // 16 digit NIK
  birth_place: string;
  birth_date: string; // ISO Date string (YYYY-MM-DD)
  gender: "L" | "P"; // L = Laki-laki, P = Perempuan
  address: string;

  // Parent Data
  father_name: string;
  father_job: string;
  mother_name: string;
  mother_job: string;
  parent_phone: string;

  // Education Data
  school_origin: string;
  school_address: string;
  graduation_year: string; // 4 digit year

  // Optional
  photo_url?: string;
}

// Zod Schema for Santri (Registrant)
const SantriSchema = z.object({
  id: z.number(),
  full_name: z.string(),
  nik: z.string(),
  birth_place: z.string(),
  birth_date: z.string(),
  gender: z.string(),
  address: z.string(),
  parent_name: z.string(),
  parent_phone: z.string(),
  photo_url: z.string().optional().nullable(),
  status: z.string(),
  nis: z.string().optional().nullable(),
  class: z.string().optional().nullable(),
  entry_year: z.number().optional().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
});

const SantriListResponseSchema = z.object({
  status: z.union([z.boolean(), z.number()]),
  message: z.string(),
  data: z.array(SantriSchema),
});

const SingleSantriResponseSchema = z.object({
  status: z.union([z.boolean(), z.number()]),
  message: z.string(),
  data: SantriSchema,
});

// Types
export type Santri = z.infer<typeof SantriSchema>;

export type SantriStatus = "PENDING" | "VERIFIED" | "ACCEPTED" | "REJECTED";

export interface VerifySantriData {
  nis: string;
  class: string;
  entry_year: number;
}

/**
 * Register new santri (public)
 */
export const registerPSB = async (data: PSBRegistrationData): Promise<boolean> => {
  try {
    await api.post("/psb/register", data);
    return true;
  } catch (error) {
    console.error("Failed to register PSB:", error);
    throw error;
  }
};

/**
 * Get all registrants (admin)
 */
export const getAllRegistrants = async (status?: SantriStatus): Promise<Santri[]> => {
  try {
    const url = status ? `/psb/registrants?status=${status}` : "/psb/registrants";
    const res = await api.get<ApiResponse<Santri[]>>(url);

    const result = SantriListResponseSchema.safeParse(res.data);
    if (result.success) {
      return result.data.data;
    }

    console.error("Zod Validation Failed (getAllRegistrants):", result.error);
    return res.data.data || [];
  } catch (error) {
    console.error("Failed to fetch registrants:", error);
    return [];
  }
};

/**
 * Get registrant by ID (admin)
 */
export const getRegistrantById = async (id: number): Promise<Santri | null> => {
  try {
    const res = await api.get<ApiResponse<Santri>>(`/psb/registrants/${id}`);

    const result = SingleSantriResponseSchema.safeParse(res.data);
    if (result.success) {
      return result.data.data;
    }

    console.error("Zod Validation Failed (getRegistrantById):", result.error);
    return res.data.data || null;
  } catch (error) {
    console.error(`Failed to fetch registrant ${id}:`, error);
    return null;
  }
};

/**
 * Update registrant status (admin)
 */
export const updateRegistrantStatus = async (
  id: number,
  status: SantriStatus
): Promise<boolean> => {
  try {
    await api.put(`/psb/registrants/${id}/status`, { status });
    return true;
  } catch (error) {
    console.error(`Failed to update registrant ${id} status:`, error);
    throw error;
  }
};

/**
 * Verify and accept registrant (admin)
 */
export const verifyRegistrant = async (id: number, data: VerifySantriData): Promise<boolean> => {
  try {
    await api.put(`/psb/registrants/${id}/verify`, data);
    return true;
  } catch (error) {
    console.error(`Failed to verify registrant ${id}:`, error);
    throw error;
  }
};
