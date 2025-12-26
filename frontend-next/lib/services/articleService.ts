import api from "@/lib/api";
import axios from "axios";
import { z } from "zod";

// Zod Schema for Backend Response
const BackendAuthorSchema = z.object({
  id: z.number(),
  username: z.string(),
  role: z.string(),
  email: z.string().optional(), // Backend doesnt send it currently, but good to have
});

const BackendArticleSchema = z.object({
  id: z.number(),
  title: z.string(),
  slug: z.string(),
  content: z.string(),
  thumbnail_url: z.string(),
  is_published: z.boolean(),
  author_id: z.number(),
  author: BackendAuthorSchema,
  created_at: z.string(),
  updated_at: z.string(),
});

type BackendArticle = z.infer<typeof BackendArticleSchema>;

export type Article = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  is_published: boolean;
  published_at: string;
  author_id: number;
  created_at: string;
  updated_at: string;
  author: {
    id: number;
    username: string;
    email: string;
    name: string;
    role: string;
  };
};

export type PaginationMeta = {
  page: number;
  limit: number;
  total_items: number;
  total_pages: number;
  next_page?: number | null;
  prev_page?: number | null;
};

export type PaginatedResponse<T> = {
  items: T[];
  meta: PaginationMeta;
};

function createExcerpt(htmlContent: string, maxLength: number = 150): string {
  if (!htmlContent) return "";
  // Hapus semua tag HTML
  const text = htmlContent.replace(/<[^>]*>/g, "");
  // Potong dan tambahkan ellipsis jika perlu
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
}

/**
 * Transformasi dari format Backend ke format Frontend
 */
function transformArticle(item: BackendArticle): Article {
  return {
    id: item.id,
    slug: item.slug,
    title: item.title,
    excerpt: createExcerpt(item.content),
    content: item.content,
    image: item.thumbnail_url || "/images/placeholder.jpg",
    is_published: item.is_published,
    published_at: item.created_at,
    author_id: item.author_id,
    created_at: item.created_at,
    updated_at: item.updated_at,
    author: {
      id: item.author.id,
      username: item.author.username,
      email: item.author.email || "no-email@provided.com",
      name: item.author.username,
      role: item.author.role,
    },
  };
}

// Zod Schema for API Responses
const ArticleListResponseSchema = z.object({
  status: z.boolean(),
  message: z.string(),
  data: z.array(BackendArticleSchema),
});

const PaginatedArticleResponseSchema = z.object({
  status: z.boolean(),
  message: z.string(),
  data: z.object({
    items: z.array(BackendArticleSchema),
    meta: z.object({
      page: z.number(),
      limit: z.number(),
      total_items: z.number(),
      total_pages: z.number(),
      next_page: z.number().nullable().optional(),
      prev_page: z.number().nullable().optional(),
    }),
  }),
});

const SingleArticleResponseSchema = z.object({
  status: z.boolean(),
  message: z.string(),
  data: BackendArticleSchema,
});

export async function getAllArticles(): Promise<Article[]> {
  try {
    const response = await api.get("/articles");
    // Validate with Zod
    const result = ArticleListResponseSchema.safeParse(response.data);

    if (result.success) {
      return result.data.data.map(transformArticle);
    } else {
      console.error("Zod Validation Failed (getAllArticles):", result.error);
      return [];
    }
  } catch (error) {
    console.error("Failed to fetch articles:", error);
    return [];
  }
}

export async function getPaginatedArticles(
  page: number = 1,
  limit: number = 6
): Promise<PaginatedResponse<Article>> {
  try {
    const response = await api.get(`/articles?page=${page}&limit=${limit}`);

    const result = PaginatedArticleResponseSchema.safeParse(response.data);

    if (result.success) {
      return {
        items: result.data.data.items.map(transformArticle),
        meta: result.data.data.meta,
      };
    } else {
      // Fallback or empty if validation fails
      // But keeping loose parsing for now might be safer if backend is actively changing
      // For now, strict validation logging is good.
      console.error("Zod Validation Failed (getPaginatedArticles):", result.error);

      // Fallback manual check to keep app running if schema slightly mismatches
      const resData = response.data.data;
      if (resData && Array.isArray(resData.items)) {
        // Type assertion as fallback
        return {
          items: (resData.items as BackendArticle[]).map(transformArticle),
          meta: resData.meta as PaginationMeta, // Assert meta type as well
        };
      }
      return { items: [], meta: { page, limit, total_items: 0, total_pages: 0 } };
    }
  } catch (error) {
    console.error("Failed to fetch paginated articles:", error);
    return { items: [], meta: { page, limit, total_items: 0, total_pages: 0 } };
  }
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  try {
    const response = await api.get(`/articles/slug/${slug}`);

    const result = SingleArticleResponseSchema.safeParse(response.data);

    if (result.success) {
      return transformArticle(result.data.data);
    }

    console.error("Zod Validation Failed (getArticleBySlug):", result.error);
    return null;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return null;
    }
    console.error(`Failed to fetch article by slug ${slug}:`, error);
    return null;
  }
}

export interface CreateArticleData {
  title: string;
  content: string;
  image?: string;
  tags?: string[];
  category_id?: number;
  featured?: boolean;
}

export interface UpdateArticleData extends Partial<CreateArticleData> {}

export const createArticle = async (data: CreateArticleData): Promise<BackendArticle> => {
  try {
    const res = await api.post("/articles", data);
    const parsed = SingleArticleResponseSchema.safeParse(res.data);
    if (!parsed.success) {
      console.error("Validation error for create article:", parsed.error);
      throw new Error("Invalid API response format");
    }
    return parsed.data.data;
  } catch (error) {
    console.error("Failed to create article:", error);
    throw error;
  }
};

export const updateArticle = async (
  id: number,
  data: UpdateArticleData
): Promise<BackendArticle> => {
  try {
    const res = await api.put(`/articles/${id}`, data);
    const parsed = SingleArticleResponseSchema.safeParse(res.data);
    if (!parsed.success) {
      console.error("Validation error for update article:", parsed.error);
      throw new Error("Invalid API response format");
    }
    return parsed.data.data;
  } catch (error) {
    console.error("Failed to update article:", error);
    throw error;
  }
};

export const deleteArticle = async (id: number): Promise<boolean> => {
  try {
    await api.delete(`/articles/${id}`);
    return true;
  } catch (error) {
    console.error("Failed to delete article:", error);
    throw error;
  }
};
