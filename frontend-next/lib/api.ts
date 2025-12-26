import axios from "axios";
import { useUIStore } from "@/store/useUIStore";
import { BACKEND_API_URL } from "@/lib/config";

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
    // Only toggle global loading spinner on Client Side
    if (!IS_SERVER) {
      useUIStore.getState().setLoading(true);

      // CSRF Injection for mutating requests
      if (["post", "put", "delete", "patch"].includes(config.method?.toLowerCase() || "")) {
        // We might need to fetch token first if not present
        // ideally, we store it in a variable or just fetch it once.
        // For simplicity and robustness given the backend setup:
        // Let's try to get it from a cookie or just fetch it if needed.
        // BUT fetching it async here might delay every request.
        // A common pattern with gin-csrf (and how browsers work) is:
        // Accessing /csrf sets the cookie ? verify backend.
        // Backend: c.JSON(200, gin.H{"csrf_token": csrf.GetToken(c)})
        // So we need to put this token in the header.

        // Let's assume the app calls fetchCsrfToken once on mount (e.g. in layout or provider)
        // OR we fetch it on-demand here.

        // Optimisation: Store in memory?
        // For now, let's fetch it if not in headers.
        if (!config.headers["X-CSRF-TOKEN"]) {
          // Note: This could cause a request loop if /csrf itself needs protection (it usually doesnt)
          const token = await fetchCsrfToken();
          if (token) {
            config.headers["X-CSRF-TOKEN"] = token;
            // Also ensure credentials (cookies) are sent
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

      // Handle CSRF Token Miss (403 usually from gin-csrf)
      if (error.response?.status === 403 && !originalRequest._retry) {
        originalRequest._retry = true;
        const newToken = await fetchCsrfToken();
        if (newToken) {
          api.defaults.headers.common["X-CSRF-TOKEN"] = newToken;
          originalRequest.headers["X-CSRF-TOKEN"] = newToken;
          return api(originalRequest);
        }
      }

      // Optional: Handle 401 globally by redirecting to /login
      if (error.response && error.response.status === 401) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
