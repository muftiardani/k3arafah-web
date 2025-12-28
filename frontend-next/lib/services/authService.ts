import axios from "axios";
import { BACKEND_API_URL } from "@/lib/config";

const API_URL = BACKEND_API_URL;

export interface User {
  id: number;
  username: string;
  role: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  status: boolean;
  message: string;
  data: {
    user: User;
    access_token: string;
    refresh_token: string;
    expires_in: number;
  };
}

export interface RefreshResponse {
  success: boolean;
  message: string;
}

// Axios instance with credentials for HttpOnly cookies
const authApi = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Token refresh state
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: Error | null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};

// Response interceptor for auto-refresh
authApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Skip refresh for auth endpoints
    const authEndpoints = ["/login", "/logout", "/refresh", "/csrf"];
    const isAuthEndpoint = authEndpoints.some((ep) => originalRequest?.url?.includes(ep));

    if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => authApi(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await refreshToken();
        processQueue(null);
        return authApi(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError as Error);
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("auth:logout"));
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

/**
 * Login user
 */
export async function login(credentials: LoginCredentials): Promise<User> {
  // Get CSRF token first
  const csrfToken = await getCSRFToken();

  const response = await authApi.post<LoginResponse>("/login", credentials, {
    headers: {
      "X-CSRF-TOKEN": csrfToken,
    },
  });
  return response.data.data.user;
}

/**
 * Logout user
 */
export async function logout(): Promise<void> {
  await authApi.post("/logout");
}

/**
 * Refresh access token using refresh token cookie
 */
export async function refreshToken(): Promise<void> {
  await authApi.post<RefreshResponse>("/refresh");
}

/**
 * Get CSRF token
 */
export async function getCSRFToken(): Promise<string> {
  const response = await authApi.get<{ csrf_token: string }>("/csrf");
  return response.data.csrf_token;
}

/**
 * Check if user is authenticated (by trying to access protected route)
 */
export async function checkAuth(): Promise<User | null> {
  try {
    // Try to get dashboard stats as auth check
    const response = await authApi.get("/dashboard/stats");
    // If successful, user is authenticated
    // The user data should be stored in zustand from login
    return null; // Caller should get user from store
  } catch {
    return null;
  }
}

/**
 * Create admin (super_admin only)
 */
export async function createAdmin(data: { username: string; password: string }): Promise<User> {
  const response = await authApi.post<{ success: boolean; data: User }>("/admins", data);
  return response.data.data;
}

/**
 * Get all admins (super_admin only)
 */
export async function getAllAdmins(): Promise<User[]> {
  const response = await authApi.get<{ success: boolean; data: User[] }>("/admins");
  return response.data.data;
}

/**
 * Delete admin (super_admin only)
 */
export async function deleteAdmin(id: number): Promise<void> {
  await authApi.delete(`/admins/${id}`);
}

// Export the configured axios instance for use in other services
export { authApi };
