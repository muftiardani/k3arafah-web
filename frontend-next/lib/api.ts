import axios from "axios";
import { useUIStore } from "@/store/useUIStore";
import { BACKEND_API_URL } from "@/lib/config";
import { toast } from "sonner";

const IS_SERVER = typeof window === "undefined";

// Use absolute URL on Server (Backend Direct), Relative Proxy on Client
const API_URL = IS_SERVER ? BACKEND_API_URL : "/api";

export type ApiResponse<T = unknown> = {
  status: number;
  message: string;
  data: T;
};

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Helper to get CSRF Token
export const fetchCsrfToken = async () => {
  if (IS_SERVER) return null; // No CSRF handling mostly needed server-to-server or handled via cookie forwarding
  try {
    const res = await api.get("/csrf");
    return res.data.csrf_token;
  } catch (e) {
    console.error("Failed to fetch CSRF token", e);
    return null;
  }
};

// Request interceptor
api.interceptors.request.use(
  async (config) => {
    if (!IS_SERVER) {
      useUIStore.getState().setLoading(true);

      // CSRF token injection for mutating requests
      if (["post", "put", "delete", "patch"].includes(config.method?.toLowerCase() || "")) {
        if (!config.headers["X-CSRF-TOKEN"]) {
          const token = await fetchCsrfToken();
          if (token) {
            config.headers["X-CSRF-TOKEN"] = token;
            config.withCredentials = true;
          }
        }
      }
    }
    return config;
  },
  (error) => {
    if (!IS_SERVER) {
      useUIStore.getState().setLoading(false);
    }
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    if (!IS_SERVER) {
      useUIStore.getState().setLoading(false);
    }
    return response;
  },
  async (error) => {
    if (!IS_SERVER) {
      useUIStore.getState().setLoading(false);

      const originalRequest = error.config;
      const status = error.response?.status;

      // Handle Rate Limit (429)
      if (status === 429) {
        toast.error("Terlalu banyak permintaan", {
          description: "Mohon tunggu beberapa saat sebelum mencoba lagi.",
          duration: 5000,
        });
        return Promise.reject(error);
      }

      // Handle CSRF Token Miss (403 usually from gin-csrf)
      if (status === 403 && !originalRequest._retry) {
        originalRequest._retry = true;
        const newToken = await fetchCsrfToken();
        if (newToken) {
          api.defaults.headers.common["X-CSRF-TOKEN"] = newToken;
          originalRequest.headers["X-CSRF-TOKEN"] = newToken;
          return api(originalRequest);
        }
      }

      // Handle 401 globally by redirecting to /login
      if (status === 401) {
        window.location.href = "/login";
      }

      // Handle 500 Server Error
      if (status >= 500) {
        toast.error("Terjadi kesalahan server", {
          description: "Silakan coba lagi nanti.",
          duration: 5000,
        });
      }
    }
    return Promise.reject(error);
  }
);

export default api;
