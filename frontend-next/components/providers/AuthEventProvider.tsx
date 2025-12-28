"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { useQueryClient } from "@tanstack/react-query";

/**
 * AuthEventProvider
 *
 * Listens for the 'auth:logout' custom event dispatched by the auth interceptor
 * when token refresh fails. This ensures the app state is cleaned up and user
 * is redirected to login regardless of where they are in the app.
 */
export function AuthEventProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);
  const queryClient = useQueryClient();

  useEffect(() => {
    const handleAuthLogout = () => {
      console.log("[AuthEventProvider] Received auth:logout event");

      // Clear Zustand auth state
      logout();

      // Clear all React Query cached data
      queryClient.clear();

      // Redirect to login
      router.push("/login");
    };

    // Listen for auth:logout event from authService interceptor
    window.addEventListener("auth:logout", handleAuthLogout);

    return () => {
      window.removeEventListener("auth:logout", handleAuthLogout);
    };
  }, [logout, queryClient, router]);

  return <>{children}</>;
}
