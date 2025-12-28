import { z } from "zod";

/**
 * Environment variable schema with Zod validation
 * This ensures all required environment variables are present and correctly typed
 */
const envSchema = z.object({
  // Public environment variables (exposed to client)
  NEXT_PUBLIC_API_URL: z
    .string()
    .url("NEXT_PUBLIC_API_URL must be a valid URL")
    .optional()
    .default("http://localhost:8080/api"),

  NEXT_PUBLIC_APP_URL: z
    .string()
    .url("NEXT_PUBLIC_APP_URL must be a valid URL")
    .optional()
    .default("http://localhost:3000"),

  // Server-only environment variables
  BACKEND_API_URL: z
    .string()
    .url("BACKEND_API_URL must be a valid URL")
    .optional()
    .default("http://localhost:8080/api"),

  // Node environment
  NODE_ENV: z.enum(["development", "production", "test"]).optional().default("development"),
});

/**
 * Parse and validate environment variables
 * Will throw an error at startup if validation fails
 */
function validateEnv() {
  const parsed = envSchema.safeParse({
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    BACKEND_API_URL: process.env.BACKEND_API_URL,
    NODE_ENV: process.env.NODE_ENV,
  });

  if (!parsed.success) {
    console.error("❌ Invalid environment variables:");
    console.error(parsed.error.flatten().fieldErrors);

    // In production, throw to prevent app from starting with bad config
    if (process.env.NODE_ENV === "production") {
      throw new Error("Invalid environment variables");
    }
  }

  return parsed.data ?? envSchema.parse({});
}

/**
 * Validated environment configuration
 * Use this instead of accessing process.env directly
 */
export const env = validateEnv();

/**
 * Type-safe environment variable access
 */
export type Env = z.infer<typeof envSchema>;

/**
 * Helper to check if running in production
 */
export const isProduction = env.NODE_ENV === "production";

/**
 * Helper to check if running in development
 */
export const isDevelopment = env.NODE_ENV === "development";

/**
 * Helper to check if running in test
 */
export const isTest = env.NODE_ENV === "test";
