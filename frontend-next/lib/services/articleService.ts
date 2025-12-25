import api from "@/lib/api";
import axios from "axios";
import { notFound } from "next/navigation";

// Tipe data sesuai response JSON dari Backend Go
type BackendArticle = {
  id: number;
  title: string;
  slug: string;
  content: string;
  thumbnail_url: string;
  is_published: boolean;
  author_id: number;
  author: {
    id: number;
    username: string;
    role: string;
  };
  created_at: string;
  updated_at: string;
};

// Tipe data yang digunakan oleh UI Frontend
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
};

export type PaginatedResponse<T> = {
  items: T[];
  meta: PaginationMeta;
};

/**
 * Helper untuk membersihkan tag HTML dan memotong text untuk excerpt
 */
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
    image: item.thumbnail_url || "/images/placeholder.jpg", // Fallback image
    is_published: item.is_published,
    published_at: item.created_at, // Menggunakan created_at sebagai published_at
    author_id: item.author_id,
    created_at: item.created_at,
    updated_at: item.updated_at,
    author: {
      id: item.author.id,
      username: item.author.username,
      email: "no-email@provided.com", // Backend User struct tidak mengirim email
      name: item.author.username, // Gunakan username sebagai nama tampilan
      role: item.author.role,
    },
  };
}

export async function getAllArticles(): Promise<Article[]> {
  try {
    const response = await api.get("/articles");
    // Asumsi response backend: { status: true, message: "...", data: [...] }
    if (response.data && Array.isArray(response.data.data)) {
      return response.data.data.map(transformArticle);
    }
    return [];
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
    const resData = response.data.data;

    if (resData && Array.isArray(resData.items)) {
      return {
        items: resData.items.map(transformArticle),
        meta: resData.meta,
      };
    }
    // Fallback if structure mismatch
    return { items: [], meta: { page, limit, total_items: 0, total_pages: 0 } };
  } catch (error) {
    console.error("Failed to fetch paginated articles:", error);
    return { items: [], meta: { page, limit, total_items: 0, total_pages: 0 } };
  }
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  try {
    const response = await api.get(`/articles/slug/${slug}`);
    if (response.data && response.data.data) {
      return transformArticle(response.data.data);
    }
    return null;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return null;
    }
    console.error(`Failed to fetch article by slug ${slug}:`, error);
    return null;
  }
}
