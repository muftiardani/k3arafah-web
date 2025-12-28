import { env } from "./env";

/**
 * Backend API URL - use validated environment variable
 */
export const BACKEND_API_URL = env.NEXT_PUBLIC_API_URL;

/**
 * App URL - use validated environment variable
 */
export const APP_URL = env.NEXT_PUBLIC_APP_URL;

/**
 * Server-side Backend API URL
 */
export const SERVER_API_URL = env.BACKEND_API_URL;

/**
 * Is production environment
 */
export { isProduction, isDevelopment, isTest } from "./env";
