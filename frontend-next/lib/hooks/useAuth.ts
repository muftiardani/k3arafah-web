import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuthStore } from "@/store/useAuthStore";
import { login as loginApi, logout as logoutApi, User } from "@/lib/services/authService";

/**
 * Query key factory for auth
 */
export const authKeys = {
  all: ["auth"] as const,
  user: () => [...authKeys.all, "user"] as const,
};

/**
 * Login credentials interface
 */
interface LoginCredentials {
  username: string;
  password: string;
}

/**
 * Hook for user login with React Query mutation
 */
export function useLogin() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const storeLogin = useAuthStore((state) => state.login);

  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      // Pass credentials directly - backend expects username
      const user = await loginApi(credentials);
      return user;
    },
    onSuccess: (user: User) => {
      // Update Zustand store with user data
      storeLogin({
        id: user.id,
        username: user.username,
        role: user.role,
      });

      // Invalidate auth queries
      queryClient.invalidateQueries({ queryKey: authKeys.all });

      toast.success("Login berhasil!");
      router.push("/dashboard");
    },
    onError: (error: Error) => {
      toast.error("Login gagal: Username atau password salah");
      console.error("Login error:", error);
    },
  });
}

/**
 * Hook for user logout with React Query mutation
 */
export function useLogout() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const storeLogout = useAuthStore((state) => state.logout);

  return useMutation({
    mutationFn: logoutApi,
    onSuccess: () => {
      // Clear Zustand store
      storeLogout();

      // Clear all cached queries
      queryClient.clear();

      toast.success("Logout berhasil!");
      router.push("/login");
    },
    onError: (error: Error) => {
      // Still clear local state even if API call fails
      storeLogout();
      queryClient.clear();

      console.error("Logout error:", error);
      router.push("/login");
    },
  });
}

/**
 * Hook to get current auth state from Zustand
 * Note: Auth state is managed by Zustand with localStorage persistence
 */
export function useAuth() {
  const user = useAuthStore((state) => state.user);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const { mutate: login, isPending: isLoggingIn } = useLogin();
  const { mutate: logout, isPending: isLoggingOut } = useLogout();

  return {
    user,
    isLoggedIn,
    login,
    logout,
    isLoggingIn,
    isLoggingOut,
  };
}

/**
 * Hook to perform programmatic logout (for use with auth:logout event)
 */
export function useForceLogout() {
  const storeLogout = useAuthStore((state) => state.logout);
  const queryClient = useQueryClient();
  const router = useRouter();

  return () => {
    storeLogout();
    queryClient.clear();
    router.push("/login");
  };
}
