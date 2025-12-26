import api from "@/lib/api";

export interface PSBRegistrationData {
  full_name: string;
  gender: "male" | "female";
  birth_place: string;
  birth_date: string; // ISO Date string
  address: string;
  previous_school: string;
  parent_name: string;
  parent_phone: string;
  program: string; // "reguler" | "tahfidz" | "kitab"
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
