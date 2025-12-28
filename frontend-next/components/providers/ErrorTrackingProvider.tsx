"use client";

import { useEffect } from "react";
import { initErrorTracking, setTags } from "@/lib/error-tracking";
import { useAuthStore } from "@/store/useAuthStore";
import { setUser, clearUser } from "@/lib/error-tracking";

/**
 * Error Tracking Provider
 *
 * Initializes error tracking on mount and syncs user context with auth state.
 */
export function ErrorTrackingProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoggedIn } = useAuthStore();

  // Initialize error tracking on mount
  useEffect(() => {
    initErrorTracking();

    // Set environment tags
    setTags({
      environment: process.env.NODE_ENV || "development",
      version: process.env.NEXT_PUBLIC_APP_VERSION || "1.0.0",
    });
  }, []);

  // Sync user context with auth state
  useEffect(() => {
    if (isLoggedIn && user) {
      setUser({
        id: String(user.id),
        username: user.username,
      });
    } else {
      clearUser();
    }
  }, [isLoggedIn, user]);

  return <>{children}</>;
}
