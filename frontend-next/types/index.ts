export interface User {
  id: number;
  username: string;
  created_at: string;
  updated_at: string;
}

export interface Article {
  id: number;
  title: string;
  slug: string;
  content: string;
  thumbnail_url: string;
  is_published: boolean;
  author_id: number;
  author?: User;
  created_at: string;
  updated_at: string;
}

export type SantriStatus = "PENDING" | "VERIFIED" | "ACCEPTED" | "REJECTED";

export interface Santri {
  id: number;
  full_name: string;
  nik: string;
  birth_place: string;
  birth_date: string;
  gender: string;
  address: string;
  parent_name: string;
  parent_phone: string;
  status: SantriStatus;
  created_at: string;
  updated_at: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}

export interface LoginResponse {
  token: string;
  user: {
    username: string;
    id: number;
  };
}
