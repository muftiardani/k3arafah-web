import axios from "axios";

// Point to Next.js API Routes (Proxy)
const API_URL = "/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Optional: Handle 401 globally by redirecting to /login
    if (error.response?.status === 401 && typeof window !== "undefined") {
      window.location.href = "/admin/login";
    }
    return Promise.reject(error);
  }
);

export default api;
