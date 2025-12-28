import api, { type ApiResponse } from "@/lib/api";
import { z } from "zod";

// Zod Schemas for validation
const MessageSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
  subject: z.string(),
  message: z.string(),
  is_read: z.boolean(),
  created_at: z.string(),
  updated_at: z.string().optional(),
});

const MessageListResponseSchema = z.object({
  status: z.union([z.boolean(), z.number()]),
  message: z.string(),
  data: z.array(MessageSchema),
});

// Types
export type Message = z.infer<typeof MessageSchema>;

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

/**
 * Submit contact form (public)
 */
export const submitContactForm = async (data: ContactFormData): Promise<boolean> => {
  try {
    await api.post("/contact", data);
    return true;
  } catch (error) {
    console.error("Failed to submit contact form:", error);
    throw error;
  }
};

/**
 * Get all messages (admin)
 */
export const getAllMessages = async (): Promise<Message[]> => {
  try {
    const res = await api.get<ApiResponse<Message[]>>("/messages");

    const result = MessageListResponseSchema.safeParse(res.data);
    if (result.success) {
      return result.data.data;
    }

    console.error("Zod Validation Failed (getAllMessages):", result.error);
    return res.data.data || [];
  } catch (error) {
    console.error("Failed to fetch messages:", error);
    return [];
  }
};

/**
 * Mark a message as read (admin)
 */
export const markMessageAsRead = async (id: number): Promise<boolean> => {
  try {
    await api.put(`/messages/${id}/read`);
    return true;
  } catch (error) {
    console.error(`Failed to mark message ${id} as read:`, error);
    throw error;
  }
};

/**
 * Delete a message (admin)
 */
export const deleteMessage = async (id: number): Promise<boolean> => {
  try {
    await api.delete(`/messages/${id}`);
    return true;
  } catch (error) {
    console.error(`Failed to delete message ${id}:`, error);
    throw error;
  }
};
