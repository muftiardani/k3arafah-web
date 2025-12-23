import axios from "axios";
import { useUIStore } from "@/store/useUIStore";

// Point to Next.js API Routes (Proxy)
const API_URL = "/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    useUIStore.getState().setLoading(true);
    return config;
  },
  (error) => {
    useUIStore.getState().setLoading(false);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    useUIStore.getState().setLoading(false);
    return response;
  },
  (error) => {
    useUIStore.getState().setLoading(false);
    // Optional: Handle 401 globally by redirecting to /login
    window.location.href = "/login";
    return Promise.reject(error);
  }
);

export default api;
