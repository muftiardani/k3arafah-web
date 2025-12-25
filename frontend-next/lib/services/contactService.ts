import api from "@/lib/api";

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface Message extends ContactFormData {
  id: number;
  is_read: boolean;
  created_at: string;
}

export const submitContactForm = async (data: ContactFormData): Promise<boolean> => {
  try {
    await api.post("/contact", data);
    return true;
  } catch (error) {
    console.error("Failed to submit contact form:", error);
    throw error;
  }
};

export const getAllMessages = async (): Promise<Message[]> => {
  try {
    const res = await api.get("/messages");
    return res.data.data;
  } catch (error) {
    console.error("Failed to fetch messages:", error);
    throw error;
  }
};

export const deleteMessage = async (id: number): Promise<boolean> => {
  try {
    await api.delete(`/messages/${id}`);
    return true;
  } catch (error) {
    console.error("Failed to delete message:", error);
    throw error;
  }
};
