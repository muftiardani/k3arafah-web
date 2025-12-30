import api, { type ApiResponse } from "@/lib/api";
import { z } from "zod";

// Zod Schema for validation
const CategorySchema = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
  description: z.string().optional(),
  created_at: z.string(),
  updated_at: z.string().optional(),
});

const CategoryListResponseSchema = z.object({
  status: z.union([z.boolean(), z.number()]),
  message: z.string(),
  data: z.array(CategorySchema),
});

const SingleCategoryResponseSchema = z.object({
  status: z.union([z.boolean(), z.number()]),
  message: z.string(),
  data: CategorySchema,
});

// Types
export type Category = z.infer<typeof CategorySchema>;

export interface CreateCategoryData {
  name: string;
  description?: string;
}

export interface UpdateCategoryData extends Partial<CreateCategoryData> {}

/**
 * Get all categories
 */
export const getAllCategories = async (): Promise<Category[]> => {
  try {
    const response = await api.get<ApiResponse<Category[]>>("/categories");
    const result = CategoryListResponseSchema.safeParse(response.data);
    if (result.success) {
      return result.data.data;
    }
    return response.data.data || [];
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    throw error;
  }
};

/**
 * Get category by ID
 */
export const getCategoryById = async (id: number): Promise<Category> => {
  try {
    const response = await api.get<ApiResponse<Category>>(`/categories/${id}`);
    const result = SingleCategoryResponseSchema.safeParse(response.data);
    if (result.success) {
      return result.data.data;
    }
    return response.data.data;
  } catch (error) {
    console.error(`Failed to fetch category ${id}:`, error);
    throw error;
  }
};

/**
 * Create a new category (Admin only)
 */
export const createCategory = async (data: CreateCategoryData): Promise<Category> => {
  try {
    const response = await api.post<ApiResponse<Category>>("/categories", data);
    return response.data.data;
  } catch (error) {
    console.error("Failed to create category:", error);
    throw error;
  }
};

/**
 * Update a category (Admin only)
 */
export const updateCategory = async (id: number, data: UpdateCategoryData): Promise<void> => {
  try {
    await api.put(`/categories/${id}`, data);
  } catch (error) {
    console.error(`Failed to update category ${id}:`, error);
    throw error;
  }
};

/**
 * Delete a category (Admin only)
 */
export const deleteCategory = async (id: number): Promise<void> => {
  try {
    await api.delete(`/categories/${id}`);
  } catch (error) {
    console.error(`Failed to delete category ${id}:`, error);
    throw error;
  }
};
