import api from "@/lib/api";

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

export const registerPSB = async (data: PSBRegistrationData): Promise<boolean> => {
  try {
    await api.post("/psb/register", data);
    return true;
  } catch (error) {
    console.error("Failed to register PSB:", error);
    throw error;
  }
};
