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

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Only toggle global loading spinner on Client Side
    if (!IS_SERVER) {
      useUIStore.getState().setLoading(true);
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
  (error) => {
    if (!IS_SERVER) {
      useUIStore.getState().setLoading(false);
      // Optional: Handle 401 globally by redirecting to /login
      if (error.response && error.response.status === 401) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
